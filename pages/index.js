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
      setMessages(
        pastMessages.length
          ? pastMessages
          : [
              { type: "ai", text: `👋 Welcome ${signedInUser.displayName}! Ask me anything.` },
            ]
      );
    } catch (err) {
      console.error(err);
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
          messages: newMessages.map((m) => ({
            role: m.type === "ai" ? "assistant" : "user",
            content: m.text,
          })),
        }),
      });
      const data = await res.json();
      const updatedMessages = [...newMessages, { type: "ai", text: data.message }];
      setMessages(updatedMessages);
      await saveMessages(user.uid, updatedMessages);
    } catch (err) {
      console.error(err);
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
              {messages.map((msg, idx) => (
                <div key={idx} className={`msg ${msg.type}`}>
                  {msg.text.split("\n").map((line, i) => <div key={i}>{line}</div>)}
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
    </>
  );
}
