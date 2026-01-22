// api/chat.js
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ message: "Message is required" });
    }

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `
You are ASKAI, a trusted AI assistant for learning, coding, productivity, and global knowledge.

IMPORTANT RULES:
- You do NOT have live or real-time internet access.
- For current events (politics, leadership, elections, wars, prices, laws):
  • Always say "as of my latest available information".
  • Avoid exact dates unless certain.
  • Encourage users to verify with recent or official sources.

KNOWN FACT (for reference only):
- The President of Liberia is Joseph Nyuma Boakai, who took office in January 2024.

FOCUS:
- Be clear, honest, and helpful.
- Never guess recent political leadership.
- Prioritize accuracy and user trust.
          `,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion.data.choices?.[0]?.message?.content;

    return res.status(200).json({
      message: reply || "⚠️ AI could not generate a response. Please try again.",
    });
  } catch (error) {
    console.error("ASKAI API Error:", error.response?.data || error.message);

    return res.status(500).json({
      message: "⚠️ OpenAI API error. Please try again later.",
    });
  }
}
