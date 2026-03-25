import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

function ThemeToggle({ showLabel = true }) {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            <span className="toggle-icon" aria-hidden="true">
                {theme === 'dark' ? '☀️' : '🌙'}
            </span>
            {showLabel && (
                <span className="toggle-label">
                    {theme === 'dark' ? 'Light' : 'Dark'}
                </span>
            )}
        </button>
    );
}

export default ThemeToggle;
