const ExportUtils = {
    exportToJSON: (analysis, palette) => {
        const data = {
            timestamp: new Date().toISOString(),
            skinTone: {
                hex: analysis.hex,
                rgb: analysis.skinTone,
                undertone: analysis.undertone
            },
            palette: {
                name: palette.name,
                description: palette.description,
                colors: palette.colors.map(c => ({
                    name: c.name,
                    hex: c.hex,
                    category: c.category
                })),
                combinations: palette.combinations,
                seasonalTips: palette.seasonalTips,
                bestFor: palette.bestFor,
                avoidColors: palette.avoidColors
            }
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        downloadBlob(blob, `skin-tone-analysis-${Date.now()}.json`);
    },

    exportToCSV: (analysis, palette) => {
        const headers = ['Name', 'Hex', 'Category'];
        const rows = palette.colors.map(c => [c.name, c.hex, c.category]);
        
        const csvContent = [
            `# Skin Tone Analysis - ${new Date().toLocaleDateString()}`,
            `# Undertone: ${analysis.undertone}`,
            `# Primary Color: ${analysis.hex}`,
            '',
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        downloadBlob(blob, `skin-palette-${Date.now()}.csv`);
    },

    copyToClipboard: async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        }
    },

    shareResults: async (analysis, palette) => {
        const shareData = {
            title: 'My Skin Tone Analysis',
            text: `My skin tone: ${analysis.hex} (${analysis.undertone}) | ${palette.name}`,
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                return { success: true, method: 'native' };
            } catch (err) {
                if (err.name !== 'AbortError') {
                    return fallbackShare(shareData);
                }
                return { success: false, reason: 'cancelled' };
            }
        } else {
            return fallbackShare(shareData);
        }
    }
};

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function fallbackShare(shareData) {
    const text = `${shareData.text}\n\nGenerated with Skin Tone Analyzer`;
    ExportUtils.copyToClipboard(text);
    return { success: true, method: 'clipboard', text };
}

export default ExportUtils;
