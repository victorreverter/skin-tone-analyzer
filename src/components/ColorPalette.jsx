import React, { useState } from 'react';

function ColorPalette({ colors }) {
    const [copiedColor, setCopiedColor] = useState(null);

    const handleColorClick = (hex) => {
        // Copy to clipboard
        navigator.clipboard.writeText(hex).then(() => {
            setCopiedColor(hex);
            setTimeout(() => setCopiedColor(null), 2000);
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = hex;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopiedColor(hex);
            setTimeout(() => setCopiedColor(null), 2000);
        });
    };

    return (
        <div className="palette-grid">
            {colors.map((color, index) => (
                <div
                    key={index}
                    className="color-swatch"
                    onClick={() => handleColorClick(color.hex)}
                    title={`Click to copy ${color.hex}`}
                >
                    <div
                        className="color-square"
                        style={{ backgroundColor: color.hex }}
                    >
                        {copiedColor === color.hex && (
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                color: 'white',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                padding: '0.5rem 1rem',
                                borderRadius: '8px'
                            }}>
                                Copied!
                            </div>
                        )}
                    </div>
                    <div className="color-info">
                        <div className="color-name">{color.name}</div>
                        <div className="color-hex">{color.hex}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ColorPalette;
