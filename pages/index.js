import { useState, useRef, useEffect } from "react";
import Head from "next/head";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      type: "ai",
      text: "👋 Welcome to ASKAI\nYour intelligent assistant for learning, productivity, and coding.",
    },
  ]);
  const [input, setInput] = useState("");
  const chatRef = useRef();

  const [openCourses, setOpenCourses] = useState(false);
  const [openYear, setOpenYear] = useState(null);

  const courses = {
    "Freshman 1": [
      "Computer Basics",
      "Digital Literacy",
      "Intro to Programming (Python)",
    ],
    "Freshman 2": ["Web Development (HTML, CSS, JS)", "Discrete Math"],
    Sophomore: ["Data Structures", "Algorithms", "Databases"],
    Junior: ["Operating Systems", "Software Engineering", "Computer Networks"],
    Senior: ["AI & Machine Learning", "Cybersecurity", "Final Year Projects"],
  };

  const sendMessage = async (msg) => {
    if (!msg?.trim()) return;

    const newMessages = [...messages, { type: "user", text: msg }];
    setMessages(newMessages);

    const lowerMsg = msg.toLowerCase();

    // ✅ FIXED creator response (NO MORE CONTRADICTION)
    if (
      lowerMsg.includes("who created you") ||
      lowerMsg.includes("who made you") ||
      lowerMsg.includes("who is your creator") ||
      lowerMsg.includes("who is your owner")
    ) {
      const response = `
<div>
  <p>
    I am <strong>ASKAI</strong>, an AI-powered application built and deployed by 
    <strong>Akin S. Sokpah</strong> from Liberia 🇱🇷.
  </p>
  <p>
    My AI capabilities are powered by <strong>OpenAI technology</strong>.
  </p>

  <p>
    💬 <a href="https://wa.me/231777789356" target="_blank"
    style="color:white;background:#25D366;padding:6px 12px;border-radius:6px;text-decoration:none;">
    Message Akin on WhatsApp
    </a>
  </p>

  <p>
    📘 <a href="https://www.facebook.com/profile.php?id=61583456361691" target="_blank"
    style="color:white;background:#1877F2;padding:6px 12px;border-radius:6px;text-decoration:none;">
    Follow on Facebook / Hire for websites
    </a>
  </p>
</div>
      `;
      setMessages([...newMessages, { type: "ai", text: response, isHTML: true }]);
      return;
    }

    // Default AI API
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });

      const data = await res.json();
      setMessages([...newMessages, { type: "ai", text: data.message }]);
    } catch (err) {
      setMessages([...newMessages, { type: "ai", text: "❌ Error contacting AI." }]);
    }
  };

  useEffect(() => {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const toggleMenu = () => {
    const menu = document.getElementById("menu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  };

  return (
    <>
      <Head>
        <meta
          name="google-site-verification"
          content="Xph8kvaL-aAkTHe30pd74SqDHgdUFGDx7p3TLie_LTI"
        />

        <title>ASKAI – AI Chat & Learning Assistant</title>
        <meta
          name="description"
          content="ASKAI lets you chat with AI, learn computer science courses, download Android apps, and access SMYTHE University iPortal."
        />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="app">
        <div className="header">
          <h1>ASKAI</h1>
          <div className="menu-btn" onClick={toggleMenu}>☰</div>
        </div>

        <div className="chat" ref={chatRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`msg ${msg.type}`}>
              {msg.isHTML ? (
                <div dangerouslySetInnerHTML={{ __html: msg.text }} />
              ) : (
                msg.text.split("\n").map((line, i) => <div key={i}>{line}</div>)
              )}
            </div>
          ))}
        </div>

        <div className="input">
          <textarea
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              !e.shiftKey &&
              (e.preventDefault(), sendMessage(input), setInput(""))
            }
          />
          <button onClick={() => { sendMessage(input); setInput(""); }}>Send</button>
        </div>

        {/* ✅ FIXED FOOTER */}
        <div className="footer">
          ASKAI built by <strong>Akin S. Sokpah</strong> 🇱🇷 | Powered by OpenAI |{" "}
          <a
            href="https://www.facebook.com/profile.php?id=61583456361691"
            target="_blank"
          >
            Facebook
          </a>
        </div>
      </div>
    </>
  );
}
