
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { ChildInfo, StoryBook } from "../types";

// Safe helper to initialize the AI client
const getAI = () => {
  const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

export async function generatePersonalizedStory(info: ChildInfo): Promise<StoryBook> {
  const ai = getAI();
  // Using a placeholder {NAME} to allow for client-side dynamic injection as requested
  const prompt = `Create a magical 10-page children's adventure story for a ${info.gender} named ${info.name}. 
  The theme should be 'The Starry Key Quest'. 
  Use the placeholder '{NAME}' whenever referring to the child in the story text.
  Include 2-3 fun, real-world educational facts about stars or space integrated into the story.
  
  Return a JSON object with:
  - title: A catchy book title (can contain {NAME}).
  - pages: Array of 10 objects, each with 'pageNumber', 'content' (max 3 sentences), and 'illustrationPrompt' (a descriptive scene for an illustrator).`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          pages: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                pageNumber: { type: Type.INTEGER },
                content: { type: Type.STRING },
                illustrationPrompt: { type: Type.STRING }
              },
              required: ["pageNumber", "content", "illustrationPrompt"]
            }
          }
        },
        required: ["title", "pages"]
      }
    }
  });

  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  const sources = groundingChunks?.map((chunk: any) => {
    if (chunk.web) {
      return { uri: chunk.web.uri, title: chunk.web.title };
    }
    return null;
  }).filter((s: any): s is { uri: string; title: string } => !!s && !!s.uri) || [];

  try {
    const text = response.text || '{}';
    const cleanJson = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    const json = JSON.parse(cleanJson);
    return { ...json, sources } as StoryBook;
  } catch (error) {
    console.error("Failed to parse story JSON", error);
    throw new Error("Story generation failed");
  }
}

export async function getChatResponse(message: string, history: { role: string, parts: string }[]) {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "You are 'Magic Mike', the StoryMagic assistant. You help parents brainstorm story ideas and answer questions about the app. Be friendly, whimsical, and helpful. Use emojis! ✨",
    },
  });

  const response = await chat.sendMessage({ message });
  return response.text || "I'm sorry, I'm having trouble thinking of what to say. ✨";
}
