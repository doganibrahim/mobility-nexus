'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { THEMES, ThemeConfig, FONT_PRESETS, FontPreset } from './constants';

interface ThemeContextType {
  theme: string;
  themeConfig: ThemeConfig;
  setTheme: (themeId: string) => void;
  availableThemes: ThemeConfig[];
  font: string;
  fontPreset: FontPreset;
  setFont: (fontId: string) => void;
  availableFonts: FontPreset[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<string>('theme-01');
  const [font, setFontState] = useState<string>('font-inter');

  useEffect(() => {
    // 1. Load Color Theme
    const savedTheme = localStorage.getItem('cappinno_theme');
    if (savedTheme && THEMES[savedTheme]) {
      setThemeState(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'theme-01');
    }

    // 2. Load Font Preset
    const savedFont = localStorage.getItem('cappinno_font');
    if (savedFont && FONT_PRESETS[savedFont]) {
      setFontState(savedFont);
      document.documentElement.setAttribute('data-font', savedFont);
    } else {
      document.documentElement.setAttribute('data-font', 'font-inter');
    }
  }, []);

  const setTheme = (themeId: string) => {
    if (!THEMES[themeId]) return;
    setThemeState(themeId);
    localStorage.setItem('cappinno_theme', themeId);
    document.documentElement.setAttribute('data-theme', themeId);
  };

  const setFont = (fontId: string) => {
    if (!FONT_PRESETS[fontId]) return;
    setFontState(fontId);
    localStorage.setItem('cappinno_font', fontId);
    document.documentElement.setAttribute('data-font', fontId);
  };

  const themeConfig = THEMES[theme] || THEMES['theme-01'];
  const fontPreset = FONT_PRESETS[font] || FONT_PRESETS['font-inter'];

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeConfig,
        setTheme,
        availableThemes: Object.values(THEMES),
        font,
        fontPreset,
        setFont,
        availableFonts: Object.values(FONT_PRESETS),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
