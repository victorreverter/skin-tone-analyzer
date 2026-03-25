import React, { useState, useEffect } from 'react';
import ColorPalette from './ColorPalette';
import ResultCard from './ResultCard';
import SkinToneHistogram from './SkinToneHistogram';
import CalibrationHint from './CalibrationHint';
import ExportPanel from './ExportPanel';
import ColorSpaceDiagram from './ColorSpaceDiagram';
import ColorComparisonSlider from './ColorComparisonSlider';
import SamplingOverlay from './SamplingOverlay';
import CalibrationWizard from './CalibrationWizard';
import MultiSampleAnalyzer from './MultiSampleAnalyzer';
import HistoryPanel from './HistoryPanel';
import HistoryManager from '../utils/HistoryManager';

function AnalysisResults({ analysis, palette, skinPixels, confidence, imagePreview }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [showCalibrationWizard, setShowCalibrationWizard] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [savedToHistory, setSavedToHistory] = useState(false);

    useEffect(() => {
        if (analysis && palette && !savedToHistory) {
            HistoryManager.addToHistory(analysis, palette);
            setSavedToHistory(true);
        }
    }, [analysis, palette, savedToHistory]);

    if (!analysis || !palette) return null;

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'color-space', label: 'Color Space' },
        { id: 'compare', label: 'Compare' },
        { id: 'multi-sample', label: 'Multi-Sample' }
    ];

    const handleSelectHistory = (historyItem) => {
        console.log('Selected history item:', historyItem);
        setShowHistory(false);
    };

    return (
        <div className="results-container">
            <div className="results-header">
                <div className="results-header-content">
                    <div>
                        <h2 className="results-title">Your Analysis Results</h2>
                        <p className="results-subtitle">
                            Based on the analysis of your photo
                        </p>
                    </div>
                    <button 
                        className="history-toggle-btn"
                        onClick={() => setShowHistory(true)}
                    >
                        📋 History
                    </button>
                </div>
            </div>

            <div className="results-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'overview' && (
                <>
                    <div className="results-layout">
                        <div className="results-main">
                            <ResultCard 
                                analysis={analysis} 
                                palette={palette}
                                confidence={confidence}
                            />

                            <SkinToneHistogram 
                                skinPixels={skinPixels}
                                primaryColor={analysis.hex}
                            />

                            {imagePreview && (
                                <SamplingOverlay 
                                    image={imagePreview}
                                    skinPixels={skinPixels}
                                    heatmapData={analysis.heatmapData}
                                    faceRegion={analysis.faceRegion}
                                    imageDimensions={analysis.canvasSize}
                                />
                            )}

                            <CalibrationHint />

                            <button 
                                className="calibration-wizard-btn"
                                onClick={() => setShowCalibrationWizard(true)}
                            >
                                Run Calibration Wizard
                            </button>
                        </div>

                        <div className="results-sidebar">
                            <ExportPanel analysis={analysis} palette={palette} />
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'color-space' && (
                <div className="color-space-section">
                    <ColorSpaceDiagram 
                        primaryColor={analysis.hex}
                        undertone={analysis.undertone}
                    />
                </div>
            )}

            {activeTab === 'compare' && (
                <div className="compare-section">
                    <ColorComparisonSlider 
                        yourColor={analysis.hex}
                        recommendedColors={[palette.colors[0], palette.colors[1]]}
                    />
                </div>
            )}

            {activeTab === 'multi-sample' && (
                <div className="multi-sample-section">
                    <MultiSampleAnalyzer 
                        onComplete={(averagedResult) => {
                            console.log('Averaged result:', averagedResult);
                        }}
                    />
                </div>
            )}

            {showCalibrationWizard && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button 
                            className="modal-close"
                            onClick={() => setShowCalibrationWizard(false)}
                        >
                            ×
                        </button>
                        <CalibrationWizard 
                            onComplete={(calibration) => {
                                console.log('Calibration complete:', calibration);
                                setShowCalibrationWizard(false);
                            }}
                        />
                    </div>
                </div>
            )}

            {showHistory && (
                <div className="modal-overlay">
                    <div className="modal-content history-modal">
                        <button 
                            className="modal-close"
                            onClick={() => setShowHistory(false)}
                        >
                            ×
                        </button>
                        <HistoryPanel 
                            onSelectHistory={handleSelectHistory}
                            onClose={() => setShowHistory(false)}
                        />
                    </div>
                </div>
            )}

            <div className="palette-section">
                <h2 className="section-title">Your Perfect Color Palette</h2>

                <ColorPalette colors={palette.colors} />

                {/* Outfit Combinations */}
                <div className="combinations-section" style={{ marginTop: 'var(--spacing-xl)' }}>
                    <h3 style={{
                        fontSize: 'var(--font-size-xl)',
                        fontWeight: '600',
                        marginBottom: 'var(--spacing-lg)',
                        color: 'var(--text-primary)'
                    }}>
                        Outfit Combinations
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: 'var(--spacing-md)'
                    }}>
                        {palette.combinations.map((combo, index) => (
                            <div key={index} style={{
                                background: 'var(--bg-secondary)',
                                padding: 'var(--spacing-md)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border-color)'
                            }}>
                                <div style={{
                                    fontSize: 'var(--font-size-sm)',
                                    fontWeight: '600',
                                    color: 'var(--text-primary)',
                                    marginBottom: 'var(--spacing-sm)'
                                }}>
                                    {combo.outfit}
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                                    {combo.colors.map((colorName, idx) => {
                                        const color = palette.colors.find(c => c.name === colorName);
                                        return color ? (
                                            <div
                                                key={idx}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: 'var(--radius-sm)',
                                                    backgroundColor: color.hex,
                                                    border: '1px solid var(--border-color)',
                                                    flex: '1'
                                                }}
                                                title={color.name}
                                            ></div>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Wardrobe Essentials */}
                {palette.wardrobeEssentials && (
                    <div className="wardrobe-section" style={{ marginTop: 'var(--spacing-xl)' }}>
                        <h3 style={{
                            fontSize: 'var(--font-size-xl)',
                            fontWeight: '600',
                            marginBottom: 'var(--spacing-lg)',
                            color: 'var(--text-primary)'
                        }}>
                            Wardrobe Essentials
                        </h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: 'var(--spacing-lg)'
                        }}>
                            {/* Men */}
                            <div style={{
                                background: 'var(--bg-secondary)',
                                padding: 'var(--spacing-lg)',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid var(--border-color)'
                            }}>
                                <div style={{
                                    fontSize: 'var(--font-size-lg)',
                                    fontWeight: '600',
                                    color: 'var(--text-primary)',
                                    marginBottom: 'var(--spacing-md)'
                                }}>
                                    👔 For Men
                                </div>
                                {palette.wardrobeEssentials.men.map((item, idx) => (
                                    <div key={idx} style={{
                                        padding: 'var(--spacing-sm) 0',
                                        borderBottom: idx < palette.wardrobeEssentials.men.length - 1 ? '1px solid var(--border-color)' : 'none'
                                    }}>
                                        <div style={{
                                            fontSize: 'var(--font-size-sm)',
                                            fontWeight: '600',
                                            color: 'var(--text-primary)',
                                            marginBottom: '0.25rem'
                                        }}>
                                            {item.item}
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            marginBottom: '0.4rem',
                                            flexWrap: 'wrap'
                                        }}>
                                            <span style={{
                                                fontSize: 'var(--font-size-xs)',
                                                color: 'var(--text-secondary)',
                                                fontWeight: '500'
                                            }}>
                                                Colors:
                                            </span>
                                            {item.colors.map((colorName, colorIdx) => {
                                                const color = palette.colors.find(c => c.name === colorName);
                                                return color ? (
                                                    <div key={colorIdx} style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.3rem'
                                                    }}>
                                                        <div style={{
                                                            width: '16px',
                                                            height: '16px',
                                                            borderRadius: '3px',
                                                            backgroundColor: color.hex,
                                                            border: '1px solid var(--border-color)',
                                                            flexShrink: 0
                                                        }} title={color.hex}></div>
                                                        <span style={{
                                                            fontSize: 'var(--font-size-xs)',
                                                            color: 'var(--text-secondary)'
                                                        }}>
                                                            {colorName}
                                                        </span>
                                                    </div>
                                                ) : null;
                                            })}
                                        </div>
                                        <div style={{
                                            fontSize: 'var(--font-size-xs)',
                                            color: 'var(--text-muted)',
                                            fontStyle: 'italic'
                                        }}>
                                            {item.occasions}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Women */}
                            <div style={{
                                background: 'var(--bg-secondary)',
                                padding: 'var(--spacing-lg)',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid var(--border-color)'
                            }}>
                                <div style={{
                                    fontSize: 'var(--font-size-lg)',
                                    fontWeight: '600',
                                    color: 'var(--text-primary)',
                                    marginBottom: 'var(--spacing-md)'
                                }}>
                                    👗 For Women
                                </div>
                                {palette.wardrobeEssentials.women.map((item, idx) => (
                                    <div key={idx} style={{
                                        padding: 'var(--spacing-sm) 0',
                                        borderBottom: idx < palette.wardrobeEssentials.women.length - 1 ? '1px solid var(--border-color)' : 'none'
                                    }}>
                                        <div style={{
                                            fontSize: 'var(--font-size-sm)',
                                            fontWeight: '600',
                                            color: 'var(--text-primary)',
                                            marginBottom: '0.25rem'
                                        }}>
                                            {item.item}
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            marginBottom: '0.4rem',
                                            flexWrap: 'wrap'
                                        }}>
                                            <span style={{
                                                fontSize: 'var(--font-size-xs)',
                                                color: 'var(--text-secondary)',
                                                fontWeight: '500'
                                            }}>
                                                Colors:
                                            </span>
                                            {item.colors.map((colorName, colorIdx) => {
                                                const color = palette.colors.find(c => c.name === colorName);
                                                return color ? (
                                                    <div key={colorIdx} style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.3rem'
                                                    }}>
                                                        <div style={{
                                                            width: '16px',
                                                            height: '16px',
                                                            borderRadius: '3px',
                                                            backgroundColor: color.hex,
                                                            border: '1px solid var(--border-color)',
                                                            flexShrink: 0
                                                        }} title={color.hex}></div>
                                                        <span style={{
                                                            fontSize: 'var(--font-size-xs)',
                                                            color: 'var(--text-secondary)'
                                                        }}>
                                                            {colorName}
                                                        </span>
                                                    </div>
                                                ) : null;
                                            })}
                                        </div>
                                        <div style={{
                                            fontSize: 'var(--font-size-xs)',
                                            color: 'var(--text-muted)',
                                            fontStyle: 'italic'
                                        }}>
                                            {item.occasions}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Seasonal Tips */}
                <div className="seasonal-tips" style={{
                    marginTop: 'var(--spacing-xl)',
                    background: 'var(--bg-secondary)',
                    padding: 'var(--spacing-lg)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-color)'
                }}>
                    <h3 style={{
                        fontSize: 'var(--font-size-xl)',
                        fontWeight: '600',
                        marginBottom: 'var(--spacing-lg)',
                        color: 'var(--text-primary)'
                    }}>
                        Seasonal Clothing Tips
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: 'var(--spacing-md)'
                    }}>
                        {Object.entries(palette.seasonalTips).map(([season, tip]) => (
                            <div key={season}>
                                <div style={{
                                    fontSize: 'var(--font-size-sm)',
                                    fontWeight: '600',
                                    color: 'var(--accent-primary)',
                                    marginBottom: 'var(--spacing-xs)',
                                    textTransform: 'capitalize'
                                }}>
                                    {season === 'spring' && '🌸 Spring'}
                                    {season === 'summer' && '☀️ Summer'}
                                    {season === 'autumn' && '🍂 Autumn'}
                                    {season === 'winter' && '❄️ Winter'}
                                </div>
                                <div style={{
                                    fontSize: 'var(--font-size-sm)',
                                    color: 'var(--text-secondary)',
                                    lineHeight: '1.5'
                                }}>
                                    {tip}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Best For & Avoid */}
                <div style={{
                    marginTop: 'var(--spacing-lg)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 'var(--spacing-md)'
                }}>
                    <div style={{
                        background: 'var(--bg-secondary)',
                        padding: 'var(--spacing-md)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)'
                    }}>
                        <div style={{
                            fontSize: 'var(--font-size-base)',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            marginBottom: 'var(--spacing-sm)'
                        }}>
                            ✓ Best For You
                        </div>
                        <ul style={{
                            listStyle: 'none',
                            fontSize: 'var(--font-size-sm)',
                            color: 'var(--text-secondary)'
                        }}>
                            {palette.bestFor.map((item, idx) => (
                                <li key={idx} style={{ padding: '0.25rem 0' }}>• {item}</li>
                            ))}
                        </ul>
                    </div>
                    <div style={{
                        background: 'var(--bg-secondary)',
                        padding: 'var(--spacing-md)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)'
                    }}>
                        <div style={{
                            fontSize: 'var(--font-size-base)',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            marginBottom: 'var(--spacing-sm)'
                        }}>
                            ✗ Colors to Avoid
                        </div>
                        <ul style={{
                            listStyle: 'none',
                            fontSize: 'var(--font-size-sm)',
                            color: 'var(--text-secondary)'
                        }}>
                            {palette.avoidColors.map((item, idx) => (
                                <li key={idx} style={{ padding: '0.25rem 0' }}>• {item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AnalysisResults;
