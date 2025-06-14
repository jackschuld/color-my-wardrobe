/**
 * Modern Apple-style product page for Color Me Beautiful
 */
import './App.css';
import React, { useRef, useEffect, useState, useContext } from 'react';
import AnimatedColorWheel from './AnimatedColorWheel';
import { ThemeContext } from './ThemeContext';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import PeepsCustomizer from './PeepsCustomizer';

function FadeInSection({ children, direction = 'left' }) {
  const domRef = useRef();
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new window.IntersectionObserver((entries) => {
      entries.forEach((entry) => setVisible(entry.isIntersecting));
    }, { threshold: 0.15 });
    if (domRef.current) {
      observer.observe(domRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={domRef}
      className={`fade-in-section${isVisible ? ' visible' : ''} fade-in-${direction}`}
    >
      {children}
    </section>
  );
}

function ThemeDropdown({ themeName, setTheme }) {
  const [open, setOpen] = React.useState(false);
  const [pulse, setPulse] = React.useState(false);
  const lastInteracted = React.useRef(Date.now());
  // Pulse every 60s if not clicked
  React.useEffect(() => {
    if (open) return; // don't pulse while open
    const interval = setInterval(() => {
      if (Date.now() - lastInteracted.current > 10000) {
        setPulse(true);
        setTimeout(() => setPulse(false), 1200);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [open]);
  // On click, reset timer
  function handleClick() {
    lastInteracted.current = Date.now();
    setOpen(v => !v);
    setPulse(false);
  }
  const options = [
    { key: 'spring', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        {/* Simplistic daisy: 8 petals around center */}
        <circle cx="12" cy="12" r="3" fill="#FFC107" />
        {Array.from({ length: 8 }).map((_, i) => (
          <ellipse
            key={i}
            cx="12"
            cy="5.2"
            rx="2.2"
            ry="3.2"
            fill="#FF69B4"
            transform={`rotate(${i * 45} 12 12)`}
          />
        ))}
      </svg>
    ) },
    { key: 'summer', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="5" fill="#FFD54D" stroke="#FFA500" strokeWidth="2" />
        <g stroke="#FFA500" strokeWidth="2" strokeLinecap="round">
          <line x1="12" y1="1" x2="12" y2="4" />
          <line x1="12" y1="20" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
          <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="4" y2="12" />
          <line x1="20" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
          <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
        </g>
      </svg>
    ) },
    { key: 'autumn', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        {/* Stylized acorn tilted for falling effect */}
        <g transform="translate(-4 0) rotate(-20 12 12) scale(1.35 1.15)">
          {/* Acorn nut - slightly tapered bottom */}
          <path d="M12 6.5 C9.5 6.5 8 9 8 12 C8 15 9.8 17.2 12 18.2 C14.2 17.2 16 15 16 12 C16 9 14.5 6.5 12 6.5 Z" fill="#C78C3A" stroke="#7A4F1A" strokeWidth="1" />
          {/* Cap - wider to read as acorn */}
          <path d="M7.5 9 C7.5 6.8 9.4 5 12 5 C14.6 5 16.5 6.8 16.5 9 Z" fill="#8E5B25" stroke="#7A4F1A" strokeWidth="1" />
          {/* Stem */}
          <line x1="12" y1="5.5" x2="12" y2="3.5" stroke="#7A4F1A" strokeWidth="1" strokeLinecap="round" />
        </g>
      </svg>
    ) },
    { key: 'winter', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        {/* Detailed snowflake */}
        <g stroke="#4BAAFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* Main arms */}
          <line x1="12" y1="3" x2="12" y2="21" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="5" y1="5" x2="19" y2="19" />
          <line x1="5" y1="19" x2="19" y2="5" />
          {/* Arm tips */}
          {/* Vertical tips */}
          <line x1="12" y1="3" x2="10.5" y2="5" />
          <line x1="12" y1="3" x2="13.5" y2="5" />
          <line x1="12" y1="21" x2="10.5" y2="19" />
          <line x1="12" y1="21" x2="13.5" y2="19" />
          {/* Horizontal tips */}
          <line x1="3" y1="12" x2="5" y2="10.5" />
          <line x1="3" y1="12" x2="5" y2="13.5" />
          <line x1="21" y1="12" x2="19" y2="10.5" />
          <line x1="21" y1="12" x2="19" y2="13.5" />
          {/* Diagonal tips */}
          <line x1="5" y1="5" x2="6" y2="7" />
          <line x1="5" y1="5" x2="7" y2="6" />
          <line x1="19" y1="19" x2="18" y2="17" />
          <line x1="19" y1="19" x2="17" y2="18" />
          <line x1="5" y1="19" x2="6" y2="17" />
          <line x1="5" y1="19" x2="7" y2="18" />
          <line x1="19" y1="5" x2="18" y2="7" />
          <line x1="19" y1="5" x2="17" y2="6" />
        </g>
      </svg>
    ) },
  ];
  const current = options.find(o => o.key === themeName) || options[0];
  // Close dropdown on outside click
  React.useEffect(() => {
    if (!open) return;
    function handle(e) {
      if (!e.target.closest('.theme-dropdown-root')) setOpen(false);
    }
    window.addEventListener('mousedown', handle);
    return () => window.removeEventListener('mousedown', handle);
  }, [open]);
  return (
    <div className="theme-dropdown-root" style={{ position: 'relative', minWidth: 40, margin: 10 }}>
      <motion.button
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={handleClick}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--header-text)',
          border: '1.5px solid #ccc',
          borderRadius: '50%',
          padding: 4,
          cursor: 'pointer',
          width: 40,
          height: 40,
          minWidth: 40,
          minHeight: 40,
          boxShadow: open ? '0 2px 8px 0 rgba(0,0,0,0.10)' : 'none',
          transition: 'box-shadow 0.18s',
        }}
        animate={pulse ? { scale: [1, 1.18, 1, 1.18, 1] } : { scale: 1 }}
        transition={{ duration: 1.2, times: [0, 0.25, 0.5, 0.75, 1], ease: 'easeInOut' }}
      >
        {current.icon}
      </motion.button>
      {open && (
        <div style={{
          position: 'absolute', top: '110%', left: '4px', zIndex: 100,
          background: 'var(--header-text)',
          border: '1.5px solid #ccc',
          borderRadius: 12,
          boxShadow: '0 4px 16px 0 rgba(0,0,0,0.10)',
          minWidth: 40,
          width: 40,
          padding: '0.2rem 0',
          display: 'flex', flexDirection: 'column', alignItems: 'stretch',
        }}>
          {options.map(opt => (
            <button
              key={opt.key}
              onClick={() => { setTheme(opt.key); setOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '100%',
                background: themeName === opt.key ? 'var(--header-text)' : 'transparent',
                border: 'none',
                padding: 6,
                cursor: 'pointer',
                fontSize: '1rem',
                borderRadius: 8,
                transition: 'background 0.15s',
                boxSizing: 'border-box',
              }}
            >
              {opt.icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function App() {
  const [navOpen, setNavOpen] = useState(false);
  const formRef = useRef(null);

  // Theme context
  const { themeName, setTheme } = useContext(ThemeContext);

  // Track viewport size for simple mobile breakpoint (<=900px)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 900);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close nav on route change or link click
  const handleNavLinkClick = () => setNavOpen(false);

  // Optional: Prevent scroll when nav is open (mobile)
  useEffect(() => {
    if (navOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [navOpen]);

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        formRef.current,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      )
      .then(() => {
        alert('Message sent successfully!');
        e.target.reset();
      })
      .catch((error) => {
        console.error('EmailJS error:', error);
        alert('There was an issue sending your message. Please try again later.');
      });
  };

  return (
    <div className="App">
      <header className="site-header">
        <div className="header-content">
          <span className="brand">Peggy McAuliffe Schuld</span>
          <div className="hamburger" onClick={() => setNavOpen(v => !v)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <nav className={navOpen ? 'open' : ''}>
            <a href="#about" onClick={handleNavLinkClick}>About</a>
            <a href="#how" onClick={handleNavLinkClick}>How It Works</a>
            <a href="#boutiques" onClick={handleNavLinkClick}>Seasonal Boutiques</a>
            <a href="#sample" onClick={handleNavLinkClick}>Sample Wheel</a>
            <a href="#contact" onClick={handleNavLinkClick}>Contact</a>
      <div>
        <ThemeDropdown themeName={themeName} setTheme={setTheme} />
      </div>
          </nav>
        </div>
      </header>
      <main>
        <section className="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <AnimatedColorWheel />
        </section>
        
        <section className="fade-in-cards">
          <div className="stagger-card left">
            <FadeInSection direction="right">
              <div className="company-section" id="company">
                <div className="company-inner">
                  <h2>Why Color Me Beautiful?</h2>
                  <div style={{ width: 250, float: 'right', margin: '0 0 1rem 1rem' }}>
                    <svg width="100%" height="220" viewBox="0 0 220 220">
                      <circle cx="110" cy="110" r="100" fill="#fff" stroke="#e5e5e5" strokeWidth="2" />
                      {[...Array(12)].map((_, i) => (
                        <path
                          key={i}
                          d={`M110,110 L${110 + 100 * Math.cos((i * 30 - 90) * Math.PI / 180)},${110 + 100 * Math.sin((i * 30 - 90) * Math.PI / 180)} A100,100 0 0,1 ${110 + 100 * Math.cos(((i + 1) * 30 - 90) * Math.PI / 180)},${110 + 100 * Math.sin(((i + 1) * 30 - 90) * Math.PI / 180)} Z`}
                          fill={`hsl(${i * 30}, 70%, 60%)`}
                          opacity="0.92"
                        />
                      ))}
                      <circle cx="110" cy="110" r="60" fill="#fff" />
                    </svg>
                  </div>
                  <p>
                    Color Me Beautiful pioneered color analysis, helping millions discover their most flattering shades. We go beyond the four seasons, using advanced color science and computer-assisted analysis to create a palette as unique as your fingerprint. Our expert guidance ensures you always look and feel your best.
                  </p>
                </div>
              </div>
            </FadeInSection>
          </div>
          <div className="stagger-card right">
            <FadeInSection direction="left">
              <div className="about-section" id="about">
                <div className="about-inner">
                  <div className="about-text">
                    <h2>Meet Peg</h2>
                    <img src="/casualpic.jpg" alt="Peg casual portrait" style={{ width: 250, objectFit: 'cover', borderRadius: '50%', float: 'right', margin: '0 0 1rem 1rem' }} />
                    <p>I'm Peg, a certified Color Me Beautiful consultant. I use the latest color science to help you find your perfect palette for clothing, accessories, and makeup. My mission is to make color easy, fun, and transformative, so you can dress with confidence every day.</p>
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>
          <div className="stagger-card left">
            <FadeInSection direction="right">
              <div className="how-section" id="how">
                <div className="how-text">
                  <h2>How It Works</h2>
                  <ol style={{ listStyleType: 'none' }}>
                    <li>1. Personal consultation to analyze your unique coloring</li>
                    <li>2. Receive your custom Color Alliance palette—one of 372 possible combinations</li>
                    <li>3. Get expert advice on using your colors for clothes, accessories, and makeup</li>
                  </ol>
                  <p className="how-desc">Your palette is your personalized shopping guide, making style choices simple and frustration-free.</p>
                </div>
              </div>
            </FadeInSection>
          </div>
          <div className="stagger-card right">
            <FadeInSection direction="left">
              <div className="boutique-section" id="boutiques">
                <div className="boutique-inner">
                  <h2>Explore Makeup & Beauty</h2>
                  <a href="https://colormebeautiful.com/margaretschuld" className="cta-btn" target="_blank" rel="noopener noreferrer">Go To Boutique</a>
                  <p>Discover makeup and beauty products curated just for you! Shop a handpicked selection of cosmetics and essentials designed to harmonize with your unique palette. Find your perfect shades and elevate your look with confidence—directly from my Color Me Beautiful partner site.</p>
                </div>
              <div className="boutique-visual">
                  <img
                    src="/pool.jpg"
                    alt="Peg by the pool"
                    style={{
                      width: isMobile ? 320 : 500,
                      height: 300,
                      objectFit: 'cover',
                      borderRadius: 12,
                      marginBottom: '1rem',
                      float: 'right',
                    }}
                  />
                </div>
              </div>
            </FadeInSection>
          </div>
        </section>
        <section className="how-pinned-section" id="sample">
          <div className="how-pinned-inner">
            <PeepsCustomizer />
          </div>
        </section>
        <section className="contact-form-section" id="contact">
          <div className="contact-inner">
            <h2>Contact</h2>
            <p>Ready to discover your best colors?<br /> Get in touch for a personal consultation!</p>
            <form className="contact-form" ref={formRef} onSubmit={sendEmail}>
              <input type="text" name="user_name" placeholder="Your Name" required />
              <input type="email" name="user_email" placeholder="Your Email" required />
              <textarea name="message" placeholder="How can I help you?" required></textarea>
              <button type="submit">Send Message</button>
            </form>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="footer-inner">
          <img
            src="/funny.jpg"
            alt="Color meme"
            style={{ maxWidth: 150, width: '100%', borderRadius: 8, marginRight: '1rem' }}
          />
          <div className="footer-text">
            <div className="footer-brand">Color Me Beautiful</div>
            <nav className="footer-nav">
              <a href="#about">About</a>
              <a href="#how">How It Works</a>
              <a href="#boutiques">Seasonal Boutiques</a>
              <a href="#contact">Contact</a>
            </nav>
            <div className="footer-copy">
              &copy; {new Date().getFullYear()} Peg, Color Me Beautiful Consultant
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
