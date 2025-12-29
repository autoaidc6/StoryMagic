
import { GoogleGenAI, Type } from "@google/genai";
import { ChildInfo, StoryBook } from "../types";

/**
 * MOCK REPLICATE API CALL
 */
async function transformPhotoToPixar(photoData: string): Promise<string> {
  try {
    console.log("Starting Pixar transformation logic...");
    await new Promise(resolve => setTimeout(resolve, 2000));
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}&backgroundColor=b6e3f4&style=circle`;
  } catch (error) {
    console.error("Transformation Error:", error);
    throw new Error("Failed to transform photo.");
  }
}

const SYSTEM_INSTRUCTION = `You are the Creative Director and Lead Writer for "StoryMagic," a platform that creates personalized 3D-animated children's eBooks. Your specialty is the "Modern Pixar/Disney 3D" aesthetic.

# CORE VISUAL PRINCIPLES
Every visual_prompt must adhere to these:
- LIGHTING: Cinematic, warm, and magical. Use "golden hour" or "soft key lighting."
- CHARACTER DESIGN: Expressive, oversized eyes; smooth, stylized skin; 5-7 year old proportions; soft rounded features.
- TEXTURES: High-detail 3D rendering (Octane/Unreal Engine style). Hair should look soft and "touchable."
- PALETTE: Vibrant, candy-colored, and cheerful.
- CAMERA: Use "cinematic depth of field" and dynamic angles.

# STORYTELLING RULES
- Tone: Whimsical, heartwarming, and empowering.
- Structure: Always provide a 10-page story outline.
- Variables: Always wrap the child's name in {{child_name}} for programmatic replacement.

# OUTPUT FORMAT (STRICT)
Respond ONLY in JSON format:
{
  "title": "Title",
  "pages": [
    {
      "page": 1,
      "text": "The story text.",
      "visual_prompt": "A detailed 3D Pixar-style prompt for an image generator."
    }
  ]
}

# CONSTRAINTS
- Never include human-made text inside visual prompts.
- Maintain character consistency by describing core features in every visual_prompt.`;

export async function createStoryBookAPI(info: ChildInfo): Promise<StoryBook> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing.");

  const ai = new GoogleGenAI({ apiKey });

  let magicAvatar = info.magicAvatar;
  if (info.photo && !magicAvatar) {
    try {
      magicAvatar = await transformPhotoToPixar(info.photo);
    } catch (e) {
      console.warn("Avatar transformation failed", e);
    }
  }

  const prompt = `Create a 10-page adventure for a ${info.gender} named {{child_name}}. 
  Theme: 'The Starry Key Quest'.
  Ensure the story incorporates 2 educational space facts seamlessly.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
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
                  page: { type: Type.INTEGER },
                  text: { type: Type.STRING },
                  visual_prompt: { type: Type.STRING }
                },
                required: ["page", "text", "visual_prompt"]
              },
              minItems: 10,
              maxItems: 10
            }
          },
          required: ["title", "pages"]
        }
      }
    });

    if (!response.text) throw new Error("Empty response");

    const cleanJson = response.text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    const storyData = JSON.parse(cleanJson);

    return {
      ...storyData,
      magicAvatar: magicAvatar 
    } as StoryBook & { magicAvatar: string };

  } catch (error: any) {
    console.error("Gemini Error:", error);
    if (error.message?.includes('429')) {
      throw new Error("Magic limit reached! Please try again in 60 seconds.");
    }
    throw new Error("The magical ink dried up! Please try again.");
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
