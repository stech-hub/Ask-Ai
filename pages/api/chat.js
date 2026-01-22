// pages/api/chat.js
import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OpenAI API key not found in environment!");
    return res.status(500).json({ message: "⚠️ OpenAI API key not configured." });
  }

  const configuration = new Configuration({ apiKey });
  const openai = new OpenAIApi(configuration);

  try {
    const userMessage = req.body.message?.trim();
    if (!userMessage) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Always send a simple chat history with just the user's message
    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 800,
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
