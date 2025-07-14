import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import ParticlesBackground from "../components/ParticlesBackground";

const Register = () => {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    // First Name validation
    if (!form.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (form.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    } else if (/\d/.test(form.firstName)) {
      newErrors.firstName = "First name cannot contain numbers";
    }

    // Last Name validation
    if (!form.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (form.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    } else if (/\d/.test(form.lastName)) {
      newErrors.lastName = "Last name cannot contain numbers";
    }

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
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
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
    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      navigate("/login");
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-modern-root" style={{ position: 'relative', overflow: 'hidden' }}>
      <ParticlesBackground />
      <form className="register-modern-form" onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1 }}>
        <h1 className="register-modern-title">Let's Get Started</h1>
        <div className="register-modern-subtitle">Create your Intellibot account</div>
        {errors.submit && <div className="register-modern-error">{errors.submit}</div>}
        
        <div className="register-modern-input-group">
          <span className="register-modern-icon">
            <svg width="22" height="22" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a7.5 7.5 0 0 1 13 0"/></svg>
          </span>
          <input
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            className={`register-modern-input ${errors.firstName ? 'error' : ''}`}
            autoComplete="given-name"
          />
        </div>
        {errors.firstName && <div className="register-modern-field-error">{errors.firstName}</div>}

        <div className="register-modern-input-group">
          <span className="register-modern-icon">
            <svg width="22" height="22" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a7.5 7.5 0 0 1 13 0"/></svg>
          </span>
          <input
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            className={`register-modern-input ${errors.lastName ? 'error' : ''}`}
            autoComplete="family-name"
          />
        </div>
        {errors.lastName && <div className="register-modern-field-error">{errors.lastName}</div>}

        <div className="register-modern-input-group">
          <span className="register-modern-icon">
            <svg width="22" height="22" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M22 5 12 13 2 5"/></svg>
          </span>
          <input
            name="email"
            type="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
            className={`register-modern-input ${errors.email ? 'error' : ''}`}
            autoComplete="email"
          />
        </div>
        {errors.email && <div className="register-modern-field-error">{errors.email}</div>}

        <div className="register-modern-input-group">
          <span className="register-modern-icon">
            <svg width="22" height="22" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </span>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className={`register-modern-input ${errors.password ? 'error' : ''}`}
            autoComplete="new-password"
          />
        </div>
        {errors.password && <div className="register-modern-field-error">{errors.password}</div>}

        <button 
          type="submit" 
          className="register-modern-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Account...' : 'CREATE'}
        </button>
        <div className="register-modern-login-link">
          Back to <a href="/login">Login</a>
        </div>
      </form>
    </div>
  );
};

export default Register; 