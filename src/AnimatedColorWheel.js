import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { ThemeContext } from './ThemeContext';

const SWATCHES = 32;
const CENTER_X = 240;
const CENTER_Y = 240;
const SWATCH_LENGTH = 170;
const SWATCH_WIDTH = 50;
const SWATCH_RADIUS = 18;
const LABEL_WIDTH = 85;
const LABEL_HEIGHT = 200;
const LABEL_RADIUS = 32;

// Swatches should fan out clockwise starting from straight up (12 o'clock)
const START_ANGLE = 0; // start at 3 o'clock (pointing right)

// Swatch colors now come from the active seasonal theme via ThemeContext

// Each swatch now pivots around the wheel axis instead of translating outward.
const swatchVariants = {
  closed: i => ({
    x: CENTER_X,
    y: CENTER_Y,
    rotate: 0,
    opacity: 1,
    filter: 'drop-shadow(0px 0px 0px #0000)'
  }),
  open: i => {
    const angle = START_ANGLE + i * (360 / SWATCHES); // counter-clockwise sweep
    return {
      x: CENTER_X,
      y: CENTER_Y,
      rotate: angle,
      opacity: 1,
      filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.10))',
      transition: {
        delay: i * 0.03,
        duration: 0.6,
        ease: [0.17, 0.67, 0.83, 0.67]
      }
    };
  }
};

// ADD_VARIANT_START
// Letter-by-letter wave animation for the call-to-action text
const letterWaveVariants = {
  initial: { y: 0 },
  animate: (i) => ({
    y: [0, -6, 0],
    transition: {
      duration: 0.6,
      delay: i * 0.06,          // stagger each letter
      repeat: Infinity,         // loop forever
      repeatDelay: 3            // pause between waves
    }
  })
};
// ADD_VARIANT_END

export default function AnimatedColorWheel() {
  const { theme } = useContext(ThemeContext);
  const [open, setOpen] = useState(false);

  // Fallback in case something goes wrong
  const swatchColors = (theme && theme.swatches) ? theme.swatches : [
    '#e6d2c3','#e2c7a7','#d6bfa2','#bfae9b','#a7a08c','#7e8b7a','#4e6b5a','#2e4d3c',
    '#2b4c4e','#2e5e6b','#3a7a8c','#4e8ba7','#6b9ebf','#7ab7d6','#a2c7e2','#c3d6e6',
    '#d2c3e6','#bfa2d6','#a78cbf','#8c7aa7','#7a6b8b','#6b5a7e','#7a4e6b','#8c3a5a',
    '#a72e4e','#bf2e3a','#d67a7a','#e2a2a2','#e6c3c3','#e6d2c3','#e2c7a7','#d6bfa2']
  ;

  React.useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 480 480"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
          width: '100%',
          height: '100%',
        }}
      >
        {/* Swatches */}
        {/*
          Render the swatches in **reverse order** so the ones that begin
          animating first are painted *above* the later-animating ones.
          This prevents the early swatches from being temporarily hidden
          by those which are still stacked in the closed state.
        */}
        {Array.from({ length: SWATCHES }, (_, i) => SWATCHES - 1 - i).map((index) => (
          <motion.g
            key={index}
            custom={index}
            initial="closed"
            animate={open ? 'open' : 'closed'}
            variants={swatchVariants}
            style={{ originX: 0.5, originY: 1 }}
          >
            <rect
              width={SWATCH_WIDTH}
              height={SWATCH_LENGTH}
              rx={SWATCH_RADIUS}
              ry={SWATCH_RADIUS}
              fill={swatchColors[index % swatchColors.length]}
              x={-SWATCH_WIDTH / 2}
              y={-SWATCH_LENGTH}
              style={{
                transformBox: 'fill-box',
                transformOrigin: '50% 100%',
                // Shadow now handled at the <motion.g> level to avoid stacking while closed
                // filter: open ? 'drop-shadow(0px 6px 16px rgba(0,0,0,0.18))' : undefined
              }}
            />
          </motion.g>
        ))}
        {/* Center off-white label */}
        <rect
          x={CENTER_X - LABEL_WIDTH / 2}
          y={CENTER_Y - 70 - LABEL_HEIGHT / 2}
          width={LABEL_WIDTH}
          height={LABEL_HEIGHT}
          rx={LABEL_RADIUS}
          ry={LABEL_RADIUS}
          fill="#f8f6f2"
          stroke="#e0ded9"
          strokeWidth={3}
          filter="drop-shadow(0px 2px 12px rgba(0,0,0,0.10))"
        />
        {/* Placeholder text for label */}
        <text
          x={CENTER_X}
          y={CENTER_Y - 140}
          textAnchor="middle"
          fontSize="10"
          fontWeight="bold"
          fill="#444"
          style={{ fontFamily: 'serif', letterSpacing: 2, textWrap: 'wrap' }}
        >
          COLOR
        </text>
        <text
          x={CENTER_X}
          y={CENTER_Y - 130}
          textAnchor="middle"
          fontSize="10"
          fontWeight="bold"
          fill="#444"
          style={{ fontFamily: 'serif', letterSpacing: 2, textWrap: 'wrap' }}
        >
          MY
        </text>
        <text
          x={CENTER_X}
          y={CENTER_Y - 120}
          textAnchor="middle"
          fontSize="10"
          fontWeight="bold"
          fill="#444"
          style={{ fontFamily: 'serif', letterSpacing: 2, textWrap: 'wrap' }}
        >
          WARDROBE
        </text>
        <text
          x={CENTER_X}
          y={CENTER_Y - 110}
          textAnchor="middle"
          fontSize="8"
          fill="#888"
          style={{ fontFamily: 'sans-serif' }}
        >
          by
        </text>
        <text
          x={CENTER_X}
          y={CENTER_Y - 100}
          textAnchor="middle"
          fontSize="8"
          fill="#888"
          style={{ fontFamily: 'sans-serif' }}
        >
          Peggy
        </text>
        <text
          x={CENTER_X}
          y={CENTER_Y - 30}
          textAnchor="middle"
          fontSize="8"
          fill="#666"
          style={{ fontFamily: 'sans-serif' }}
        >
          SWATCH
        </text>
        <text
          x={CENTER_X}
          y={CENTER_Y - 15}
          textAnchor="middle"
          fontSize="8"
          fill="#666"
          style={{ fontFamily: 'sans-serif' }}
        >
          PALETTE
        </text>
      </svg>
          <button
            className="colorwheel-cta-btn"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 2,
              padding: '1rem 2.2rem',
              fontSize: '1.2rem',
              borderRadius: '2rem',
              border: 'none',
              background: 'transparent',
              fontWeight: 600,
              cursor: 'pointer',
              color: 'var(--text-color)',
              outline: 'none',
            }}
            onClick={() => {
              const section = document.querySelector('.fade-in-cards');
              if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            {"Get Started".split("").map((char, index) => (
              <motion.span
                key={index}
                custom={index}
                variants={letterWaveVariants}
                initial="initial"
                animate="animate"
                style={{ display: 'inline-block' }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </button>
    </div>
  );
} 