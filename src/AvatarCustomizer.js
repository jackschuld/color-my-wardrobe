import React, { useState } from 'react';

function AvatarCustomizer() {
  // Default colors roughly mapping to a neutral palette
  const [hairColor, setHairColor] = useState('#704214'); // brown
  const [eyeColor, setEyeColor] = useState('#3b5b92');   // blue
  const [skinTone, setSkinTone] = useState('#f6d7c4');   // light skin

  return (
    <div
      className="avatar-customizer"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
    >
      {/* Cartoon Woman */}
      <svg
        width={220}
        height={260}
        viewBox="0 0 220 260"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Customizable cartoon woman"
      >
        {/* Hair (drawn behind the head) */}
        <circle cx={110} cy={95} r={70} fill={hairColor} />

        {/* Neck */}
        <rect x={95} y={135} width={30} height={30} rx={10} fill={skinTone} />

        {/* Face */}
        <circle cx={110} cy={95} r={55} fill={skinTone} stroke="#000" strokeWidth={2} />

        {/* Eyes */}
        <g>
          <circle cx={85} cy={85} r={12} fill="#fff" />
          <circle cx={85} cy={85} r={7} fill={eyeColor} />
          <circle cx={135} cy={85} r={12} fill="#fff" />
          <circle cx={135} cy={85} r={7} fill={eyeColor} />
        </g>

        {/* Mouth */}
        <path
          d="M80 115 Q110 140 140 115"
          stroke="#d35f5f"
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
        />

        {/* Torso / shirt */}
        <rect x={50} y={165} width={120} height={70} rx={20} fill="#88b0e3" />
      </svg>

      {/* Controls */}
      <div
        className="avatar-controls"
        style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}
      >
        <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.8rem' }}>
          Hair
          <input
            type="color"
            value={hairColor}
            onChange={(e) => setHairColor(e.target.value)}
            style={{ width: 30, height: 30, border: 'none', padding: 0, background: 'none' }}
            aria-label="Pick hair color"
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.8rem' }}>
          Eyes
          <input
            type="color"
            value={eyeColor}
            onChange={(e) => setEyeColor(e.target.value)}
            style={{ width: 30, height: 30, border: 'none', padding: 0, background: 'none' }}
            aria-label="Pick eye color"
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.8rem' }}>
          Skin
          <input
            type="color"
            value={skinTone}
            onChange={(e) => setSkinTone(e.target.value)}
            style={{ width: 30, height: 30, border: 'none', padding: 0, background: 'none' }}
            aria-label="Pick skin tone color"
          />
        </label>
      </div>
    </div>
  );
}

export default AvatarCustomizer; 