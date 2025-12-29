
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
  const prompt = `Write a magical 10-page adventure for a ${info.gender} named ${info.name}. 
  The theme is 'The Starry Key Quest'.
  IMPORTANT: Use the placeholder '{NAME}' whenever referring to the child.
  Ensure the story includes exactly 10 pages and 2 space-related educational facts.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Upgraded to Pro for better instruction following
      contents: prompt,
      config: {
        systemInstruction: "You are a world-class children's book author. You write whimsical, age-appropriate stories and return them in structured JSON format.",
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
                  content: { type: Type.STRING, description: "1-3 sentences of story text." },
                  illustrationPrompt: { type: Type.STRING, description: "A visual description of the scene." }
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
    
    // Provide a more descriptive error if possible
    if (error.message?.includes('429')) {
      throw new Error("Too many requests! Please wait a moment before trying again.");
    } else if (error.message?.includes('400')) {
      throw new Error("Invalid request. Please check the child's name and try again.");
    }
    
    throw new Error("The magical ink dried up! Please check your internet or try a shorter name.");
  }
}

export async function getChatResponse(message: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are 'Magic Mike', a helpful children's book assistant. Keep responses brief and magical! ✨",
    },
  });

  const response = await chat.sendMessage({ message });
  return response.text || "I'm thinking... ✨";
}
