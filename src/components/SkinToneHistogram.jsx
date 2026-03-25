import React, { useMemo } from 'react';

function SkinToneHistogram({ skinPixels, primaryColor }) {
    const histogramData = useMemo(() => {
        if (!skinPixels || skinPixels.length === 0) {
            return generateEmptyHistogram();
        }

        const rBins = new Array(16).fill(0);
        const gBins = new Array(16).fill(0);
        const bBins = new Array(16).fill(0);

        skinPixels.forEach(pixel => {
            rBins[Math.min(15, Math.floor(pixel.r / 16))]++;
            gBins[Math.min(15, Math.floor(pixel.g / 16))]++;
            bBins[Math.min(15, Math.floor(pixel.b / 16))]++;
        });

        const maxR = Math.max(...rBins);
        const maxG = Math.max(...gBins);
        const maxB = Math.max(...bBins);
        const maxAll = Math.max(maxR, maxG, maxB);

        return { rBins, gBins, bBins, maxAll };
    }, [skinPixels]);

    const maxHeight = 60;

    const getBarHeight = (value) => {
        return (value / histogramData.maxAll) * maxHeight;
    };

    const accessibilityDescription = useMemo(() => {
        if (!skinPixels || skinPixels.length === 0) {
            return 'No color data available for histogram';
        }
        return `Color distribution histogram showing ${skinPixels.length} sampled pixels. Red channel peaks at ${histogramData.rBins.indexOf(Math.max(...histogramData.rBins)) * 16}-${(histogramData.rBins.indexOf(Math.max(...histogramData.rBins)) + 1) * 16}, green at ${histogramData.gBins.indexOf(Math.max(...histogramData.gBins)) * 16}-${(histogramData.gBins.indexOf(Math.max(...histogramData.gBins)) + 1) * 16}, blue at ${histogramData.bBins.indexOf(Math.max(...histogramData.bBins)) * 16}-${(histogramData.bBins.indexOf(Math.max(...histogramData.bBins)) + 1) * 16}.`;
    }, [skinPixels, histogramData]);

    return (
        <div className="histogram-container" role="img" aria-label={accessibilityDescription}>
            <h3 className="histogram-title">Color Distribution</h3>
            
            <div className="histogram-chart">
                <div className="histogram-labels">
                    <span>Dark</span>
                    <span>Light</span>
                </div>
                
                <div className="histogram-bars-container">
                    <div className="histogram-channel" aria-label="Red channel distribution">
                        <div className="channel-label">R</div>
                        <div className="channel-bars">
                            {histogramData.rBins.map((value, index) => (
                                <div 
                                    key={`r-${index}`}
                                    className="histogram-bar red"
                                    style={{ height: `${getBarHeight(value)}px` }}
                                    title={`Red ${index * 16}-${(index + 1) * 16}: ${value} pixels`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="histogram-channel" aria-label="Green channel distribution">
                        <div className="channel-label">G</div>
                        <div className="channel-bars">
                            {histogramData.gBins.map((value, index) => (
                                <div 
                                    key={`g-${index}`}
                                    className="histogram-bar green"
                                    style={{ height: `${getBarHeight(value)}px` }}
                                    title={`Green ${index * 16}-${(index + 1) * 16}: ${value} pixels`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="histogram-channel" aria-label="Blue channel distribution">
                        <div className="channel-label">B</div>
                        <div className="channel-bars">
                            {histogramData.bBins.map((value, index) => (
                                <div 
                                    key={`b-${index}`}
                                    className="histogram-bar blue"
                                    style={{ height: `${getBarHeight(value)}px` }}
                                    title={`Blue ${index * 16}-${(index + 1) * 16}: ${value} pixels`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="histogram-stats">
                <div className="stat">
                    <span className="stat-label">Samples</span>
                    <span className="stat-value">{skinPixels?.length || 0}</span>
                </div>
                {primaryColor && (
                    <div className="stat">
                        <span className="stat-label">Detected Color</span>
                        <div className="stat-color-preview" style={{ backgroundColor: primaryColor }} />
                    </div>
                )}
            </div>
        </div>
    );
}

function generateEmptyHistogram() {
    return {
        rBins: new Array(16).fill(0),
        gBins: new Array(16).fill(0),
        bBins: new Array(16).fill(0),
        maxAll: 1
    };
}

export default SkinToneHistogram;
