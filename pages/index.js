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
  const [openFeatures, setOpenFeatures] = useState(false);

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

  const otherFeatures = [
    { name: "Jobs & Careers", links: [
      { name: "LinkedIn Jobs", url: "https://www.linkedin.com/jobs/" },
      { name: "Indeed", url: "https://www.indeed.com/" },
      { name: "Glassdoor", url: "https://www.glassdoor.com/index.htm" },
      { name: "Monster", url: "https://www.monster.com/" },
    ]},
    { name: "Scholarships (Free Programs)", links: [
      { name: "ScholarshipPortal", url: "https://www.scholarshipportal.com/" },
      { name: "DAAD (Germany)", url: "https://www.daad.de/en/" },
      { name: "Chevening (UK)", url: "https://www.chevening.org/" },
      { name: "Fulbright Program (USA)", url: "https://foreign.fulbrightonline.org/" },
    ]},
    { name: "Travel & Visa Info", links: [
      { name: "Travelbriefing", url: "https://travelbriefing.org/" },
      { name: "US Travel Visa Info", url: "https://travel.state.gov/" },
      { name: "Schengen Visa Info", url: "https://www.schengenvisainfo.com/" },
    ]},
    { name: "News", links: [
      { name: "BBC News", url: "https://www.bbc.com/news" },
      { name: "CNN", url: "https://edition.cnn.com/" },
      { name: "Al Jazeera", url: "https://www.aljazeera.com/" },
    ]},
    { name: "Telecommunications", links: [
      { name: "MTN Africa", url: "https://www.mtn.com/" },
      { name: "Vodafone", url: "https://www.vodafone.com/" },
      { name: "Airtel", url: "https://www.airtel.in/" },
      { name: "Orange", url: "https://www.orange.com/en" },
    ]},
    { name: "Other Useful Features", links: [
      { name: "FreeCodeCamp", url: "https://www.freecodecamp.org/" },
      { name: "OpenAI Tools", url: "https://openai.com/" },
      { name: "CoinMarketCap", url: "https://coinmarketcap.com/" },
      { name: "Weather Updates", url: "https://weather.com/" },
      { name: "XE Currency Converter", url: "https://www.xe.com/" },
      { name: "Flight Booking (Skyscanner)", url: "https://www.skyscanner.net/" },
      { name: "Hotels Booking (Booking.com)", url: "https://www.booking.com/" },
      { name: "Public APIs (RapidAPI)", url: "https://rapidapi.com/" },
      { name: "COVID-19 Info (WHO)", url: "https://www.who.int/" },
      { name: "Eventbrite (Events)", url: "https://www.eventbrite.com/" },
      { name: "University Admissions (TopUniversities)", url: "https://www.topuniversities.com/" },
      { name: "Startup Funding (Crunchbase)", url: "https://www.crunchbase.com/" },
    ]},
  ];

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
      if (!data.message) throw new Error("API returned empty message");
      setMessages([...newMessages, { type: "ai", text: data.message }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages([...newMessages, { type: "ai", text: "⚠️ AI is temporarily unavailable. Please try again in a moment." }]);
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
        <title>ASKAI – AI Assistant & Learning Platform</title>
        <meta name="description" content="ASKAI is your free AI learning assistant. Chat with AI for coding help, access CS courses, find scholarships, jobs, and download the ASKAI app in Liberia and worldwide." />
        <meta name="keywords" content="ASKAI AI assistant, ASKAI learning platform, ASKAI coding help, ASKAI Liberia, ASKAI CS courses, free AI learning assistant for students, ask AI for coding help online, Liberia online scholarships and jobs, download ASKAI app Liberia, AI assistant for learning and productivity, AskAI, Ask AI" />
      </Head>

      <div className="app">
        {/* Header */}
        <div className="header">
          <h1>ASKAI</h1>
          <div className="menu-btn" onClick={toggleMenu}>☰</div>
        </div>

        {/* Side Menu */}
        <div className="menu" id="menu">
          <a href="#">🏠 Home</a>
          <a href="https://full-task-ai.vercel.app/" target="_blank">🤖 AI Tools</a>
          <a href="https://github.com/stech-hub/Ask-Ai/releases/download/askai/app-release.apk" target="_blank">📱 Download ASKAI App</a>
          <a href="https://github.com/stech-hub/bionurseapk-website/releases/download/v1/myapp.apk" target="_blank">📱 Download Android App</a>

          {/* University Portals */}
          <a href="#!" onClick={() => setOpenUniversities(!openUniversities)}>
            🎓 University Portals (Liberia) {openUniversities ? "▲" : "▼"}
          </a>
          {openUniversities &&
            universitiesLiberia.map((uni) => (
              <a key={uni.name} href={uni.url} target="_blank" style={{ paddingLeft: "15px", display: "block" }}>{uni.name}</a>
            ))}

          {/* Free CS Courses */}
          <a href="#!" onClick={() => setOpenCourses(!openCourses)}>
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
                    <a key={course} href="#!" style={{ paddingLeft: "20px", fontSize: "0.9rem" }} onClick={() => sendMessage(`Explain ${course} in simple terms.`)}>
                      {course}
                    </a>
                  ))}
              </div>
            ))}

          {/* Other Features */}
          <a href="#!" onClick={() => setOpenFeatures(!openFeatures)}>
            🌐 Global Opportunities & More {openFeatures ? "▲" : "▼"}
          </a>
          {openFeatures &&
            otherFeatures.map((cat) => (
              <div key={cat.name} style={{ paddingLeft: "15px" }}>
                <a href="#!" style={{ fontWeight: "bold" }}>{cat.name}</a>
                {cat.links.map((link) => (
                  <a key={link.name} href={link.url} target="_blank" style={{ paddingLeft: "20px", fontSize: "0.9rem" }}>
                    {link.name}
                  </a>
                ))}
              </div>
            ))}

          {/* Contact */}
          <div style={{ paddingTop: "10px", borderTop: "1px solid #eee" }}>
            <a href="https://wa.me/231777789356" target="_blank" style={{ color: "white", background: "#25D366", padding: "8px 14px", borderRadius: "6px", display: "inline-block", marginBottom: "6px", textDecoration: "none" }}>
              💬 Contact Me on WhatsApp
            </a>
            <br />
            <a href="https://www.facebook.com/profile.php?id=61583456361691" target="_blank" style={{ color: "white", background: "#1877F2", padding: "8px 14px", borderRadius: "6px", display: "inline-block", textDecoration: "none" }}>
              📘 Follow Me on Facebook / Hire Me
            </a>
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat" ref={chatRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`msg ${msg.type}`}>
              {msg.text.split("\n").map((line, i) => <div key={i}>{line}</div>)}
            </div>
          ))}
        </div>

        {/* Input */}
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
          <button onClick={() => { sendMessage(input); setInput(""); }}>Send</button>
        </div>

        {/* Footer */}
        <div className="footer">
          Created by <strong>Akin S. Sokpah</strong> from Liberia 🇱🇷 |{" "}
          <a href="https://www.facebook.com/profile.php?id=61583456361691" target="_blank">Facebook</a>
        </div>
      </div>

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
