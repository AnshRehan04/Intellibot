import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import ParticlesBackground from "../components/ParticlesBackground";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!form.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
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

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      if (data.user.premium) {
        localStorage.setItem('isPremiumUser', 'true');
      } else {
        localStorage.removeItem('isPremiumUser');
      }
      
      setSuccess(true);
      
      // Navigate to chat page after successful login
      setTimeout(() => {
        navigate("/chat");
      }, 1000);
      
    } catch (err) {
      console.error('Login error:', err);
      setErrors({ submit: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-modern-root" style={{ position: 'relative', overflow: 'hidden' }}>
      <ParticlesBackground />
      <form className="login-modern-form" onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1 }}>
        {/* <img
          src="https://assets-v2.lottiefiles.com/a/0e7e2e2e-1172-11ee-8b1e-6b7e3e3e3e3e/0e7e2e2e-1172-11ee-8b1e-6b7e3e3e3e3e.svg"
          alt="login-illustration"
          className="login-modern-illustration"
        /> */}
        <h1 className="login-modern-title">Welcome back!</h1>
        <div className="login-modern-subtitle">Log in to your existant account of Intellibot</div>
        {errors.submit && <div className="login-modern-error">{errors.submit}</div>}
        {success && <div className="login-modern-success">Login successful! Redirecting...</div>}
        
        <div className="login-modern-input-group">
          <span className="login-modern-icon">
            <svg width="22" height="22" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M22 5 12 13 2 5"/></svg>
          </span>
          <input
            name="email"
            type="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
            className={`login-modern-input ${errors.email ? 'error' : ''}`}
            autoComplete="email"
            disabled={isSubmitting}
          />
        </div>
        {errors.email && <div className="login-modern-field-error">{errors.email}</div>}

        <div className="login-modern-input-group">
          <span className="login-modern-icon">
            <svg width="22" height="22" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </span>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className={`login-modern-input ${errors.password ? 'error' : ''}`}
            autoComplete="current-password"
            disabled={isSubmitting}
          />
        </div>
        {errors.password && <div className="login-modern-field-error">{errors.password}</div>}

        <div className="login-modern-forgot">
          <Link to="/forgot-password" className="login-modern-forgot-link">Forgot Password?</Link>
        </div>
        <button 
          type="submit" 
          className="login-modern-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'LOG IN'}
        </button>
        <div className="login-modern-register-link">
          Don't have an account? <a href="/register">Register</a>
        </div>
      </form>
    </div>
  );
};

export default Login; 
