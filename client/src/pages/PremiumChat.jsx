import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import "./Chat.css";

function getUserInitials() {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.firstName && user.lastName) {
      return (
        user.firstName.charAt(0).toUpperCase() +
        (user.lastName.charAt(0) ? user.lastName.charAt(0).toUpperCase() : "")
      );
    } else if (user && user.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
  } catch {}
  return "U";
}

const hamburgerIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const profileLogo = (
  <div className="profile-logo">{getUserInitials()}</div>
);

const crownIcon = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="gold" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 6l5 12 5-9 5 9 5-12" />
    <circle cx="12" cy="17" r="2" fill="gold" />
  </svg>
);

const PremiumChat = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState(() => {
    const savedChats = localStorage.getItem('premiumChats');
    return savedChats ? JSON.parse(savedChats) : [
      { id: Date.now(), name: "Premium Chat", messages: [{ from: "bot", text: "Welcome to Premium Image Generation! Type 'generate an image of ...' to get started." }] }
    ];
  });
  const [currentChatId, setCurrentChatId] = useState(() => {
    const savedCurrentChat = localStorage.getItem('currentPremiumChatId');
    return savedCurrentChat ? parseInt(savedCurrentChat) : chats[0].id;
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showModelMenu, setShowModelMenu] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  const currentChat = chats.find(chat => chat.id === currentChatId) || chats[0];

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      name: "Premium Chat",
      messages: [{ from: "bot", text: "Welcome to Premium Image Generation! Type 'generate an image of ...' to get started." }]
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const userInput = input.trim();
    if (!userInput) return;
    // Only allow image generation requests
    const isImageRequest = userInput.toLowerCase().startsWith('generate an image of') || 
      userInput.toLowerCase().startsWith('create an image of') ||
      userInput.toLowerCase().startsWith('make an image of');
    if (!isImageRequest) {
      setChats(prev => prev.map(chat =>
        chat.id === currentChatId
          ? { ...chat, messages: [...chat.messages, { from: "user", text: userInput }, { from: "bot", text: "Only image generation is allowed in Premium Chat. Please start your message with 'generate an image of ...'" }] }
          : chat
      ));
      setInput("");
      return;
    }
    setChats(prev => prev.map(chat =>
      chat.id === currentChatId
        ? { ...chat, messages: [...chat.messages, { from: "user", text: userInput }] }
        : chat
    ));
    setInput("");
    setIsLoading(true);
    // Extract prompt
    const prompt = userInput.replace(/^(generate|create|make) an image of/i, '').trim();
    try {
      const response = await fetch('https://intellibot-rswr.onrender.com/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) throw new Error('Failed to generate image');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.slice(6).trim();
              if (!jsonStr) continue;
              const data = JSON.parse(jsonStr);
              if (data.imageUrl) {
                setChats(prev => prev.map(chat =>
                  chat.id === currentChatId
                    ? { ...chat, messages: [...chat.messages, {
                        from: 'bot',
                        text: `Here's the generated image for: "${prompt}"`,
                        image: data.imageUrl
                      }] }
                    : chat
                ));
              }
            } catch (err) {
              continue;
            }
          }
        }
      }
    } catch (err) {
      setChats(prev => prev.map(chat =>
        chat.id === currentChatId
          ? { ...chat, messages: [...chat.messages, { from: "bot", text: "Sorry, I couldn't generate the image. Please try again." }] }
          : chat
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-root premium-chat">
      {/* Sidebar */}
      <aside className={`chat-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <button 
            className="new-chat-btn"
            onClick={createNewChat}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            New Chat
          </button>
        </div>
        <div className="sidebar-chats">
          {chats.length === 0 ? (
            <div className="no-chats-message">
              <p>No chats yet</p>
              <p className="no-chats-subtitle">Start a new conversation!</p>
            </div>
          ) : (
            chats.map((chat) => (
              <div 
                key={chat.id} 
                className={`sidebar-chat-item ${chat.id === currentChatId ? 'active' : ''}`}
                onClick={() => setCurrentChatId(chat.id)}
                style={{ position: 'relative' }}
              >
                <div className="chat-item-content">
                  <span className="chat-name">{chat.name}</span>
                </div>
              </div>
            ))
          )}
        </div>
        <button onClick={() => {
          localStorage.removeItem('user');
          localStorage.removeItem('isPremiumUser');
          localStorage.removeItem('forceBasic');
          navigate('/');
        }} className="logout-btn">Logout</button>
      </aside>
      {/* Main Chat Area */}
      <main className={`chat-main ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="chat-header">
          <button 
            className="toggle-sidebar-btn"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {hamburgerIcon}
          </button>
          <div style={{ flex: 1 }} />
          <div style={{ position: 'relative' }}>
            <button
              className="premium-btn"
              style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: 12 }}
              title="Premium Model"
              onClick={() => setShowModelMenu(v => !v)}
            >
              {crownIcon}
            </button>
            {showModelMenu && (
              <div style={{ position: 'absolute', right: 0, top: 40, background: '#23242b', color: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0006', zIndex: 10, minWidth: 120 }}>
                <button
                  style={{ width: '100%', background: 'none', border: 'none', color: '#fff', padding: '12px 18px', textAlign: 'left', cursor: 'pointer', borderRadius: 8 }}
                  onClick={() => { localStorage.setItem('forceBasic', 'true'); setShowModelMenu(false); navigate('/chat'); }}
                >
                  Basic Model
                </button>
              </div>
            )}
          </div>
        </header>
        <section className="chat-history">
          {currentChat?.messages.map((msg, idx) => (
            <div key={idx} className={`chat-msg ${msg.from}`}>
              <div className="chat-msg-inner">
                {msg.image ? (
                  <div className="generated-image">
                    <img
                      src={msg.image}
                      alt={msg.text}
                      style={{ maxWidth: '400px', maxHeight: '400px', borderRadius: '8px', objectFit: 'contain' }}
                    />
                    <p>{msg.text}</p>
                  </div>
                ) : msg.from === 'bot' ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                ) : (
                  <span>{msg.text}</span>
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </section>
        <form className="chat-input-bar" onSubmit={handleSend}>
          <input
            type="text"
            placeholder={isLoading ? 'Generating image...' : "Type 'generate an image of ...'"}
            value={input}
            onChange={e => setInput(e.target.value)}
            className="chat-input"
            disabled={isLoading}
            autoFocus
          />
          <button
            type="submit"
            className="chat-send-btn"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? <span className="loading-spinner"></span> : 'Send'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default PremiumChat; 
