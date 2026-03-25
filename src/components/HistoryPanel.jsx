import React, { useState, useEffect } from 'react';
import HistoryManager from '../utils/HistoryManager';

function HistoryPanel({ onSelectHistory, onClose }) {
    const [history, setHistory] = useState([]);
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('recent');

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = () => {
        const data = HistoryManager.getHistory();
        setHistory(data);
    };

    const handleDelete = (id, e) => {
        e.stopPropagation();
        if (HistoryManager.removeFromHistory(id)) {
            loadHistory();
        }
    };

    const handleClearAll = () => {
        if (window.confirm('Are you sure you want to clear all history? This cannot be undone.')) {
            HistoryManager.clearHistory();
            loadHistory();
        }
    };

    const handleExport = () => {
        HistoryManager.exportHistory();
    };

    const filteredHistory = history
        .filter(item => {
            if (filter === 'all') return true;
            return item.analysis.undertone.toLowerCase() === filter;
        })
        .sort((a, b) => {
            if (sortBy === 'recent') return b.id - a.id;
            if (sortBy === 'oldest') return a.id - b.id;
            if (sortBy === 'confidence') return (b.analysis.confidence || 0) - (a.analysis.confidence || 0);
            return 0;
        });

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const now = new Date();
        const diff = now - date;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        
        return date.toLocaleDateString();
    };

    const stats = HistoryManager.getHistoryStats();

    return (
        <div className="history-panel">
            <div className="history-header">
                <h3 className="history-title">Analysis History</h3>
                <div className="history-actions">
                    <button 
                        className="action-btn"
                        onClick={handleExport}
                        title="Export history"
                    >
                        📤
                    </button>
                    <button 
                        className="action-btn"
                        onClick={onClose}
                        title="Close"
                    >
                        ×
                    </button>
                </div>
            </div>

            <div className="history-stats">
                <div className="stat-item">
                    <span className="stat-value">{stats.totalAnalyses}</span>
                    <span className="stat-label">Analyses</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">{stats.averageConfidence}%</span>
                    <span className="stat-label">Avg Confidence</span>
                </div>
            </div>

            <div className="history-filters">
                <select 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="filter-select"
                >
                    <option value="all">All Undertones</option>
                    <option value="warm">Warm</option>
                    <option value="cool">Cool</option>
                    <option value="neutral">Neutral</option>
                </select>

                <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="filter-select"
                >
                    <option value="recent">Most Recent</option>
                    <option value="oldest">Oldest First</option>
                    <option value="confidence">Highest Confidence</option>
                </select>
            </div>

            {filteredHistory.length === 0 ? (
                <div className="history-empty">
                    <span className="empty-icon">📋</span>
                    <span className="empty-text">No analysis history yet</span>
                    <span className="empty-hint">Your analyses will appear here</span>
                </div>
            ) : (
                <div className="history-list">
                    {filteredHistory.map((item) => (
                        <div 
                            key={item.id}
                            className="history-item"
                            onClick={() => onSelectHistory(item)}
                        >
                            <div 
                                className="item-color"
                                style={{ backgroundColor: item.analysis.hex }}
                            />
                            <div className="item-info">
                                <div className="item-hex">{item.analysis.hex}</div>
                                <div className="item-details">
                                    <span className="item-undertone">{item.analysis.undertone}</span>
                                    <span className="item-dot">•</span>
                                    <span className="item-palette">{item.palette.name}</span>
                                </div>
                                <div className="item-meta">
                                    <span className="item-time">{formatDate(item.timestamp)}</span>
                                    <span className="item-confidence">
                                        {item.analysis.confidence}% confidence
                                    </span>
                                </div>
                            </div>
                            <button 
                                className="delete-btn"
                                onClick={(e) => handleDelete(item.id, e)}
                                title="Delete"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {history.length > 0 && (
                <div className="history-footer">
                    <button 
                        className="clear-all-btn"
                        onClick={handleClearAll}
                    >
                        Clear All History
                    </button>
                </div>
            )}
        </div>
    );
}

export default HistoryPanel;
