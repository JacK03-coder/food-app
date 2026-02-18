import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import '../../styles/themeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      aria-label="Toggle theme"
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      className="theme-toggle-btn"
      onClick={toggleTheme}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggle;
  