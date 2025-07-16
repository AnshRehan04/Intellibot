// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Register.css";
// import ParticlesBackground from "../components/ParticlesBackground";

// const Register = () => {
//   const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();

//   const validateForm = () => {
//     const newErrors = {};
    
//     // First Name validation
//     if (!form.firstName.trim()) {
//       newErrors.firstName = "First name is required";
//     } else if (form.firstName.length < 2) {
//       newErrors.firstName = "First name must be at least 2 characters";
//     } else if (/\d/.test(form.firstName)) {
//       newErrors.firstName = "First name cannot contain numbers";
//     }

//     // Last Name validation
//     if (!form.lastName.trim()) {
//       newErrors.lastName = "Last name is required";
//     } else if (form.lastName.length < 2) {
//       newErrors.lastName = "Last name must be at least 2 characters";
//     } else if (/\d/.test(form.lastName)) {
//       newErrors.lastName = "Last name cannot contain numbers";
//     }

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!form.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!emailRegex.test(form.email)) {
//       newErrors.email = "Please enter a valid email address";
//     }

//     // Password validation
//     if (!form.password) {
//       newErrors.password = "Password is required";
//     } else if (form.password.length < 8) {
//       newErrors.password = "Password must be at least 8 characters";
//     } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
//       newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
//     }

//     return newErrors;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: "" }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationErrors = validateForm();
    
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const res = await fetch('https://intellibot-rswr.onrender.com/api/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(form),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || 'Registration failed');
//       navigate("/login");
//     } catch (err) {
//       setErrors({ submit: err.message });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="register-modern-root" style={{ position: 'relative', overflow: 'hidden' }}>
//       <ParticlesBackground />
//       <form className="register-modern-form" onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1 }}>
//         <h1 className="register-modern-title">Let's Get Started</h1>
//         <div className="register-modern-subtitle">Create your Intellibot account</div>
//         {errors.submit && <div className="register-modern-error">{errors.submit}</div>}
        
//         <div className="register-modern-input-group">
//           <span className="register-modern-icon">
//             <svg width="22" height="22" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a7.5 7.5 0 0 1 13 0"/></svg>
//           </span>
//           <input
//             name="firstName"
//             placeholder="First Name"
//             value={form.firstName}
//             onChange={handleChange}
//             className={`register-modern-input ${errors.firstName ? 'error' : ''}`}
//             autoComplete="given-name"
//           />
//         </div>
//         {errors.firstName && <div className="register-modern-field-error">{errors.firstName}</div>}

//         <div className="register-modern-input-group">
//           <span className="register-modern-icon">
//             <svg width="22" height="22" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a7.5 7.5 0 0 1 13 0"/></svg>
//           </span>
//           <input
//             name="lastName"
//             placeholder="Last Name"
//             value={form.lastName}
//             onChange={handleChange}
//             className={`register-modern-input ${errors.lastName ? 'error' : ''}`}
//             autoComplete="family-name"
//           />
//         </div>
//         {errors.lastName && <div className="register-modern-field-error">{errors.lastName}</div>}

//         <div className="register-modern-input-group">
//           <span className="register-modern-icon">
//             <svg width="22" height="22" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M22 5 12 13 2 5"/></svg>
//           </span>
//           <input
//             name="email"
//             type="email"
//             placeholder="E-mail"
//             value={form.email}
//             onChange={handleChange}
//             className={`register-modern-input ${errors.email ? 'error' : ''}`}
//             autoComplete="email"
//           />
//         </div>
//         {errors.email && <div className="register-modern-field-error">{errors.email}</div>}

//         <div className="register-modern-input-group">
//           <span className="register-modern-icon">
//             <svg width="22" height="22" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
//           </span>
//           <input
//             name="password"
//             type="password"
//             placeholder="Password"
//             value={form.password}
//             onChange={handleChange}
//             className={`register-modern-input ${errors.password ? 'error' : ''}`}
//             autoComplete="new-password"
//           />
//         </div>
//         {errors.password && <div className="register-modern-field-error">{errors.password}</div>}

//         <button 
//           type="submit" 
//           className="register-modern-btn"
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? 'Creating Account...' : 'CREATE'}
//         </button>
//         <div className="register-modern-login-link">
//           Back to <a href="/login">Login</a>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Register; 







import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";
import ParticlesBackground from "../components/ParticlesBackground";

const Register = () => {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!form.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (form.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    } else if (/\d/.test(form.firstName)) {
      newErrors.firstName = "First name cannot contain numbers";
    }
    if (!form.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (form.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    } else if (/\d/.test(form.lastName)) {
      newErrors.lastName = "Last name cannot contain numbers";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }
    if (!agree) {
      newErrors.agree = "You must agree to the Terms & Conditions";
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
    try {
      const res = await fetch('https://intellibot-rswr.onrender.com/api/register', {
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
    <div className="register-2col-root">
      <ParticlesBackground />
      <div className="register-2col-container">
        {/* Left Side Branding */}
        <div className="register-2col-left">
          <div className="register-2col-logo">Intellibot</div>
          <Link to="/" className="register-2col-back">Back to website →</Link>
          <div className="register-2col-image" />
          <div className="register-2col-caption">
            {/* <div>Capturing Moments,<br />Creating Memories</div> */}
          </div>
        </div>
        {/* Right Side Form */}
        <div className="register-2col-right">
          <form className="register-2col-form" onSubmit={handleSubmit}>
            <h1 className="register-2col-title">Create an account</h1>
            <div className="register-2col-login-link">
              Already have an account? <Link to="/login">Log in</Link>
            </div>
            {errors.submit && <div className="register-2col-error">{errors.submit}</div>}
            <div className="register-2col-row">
              <input
                name="firstName"
                placeholder="First name"
                value={form.firstName}
                onChange={handleChange}
                className={`register-2col-input ${errors.firstName ? 'error' : ''}`}
                autoComplete="given-name"
              />
              <input
                name="lastName"
                placeholder="Last name"
                value={form.lastName}
                onChange={handleChange}
                className={`register-2col-input ${errors.lastName ? 'error' : ''}`}
                autoComplete="family-name"
              />
            </div>
            {errors.firstName && <div className="register-2col-field-error">{errors.firstName}</div>}
            {errors.lastName && <div className="register-2col-field-error">{errors.lastName}</div>}
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className={`register-2col-input ${errors.email ? 'error' : ''}`}
              autoComplete="email"
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
                autoComplete="new-password"
              />
              <button
                type="button"
                className="register-2col-eye-btn"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? (
                  // Eye-off SVG
                  <svg width="22" height="22" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17.94 17.94A10.06 10.06 0 0 1 12 19c-5 0-9.27-3.11-11-7.5a12.32 12.32 0 0 1 2.1-3.36M6.1 6.1A9.94 9.94 0 0 1 12 5c5 0 9.27 3.11 11 7.5a12.32 12.32 0 0 1-2.1 3.36M1 1l22 22" /><circle cx="12" cy="12" r="3" /></svg>
                ) : (
                  // Eye SVG
                  <svg width="22" height="22" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
            {errors.password && <div className="register-2col-field-error">{errors.password}</div>}
            <div className="register-2col-checkbox-row">
              <input
                type="checkbox"
                id="agree"
                checked={agree}
                onChange={e => setAgree(e.target.checked)}
              />
              <label htmlFor="agree">
                I agree to the <a href="#"  rel="noopener noreferrer">Terms & Conditions</a>
              </label>
            </div>
            {errors.agree && <div className="register-2col-field-error">{errors.agree}</div>}
            <button
              type="submit"
              className="register-2col-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Create account'}
            </button>
            {/* <div className="register-2col-or">Or register with</div>
            <div className="register-2col-social-row">
              <button type="button" className="register-2col-social-btn google" disabled>
                <span className="register-2col-social-icon">{String.fromCodePoint(0x1F5A5)}</span> Google
              </button>
              <button type="button" className="register-2col-social-btn apple" disabled>
                <span className="register-2col-social-icon">{String.fromCodePoint(0xF8FF)}</span> Apple
              </button>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register; 
