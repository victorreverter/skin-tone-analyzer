import React, { useState } from 'react';

function PrivacyPanel() {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="privacy-panel">
            <button 
                className="privacy-toggle"
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
                aria-controls="privacy-details"
            >
                <span className="privacy-icon" aria-hidden="true">🔒</span>
                <span className="privacy-badge">Your Privacy Matters</span>
                <span className="toggle-arrow" aria-hidden="true">
                    {isExpanded ? '▲' : '▼'}
                </span>
            </button>

            <div 
                id="privacy-details"
                className={`privacy-content ${isExpanded ? 'expanded' : ''}`}
                role="region"
                aria-label="Privacy details"
            >
                <div className="privacy-statement">
                    <div className="privacy-highlight">
                        <span className="highlight-icon">✓</span>
                        <span className="highlight-text">All processing happens on your device</span>
                    </div>
                    <p className="privacy-description">
                        Your photos are processed entirely within your browser. No image data is ever uploaded to external servers.
                    </p>
                </div>

                <div className="privacy-features">
                    <div className="feature-item">
                        <span className="feature-icon" aria-hidden="true">📱</span>
                        <div className="feature-content">
                            <span className="feature-title">On-Device Processing</span>
                            <span className="feature-description">
                                Color analysis runs locally using WebGL and Canvas APIs in your browser.
                            </span>
                        </div>
                    </div>

                    <div className="feature-item">
                        <span className="feature-icon" aria-hidden="true">🚫</span>
                        <div className="feature-content">
                            <span className="feature-title">No Data Collection</span>
                            <span className="feature-description">
                                We don't collect, store, or share any personal data or images.
                            </span>
                        </div>
                    </div>

                    <div className="feature-item">
                        <span className="feature-icon" aria-hidden="true">🍪</span>
                        <div className="feature-content">
                            <span className="feature-title">No Cookies</span>
                            <span className="feature-description">
                                This app doesn't use cookies or any form of tracking.
                            </span>
                        </div>
                    </div>
                </div>

                <div className="privacy-footer">
                    <p>
                        Your photos never leave your device. All analysis is performed locally in your browser's memory.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PrivacyPanel;
