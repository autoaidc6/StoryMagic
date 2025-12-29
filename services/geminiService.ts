
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { ChildInfo, StoryBook } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generatePersonalizedStory(info: ChildInfo): Promise<StoryBook> {
  const prompt = `Create a magical 10-page children's adventure story for a ${info.gender} named ${info.name}. 
  The theme should be 'The Starry Key Quest'. 
  Include 2-3 fun, real-world educational facts about stars or space integrated into the story.
  
  Return a JSON object with:
  - title: A catchy book title.
  - pages: Array of 10 objects, each with 'pageNumber', 'content' (max 3 sentences), and 'illustrationPrompt' (a descriptive scene for an illustrator).`;

  // We use googleSearch to fulfill the request for real-world educational facts.
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

  // Extract grounding chunks for the required web UI display
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  const sources = groundingChunks?.map((chunk: any) => {
    if (chunk.web) {
      return { uri: chunk.web.uri, title: chunk.web.title };
    }
    return null;
  }).filter((s: any): s is { uri: string; title: string } => !!s && !!s.uri) || [];

  try {
    // Correctly accessing text as a property
    const text = response.text || '{}';
    // Clean potential markdown formatting
    const cleanJson = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    const json = JSON.parse(cleanJson);
    return { ...json, sources } as StoryBook;
  } catch (error) {
    console.error("Failed to parse story JSON", error);
    throw new Error("Story generation failed");
  }
}

export async function getChatResponse(message: string, history: { role: string, parts: string }[]) {
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "You are 'Magic Mike', the StoryMagic assistant. You help parents brainstorm story ideas and answer questions about the app. Be friendly, whimsical, and helpful. Use emojis! ✨",
    },
  });

  // chat.sendMessage only accepts the message parameter
  const response = await chat.sendMessage({ message });
  // response.text is a property, not a method
  return response.text || "I'm sorry, I'm having trouble thinking of what to say. ✨";
}