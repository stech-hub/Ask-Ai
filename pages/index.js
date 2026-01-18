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
  const [openOpportunities, setOpenOpportunities] = useState(false);

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

    if (
      lowerMsg.includes("who created you") ||
      lowerMsg.includes("creator") ||
      lowerMsg.includes("owner")
    ) {
      setMessages([
        ...newMessages,
        {
          type: "ai",
          text: `
Created by <strong>Akin S. Sokpah</strong> from Liberia 🇱🇷<br/><br/>
💬 <a href="https://wa.me/231777789356" target="_blank">WhatsApp</a><br/>
📘 <a href="https://www.facebook.com/profile.php?id=61583456361691" target="_blank">Facebook</a>
          `,
          isHTML: true,
        },
      ]);
      return;
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });

      const data = await res.json();
      setMessages([...newMessages, { type: "ai", text: data.message }]);
    } catch {
      setMessages([...newMessages, { type: "ai", text: "❌ AI error." }]);
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
        <title>ASKAI – AI Learning Assistant</title>
        <meta name="robots" content="index, follow" />
        <meta
          name="google-site-verification"
          content="Xph8kvaL-aAkTHe30pd74SqDHgdUFGDx7p3TLie_LTI"
        />
      </Head>

      <div className="app">
        {/* HEADER */}
        <div className="header">
          <h1>ASKAI</h1>
          <div className="menu-btn" onClick={toggleMenu}>☰</div>
        </div>

        {/* MAIN MENU */}
        <div className="menu" id="menu">
          <a href="#">🏠 Home</a>

          <a href="https://full-task-ai.vercel.app/" target="_blank">
            🤖 AI Tools
          </a>

          <a
            href="https://github.com/stech-hub/bionurseapk-website/releases/download/v1/myapp.apk"
            target="_blank"
          >
            📱 Download Android App
          </a>

          <a
            href="https://github.com/stech-hub/Ask-Ai/releases/download/askai/app-release.apk"
            target="_blank"
          >
            📱 Download ASKAI App
          </a>

          <a href="https://icampus.smythe.telligentgh.com/" target="_blank">
            🏫 SMYTHE University iPortal
          </a>

          {/* OPPORTUNITIES */}
          <a
            href="#!"
            onClick={() => setOpenOpportunities(!openOpportunities)}
            style={{ fontWeight: "700" }}
          >
            🌍 Opportunities {openOpportunities ? "▲" : "▼"}
          </a>

          {openOpportunities && (
            <div style={{ paddingLeft: "15px" }}>
              <a
                href="https://jumia.com"
                target="_blank"
              >
                💰 Affiliate Program (Jumia)
              </a>

              <a
                href="https://opportunitiesforafricans.com"
                target="_blank"
              >
                🎓 Free Scholarships & Travel Abroad
              </a>

              <a
                href="https://www.orange.com/en/countries/liberia"
                target="_blank"
              >
                📡 Orange Liberia Official
              </a>

              <a
                href="https://www.coursera.org"
                target="_blank"
              >
                📚 Free Online Courses
              </a>

              <a
                href="https://www.youthop.com"
                target="_blank"
              >
                ✈️ Youth Global Opportunities
              </a>
            </div>
          )}

          {/* COURSES */}
          <a
            href="#!"
            onClick={() => setOpenCourses(!openCourses)}
            style={{ fontWeight: "700" }}
          >
            🎓 Free CS Courses {openCourses ? "▲" : "▼"}
          </a>

          {openCourses &&
            Object.keys(courses).map((year) => (
              <div key={year} style={{ paddingLeft: "15px" }}>
                <a onClick={() => setOpenYear(openYear === year ? null : year)}>
                  {year}
                </a>
                {openYear === year &&
                  courses[year].map((course) => (
                    <a
                      key={course}
                      style={{ paddingLeft: "20px" }}
                      onClick={() =>
                        sendMessage(`Explain ${course} in simple terms`)
                      }
                    >
                      {course}
                    </a>
                  ))}
              </div>
            ))}

          {/* CONTACT */}
          <a href="https://wa.me/231777789356" target="_blank">
            💬 Contact / Hire Me
          </a>
        </div>

        {/* CHAT */}
        <div className="chat" ref={chatRef}>
          {messages.map((msg, i) => (
            <div key={i} className={`msg ${msg.type}`}>
              {msg.isHTML ? (
                <div dangerouslySetInnerHTML={{ __html: msg.text }} />
              ) : (
                msg.text.split("\n").map((l, x) => <div key={x}>{l}</div>)
              )}
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div className="input">
          <textarea
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
                setInput("");
              }
            }}
          />
          <button onClick={() => { sendMessage(input); setInput(""); }}>
            Send
          </button>
        </div>

        {/* FOOTER */}
        <div className="footer">
          Created by <strong>Akin S. Sokpah</strong> from Liberia 🇱🇷
        </div>
      </div>
    </>
  );
}
