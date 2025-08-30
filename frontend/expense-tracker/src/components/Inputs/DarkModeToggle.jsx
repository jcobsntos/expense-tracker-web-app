import React from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../../context/themeContext';

const DarkModeToggle = ({ className = "" }) => {
  const { darkMode, toggleDarkMode } = useTheme();

  const handleToggle = () => {
    console.log('DarkModeToggle clicked, current mode:', darkMode ? 'dark' : 'light');
    toggleDarkMode();
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleToggle}
      className={`relative flex items-center justify-between w-16 h-8 rounded-full p-1 transition-all duration-300 ${className} ${
        darkMode ? 'bg-gray-600' : 'bg-gray-300'
      }`}
      aria-label={`Toggle to ${darkMode ? 'light' : 'dark'} mode`}
    >
      {/* Background slider */}
      <motion.div
        className={`absolute w-6 h-6 rounded-full shadow-md ${
          darkMode ? 'bg-gray-200' : 'bg-white'
        }`}
        animate={{
          x: darkMode ? 32 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 30,
        }}
      />
      
      {/* Sun icon */}
      <FaSun 
        className={`w-4 h-4 z-10 transition-colors duration-300 ${
          !darkMode ? 'text-yellow-500' : 'text-gray-400'
        }`} 
      />
      
      {/* Moon icon */}
      <FaMoon 
        className={`w-4 h-4 z-10 transition-colors duration-300 ${
          darkMode ? 'text-blue-400' : 'text-gray-400'
        }`} 
      />
    </motion.button>
  );
};

export default DarkModeToggle;
