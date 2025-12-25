
import React, { createContext, useState, useEffect, useMemo } from 'react';
import { Theme, Model } from '../types.ts';
import { MODELS } from '../constants.tsx';

interface SettingsContextType {
  theme: 'light' | 'dark';
  themeSetting: Theme;
  setThemeSetting: (theme: Theme) => void;
  selectedModel: Model;
  setSelectedModel: (model: Model) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeSetting, setThemeSetting] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    return storedTheme || 'system';
  });

  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');
  const [selectedModel, setSelectedModel] = useState<Model>(MODELS[0]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const getSystemTheme = () => mediaQuery.matches ? 'dark' : 'light';
    setSystemTheme(getSystemTheme());

    const handler = (e: MediaQueryListEvent) => setSystemTheme(e.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const theme = useMemo(() => {
    return themeSetting === 'system' ? systemTheme : themeSetting;
  }, [themeSetting, systemTheme]);

  const handleSetTheme = (newTheme: Theme) => {
    setThemeSetting(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const value = {
    theme,
    themeSetting,
    setThemeSetting: handleSetTheme,
    selectedModel,
    setSelectedModel,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
