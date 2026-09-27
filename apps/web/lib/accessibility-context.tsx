'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type FontSizeOption = 'normal' | 'large' | 'xlarge';

export interface AccessibilityPreferences {
  fontSize: FontSizeOption;
  highContrast: boolean;
  underlineLinks: boolean;
  reducedMotion: boolean;
  dyslexiaFont: boolean;
}

interface AccessibilityContextType extends AccessibilityPreferences {
  setFontSize: (size: FontSizeOption) => void;
  setHighContrast: (enabled: boolean) => void;
  setUnderlineLinks: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
  setDyslexiaFont: (enabled: boolean) => void;
  resetToDefault: () => void;
}

const DEFAULT_PREFERENCES: AccessibilityPreferences = {
  fontSize: 'normal',
  highContrast: false,
  underlineLinks: false,
  reducedMotion: false,
  dyslexiaFont: false,
};

const STORAGE_KEY = 'erasmus_a11y_preferences';

const AccessibilityContext = createContext<AccessibilityContextType>({
  ...DEFAULT_PREFERENCES,
  setFontSize: () => {},
  setHighContrast: () => {},
  setUnderlineLinks: () => {},
  setReducedMotion: () => {},
  setDyslexiaFont: () => {},
  resetToDefault: () => {},
});

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(DEFAULT_PREFERENCES);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences({
          fontSize: parsed.fontSize || 'normal',
          highContrast: !!parsed.highContrast,
          underlineLinks: !!parsed.underlineLinks,
          reducedMotion: !!parsed.reducedMotion,
          dyslexiaFont: !!parsed.dyslexiaFont,
        });
      }
    } catch (e) {
      console.warn('Failed to load accessibility preferences:', e);
    }
    setMounted(true);
  }, []);

  // Sync to documentElement data attributes and localStorage
  useEffect(() => {
    if (!mounted) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (e) {
      console.warn('Failed to save accessibility preferences:', e);
    }

    const root = document.documentElement;
    root.setAttribute('data-a11y-font-size', preferences.fontSize);
    root.setAttribute('data-a11y-contrast', String(preferences.highContrast));
    root.setAttribute('data-a11y-underline', String(preferences.underlineLinks));
    root.setAttribute('data-a11y-motion', String(preferences.reducedMotion));
    root.setAttribute('data-a11y-dyslexia', String(preferences.dyslexiaFont));
  }, [preferences, mounted]);

  const setFontSize = (size: FontSizeOption) => {
    setPreferences((prev) => ({ ...prev, fontSize: size }));
  };

  const setHighContrast = (enabled: boolean) => {
    setPreferences((prev) => ({ ...prev, highContrast: enabled }));
  };

  const setUnderlineLinks = (enabled: boolean) => {
    setPreferences((prev) => ({ ...prev, underlineLinks: enabled }));
  };

  const setReducedMotion = (enabled: boolean) => {
    setPreferences((prev) => ({ ...prev, reducedMotion: enabled }));
  };

  const setDyslexiaFont = (enabled: boolean) => {
    setPreferences((prev) => ({ ...prev, dyslexiaFont: enabled }));
  };

  const resetToDefault = () => {
    setPreferences(DEFAULT_PREFERENCES);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        ...preferences,
        setFontSize,
        setHighContrast,
        setUnderlineLinks,
        setReducedMotion,
        setDyslexiaFont,
        resetToDefault,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  return useContext(AccessibilityContext);
}
