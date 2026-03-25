import React, { useState, useMemo } from 'react';

function SamplingOverlay({ image, skinPixels, showOverlay = true }) {
    const [isVisible, setIsVisible] = useState(showOverlay);
    const [overlayStyle, setOverlayStyle] = useState('points');

    const samplingData = useMemo(() => {
        if (!skinPixels || skinPixels.length === 0) {
            return generateMockSamplingData();
        }

        const imageRect = { width: 400, height: 400 };
        const centerX = imageRect.width / 2;
        const centerY = imageRect.height / 2;
        const radius = Math.min(imageRect.width, imageRect.height) / 4;

        const sampledPixels = skinPixels.slice(0, 100);
        const points = sampledPixels.map((pixel, index) => {
            const angle = (index / sampledPixels.length) * Math.PI * 2;
            const distance = Math.random() * radius;
            return {
                x: centerX + Math.cos(angle) * distance,
                y: centerY + Math.sin(angle) * distance,
                color: `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`,
                intensity: (pixel.r + pixel.g + pixel.b) / 3
            };
        });

        const heatmapGrid = [];
        const gridSize = 10;
        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                const gridX = (x / gridSize) * imageRect.width;
                const gridY = (y / gridSize) * imageRect.height;
                const nearbyPixels = points.filter(p => 
                    Math.abs(p.x - gridX) < imageRect.width / gridSize &&
                    Math.abs(p.y - gridY) < imageRect.height / gridSize
                );
                const avgIntensity = nearbyPixels.length > 0
                    ? nearbyPixels.reduce((sum, p) => sum + p.intensity, 0) / nearbyPixels.length
                    : 0;
                heatmapGrid.push({
                    x: gridX,
                    y: gridY,
                    width: imageRect.width / gridSize,
                    height: imageRect.height / gridSize,
                    intensity: avgIntensity
                });
            }
        }

        return { points, heatmapGrid, centerX, centerY, radius };
    }, [skinPixels]);

    const getHeatmapColor = (intensity) => {
        const normalized = Math.min(255, Math.max(0, intensity));
        if (normalized < 85) return `rgba(0, 0, 255, ${0.3 + (normalized / 255) * 0.3})`;
        if (normalized < 170) return `rgba(0, 255, 0, ${0.3 + ((normalized - 85) / 85) * 0.3})`;
        return `rgba(255, 0, 0, ${0.3 + ((normalized - 170) / 85) * 0.3})`;
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
                        <option value="points">Points</option>
                        <option value="heatmap">Heatmap</option>
                        <option value="circle">Circle</option>
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
                
                <svg className="overlay-svg" viewBox="0 0 400 400">
                    {overlayStyle === 'points' && samplingData.points.map((point, index) => (
                        <circle
                            key={index}
                            cx={point.x}
                            cy={point.y}
                            r={3}
                            fill={point.color}
                            stroke="white"
                            strokeWidth={1}
                            opacity={0.8}
                        >
                            <title>{`Point ${index + 1}: ${point.color}`}</title>
                        </circle>
                    ))}

                    {overlayStyle === 'heatmap' && samplingData.heatmapGrid.map((cell, index) => (
                        <rect
                            key={index}
                            x={cell.x}
                            y={cell.y}
                            width={cell.width}
                            height={cell.height}
                            fill={getHeatmapColor(cell.intensity)}
                        >
                            <title>{`Intensity: ${Math.round(cell.intensity)}`}</title>
                        </rect>
                    ))}

                    {overlayStyle === 'circle' && (
                        <>
                            <circle
                                cx={samplingData.centerX}
                                cy={samplingData.centerY}
                                r={samplingData.radius}
                                fill="none"
                                stroke="#0a84ff"
                                strokeWidth={2}
                                strokeDasharray="5,5"
                            />
                            <circle
                                cx={samplingData.centerX}
                                cy={samplingData.centerY}
                                r={4}
                                fill="#0a84ff"
                            />
                        </>
                    )}
                </svg>
            </div>

            <div className="overlay-legend">
                {overlayStyle === 'points' && (
                    <div className="legend-info">
                        <span className="legend-dot" style={{ background: '#fff' }} />
                        <span>Skin tone sampling points ({samplingData.points.length} points)</span>
                    </div>
                )}
                {overlayStyle === 'heatmap' && (
                    <div className="legend-gradient">
                        <span>Low</span>
                        <div className="gradient-bar" />
                        <span>High</span>
                    </div>
                )}
                {overlayStyle === 'circle' && (
                    <div className="legend-info">
                        <span className="legend-circle" />
                        <span>Analysis region (center sampling area)</span>
                    </div>
                )}
            </div>

            <div className="overlay-stats">
                <div className="stat-item">
                    <span className="stat-label">Samples</span>
                    <span className="stat-value">{samplingData.points.length}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Region</span>
                    <span className="stat-value">Center</span>
                </div>
            </div>
        </div>
    );
}

function generateMockSamplingData() {
    const points = [];
    const centerX = 200;
    const centerY = 200;
    const radius = 50;
    
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
    const gridSize = 10;
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            heatmapGrid.push({
                x: (x / gridSize) * 400,
                y: (y / gridSize) * 400,
                width: 400 / gridSize,
                height: 400 / gridSize,
                intensity: Math.random() * 255
            });
        }
    }

    return { points, heatmapGrid, centerX, centerY, radius };
}

export default SamplingOverlay;
