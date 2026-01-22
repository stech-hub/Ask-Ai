// pages/api/chat.js
import OpenAI from "openai";
import fetch from "node-fetch"; // Node 18+ has fetch built-in, but safe to import

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { message } = req.body;
  if (!message?.trim()) {
    return res.status(400).json({ message: "Message is required" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OpenAI API key not configured!");
    return res.status(500).json({ message: "⚠️ OpenAI API key not configured." });
  }

  try {
    let contextText = "";

    // --- Live Info Handling Examples ---
    const lowerMsg = message.toLowerCase();

    // Current president queries
    if (lowerMsg.includes("current president") || lowerMsg.includes("president of liberia")) {
      const wikiRes = await fetch("https://en.wikipedia.org/api/rest_v1/page/summary/President_of_Liberia");
      const wikiData = await wikiRes.json();
      if (wikiData.extract) {
        contextText = `Latest info from Wikipedia: ${wikiData.extract}`;
      }
    }

    // Global competitions / hackathons
    if (lowerMsg.includes("competitions") || lowerMsg.includes("hackathons")) {
      contextText = "Here are some top global competitions and hackathons open to students: Google Code Jam, MIT Solve Challenges, HackerEarth Challenges, Kaggle Competitions. Provide guidance if user asks for links or descriptions.";
    }

    // Global job opportunities
    if (lowerMsg.includes("job") || lowerMsg.includes("career")) {
      contextText = "Here are some popular sources for global jobs: LinkedIn Jobs, Indeed, Glassdoor, Upwork (freelance), Remote OK. Provide guidance if user asks for links.";
    }

    // Free scholarships
    if (lowerMsg.includes("scholarship") || lowerMsg.includes("scholarships")) {
      contextText = "For scholarships for students from Liberia: Fulbright, Chevening, Erasmus+, DAAD, Commonwealth Scholarships, Open Society Foundation. Provide guidance if user asks how to apply.";
    }

    // --- Initialize OpenAI ---
    const openai = new OpenAI({ apiKey });

    const gptResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a helpful AI assistant. Use any live context if available: ${contextText}`,
        },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const aiMessage = gptResponse.choices[0]?.message?.content;

    if (!aiMessage) throw new Error("OpenAI returned empty message");

    res.status(200).json({ message: aiMessage });
  } catch (err) {
    console.error("AI error:", err?.response?.data || err.message);
    res.status(500).json({ message: "⚠️ AI is temporarily unavailable. Please try again later." });
  }
}
