
import { GoogleGenAI, Type } from "@google/genai";
import { Medium, Reason, Tone, ScriptResponse } from "../types";

export async function generateNoScript(
  category: string,
  medium: Medium,
  reason: Reason,
  tone: Tone
): Promise<ScriptResponse> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Generate a creative and effective response to say "no" or decline a request.
  
  Context:
  - Audience/Context: India (use natural Indian English, polite and professional)
  - Target Topic: ${category}
  - Delivery Medium: ${medium}
  - Reason for declining: ${reason}
  - Selected Tone: ${tone}
  
  Requirements:
  1. Use natural Indian English. Avoid "hard English" or overly complex/archaic Western idioms. Keep it simple, clear, and culturally appropriate for India.
  2. Use placeholders {{name}} and {{task}} where appropriate.
  3. Tone-specific rules:
     - "Professional": Standard, polite, and direct.
     - "Sarcastic": Witty but safe for Indian social circles. Use light "desi" humor if it fits the medium.
     - "Senior Level": You are addressing someone SENIOR to you (a boss, an elder, or a superior). Be extremely respectful, use polite honorifics if implied, and acknowledge the importance of their request before declining with a soft but firm reason.
  4. Provide a famous person or archetype as "Inspiration" relevant to the style (e.g., Ratan Tata, Sudha Murty, or a polite HR Manager).
  
  Return the result in JSON format.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          text: {
            type: Type.STRING,
            description: 'The actual text of the decline message with placeholders.',
          },
          inspiration: {
            type: Type.STRING,
            description: 'The name of a famous person who might say no this way.',
          },
        },
        required: ["text", "inspiration"],
      },
    },
  });

  try {
    const data = JSON.parse(response.text || '{}');
    return {
      text: data.text || "I'm afraid I won't be able to help with {{task}} right now, {{name}}.",
      inspiration: data.inspiration || "A polite professional",
    };
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    return {
      text: "Error generating response. Please try again.",
      inspiration: "Error",
    };
  }
}
