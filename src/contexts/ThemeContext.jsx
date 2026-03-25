import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const THEME_KEY = 'skinToneAnalyzer_theme';

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('dark');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem(THEME_KEY);
        if (stored) {
            setTheme(stored);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setTheme(prefersDark ? 'dark' : 'light');
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (!isLoading) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem(THEME_KEY, theme);
        }
    }, [theme, isLoading]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const setThemePreference = (preference) => {
        setTheme(preference);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setThemePreference, isLoading }}>
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

export default ThemeContext;
