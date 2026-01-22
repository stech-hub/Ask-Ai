import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { signInWithGoogle, logout, saveMessages, loadMessages } from "../firebase";

export default function Home() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatRef = useRef();

  const handleGoogleLogin = async () => {
    try {
      const signedInUser = await signInWithGoogle();
      setUser(signedInUser);

      const pastMessages = await loadMessages(signedInUser.uid);
      if (pastMessages.length) setMessages(pastMessages);
      else
        setMessages([
          { type: "ai", text: `👋 Welcome ${signedInUser.displayName}! Your assistant is ready.` },
        ]);
    } catch (err) {
      console.error("Google login failed:", err);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setMessages([]);
  };

  const sendMessage = async (msg) => {
    if (!msg?.trim()) return alert("Message is required!");
    if (!user) return alert("Please login first!");

    const newMessages = [...messages, { type: "user", text: msg }];
    setMessages(newMessages);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.type === "ai" ? "assistant" : "user",
            content: m.text,
          })),
        }),
      });

      const data = await res.json();

      if (!data.message) throw new Error("No response from AI");

      const updatedMessages = [...newMessages, { type: "ai", text: data.message }];
      setMessages(updatedMessages);
      await saveMessages(user.uid, updatedMessages);
    } catch (err) {
      console.error("Chat error:", err);
      const fallback = [...newMessages, { type: "ai", text: "⚠️ AI temporarily unavailable." }];
      setMessages(fallback);
      await saveMessages(user.uid, fallback);
    }
  };

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  return (
    <>
      <Head>
        <title>ASKAI – AI Assistant</title>
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
            <div className="header">
              <h1>ASKAI</h1>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>

            <div className="chat" ref={chatRef}>
              {messages.map((msg, i) => (
                <div key={i} className={`msg ${msg.type}`}>
                  {msg.text.split("\n").map((line, idx) => <div key={idx}>{line}</div>)}
                </div>
              ))}
            </div>

            <div className="input">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
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
          </>
        )}
      </div>

      <style jsx>{`
        .app { display:flex; flex-direction:column; height:100vh; font-family:Arial; }
        .login-container { display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; }
        .google-btn { background:#4285f4; color:white; padding:12px 20px; border-radius:8px; border:none; cursor:pointer; }
        .header { display:flex; justify-content:space-between; align-items:center; padding:10px; background:#0a74da; color:white; }
        .logout-btn { background:#ff4b5c; color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer; }
        .chat { flex:1; padding:10px; background:#e8e8e8; overflow-y:auto; }
        .msg.ai { color:#0a74da; margin-bottom:10px; }
        .msg.user { color:#000; text-align:right; margin-bottom:10px; }
        .input { display:flex; padding:10px; background:#ddd; }
        .input textarea { flex:1; border-radius:4px; border:1px solid #aaa; padding:8px; resize:none; }
        .input button { margin-left:5px; padding:8px 12px; border-radius:4px; border:none; background:#0a74da; color:white; cursor:pointer; }
      `}</style>
    </>
  );
}
