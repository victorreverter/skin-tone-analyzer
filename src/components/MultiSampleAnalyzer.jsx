import React, { useState, useCallback } from 'react';
import SkinToneAnalyzer from '../utils/SkinToneAnalyzer';

function MultiSampleAnalyzer({ onComplete }) {
    const [samples, setSamples] = useState([]);
    const [currentImage, setCurrentImage] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setDragOver(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setDragOver(false);
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            processFile(file);
        }
    }, []);

    const handleFileInput = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            processFile(file);
        }
    }, []);

    const processFile = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setCurrentImage(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleAnalyze = async () => {
        if (!currentImage) return;

        setIsAnalyzing(true);
        
        try {
            const img = new Image();
            img.src = currentImage;
            
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const maxSize = 400;
            const scale = Math.min(maxSize / img.width, maxSize / img.height);
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const sampleRadius = Math.min(canvas.width, canvas.height) / 4;

            const skinPixels = SkinToneAnalyzer.extractSkinPixels(ctx, centerX, centerY, sampleRadius);
            
            if (skinPixels.length === 0) {
                throw new Error('No skin detected');
            }

            const avgColor = SkinToneAnalyzer.calculateAverageColor(skinPixels);
            const undertone = SkinToneAnalyzer.determineUndertone(avgColor);
            
            const newSample = {
                id: Date.now(),
                image: currentImage,
                hex: SkinToneAnalyzer.rgbToHex(avgColor),
                skinTone: avgColor,
                undertone,
                confidence: Math.min(95, 70 + (skinPixels.length / 10)),
                pixelCount: skinPixels.length
            };

            setSamples(prev => [...prev, newSample]);
            setCurrentImage(null);
        } catch (err) {
            console.error('Analysis error:', err);
            alert('Could not analyze this image. Please try another photo.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleRemoveSample = (id) => {
        setSamples(prev => prev.filter(s => s.id !== id));
    };

    const handleClearAll = () => {
        setSamples([]);
    };

    const handleComplete = () => {
        if (samples.length === 0) return;

        const avgR = Math.round(samples.reduce((sum, s) => sum + s.skinTone.r, 0) / samples.length);
        const avgG = Math.round(samples.reduce((sum, s) => sum + s.skinTone.g, 0) / samples.length);
        const avgB = Math.round(samples.reduce((sum, s) => sum + s.skinTone.b, 0) / samples.length);

        const avgColor = { r: avgR, g: avgG, b: avgB };
        const undertone = SkinToneAnalyzer.determineUndertone(avgColor);
        
        const avgConfidence = Math.round(samples.reduce((sum, s) => sum + s.confidence, 0) / samples.length);

        onComplete({
            skinTone: avgColor,
            undertone,
            hex: SkinToneAnalyzer.rgbToHex(avgColor),
            confidence: avgConfidence,
            samples: samples.length
        });
    };

    return (
        <div className="multi-sample-analyzer">
            <div className="analyzer-header">
                <h3>Multi-Sample Analysis</h3>
                <p className="analyzer-description">
                    Analyze multiple photos to get a more accurate average result
                </p>
            </div>

            {samples.length === 0 && !currentImage && (
                <div 
                    className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('multi-sample-input').click()}
                >
                    <span className="drop-icon">📸</span>
                    <span className="drop-text">Add your first photo</span>
                    <span className="drop-hint">Drag & drop or click to upload</span>
                    <input
                        id="multi-sample-input"
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        style={{ display: 'none' }}
                    />
                </div>
            )}

            {currentImage && (
                <div className="current-preview">
                    <img src={currentImage} alt="Current sample" className="preview-image" />
                    <div className="preview-actions">
                        <button 
                            className="action-btn analyze"
                            onClick={handleAnalyze}
                            disabled={isAnalyzing}
                        >
                            {isAnalyzing ? 'Analyzing...' : 'Analyze This Photo'}
                        </button>
                        <button 
                            className="action-btn cancel"
                            onClick={() => setCurrentImage(null)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {samples.length > 0 && (
                <div className="samples-gallery">
                    <div className="gallery-header">
                        <h4>Samples ({samples.length})</h4>
                        <button 
                            className="clear-btn"
                            onClick={handleClearAll}
                        >
                            Clear All
                        </button>
                    </div>

                    <div className="samples-grid">
                        {samples.map((sample) => (
                            <div key={sample.id} className="sample-card">
                                <div className="sample-image-container">
                                    <img 
                                        src={sample.image} 
                                        alt={`Sample ${sample.id}`}
                                        className="sample-image"
                                    />
                                    <div 
                                        className="sample-color-indicator"
                                        style={{ backgroundColor: sample.hex }}
                                    />
                                </div>
                                <div className="sample-info">
                                    <span className="sample-hex">{sample.hex}</span>
                                    <span className="sample-confidence">
                                        {Math.round(sample.confidence)}% confidence
                                    </span>
                                </div>
                                <button 
                                    className="remove-btn"
                                    onClick={() => handleRemoveSample(sample.id)}
                                    aria-label="Remove sample"
                                >
                                    ×
                                </button>
                            </div>
                        ))}

                        {samples.length < 5 && !currentImage && (
                            <button 
                                className="add-sample-btn"
                                onClick={() => document.getElementById('multi-sample-input').click()}
                            >
                                <span className="add-icon">+</span>
                                <span>Add Photo</span>
                            </button>
                        )}
                    </div>

                    <div className="averaged-result">
                        <div className="averaged-label">Averaged Result</div>
                        <div className="averaged-values">
                            <div className="avg-color-preview" style={{
                                backgroundColor: samples.length > 0 
                                    ? `rgb(${Math.round(samples.reduce((s, x) => s + x.skinTone.r, 0) / samples.length)}, ${Math.round(samples.reduce((s, x) => s + x.skinTone.g, 0) / samples.length)}, ${Math.round(samples.reduce((s, x) => s + x.skinTone.b, 0) / samples.length)})`
                                    : '#888'
                            }} />
                            <div className="avg-details">
                                <span className="avg-hex">
                                    {samples.length > 0 ? SkinToneAnalyzer.rgbToHex({
                                        r: Math.round(samples.reduce((s, x) => s + x.skinTone.r, 0) / samples.length),
                                        g: Math.round(samples.reduce((s, x) => s + x.skinTone.g, 0) / samples.length),
                                        b: Math.round(samples.reduce((s, x) => s + x.skinTone.b, 0) / samples.length)
                                    }) : '---'}
                                </span>
                                <span className="avg-undertone">
                                    {samples.length > 0 ? samples[0].undertone : '---'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button 
                        className="complete-btn"
                        onClick={handleComplete}
                        disabled={samples.length === 0}
                    >
                        Use Averaged Result
                    </button>
                </div>
            )}

            {samples.length > 0 && (
                <div className="multi-sample-tip">
                    <p>
                        <strong>Tip:</strong> Analyze 3-5 photos taken in different lighting conditions 
                        for the most accurate average result.
                    </p>
                </div>
            )}
        </div>
    );
}

export default MultiSampleAnalyzer;
