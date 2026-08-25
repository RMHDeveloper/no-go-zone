
import { Medium, Reason, Tone, ScriptResponse } from "../types";

const OPENROUTER_MODEL = "openai/gpt-4o-mini";

export async function generateNoScript(
  category: string,
  medium: Medium,
  reason: Reason,
  tone: Tone
): Promise<ScriptResponse> {
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

  Respond with ONLY a JSON object of the form {"text": string, "inspiration": string}. Do not include any other text or markdown formatting.`;

  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("An API Key must be set when running in a browser");
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenRouter request failed (${response.status}): ${errorBody}`);
  }

  const result = await response.json();
  const content = result.choices?.[0]?.message?.content ?? "{}";

  try {
    const data = JSON.parse(content);
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
