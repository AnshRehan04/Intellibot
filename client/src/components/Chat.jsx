import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Create image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    setSelectedImage(file);
    setIsProcessingImage(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:3001/api/extract-text', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const extractedText = response.data.extractedText;
      setInput(prev => prev + (prev ? '\n\n' : '') + `[Image text: ${extractedText}]`);
    } catch (err) {
      setError('Error processing image: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsProcessingImage(false);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() && !selectedImage) return;

    const userMessage = input.trim();
    setInput('');
    setError(null);
    setIsLoading(true);
    removeImage();

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await axios.post('http://localhost:3001/api/chat', {
        message: userMessage
      }, {
        responseType: 'stream',
        onDownloadProgress: (progressEvent) => {
          const lines = progressEvent.currentTarget.responseText.split('\n');
          const lastLine = lines[lines.length - 2];
          if (lastLine && lastLine.startsWith('data: ')) {
            try {
              const data = JSON.parse(lastLine.slice(6));
              if (data.reply) {
                setMessages(prev => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  if (lastMessage && lastMessage.role === 'assistant') {
                    lastMessage.content = data.reply;
                  } else {
                    newMessages.push({ role: 'assistant', content: data.reply });
                  }
                  return newMessages;
                });
              }
            } catch (e) {
              console.error('Error parsing stream data:', e);
            }
          }
        }
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Error sending message');
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>AI Chat Assistant</h1>
        <p>Ask me anything or upload an image to extract text</p>
      </div>

      <div className="messages">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <h2>👋 Welcome!</h2>
            <p>I'm your AI assistant. I can help you with:</p>
            <ul>
              <li>Answering questions</li>
              <li>Extracting text from images</li>
              <li>Having a conversation</li>
            </ul>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <div className="message-content">
                {msg.role === 'assistant' && (
                  <div className="assistant-avatar">AI</div>
                )}
                <div className="message-text">{msg.content}</div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="input-form">
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" />
            <button type="button" className="remove-image" onClick={removeImage}>
              ×
            </button>
          </div>
        )}
        <div className="input-container">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading || isProcessingImage}
            rows={1}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
          />
          <div className="button-container">
            <label className="upload-button" title="Upload Image">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isLoading || isProcessingImage}
                style={{ display: 'none' }}
              />
              <span className="upload-icon">📷</span>
            </label>
            <button 
              type="submit" 
              disabled={isLoading || isProcessingImage || (!input.trim() && !selectedImage)}
              className={isLoading ? 'loading' : ''}
            >
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                'Send'
              )}
            </button>
          </div>
        </div>
        {isProcessingImage && (
          <div className="processing-message">
            <span className="processing-spinner"></span>
            Processing image...
          </div>
        )}
      </form>
    </div>
  );
};

export default Chat; 