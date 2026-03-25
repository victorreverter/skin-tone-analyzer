import React, { useMemo, useState } from 'react';

function ColorSpaceDiagram({ primaryColor, undertone }) {
    const [viewMode, setViewMode] = useState('cie1976');
    const [hoveredRegion, setHoveredRegion] = useState(null);

    const { rgb, hsl, cielab } = useMemo(() => {
        const hex = primaryColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        const rgbToHsl = (r, g, b) => {
            r /= 255; g /= 255; b /= 255;
            const max = Math.max(r, g, b), min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;
            if (max === min) {
                h = s = 0;
            } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                    case g: h = ((b - r) / d + 2) / 6; break;
                    case b: h = ((r - g) / d + 4) / 6; break;
                }
            }
            return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
        };

        const rgbToLab = (r, g, b) => {
            let x, y, z;
            r /= 255; g /= 255; b /= 255;
            
            r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
            g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
            b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
            
            x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
            y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
            z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
            
            x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
            y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
            z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;
            
            return {
                L: Math.round((116 * y) - 16),
                a: Math.round(500 * (x - y)),
                b: Math.round(200 * (y - z))
            };
        };

        return {
            rgb: { r, g, b },
            hsl: rgbToHsl(r, g, b),
            cielab: rgbToLab(r, g, b)
        };
    }, [primaryColor]);

    const undertoneColors = useMemo(() => {
        const base = { ...rgb };
        if (undertone === 'Warm') {
            return {
                ...base,
                suggested: 'Gold, orange, coral accents',
                avoid: 'Cool silvers, icy blues'
            };
        } else if (undertone === 'Cool') {
            return {
                ...base,
                suggested: 'Silver, blue, pink accents',
                avoid: 'Orange, gold, warm yellows'
            };
        }
        return {
            ...base,
            suggested: 'Both gold and silver work',
            avoid: 'Extremely warm or cool extremes'
        };
    }, [rgb, undertone]);

    const cie1976Regions = [
        { name: 'Deep', x: 0.3, y: 0.35, color: '#1a1a1a' },
        { name: 'Medium', x: 0.45, y: 0.42, color: '#8B6914' },
        { name: 'Light', x: 0.58, y: 0.35, color: '#FAEBD7' },
    ];

    const skinToneGradient = useMemo(() => {
        return `linear-gradient(90deg, 
            #2C1810 0%, 
            #4A3228 15%, 
            #6B4423 30%, 
            #8B5A3C 45%, 
            #B8860B 60%, 
            #D4A574 75%, 
            #E8C8A8 90%, 
            #F5DEB3 100%
        )`;
    }, []);

    return (
        <div className="color-space-diagram" role="img" aria-label={`Color space visualization for ${primaryColor}`}>
            <div className="diagram-header">
                <h3 className="diagram-title">Color Space Analysis</h3>
                <div className="view-mode-toggle">
                    <button 
                        className={`mode-btn ${viewMode === 'cie1976' ? 'active' : ''}`}
                        onClick={() => setViewMode('cie1976')}
                    >
                        CIE 1976
                    </button>
                    <button 
                        className={`mode-btn ${viewMode === 'cie2000' ? 'active' : ''}`}
                        onClick={() => setViewMode('cie2000')}
                    >
                        CIE 2000
                    </button>
                </div>
            </div>

            <div className="color-space-visualization">
                <div className="cie-diagram">
                    <div className="diagram-labels">
                        <span className="label-x">Light → Dark</span>
                        <span className="label-y">Cool ← → Warm</span>
                    </div>
                    
                    <div className="cie-plane">
                        <div 
                            className="skin-tone-gradient-bar"
                            style={{ background: skinToneGradient }}
                            aria-hidden="true"
                        />
                        
                        <div className="reference-points">
                            {cie1976Regions.map((region, i) => (
                                <div 
                                    key={i}
                                    className="reference-point"
                                    style={{ 
                                        left: `${region.x * 100}%`,
                                        top: `${region.y * 100}%`,
                                        backgroundColor: region.color,
                                        border: '2px solid white'
                                    }}
                                    title={region.name}
                                />
                            ))}
                        </div>
                        
                        <div 
                            className="your-color-point"
                            style={{ 
                                left: `${50}%`,
                                top: `${50}%`,
                                backgroundColor: primaryColor
                            }}
                            title="Your skin tone"
                        />
                    </div>
                </div>

                <div className="color-values">
                    <div className="value-section">
                        <h4>RGB Values</h4>
                        <div className="value-grid">
                            <div className="value-item">
                                <span className="value-label">R</span>
                                <span className="value-number red">{rgb.r}</span>
                            </div>
                            <div className="value-item">
                                <span className="value-label">G</span>
                                <span className="value-number green">{rgb.g}</span>
                            </div>
                            <div className="value-item">
                                <span className="value-label">B</span>
                                <span className="value-number blue">{rgb.b}</span>
                            </div>
                        </div>
                    </div>

                    <div className="value-section">
                        <h4>HSL Values</h4>
                        <div className="value-grid">
                            <div className="value-item full">
                                <span className="value-label">H</span>
                                <span className="value-number">{hsl.h}°</span>
                            </div>
                            <div className="value-item full">
                                <span className="value-label">S</span>
                                <span className="value-number">{hsl.s}%</span>
                            </div>
                            <div className="value-item full">
                                <span className="value-label">L</span>
                                <span className="value-number">{hsl.l}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="value-section">
                        <h4>CIE L*a*b*</h4>
                        <div className="value-grid">
                            <div className="value-item full">
                                <span className="value-label">L*</span>
                                <span className="value-number">{cielab.L}</span>
                            </div>
                            <div className="value-item full">
                                <span className="value-label">a*</span>
                                <span className="value-number">{cielab.a > 0 ? '+' : ''}{cielab.a}</span>
                            </div>
                            <div className="value-item full">
                                <span className="value-label">b*</span>
                                <span className="value-number">{cielab.b > 0 ? '+' : ''}{cielab.b}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="undertone-recommendations">
                <div className="recommendation-item">
                    <span className="rec-icon">✓</span>
                    <span className="rec-text">{undertoneColors.suggested}</span>
                </div>
                <div className="recommendation-item avoid">
                    <span className="rec-icon">✗</span>
                    <span className="rec-text">{undertoneColors.avoid}</span>
                </div>
            </div>

            <div className="color-space-legend">
                <div className="legend-item">
                    <div className="legend-dot your" style={{ backgroundColor: primaryColor }} />
                    <span>Your Color</span>
                </div>
                <div className="legend-item">
                    <div className="legend-dot reference" />
                    <span>Reference Points</span>
                </div>
            </div>
        </div>
    );
}

export default ColorSpaceDiagram;
