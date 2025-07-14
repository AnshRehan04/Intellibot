import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setMessage("If this email is registered, a reset link has been sent.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-modern-root" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form className="login-modern-form" onSubmit={handleSubmit} style={{ minWidth: 340 }}>
        <h1 className="login-modern-title">Forgot Password</h1>
        <div className="login-modern-subtitle">Enter your email to receive a reset link</div>
        {message && <div className="login-modern-success">{message}</div>}
        {error && <div className="login-modern-error">{error}</div>}
        <div className="login-modern-input-group">
          <span className="login-modern-icon">
            <svg width="22" height="22" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M22 5 12 13 2 5"/></svg>
          </span>
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="login-modern-input"
            autoComplete="email"
            required
            disabled={loading}
          />
        </div>
        <button type="submit" className="login-modern-btn" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
        <div className="login-modern-register-link">
          <a href="/login">Back to Login</a>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword; 
