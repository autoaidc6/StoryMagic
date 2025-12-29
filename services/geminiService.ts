
import { GoogleGenAI, Type } from "@google/genai";
import { ChildInfo, StoryBook } from "../types";

/**
 * MOCK REPLICATE API CALL
 * This is where you would integrate the Pixar-style face swap.
 * You'd typically use a model like 'tencentarc/photomaker' or 'stability-ai/sdxl'
 */
async function transformPhotoToPixar(photoData: string): Promise<string> {
  try {
    console.log("Starting Pixar transformation logic...");
    
    // --- REPLICATE INTEGRATION PLACEHOLDER ---
    // const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
    // const output = await replicate.run("tencentarc/photomaker-v2:...", { input: { image: photoData, prompt: "a 3d pixar style animated character..." } });
    // return output[0];
    // ------------------------------------------

    // Simulating API latency for the "Magic" effect
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Returning a high-quality mock for now
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}&backgroundColor=b6e3f4&style=circle`;
  } catch (error) {
    console.error("Transformation Error:", error);
    throw new Error("Failed to transform photo. Please try a different image.");
  }
}

/**
 * Logic for generating the 10-page story and character transformation.
 */
export async function createStoryBookAPI(info: ChildInfo): Promise<StoryBook> {
  // Always create a fresh instance with process.env.API_KEY before calling the model
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // 1. Handle Image Transformation first (if photo exists)
  let magicAvatar = info.magicAvatar;
  if (info.photo && !magicAvatar) {
    magicAvatar = await transformPhotoToPixar(info.photo);
  }

  // 2. Construct the Gemini Prompt for 10 pages
  const prompt = `
    Role: Professional Children's Book Author.
    Task: Write a 10-page adventure for a ${info.gender} named ${info.name}.
    Theme: 'The Starry Key Quest'.
    Requirement: Use the token '{NAME}' exactly where the child's name should appear.
    
    Format: Return ONLY a JSON object:
    {
      "title": "A catchy title using {NAME}",
      "pages": [
        {
          "pageNumber": 1,
          "content": "Max 3 whimsical sentences.",
          "illustrationPrompt": "A descriptive scene for a Pixar-style 3D artist."
        },
        ... (exactly 10 pages)
      ]
    }
    
    Include 2 space-related educational facts grounded in real science within the story flow.
  `;

  try {
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
      if (chunk.web) return { uri: chunk.web.uri, title: chunk.web.title };
      return null;
    }).filter((s: any): s is { uri: string; title: string } => !!s && !!s.uri) || [];

    // Correctly using response.text property (not a function)
    const text = response.text || '{}';
    const cleanJson = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    const storyData = JSON.parse(cleanJson);

    return {
      ...storyData,
      sources,
      // Pass back the transformed avatar
      magicAvatar: magicAvatar 
    } as StoryBook & { magicAvatar: string };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("The magical ink dried up! Please try again in a moment.");
  }
}

export async function getChatResponse(message: string) {
  // Always create a fresh instance with process.env.API_KEY before calling the model
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "You are 'Magic Mike', a helpful children's book assistant.",
    },
  });

  // Sending message to the chat session
  const response = await chat.sendMessage({ message });
  // Correctly using response.text property (not a function)
  return response.text || "I'm thinking... ✨";
}
