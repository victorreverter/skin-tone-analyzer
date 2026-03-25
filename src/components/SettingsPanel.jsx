import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import HistoryManager from '../utils/HistoryManager';

function SettingsPanel({ onClose }) {
    const { theme, toggleTheme, setThemePreference } = useTheme();
    const [historyRetention, setHistoryRetention] = useState(() => {
        return localStorage.getItem('historyRetention') || 'indefinite';
    });
    const [exportFormat, setExportFormat] = useState(() => {
        return localStorage.getItem('defaultExportFormat') || 'json';
    });
    const [showConfirm, setShowConfirm] = useState(null);

    const handleHistoryRetentionChange = (value) => {
        setHistoryRetention(value);
        localStorage.setItem('historyRetention', value);
    };

    const handleExportFormatChange = (value) => {
        setExportFormat(value);
        localStorage.setItem('defaultExportFormat', value);
    };

    const handleClearAllData = () => {
        localStorage.clear();
        HistoryManager.clearHistory();
        setShowConfirm(null);
        window.location.reload();
    };

    const handleResetSettings = () => {
        setHistoryRetention('indefinite');
        setExportFormat('json');
        setThemePreference('dark');
        localStorage.setItem('historyRetention', 'indefinite');
        localStorage.setItem('defaultExportFormat', 'json');
    };

    return (
        <div className="settings-panel">
            <div className="settings-header">
                <h3 className="settings-title">Settings</h3>
                <button 
                    className="settings-close"
                    onClick={onClose}
                    aria-label="Close settings"
                >
                    ×
                </button>
            </div>

            <div className="settings-content">
                <section className="settings-section">
                    <h4 className="section-title">Appearance</h4>
                    
                    <div className="setting-item">
                        <div className="setting-info">
                            <span className="setting-label">Theme</span>
                            <span className="setting-description">Choose your preferred color scheme</span>
                        </div>
                        <div className="theme-selector">
                            <button 
                                className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                                onClick={() => setThemePreference('light')}
                                aria-pressed={theme === 'light'}
                            >
                                <span className="theme-icon">☀️</span>
                                <span>Light</span>
                            </button>
                            <button 
                                className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                                onClick={() => setThemePreference('dark')}
                                aria-pressed={theme === 'dark'}
                            >
                                <span className="theme-icon">🌙</span>
                                <span>Dark</span>
                            </button>
                            <button 
                                className={`theme-option ${theme === 'system' ? 'active' : ''}`}
                                onClick={() => setThemePreference('system')}
                                aria-pressed={theme === 'system'}
                            >
                                <span className="theme-icon">💻</span>
                                <span>System</span>
                            </button>
                        </div>
                    </div>
                </section>

                <section className="settings-section">
                    <h4 className="section-title">Data & Privacy</h4>
                    
                    <div className="setting-item">
                        <div className="setting-info">
                            <span className="setting-label">History Retention</span>
                            <span className="setting-description">How long to keep analysis history</span>
                        </div>
                        <select 
                            className="setting-select"
                            value={historyRetention}
                            onChange={(e) => handleHistoryRetentionChange(e.target.value)}
                        >
                            <option value="session">Session only</option>
                            <option value="week">1 week</option>
                            <option value="month">1 month</option>
                            <option value="indefinite">Indefinitely</option>
                        </select>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <span className="setting-label">Default Export Format</span>
                            <span className="setting-description">Preferred format for exporting results</span>
                        </div>
                        <select 
                            className="setting-select"
                            value={exportFormat}
                            onChange={(e) => handleExportFormatChange(e.target.value)}
                        >
                            <option value="json">JSON</option>
                            <option value="csv">CSV</option>
                        </select>
                    </div>
                </section>

                <section className="settings-section">
                    <h4 className="section-title">About</h4>
                    
                    <div className="about-info">
                        <div className="app-version">
                            <span className="version-label">Version</span>
                            <span className="version-value">1.0.0</span>
                        </div>
                        <p className="about-description">
                            Skin Tone Analyzer helps you discover your perfect color palette 
                            based on your unique skin tone. All processing happens locally 
                            on your device.
                        </p>
                    </div>
                </section>

                <section className="settings-section danger-zone">
                    <h4 className="section-title">Danger Zone</h4>
                    
                    <div className="setting-item danger">
                        <div className="setting-info">
                            <span className="setting-label">Reset Settings</span>
                            <span className="setting-description">Reset all settings to defaults</span>
                        </div>
                        <button 
                            className="danger-btn"
                            onClick={handleResetSettings}
                        >
                            Reset
                        </button>
                    </div>

                    <div className="setting-item danger">
                        <div className="setting-info">
                            <span className="setting-label">Clear All Data</span>
                            <span className="setting-description">Delete all history, settings, and cached data</span>
                        </div>
                        {showConfirm === 'clear' ? (
                            <div className="confirm-actions">
                                <span className="confirm-text">Are you sure?</span>
                                <button 
                                    className="danger-btn confirm"
                                    onClick={handleClearAllData}
                                >
                                    Yes, Clear All
                                </button>
                                <button 
                                    className="cancel-btn"
                                    onClick={() => setShowConfirm(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button 
                                className="danger-btn"
                                onClick={() => setShowConfirm('clear')}
                            >
                                Clear Data
                            </button>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default SettingsPanel;
