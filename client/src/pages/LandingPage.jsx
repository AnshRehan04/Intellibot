import React from "react";
import "./LandingPage.css";
import { Link } from "react-router-dom";

const companies = [
  { name: "ATLASIAN" },
  { name: "shopify" },
  { name: "PixelCloud" },
  { name: "corion" },
];

const features = [
  { icon: "💬", label: "Chat Tools" },
  { icon: "🎨", label: "Customization" },
  { icon: "🤝", label: "Engaging Customer" },
  { icon: "📊", label: "Report Analytics" },
];

const LandingPage = () => (
  <div className="landing3d-root">
    {/* Navbar */}
    <nav className="navbar3d">
      <div className="navbar3d-logo">
        <span className="logo3d-icon">💬</span>
        <span className="logo3d-text">Intellibot</span>
      </div>
      <ul className="navbar3d-links">
        <li>Use Cases</li>
        <li>Digital Art</li>
        <li>Pricing</li>
        <li>News</li>
      </ul>
      <div className="navbar3d-actions">
        {/* <button className="theme-toggle3d" title="Toggle theme">🌙</button>
        <select className="lang-select3d">
          <option value="en">🇬🇧 En</option>
          <option value="fr">🇫🇷 Fr</option>
        </select> */}
        <Link to="/login" className="login-btn3d">Login</Link>
      </div>
    </nav>

    {/* Hero Section */}
    <section className="hero3d-section">
      <div className="hero3d-content">
        <p className="hero3d-subtitle">Create Better Conversations with Less Effort.</p>
        <h1 className="hero3d-title">
          AI Powered <br />
          <span className="gradient3d-text">Intellibot</span>
        </h1>
        <p className="hero3d-desc">
          Write 10x faster, engage your audience & never struggle with the blank page again.<br />
          The number 1 AI collaborative chatbot software you ever need.
        </p>
        <Link to="/register" className="cta3d-btn">Get Started for Free</Link>
        <button className="learnmore3d-btn">Learn More</button>
      </div>
    </section>

    {/* Features Section (like screenshot) */}
    <section className="features2-root">
      <div className="features2-header">
        <span className="features2-ai-label">ARTIFICIAL INTELLIGENCE</span>
        <h1>Generate Quality Content Effortlessly</h1>
        <p className="features2-header-desc">
          Intellibot is the ultimate AI-powered chatbot to help you quickly create high-quality conversations that require minimal effort, time, and cost.
        </p>
      </div>
      <div className="features2-main">
        <div className="features2-card features2-card-purple">
          <h2>Let AI do all the magic for you</h2>
          <div className="features2-card-content">
           
            <p>
              Unlock the power of AI with our cutting-edge technology that helps you generate well-crafted and joyfully original conversations effortlessly.<br /><br />
              Our AI knows what converts and how to create chatbot flows that resonate with your audience.
            </p>
          </div>
        </div>
        <div className="features2-card features2-card-white">
          <h2>
            The <span className="features2-highlight">Only</span> Artificial Intelligence<br /> Service you ever need
          </h2>
          <p>
            Intuitive interface and minimal learning curve make Intellibot the ideal choice for anyone who needs to chat quickly without sacrificing quality and reach your milestones 10X faster!<br /><br />
            Intellibot is built to focus and create human-like conversations that help you generate engaging content and ideas for apps, social media, support, and much more.
          </p>
          
          <div className="features2-learnmore">
            Learn more about us <span className="features2-arrow">→</span>
          </div>
        </div>
      </div>
      <div className="features2-card features2-card-black">
        <h3>Save Time and Money</h3>
        <p>
          Save time and money with our automated system that empowers you to cut down your expenses while still getting great results.
        </p>
      </div>
    </section>

    {/* Features */}
    {/* <section className="features-section">
      <h2>Intellibot Features</h2>
      <p>Discover LiveChat's strengths and learn what makes it tick.</p>
      <div className="features-grid">
        {features.map((f) => (
          <div key={f.label} className="feature-item">
            <div className="feature-icon">{f.icon}</div>
            <span>{f.label}</span>
          </div>
        ))}
      </div>
    </section> */}

    {/* Call to Action Section (like screenshot) */}
    <section className="cta2-root">
      <div className="cta2-features">
        <div className="cta2-feature"><span role="img" aria-label="No error">🖊️</span> No more human error</div>
        <div className="cta2-feature"><span role="img" aria-label="Fast">⚡</span> Publish content 10X faster</div>
        <div className="cta2-feature"><span role="img" aria-label="Boost">🚀</span> Boost sales with better copy</div>
      </div>
      <h2 className="cta2-headline">Start your free trial today and witness the magic!</h2>
      <div className="cta2-subheadline">No credit card is required.</div>
      {/* <button className="cta2-btn">Get Started for Free <span className="cta2-arrow">→</span></button> */}

      
        <Link to="/register" className="cta2-btn">Get Started for Free<span className="cta2-arrow">→</span></Link>
    </section>

    {/* Newsletter Subscription Section (4th page) */}
    <section className="newsletter-root">
      <div className="newsletter-label">LATEST NEWS</div>
      <h2 className="newsletter-headline">Stay Updated With<br />Our Activities</h2>
      <div className="newsletter-desc">
        Subscribe to our newsletters and stay updated about our activities and much more. No spam, we promise.
      </div>
      <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
        <input
          type="email"
          className="newsletter-input"
          placeholder="Email address"
          required
        />
        <button type="submit" className="newsletter-btn">Subscribe</button>
      </form>
    </section>

    {/* Footer Section */}
    <footer className="footer-root">
      <div className="footer-socials">
        <a href="#" className="footer-social" aria-label="Facebook">
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.406.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.406 24 22.674V1.326C24 .592 23.406 0 22.675 0"/>
          </svg>
        </a>
        <a href="#" className="footer-social" aria-label="Twitter">
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.916 4.916 0 0 0-8.38 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.929-.856 2.01-.857 3.17 0 2.188 1.115 4.116 2.823 5.247a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.058 0 14.009-7.496 14.009-13.986 0-.21 0-.423-.016-.634A9.936 9.936 0 0 0 24 4.557z"/>
          </svg>
        </a>
        <a href="#" className="footer-social" aria-label="LinkedIn">
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22.23 0H1.77C.792 0 0 .771 0 1.723v20.549C0 23.229.792 24 1.77 24h20.459C23.208 24 24 23.229 24 22.271V1.723C24 .771 23.208 0 22.23 0zM7.12 20.452H3.56V9.034h3.56v11.418zM5.34 7.691a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zm15.112 12.761h-3.56v-5.569c0-1.328-.025-3.037-1.85-3.037-1.85 0-2.132 1.445-2.132 2.939v5.667h-3.56V9.034h3.419v1.561h.049c.477-.9 1.637-1.85 3.37-1.85 3.602 0 4.267 2.37 4.267 5.455v6.252z"/>
          </svg>
        </a>
      </div>
      <div className="footer-links">
        <div className="footer-col">
          <div className="footer-col-title">Company</div>
          <a href="#">About Us</a>
          <a href="#">Contact Us</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Digital Payment</a>
          <a href="#">Terms</a>
        </div>
        <div className="footer-col">
          <div className="footer-col-title">Case Uses</div>
          <a href="#">Blog Ideas & Outlines</a>
          <a href="#">Image Generator</a>
          <a href="#">Marketing Copy & Strategies</a>
          <a href="#">Business Ideas Strategies</a>
          <a href="#">Google Ad Copy</a>
        </div>
        <div className="footer-col">
          <div className="footer-col-title">Resources</div>
          <a href="#">Blog</a>
          <a href="#">Guides & Tutorials</a>
          <a href="#">API Docs</a>
          <a href="#">Community</a>
        </div>
        <div className="footer-col">
          <div className="footer-col-title">Support</div>
          <a href="#">OpenAI API</a>
          <a href="#">Stable Diffusion API</a>
          <a href="#">Report Issue</a>
        </div>
      </div>
    </footer>
  </div>
);

export default LandingPage; 