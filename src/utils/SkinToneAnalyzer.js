// Skin Tone Analyzer Utility
// Analyzes uploaded images to determine skin tone, undertone, and seasonal color type
// Phase 4: Face detection, heatmap generation, and performance optimizations

const SkinToneAnalyzer = {
    // Performance: Cache canvas for reuse
    _canvasCache: null,
    _ctxCache: null,

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
     * Enhanced with face detection and heatmap generation
     * @param {HTMLImageElement} img - The loaded image
     * @returns {Object} Analysis results
     */
    processImage: function (img) {
        // Performance: Use cached canvas
        if (!this._canvasCache) {
            this._canvasCache = document.createElement('canvas');
            this._ctxCache = this._canvasCache.getContext('2d', { willReadFrequently: true });
        }
        
        const canvas = this._canvasCache;
        const ctx = this._ctxCache;

        // Performance: Adaptive sizing based on image dimensions
        const maxSize = img.width > 1000 ? 600 : img.width > 500 ? 400 : 300;
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = Math.floor(img.width * scale);
        canvas.height = Math.floor(img.height * scale);

        // Draw image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Phase 4: Face detection to find optimal sampling region
        const faceRegion = this.detectFaceRegion(ctx, canvas.width, canvas.height);
        
        // Extract skin pixels from detected face region
        const skinPixels = this.extractSkinPixelsFromRegion(
            ctx, 
            faceRegion.x, 
            faceRegion.y, 
            faceRegion.width, 
            faceRegion.height
        );

        if (skinPixels.length === 0) {
            throw new Error('No skin tone detected. Please upload a clear photo with your face visible.');
        }

        // Calculate average skin tone
        const avgColor = this.calculateAverageColor(skinPixels);

        // Determine undertone and season
        const undertone = this.determineUndertone(avgColor);

        const confidence = Math.min(95, 70 + Math.min(25, skinPixels.length / 10));

        // Phase 4: Generate heatmap data
        const heatmapData = this.generateHeatmapData(ctx, canvas.width, canvas.height);

        return {
            skinTone: avgColor,
            undertone: undertone,
            hex: this.rgbToHex(avgColor),
            skinPixels: skinPixels,
            confidence: Math.round(confidence),
            faceRegion: faceRegion,
            heatmapData: heatmapData,
            canvasSize: { width: canvas.width, height: canvas.height }
        };
    },

    /**
     * Detect face region using skin color analysis
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @returns {Object} Face region bounds
     */
    detectFaceRegion: function (ctx, width, height) {
        // Use a grid-based approach to find dense skin color regions
        const gridSize = 20;
        const cols = Math.ceil(width / gridSize);
        const rows = Math.ceil(height / gridSize);
        
        // Score each grid cell based on skin color density
        const scores = [];
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = col * gridSize;
                const y = row * gridSize;
                let skinCount = 0;
                
                // Sample pixels in this grid cell
                for (let dy = 0; dy < gridSize && y + dy < height; dy += 4) {
                    for (let dx = 0; dx < gridSize && x + dx < width; dx += 4) {
                        const pixel = ctx.getImageData(x + dx, y + dy, 1, 1).data;
                        if (this.isSkinColor(pixel[0], pixel[1], pixel[2])) {
                            skinCount++;
                        }
                    }
                }
                
                const density = skinCount / ((gridSize / 4) * (gridSize / 4));
                if (density > 0.3) { // At least 30% skin pixels
                    scores.push({ col, row, density, x, y });
                }
            }
        }

        if (scores.length === 0) {
            // Fallback: use center region
            return {
                x: width * 0.25,
                y: height * 0.2,
                width: width * 0.5,
                height: height * 0.5,
                method: 'fallback'
            };
        }

        // Sort by density and find the most concentrated region
        scores.sort((a, b) => b.density - a.density);
        
        // Find centroid of top scoring regions
        const topRegions = scores.slice(0, Math.min(5, scores.length));
        let sumX = 0, sumY = 0, totalWeight = 0;
        
        topRegions.forEach(region => {
            sumX += region.x * region.density;
            sumY += region.y * region.density;
            totalWeight += region.density;
        });
        
        const centroidX = sumX / totalWeight;
        const centroidY = sumY / totalWeight;
        
        // Determine region size based on spread
        const regionSize = Math.min(width, height) * 0.4;
        
        return {
            x: Math.max(0, centroidX - regionSize / 2),
            y: Math.max(0, centroidY - regionSize / 2),
            width: Math.min(regionSize, width - centroidX + regionSize / 2),
            height: Math.min(regionSize, height - centroidY + regionSize / 2),
            method: 'detected',
            confidence: Math.round(topRegions[0].density * 100)
        };
    },

    /**
     * Extract skin pixels from a specific region with performance optimization
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} x - Start X
     * @param {number} y - Start Y
     * @param {number} width - Region width
     * @param {number} height - Region height
     * @returns {Array} Array of skin-colored pixels with positions
     */
    extractSkinPixelsFromRegion: function (ctx, x, y, width, height) {
        const skinPixels = [];
        const sampleStep = 3; // Sample every 3rd pixel for performance

        const endX = Math.min(ctx.canvas.width, x + width);
        const endY = Math.min(ctx.canvas.height, y + height);
        const startX = Math.max(0, x);
        const startY = Math.max(0, y);

        for (let py = startY; py < endY; py += sampleStep) {
            for (let px = startX; px < endX; px += sampleStep) {
                const pixel = ctx.getImageData(px, py, 1, 1).data;
                const r = pixel[0];
                const g = pixel[1];
                const b = pixel[2];

                if (this.isSkinColor(r, g, b)) {
                    skinPixels.push({ r, g, b, x: px, y: py });
                }
            }
        }

        return skinPixels;
    },

    /**
     * Generate heatmap data from the entire image
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @returns {Array} 2D array of intensity values
     */
    generateHeatmapData: function (ctx, width, height) {
        const gridSize = 10;
        const cols = Math.ceil(width / gridSize);
        const rows = Math.ceil(height / gridSize);
        
        const heatmap = [];
        
        for (let row = 0; row < rows; row++) {
            const rowData = [];
            for (let col = 0; col < cols; col++) {
                const x = col * gridSize;
                const y = row * gridSize;
                
                // Sample center of each grid cell
                const pixel = ctx.getImageData(
                    Math.min(x + gridSize / 2, width - 1),
                    Math.min(y + gridSize / 2, height - 1),
                    1, 1
                ).data;
                
                const intensity = (pixel[0] + pixel[1] + pixel[2]) / 3;
                rowData.push({
                    x: x + gridSize / 2,
                    y: y + gridSize / 2,
                    intensity: intensity,
                    isSkin: this.isSkinColor(pixel[0], pixel[1], pixel[2]),
                    color: { r: pixel[0], g: pixel[1], b: pixel[2] }
                });
            }
            heatmap.push(rowData);
        }
        
        return heatmap;
    },

    /**
     * Check if RGB values represent a skin tone
     * @param {number} r - Red value
     * @param {number} g - Green value
     * @param {number} b - Blue value
     * @returns {boolean} True if likely skin tone
     */
    isSkinColor: function (r, g, b) {
        // Rule 1: Red should be dominant or close to green
        if (r < 60 || g < 40 || b < 20) return false;
        if (r < g || r < b) return false;

        // Rule 2: Check RGB relationships
        const rg = r - g;
        const rb = r - b;

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

        if (undertone === 'Warm') {
            if (brightness > 140 && saturation > 0.3) return 'Spring';
            return 'Autumn';
        } else if (undertone === 'Cool') {
            if (brightness > 130) return 'Summer';
            return 'Winter';
        } else {
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

export default SkinToneAnalyzer;
