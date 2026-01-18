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

    // Custom creator response with buttons
    if (
      lowerMsg.includes("who created you") ||
      lowerMsg.includes("who made you") ||
      lowerMsg.includes("who is your creator") ||
      lowerMsg.includes("who is your owner") ||
      lowerMsg.includes("creator")
    ) {
      const response = `
<div>
  <p>Akin S. Sokpah from Liberia created me 🇱🇷</p>
  <p>
    💬 <a href="https://wa.me/231777789356" target="_blank" style="color:white; background:#25D366; padding:6px 12px; border-radius:6px; text-decoration:none;">Message me on WhatsApp</a>
  </p>
  <p>
    📘 <a href="https://www.facebook.com/profile.php?id=61583456361691" target="_blank" style="color:white; background:#1877F2; padding:6px 12px; border-radius:6px; text-decoration:none;">Follow me on Facebook</a>
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
        <title>ASKAI – Free AI Chat, Learning & Coding Assistant</title>
        <meta
          name="description"
          content="ASKAI lets you chat with AI, learn Computer Science courses, download the Android app, and access SMYTHE University iPortal. Created by Akin S. Sokpah from Liberia."
        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://ask-ai-pied.vercel.app/" />

        {/* Google verification */}
        <meta
          name="google-site-verification"
          content="Xph8kvaL-aAkTHe30pd74SqDHgdUFGDx7p3TLie_LTI"
        />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content="ASKAI – Free AI Assistant for Learning & Coding" />
        <meta property="og:description" content="Chat with AI, access free CS courses, download the ASKAI Android app, and more!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ask-ai-pied.vercel.app/" />
        <meta property="og:image" content="https://ask-ai-pied.vercel.app/askai-social.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ASKAI – Free AI Assistant for Learning & Coding" />
        <meta name="twitter:description" content="Chat with AI, access free CS courses, download the ASKAI Android app, and more!" />
        <meta name="twitter:image" content="https://ask-ai-pied.vercel.app/askai-social.png" />
        <meta name="twitter:site" content="@AkinSokpah" />

        {/* Structured data for APK */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "ASKAI",
              "operatingSystem": "ANDROID",
              "applicationCategory": "Education",
              "url": "https://ask-ai-pied.vercel.app/",
              "downloadUrl": "https://github.com/stech-hub/Ask-Ai/releases/download/askai/app-release.apk"
            }
          `,
          }}
        />
      </Head>

      <div className="app">
        {/* Header */}
        <div className="header">
          <h1>ASKAI</h1>
          <div className="menu-btn" onClick={toggleMenu}>☰</div>
        </div>

        {/* Main Menu */}
        <div className="menu" id="menu" style={{ display: "none" }}>
          <a href="#">🏠 Home</a>
          <a href="https://full-task-ai.vercel.app/" target="_blank">🤖 AI Tools</a>

          <hr />

          {/* Apps */}
          <a href="https://github.com/stech-hub/bionurseapk-website/releases/download/v1/myapp.apk" target="_blank">📱 Download Android App</a>
          <a href="https://github.com/stech-hub/Ask-Ai/releases/download/askai/app-release.apk" target="_blank">📱 Download ASKAI App</a>

          <hr />

          {/* Courses */}
          <a href="#!" onClick={() => setOpenCourses(!openCourses)} style={{ fontWeight: "700" }}>
            🎓 Free CS Courses {openCourses ? "▲" : "▼"}
          </a>
          {openCourses &&
            Object.keys(courses).map((year) => (
              <div key={year} style={{ paddingLeft: "15px" }}>
                <a href="#!" onClick={() => setOpenYear(openYear === year ? null : year)}>
                  {year} {openYear === year ? "▲" : "▼"}
                </a>
                {openYear === year &&
                  courses[year].map((course) => (
                    <a
                      key={course}
                      href="#!"
                      style={{ paddingLeft: "20px", fontSize: "0.9rem" }}
                      onClick={() => sendMessage(`Explain ${course} in simple terms.`)}
                    >
                      {course}
                    </a>
                  ))}
              </div>
            ))}

          <hr />

          {/* Affiliate Programs */}
          <a href="https://jumia.com" target="_blank">💰 Affiliate Programs (Jumia)</a>
          <a href="https://expertnaire.com" target="_blank">💵 Digital Affiliate Marketing</a>

          <hr />

          {/* Scholarships */}
          <a href="https://www.opportunitiesforafricans.com/" target="_blank">🎓 Scholarships for Liberians</a>
          <a href="https://www.studyabroad.com/" target="_blank">✈️ Travel & Study Abroad</a>

          <hr />

          {/* Liberia Services */}
          <a href="https://www.orange.com/lr/" target="_blank">📱 Orange Liberia</a>
          <a href="https://www.lonestarcell.com/" target="_blank">📶 Lonestar MTN Liberia</a>

          <hr />

          {/* Jobs & Freelancing */}
          <a href="https://www.upwork.com/" target="_blank">🌍 Remote Jobs (Upwork)</a>
          <a href="https://www.fiverr.com/" target="_blank">🧑‍💻 Freelancing (Fiverr)</a>

          <hr />

          {/* University */}
          <a href="https://icampus.smythe.telligentgh.com/" target="_blank">🏫 SMYTHE University iPortal</a>

          <hr />

          {/* Contact */}
          <a href="https://wa.me/231777789356" target="_blank" style={{ color: "white", background: "#25D366", padding: "8px 14px", borderRadius: "6px", display: "inline-block", marginBottom: "6px", textDecoration: "none" }}>💬 Contact WhatsApp</a>
          <br />
          <a href="https://www.facebook.com/profile.php?id=61583456361691" target="_blank" style={{ color: "white", background: "#1877F2", padding: "8px 14px", borderRadius: "6px", display: "inline-block", textDecoration: "none" }}>📘 Facebook / Hire Me</a>
        </div>

        {/* Chat */}
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

        {/* Input */}
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

        {/* Footer */}
        <div className="footer">
          Created by <strong>Akin S. Sokpah</strong> from Liberia 🇱🇷 |{" "}
          <a href="https://www.facebook.com/profile.php?id=61583456361691" target="_blank">Facebook</a>
        </div>
      </div>
    </>
  );
}
