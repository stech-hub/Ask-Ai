// SAME IMPORTS
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
  const [openWork, setOpenWork] = useState(false);
  const [openLiberia, setOpenLiberia] = useState(false);

  const courses = {
    "Freshman 1": ["Computer Basics", "Digital Literacy", "Intro to Programming"],
    "Freshman 2": ["Web Development", "Discrete Math"],
    Sophomore: ["Data Structures", "Algorithms"],
    Junior: ["Operating Systems", "Software Engineering"],
    Senior: ["AI & Machine Learning", "Cybersecurity"],
  };

  const sendMessage = async (msg) => {
    if (!msg?.trim()) return;
    const newMessages = [...messages, { type: "user", text: msg }];
    setMessages(newMessages);

    if (msg.toLowerCase().includes("creator")) {
      setMessages([
        ...newMessages,
        {
          type: "ai",
          text: `
Created by <strong>Akin S. Sokpah</strong> from Liberia 🇱🇷<br/>
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
      setMessages([...newMessages, { type: "ai", text: "❌ Error." }]);
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
        <title>ASKAI – AI Assistant</title>
      </Head>

      <div className="app">
        <div className="header">
          <h1>ASKAI</h1>
          <div className="menu-btn" onClick={toggleMenu}>☰</div>
        </div>

        <div className="menu" id="menu">
          <a href="#">🏠 Home</a>

          {/* WORK & MONEY */}
          <a onClick={() => setOpenWork(!openWork)}>
            💼 Work & Money {openWork ? "▲" : "▼"}
          </a>
          {openWork && (
            <div style={{ paddingLeft: 15 }}>
              <a href="https://www.upwork.com" target="_blank">Freelancing (Upwork)</a>
              <a href="https://www.fiverr.com" target="_blank">Fiverr</a>
              <a href="https://remoteok.com" target="_blank">Remote Jobs</a>
              <a href="https://jumia.com" target="_blank">Affiliate Marketing</a>
            </div>
          )}

          {/* OPPORTUNITIES */}
          <a onClick={() => setOpenOpportunities(!openOpportunities)}>
            🎓 Education & Travel {openOpportunities ? "▲" : "▼"}
          </a>
          {openOpportunities && (
            <div style={{ paddingLeft: 15 }}>
              <a href="https://opportunitiesforafricans.com" target="_blank">
                Scholarships Abroad
              </a>
              <a href="https://www.coursera.org" target="_blank">
                Free Certificates
              </a>
              <a href="https://www.youthop.com" target="_blank">
                Global Youth Programs
              </a>
            </div>
          )}

          {/* LIBERIA */}
          <a onClick={() => setOpenLiberia(!openLiberia)}>
            🇱🇷 Liberia Resources {openLiberia ? "▲" : "▼"}
          </a>
          {openLiberia && (
            <div style={{ paddingLeft: 15 }}>
              <a href="https://www.orange.com/en/countries/liberia" target="_blank">
                Orange Liberia
              </a>
              <a href="https://mtn.com" target="_blank">MTN Africa</a>
              <a href="https://www.emansion.gov.lr/" target="_blank">
                Government of Liberia
              </a>
            </div>
          )}

          {/* COURSES */}
          <a onClick={() => setOpenCourses(!openCourses)}>
            🎓 Free CS Courses {openCourses ? "▲" : "▼"}
          </a>
          {openCourses &&
            Object.keys(courses).map((year) => (
              <div key={year} style={{ paddingLeft: 15 }}>
                <a onClick={() => setOpenYear(openYear === year ? null : year)}>
                  {year}
                </a>
                {openYear === year &&
                  courses[year].map((course) => (
                    <a
                      key={course}
                      style={{ paddingLeft: 20 }}
                      onClick={() =>
                        sendMessage(`Explain ${course} in simple terms`)
                      }
                    >
                      {course}
                    </a>
                  ))}
              </div>
            ))}

          <a href="https://github.com" target="_blank">💻 GitHub</a>
          <a href="https://wa.me/231777789356" target="_blank">
            💬 Contact / Hire Developer
          </a>
        </div>

        <div className="chat" ref={chatRef}>
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.type}`}>
              {m.isHTML ? (
                <div dangerouslySetInnerHTML={{ __html: m.text }} />
              ) : (
                m.text
              )}
            </div>
          ))}
        </div>

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

        <div className="footer">
          Created by <strong>Akin S. Sokpah</strong> 🇱🇷
        </div>
      </div>
    </>
  );
}
