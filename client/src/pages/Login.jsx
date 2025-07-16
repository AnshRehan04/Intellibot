import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import ParticlesBackground from "../components/ParticlesBackground";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!form.password) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    setErrors({});
    setSuccess(false);
    try {
      const res = await fetch('https://intellibot-rswr.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      localStorage.setItem('user', JSON.stringify(data.user));
      if (data.user.premium) {
        localStorage.setItem('isPremiumUser', 'true');
      } else {
        localStorage.removeItem('isPremiumUser');
      }
      setSuccess(true);
      setTimeout(() => {
        navigate("/chat");
      }, 1000);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-2col-root">
      <ParticlesBackground />
      <div className="register-2col-container">
        {/* Left Side Branding */}
        <div className="register-2col-left">
          <div className="register-2col-logo">Intellibot</div>
          <Link to="/" className="register-2col-back">Back to website →</Link>
          <div className="register-2col-image" style={{backgroundImage: "url('https://www.zdnet.com/a/img/resize/b2bd2bc7cd78eb5ea5d19eb4441b8587b891063c/2024/07/05/53cac1d6-4755-48b4-986b-7d4ae4783c67/gettyimages-2017675411.jpg?auto=webp&width=1280')"}} />
        </div>
        {/* Right Side Form */}
        <div className="register-2col-right">
          <form className="register-2col-form" onSubmit={handleSubmit}>
            <h1 className="register-2col-title">Welcome back!</h1>
            <div className="register-2col-login-link" style={{marginBottom: 24}}>
              Log in to your existant account of Intellibot
            </div>
            {errors.submit && <div className="register-2col-error">{errors.submit}</div>}
            {success && <div className="register-2col-success">Login successful! Redirecting...</div>}
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className={`register-2col-input ${errors.email ? 'error' : ''}`}
              autoComplete="email"
              disabled={isSubmitting}
            />
            {errors.email && <div className="register-2col-field-error">{errors.email}</div>}
            <div className="register-2col-password-group">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className={`register-2col-input ${errors.password ? 'error' : ''}`}
                autoComplete="current-password"
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="register-2col-eye-btn"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? (
                  <svg width="22" height="22" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17.94 17.94A10.06 10.06 0 0 1 12 19c-5 0-9.27-3.11-11-7.5a12.32 12.32 0 0 1 2.1-3.36M6.1 6.1A9.94 9.94 0 0 1 12 5c5 0 9.27 3.11 11 7.5a12.32 12.32 0 0 1-2.1 3.36M1 1l22 22" /><circle cx="12" cy="12" r="3" /></svg>
                ) : (
                  <svg width="22" height="22" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
            {errors.password && <div className="register-2col-field-error">{errors.password}</div>}
            <div className="register-2col-forgot-row">
              <Link to="/forgot-password" className="register-2col-forgot-link">Forgot Password?</Link>
            </div>
            <button 
              type="submit" 
              className="register-2col-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'LOG IN'}
            </button>
            <div className="register-2col-register-link">
              <Link to="/register">Register</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 
