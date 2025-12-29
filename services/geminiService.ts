
import { GoogleGenAI, Type } from "@google/genai";
import { ChildInfo, StoryBook } from "../types";

/**
 * MOCK REPLICATE API CALL
 * This is where you would integrate the Pixar-style face swap.
 */
async function transformPhotoToPixar(photoData: string): Promise<string> {
  try {
    console.log("Starting Pixar transformation logic...");
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
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure your environment is configured correctly.");
  }

  // Always create a fresh instance
  const ai = new GoogleGenAI({ apiKey });

  // 1. Handle Image Transformation first (if photo exists)
  let magicAvatar = info.magicAvatar;
  if (info.photo && !magicAvatar) {
    try {
      magicAvatar = await transformPhotoToPixar(info.photo);
    } catch (e) {
      console.warn("Avatar transformation failed, continuing without it.", e);
    }
  }

  // 2. Construct the Gemini Prompt
  // Using Flash instead of Pro to avoid quota issues shown in the console logs
  const prompt = `Write a magical 10-page adventure for a ${info.gender} named ${info.name}. 
  The theme is 'The Starry Key Quest'.
  IMPORTANT: Use the placeholder '{NAME}' whenever referring to the child.
  Ensure the story includes exactly 10 pages and 2 space-related educational facts.
  The tone should be whimsical, enchanting, and suitable for a 5-year-old.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Switched from Pro to Flash to resolve 429 quota limits
      contents: prompt,
      config: {
        systemInstruction: "You are a world-class children's book author. You write whimsical, age-appropriate stories and return them in structured JSON format. Output MUST be valid JSON.",
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
                  content: { type: Type.STRING, description: "1-3 whimsical sentences of story text." },
                  illustrationPrompt: { type: Type.STRING, description: "A detailed visual description for a 3D Pixar-style artist." }
                },
                required: ["pageNumber", "content", "illustrationPrompt"]
              },
              minItems: 10,
              maxItems: 10
            }
          },
          required: ["title", "pages"]
        }
      }
    });

    if (!response.text) {
      throw new Error("The model returned an empty response.");
    }

    const cleanJson = response.text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    const storyData = JSON.parse(cleanJson);

    return {
      ...storyData,
      magicAvatar: magicAvatar 
    } as StoryBook & { magicAvatar: string };

  } catch (error: any) {
    console.error("Gemini Story Generation Error Detail:", error);
    
    // Provide a more descriptive error based on the status code seen in the logs
    if (error.message?.includes('429')) {
      throw new Error("The magical ink is currently in high demand! Please try again in 60 seconds (API Quota limit).");
    } else if (error.message?.includes('403')) {
      throw new Error("Access denied. Please check your API key permissions.");
    }
    
    throw new Error("The magical ink dried up! Please try a shorter name or wait a moment.");
  }
}

export async function getChatResponse(message: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview', // Consistency in using the Flash model
    config: {
      systemInstruction: "You are 'Magic Mike', a helpful children's book assistant. Keep responses brief, encouraging, and magical! ✨",
    },
  });

  const response = await chat.sendMessage({ message });
  return response.text || "I'm thinking... ✨";
}
