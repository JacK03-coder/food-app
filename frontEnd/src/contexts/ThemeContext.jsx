import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

const STORAGE_KEY = 'theme';

export const ThemeProvider = ({ children }) => {
  const getInitialTheme = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch (e) {
      // ignore
    }
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {}
  }, [theme]);

  // Keep in sync with system preference only if user hasn't explicitly chosen
  useEffect(() => {
    let mq;
    try {
      mq = window.matchMedia('(prefers-color-scheme: dark)');
    } catch (e) {
      mq = null;
    }
    const handleChange = (e) => {
      // only update when there is no stored user preference
      let currentStored = null;
      try {
        currentStored = localStorage.getItem(STORAGE_KEY);
      } catch (err) {
        currentStored = null;
      }
      if (currentStored !== 'light' && currentStored !== 'dark') {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    if (mq && mq.addEventListener) {
      mq.addEventListener('change', handleChange);
    } else if (mq && mq.addListener) {
      mq.addListener(handleChange);
    }

    return () => {
      if (mq && mq.removeEventListener) {
        mq.removeEventListener('change', handleChange);
      } else if (mq && mq.removeListener) {
        mq.removeListener(handleChange);
      }
    };
  }, []);

  const toggleTheme = () => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  };

  const value = { theme, setTheme, toggleTheme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeContext;
