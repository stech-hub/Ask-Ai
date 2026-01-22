// pages/index.js
import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import {
  signInWithGoogle,
  logout,
  saveMessages,
  loadMessages,
} from "../firebase";

export default function Home() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState({});
  const chatRef = useRef();

  const toggleSubmenu = (key) => {
    setOpenSubmenu({ ...openSubmenu, [key]: !openSubmenu[key] });
  };

  // Google Login
  const handleGoogleLogin = async () => {
    try {
      const signedInUser = await signInWithGoogle();
      setUser(signedInUser);

      // Load past chats
      const pastMessages = await loadMessages(signedInUser.uid);
      if (pastMessages.length > 0) setMessages(pastMessages);
      else
        setMessages([
          {
            type: "ai",
            text: `👋 Welcome ${signedInUser.displayName}!\nYour intelligent assistant is ready.`,
          },
        ]);
    } catch (err) {
      console.error("Google login error:", err);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setMessages([]);
  };

  const sendMessage = async (msg) => {
    if (!msg?.trim() || !user) return;

    const newMessages = [...messages, { type: "user", text: msg }];
    setMessages(newMessages);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.slice(-10).map((m) => ({
            role: m.type === "ai" ? "assistant" : "user",
            content: m.text,
          })),
        }),
      });
      const data = await res.json();
      const updatedMessages = [
        ...newMessages,
        { type: "ai", text: data.message || "⚠️ AI unavailable." },
      ];
      setMessages(updatedMessages);
      await saveMessages(user.uid, updatedMessages);
    } catch (err) {
      console.error(err);
      const fallback = [
        ...newMessages,
        { type: "ai", text: "⚠️ AI temporarily unavailable." },
      ];
      setMessages(fallback);
      await saveMessages(user.uid, fallback);
    }
  };

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  // Predefined links
  const resources = {
    "Jobs & Career": [
      { name: "LinkedIn Jobs", url: "https://www.linkedin.com/jobs/" },
      { name: "Indeed", url: "https://www.indeed.com/" },
      { name: "Glassdoor", url: "https://www.glassdoor.com/index.htm" },
      { name: "Monster", url: "https://www.monster.com/" },
    ],
    "Scholarships (Liberia HS Graduates)": [
      { name: "DAAD", url: "https://www.daad.de/en/" },
      { name: "Chevening", url: "https://www.chevening.org/" },
      { name: "Fulbright", url: "https://foreign.fulbrightonline.org/" },
      { name: "Erasmus+", url: "https://erasmus-plus.ec.europa.eu/" },
    ],
    "Travel & Visa Info": [
      { name: "US Visa Info", url: "https://travel.state.gov/content/travel/en/us-visas.html" },
      { name: "Schengen Visa", url: "https://www.schengenvisainfo.com/" },
      { name: "Canada Visa", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html" },
    ],
    "News & Media": [
      { name: "BBC", url: "https://www.bbc.com/" },
      { name: "CNN", url: "https://edition.cnn.com/" },
      { name: "Al Jazeera", url: "https://www.aljazeera.com/" },
    ],
    "Telecommunications (Global)": [
      { name: "MTN Africa", url: "https://www.mtn.com/" },
      { name: "Airtel Africa", url: "https://www.airtel.africa/" },
      { name: "Verizon US", url: "https://www.verizon.com/" },
      { name: "AT&T US", url: "https://www.att.com/" },
      { name: "Vodafone Global", url: "https://www.vodafone.com/" },
    ],
    "Recommended Features": [
      { name: "Free Coding Courses", url: "https://www.freecodecamp.org/" },
      { name: "AI Tools Hub", url: "https://full-task-ai.vercel.app/" },
      { name: "Resume Builder", url: "https://resumegenius.com/" },
      { name: "Portfolio Maker", url: "https://www.canva.com/" },
      { name: "Online Learning Platforms", url: "https://www.coursera.org/" },
      { name: "Programming Challenges", url: "https://www.hackerrank.com/" },
      { name: "Open Source Projects", url: "https://github.com/explore" },
    ],
  };

  return (
    <>
      <Head>
        <title>ASKAI – AI Assistant & Global Resources</title>
      </Head>

      <div className="app">
        {!user ? (
          <div className="login-container">
            <h1>Welcome to ASKAI</h1>
            <p>Sign in with Google to save your chats and get personalized help.</p>
            <button onClick={handleGoogleLogin} className="google-btn">
              Sign in with Google
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="header">
              <h1>ASKAI</h1>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>

            {/* Side Menu */}
            <div className={`menu ${openMenu ? "open" : ""}`}>
              <button className="menu-toggle" onClick={() => setOpenMenu(!openMenu)}>
                ☰ Menu
              </button>
              {Object.keys(resources).map((category) => (
                <div key={category}>
                  <a
                    href="#!"
                    onClick={() => toggleSubmenu(category)}
                    className="category-link"
                  >
                    {category} {openSubmenu[category] ? "▲" : "▼"}
                  </a>
                  {openSubmenu[category] &&
                    resources[category].map((item) => (
                      <a
                        key={item.name}
                        href={item.url}
                        target="_blank"
                        style={{ paddingLeft: "15px", display: "block" }}
                      >
                        {item.name}
                      </a>
                    ))}
                </div>
              ))}
            </div>

            {/* Chat Area */}
            <div className="chat" ref={chatRef}>
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
          </>
        )}
      </div>

      <style jsx>{`
        .app {
          font-family: Arial, sans-serif;
          display: flex;
          flex-direction: column;
          height: 100vh;
        }
        .login-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
        }
        .google-btn {
          background: #4285f4;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
        }
        .header {
          display: flex;
          justify-content: space-between;
          padding: 10px 15px;
          background: #0a74da;
          color: white;
          align-items: center;
        }
        .logout-btn {
          background: #ff4b5c;
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
        }
        .menu {
          background: #f0f0f0;
          padding: 10px;
          display: none;
          flex-direction: column;
          max-height: 400px;
          overflow-y: auto;
        }
        .menu.open {
          display: flex;
        }
        .menu-toggle {
          background: #0a74da;
          color: white;
          border: none;
          padding: 6px 10px;
          border-radius: 4px;
          cursor: pointer;
          margin-bottom: 8px;
        }
        .category-link {
          font-weight: bold;
          display: block;
          cursor: pointer;
          margin: 5px 0;
        }
        .chat {
          flex: 1;
          padding: 10px;
          overflow-y: auto;
          background: #e8e8e8;
        }
        .msg.ai {
          color: #0a74da;
          margin-bottom: 10px;
        }
        .msg.user {
          color: #000;
          margin-bottom: 10px;
          text-align: right;
        }
        .input {
          display: flex;
          padding: 10px;
          background: #ddd;
        }
        .input textarea {
          flex: 1;
          padding: 8px;
          resize: none;
          border-radius: 4px;
          border: 1px solid #aaa;
        }
        .input button {
          margin-left: 5px;
          padding: 8px 12px;
          border: none;
          background: #0a74da;
          color: white;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}
