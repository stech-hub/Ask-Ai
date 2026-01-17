import { useState, useRef, useEffect } from "react";
import "../styles/globals.css";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      type: "ai",
      text: "👋 Welcome to ASKAI\nYour intelligent assistant for learning, productivity, and coding.",
    },
  ]);
  const [input, setInput] = useState("");
  const chatRef = useRef();

  // Dynamic Courses Menu State
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
    <div className="app">
      {/* Header */}
      <div className="header">
        <h1>ASKAI</h1>
        <div className="menu-btn" onClick={toggleMenu}>
          ☰
        </div>
      </div>

      {/* Menu */}
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

        {/* Dynamic Courses Section */}
        <div>
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
      <div className="chat" id="chat" ref={chatRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`msg ${msg.type}`}>
            {msg.text.split("\n").map((line, i) => (
              <div key={i}>{line}</div>
            ))}
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
        <button
          onClick={() => {
            sendMessage(input);
            setInput("");
          }}
        >
          Send
        </button>
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
  );
}
