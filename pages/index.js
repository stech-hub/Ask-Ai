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
  const [openOpportunities, setOpenOpportunities] = useState(false);

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
    { name: "Margibi University", url: "https://www.margibiuniversity.edu.lr" },
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

  const opportunities = [
    { name: "🌍 Global Jobs & Careers", message: "Show me current global job opportunities." },
    { name: "✈️ Travel & Visa Information", message: "Provide visa requirements and travel info by country." },
    { name: "📰 Global News Updates", message: "Give me the latest world news updates." },
    { name: "🎓 Free Scholarships (High School Graduates)", message: "Show me free scholarships for high school graduates from Liberia." },
    { name: "📡 Telecom Networks Worldwide", message: "List major telecom networks in Africa, America, Asia, Europe, and Oceania." },
    { name: "💻 Online Freelance Jobs", message: "Show popular freelance websites for Africans." },
    { name: "📚 Online Learning Platforms", message: "Recommend online courses and free learning platforms." },
    { name: "🚀 Startup & Entrepreneurship Opportunities", message: "Show startup programs and grants globally." },
    { name: "🏦 Microfinance & Funding", message: "Show available microfinance programs for students and young entrepreneurs." },
    { name: "🩺 Health & Medical Opportunities", message: "Find internships and volunteer programs in healthcare globally." },
    { name: "🌱 Environmental & NGO Programs", message: "Show global volunteer and scholarship programs in sustainability." },
    { name: "🎨 Art, Music & Creativity Grants", message: "Show grants and competitions for creatives worldwide." },
    { name: "🏆 Competitions & Hackathons", message: "Show global competitions and hackathons open to students." },
    { name: "🤝 Mentorship & Networking Programs", message: "Recommend mentorship opportunities for students and professionals." },
    { name: "📈 Business & Investment Opportunities", message: "Provide info on global business expansion opportunities." },
  ];

  // Send message to OpenAI API
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
      console.error("Chat error:", err);
      setMessages([...newMessages, { type: "ai", text: "⚠️ AI is temporarily unavailable. Please try again later." }]);
    }
  };

  // Auto-scroll
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
        <title>ASKAI – AI Assistant & Learning Platform</title>
        <meta name="description" content="ASKAI is your free AI learning assistant. Chat with AI for coding help, access CS courses, find scholarships, jobs, and download the ASKAI app in Liberia and worldwide." />
        <meta name="keywords" content="ASKAI AI assistant, ASKAI learning platform, ASKAI coding help, ASKAI Liberia, ASKAI CS courses, free AI learning assistant for students, ask AI for coding help online, Liberia online scholarships and jobs, download ASKAI app Liberia, AI assistant for learning and productivity" />
      </Head>

      <div className="app">
        <div className="header">
          <h1>ASKAI</h1>
          <div className="menu-btn" onClick={toggleMenu}>☰</div>
        </div>

        {/* Menu */}
        <div className="menu" id="menu">
          <a href="#">🏠 Home</a>
          <a href="https://full-task-ai.vercel.app/" target="_blank">🤖 AI Tools</a>
          <a href="https://github.com/stech-hub/Ask-Ai/releases/download/askai/app-release.apk" target="_blank">📱 Download ASKAI App</a>
          <a href="https://github.com/stech-hub/bionurseapk-website/releases/download/v1/myapp.apk" target="_blank">📱 Download Android App</a>

          <a href="#!" onClick={() => setOpenUniversities(!openUniversities)}>
            🎓 University Portals (Liberia) {openUniversities ? "▲" : "▼"}
          </a>
          {openUniversities && universitiesLiberia.map((uni) => (
            <a key={uni.name} href={uni.url} target="_blank" style={{ paddingLeft: "15px", display: "block" }}>{uni.name}</a>
          ))}

          <a href="#!" onClick={() => setOpenCourses(!openCourses)}>
            🎓 Free CS Courses {openCourses ? "▲" : "▼"}
          </a>
          {openCourses && Object.keys(courses).map((year) => (
            <div key={year} style={{ paddingLeft: "15px" }}>
              <a href="#!" onClick={() => setOpenYear(openYear === year ? null : year)}>
                {year} {openYear === year ? "▲" : "▼"}
              </a>
              {openYear === year && courses[year].map((course) => (
                <a key={course} href="#!" style={{ paddingLeft: "20px", fontSize: "0.9rem" }} onClick={() => sendMessage(`Explain ${course} in simple terms.`)}>
                  {course}
                </a>
              ))}
            </div>
          ))}

          <a href="#!" onClick={() => setOpenOpportunities(!openOpportunities)}>
            🌟 Opportunities & Resources {openOpportunities ? "▲" : "▼"}
          </a>
          {openOpportunities && opportunities.map((item) => (
            <a key={item.name} href="#!" style={{ paddingLeft: "15px", display: "block", fontSize: "0.95rem" }} onClick={() => sendMessage(item.message)}>
              {item.name}
            </a>
          ))}

          <div style={{ paddingTop: "10px", borderTop: "1px solid #eee" }}>
            <a href="https://wa.me/231777789356" target="_blank" style={{ color: "white", background: "#25D366", padding: "8px 14px", borderRadius: "6px", display: "inline-block", marginBottom: "6px", textDecoration: "none" }}>💬 Contact Me on WhatsApp</a>
            <br />
            <a href="https://www.facebook.com/profile.php?id=61583456361691" target="_blank" style={{ color: "white", background: "#1877F2", padding: "8px 14px", borderRadius: "6px", display: "inline-block", textDecoration: "none" }}>📘 Follow Me on Facebook / Hire Me</a>
          </div>
        </div>

        {/* Chat */}
        <div className="chat" ref={chatRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`msg ${msg.type}`}>
              {msg.text.split("\n").map((line, i) => <div key={i}>{line}</div>)}
            </div>
          ))}
        </div>

        <div className="input">
          <textarea placeholder="Ask me anything..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage(input);
              setInput("");
            }
          }} />
          <button onClick={() => { sendMessage(input); setInput(""); }}>Send</button>
        </div>

        <div className="footer">
          Created by <strong>Akin S. Sokpah</strong> from Liberia 🇱🇷 | <a href="https://www.facebook.com/profile.php?id=61583456361691" target="_blank">Facebook</a>
        </div>
      </div>

      {/* CSS */}
      <style jsx>{`
        .app { display: flex; flex-direction: column; height: 100vh; font-family: Arial, sans-serif; }
        .header { background: #0a74da; color: white; padding: 10px 15px; display: flex; justify-content: space-between; align-items: center; }
        .menu-btn { cursor: pointer; }
        .menu { display: none; flex-direction: column; background: #f0f0f0; padding: 10px; }
        .menu a { text-decoration: none; padding: 5px 0; color: #333; display: block; }
        .chat { flex: 1; overflow-y: auto; padding: 10px; background: #e8e8e8; }
        .msg.ai { color: #0a74da; margin-bottom: 10px; }
        .msg.user { color: #000; margin-bottom: 10px; text-align: right; }
        .input { display: flex; padding: 10px; background: #ddd; }
        .input textarea { flex: 1; padding: 8px; resize: none; border-radius: 4px; border: 1px solid #aaa; }
        .input button { margin-left: 5px; padding: 8px 12px; border: none; background: #0a74da; color: white; border-radius: 4px; cursor: pointer; }
        .footer { padding: 5px 10px; text-align: center; background: #f0f0f0; font-size: 0.9rem; }
      `}</style>
    </>
  );
}
