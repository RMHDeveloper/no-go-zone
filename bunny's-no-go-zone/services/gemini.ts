
import { Medium, Reason, Tone, ScriptResponse } from "../types";

// Free Models Router: OpenRouter picks an available free model that supports
// the requested features (here: JSON structured outputs). No credits required.
const OPENROUTER_MODEL = "openrouter/free";

export async function generateNoScript(
  category: string,
  medium: Medium,
  reason: Reason,
  tone: Tone,
  signal?: AbortSignal
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

  Respond with ONLY a raw JSON object, nothing before or after it, no markdown code fences.
  "text" MUST be a single plain string (the full message, including any subject line inline). Do NOT nest objects inside "text".
  Shape: {"text": "<the message as one string>", "inspiration": "<person or archetype>"}
  Example: {"text": "Hi {{name}}, thank you for thinking of me for {{task}}. Unfortunately I won't be able to take this on right now.", "inspiration": "A polite HR Manager"}`;

  // Free-router models can be slow; give the request a generous cap and honour
  // any caller-supplied signal (e.g. a stale request cancelled by the UI).
  const timeout = new AbortController();
  const timer = setTimeout(() => timeout.abort(), 60_000);
  if (signal) {
    signal.addEventListener("abort", () => timeout.abort(), { once: true });
  }

  let response: Response;
  try {
    response = await fetch("/api/proxy", {
      method: "POST",
      signal: timeout.signal,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenRouter request failed (${response.status}): ${errorBody}`);
  }

  const result = await response.json();
  const raw: string = (result.choices?.[0]?.message?.content ?? "").trim();

  if (!raw) {
    throw new Error("The AI returned an empty response. Please try again.");
  }

  // Free-router models are inconsistent: they may wrap JSON in ``` fences, add
  // prose around it, nest the message under {subject, body}, or ignore JSON entirely.
  const withoutFences = raw.replace(/```(?:json)?/gi, "").trim();
  const jsonSlice = withoutFences.match(/\{[\s\S]*\}/)?.[0];

  if (jsonSlice) {
    try {
      const data = JSON.parse(jsonSlice);
      const text = flattenMessage(data.text ?? data.body ?? data.message ?? data.script ?? data);
      if (text) {
        return {
          text,
          inspiration:
            (typeof data.inspiration === "string" && data.inspiration.trim()) ||
            "A polite professional",
        };
      }
    } catch {
      // fall through to plain-text handling
    }
  }

  // No usable JSON — the model replied in prose. Use that text directly.
  console.warn("AI response was not usable JSON; using it as plain text.", raw);
  return {
    text: withoutFences,
    inspiration: "A polite professional",
  };
}

/** Coerce whatever shape the model returned for the message into a single string. */
function flattenMessage(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) {
    return value.map(flattenMessage).filter(Boolean).join("\n\n");
  }
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const subject = typeof obj.subject === "string" ? obj.subject.trim() : "";
    const body = flattenMessage(obj.body ?? obj.text ?? obj.message ?? "");
    if (subject || body) {
      return [subject && `Subject: ${subject}`, body].filter(Boolean).join("\n\n");
    }
  }
  return "";
}
