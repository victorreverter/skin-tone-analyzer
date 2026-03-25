import { describe, it, expect } from 'vitest';
import PaletteRecommender from '../utils/PaletteRecommender';

describe('PaletteRecommender', () => {
    describe('getPalette', () => {
        it('should return warm_light palette for light warm skin', () => {
            const analysis = {
                undertone: 'Warm',
                skinTone: { r: 220, g: 180, b: 160 }
            };
            const palette = PaletteRecommender.getPalette(analysis);
            expect(palette.name).toBe('Light Warm Skin');
        });

        it('should return warm_medium palette for medium warm skin', () => {
            const analysis = {
                undertone: 'Warm',
                skinTone: { r: 160, g: 120, b: 100 }
            };
            const palette = PaletteRecommender.getPalette(analysis);
            expect(palette.name).toBe('Medium Warm Skin');
        });

        it('should return warm_deep palette for deep warm skin', () => {
            const analysis = {
                undertone: 'Warm',
                skinTone: { r: 100, g: 70, b: 60 }
            };
            const palette = PaletteRecommender.getPalette(analysis);
            expect(palette.name).toBe('Deep Warm Skin');
        });

        it('should return cool_light palette for light cool skin', () => {
            const analysis = {
                undertone: 'Cool',
                skinTone: { r: 200, g: 180, b: 200 }
            };
            const palette = PaletteRecommender.getPalette(analysis);
            expect(palette.name).toBe('Light Cool Skin');
        });

        it('should return cool_medium palette for medium cool skin', () => {
            const analysis = {
                undertone: 'Cool',
                skinTone: { r: 140, g: 130, b: 160 }
            };
            const palette = PaletteRecommender.getPalette(analysis);
            expect(palette.name).toBe('Medium Cool Skin');
        });

        it('should return cool_deep palette for deep cool skin', () => {
            const analysis = {
                undertone: 'Cool',
                skinTone: { r: 80, g: 70, b: 100 }
            };
            const palette = PaletteRecommender.getPalette(analysis);
            expect(palette.name).toBe('Deep Cool Skin');
        });

        it('should return neutral_medium as fallback for unknown combinations', () => {
            const analysis = {
                undertone: 'Neutral',
                skinTone: { r: 128, g: 128, b: 128 }
            };
            const palette = PaletteRecommender.getPalette(analysis);
            expect(palette).toBeDefined();
            expect(palette.colors).toBeDefined();
            expect(palette.colors.length).toBeGreaterThan(0);
        });
    });

    describe('palette structure', () => {
        it('should have all required fields for warm palettes', () => {
            const analysis = {
                undertone: 'Warm',
                skinTone: { r: 180, g: 140, b: 120 }
            };
            const palette = PaletteRecommender.getPalette(analysis);

            expect(palette).toHaveProperty('name');
            expect(palette).toHaveProperty('description');
            expect(palette).toHaveProperty('colors');
            expect(palette).toHaveProperty('combinations');
            expect(palette).toHaveProperty('seasonalTips');
            expect(palette).toHaveProperty('bestFor');
            expect(palette).toHaveProperty('avoidColors');
        });

        it('should have 8 colors in each palette', () => {
            const palettes = ['warm_light', 'warm_medium', 'warm_deep', 'cool_light'];
            palettes.forEach(key => {
                const analysis = {
                    undertone: key.includes('warm') ? 'Warm' : 'Cool',
                    skinTone: { r: 150, g: 150, b: 150 }
                };
                const palette = PaletteRecommender.getPalette(analysis);
                expect(palette.colors.length).toBe(8);
            });
        });

        it('should have 4 outfit combinations', () => {
            const analysis = {
                undertone: 'Warm',
                skinTone: { r: 180, g: 140, b: 120 }
            };
            const palette = PaletteRecommender.getPalette(analysis);
            expect(palette.combinations.length).toBe(4);
        });
    });
});
