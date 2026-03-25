import React from 'react';

function ResultCard({ analysis, palette, confidence }) {
    if (!analysis) return null;

    const getInterpretation = () => {
        const brightness = (analysis.skinTone.r + analysis.skinTone.g + analysis.skinTone.b) / 3;
        
        if (brightness > 180) return 'Light skin tone with soft coloring';
        if (brightness > 120) return 'Medium skin tone with balanced warmth';
        return 'Deep skin tone with rich, bold coloring';
    };

    const getConfidenceLabel = () => {
        if (confidence >= 85) return 'High';
        if (confidence >= 70) return 'Medium';
        return 'Low';
    };

    const getConfidenceColor = () => {
        if (confidence >= 85) return 'var(--success-color)';
        if (confidence >= 70) return 'var(--warning-color)';
        return 'var(--error-color)';
    };

    const handleCopyHex = () => {
        navigator.clipboard.writeText(analysis.hex);
    };

    return (
        <div className="result-card-enhanced">
            <div className="result-card-header">
                <div className="result-label">Your Skin Tone</div>
                <button 
                    className="copy-hex-btn"
                    onClick={handleCopyHex}
                    aria-label={`Copy color code ${analysis.hex}`}
                    title="Copy color code"
                >
                    📋
                </button>
            </div>

            <div className="result-main">
                <div 
                    className="skin-tone-swatch-large"
                    style={{ backgroundColor: analysis.hex }}
                    role="img"
                    aria-label={`Skin tone color: ${analysis.hex}`}
                />
                
                <div className="result-details">
                    <div className="result-hex" title="Click to copy">
                        {analysis.hex}
                    </div>
                    <div className="result-interpretation">
                        {getInterpretation()}
                    </div>
                </div>
            </div>

            <div className="result-metrics">
                <div className="metric">
                    <span className="metric-label">Undertone</span>
                    <span className="metric-value">{analysis.undertone}</span>
                </div>
                <div className="metric">
                    <span className="metric-label">Skin Type</span>
                    <span className="metric-value">{palette?.name || 'Analyzing...'}</span>
                </div>
                <div className="metric">
                    <span className="metric-label">Confidence</span>
                    <span 
                        className="metric-value confidence-badge"
                        style={{ color: getConfidenceColor() }}
                    >
                        {getConfidenceLabel()} ({confidence}%)
                    </span>
                </div>
            </div>

            {palette && (
                <div className="result-description">
                    {palette.description}
                </div>
            )}
        </div>
    );
}

export default ResultCard;
