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
    const lowerMsg = userMessage.toLowerCase();

    // --- Live Data Handling ---
    const liveKeywords = [
      "current president", "who is the president",
      "latest news", "today", "current",
      "scholarship", "competition", "hackathon",
      "job opportunities", "visa", "travel", "internship"
    ];

    const needsLive = liveKeywords.some(keyword => lowerMsg.includes(keyword));

    if (needsLive) {
      try {
        // Wikipedia for facts like presidents, current topics
        const wikiRes = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(userMessage)}`
        );
        if (wikiRes.ok) {
          const wikiData = await wikiRes.json();
          if (wikiData.extract) liveInfo = wikiData.extract;
        }
      } catch (wikiErr) {
        console.warn("Wikipedia fetch failed:", wikiErr.message);
      }

      // Add sample live scholarships (could be replaced with API)
      if (lowerMsg.includes("scholarship")) {
        liveInfo += "\n\nSample Free Scholarships:\n- Chevening Scholarships (UK)\n- Erasmus Mundus (EU)\n- MasterCard Foundation Scholars Program (Africa)\nCheck official sites for application details.";
      }

      // Add sample live competitions/hackathons
      if (lowerMsg.includes("competition") || lowerMsg.includes("hackathon")) {
        liveInfo += "\n\nUpcoming Global Competitions:\n- Google Code-in\n- HackMIT\n- Kaggle Competitions\nVisit official sites for deadlines.";
      }

      // Add sample jobs (could later fetch from free job APIs)
      if (lowerMsg.includes("job opportunities")) {
        liveInfo += "\n\nPopular Job Platforms:\n- LinkedIn Jobs\n- Indeed\n- Glassdoor\n- RemoteOK (remote jobs for global applicants)";
      }
    }

    // --- OpenAI Prompt ---
    const messages = [
      { role: "system", content: "You are a helpful AI assistant for students, learning, scholarships, competitions, and general info." },
      { role: "user", content: userMessage + (liveInfo ? `\n\nUse this live info to answer: ${liveInfo}` : "") }
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
