import React, { useState, useRef, useEffect } from 'react';

function ColorComparisonSlider({ yourColor, recommendedColors }) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const containerRef = useRef(null);
    const isDragging = useRef(false);

    const handleMouseDown = () => {
        isDragging.current = true;
    };

    const handleMouseUp = () => {
        isDragging.current = false;
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current || !containerRef.current) return;
        
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setSliderPosition(percentage);
    };

    const handleTouchMove = (e) => {
        if (!containerRef.current) return;
        
        const rect = containerRef.current.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setSliderPosition(percentage);
    };

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const [firstColor, secondColor] = recommendedColors;

    return (
        <div className="color-comparison-slider">
            <h3 className="comparison-title">Before & After</h3>
            <p className="comparison-description">
                Compare your detected skin tone with recommended colors
            </p>

            <div 
                ref={containerRef}
                className="comparison-container"
                onTouchMove={handleTouchMove}
                role="slider"
                aria-label="Color comparison slider"
                aria-valuenow={sliderPosition}
                aria-valuemin={0}
                aria-valuemax={100}
                tabIndex={0}
            >
                <div 
                    className="comparison-side left"
                    style={{ 
                        clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                        backgroundColor: yourColor
                    }}
                >
                    <div className="side-label">Your Skin Tone</div>
                </div>

                <div 
                    className="comparison-side right"
                    style={{ 
                        clipPath: `inset(0 0 0 ${sliderPosition}%)`,
                        background: `linear-gradient(135deg, ${firstColor?.hex || '#888'}, ${secondColor?.hex || '#666'})`
                    }}
                >
                    <div className="side-label">Recommended</div>
                </div>

                <div 
                    className="slider-handle"
                    style={{ left: `${sliderPosition}%` }}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleMouseDown}
                    role="presentation"
                >
                    <div className="handle-line" />
                    <div className="handle-grip">
                        <span className="grip-arrow">◀</span>
                        <span className="grip-arrow">▶</span>
                    </div>
                    <div className="handle-line" />
                </div>
            </div>

            <div className="comparison-swatches">
                <div className="swatch-item">
                    <div 
                        className="swatch-preview"
                        style={{ backgroundColor: yourColor }}
                    />
                    <div className="swatch-info">
                        <span className="swatch-label">Your Color</span>
                        <span className="swatch-hex">{yourColor}</span>
                    </div>
                </div>
                {recommendedColors.map((color, index) => (
                    <div key={index} className="swatch-item">
                        <div 
                            className="swatch-preview"
                            style={{ backgroundColor: color?.hex || '#888' }}
                        />
                        <div className="swatch-info">
                            <span className="swatch-label">{color?.name || 'Recommended'}</span>
                            <span className="swatch-hex">{color?.hex || '#888888'}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="comparison-tips">
                <p>
                    <strong>Tip:</strong> Drag the slider to compare your detected skin tone 
                    with the recommended palette colors. The best matches will complement your natural coloring.
                </p>
            </div>
        </div>
    );
}

export default ColorComparisonSlider;
