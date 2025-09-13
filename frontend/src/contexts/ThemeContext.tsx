'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

// Step 1: Define the shape of our theme context
// This tells TypeScript what properties our context will have
type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;                    // Current theme ('light' or 'dark')
  toggleTheme: () => void;         // Function to switch between themes
}

// Step 2: Create the context with default values
// createContext creates a "box" that components can access
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Step 3: Create a provider component
// This component will wrap our entire app and provide theme data to all children
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // useState is a React hook that manages component state
  // theme is the current value, setTheme is the function to change it
  const [theme, setTheme] = useState<Theme>('light');

  // useEffect runs code when the component mounts (first loads)
  useEffect(() => {
    // Check if user has a saved theme preference in localStorage
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // If no saved preference, check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(systemPrefersDark ? 'dark' : 'light');
    }
  }, []);

  // useEffect runs when theme changes
  useEffect(() => {
    // Save theme preference to localStorage so it persists
    localStorage.setItem('theme', theme);
    
    // Add or remove 'dark' class from document element
    // This is how we apply dark mode styles globally
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // The value object contains all the data and functions we want to share
  const value = {
    theme,
    toggleTheme,
  };

  // Return the provider with the value
  // All children of this component can now access theme and toggleTheme
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Step 4: Create a custom hook to use the theme context
// This makes it easy for components to access theme data
export function useTheme() {
  const context = useContext(ThemeContext);
  
  // If useTheme is called outside of ThemeProvider, throw an error
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}
