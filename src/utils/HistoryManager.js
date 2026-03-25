const HISTORY_KEY = 'skinToneAnalyzer_history';
const MAX_HISTORY_ITEMS = 20;

const HistoryManager = {
    getHistory: () => {
        try {
            const data = localStorage.getItem(HISTORY_KEY);
            return data ? JSON.parse(data) : [];
        } catch (err) {
            console.error('Failed to get history:', err);
            return [];
        }
    },

    addToHistory: (analysis, palette) => {
        try {
            const history = HistoryManager.getHistory();
            
            const newEntry = {
                id: Date.now(),
                timestamp: new Date().toISOString(),
                analysis: {
                    hex: analysis.hex,
                    rgb: analysis.skinTone,
                    undertone: analysis.undertone,
                    confidence: analysis.confidence || 0
                },
                palette: {
                    name: palette.name,
                    description: palette.description,
                    colors: palette.colors.map(c => ({ name: c.name, hex: c.hex }))
                },
                thumbnail: null
            };

            const updatedHistory = [newEntry, ...history].slice(0, MAX_HISTORY_ITEMS);
            localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
            
            return newEntry;
        } catch (err) {
            console.error('Failed to add to history:', err);
            return null;
        }
    },

    removeFromHistory: (id) => {
        try {
            const history = HistoryManager.getHistory();
            const updatedHistory = history.filter(item => item.id !== id);
            localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
            return true;
        } catch (err) {
            console.error('Failed to remove from history:', err);
            return false;
        }
    },

    clearHistory: () => {
        try {
            localStorage.removeItem(HISTORY_KEY);
            return true;
        } catch (err) {
            console.error('Failed to clear history:', err);
            return false;
        }
    },

    getHistoryItem: (id) => {
        const history = HistoryManager.getHistory();
        return history.find(item => item.id === id) || null;
    },

    updateThumbnail: (id, thumbnailDataUrl) => {
        try {
            const history = HistoryManager.getHistory();
            const index = history.findIndex(item => item.id === id);
            
            if (index !== -1) {
                history[index].thumbnail = thumbnailDataUrl;
                localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
                return true;
            }
            return false;
        } catch (err) {
            console.error('Failed to update thumbnail:', err);
            return false;
        }
    },

    exportHistory: () => {
        const history = HistoryManager.getHistory();
        const data = JSON.stringify(history, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `skin-tone-history-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    importHistory: (jsonData) => {
        try {
            const imported = JSON.parse(jsonData);
            if (!Array.isArray(imported)) {
                throw new Error('Invalid history format');
            }
            
            const currentHistory = HistoryManager.getHistory();
            const merged = [...imported, ...currentHistory]
                .sort((a, b) => b.id - a.id)
                .slice(0, MAX_HISTORY_ITEMS);
            
            localStorage.setItem(HISTORY_KEY, JSON.stringify(merged));
            return true;
        } catch (err) {
            console.error('Failed to import history:', err);
            return false;
        }
    },

    getHistoryStats: () => {
        const history = HistoryManager.getHistory();
        const undertoneCounts = {};
        const confidenceSum = 0;
        let totalConfidence = 0;

        history.forEach(item => {
            const undertone = item.analysis.undertone;
            undertoneCounts[undertone] = (undertoneCounts[undertone] || 0) + 1;
            totalConfidence += item.analysis.confidence || 0;
        });

        return {
            totalAnalyses: history.length,
            undertoneCounts,
            averageConfidence: history.length > 0 
                ? Math.round(totalConfidence / history.length) 
                : 0
        };
    }
};

export default HistoryManager;
