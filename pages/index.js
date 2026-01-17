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
        {/* Google verification */}
        <meta
          name="google-site-verification"
          content="Xph8kvaL-aAkTHe30pd74SqDHgdUFGDx7p3TLie_LTI"
        />

        {/* SEO */}
        <title>ASKAI – AI Chat & Learning Assistant</title>
        <meta
          name="description"
          content="ASKAI lets you chat with AI, learn computer science courses, download Android apps, and access SMYTHE University iPortal."
        />
        <meta name="robots" content="index, follow" />

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

        {/* Menu */}
        <div className="menu" id="menu">
          <a href="#">🏠 Home</a>
          <a href="https://full-task-ai.vercel.app/" target="_blank">🤖 AI Tools</a>

          {/* Existing App */}
          <a
            href="https://github.com/stech-hub/bionurseapk-website/releases/download/v1/myapp.apk"
            target="_blank"
          >
            📱 Download Android App
          </a>

          {/* New ASKAI App */}
          <a
            href="https://github.com/stech-hub/Ask-Ai/releases/download/askai/app-release.apk"
            target="_blank"
            download
          >
            📱 Download ASKAI App
          </a>

          {/* SMYTHE University iPortal */}
          <a
            href="https://icampus.smythe.telligentgh.com/"
            target="_blank"
          >
            🏫 SMYTHE UNIVERSITY COLLEGE IPORTAL
          </a>

          {/* Contact & Hire Me */}
          <div style={{ paddingTop: "10px", borderTop: "1px solid #eee" }}>
            <a
              href="https://wa.me/231777789356"
              target="_blank"
              style={{ color: "white", background: "#25D366", padding: "8px 14px", borderRadius: "6px", display: "inline-block", marginBottom: "6px", textDecoration: "none" }}
            >
              💬 Contact Me on WhatsApp
            </a>
            <br />
            <a
              href="https://www.facebook.com/profile.php?id=61583456361691"
              target="_blank"
              style={{ color: "white", background: "#1877F2", padding: "8px 14px", borderRadius: "6px", display: "inline-block", textDecoration: "none" }}
            >
              📘 Follow Me on Facebook / Hire Me
            </a>
          </div>

          {/* Dynamic Courses */}
          <div>
            <a
              href="#!"
              onClick={() => setOpenCourses(!openCourses)}
              style={{ fontWeight: "700", display: "block", marginTop: "10px" }}
            >
              🎓 Free CS Courses {openCourses ? "▲" : "▼"}
            </a>

            {openCourses &&
              Object.keys(courses).map((year) => (
                <div key={year} style={{ paddingLeft: "15px" }}>
                  <a
                    href="#!"
                    onClick={() =>
                      setOpenYear(openYear === year ? null : year)
                    }
                    style={{ fontWeight: "500" }}
                  >
                    {year} {openYear === year ? "▲" : "▼"}
                  </a>

                  {openYear === year &&
                    courses[year].map((course) => (
                      <a
                        href="#!"
                        key={course}
                        style={{ paddingLeft: "20px", fontSize: "0.9rem" }}
                        onClick={() =>
                          sendMessage(`Explain ${course} in simple terms.`)
                        }
                      >
                        {course}
                      </a>
                    ))}
                </div>
              ))}
          </div>

          <a href="#">⚙️ Features</a>
          <a href="#">ℹ️ About ASKAI</a>
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
