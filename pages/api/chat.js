import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4.1-mini",
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const aiMessage = response.data.choices[0].message.content;
    res.status(200).json({ message: aiMessage });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: "OpenAI API error" });
  }
}
