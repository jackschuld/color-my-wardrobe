import React, { createContext, useState, useEffect } from 'react';

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
      '--bg-body': '#ffd6e8',
      '--text-color': '#ff4f4f',
      '--bg-background': '#fff9f3',
      '--bg-header': '#ff66aa',
      '--header-text': '#ffef99'
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
      '--bg-body': '#dcd2ad',
      '--text-color': '#b9a2ff',
      '--bg-background': '#f3f9ff',
      '--bg-header': '#a7d9a5',
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
      '--bg-body': '#d8c4a8',
      '--text-color': '#00718f',
      '--bg-background': '#fff8ef',
      '--bg-header': '#dd432d',
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
      '--bg-body': '#cccccc',
      '--text-color': '#660000',
      '--bg-background': '#f5f7ff',
      '--bg-header': '#0099ff',
      '--header-text': '#ffffff'
    }
  }
};

const defaultThemeName = 'autumn';

export const ThemeContext = createContext({
  themeName: defaultThemeName,
  setTheme: () => {},
  theme: themes[defaultThemeName]
});

export function ThemeProvider({ children }) {
  // On first load, check localStorage for user theme
  const [themeName, setThemeName] = useState(() => {
    const stored = window.localStorage.getItem('themeName');
    return (stored && themes[stored]) ? stored : defaultThemeName;
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