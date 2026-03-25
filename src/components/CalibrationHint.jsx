import React, { useState } from 'react';

function CalibrationHint() {
    const [isExpanded, setIsExpanded] = useState(false);

    const tips = [
        {
            title: 'Good Lighting',
            description: 'Natural, diffused lighting works best. Avoid harsh shadows or direct sunlight.',
            icon: '💡'
        },
        {
            title: 'Clear Photo',
            description: 'Ensure your face is clearly visible and in focus. Remove glasses or hats if possible.',
            icon: '📷'
        },
        {
            title: 'Neutral Expression',
            description: 'Keep a relaxed, neutral expression. Avoid extreme facial expressions that may affect color.',
            icon: '😊'
        },
        {
            title: 'Face the Camera',
            description: 'Position your face centered in the frame, looking directly at the camera.',
            icon: '👤'
        },
        {
            title: 'Multiple Attempts',
            description: 'Try a few different photos to get a more accurate average result.',
            icon: '🔄'
        }
    ];

    return (
        <div className="calibration-hint">
            <button 
                className="calibration-toggle"
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
                aria-controls="calibration-tips"
            >
                <span className="toggle-icon">📊</span>
                <span className="toggle-text">Tips for Better Results</span>
                <span className="toggle-arrow" aria-hidden="true">
                    {isExpanded ? '▲' : '▼'}
                </span>
            </button>

            <div 
                id="calibration-tips"
                className={`calibration-content ${isExpanded ? 'expanded' : ''}`}
                role="region"
                aria-label="Calibration tips"
            >
                <div className="tips-list">
                    {tips.map((tip, index) => (
                        <div key={index} className="tip-item">
                            <span className="tip-icon" aria-hidden="true">{tip.icon}</span>
                            <div className="tip-content">
                                <span className="tip-title">{tip.title}</span>
                                <span className="tip-description">{tip.description}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="calibration-note">
                    <strong>Note:</strong> For more accurate results, consider using a reference color calibration card in your photo.
                </div>
            </div>
        </div>
    );
}

export default CalibrationHint;
