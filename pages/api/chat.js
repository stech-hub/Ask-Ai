// pages/api/chat.js
import { Configuration, OpenAIApi } from "openai";
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OpenAI API key missing!");
    return res.status(500).json({ message: "⚠️ OpenAI API key not configured." });
  }

  const configuration = new Configuration({ apiKey });
  const openai = new OpenAIApi(configuration);

  try {
    const userMessage = req.body.message?.trim();
    if (!userMessage) return res.status(400).json({ message: "Message is required" });

    let liveInfo = "";

    // Detect topics needing live info
    const lowerMsg = userMessage.toLowerCase();
    const liveKeywords = [
      "current president",
      "who is the president",
      "latest news",
      "today",
      "current",
      "scholarship",
      "competition",
      "hackathon",
      "job opportunities",
      "visa",
      "travel",
      "internship"
    ];

    const needsLive = liveKeywords.some(keyword => lowerMsg.includes(keyword));

    if (needsLive) {
      try {
        const searchTerm = encodeURIComponent(userMessage);
        const wikiRes = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${searchTerm}`
        );

        if (wikiRes.ok) {
          const wikiData = await wikiRes.json();
          if (wikiData.extract) liveInfo = wikiData.extract;
        }
      } catch (wikiErr) {
        console.warn("Wikipedia fetch failed, continuing safely:", wikiErr.message);
      }
    }

    // Construct OpenAI prompt
    const messages = [
      { role: "system", content: "You are a helpful AI assistant for students and learning." },
      { role: "user", content: userMessage + (liveInfo ? `\n\nUse this info to answer: ${liveInfo}` : "") }
    ];

    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 800,
    });

    const aiMessage = completion.data.choices[0]?.message?.content;
    if (!aiMessage) throw new Error("OpenAI returned empty message");

    res.status(200).json({ message: aiMessage });
  } catch (err) {
    console.error("Chat API error:", err?.response?.data || err.message);
    res.status(500).json({
      message: "⚠️ AI is temporarily unavailable. Please try again later."
    });
  }
}
