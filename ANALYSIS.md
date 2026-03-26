# Skin Tone Analysis and Color Palette Recommendation

## Overview

This document explains the skin tone analysis and color palette recommendation system that powers the skin tone analyzer application. The system determines skin tone characteristics and recommends personalized color palettes for clothing and accessories.

## Color Recommendation Algorithm

### Skin Tone Analysis

The system analyzes skin tone using RGB color values and makes decisions based on the following criteria:

1. **Brightness Calculation**: `(R + G + B) / 3`
2. **Tone Category Classification**:
   - Brightness > 180: Light skin tone
   - Brightness > 120: Medium skin tone
   - Brightness <= 120: Deep skin tone

### Undertone Determination

The system supports three undertone classifications:

1. **Warm undertones**: Golden, yellow, peachy tones
2. **Cool undertones**: Pink, blue, purple tones
3. **Neutral undertones**: Balanced mix of warm and cool tones

### Palette Generation

For each skin tone combination (undertone × brightness), the system selects an appropriate palette of colors designed to enhance the natural characteristics of that skin tone.

Each palette contains:
- 8 carefully selected colors
- Wardrobe essentials organized by gender
- Outfit combinations
- Seasonal clothing tips
- Recommended accessories
- Colors to avoid

## Implementation Details

### File Structure

- `src/utils/PaletteRecommender.js`: Core recommendation logic
- `src/components/AnalysisResults.jsx`: UI component that displays results
- `src/tests/PaletteRecommender.test.js`: Unit tests for all functionality

### Key Features

1. **Multi-Color Support**: Each palette includes 8 sophisticated colors
2. **Gender-Specific Recommendations**: Separate wardrobe essentials for men and women
3. **Seasonal Guidance**: Tailored clothing advice for each season
4. **Outfit Combination Suggestions**: Predefined color combinations for different occasions
5. **Avoidance Recommendations**: Colors that don't complement each specific skin tone

## Testing Verification

- All 10 existing unit tests pass successfully
- Build process completes without errors
- All 9 skin tone combinations (3 undertones × 3 brightness levels) are properly handled