import { describe, it, expect } from 'vitest';
import SkinToneAnalyzer from '../utils/SkinToneAnalyzer';

describe('SkinToneAnalyzer', () => {
    describe('isSkinColor', () => {
        it('should detect warm skin tone', () => {
            expect(SkinToneAnalyzer.isSkinColor(200, 150, 120)).toBe(true);
        });

        it('should detect medium skin tone', () => {
            expect(SkinToneAnalyzer.isSkinColor(165, 120, 100)).toBe(true);
        });

        it('should reject non-skin colors', () => {
            expect(SkinToneAnalyzer.isSkinColor(100, 100, 100)).toBe(false);
            expect(SkinToneAnalyzer.isSkinColor(50, 50, 200)).toBe(false);
            expect(SkinToneAnalyzer.isSkinColor(20, 20, 20)).toBe(false);
        });

        it('should reject very dark colors', () => {
            expect(SkinToneAnalyzer.isSkinColor(30, 20, 15)).toBe(false);
        });

        it('should reject very light colors', () => {
            expect(SkinToneAnalyzer.isSkinColor(250, 250, 250)).toBe(false);
        });
    });

    describe('rgbToHex', () => {
        it('should convert RGB to hex correctly', () => {
            expect(SkinToneAnalyzer.rgbToHex({ r: 255, g: 0, b: 0 })).toBe('#FF0000');
            expect(SkinToneAnalyzer.rgbToHex({ r: 0, g: 255, b: 0 })).toBe('#00FF00');
            expect(SkinToneAnalyzer.rgbToHex({ r: 0, g: 0, b: 255 })).toBe('#0000FF');
        });

        it('should handle zero values', () => {
            expect(SkinToneAnalyzer.rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000');
        });

        it('should pad single digit hex values', () => {
            expect(SkinToneAnalyzer.rgbToHex({ r: 10, g: 5, b: 15 })).toBe('#0A050F');
        });
    });

    describe('rgbToHsl', () => {
        it('should convert pure red to HSL', () => {
            const hsl = SkinToneAnalyzer.rgbToHsl(255, 0, 0);
            expect(hsl.h).toBe(0);
            expect(hsl.s).toBe(100);
        });

        it('should convert pure green to HSL', () => {
            const hsl = SkinToneAnalyzer.rgbToHsl(0, 255, 0);
            expect(hsl.h).toBe(120);
        });

        it('should convert pure blue to HSL', () => {
            const hsl = SkinToneAnalyzer.rgbToHsl(0, 0, 255);
            expect(hsl.h).toBe(240);
        });

        it('should handle neutral gray', () => {
            const hsl = SkinToneAnalyzer.rgbToHsl(128, 128, 128);
            expect(hsl.s).toBe(0);
        });
    });

    describe('determineUndertone', () => {
        it('should detect warm undertone', () => {
            expect(SkinToneAnalyzer.determineUndertone({ r: 200, g: 150, b: 100 })).toBe('Warm');
        });

        it('should detect cool undertone', () => {
            expect(SkinToneAnalyzer.determineUndertone({ r: 150, g: 150, b: 200 })).toBe('Cool');
        });

        it('should detect neutral undertone', () => {
            expect(SkinToneAnalyzer.determineUndertone({ r: 170, g: 160, b: 165 })).toBe('Neutral');
        });
    });

    describe('calculateAverageColor', () => {
        it('should calculate average of multiple pixels', () => {
            const pixels = [
                { r: 100, g: 100, b: 100 },
                { r: 200, g: 200, b: 200 },
            ];
            const avg = SkinToneAnalyzer.calculateAverageColor(pixels);
            expect(avg.r).toBe(150);
            expect(avg.g).toBe(150);
            expect(avg.b).toBe(150);
        });

        it('should handle single pixel', () => {
            const pixels = [{ r: 123, g: 456, b: 789 }];
            const avg = SkinToneAnalyzer.calculateAverageColor(pixels);
            expect(avg.r).toBe(123);
            expect(avg.g).toBe(456);
            expect(avg.b).toBe(789);
        });
    });

    describe('determineSeason', () => {
        it('should return Autumn for warm medium skin', () => {
            expect(SkinToneAnalyzer.determineSeason({ r: 150, g: 120, b: 100 }, 'Warm')).toBe('Autumn');
        });

        it('should return Summer for cool light skin', () => {
            expect(SkinToneAnalyzer.determineSeason({ r: 180, g: 170, b: 190 }, 'Cool')).toBe('Summer');
        });

        it('should return Winter for cool dark skin', () => {
            expect(SkinToneAnalyzer.determineSeason({ r: 80, g: 70, b: 90 }, 'Cool')).toBe('Winter');
        });

        it('should return neutral season based on brightness', () => {
            expect(SkinToneAnalyzer.determineSeason({ r: 170, g: 160, b: 165 }, 'Neutral')).toBe('Summer');
        });
    });
});
