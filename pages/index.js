import { useState, useRef, useEffect } from "react";
import Head from "next/head";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      type: "ai",
      text: "👋 Welcome to ASKAI\nYour intelligent assistant for learning, productivity, and global resources.",
    },
  ]);
  const [input, setInput] = useState("");
  const chatRef = useRef();

  // Main menu links
  const menuLinks = [
    // Internal pages
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
    { name: "Courses", url: "/courses" },
    { name: "Contact", url: "/contact" },

    // External resources
    { name: "Download ASKAI App", url: "https://github.com/stech-hub/Ask-Ai/releases/download/askai/app-release.apk", target: "_blank" },
    { name: "Download Other App", url: "https://github.com/stech-hub/bionurseapk-website/releases/download/v1/myapp.apk", target: "_blank" },
    { name: "AI Tools", url: "https://full-task-ai.vercel.app/", target: "_blank" },
    { name: "SMYTHE University iPortal", url: "https://icampus.smythe.telligentgh.com/", target: "_blank" },

    // Affiliate Programs
    { name: "Jumia", url: "https://jumia.com", target: "_blank" },
    { name: "Expertnaire", url: "https://expertnaire.com", target: "_blank" },
    { name: "Amazon", url: "https://amazon.com", target: "_blank" },
    { name: "eBay", url: "https://ebay.com", target: "_blank" },
    { name: "AliExpress", url: "https://aliexpress.com", target: "_blank" },

    // Scholarships
    { name: "Opportunities for Africans", url: "https://www.opportunitiesforafricans.com/", target: "_blank" },
    { name: "Chevening", url: "https://www.chevening.org/", target: "_blank" },
    { name: "Fulbright", url: "https://www.fulbrightprogram.org/", target: "_blank" },
    { name: "DAAD", url: "https://www.daad.de/", target: "_blank" },
    { name: "Study Abroad", url: "https://www.studyabroad.com/", target: "_blank" },

    // Jobs & Freelancing
    { name: "Job Liberia", url: "https://www.jobliberia.com/", target: "_blank" },
    { name: "My Jobs", url: "https://www.myjobs.com.lr/", target: "_blank" },
    { name: "Upwork", url: "https://www.upwork.com/", target: "_blank" },
    { name: "Fiverr", url: "https://www.fiverr.com/", target: "_blank" },

    // Telecom & Services
    { name: "Orange Liberia", url: "https://www.orange.com/lr/", target: "_blank" },
    { name: "Lonestar Cell", url: "https://www.lonestarcell.com/", target: "_blank" },
    { name: "Africell", url: "https://www.africell.com.lr/", target: "_blank" },

    // News & Media
    { name: "FrontPage Africa", url: "https://frontpageafricaonline.com/", target: "_blank" },
    { name: "The New Dawn", url: "https://thenewdawnliberia.com/", target: "_blank" },
    { name: "BBC News", url: "https://www.bbc.com/news", target: "_blank" },
    { name: "CNN", url: "https://www.cnn.com/", target: "_blank" },
  ];

  // Send message function
  const sendMessage = async (msg) => {
    if (!msg?.trim()) return;

    const newMessages = [...messages, { type: "user", text: msg }];
    setMessages(newMessages);

    const lowerMsg = msg.toLowerCase();

    // Creator response
    if (
      lowerMsg.includes("who created you") ||
      lowerMsg.includes("creator") ||
      lowerMsg.includes("who made you")
    ) {
      const response = `
<div>
  <p>Akin S. Sokpah from Liberia created me 🇱🇷</p>
  <p>
    💬 <a href="https://wa.me/231777789356" target="_blank" style="color:white; background:#25D366; padding:6px 12px; border-radius:6px; text-decoration:none;">Message me on WhatsApp</a>
  </p>
  <p>
    📘 <a href="https://www.facebook.com/profile.php?id=61583456361691" target="_blank" style="color:white; background:#1877F2; padding:6px 12px; border-radius:6px; text-decoration:none;">Follow me on Facebook</a>
  </p>
</div>
      `;
      setMessages([...newMessages, { type: "ai", text: response, isHTML: true }]);
      return;
    }

    // Default AI API call
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
    <>
      <Head>
        <title>ASKAI – AI Chat, CS Courses & Liberia Resources</title>
        <meta name="description" content="ASKAI lets you chat with AI, access CS courses, scholarships, jobs, affiliate programs, and Liberia + global resources. Created by Akin S. Sokpah." />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google-site-verification" content="Xph8kvaL-aAkTHe30pd74SqDHgdUFGDx7p3TLie_LTI" />
      </Head>

      <div className="app">
        {/* Header */}
        <div className="header">
          <h1>ASKAI</h1>
          <div className="menu-btn" onClick={toggleMenu}>☰</div>
        </div>

        {/* Main Menu */}
        <div className="menu" id="menu" style={{ display: "none" }}>
          {menuLinks.map((link, idx) => (
            <a key={idx} href={link.url} target={link.target || "_self"}>{link.name}</a>
          ))}

          <hr />
          <a href="https://wa.me/231777789356" target="_blank" style={{ color:"white", background:"#25D366", padding:"8px 14px", borderRadius:"6px", display:"inline-block", marginBottom:"6px", textDecoration:"none" }}>💬 WhatsApp</a>
          <br />
          <a href="https://www.facebook.com/profile.php?id=61583456361691" target="_blank" style={{ color:"white", background:"#1877F2", padding:"8px 14px", borderRadius:"6px", display:"inline-block", textDecoration:"none" }}>📘 Facebook / Hire Me</a>
        </div>

        {/* Chat Section */}
        <div className="chat" ref={chatRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`msg ${msg.type}`}>
              {msg.isHTML ? (
                <div dangerouslySetInnerHTML={{ __html: msg.text }} />
              ) : (
                msg.text.split("\n").map((line, i) => <div key={i}>{line}</div>)
              )}
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
              e.key === "Enter" && !e.shiftKey &&
              (e.preventDefault(), sendMessage(input), setInput(""))
            }
          />
          <button onClick={() => { sendMessage(input); setInput(""); }}>Send</button>
        </div>

        {/* Footer */}
        <div className="footer">
          Created by <strong>Akin S. Sokpah</strong> from Liberia 🇱🇷 |{" "}
          <a href="https://www.facebook.com/profile.php?id=61583456361691" target="_blank">Facebook</a>
        </div>
      </div>
    </>
  );
}
