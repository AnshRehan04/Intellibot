import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Chat.css';

const sunIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
);
const moonIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>
);

const Premium = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle('light-theme', theme === 'light');
    document.body.classList.toggle('dark-theme', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const crownIcon = (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="gold" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 6l5 12 5-9 5 9 5-12" />
      <circle cx="12" cy="17" r="2" fill="gold" />
    </svg>
  );

  const handleUpgrade = () => {
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = openRazorpay;
      document.body.appendChild(script);
    } else {
      openRazorpay();
    }
  };

  const openRazorpay = () => {
    const options = {
      key: 'rzp_test_641E6FmJMKR5kO',
      amount: 49900,
      currency: 'INR',
      name: 'Intellibot Premium',
      description: 'Unlock premium features',
      image: '',
      handler: async function () {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.email) {
          await fetch('http://localhost:5000/api/upgrade-to-premium', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email })
          });
        }
        localStorage.setItem('isPremiumUser', 'true');
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate('/premium-chat');
        }, 1500);
      },
      prefill: {
        name: '',
        email: '',
      },
      theme: {
        color: '#FFD700',
      },
      modal: {
        ondismiss: function () {}
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className={`chat-root ${theme}-theme`}>
      <main className="chat-main sidebar-closed">
        <header className="chat-header">
          <div style={{ flex: 1 }} />
        </header>
        <section className="chat-history" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="gold" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 6l5 12 5-9 5 9 5-12" />
            <circle cx="12" cy="17" r="2" fill="gold" />
          </svg>
          <h1 style={{ color: '#FFD700', marginTop: 24 }}>Premium Model</h1>
          <p style={{ color: '#fff', maxWidth: 400, textAlign: 'center' }}>
            Unlock image generation and other advanced features with our Premium Model!
          </p>
          <button
            style={{ marginTop: 32, padding: '12px 32px', fontSize: 18, borderRadius: 8, background: 'gold', color: '#222', border: 'none', cursor: 'pointer' }}
            onClick={handleUpgrade}
          >
            Upgrade Now
          </button>
        </section>
        {showSuccess && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
            <div style={{ background: '#fff', padding: 40, borderRadius: 12, textAlign: 'center', minWidth: 300 }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4BB543" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2l4-4"/></svg>
              <h2 style={{ color: '#4BB543', margin: '16px 0 0 0' }}>Payment Success!</h2>
              <p style={{ color: '#222', marginTop: 8 }}>Redirecting to Premium Chat...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Premium; 