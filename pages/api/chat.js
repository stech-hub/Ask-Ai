import OpenAI from "openai";

export const config = {
  api: {
    bodyParser: true,
  },
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 20000, // 20 seconds timeout
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ message: "Message is required" });
    }

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content: `
You are ASKAI — an intelligent, accurate, and responsible AI assistant for learning, coding, productivity, scholarships, jobs, Liberia resources, and global current events.

IMPORTANT GUIDELINES:
- You do NOT have live access to the internet.
- For questions about current leaders, politics, events, or rapidly changing information:
  • Preface your answer with “As of my latest available information”.
  • Provide the best answer you have and encourage the user to verify with a reliable recent source.
- Liberia-specific known facts:
  • The current President of Liberia (as of the latest available information) is Joseph Nyuma Boakai, who took office on January 22, 2024.

Your goal is to be clear, honest, and helpful.
          `,
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_output_tokens: 500,
    });

    // reply text
    const text = response.output_text || "Sorry, I couldn't generate a response.";

    return res.status(200).json({ message: text });

  } catch (error) {
    console.error("OpenAI API Error:", error);
    return res.status(500).json({ message: "⚠️ AI service temporarily unavailable. Please try again later." });
  }
}
