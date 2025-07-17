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
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: 370, maxWidth: '95vw', background: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(37,99,235,0.10)', padding: '38px 32px 28px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Key Icon - overlapping top */}
        <div style={{ position: 'absolute', top: -48, left: '50%', transform: 'translateX(-50%)', background: '#3b4ed8', borderRadius: '50%', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px #3b4ed822' }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="22" stroke="#fff" strokeWidth="4" fill="none"/>
            <rect x="18" y="20" width="12" height="8" rx="2" fill="#fff"/>
            <rect x="28" y="24" width="8" height="4" rx="2" fill="#fff"/>
            <circle cx="32" cy="26" r="1.5" fill="#3b4ed8"/>
            <rect x="22" y="16" width="4" height="8" rx="2" fill="#fff"/>
          </svg>
        </div>
        <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 48, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.6rem', margin: '0 0 18px 0', color: '#2d3396', textAlign: 'center' }}>Reset Password</h2>
          <div style={{ width: '100%', marginBottom: 12 }}>
            <label htmlFor="password" style={{ color: '#2d3396', fontWeight: 500, fontSize: '1.05rem', marginBottom: 4, display: 'block' }}>New Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1.5px solid #d1d5db', fontSize: '1rem', marginBottom: 8, outline: 'none' }}
              autoComplete="new-password"
              required
              disabled={loading}
            />
          </div>
          <div style={{ width: '100%', marginBottom: 18 }}>
            <label htmlFor="confirmPassword" style={{ color: '#2d3396', fontWeight: 500, fontSize: '1.05rem', marginBottom: 4, display: 'block' }}>Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1.5px solid #d1d5db', fontSize: '1rem', marginBottom: 8, outline: 'none' }}
              autoComplete="new-password"
              required
              disabled={loading}
            />
          </div>
          {error && <div style={{ color: '#dc2626', fontSize: '1rem', margin: '0 0 8px 0', width: '100%', textAlign: 'left' }}>{error}</div>}
          {message && <div style={{ color: '#16a34a', fontSize: '1rem', margin: '0 0 8px 0', width: '100%', textAlign: 'left' }}>{message}</div>}
          <div style={{ width: '100%', display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" style={{ background: '#3b4ed8', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 28px', fontSize: '1.08rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px #3b4ed822', transition: 'background 0.2s' }} disabled={loading}>
              {loading ? "Resetting..." : "Continue"}
            </button>
            <button type="button" style={{ background: 'none', color: '#2d3396', border: 'none', padding: '10px 18px', fontSize: '1.08rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', boxShadow: 'none' }} disabled={loading} onClick={() => navigate('/login')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword; 
