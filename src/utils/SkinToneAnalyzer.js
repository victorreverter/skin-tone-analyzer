// Skin Tone Analyzer Utility
// Analyzes uploaded images to determine skin tone, undertone, and seasonal color type

const SkinToneAnalyzer = {
    /**
     * Analyzes an image to extract skin tone information
     * @param {File} imageFile - The uploaded image file
     * @returns {Promise<Object>} Analysis results with skin tone, undertone, and season
     */
    analyzeImage: async function (imageFile) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();

            reader.onload = (e) => {
                img.onload = () => {
                    try {
                        const analysis = this.processImage(img);
                        resolve(analysis);
                    } catch (error) {
                        reject(error);
                    }
                };
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = e.target.result;
            };

            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(imageFile);
        });
    },

    /**
     * Process image using Canvas API to extract skin tone
     * @param {HTMLImageElement} img - The loaded image
     * @returns {Object} Analysis results
     */
    processImage: function (img) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas size (use smaller size for performance)
        const maxSize = 400;
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        // Draw image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Sample pixels from center region (where face is likely to be)
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const sampleRadius = Math.min(canvas.width, canvas.height) / 4;

        const skinPixels = this.extractSkinPixels(ctx, centerX, centerY, sampleRadius);

        if (skinPixels.length === 0) {
            throw new Error('No skin tone detected. Please upload a clear photo.');
        }

        // Calculate average skin tone
        const avgColor = this.calculateAverageColor(skinPixels);

        // Determine undertone and season
        const undertone = this.determineUndertone(avgColor);

        const confidence = Math.min(95, 70 + (skinPixels.length / 10));

        return {
            skinTone: avgColor,
            undertone: undertone,
            hex: this.rgbToHex(avgColor),
            skinPixels: skinPixels,
            confidence: Math.round(confidence)
        };
    },

    /**
     * Extract skin-colored pixels from the image
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     * @param {number} radius - Sampling radius
     * @returns {Array} Array of skin-colored pixels
     */
    extractSkinPixels: function (ctx, centerX, centerY, radius) {
        const skinPixels = [];
        const sampleSize = 5; // Sample every 5th pixel for performance

        const startX = Math.max(0, centerX - radius);
        const endX = Math.min(ctx.canvas.width, centerX + radius);
        const startY = Math.max(0, centerY - radius);
        const endY = Math.min(ctx.canvas.height, centerY + radius);

        for (let y = startY; y < endY; y += sampleSize) {
            for (let x = startX; x < endX; x += sampleSize) {
                const pixel = ctx.getImageData(x, y, 1, 1).data;
                const r = pixel[0];
                const g = pixel[1];
                const b = pixel[2];

                // Check if pixel is likely skin tone
                if (this.isSkinColor(r, g, b)) {
                    skinPixels.push({ r, g, b });
                }
            }
        }

        return skinPixels;
    },

    /**
     * Check if RGB values represent a skin tone
     * @param {number} r - Red value
     * @param {number} g - Green value
     * @param {number} b - Blue value
     * @returns {boolean} True if likely skin tone
     */
    isSkinColor: function (r, g, b) {
        // Skin tone detection using RGB thresholds
        // Based on research in skin tone detection algorithms

        // Rule 1: Red should be dominant or close to green
        if (r < 60 || g < 40 || b < 20) return false;
        if (r < g || r < b) return false;

        // Rule 2: Check RGB relationships
        const rg = r - g;
        const rb = r - b;
        const gb = g - b;

        if (rg < 15) return false;
        if (rb < 15) return false;

        // Rule 3: Check saturation and brightness
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const saturation = max === 0 ? 0 : (max - min) / max;

        if (saturation < 0.1 || saturation > 0.7) return false;

        return true;
    },

    /**
     * Calculate average color from pixel array
     * @param {Array} pixels - Array of pixel objects with r, g, b
     * @returns {Object} Average RGB color
     */
    calculateAverageColor: function (pixels) {
        const sum = pixels.reduce((acc, pixel) => {
            acc.r += pixel.r;
            acc.g += pixel.g;
            acc.b += pixel.b;
            return acc;
        }, { r: 0, g: 0, b: 0 });

        const count = pixels.length;
        return {
            r: Math.round(sum.r / count),
            g: Math.round(sum.g / count),
            b: Math.round(sum.b / count)
        };
    },

    /**
     * Determine undertone (warm, cool, or neutral)
     * @param {Object} rgb - RGB color object
     * @returns {string} Undertone classification
     */
    determineUndertone: function (rgb) {
        const { r, g, b } = rgb;

        // Convert to HSL for better undertone detection
        const hsl = this.rgbToHsl(r, g, b);
        const hue = hsl.h;

        // Warm undertones: yellow/golden (hue 20-50)
        // Cool undertones: pink/blue (hue 330-20)
        // Neutral: in between

        const warmScore = (r - b) + (r - g) * 0.5;
        const coolScore = (b - r) * 0.8 + (g - r) * 0.3;

        if (warmScore > 15) return 'Warm';
        if (coolScore > 10) return 'Cool';
        return 'Neutral';
    },

    /**
     * Determine seasonal color type
     * @param {Object} rgb - RGB color object
     * @param {string} undertone - Undertone classification
     * @returns {string} Seasonal type
     */
    determineSeason: function (rgb, undertone) {
        const { r, g, b } = rgb;
        const brightness = (r + g + b) / 3;
        const saturation = (Math.max(r, g, b) - Math.min(r, g, b)) / Math.max(r, g, b);

        // Spring: Warm undertone, light to medium, high saturation
        // Summer: Cool undertone, light to medium, low saturation
        // Autumn: Warm undertone, medium to dark, low saturation
        // Winter: Cool undertone, high contrast (very light or very dark)

        if (undertone === 'Warm') {
            if (brightness > 140 && saturation > 0.3) return 'Spring';
            return 'Autumn';
        } else if (undertone === 'Cool') {
            if (brightness > 130) return 'Summer';
            return 'Winter';
        } else {
            // Neutral can be either Summer or Autumn depending on brightness
            return brightness > 140 ? 'Summer' : 'Autumn';
        }
    },

    /**
     * Convert RGB to HSL
     * @param {number} r - Red (0-255)
     * @param {number} g - Green (0-255)
     * @param {number} b - Blue (0-255)
     * @returns {Object} HSL values
     */
    rgbToHsl: function (r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    },

    /**
     * Convert RGB to Hex
     * @param {Object} rgb - RGB color object
     * @returns {string} Hex color code
     */
    rgbToHex: function (rgb) {
        const toHex = (n) => {
            const hex = n.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toUpperCase();
    }
};

// Export for use in other modules
export default SkinToneAnalyzer;
