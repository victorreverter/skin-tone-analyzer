import React from 'react';

function LoadingSpinner({ size = 'medium', message = 'Loading...' }) {
    const sizes = {
        small: 24,
        medium: 48,
        large: 72
    };

    const spinnerSize = sizes[size] || sizes.medium;

    return (
        <div className="loading-spinner" role="status" aria-live="polite">
            <svg
                className="spinner-svg"
                width={spinnerSize}
                height={spinnerSize}
                viewBox="0 0 50 50"
            >
                <circle
                    className="spinner-circle"
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    strokeWidth="4"
                />
            </svg>
            {message && <span className="spinner-message">{message}</span>}
            <span className="sr-only">{message}</span>
        </div>
    );
}

function LoadingOverlay({ message = 'Processing...' }) {
    return (
        <div className="loading-overlay" role="dialog" aria-busy="true" aria-label={message}>
            <div className="loading-overlay-content">
                <LoadingSpinner size="large" />
                <p className="loading-overlay-message">{message}</p>
            </div>
        </div>
    );
}

function SkeletonBlock({ width = '100%', height = '20px', borderRadius = '4px' }) {
    return (
        <div 
            className="skeleton-block"
            style={{
                width,
                height,
                borderRadius,
            }}
            aria-hidden="true"
        />
    );
}

function SkeletonCard() {
    return (
        <div className="skeleton-card">
            <SkeletonBlock height="200px" borderRadius="8px" />
            <div className="skeleton-card-content">
                <SkeletonBlock width="60%" height="24px" />
                <SkeletonBlock width="100%" height="16px" />
                <SkeletonBlock width="80%" height="16px" />
                <div className="skeleton-card-footer">
                    <SkeletonBlock width="48px" height="48px" borderRadius="50%" />
                    <SkeletonBlock width="30%" height="16px" />
                </div>
            </div>
        </div>
    );
}

function SkeletonResults() {
    return (
        <div className="skeleton-results" aria-label="Loading results">
            <div className="skeleton-results-header">
                <SkeletonBlock width="200px" height="32px" />
                <SkeletonBlock width="150px" height="20px" />
            </div>
            <div className="skeleton-results-grid">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
            </div>
        </div>
    );
}

export { LoadingSpinner, LoadingOverlay, SkeletonBlock, SkeletonCard, SkeletonResults };
