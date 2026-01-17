import { useState, useRef, useEffect } from "react";
import "../styles/globals.css";

export default function Home() {
  const [messages, setMessages] = useState([
    { type: "ai", text: "👋 Welcome to ASKAI\nYour intelligent assistant for learning, productivity, and coding." }
  ]);
  const [input, setInput] = useState("");
  const chatRef = useRef();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { type: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
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
      <div className="header">
        <h1>ASKAI</h1>
        <div className="menu-btn" onClick={toggleMenu}>☰</div>
      </div>

      <div className="menu" id="menu">
        <a href="#">🏠 Home</a>
        <a href="https://full-task-ai.vercel.app/" target="_blank">🤖 AI Tools</a>
        <a href="https://github.com/stech-hub/bionurseapk-website/releases/download/v1/myapp.apk" target="_blank">📱 Download Android App</a>
        <a href="#">🎓 Free CS Courses</a>
        <a href="#">⚙️ Features</a>
        <a href="#">ℹ️ About ASKAI</a>
      </div>

      <div className="chat" id="chat" ref={chatRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`msg ${msg.type}`}>
            {msg.text.split("\n").map((line, i) => <div key={i}>{line}</div>)}
          </div>
        ))}
      </div>

      <div className="input">
        <textarea
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      <div className="footer">
        Created by <strong>Akin S. Sokpah</strong> from Liberia 🇱🇷 |{" "}
        <a href="https://www.facebook.com/profile.php?id=61583456361691" target="_blank">Facebook</a>
      </div>
    </div>
  );
}
