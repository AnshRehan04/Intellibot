import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const res = await fetch("https://intellibot-rswr.onrender.com/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "We cannot find your email.");
      setMessage("If this email is registered, a reset link has been sent.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-2col-root" style={{ background: 'radial-gradient(circle at 50% 0%, #ede9fe 0%, #f5f3ff 60%, #fff 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 420, maxWidth: '95vw', background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px rgba(37,99,235,0.10)', padding: '0 0 32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Blue header with icon */}
        <div style={{ width: '100%', background: '#6C47F5', borderTopLeftRadius: 18, borderTopRightRadius: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0 18px 0' }}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="32" fill="#fff"/>
            <path d="M32 18v18" stroke="#6C47F5" strokeWidth="4" strokeLinecap="round"/>
            <circle cx="32" cy="44" r="3" fill="#6C47F5"/>
            <circle cx="32" cy="32" r="28" stroke="#6C47F5" strokeWidth="4"/>
          </svg>
        </div>
        {/* Card content */}
        <form onSubmit={handleSubmit} style={{ width: '100%', padding: '0 32px', marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.6rem', margin: '18px 0 6px 0', color: '#23202b', textAlign: 'center' }}>Forgot Password</h2>
          <div style={{ color: '#444', fontSize: '1.08rem', marginBottom: 18, textAlign: 'center' }}>
            Enter your email and we'll send you a link to reset your password.
          </div>
          <div className="register-modern-input-group" style={{ width: '100%', marginBottom: 0 }}>
            <span className="register-modern-icon">
              <svg width="22" height="22" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M22 5 12 13 2 5"/></svg>
            </span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="register-modern-input"
              autoComplete="email"
              required
              disabled={loading}
              style={{ background: 'transparent' }}
            />
          </div>
          {error && <div style={{ color: '#dc2626', fontSize: '1rem', margin: '8px 0 0 0', width: '100%', textAlign: 'left' }}>{error}</div>}
          {message && <div style={{ color: '#16a34a', fontSize: '1rem', margin: '8px 0 0 0', width: '100%', textAlign: 'left' }}>{message}</div>}
          <button type="submit" style={{ background: '#6C47F5', color: '#fff', border: 'none', borderRadius: 32, padding: '16px 0', fontSize: '1.18rem', fontWeight: 700, cursor: 'pointer', marginTop: 24, width: '100%', boxShadow: '0 4px 16px #6C47F522', transition: 'background 0.2s, transform 0.2s', letterSpacing: 1, textTransform: 'uppercase' }} disabled={loading}>
            {loading ? "Sending..." : "Submit"}
          </button>
          <div style={{ width: '100%', textAlign: 'center', marginTop: 18 }}>
            <Link to="/login" style={{ color: '#23202b', textDecoration: 'none', fontWeight: 500, fontSize: '1rem' }}>&lt; Back to Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword; 
