// pages/api/chat.js
import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OpenAI API key not found!");
    return res.status(500).json({ message: "⚠️ OpenAI API key not configured." });
  }

  const openai = new OpenAI({ apiKey });

  try {
    const userMessage = req.body.message;
    if (!userMessage || typeof userMessage !== "string") {
      return res.status(400).json({ message: "Message is required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: userMessage }],
      temperature: 0.7,
      max_tokens: 800,
    });

    const aiMessage = completion.choices[0]?.message?.content;

    if (!aiMessage) throw new Error("OpenAI returned empty response");

    res.status(200).json({ message: aiMessage });
  } catch (err) {
    console.error("OpenAI API error:", err?.response?.data || err.message);
    res.status(500).json({ message: "⚠️ AI is temporarily unavailable. Please try again later." });
  }
}
