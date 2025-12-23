
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedUI } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

const UI_GENERATION_PROMPT = `
You are Obscura, a world-class senior UI/UX engineer. Your goal is to transform user requirements into stunning, modern, and functional web interfaces.

Rules:
1. Always respond in JSON format matching the schema provided.
2. Use Tailwind CSS for all styling. 
3. The code should be a complete, self-contained HTML structure (wrapped in a div) that uses Tailwind classes. Do not include <head> or <body> tags, just the inner content.
4. Aim for high-end, premium aesthetics: clean typography, sophisticated spacing, subtle shadows, and a logical grid.
5. Provide a clear visual identity description.
6. The interface must be fully responsive.
7. Use high-quality placeholder images from https://picsum.photos/ if needed.

System Identity: You are precise, technical, and futuristic. Use the "Obscura" persona - deep black backgrounds, purple accents, and technical elegance.
`;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Name of the interface" },
    description: { type: Type.STRING, description: "Brief design rationale" },
    code: { type: Type.STRING, description: "Full HTML content with Tailwind classes" },
    framework: { type: Type.STRING, description: "Always 'react-tailwind'" },
    visualIdentity: {
      type: Type.OBJECT,
      properties: {
        primaryColor: { type: Type.STRING },
        secondaryColor: { type: Type.STRING },
        fontFamily: { type: Type.STRING }
      },
      required: ["primaryColor", "secondaryColor", "fontFamily"]
    }
  },
  required: ["title", "description", "code", "framework", "visualIdentity"],
  propertyOrdering: ["title", "description", "code", "framework", "visualIdentity"]
};

export async function generateInterface(prompt: string, history: { role: string, content: string }[]): Promise<GeneratedUI | null> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [
        { role: 'user', parts: [{ text: `${UI_GENERATION_PROMPT}\n\nUser Prompt: ${prompt}\n\nPrevious context if any: ${JSON.stringify(history)}` }] }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        thinkingConfig: { thinkingBudget: 4000 }
      }
    });

    const result = JSON.parse(response.text || "null");
    return result as GeneratedUI;
  } catch (error) {
    console.error("Error generating interface:", error);
    return null;
  }
}
