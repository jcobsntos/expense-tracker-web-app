import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false); // Default to light mode

  // Initialize theme on mount
  useEffect(() => {
    // Check localStorage for saved theme
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      const isDark = JSON.parse(savedTheme);
      setDarkMode(isDark);
      // Apply theme immediately
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // Default to light mode and save it
      setDarkMode(false);
      localStorage.setItem('darkMode', 'false');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Apply theme whenever darkMode changes
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    console.log('Theme applied:', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      console.log('Toggling theme from', prev ? 'dark' : 'light', 'to', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  const value = {
    darkMode,
    toggleDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
