/**
 * Modern Apple-style product page for Color Me Beautiful
 */
import './App.css';
import React, { useRef, useEffect, useState, useContext } from 'react';
import AnimatedColorWheel from './AnimatedColorWheel';
import { ThemeContext } from './ThemeContext';
import { motion } from 'framer-motion';

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
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="7" fill="#ffef99" stroke="#ffb347" strokeWidth="2" /><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="#ffb347" strokeWidth="1.5" strokeLinecap="round"/></svg>
    ) },
    { key: 'summer', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="7" fill="#b9a2ff" stroke="#74c0ff" strokeWidth="2" /><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="#74c0ff" strokeWidth="1.5" strokeLinecap="round"/></svg>
    ) },
    { key: 'autumn', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="12" rx="7" ry="7" fill="#ffd24d" stroke="#e2703a" strokeWidth="2" /><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="#e2703a" strokeWidth="1.5" strokeLinecap="round"/><path d="M12 12c-2 2-4 2-4 0s2-4 4-4 4 2 4 4-2 2-4 0z" fill="#e2703a" opacity=".3"/></svg>
    ) },
    { key: 'winter', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="7" fill="#cfe8ff" stroke="#0033cc" strokeWidth="2" /><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="#0033cc" strokeWidth="1.5" strokeLinecap="round"/><path d="M12 8v8M8 12h8" stroke="#0033cc" strokeWidth="1.2"/></svg>
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
    <div className="theme-dropdown-root" style={{ position: 'relative', minWidth: 44 }}>
      <motion.button
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={handleClick}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--bg-card)',
          border: '1.5px solid #ccc',
          borderRadius: '50%',
          padding: 4,
          cursor: 'pointer',
          width: 44,
          height: 44,
          minWidth: 44,
          minHeight: 44,
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
          position: 'absolute', bottom: '110%', left: '4px', zIndex: 100,
          background: 'var(--bg-card)',
          border: '1.5px solid #ccc',
          borderRadius: 12,
          boxShadow: '0 4px 16px 0 rgba(0,0,0,0.10)',
          minWidth: 44,
          width: 44,
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
                background: themeName === opt.key ? 'var(--bg-body)' : 'transparent',
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

  // Theme context
  const { themeName, setTheme } = useContext(ThemeContext);

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
            <a href="#contact" onClick={handleNavLinkClick}>Contact</a>
          </nav>
        </div>
      </header>
      <div style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 200,
        pointerEvents: 'auto',
      }}>
        <ThemeDropdown themeName={themeName} setTheme={setTheme} />
      </div>
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
                  <p>
                    Color Me Beautiful is <strong>THE authority on color</strong>, having helped over 26 million women discover the shades which most enhance their natural beauty. We popularized color analysis with <em>Color Me Beautiful: Discover Your Natural Beauty Through Color</em> and have refined the science of color through six additional books, including the <em>Color Me Beautiful Makeup Book</em>.
                  </p>
                  <p>
                    We continue to innovate, offering a range of color analysis services and cosmetics specific to each seasonal palette. With our expertise, you'll learn your ideal color palette, ensuring you always make the right choices. You'll know exactly which clothing and accessories best complement your natural colors. Our precisely coordinated cosmetics will bring your entire look together, enhancing and harmonizing your appearance for a polished, confident, and natural style.
                  </p>
                  <p>
                    <strong>We are the only company which markets its products based on the four seasons.</strong>
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
                    <p>I'm Peg, a certified Color Me Beautiful consultant. I help women discover their best colors so they can look radiant and feel confident every day. With years of experience, I guide you to your perfect palette for clothing, accessories, and more.</p>
                    <p>As part of the Color Me Beautiful family, I bring you the latest in color science and personal style, backed by a company trusted by millions. My mission is to make color easy, fun, and transformative for you.</p>
                  </div>
                  <div className="about-img">
                    {/* Placeholder for a professional portrait or logo */}
                    <div className="portrait-placeholder"></div>
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>
          <div className="stagger-card left">
            <FadeInSection direction="right">
              <div className="how-section" id="how">
                <div className="how-inner">
                  <div className="how-visual">
                    {/* Modern color wheel visual */}
                    <svg width="220" height="220" viewBox="0 0 220 220">
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
                  <div className="how-text">
                    <h2>How It Works</h2>
                    <ol>
                      <li>Personal consultation to determine your color season</li>
                      <li>Receive your own color wheel and palette</li>
                      <li>Guidance on how to use your colors for clothing and accessories</li>
                    </ol>
                    <p className="how-desc">Your color wheel is custom-designed based on your unique skin tone, hair, and eye color. The process is simple, friendly, and fun!</p>
                    <p className="how-desc">Our services and products are tailored to your seasonal palette, so you always look your best and feel confident in every choice you make.</p>
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>
          <div className="stagger-card right">
            <FadeInSection direction="left">
              <div className="boutique-section" id="boutiques">
                <div className="boutique-inner">
                  <h2>Shop Your Seasonal Boutique</h2>
                  <p>Check out our <strong>Seasonal Boutiques</strong> to shop within your specific seasonal palette. This ensures you look your best and eliminate costly mistakes. Our precisely coordinated cosmetics and accessories are designed to harmonize with your natural colors for a polished, confident, and natural style.</p>
                  <a href="#contact" className="cta-btn">Find Your Boutique</a>
                </div>
              </div>
            </FadeInSection>
          </div>
          <div className="stagger-card left">
            <FadeInSection direction="right">
              <div className="returns-section" id="returns">
                <div className="returns-inner">
                  <h2>Hassle-Free Returns</h2>
                  <p>Shade not quite what you were needing? To further enhance your experience, you have 30 days to make up your mind. Then just click on the chat icon at the bottom of the site and enter your order number along with the name of the product you wish to return. Within 24 hours you will have a pre-paid shipping label in your email to print out and use to ship back your item.</p>
                  <p>Our goal is to make your buying experience the absolute best it can possibly be.</p>
                </div>
              </div>
            </FadeInSection>
          </div>
        </section>
        <section className="contact-form-section" id="contact">
          <div className="contact-inner">
            <h2>Contact</h2>
            <p>Ready to discover your best colors? Get in touch for a personal consultation!</p>
            <form className="contact-form" onSubmit={e => e.preventDefault()}>
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
              <textarea placeholder="How can I help you?" required></textarea>
              <button type="submit">Send Message</button>
            </form>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">Color Me Beautiful</div>
          <nav className="footer-nav">
            <a href="#about">About</a>
            <a href="#how">How It Works</a>
            <a href="#boutiques">Seasonal Boutiques</a>
            <a href="#contact">Contact</a>
          </nav>
          <div className="footer-copy">&copy; {new Date().getFullYear()} Peg, Color Me Beautiful Consultant</div>
        </div>
      </footer>
    </div>
  );
}

export default App;
