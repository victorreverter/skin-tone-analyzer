import React, { useState } from 'react';
import ExportUtils from '../utils/ExportUtils';

function ExportPanel({ analysis, palette }) {
    const [showCopied, setShowCopied] = useState(false);
    const [shareStatus, setShareStatus] = useState(null);

    const handleExportJSON = () => {
        ExportUtils.exportToJSON(analysis, palette);
    };

    const handleExportCSV = () => {
        ExportUtils.exportToCSV(analysis, palette);
    };

    const handleCopyLink = async () => {
        const success = await ExportUtils.copyToClipboard(window.location.href);
        if (success) {
            setShowCopied(true);
            setTimeout(() => setShowCopied(false), 2000);
        }
    };

    const handleShare = async () => {
        const result = await ExportUtils.shareResults(analysis, palette);
        setShareStatus(result);
        if (result.success && result.method === 'clipboard') {
            setTimeout(() => setShareStatus(null), 3000);
        }
    };

    const shareText = shareStatus?.success 
        ? shareStatus.method === 'clipboard' 
            ? 'Results copied to clipboard!' 
            : 'Shared successfully!'
        : null;

    return (
        <div className="export-panel">
            <h3 className="export-title">Export Your Results</h3>
            
            <div className="export-actions">
                <button 
                    className="export-btn"
                    onClick={handleExportJSON}
                    aria-label="Export results as JSON file"
                >
                    <span className="btn-icon" aria-hidden="true">{ }</span>
                    <span className="btn-text">Export JSON</span>
                    <span className="btn-hint">Full data</span>
                </button>

                <button 
                    className="export-btn"
                    onClick={handleExportCSV}
                    aria-label="Export palette as CSV file"
                >
                    <span className="btn-icon" aria-hidden="true">📊</span>
                    <span className="btn-text">Export CSV</span>
                    <span className="btn-hint">Colors only</span>
                </button>

                <button 
                    className="export-btn"
                    onClick={handleCopyLink}
                    aria-label="Copy link to results"
                >
                    <span className="btn-icon" aria-hidden="true">🔗</span>
                    <span className="btn-text">
                        {showCopied ? 'Copied!' : 'Copy Link'}
                    </span>
                    <span className="btn-hint">Share</span>
                </button>

                <button 
                    className="export-btn share-btn"
                    onClick={handleShare}
                    aria-label="Share results"
                >
                    <span className="btn-icon" aria-hidden="true">📤</span>
                    <span className="btn-text">Share</span>
                    <span className="btn-hint">Social</span>
                </button>
            </div>

            {shareText && (
                <div className="share-notification" role="status" aria-live="polite">
                    {shareText}
                </div>
            )}

            <div className="export-summary">
                <div className="summary-item">
                    <span className="summary-label">Your Color</span>
                    <div className="summary-value">
                        <div 
                            className="summary-swatch" 
                            style={{ backgroundColor: analysis.hex }}
                            aria-hidden="true"
                        />
                        <span>{analysis.hex}</span>
                    </div>
                </div>
                <div className="summary-item">
                    <span className="summary-label">Palette</span>
                    <span className="summary-value">{palette.colors.length} colors</span>
                </div>
            </div>
        </div>
    );
}

export default ExportPanel;
