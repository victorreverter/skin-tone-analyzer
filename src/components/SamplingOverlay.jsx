import React, { useState, useMemo } from 'react';

function SamplingOverlay({ image, skinPixels, heatmapData, faceRegion, imageDimensions, showOverlay = true }) {
    const [isVisible, setIsVisible] = useState(showOverlay);
    const [overlayStyle, setOverlayStyle] = useState('heatmap');

    const dims = useMemo(() => {
        return imageDimensions || { width: 400, height: 400 };
    }, [imageDimensions]);

    const samplingData = useMemo(() => {
        // Use real data if available, otherwise generate mock
        if (heatmapData && heatmapData.length > 0) {
            const points = [];
            heatmapData.forEach(row => {
                row.forEach(cell => {
                    if (cell.isSkin) {
                        points.push({
                            x: cell.x,
                            y: cell.y,
                            color: `rgb(${cell.color.r}, ${cell.color.g}, ${cell.color.b})`,
                            intensity: cell.intensity
                        });
                    }
                });
            });

            return {
                points,
                heatmapGrid: heatmapData.flat(),
                centerX: faceRegion ? faceRegion.x + faceRegion.width / 2 : dims.width / 2,
                centerY: faceRegion ? faceRegion.y + faceRegion.height / 2 : dims.height / 2,
                radius: faceRegion ? Math.max(faceRegion.width, faceRegion.height) / 2 : Math.min(dims.width, dims.height) / 4,
                faceRegion: faceRegion,
                method: faceRegion?.method || 'unknown'
            };
        }

        return generateMockSamplingData(dims.width, dims.height);
    }, [heatmapData, faceRegion, dims]);

    const getHeatmapColor = (cell) => {
        if (!cell) return 'rgba(0, 0, 0, 0)';
        
        if (cell.isSkin) {
            // Skin tone - show actual color with transparency
            const { r, g, b } = cell.color;
            return `rgba(${r}, ${g}, ${b}, 0.6)`;
        }
        
        // Non-skin - gradient based on brightness
        const brightness = cell.intensity / 255;
        return `rgba(${brightness * 50}, ${brightness * 50}, ${brightness * 50}, 0.2)`;
    };

    if (!isVisible) {
        return (
            <button 
                className="overlay-toggle-btn"
                onClick={() => setIsVisible(true)}
            >
                Show Sampling Overlay
            </button>
        );
    }

    return (
        <div className="sampling-overlay">
            <div className="overlay-header">
                <h4 className="overlay-title">Sampling Visualization</h4>
                <div className="overlay-controls">
                    <select 
                        value={overlayStyle}
                        onChange={(e) => setOverlayStyle(e.target.value)}
                        className="overlay-select"
                        aria-label="Select overlay style"
                    >
                        <option value="heatmap">Heatmap</option>
                        <option value="points">Points</option>
                        <option value="region">Face Region</option>
                    </select>
                    <button 
                        className="overlay-close"
                        onClick={() => setIsVisible(false)}
                        aria-label="Close overlay"
                    >
                        ×
                    </button>
                </div>
            </div>

            <div className="overlay-container">
                <img 
                    src={image} 
                    alt="Uploaded image with sampling overlay"
                    className="overlay-image"
                />
                
                <svg className="overlay-svg" viewBox={`0 0 ${dims.width} ${dims.height}`} preserveAspectRatio="xMidYMid meet">
                    {/* Heatmap overlay */}
                    {overlayStyle === 'heatmap' && samplingData.heatmapGrid.map((cell, index) => (
                        <rect
                            key={index}
                            x={cell.x - 5}
                            y={cell.y - 5}
                            width={10}
                            height={10}
                            fill={getHeatmapColor(cell)}
                        >
                            <title>{`${cell.isSkin ? 'Skin' : 'Background'}: RGB(${cell.color.r}, ${cell.color.g}, ${cell.color.b})`}</title>
                        </rect>
                    ))}

                    {/* Points overlay */}
                    {overlayStyle === 'points' && samplingData.points.slice(0, 200).map((point, index) => (
                        <circle
                            key={index}
                            cx={point.x}
                            cy={point.y}
                            r={2}
                            fill={point.color}
                            stroke="white"
                            strokeWidth={0.5}
                            opacity={0.8}
                        >
                            <title>{`Point: ${point.color}`}</title>
                        </circle>
                    ))}

                    {/* Face region overlay */}
                    {overlayStyle === 'region' && samplingData.faceRegion && (
                        <>
                            <rect
                                x={samplingData.faceRegion.x}
                                y={samplingData.faceRegion.y}
                                width={samplingData.faceRegion.width}
                                height={samplingData.faceRegion.height}
                                fill="none"
                                stroke="#0a84ff"
                                strokeWidth={2}
                                strokeDasharray="5,5"
                            />
                            <circle
                                cx={samplingData.centerX}
                                cy={samplingData.centerY}
                                r={6}
                                fill="#0a84ff"
                                stroke="white"
                                strokeWidth={2}
                            />
                        </>
                    )}
                </svg>
            </div>

            <div className="overlay-legend">
                {overlayStyle === 'heatmap' && (
                    <div className="legend-info">
                        <span className="legend-gradient-label">Heatmap shows skin detection</span>
                        <div className="legend-colors">
                            <span className="color-swatch-legend skin">Skin</span>
                            <span className="color-swatch-legend bg">Background</span>
                        </div>
                    </div>
                )}
                {overlayStyle === 'points' && (
                    <div className="legend-info">
                        <span className="legend-dot" style={{ background: '#fff' }} />
                        <span>Skin tone points ({Math.min(200, samplingData.points.length)} shown)</span>
                    </div>
                )}
                {overlayStyle === 'region' && (
                    <div className="legend-info">
                        <span className="legend-region-icon" />
                        <span>Detected face region ({samplingData.method})</span>
                    </div>
                )}
            </div>

            <div className="overlay-stats">
                <div className="stat-item">
                    <span className="stat-label">Skin Points</span>
                    <span className="stat-value">{samplingData.points.length}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Detection</span>
                    <span className="stat-value">{samplingData.method === 'detected' ? 'Face Detected' : 'Center Region'}</span>
                </div>
                {samplingData.faceRegion && samplingData.faceRegion.confidence && (
                    <div className="stat-item">
                        <span className="stat-label">Confidence</span>
                        <span className="stat-value">{samplingData.faceRegion.confidence}%</span>
                    </div>
                )}
            </div>
        </div>
    );
}

function generateMockSamplingData(width = 400, height = 400) {
    const points = [];
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 4;
    
    for (let i = 0; i < 50; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * radius;
        points.push({
            x: centerX + Math.cos(angle) * distance,
            y: centerY + Math.sin(angle) * distance,
            color: `rgb(${180 + Math.random() * 50}, ${140 + Math.random() * 40}, ${120 + Math.random() * 30})`,
            intensity: 150 + Math.random() * 50
        });
    }

    const heatmapGrid = [];
    const gridCols = Math.ceil(width / 10);
    const gridRows = Math.ceil(height / 10);
    for (let x = 0; x < gridCols; x++) {
        for (let y = 0; y < gridRows; y++) {
            heatmapGrid.push({
                x: x * 10 + 5,
                y: y * 10 + 5,
                intensity: Math.random() * 255,
                isSkin: Math.random() > 0.7,
                color: { r: 180 + Math.random() * 50, g: 140 + Math.random() * 40, b: 120 + Math.random() * 30 }
            });
        }
    }

    return { 
        points, 
        heatmapGrid, 
        centerX, 
        centerY, 
        radius,
        faceRegion: {
            x: centerX - radius,
            y: centerY - radius,
            width: radius * 2,
            height: radius * 2,
            method: 'mock',
            confidence: 75
        }
    };
}

export default SamplingOverlay;
