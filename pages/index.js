import { useState, useRef, useEffect } from "react";
import Head from "next/head";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      type: "ai",
      text: "👋 Welcome to ASKAI – your super assistant for learning, coding, jobs, scholarships, and Liberia + global resources!",
    },
  ]);
  const [input, setInput] = useState("");
  const chatRef = useRef();

  // Menu hierarchy
  const menu = [
    {
      title: "Internal Pages",
      items: [
        { name: "Home", url: "/" },
        { name: "About ASKAI", url: "/about" },
        { name: "Courses", url: "/courses", sub: [
            { name: "Freshman 1", sub: ["Computer Basics", "Digital Literacy", "Intro to Programming (Python)"] },
            { name: "Freshman 2", sub: ["Web Development (HTML, CSS, JS)", "Discrete Math"] },
            { name: "Sophomore", sub: ["Data Structures", "Algorithms", "Databases"] },
            { name: "Junior", sub: ["Operating Systems", "Software Engineering", "Computer Networks"] },
            { name: "Senior", sub: ["AI & ML", "Cybersecurity", "Final Year Projects"] },
        ]},
        { name: "Contact", url: "/contact" },
      ],
    },
    {
      title: "Apps & Tools",
      items: [
        { name: "Download ASKAI App", url: "https://github.com/stech-hub/Ask-Ai/releases/download/askai/app-release.apk", target: "_blank" },
        { name: "Download Other App", url: "https://github.com/stech-hub/bionurseapk-website/releases/download/v1/myapp.apk", target: "_blank" },
        { name: "AI Tools Portal", url: "https://full-task-ai.vercel.app/", target: "_blank" },
      ],
    },
    {
      title: "University Portals",
      items: [
        { name: "SMYTHE University iPortal", url: "https://icampus.smythe.telligentgh.com/", target: "_blank" },
      ],
    },
    {
      title: "Scholarships",
      items: [
        { name: "Opportunities for Africans", url: "https://www.opportunitiesforafricans.com/", target: "_blank" },
        { name: "Chevening", url: "https://www.chevening.org/", target: "_blank" },
        { name: "Fulbright", url: "https://www.fulbrightprogram.org/", target: "_blank" },
        { name: "DAAD", url: "https://www.daad.de/", target: "_blank" },
        { name: "Study Abroad", url: "https://www.studyabroad.com/", target: "_blank" },
      ],
    },
    {
      title: "Jobs & Freelancing",
      items: [
        { name: "Job Liberia", url: "https://www.jobliberia.com/", target: "_blank" },
        { name: "My Jobs", url: "https://www.myjobs.com.lr/", target: "_blank" },
        { name: "Upwork", url: "https://www.upwork.com/", target: "_blank" },
        { name: "Fiverr", url: "https://www.fiverr.com/", target: "_blank" },
      ],
    },
    {
      title: "Affiliate Programs",
      items: [
        { name: "Jumia", url: "https://jumia.com", target: "_blank" },
        { name: "Expertnaire", url: "https://expertnaire.com", target: "_blank" },
        { name: "Amazon", url: "https://amazon.com", target: "_blank" },
        { name: "eBay", url: "https://ebay.com", target: "_blank" },
        { name: "AliExpress", url: "https://aliexpress.com", target: "_blank" },
        { name: "Real Affiliate Liberia", url: "#", target: "_blank" },
      ],
    },
    {
      title: "Telecom & Services",
      items: [
        { name: "Orange Liberia", url: "https://www.orange.com/lr/", target: "_blank" },
        { name: "Lonestar Cell", url: "https://www.lonestarcell.com/", target: "_blank" },
        { name: "Africell", url: "https://www.africell.com.lr/", target: "_blank" },
      ],
    },
    {
      title: "News & Media",
      items: [
        { name: "FrontPage Africa", url: "https://frontpageafricaonline.com/", target: "_blank" },
        { name: "The New Dawn", url: "https://thenewdawnliberia.com/", target: "_blank" },
        { name: "BBC News", url: "https://www.bbc.com/news", target: "_blank" },
        { name: "CNN", url: "https://www.cnn.com/", target: "_blank" },
      ],
    },
    {
      title: "Special Features",
      items: [
        { name: "Covid-19 Liberia Updates", url: "#", target: "_blank" },
        { name: "Trending Courses", url: "#", target: "_blank" },
        { name: "Startup News Liberia", url: "#", target: "_blank" },
        { name: "Government Programs", url: "#", target: "_blank" },
      ],
    },
    {
      title: "Contact & Social",
      items: [
        { name: "WhatsApp", url: "https://wa.me/231777789356", target: "_blank" },
        { name: "Facebook / Hire Me", url: "https://www.facebook.com/profile.php?id=61583456361691", target: "_blank" },
        { name: "Email", url: "mailto:askai@liberia.com" },
      ],
    },
  ];

  // Toggle menu categories
  const [openCategory, setOpenCategory] = useState(null);
  const [openSub, setOpenSub] = useState({});

  const toggleCategory = (index) => {
    setOpenCategory(openCategory === index ? null : index);
  };

  const toggleSub = (catIndex, subIndex) => {
    setOpenSub((prev) => ({
      ...prev,
      [`${catIndex}-${subIndex}`]: !prev[`${catIndex}-${subIndex}`],
    }));
  };

  // Chat message sender
  const sendMessage = async (msg) => {
    if (!msg?.trim()) return;
    const newMessages = [...messages, { type: "user", text: msg }];
    setMessages(newMessages);

    const lower = msg.toLowerCase();
    if (lower.includes("who created") || lower.includes("creator")) {
      const response = `
<div>
  <p>Akin S. Sokpah from Liberia created me 🇱🇷</p>
  <p>
    💬 <a href="https://wa.me/231777789356" target="_blank" style="color:white;background:#25D366;padding:6px 12px;border-radius:6px;text-decoration:none;">WhatsApp</a>
  </p>
  <p>
    📘 <a href="https://www.facebook.com/profile.php?id=61583456361691" target="_blank" style="color:white;background:#1877F2;padding:6px 12px;border-radius:6px;text-decoration:none;">Facebook</a>
  </p>
</div>
      `;
      setMessages([...newMessages, { type: "ai", text: response, isHTML: true }]);
      return;
    }

    // Default AI response
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      setMessages([...newMessages, { type: "ai", text: data.message }]);
    } catch {
      setMessages([...newMessages, { type: "ai", text: "❌ Error contacting AI." }]);
    }
  };

  useEffect(() => {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Head>
        <title>ASKAI – Ultimate AI, Courses & Liberia Resources</title>
        <meta name="description" content="ASKAI lets you chat with AI, access courses, scholarships, jobs, affiliates, news, and Liberia + global resources." />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google-site-verification" content="Xph8kvaL-aAkTHe30pd74SqDHgdUFGDx7p3TLie_LTI" />
      </Head>

      <div className="app">
        {/* Header */}
        <div className="header">
          <h1>ASKAI</h1>
          <div className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>☰</div>
        </div>

        {/* Main Menu */}
        <div className="menu" style={{ display: menuOpen ? "block" : "none" }}>
          {menu.map((category, catIndex) => (
            <div key={catIndex}>
              <a href="#!" onClick={() => toggleCategory(catIndex)} style={{ fontWeight: "700" }}>
                {category.title} {openCategory === catIndex ? "▲" : "▼"}
              </a>
              {openCategory === catIndex &&
                category.items.map((item, subIndex) => (
                  <div key={subIndex} style={{ paddingLeft: "15px" }}>
                    {item.sub ? (
                      <>
                        <a href="#!" onClick={() => toggleSub(catIndex, subIndex)} style={{ fontWeight: "500" }}>
                          {item.name} {openSub[`${catIndex}-${subIndex}`] ? "▲" : "▼"}
                        </a>
                        {openSub[`${catIndex}-${subIndex}`] &&
                          item.sub.map((s, i) => (
                            <a key={i} href="#!" style={{ paddingLeft: "20px", fontSize: "0.9rem" }} onClick={() => sendMessage(`Explain ${s} in simple terms.`)}>
                              {typeof s === "string" ? s : s.name}
                            </a>
                          ))}
                      </>
                    ) : (
                      <a href={item.url} target={item.target || "_self"}>{item.name}</a>
                    )}
                  </div>
                ))}
            </div>
          ))}
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
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage(input), setInput(""))}
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
