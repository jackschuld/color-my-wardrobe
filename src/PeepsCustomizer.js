import React, { useState, useMemo, useEffect } from 'react';
import 'css-peeps/css-peeps.css';
import './PeepsPreview.css';
import { themes } from './ThemeContext';

const HEAD_VARIANTS = ['bangs1','medium-bangs2', 'short4','mohawk1', 'bald1','hijab'];
const FACE_VARIANTS = ['calm', 'cute', 'smile', 'suspicious', 'cyclops', 'old'];
const BODY_VARIANTS = ['blazer', 'laptop', 'coffee','explaining','phone','gaming'];

const DEFAULT_HEAD = HEAD_VARIANTS[0];
const DEFAULT_FACE = FACE_VARIANTS[0];
const DEFAULT_BODY = BODY_VARIANTS[0];

const HAIR_COLORS = ['#70391a', '#000000', '#d1b280', '#a55728', '#e6cbaa', '#ffffff'];
const SKIN_TONES = ['#f6d7c4', '#eac086', '#c68642', '#8d5524', '#f9e4d2', '#b97a56'];

// brown, blue, green, hazel, gray, amber
const EYE_COLORS = [
  '#5e3b20', // brown
  '#1f77ff', // blue
  '#3cb371', // green
  '#8e7618', // hazel
  '#6a6a6a', // gray
  '#ffbf00', // amber
];

const DEFAULT_HAIR = HAIR_COLORS[0];
const DEFAULT_SKIN = SKIN_TONES[0];
const DEFAULT_EYE = EYE_COLORS[0];

// --- Color conversion helpers ---
function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
  const num = parseInt(hex, 16);
  return [
    (num >> 16) & 255,
    (num >> 8) & 255,
    num & 255
  ];
}

function rgbToHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min); // eslint-disable-line no-unused-vars
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: break;
    }
    h /= 6;
  }
  return [h * 360, s, l];
}

function averageHsl(colors) {
  const hsls = colors.map(c => rgbToHsl(hexToRgb(c)));
  const avg = [0, 0, 0];
  hsls.forEach(hsl => {
    avg[0] += hsl[0];
    avg[1] += hsl[1];
    avg[2] += hsl[2];
  });
  avg[0] /= hsls.length;
  avg[1] /= hsls.length;
  avg[2] /= hsls.length;
  return avg;
}

function getSeasonTheme(hair, skin, eye) {
  const [h, s, l] = averageHsl([hair, skin, eye]);
  // Use saturation in the logic to avoid unused variable
  // Spring: light, warm (yellow/green hues), moderate to high saturation
  if (l > 0.7 && h >= 30 && h <= 90 && s > 0.3) return 'spring';
  // Summer: light, cool (blue/purple hues), lower saturation
  if (l > 0.7 && (h < 30 || h > 240) && s <= 0.3) return 'summer';
  // Autumn: deep, warm (yellow/green hues), moderate to high saturation
  if (l <= 0.7 && h >= 30 && h <= 90 && s > 0.3) return 'autumn';
  // Winter: deep, cool (blue/purple hues), lower saturation
  return 'winter';
}

export default function PeepsCustomizer() {
  // --- State with history for undo/redo ---
  const initialState = {
    head: DEFAULT_HEAD,
    face: DEFAULT_FACE,
    body: DEFAULT_BODY,
    hairColor: DEFAULT_HAIR,
    skinTone: DEFAULT_SKIN,
    clothesColor: themes.spring.swatches[0],
    eyeColor: DEFAULT_EYE,
  };
  const [history, setHistory] = useState([initialState]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const current = history[historyIndex];

  // --- Helper to update state and push to history ---
  function updateState(patch) {
    const newState = { ...current, ...patch };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }

  // --- Undo/Redo handlers ---
  function handleUndo() {
    if (historyIndex > 0) setHistoryIndex(historyIndex - 1);
  }
  function handleRedo() {
    if (historyIndex < history.length - 1) setHistoryIndex(historyIndex + 1);
  }

  // --- Derived seasonal theme and palette ---
  const clothesThemeName = useMemo(() => getSeasonTheme(current.hairColor, current.skinTone, current.eyeColor), [current.hairColor, current.skinTone, current.eyeColor]);
  const clothesPalette = useMemo(() => {
    const theme = themes[clothesThemeName];
    if (!theme) return [];
    const result = [];
    for (let i = 0; i < theme.swatches.length && result.length < 12; i += 2) {
      result.push(theme.swatches[i]);
    }
    return result;
  }, [clothesThemeName]);

  // Ensure clothesColor is always part of the current palette.
  useEffect(() => {
    if (clothesPalette.length && !clothesPalette.includes(current.clothesColor)) {
      updateState({ clothesColor: clothesPalette[0] });
    }
    // eslint-disable-next-line
  }, [clothesPalette]);

  const cssVars = {
    '--peep-head': current.head,
    '--peep-face': current.face,
    '--peep-body': current.body,
    '--peep-hair-color': current.hairColor,
    '--peep-skin-color': current.skinTone,
    '--peep-clothes-color': current.clothesColor,
  };

  // Only show the relevant part in each preview using a custom class
  const VariantSection = ({ title, variants, selected, onSelect, type }) => {
    const [open, setOpen] = useState(true);
    return (
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            background: 'transparent',
            border: 'none',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            padding: 0,
            marginBottom: open ? '0.3rem' : 0,
            color: 'var(--text-color)',
          }}
        >
          {open ? '▾ ' : '▸ '} {title}
        </button>
        {open && (
          <div
            className="peeps-preview-grid"
          >
            {variants.map((v) => {
              let previewVars;
              if (type === 'head') {
                previewVars = {
                  '--peep-head': v,
                  '--peep-face': '', // Hide face
                  '--peep-body': '', // Hide body
                  '--peep-hair-color': current.hairColor,
                  '--peep-skin-color': current.skinTone,
                  '--peep-clothes-color': current.clothesColor,
                };
              } else if (type === 'face') {
                previewVars = {
                  '--peep-head': '', // Hide hair
                  '--peep-face': v,
                  '--peep-body': '', // Hide body
                  '--peep-hair-color': current.hairColor,
                  '--peep-skin-color': current.skinTone,
                  '--peep-clothes-color': current.clothesColor,
                };
              } else if (type === 'body') {
                previewVars = {
                  '--peep-head': '', // Hide hair
                  '--peep-face': '', // Hide face
                  '--peep-body': v,
                  '--peep-hair-color': current.hairColor,
                  '--peep-skin-color': current.skinTone,
                  '--peep-clothes-color': current.clothesColor,
                };
              }
              return (
                <button
                  key={v}
                  onClick={() => onSelect(v)}
                  style={{
                    padding: 0,
                    border: selected === v ? '2px solid var(--text-color)' : '1px solid #999',
                    background: 'transparent',
                    cursor: 'pointer',
                    width: 72,
                    height: 96,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    className={`css-peeps peeps-preview peeps-preview-${type}`}
                    style={{ width: 60, height: 81, ...previewVars }}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Swatch picker for colors
  const ColorSwatchPicker = ({ label, value, setter, options, note }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.75rem', marginTop: '.25rem' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {label}
        {note && (
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <span
              className="colorwheel-tooltip-trigger"
              style={{
                display: 'inline-block',
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: '#e0e0e0',
                color: '#555',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '0.9em',
                lineHeight: '16px',
                cursor: 'pointer',
                marginLeft: 4,
                border: '1px solid #bbb',
                userSelect: 'none',
              }}
              tabIndex={0}
              aria-label="Info"
            >
              i
            </span>
            <span
              style={{
                visibility: 'hidden',
                opacity: 0,
                width: 220,
                background: '#222',
                color: '#fff',
                textAlign: 'center',
                borderRadius: 6,
                padding: '6px 10px',
                position: 'absolute',
                zIndex: 1,
                bottom: '125%',
                left: '50%',
                transform: 'translateX(-50%)',
                transition: 'opacity 0.2s',
                fontSize: '0.75rem',
                pointerEvents: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
              className="colorwheel-tooltip"
            >
              {note}
            </span>
            <style>
              {`
                .colorwheel-tooltip-trigger:hover + .colorwheel-tooltip,
                .colorwheel-tooltip-trigger:focus + .colorwheel-tooltip {
                  visibility: visible !important;
                  opacity: 1 !important;
                  pointer-events: auto !important;
                }
              `}
            </style>
          </span>
        )}
      </span>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: 6,
          marginTop: 4,
        }}
      >
        {options.map((color) => (
          <button
            key={color}
            onClick={() => setter(color)}
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              border: value === color ? '2px solid var(--text-color)' : '1px solid #999',
              background: color,
              cursor: 'pointer',
              outline: 'none',
              margin: 0,
              padding: 0,
              boxShadow: value === color ? '0 0 0 2px #fff' : 'none',
            }}
            aria-label={`Select ${label.toLowerCase()} color ${color}`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div>
      {/* LEFT: controls */}
      <div className="peeps-controls-card">
        {/* Undo/Redo buttons */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <button onClick={handleUndo} disabled={historyIndex === 0} style={{ padding: '0.3rem 0.8rem', fontSize: '1rem', cursor: historyIndex === 0 ? 'not-allowed' : 'pointer' }}>Undo</button>
          <button onClick={handleRedo} disabled={historyIndex === history.length - 1} style={{ padding: '0.3rem 0.8rem', fontSize: '1rem', cursor: historyIndex === history.length - 1 ? 'not-allowed' : 'pointer' }}>Redo</button>
        </div>
        <VariantSection title="Hair" type="head" variants={HEAD_VARIANTS} selected={current.head} onSelect={v => updateState({ head: v })} />
        <VariantSection title="Face" type="face" variants={FACE_VARIANTS} selected={current.face} onSelect={v => updateState({ face: v })} />
        <VariantSection title="Body" type="body" variants={BODY_VARIANTS} selected={current.body} onSelect={v => updateState({ body: v })} />
        <div style={{ marginTop: '0.5rem' }}>
          <ColorSwatchPicker
            label="Hair"
            value={current.hairColor}
            setter={color => updateState({ hairColor: color })}
            options={HAIR_COLORS}
            note="NOTE: Not an accurate representation - actual wheel contains 372 possible combinations!"
          />
          <ColorSwatchPicker
            label="Skin"
            value={current.skinTone}
            setter={color => updateState({ skinTone: color })}
            options={SKIN_TONES}
            note="NOTE: Not an accurate representation - actual wheel contains 372 possible combinations!"
          />
          <ColorSwatchPicker
            label="Eyes"
            value={current.eyeColor}
            setter={color => updateState({ eyeColor: color })}
            options={EYE_COLORS}
            note="NOTE: Not an accurate representation - actual wheel contains 372 possible combinations!"
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <ColorSwatchPicker
            label="Generated Palette"
            value={current.clothesColor}
            setter={color => updateState({ clothesColor: color })}
            options={clothesPalette}
            note="NOTE: Actual wheel contains over 40 colors."
          />
        </div>
      </div>

      {/* RIGHT: figure */}
      <div style={{ flex: '1 1 240px', display: 'flex', justifyContent: 'center' }}>
        {/*
          css-peeps re-runs its internal paint keyframes only on mount. By
          tying React's `key` to the user-selected colors we guarantee a fresh
          mount whenever any color swatch changes, so the figure immediately
          reflects new hair and skin tones without requiring a variant change.
        */}
        <div
          key={`${current.hairColor}-${current.skinTone}-${current.clothesColor}`}
          className="css-peeps"
          style={{ width: 240, height: 324, ...cssVars }}
          aria-label="Customizable Peep figure"
        />
      </div>
    </div>
  );
} 