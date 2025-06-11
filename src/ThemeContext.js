import React, { createContext, useState, useEffect } from 'react';

// Helper – generate a 32-swatch palette by sweeping the hue wheel
function generatePalette(hueShift = 0, sat = 65, light = 60) {
  const SWATCHES = 32;
  return Array.from({ length: SWATCHES }, (_, i) =>
    `hsl(${(i * 360) / SWATCHES + hueShift}, ${sat}%, ${light}%)`
  );
}

export const themes = {
  spring: {
    name: 'spring',
    swatches: [
      '#ffef99','#ffe566','#ffd54d','#ffcc33','#ffb347','#ff9966','#ff8674','#ff6f61',
      '#ff4f4f','#ff3355','#ff66aa','#ff99cc','#ffd6e8','#e4bfff','#d6a3ff','#c793ff',
      '#aee2ff','#7edcff','#5cc1ff','#2fb3ff','#2dacff','#29a37d','#33b86b','#3fc243',
      '#64cb3c','#8dce37','#d4cfa4','#c8b387','#c0ae99','#b19c79','#a28b6c','#927b56'
    ],
    cssVars: {
      '--bg-body': '#fff9f3',
      '--text-color': '#ff4f4f',
      '--accent': '#ff4f4f',
      '--bg-card': '#ffef99',
      '--bg-header': '#ffd6e8',
      '--bg-footer': '#ffd6e8',
      '--header-text': '#c793ff'
    }
  },
  summer: {
    name: 'summer',
    swatches: [
      '#fff5b3','#ffe6c7','#ffcad4','#ffb3c6','#ffa0c1','#f49ac2','#e8bbff','#d3b4ff',
      '#b9a2ff','#9faeff','#89b7ff','#74c0ff','#65cbe3','#7cd8c3','#90d8b0','#a7d9a5',
      '#bcdcad','#d4deaa','#dcd2ad','#d0c0a9','#c0b0a0','#b0a099','#a0a0ad','#8f9cb3',
      '#7c8aa3','#697a8a','#586977','#4b5d6b','#4a4f5c','#5f5a5e','#848a89','#bfc7c6'
    ],
    cssVars: {
      '--bg-body': '#f3f9ff',
      '--text-color': '#d3b4ff',
      '--accent': '#d3b4ff',
      '--bg-card': '#697a8a',
      '--bg-header': '#a7d9a5',
      '--bg-footer': '#a7d9a5',
      '--header-text': '#4b5d6b'
    }
  },
  autumn: {
    name: 'autumn',
    swatches: [
      '#fff2b3','#ffe680','#ffd24d','#ffbf00','#f5a623','#e89c00','#e2703a','#d45b00',
      '#c54a24','#b83a3a','#a53030','#8e2b29','#7a1e1e','#672218','#4f1b15','#3f2214',
      '#615017','#7a6823','#8f7b2d','#a1a667','#6c8b3c','#3e6428','#004d40','#005c5c',
      '#006c7a','#00718f','#185a7d','#44475b','#3b3b3b','#6e5c4f','#b49b7b','#d8c4a8'
    ],
    cssVars: {
      '--bg-body': '#fff8ef',
      '--text-color': '#8e2b29',
      '--accent': '#dd432d',
      '--bg-card': '#ffe9e6',
      '--bg-header': '#dd432d',
      '--bg-footer': '#dd432d',
      '--header-text': '#fff2b3'
    }
  },
  winter: {
    name: 'winter',
    swatches: [
      '#ffffcc','#ffff99','#fff347','#ffeb00','#00ff99','#00e68b','#00ccff','#0099ff',
      '#0066ff','#0033cc','#000099','#330066','#660099','#9900cc','#ff00ff','#ff1493',
      '#ff004f','#ff0000','#cc0000','#990000','#660000','#000000','#333333','#666666',
      '#999999','#cccccc','#ffffff','#d1cfe2','#cfe8ff','#e0ffee','#ffd6e8','#ffe5f7'
    ],
    cssVars: {
      '--bg-body': '#f5f7ff',
      '--text-color': '#990000',
      '--accent': '#990000',
      '--bg-card': '#cfe8ff',
      '--bg-header': '#d1cfe2',
      '--bg-footer': '#d1cfe2',
      '--header-text': '#660000'
    }
  }
};

const defaultThemeName = 'spring';

export const ThemeContext = createContext({
  themeName: defaultThemeName,
  setTheme: () => {},
  theme: themes[defaultThemeName]
});

export function ThemeProvider({ children }) {
  // Helper to get Pacific Time with DST
  function getPacificDate() {
    // Get current UTC time
    const now = new Date();
    // Figure out if DST is in effect in Pacific Time
    // DST starts 2nd Sunday in March, ends 1st Sunday in November
    const year = now.getUTCFullYear();
    // 2nd Sunday in March
    const dstStart = new Date(Date.UTC(year, 2, 1));
    dstStart.setUTCDate(8 - dstStart.getUTCDay() + 1); // 2nd Sunday
    // 1st Sunday in November
    const dstEnd = new Date(Date.UTC(year, 10, 1));
    dstEnd.setUTCDate(1 + (7 - dstEnd.getUTCDay()) % 7); // 1st Sunday
    // Pacific offset: -7 if DST, -8 otherwise
    let offset = -8;
    if (now >= dstStart && now < dstEnd) offset = -7;
    return new Date(now.getTime() + offset * 60 * 60 * 1000);
  }

  function getSeasonFromDate(date) {
    const month = date.getMonth() + 1; // 1-12
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  }

  // On first load, check localStorage for user theme, else auto-detect
  const [themeName, setThemeName] = useState(() => {
    const stored = window.localStorage.getItem('themeName');
    if (stored && themes[stored]) return stored;
    const pacificDate = getPacificDate();
    return getSeasonFromDate(pacificDate);
  });

  // When user selects a theme, update state and persist to localStorage
  const handleSetTheme = (name) => {
    setThemeName(name);
    window.localStorage.setItem('themeName', name);
  };

  // Apply CSS variables + lightweight global styles whenever theme changes
  useEffect(() => {
    const theme = themes[themeName];
    if (!theme) return;
    Object.entries(theme.cssVars).forEach(([varName, value]) => {
      document.documentElement.style.setProperty(varName, value);
    });
  }, [themeName]);

  return (
    <ThemeContext.Provider value={{
      themeName,
      setTheme: handleSetTheme,
      theme: themes[themeName]
    }}>
      {children}
    </ThemeContext.Provider>
  );
} 