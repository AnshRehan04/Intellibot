import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("https://intellibot-rswr.onrender.com/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setMessage("Password has been reset. You can now log in.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-modern-root" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form className="login-modern-form" onSubmit={handleSubmit} style={{ minWidth: 340 }}>
        <h1 className="login-modern-title">Reset Password</h1>
        <div className="login-modern-subtitle">Enter your new password</div>
        {message && <div className="login-modern-success">{message}</div>}
        {error && <div className="login-modern-error">{error}</div>}
        <div className="login-modern-input-group">
          <span className="login-modern-icon">
            <svg width="22" height="22" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </span>
          <input
            type="password"
            name="password"
            placeholder="New Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="login-modern-input"
            autoComplete="new-password"
            required
            disabled={loading}
          />
        </div>
        <div className="login-modern-input-group">
          <span className="login-modern-icon">
            <svg width="22" height="22" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </span>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="login-modern-input"
            autoComplete="new-password"
            required
            disabled={loading}
          />
        </div>
        <button type="submit" className="login-modern-btn" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
        <div className="login-modern-register-link">
          <a href="/login">Back to Login</a>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword; 
