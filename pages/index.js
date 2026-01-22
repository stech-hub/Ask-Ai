// pages/index.js
import { useState, useRef, useEffect } from "react";
import Head from "next/head";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      type: "ai",
      text: "👋 Welcome to ASKAI!\nYour intelligent assistant for learning, productivity, and coding.",
    },
  ]);
  const [input, setInput] = useState("");
  const chatRef = useRef();

  const [openCourses, setOpenCourses] = useState(false);
  const [openYear, setOpenYear] = useState(null);
  const [openUniversities, setOpenUniversities] = useState(false);

  const courses = {
    "Freshman 1": ["Computer Basics", "Digital Literacy", "Intro to Programming (Python)"],
    "Freshman 2": ["Web Development (HTML, CSS, JS)", "Discrete Math"],
    Sophomore: ["Data Structures", "Algorithms", "Databases"],
    Junior: ["Operating Systems", "Software Engineering", "Computer Networks"],
    Senior: ["AI & Machine Learning", "Cybersecurity", "Final Year Projects"],
  };

  const universitiesLiberia = [
    { name: "University of Liberia - UL", url: "https://www.ul.edu.lr" },
    { name: "William V.S. Tubman University", url: "https://wvsu.edu.lr" },
    { name: "Nimba University", url: "https://nimbauniversity.edu.lr" },
    { name: "Margibi University", url: "https://margibiuniversity.edu.lr" },
    { name: "Cuttington University", url: "https://www.cuttington.edu.lr" },
    { name: "African Methodist Episcopal University", url: "https://www.ameu.edu.lr" },
    { name: "United Methodist University", url: "https://umu.edu.lr" },
    { name: "Stella Maris Polytechnic University", url: "https://smpu.edu.lr" },
    { name: "Adventist University of West Africa", url: "https://www.auwa.edu.lr" },
    { name: "Starz University", url: "https://www.starzuniversity.edu.lr" },
    { name: "Smythe University College", url: "https://icampus.smythe.telligentgh.com/" },
    { name: "African Methodist Episcopal Zion University", url: "https://amezion.edu.lr" },
    { name: "African Bible College University", url: "https://abcuniversity.org" },
    { name: "Liberia International Christian College", url: "https://licc.edu.lr" },
  ];

  // Send message to API (FIXED SAFELY)
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

      if (!res.ok || !data?.message) {
        throw new Error("AI failed");
      }

      setMessages([...newMessages, { type: "ai", text: data.message }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          type: "ai",
          text: "⚠️ AI is temporarily unavailable. Please try again in a moment.",
        },
      ]);
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleMenu = () => {
    const menu = document.getElementById("menu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  };

  return (
    <>
      <Head>
        <title>ASKAI – AI Assistant & Learning Platform</title>
        <meta
          name="description"
          content="ASKAI is your free AI learning assistant. Chat with AI for coding help, access CS courses, scholarships, jobs, and global information."
        />
        <meta
          name="keywords"
          content="ASKAI AI assistant, ASKAI Liberia, AI learning platform, coding help, scholarships, jobs"
        />
      </Head>

      <div className="app">
        <div className="header">
          <h1>ASKAI</h1>
          <div className="menu-btn" onClick={toggleMenu}>☰</div>
        </div>

        <div className="menu" id="menu">
          <a href="#">🏠 Home</a>
          <a href="https://full-task-ai.vercel.app/" target="_blank">🤖 AI Tools</a>
        </div>

        <div className="chat" ref={chatRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`msg ${msg.type}`}>
              {msg.text.split("\n").map((line, i) => (
                <div key={i}>{line}</div>
              ))}
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
          <button
            onClick={() => {
              sendMessage(input);
              setInput("");
            }}
          >
            Send
          </button>
        </div>

        <div className="footer">
          Created by <strong>Akin S. Sokpah</strong> from Liberia 🇱🇷
        </div>
      </div>
    </>
  );
}
