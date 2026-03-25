import { describe, it, expect, beforeEach, vi } from 'vitest';
import HistoryManager from '../utils/HistoryManager';

describe('HistoryManager', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe('getHistory', () => {
        it('should return empty array when no history', () => {
            const history = HistoryManager.getHistory();
            expect(history).toEqual([]);
        });
    });

    describe('addToHistory', () => {
        it('should add entry to history', () => {
            const analysis = {
                hex: '#DEB887',
                skinTone: { r: 222, g: 184, b: 135 },
                undertone: 'Warm',
                confidence: 85
            };
            const palette = {
                name: 'Light Warm Skin',
                description: 'Sophisticated warm tones',
                colors: [
                    { name: 'Champagne', hex: '#F7E7CE' },
                    { name: 'Camel', hex: '#C19A6B' }
                ]
            };

            const entry = HistoryManager.addToHistory(analysis, palette);
            expect(entry).toBeDefined();
            expect(entry.id).toBeDefined();
            expect(entry.timestamp).toBeDefined();
            expect(entry.analysis.hex).toBe('#DEB887');
            expect(entry.palette.name).toBe('Light Warm Skin');
        });

        it('should limit history to 20 items', () => {
            const analysis = {
                hex: '#000000',
                skinTone: { r: 0, g: 0, b: 0 },
                undertone: 'Neutral',
                confidence: 50
            };
            const palette = {
                name: 'Test',
                description: 'Test',
                colors: []
            };

            for (let i = 0; i < 25; i++) {
                HistoryManager.addToHistory(analysis, palette);
            }

            const history = HistoryManager.getHistory();
            expect(history.length).toBe(20);
        });
    });

    describe('removeFromHistory', () => {
        it('should remove specific entry', () => {
            const analysis = {
                hex: '#DEB887',
                skinTone: { r: 222, g: 184, b: 135 },
                undertone: 'Warm',
                confidence: 85
            };
            const palette = {
                name: 'Test',
                description: 'Test',
                colors: []
            };

            const entry = HistoryManager.addToHistory(analysis, palette);
            expect(HistoryManager.getHistory().length).toBe(1);

            HistoryManager.removeFromHistory(entry.id);
            expect(HistoryManager.getHistory().length).toBe(0);
        });
    });

    describe('clearHistory', () => {
        it('should clear all history', () => {
            const analysis = {
                hex: '#DEB887',
                skinTone: { r: 222, g: 184, b: 135 },
                undertone: 'Warm',
                confidence: 85
            };
            const palette = {
                name: 'Test',
                description: 'Test',
                colors: []
            };

            HistoryManager.addToHistory(analysis, palette);
            HistoryManager.addToHistory(analysis, palette);
            expect(HistoryManager.getHistory().length).toBe(2);

            HistoryManager.clearHistory();
            expect(HistoryManager.getHistory().length).toBe(0);
        });
    });

    describe('getHistoryStats', () => {
        it('should return correct stats', () => {
            const analysis1 = {
                hex: '#DEB887',
                skinTone: { r: 222, g: 184, b: 135 },
                undertone: 'Warm',
                confidence: 80
            };
            const analysis2 = {
                hex: '#D2B48C',
                skinTone: { r: 210, g: 180, b: 140 },
                undertone: 'Cool',
                confidence: 90
            };
            const palette = {
                name: 'Test',
                description: 'Test',
                colors: []
            };

            HistoryManager.addToHistory(analysis1, palette);
            HistoryManager.addToHistory(analysis2, palette);

            const stats = HistoryManager.getHistoryStats();
            expect(stats.totalAnalyses).toBe(2);
            expect(stats.undertoneCounts.Warm).toBe(1);
            expect(stats.undertoneCounts.Cool).toBe(1);
            expect(stats.averageConfidence).toBe(85);
        });
    });
});
