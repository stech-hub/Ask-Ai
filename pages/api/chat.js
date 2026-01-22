// pages/api/chat.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Optional: Gemini fallback key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || null;

async function fetchFromOpenAI(message) {
  return await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are ASKAI, an AI assistant for learning, coding, scholarships, jobs, and up-to-date global information."
      },
      { role: "user", content: message }
    ],
    temperature: 0.6
  });
}

// Dummy Gemini fetch example (replace with real API if available)
async function fetchFromGemini(message) {
  if (!GEMINI_API_KEY) throw new Error("Gemini API not configured.");
  // Example structure: simulate similar response
  return { choices: [{ message: { content: "Gemini fallback response: " + message } }] };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    // Try OpenAI first
    const completion = await fetchFromOpenAI(message);
    return res.status(200).json({ message: completion.choices[0].message.content });
  } catch (err) {
    console.error("OpenAI error:", err.message);

    // Fallback to Gemini if configured
    if (GEMINI_API_KEY) {
      try {
        const fallback = await fetchFromGemini(message);
        return res.status(200).json({ message: fallback.choices[0].message.content });
      } catch (gemErr) {
        console.error("Gemini fallback error:", gemErr.message);
      }
    }

    // Final fallback message
    return res.status(500).json({
      message:
        "⚠️ Sorry, AI cannot respond now. We are working on it. Please try again in a few seconds."
    });
  }
}
