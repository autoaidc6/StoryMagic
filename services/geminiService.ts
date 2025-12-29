
import { GoogleGenAI, Type } from "@google/genai";
import { ChildInfo, StoryBook, ImageSize } from "../types";

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

export async function createStoryBookAPI(info: ChildInfo, theme: string, pageCount: number = 3): Promise<StoryBook> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing.");

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Create a ${pageCount}-page adventure for a ${info.gender} named {{child_name}}. 
  Theme: '${theme}'.
  Ensure the story incorporates 2 educational facts related to the theme.`;

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
              minItems: pageCount,
              maxItems: pageCount
            }
          },
          required: ["title", "pages"]
        }
      }
    });

    if (!response.text) throw new Error("Empty response");
    const cleanJson = response.text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    const storyData = JSON.parse(cleanJson);

    return { ...storyData, theme } as StoryBook;
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw new Error(error.message?.includes('429') ? "Magic limit reached!" : "The magical ink dried up!");
  }
}

export async function generatePageImageAPI(visualPrompt: string, size: ImageSize): Promise<string> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("Please select your own API Key via 'Unlock Pro Magic' in the header first.");

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: `${visualPrompt}. Modern Pixar 3D style, 8k resolution, cinematic lighting, vibrant colors.` }],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: size
        }
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned from model.");
  } catch (error: any) {
    if (error.message?.includes("Requested entity was not found")) {
       // Potential race condition or invalid key, reset or alert
       throw new Error("API Key issue. Please re-select your key.");
    }
    throw error;
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
