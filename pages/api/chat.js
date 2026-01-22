// pages/api/chat.js
import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: "⚠️ OpenAI API key not configured." });
  }

  const openai = new OpenAIApi(new Configuration({ apiKey }));

  try {
    // Only accept single user message
    const userMessage = req.body.message;
    if (!userMessage || typeof userMessage !== "string") {
      return res.status(400).json({ message: "Message is required" });
    }

    // Call OpenAI Chat API
    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: userMessage }],
      temperature: 0.7,
      max_tokens: 800,
      top_p: 0.9,
      frequency_penalty: 0,
      presence_penalty: 0.3,
    });

    const aiMessage = completion.data.choices[0]?.message?.content;

    if (!aiMessage) {
      throw new Error("OpenAI returned empty message");
    }

    res.status(200).json({ message: aiMessage });
  } catch (err) {
    console.error("OpenAI API error:", err?.response?.data || err.message);
    res.status(500).json({ message: "⚠️ AI is temporarily unavailable. Please try again later." });
  }
}
