import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import "./Chat.css";

const staticChats = [
  { id: 1, name: "Chat with Bot" },
  { id: 2, name: "Project Ideas" },
  { id: 3, name: "Support" },
];

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

const profileLogo = (
  <div className="profile-logo">{getUserInitials()}</div>
);

const attachmentIcon = (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-paperclip"><path d="M21.44 11.05l-9.19 9.19a5 5 0 0 1-7.07-7.07l9.19-9.19a3 3 0 0 1 4.24 4.24l-9.19 9.19a1 1 0 0 1-1.41-1.41l9.19-9.19"/></svg>
);

const hamburgerIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const shareIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
);
const trashIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
);
const ellipsisIcon = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="4" cy="10" r="1.5"/><circle cx="10" cy="10" r="1.5"/><circle cx="16" cy="10" r="1.5"/></svg>
);
const pencilIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/></svg>
);
const micIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v14a4 4 0 0 0 4-4V5a4 4 0 0 0-8 0v6a4 4 0 0 0 4 4z"/><line x1="19" y1="10" x2="19" y2="14"/><line x1="5" y1="10" x2="5" y2="14"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
);

const sunIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
);
const moonIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>
);

// Add icons at the top
const copyIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
);
const likeIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-6 0v4"/><path d="M5 15h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2z"/></svg>
);
const dislikeIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v4a3 3 0 0 0 6 0v-4"/><path d="M19 9H5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2z"/></svg>
);

// Add Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Chat Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const ConfirmModal = ({ open, onCancel, onConfirm }) => {
  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h2 className="modal-title">Are you absolutely sure?</h2>
        <p className="modal-desc">This action cannot be undone. This will permanently delete your chat and remove it from our servers.</p>
        <div className="modal-actions">
          <button className="modal-btn cancel" onClick={onCancel}>Cancel</button>
          <button className="modal-btn continue" onClick={onConfirm}>Continue</button>
        </div>
      </div>
    </div>
  );
};

const checkCircleIcon = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="9" fill="#18181b"/><path d="M6 10.5l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

const crownIcon = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="gold" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 6l5 12 5-9 5 9 5-12" />
    <circle cx="12" cy="17" r="2" fill="gold" />
  </svg>
);

const Chat = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState(() => {
    const savedChats = localStorage.getItem('chats');
    return savedChats ? JSON.parse(savedChats) : [
      { id: Date.now(), name: "New Chat", messages: [{ from: "bot", text: "Hello! How can I help you today?" }] }
    ];
  });
  const [currentChatId, setCurrentChatId] = useState(() => {
    const savedCurrentChat = localStorage.getItem('currentChatId');
    return savedCurrentChat ? parseInt(savedCurrentChat) : chats[0].id;
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [rateLimitTime, setRateLimitTime] = useState(null);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);
  const [pendingImage, setPendingImage] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (
      localStorage.getItem('isPremiumUser') === 'true' &&
      localStorage.getItem('forceBasic') !== 'true'
    ) {
      navigate('/premium-chat');
    }
  }, [navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  useEffect(() => {
    document.body.classList.toggle('light-theme', theme === 'light');
    document.body.classList.toggle('dark-theme', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const currentChat = chats.find(chat => chat.id === currentChatId) || chats[0];

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      name: "New Chat",
      messages: [{ from: "bot", text: "Hello! How can I help you today?" }]
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  };

  const deleteChat = (chatId) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      const remainingChats = chats.filter(chat => chat.id !== chatId);
      if (remainingChats.length > 0) {
        setCurrentChatId(remainingChats[0].id);
      } else {
        // Create a new chat when all chats are deleted
        const newChat = {
          id: Date.now(),
          name: "New Chat",
          messages: [{ from: "bot", text: "Hello! How can I help you today?" }]
        };
        setChats([newChat]);
        setCurrentChatId(newChat.id);
      }
    }
  };

  const updateChatName = (chatId, newName) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, name: newName } : chat
    ));
  };

  const handleSend = async (e, overrideText) => {
    if (e) e.preventDefault();
    if (isLoading || rateLimitTime) return;
    
    const userInput = overrideText || input.trim();
    if (!userInput && !pendingImage) return;
    
    setInput("");
    setIsLoading(true);
    setError(null);
    
    if (pendingImage) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('image', pendingImage.file);
        const response = await fetch('https://intellibot-rswr.onrender.com/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        const baseTimestamp = new Date().toISOString();
        let userTextId = null;
        setChats(prev => prev.map(chat => {
          if (chat.id === currentChatId) {
            let newMessages = [
              {
                from: "user",
                text: '',
                image: pendingImage.url,
                ocrText: data.text,
                id: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
                timestamp: baseTimestamp
              }
            ];
            if (userInput) {
              userTextId = Date.now() + 1 + '-' + Math.random().toString(36).substr(2, 9);
              newMessages.push({
                from: "user",
                text: userInput,
                id: userTextId,
                timestamp: baseTimestamp
              });
            } else if (data.text && data.text.trim()) {
              userTextId = Date.now() + 1 + '-' + Math.random().toString(36).substr(2, 9);
              newMessages.push({
                from: "user",
                text: data.text.trim(),
                id: userTextId,
                timestamp: baseTimestamp
              });
            }
            return {
              ...chat,
              messages: [...chat.messages, ...newMessages]
            };
          }
          return chat;
        }));
        setPendingImage(null);

        // If there was user text or extracted text, trigger the bot reply logic for it
        let messageForBot;
        if (userInput && data.text && data.text.trim()) {
          messageForBot = `${userInput}\n\nHere is the extracted text from the image:\n${data.text.trim()}`;
        } else if (!userInput && data.text && data.text.trim()) {
          messageForBot = `Summarize the following text:\n${data.text.trim()}`;
        } else {
          messageForBot = userInput;
        }
        if (messageForBot) {
          // Add initial bot message
          setChats(prev => prev.map(chat => 
            chat.id === currentChatId 
              ? { ...chat, messages: [...chat.messages, { from: "bot", text: "", id: Date.now() + 2 + '-' + Math.random().toString(36).substr(2, 9), timestamp: new Date().toISOString() }] }
              : chat
          ));

          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);

            const response = await fetch('http://localhost:5000/api/chat', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream'
              },
              body: JSON.stringify({ message: messageForBot }),
              signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              if (errorData.retryAfter) {
                setRateLimitTime(errorData.retryAfter);
                throw new Error(`Rate limit exceeded. Please wait ${formatTimeRemaining(errorData.retryAfter)} before trying again.`);
              }
              throw new Error(errorData.message || 'Network response was not ok');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let botMessage = "";
            
            while (true) {
              const { value, done } = await reader.read();
              if (done) break;

              const chunk = decoder.decode(value);
              const lines = chunk.split('\n');

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  try {
                    const data = JSON.parse(line.slice(6));
                    
                    if (data.error) {
                      throw new Error(data.error);
                    }

                    if (data.content) {
                      botMessage += data.content;
                      setChats(prev => prev.map(chat => {
                        if (chat.id === currentChatId) {
                          const newMessages = [...chat.messages];
                          const lastMessage = newMessages[newMessages.length - 1];
                          if (lastMessage && lastMessage.from === 'bot') {
                            newMessages[newMessages.length - 1] = { ...lastMessage, text: botMessage };
                          }
                          return { ...chat, messages: newMessages };
                        }
                        return chat;
                      }));
                    }

                    if (data.done) {
                      break;
                    }
                  } catch (err) {
                    console.error('Error parsing SSE data:', err);
                    setError('Error processing response from server');
                    break;
                  }
                }
              }
            }
          } catch (err) {
            let errorMessage = "Sorry, there was an error getting a response. Please try again.";
            if (err.name === 'AbortError') {
              errorMessage = "Request timed out. Please try again.";
            } else if (err.message && err.message.includes('ENOTFOUND') || err.message.includes('ECONNREFUSED')) {
              errorMessage = "Unable to connect to the server. Please check your internet connection and try again.";
            } else if (err.message && err.message.includes('Failed to fetch')) {
              errorMessage = "Network error. Please check your internet connection and try again.";
            } else {
              errorMessage = err.message || errorMessage;
            }
            setError(errorMessage);
            setChats(prev => prev.map(chat => 
              chat.id === currentChatId 
                ? { ...chat, messages: [...chat.messages, { from: "bot", text: errorMessage }] }
                : chat
            ));
          }
        }

      } catch (err) {
        setError('Failed to upload/process image');
      } finally {
        setUploading(false);
        setIsLoading(false);
      }
      return;
    }

    // Update chat with user message
    setChats(prev => prev.map(chat => {
      if (chat.id === currentChatId) {
        const isFirstUserMessage = chat.messages.length === 1 && chat.messages[0].from === 'bot';
        return {
          ...chat,
          name: isFirstUserMessage ? userInput.slice(0, 30) + (userInput.length > 30 ? '...' : '') : chat.name,
          messages: [...chat.messages, { from: "user", text: userInput, id: Date.now() + '-' + Math.random().toString(36).substr(2, 9), timestamp: new Date().toISOString() }]
        };
      }
      return chat;
    }));

    // Add initial bot message
    setChats(prev => prev.map(chat => 
      chat.id === currentChatId 
        ? { ...chat, messages: [...chat.messages, { from: "bot", text: "", id: Date.now() + '-' + Math.random().toString(36).substr(2, 9), timestamp: new Date().toISOString() }] }
        : chat
    ));

    try {
      // Handle normal chat message
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream'
        },
        body: JSON.stringify({ message: userInput }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.retryAfter) {
          setRateLimitTime(errorData.retryAfter);
          throw new Error(`Rate limit exceeded. Please wait ${formatTimeRemaining(errorData.retryAfter)} before trying again.`);
        }
        throw new Error(errorData.message || 'Network response was not ok');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botMessage = "";
      
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.error) {
                throw new Error(data.error);
              }

              if (data.content) {
                botMessage += data.content;
                setChats(prev => prev.map(chat => {
                  if (chat.id === currentChatId) {
                    const newMessages = [...chat.messages];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage && lastMessage.from === 'bot') {
                      newMessages[newMessages.length - 1] = { ...lastMessage, text: botMessage };
                    }
                    return { ...chat, messages: newMessages };
                  }
                  return chat;
                }));
              }

              if (data.done) {
                break;
              }
            } catch (err) {
              console.error('Error parsing SSE data:', err);
              setError('Error processing response from server');
              break;
            }
          }
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      let errorMessage = "Sorry, there was an error getting a response. Please try again.";
      
      if (err.name === 'AbortError') {
        errorMessage = "Request timed out. Please try again.";
      } else if (err.message.includes('ENOTFOUND') || err.message.includes('ECONNREFUSED')) {
        errorMessage = "Unable to connect to the server. Please check your internet connection and try again.";
      } else if (err.message.includes('Failed to fetch')) {
        errorMessage = "Network error. Please check your internet connection and try again.";
      } else {
        errorMessage = err.message || errorMessage;
      }

      setError(errorMessage);
      setChats(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: [...chat.messages, { from: "bot", text: errorMessage }] }
          : chat
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPendingImage({ file, url: URL.createObjectURL(file) });
  };

  const handleAttachmentClick = () => {
    if (!uploading && fileInputRef.current) {
      fileInputRef.current.value = null;
      fileInputRef.current.click();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const formatMessage = (text) => {
    if (typeof text !== 'string') return text;
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  // Add countdown timer effect
  useEffect(() => {
    if (rateLimitTime) {
      const timer = setInterval(() => {
        setRateLimitTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [rateLimitTime]);

  // Format time remaining
  const formatTimeRemaining = (seconds) => {
    if (seconds < 60) return `${seconds} seconds`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`;
  };

  // Share handler: copy current page URL to clipboard
  const handleShare = async (chat) => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(chat.id);
      setTimeout(() => setCopiedId(null), 1200);
    } catch {
      alert('Failed to copy URL.');
    }
    setMenuOpenId(null);
  };

  // Rename handler
  const handleRename = (chat) => {
    setRenamingId(chat.id);
    setRenameValue(chat.name);
    setMenuOpenId(null);
  };
  const handleRenameChange = (e) => setRenameValue(e.target.value);
  const handleRenameBlur = (chatId) => {
    if (renameValue.trim()) {
      updateChatName(chatId, renameValue.trim());
    }
    setRenamingId(null);
  };
  const handleRenameKeyDown = (e, chatId) => {
    if (e.key === 'Enter') {
      e.target.blur();
    } else if (e.key === 'Escape') {
      setRenamingId(null);
    }
  };

  // Voice recognition logic
  const handleVoiceClick = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition is not supported in this browser.');
      return;
    }
    if (listening) {
      recognitionRef.current && recognitionRef.current.stop();
      setListening(false);
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript);
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  // Add like/dislike state to messages if not present
  const ensureBotMsgState = (messages) =>
    messages.map(msg =>
      msg.from === 'bot'
        ? { ...msg, liked: msg.liked || false, disliked: msg.disliked || false }
        : msg
    );

  // In Chat component, update setChats to ensure bot messages have like/dislike state
  useEffect(() => {
    setChats(prevChats =>
      prevChats.map(chat => ({
        ...chat,
        messages: ensureBotMsgState(chat.messages),
      }))
    );
  }, []);

  // Add handlers
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setToast('Copied to clipboard!');
    setTimeout(() => setToast(null), 1500);
  };
  const handleLike = (msgId) => {
    setChats(prev => prev.map(chat =>
      chat.id === currentChatId
        ? {
            ...chat,
            messages: chat.messages.map(msg =>
              msg.id === msgId
                ? { ...msg, liked: !msg.liked, disliked: false }
                : msg
            )
          }
        : chat
    ));
    setToast('Upvoted Response!');
    setTimeout(() => setToast(null), 1500);
  };
  const handleDislike = (msgId) => {
    setChats(prev => prev.map(chat =>
      chat.id === currentChatId
        ? {
            ...chat,
            messages: chat.messages.map(msg =>
              msg.id === msgId
                ? { ...msg, disliked: !msg.disliked, liked: false }
                : msg
            )
          }
        : chat
    ));
    setToast('Downvoted Response!');
    setTimeout(() => setToast(null), 1500);
  };

  // Helper to check if a bot message is the last and finished
  const isBotReplyFinished = (msg, idx, messages) => {
    if (msg.from !== 'bot' || !msg.text || !msg.text.trim()) return false;
    // If this is the last message and it's empty, it's still streaming
    if (idx === messages.length - 1 && (!msg.text || !msg.text.trim())) return false;
    // If this is the last message and it's not empty, it's finished
    if (idx === messages.length - 1) return !!msg.text && !!msg.text.trim();
    // For previous bot messages, always show actions if not empty
    return true;
  };

  return (
    <ErrorBoundary>
      <div className={`chat-root ${theme}-theme`}>
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
                    {renamingId === chat.id ? (
                      <input
                        className="chat-rename-input"
                        value={renameValue}
                        autoFocus
                        onChange={handleRenameChange}
                        onBlur={() => handleRenameBlur(chat.id)}
                        onKeyDown={e => handleRenameKeyDown(e, chat.id)}
                        style={{ flex: 1, fontSize: '1rem', borderRadius: 4, border: '1.5px solid #565869', padding: '4px 8px', background: '#23242b', color: '#fff' }}
                        maxLength={40}
                      />
                    ) : (
                      <span className="chat-name">{chat.name}</span>
                    )}
                    <button
                      className="chat-menu-btn"
                      onClick={e => { e.stopPropagation(); setMenuOpenId(menuOpenId === chat.id ? null : chat.id); }}
                      tabIndex={0}
                      aria-label="Open chat menu"
                    >
                      {ellipsisIcon}
                    </button>
                    {menuOpenId === chat.id && (
                      <div className="chat-menu-dropdown" onClick={e => e.stopPropagation()}>
                        <button className="chat-menu-item" onClick={() => handleShare(chat)}>
                          {shareIcon} <span style={{marginLeft: 8}}>{copiedId === chat.id ? 'Copied!' : 'Share'}</span>
                        </button>
                        <button className="chat-menu-item" onClick={() => handleRename(chat)}>
                          {pencilIcon} <span style={{marginLeft: 8}}>Rename</span>
                        </button>
                        <button className="chat-menu-item delete" onClick={() => { setConfirmDeleteId(chat.id); setMenuOpenId(null); }}>
                          {trashIcon} <span style={{marginLeft: 8}}>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </aside>
        <ConfirmModal
          open={!!confirmDeleteId}
          onCancel={() => setConfirmDeleteId(null)}
          onConfirm={() => {
            deleteChat(confirmDeleteId);
            setConfirmDeleteId(null);
          }}
        />
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
            {/* Premium Icon Button */}
            <button
              className="premium-btn"
              style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: 12 }}
              onClick={() => {
                localStorage.removeItem('forceBasic');
                if (localStorage.getItem('isPremiumUser') === 'true') {
                  navigate('/premium-chat');
                } else {
                  navigate('/premium');
                }
              }}
              title="Premium Model"
            >
              {crownIcon}
            </button>
            <button
              className="theme-toggle-btn right"
              onClick={toggleTheme}
              aria-label="Toggle dark/light mode"
            >
              {theme === 'dark' ? sunIcon : moonIcon}
            </button>
            <div className="chat-profile">{profileLogo}</div>
          </header>
          <section className="chat-history">
            {currentChat?.messages.map((msg, idx) => (
              <div key={msg.id} className={`chat-msg ${msg.from}`}>
                <div className="chat-msg-inner">
                  {msg.image ? (
                    <div className="generated-image">
                      <img 
                        src={msg.image} 
                        alt={msg.text} 
                        style={{ 
                          maxWidth: '400px',
                          maxHeight: '400px',
                          borderRadius: '8px',
                          objectFit: 'contain'
                        }} 
                      />
                      {msg.text && <p>{msg.text}</p>}
                    </div>
                  ) : msg.from === 'bot' ? (
                    <>
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({node, ...props}) => <p {...props} />,
                          code: ({node, inline, ...props}) => 
                            inline ? <code {...props} /> : <pre><code {...props} /></pre>,
                          ul: ({node, ...props}) => <ul {...props} />,
                          ol: ({node, ...props}) => <ol {...props} />,
                          li: ({node, ...props}) => <li {...props} />,
                          blockquote: ({node, ...props}) => <blockquote {...props} />,
                          a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" />,
                          table: ({node, ...props}) => <table {...props} />,
                          th: ({node, ...props}) => <th {...props} />,
                          td: ({node, ...props}) => <td {...props} />
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                      {isBotReplyFinished(msg, idx, currentChat?.messages) && (
                        <div className="bot-msg-actions">
                          <button className="bot-action-btn" title="Copy" onClick={() => handleCopy(msg.text)}>{copyIcon}</button>
                          <button className={`bot-action-btn${msg.liked ? ' liked' : ''}`} title="Like" onClick={() => handleLike(msg.id)}>{likeIcon}</button>
                          <button className={`bot-action-btn${msg.disliked ? ' disliked' : ''}`} title="Dislike" onClick={() => handleDislike(msg.id)}>{dislikeIcon}</button>
                        </div>
                      )}
                    </>
                  ) : (
                    formatMessage(msg.text)
                  )}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </section>
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
          <form className="chat-input-bar" onSubmit={handleSend}>
            {pendingImage && (
              <div className="pending-image-preview">
                <img src={pendingImage.url} alt="preview" style={{ maxWidth: 80, maxHeight: 80, borderRadius: 8, marginRight: 12 }} />
                <button
                  type="button"
                  className="delete-chat-btn"
                  style={{ opacity: 1, position: 'absolute', left: 70, top: 8, background: '#23242b' }}
                  onClick={() => setPendingImage(null)}
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            )}
            <input
              type="text"
              placeholder={rateLimitTime ? `Please wait ${formatTimeRemaining(rateLimitTime)}...` : "Type a message..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="chat-input"
              disabled={isLoading || uploading || rateLimitTime}
              autoFocus
            />
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={uploading || rateLimitTime}
            />
            <div className="chat-actions">
              <button
                type="button"
                className="chat-action-btn"
                onClick={handleAttachmentClick}
                disabled={uploading || rateLimitTime}
                title="Upload image"
              >
                {attachmentIcon}
              </button>
              <button
                type="button"
                className="chat-action-btn"
                onClick={handleVoiceClick}
                disabled={listening || rateLimitTime}
                title={listening ? "Stop recording" : "Start voice input"}
              >
                {micIcon}
              </button>
              <button
                type="submit"
                className="chat-send-btn"
                disabled={isLoading || uploading || rateLimitTime || (!input.trim() && !pendingImage)}
              >
                {isLoading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  'Send'
                )}
              </button>
            </div>
          </form>
        </main>
        {toast && (
          <div className="chat-toast">
            <span className="chat-toast-icon">{checkCircleIcon}</span>
            <span className="chat-toast-text">{toast}</span>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Chat; 
