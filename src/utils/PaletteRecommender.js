// Palette Recommender Utility
// Recommends sophisticated clothing color palettes based on skin tone characteristics

const PaletteRecommender = {
    /**
     * Get recommended color palette based on skin tone analysis
     * @param {Object} analysis - Skin tone analysis with undertone and RGB values
     * @returns {Object} Palette with colors, combinations, and recommendations
     */
    getPalette: function (analysis) {
        const { undertone, skinTone } = analysis;
        const brightness = (skinTone.r + skinTone.g + skinTone.b) / 3;

        // Determine skin tone category
        let toneCategory;
        if (brightness > 180) toneCategory = 'light';
        else if (brightness > 120) toneCategory = 'medium';
        else toneCategory = 'deep';

        // Get palette based on undertone and tone
        const paletteKey = `${undertone.toLowerCase()}_${toneCategory}`;
        return this.palettes[paletteKey] || this.palettes['neutral_medium'];
    },

    palettes: {
        // WARM UNDERTONE PALETTES
        warm_light: {
            name: 'Light Warm Skin',
            description: 'Sophisticated warm tones that enhance your natural golden glow',
            colors: [
                { name: 'Champagne', hex: '#F7E7CE', category: 'Elegant Neutral' },
                { name: 'Camel', hex: '#C19A6B', category: 'Timeless Classic' },
                { name: 'Warm Taupe', hex: '#B38B6D', category: 'Versatile Base' },
                { name: 'Sage Green', hex: '#9CAF88', category: 'Refined Accent' },
                { name: 'Cognac', hex: '#9A463D', category: 'Rich Statement' },
                { name: 'Warm Charcoal', hex: '#54524F', category: 'Professional' },
                { name: 'Ivory', hex: '#FFFFF0', category: 'Pure Elegance' },
                { name: 'Bronze', hex: '#8C7853', category: 'Luxe Detail' }
            ],
            wardrobeEssentials: {
                men: [
                    { item: 'Blazer', colors: ['Camel', 'Warm Charcoal'], occasions: 'Business, formal events' },
                    { item: 'Sport Coat', colors: ['Sage Green', 'Warm Taupe'], occasions: 'Smart casual, versatile' },
                    { item: 'Dress Shirt', colors: ['Ivory', 'Champagne'], occasions: 'Office, formal' },
                    { item: 'Oxford Shirt', colors: ['Ivory', 'Sage Green'], occasions: 'Business casual, classic' },
                    { item: 'Casual Button-Down', colors: ['Sage Green', 'Warm Taupe'], occasions: 'Weekends, relaxed' },
                    { item: 'Dress Trousers', colors: ['Warm Charcoal', 'Camel'], occasions: 'Professional, formal' },
                    { item: 'Chinos', colors: ['Warm Taupe', 'Sage Green', 'Camel'], occasions: 'Business casual, versatile' },
                    { item: 'Jeans', colors: ['Warm Charcoal', 'Cognac'], occasions: 'Casual, everyday' },
                    { item: 'Linen Pants', colors: ['Ivory', 'Warm Taupe'], occasions: 'Summer, resort' },
                    { item: 'Dress Shorts', colors: ['Warm Taupe', 'Sage Green'], occasions: 'Summer, smart casual' },
                    { item: 'Sweater/Pullover', colors: ['Cognac', 'Camel', 'Warm Charcoal'], occasions: 'Layering, elegant' },
                    { item: 'Cardigan', colors: ['Warm Taupe', 'Sage Green'], occasions: 'Casual layering' },
                    { item: 'Vest/Waistcoat', colors: ['Camel', 'Warm Charcoal'], occasions: 'Formal, layering' },
                    { item: 'Overcoat', colors: ['Camel', 'Warm Charcoal'], occasions: 'Winter, formal' },
                    { item: 'Trench Coat', colors: ['Camel', 'Warm Taupe'], occasions: 'Spring/fall, classic' },
                    { item: 'Polo Shirt', colors: ['Sage Green', 'Warm Taupe', 'Ivory'], occasions: 'Casual refined' },
                    { item: 'T-Shirt', colors: ['Ivory', 'Warm Taupe', 'Sage Green'], occasions: 'Casual, layering' },
                    { item: 'Dress Shoes', colors: ['Cognac', 'Bronze'], occasions: 'Formal, business' },
                    { item: 'Loafers', colors: ['Cognac', 'Warm Taupe'], occasions: 'Smart casual, versatile' },
                    { item: 'Sneakers', colors: ['Ivory', 'Sage Green'], occasions: 'Casual, sporty' },
                    { item: 'Boots', colors: ['Cognac', 'Bronze'], occasions: 'Fall/winter, rugged' },
                    { item: 'Belt', colors: ['Cognac', 'Bronze', 'Warm Charcoal'], occasions: 'Everyday essential' },
                    { item: 'Tie', colors: ['Cognac', 'Sage Green', 'Bronze'], occasions: 'Formal accessory' },
                    { item: 'Pocket Square', colors: ['Champagne', 'Sage Green'], occasions: 'Formal detail' },
                    { item: 'Watch Strap', colors: ['Cognac', 'Camel'], occasions: 'Accessory detail' }
                ],
                women: [
                    { item: 'Blazer', colors: ['Camel', 'Warm Charcoal', 'Cognac'], occasions: 'Professional, polished' },
                    { item: 'Blouse', colors: ['Ivory', 'Champagne', 'Sage Green'], occasions: 'Office, dressy' },
                    { item: 'Silk Top', colors: ['Cognac', 'Champagne'], occasions: 'Evening, elegant' },
                    { item: 'Knit Top', colors: ['Warm Taupe', 'Sage Green'], occasions: 'Casual, comfortable' },
                    { item: 'Dress Trousers', colors: ['Warm Charcoal', 'Camel'], occasions: 'Work, sophisticated' },
                    { item: 'Wide-Leg Pants', colors: ['Warm Taupe', 'Sage Green'], occasions: 'Modern, chic' },
                    { item: 'Cropped Pants', colors: ['Camel', 'Warm Charcoal'], occasions: 'Spring/summer, trendy' },
                    { item: 'Jeans', colors: ['Warm Charcoal', 'Cognac'], occasions: 'Casual, everyday' },
                    { item: 'Linen Pants', colors: ['Ivory', 'Champagne'], occasions: 'Summer, relaxed' },
                    { item: 'Evening Dress', colors: ['Cognac', 'Warm Charcoal'], occasions: 'Formal events, gala' },
                    { item: 'Day Dress', colors: ['Sage Green', 'Warm Taupe'], occasions: 'Office, brunch' },
                    { item: 'Midi Skirt', colors: ['Camel', 'Warm Taupe'], occasions: 'Professional, feminine' },
                    { item: 'Pencil Skirt', colors: ['Warm Charcoal', 'Camel'], occasions: 'Office, classic' },
                    { item: 'A-Line Skirt', colors: ['Sage Green', 'Cognac'], occasions: 'Versatile, flattering' },
                    { item: 'Cashmere Sweater', colors: ['Champagne', 'Cognac', 'Warm Taupe'], occasions: 'Luxury layering' },
                    { item: 'Cardigan', colors: ['Sage Green', 'Warm Taupe'], occasions: 'Office, casual' },
                    { item: 'Coat', colors: ['Camel', 'Warm Charcoal'], occasions: 'Outerwear, timeless' },
                    { item: 'Trench Coat', colors: ['Camel', 'Warm Taupe'], occasions: 'Spring, classic' },
                    { item: 'Blazer Dress', colors: ['Warm Charcoal', 'Camel'], occasions: 'Modern, powerful' },
                    { item: 'Silk Scarf', colors: ['Cognac', 'Sage Green', 'Bronze'], occasions: 'Accessory elegance' },
                    { item: 'Pumps/Heels', colors: ['Cognac', 'Bronze', 'Warm Taupe'], occasions: 'Professional, dressy' },
                    { item: 'Flats', colors: ['Camel', 'Cognac'], occasions: 'Everyday comfort' },
                    { item: 'Ankle Boots', colors: ['Cognac', 'Warm Charcoal'], occasions: 'Fall/winter, versatile' },
                    { item: 'Sandals', colors: ['Bronze', 'Camel'], occasions: 'Summer, elegant' },
                    { item: 'Handbag', colors: ['Cognac', 'Camel'], occasions: 'Everyday luxury' },
                    { item: 'Clutch', colors: ['Bronze', 'Champagne'], occasions: 'Evening, formal' }
                ]
            },
            combinations: [
                { outfit: 'Executive Meeting', colors: ['Warm Charcoal', 'Ivory', 'Cognac'] },
                { outfit: 'Business Lunch', colors: ['Camel', 'Champagne', 'Bronze'] },
                { outfit: 'Evening Dinner', colors: ['Cognac', 'Champagne', 'Warm Charcoal'] },
                { outfit: 'Smart Casual', colors: ['Sage Green', 'Warm Taupe', 'Ivory'] }
            ],
            seasonalTips: {
                spring: 'Layer champagne and sage green with camel accessories',
                summer: 'Lightweight ivory and warm taupe with bronze details',
                autumn: 'Rich cognac and camel tones for sophisticated warmth',
                winter: 'Warm charcoal with ivory and cognac accents'
            },
            avoidColors: ['Icy pastels', 'Cool pinks', 'Stark white', 'Blue-gray'],
            bestFor: ['Warm neutrals', 'Gold jewelry', 'Earthy sophistication']
        },

        warm_medium: {
            name: 'Medium Warm Skin',
            description: 'Rich, refined earth tones that complement your warm radiance',
            colors: [
                { name: 'Espresso', hex: '#4E3629', category: 'Deep Elegant' },
                { name: 'Olive', hex: '#6B7C3C', category: 'Sophisticated Green' },
                { name: 'Terracotta', hex: '#B56357', category: 'Warm Refined' },
                { name: 'Caramel', hex: '#C68E17', category: 'Luxe Neutral' },
                { name: 'Slate Green', hex: '#708238', category: 'Muted Elegance' },
                { name: 'Warm Gray', hex: '#8B8680', category: 'Modern Classic' },
                { name: 'Cream', hex: '#FFFDD0', category: 'Soft Luxury' },
                { name: 'Burnt Umber', hex: '#8A3324', category: 'Rich Accent' }
            ],
            wardrobeEssentials: {
                men: [
                    { item: 'Suit', colors: ['Espresso', 'Warm Gray'], occasions: 'Formal, business' },
                    { item: 'Blazer', colors: ['Olive', 'Espresso', 'Warm Gray'], occasions: 'Professional, smart casual' },
                    { item: 'Dress Shirt', colors: ['Cream', 'Warm Gray'], occasions: 'Office, formal' },
                    { item: 'Casual Shirt', colors: ['Olive', 'Terracotta', 'Slate Green'], occasions: 'Weekend, relaxed' },
                    { item: 'Trousers', colors: ['Espresso', 'Warm Gray', 'Olive'], occasions: 'Work, dressy' },
                    { item: 'Chinos', colors: ['Caramel', 'Slate Green'], occasions: 'Business casual' },
                    { item: 'Sweater', colors: ['Burnt Umber', 'Olive', 'Warm Gray'], occasions: 'Layering, elegant' },
                    { item: 'Leather Jacket', colors: ['Espresso', 'Burnt Umber'], occasions: 'Casual luxury' },
                    { item: 'Dress Shoes', colors: ['Espresso', 'Burnt Umber'], occasions: 'Formal, professional' },
                    { item: 'Watch Strap', colors: ['Espresso', 'Caramel'], occasions: 'Accessory detail' }
                ],
                women: [
                    { item: 'Blazer', colors: ['Espresso', 'Olive', 'Warm Gray'], occasions: 'Professional, power dressing' },
                    { item: 'Blouse', colors: ['Cream', 'Terracotta', 'Slate Green'], occasions: 'Office, elegant' },
                    { item: 'Trousers', colors: ['Espresso', 'Warm Gray', 'Olive'], occasions: 'Work, sophisticated' },
                    { item: 'Dress', colors: ['Burnt Umber', 'Olive', 'Espresso'], occasions: 'Evening, events' },
                    { item: 'Skirt', colors: ['Caramel', 'Warm Gray', 'Olive'], occasions: 'Professional, feminine' },
                    { item: 'Cashmere Sweater', colors: ['Cream', 'Caramel', 'Terracotta'], occasions: 'Luxury layering' },
                    { item: 'Coat', colors: ['Espresso', 'Caramel'], occasions: 'Outerwear, timeless' },
                    { item: 'Silk Scarf', colors: ['Burnt Umber', 'Olive', 'Terracotta'], occasions: 'Accessory elegance' },
                    { item: 'Leather Boots', colors: ['Espresso', 'Burnt Umber'], occasions: 'Fall/winter, chic' },
                    { item: 'Handbag', colors: ['Espresso', 'Caramel'], occasions: 'Everyday luxury' }
                ]
            },
            combinations: [
                { outfit: 'Power Meeting', colors: ['Espresso', 'Cream', 'Burnt Umber'] },
                { outfit: 'Business Dinner', colors: ['Olive', 'Warm Gray', 'Caramel'] },
                { outfit: 'Elegant Casual', colors: ['Terracotta', 'Cream', 'Slate Green'] },
                { outfit: 'Formal Event', colors: ['Espresso', 'Burnt Umber', 'Cream'] }
            ],
            seasonalTips: {
                spring: 'Olive and slate green with cream for fresh sophistication',
                summer: 'Terracotta and cream in lightweight fabrics',
                autumn: 'Layer burnt umber with espresso and caramel',
                winter: 'Rich espresso with warm gray and cream accents'
            },
            avoidColors: ['Cool blues', 'Bright white', 'Neon tones', 'Icy silver'],
            bestFor: ['Warm earth tones', 'Gold accessories', 'Rich textures']
        },

        warm_deep: {
            name: 'Deep Warm Skin',
            description: 'Bold, luxurious tones that celebrate your rich warmth',
            colors: [
                { name: 'Deep Burgundy', hex: '#6B1F3A', category: 'Regal Elegance' },
                { name: 'Forest Green', hex: '#2C5530', category: 'Sophisticated Deep' },
                { name: 'Burnt Sienna', hex: '#8B4513', category: 'Warm Luxe' },
                { name: 'Cognac', hex: '#9A463D', category: 'Rich Classic' },
                { name: 'Deep Teal', hex: '#014D4E', category: 'Refined Jewel' },
                { name: 'Charcoal', hex: '#36454F', category: 'Modern Elegant' },
                { name: 'Champagne', hex: '#F7E7CE', category: 'Contrast Luxury' },
                { name: 'Bronze', hex: '#8C7853', category: 'Metallic Accent' }
            ],
            wardrobeEssentials: {
                men: [
                    { item: 'Suit', colors: ['Charcoal', 'Deep Burgundy'], occasions: 'Formal, executive' },
                    { item: 'Blazer', colors: ['Forest Green', 'Cognac', 'Charcoal'], occasions: 'Professional, refined' },
                    { item: 'Dress Shirt', colors: ['Champagne', 'Deep Teal'], occasions: 'Office, formal' },
                    { item: 'Casual Shirt', colors: ['Burnt Sienna', 'Forest Green'], occasions: 'Smart casual' },
                    { item: 'Trousers', colors: ['Charcoal', 'Forest Green', 'Cognac'], occasions: 'Work, dressy' },
                    { item: 'Sweater', colors: ['Deep Burgundy', 'Deep Teal', 'Cognac'], occasions: 'Layering, sophisticated' },
                    { item: 'Overcoat', colors: ['Charcoal', 'Cognac'], occasions: 'Winter, luxury' },
                    { item: 'Turtleneck', colors: ['Deep Burgundy', 'Forest Green', 'Charcoal'], occasions: 'Elegant casual' },
                    { item: 'Dress Shoes', colors: ['Cognac', 'Bronze'], occasions: 'Formal, business' },
                    { item: 'Leather Belt', colors: ['Cognac', 'Bronze'], occasions: 'Accessory detail' }
                ],
                women: [
                    { item: 'Blazer', colors: ['Deep Burgundy', 'Forest Green', 'Charcoal'], occasions: 'Professional, powerful' },
                    { item: 'Blouse', colors: ['Champagne', 'Deep Teal', 'Burnt Sienna'], occasions: 'Office, elegant' },
                    { item: 'Trousers', colors: ['Charcoal', 'Forest Green', 'Cognac'], occasions: 'Work, sophisticated' },
                    { item: 'Evening Dress', colors: ['Deep Burgundy', 'Forest Green', 'Deep Teal'], occasions: 'Formal events, gala' },
                    { item: 'Skirt', colors: ['Charcoal', 'Cognac', 'Forest Green'], occasions: 'Professional, chic' },
                    { item: 'Cashmere Sweater', colors: ['Deep Burgundy', 'Champagne', 'Deep Teal'], occasions: 'Luxury comfort' },
                    { item: 'Coat', colors: ['Charcoal', 'Cognac', 'Forest Green'], occasions: 'Outerwear, statement' },
                    { item: 'Silk Scarf', colors: ['Deep Burgundy', 'Bronze', 'Deep Teal'], occasions: 'Accessory luxury' },
                    { item: 'Heels', colors: ['Cognac', 'Bronze', 'Deep Burgundy'], occasions: 'Dressy, elegant' },
                    { item: 'Handbag', colors: ['Cognac', 'Charcoal'], occasions: 'Everyday sophistication' }
                ]
            },
            combinations: [
                { outfit: 'Executive Power', colors: ['Deep Burgundy', 'Champagne', 'Charcoal'] },
                { outfit: 'Formal Evening', colors: ['Forest Green', 'Bronze', 'Champagne'] },
                { outfit: 'Business Elegant', colors: ['Cognac', 'Deep Teal', 'Charcoal'] },
                { outfit: 'Refined Casual', colors: ['Burnt Sienna', 'Champagne', 'Forest Green'] }
            ],
            seasonalTips: {
                spring: 'Forest green and deep teal with champagne accents',
                summer: 'Champagne and burnt sienna in luxe fabrics',
                autumn: 'Deep burgundy and cognac for rich elegance',
                winter: 'Layer charcoal with deep burgundy and bronze'
            },
            avoidColors: ['Pale pastels', 'Cool grays', 'Washed-out tones'],
            bestFor: ['Rich jewel tones', 'Gold accessories', 'Luxe fabrics']
        },

        // COOL UNDERTONE PALETTES
        cool_light: {
            name: 'Light Cool Skin',
            description: 'Refined cool tones that enhance your delicate elegance',
            colors: [
                { name: 'Dove Gray', hex: '#B2BEB5', category: 'Soft Neutral' },
                { name: 'Dusty Rose', hex: '#DCAE96', category: 'Feminine Elegant' },
                { name: 'Slate Blue', hex: '#6A7B8B', category: 'Sophisticated Cool' },
                { name: 'Mauve', hex: '#B784A7', category: 'Refined Accent' },
                { name: 'Charcoal', hex: '#36454F', category: 'Modern Classic' },
                { name: 'Soft Lavender', hex: '#B19CD9', category: 'Subtle Luxury' },
                { name: 'Pure White', hex: '#FFFFFF', category: 'Crisp Elegance' },
                { name: 'Pewter', hex: '#8F8E84', category: 'Metallic Detail' }
            ],
            wardrobeEssentials: {
                men: [
                    { item: 'Suit', colors: ['Charcoal', 'Slate Blue'], occasions: 'Formal, business' },
                    { item: 'Blazer', colors: ['Charcoal', 'Dove Gray', 'Slate Blue'], occasions: 'Professional, versatile' },
                    { item: 'Dress Shirt', colors: ['Pure White', 'Slate Blue'], occasions: 'Office, formal' },
                    { item: 'Casual Shirt', colors: ['Dusty Rose', 'Mauve', 'Dove Gray'], occasions: 'Smart casual' },
                    { item: 'Trousers', colors: ['Charcoal', 'Slate Blue', 'Dove Gray'], occasions: 'Work, dressy' },
                    { item: 'Sweater', colors: ['Soft Lavender', 'Dove Gray', 'Charcoal'], occasions: 'Layering, refined' },
                    { item: 'Overcoat', colors: ['Charcoal', 'Dove Gray'], occasions: 'Winter, classic' },
                    { item: 'Polo Shirt', colors: ['Slate Blue', 'Dusty Rose'], occasions: 'Casual elegant' },
                    { item: 'Dress Shoes', colors: ['Charcoal', 'Pewter'], occasions: 'Formal, professional' },
                    { item: 'Watch', colors: ['Pewter', 'Charcoal'], occasions: 'Accessory detail' }
                ],
                women: [
                    { item: 'Blazer', colors: ['Charcoal', 'Slate Blue', 'Mauve'], occasions: 'Professional, polished' },
                    { item: 'Blouse', colors: ['Pure White', 'Dusty Rose', 'Soft Lavender'], occasions: 'Office, feminine' },
                    { item: 'Trousers', colors: ['Charcoal', 'Dove Gray', 'Slate Blue'], occasions: 'Work, sophisticated' },
                    { item: 'Dress', colors: ['Mauve', 'Dusty Rose', 'Slate Blue'], occasions: 'Events, elegant' },
                    { item: 'Skirt', colors: ['Charcoal', 'Dove Gray', 'Slate Blue'], occasions: 'Professional, chic' },
                    { item: 'Cashmere Sweater', colors: ['Soft Lavender', 'Dusty Rose', 'Dove Gray'], occasions: 'Luxury comfort' },
                    { item: 'Coat', colors: ['Charcoal', 'Dove Gray'], occasions: 'Outerwear, timeless' },
                    { item: 'Silk Scarf', colors: ['Mauve', 'Soft Lavender', 'Dusty Rose'], occasions: 'Accessory elegance' },
                    { item: 'Pumps', colors: ['Pewter', 'Dusty Rose', 'Charcoal'], occasions: 'Dressy, refined' },
                    { item: 'Handbag', colors: ['Dove Gray', 'Pewter'], occasions: 'Everyday luxury' }
                ]
            },
            combinations: [
                { outfit: 'Professional Meeting', colors: ['Charcoal', 'Pure White', 'Pewter'] },
                { outfit: 'Business Lunch', colors: ['Slate Blue', 'Dove Gray', 'Dusty Rose'] },
                { outfit: 'Evening Event', colors: ['Mauve', 'Charcoal', 'Pure White'] },
                { outfit: 'Elegant Casual', colors: ['Soft Lavender', 'Dove Gray', 'Pure White'] }
            ],
            seasonalTips: {
                spring: 'Dusty rose and soft lavender with pure white',
                summer: 'Slate blue and dove gray in light fabrics',
                autumn: 'Mauve with charcoal for refined warmth',
                winter: 'Layer charcoal with pure white and pewter'
            },
            avoidColors: ['Warm oranges', 'Golden yellow', 'Warm browns'],
            bestFor: ['Cool neutrals', 'Silver jewelry', 'Soft sophistication']
        },

        cool_medium: {
            name: 'Medium Cool Skin',
            description: 'Elegant jewel tones and refined neutrals for sophisticated style',
            colors: [
                { name: 'Navy', hex: '#1B2A41', category: 'Classic Elegant' },
                { name: 'Emerald', hex: '#2C5F2D', category: 'Jewel Tone' },
                { name: 'Plum', hex: '#8E4585', category: 'Rich Refined' },
                { name: 'Steel Blue', hex: '#4682B4', category: 'Modern Cool' },
                { name: 'Charcoal', hex: '#2F4F4F', category: 'Sophisticated Base' },
                { name: 'Burgundy', hex: '#6B1F3A', category: 'Deep Luxe' },
                { name: 'Bright White', hex: '#F8F8FF', category: 'Crisp Luxury' },
                { name: 'Silver', hex: '#C0C0C0', category: 'Metallic Accent' }
            ],
            wardrobeEssentials: {
                men: [
                    { item: 'Suit', colors: ['Navy', 'Charcoal'], occasions: 'Formal, executive' },
                    { item: 'Blazer', colors: ['Navy', 'Emerald', 'Charcoal'], occasions: 'Professional, versatile' },
                    { item: 'Dress Shirt', colors: ['Bright White', 'Steel Blue'], occasions: 'Office, formal' },
                    { item: 'Casual Shirt', colors: ['Plum', 'Emerald', 'Steel Blue'], occasions: 'Smart casual' },
                    { item: 'Trousers', colors: ['Navy', 'Charcoal', 'Steel Blue'], occasions: 'Work, dressy' },
                    { item: 'Sweater', colors: ['Burgundy', 'Navy', 'Plum'], occasions: 'Layering, elegant' },
                    { item: 'Overcoat', colors: ['Navy', 'Charcoal'], occasions: 'Winter, classic' },
                    { item: 'Turtleneck', colors: ['Burgundy', 'Navy', 'Charcoal'], occasions: 'Refined casual' },
                    { item: 'Dress Shoes', colors: ['Charcoal', 'Burgundy'], occasions: 'Formal, professional' },
                    { item: 'Tie', colors: ['Burgundy', 'Emerald', 'Steel Blue'], occasions: 'Formal accessory' }
                ],
                women: [
                    { item: 'Blazer', colors: ['Navy', 'Emerald', 'Plum'], occasions: 'Professional, powerful' },
                    { item: 'Blouse', colors: ['Bright White', 'Steel Blue', 'Plum'], occasions: 'Office, elegant' },
                    { item: 'Trousers', colors: ['Navy', 'Charcoal', 'Emerald'], occasions: 'Work, sophisticated' },
                    { item: 'Dress', colors: ['Burgundy', 'Emerald', 'Plum'], occasions: 'Events, formal' },
                    { item: 'Skirt', colors: ['Navy', 'Charcoal', 'Steel Blue'], occasions: 'Professional, chic' },
                    { item: 'Cashmere Sweater', colors: ['Burgundy', 'Plum', 'Steel Blue'], occasions: 'Luxury layering' },
                    { item: 'Coat', colors: ['Navy', 'Charcoal', 'Emerald'], occasions: 'Outerwear, statement' },
                    { item: 'Silk Scarf', colors: ['Burgundy', 'Emerald', 'Plum'], occasions: 'Accessory luxury' },
                    { item: 'Heels', colors: ['Burgundy', 'Navy', 'Silver'], occasions: 'Dressy, elegant' },
                    { item: 'Handbag', colors: ['Navy', 'Charcoal'], occasions: 'Everyday sophistication' }
                ]
            },
            combinations: [
                { outfit: 'Executive Meeting', colors: ['Navy', 'Bright White', 'Burgundy'] },
                { outfit: 'Formal Event', colors: ['Emerald', 'Charcoal', 'Silver'] },
                { outfit: 'Business Dinner', colors: ['Plum', 'Steel Blue', 'Bright White'] },
                { outfit: 'Elegant Casual', colors: ['Burgundy', 'Navy', 'Bright White'] }
            ],
            seasonalTips: {
                spring: 'Emerald and steel blue with bright white',
                summer: 'Plum and bright white in luxe fabrics',
                autumn: 'Burgundy with navy for rich elegance',
                winter: 'Layer charcoal with emerald and silver'
            },
            avoidColors: ['Warm oranges', 'Golden tones', 'Warm beige'],
            bestFor: ['Jewel tones', 'Silver accessories', 'Cool sophistication']
        },

        cool_deep: {
            name: 'Deep Cool Skin',
            description: 'Bold, striking colors that command attention with elegance',
            colors: [
                { name: 'Black', hex: '#000000', category: 'Ultimate Classic' },
                { name: 'Deep Purple', hex: '#4B0082', category: 'Regal Luxe' },
                { name: 'Sapphire', hex: '#0F52BA', category: 'Jewel Elegance' },
                { name: 'Ruby Red', hex: '#9B111E', category: 'Bold Statement' },
                { name: 'Emerald', hex: '#046307', category: 'Rich Green' },
                { name: 'Charcoal', hex: '#2C2C2C', category: 'Refined Neutral' },
                { name: 'Pure White', hex: '#FFFFFF', category: 'High Contrast' },
                { name: 'Platinum', hex: '#E5E4E2', category: 'Metallic Luxe' }
            ],
            wardrobeEssentials: {
                men: [
                    { item: 'Suit', colors: ['Black', 'Charcoal', 'Sapphire'], occasions: 'Formal, executive' },
                    { item: 'Blazer', colors: ['Black', 'Deep Purple', 'Charcoal'], occasions: 'Professional, powerful' },
                    { item: 'Dress Shirt', colors: ['Pure White', 'Platinum'], occasions: 'Office, formal' },
                    { item: 'Casual Shirt', colors: ['Sapphire', 'Emerald', 'Ruby Red'], occasions: 'Smart casual' },
                    { item: 'Trousers', colors: ['Black', 'Charcoal', 'Sapphire'], occasions: 'Work, dressy' },
                    { item: 'Sweater', colors: ['Deep Purple', 'Ruby Red', 'Charcoal'], occasions: 'Layering, sophisticated' },
                    { item: 'Overcoat', colors: ['Black', 'Charcoal'], occasions: 'Winter, luxury' },
                    { item: 'Turtleneck', colors: ['Black', 'Deep Purple', 'Sapphire'], occasions: 'Elegant casual' },
                    { item: 'Dress Shoes', colors: ['Black', 'Charcoal'], occasions: 'Formal, professional' },
                    { item: 'Watch', colors: ['Platinum', 'Black'], occasions: 'Accessory detail' }
                ],
                women: [
                    { item: 'Blazer', colors: ['Black', 'Deep Purple', 'Sapphire'], occasions: 'Professional, commanding' },
                    { item: 'Blouse', colors: ['Pure White', 'Platinum', 'Ruby Red'], occasions: 'Office, elegant' },
                    { item: 'Trousers', colors: ['Black', 'Charcoal', 'Sapphire'], occasions: 'Work, sophisticated' },
                    { item: 'Evening Gown', colors: ['Deep Purple', 'Ruby Red', 'Emerald'], occasions: 'Formal, gala' },
                    { item: 'Skirt', colors: ['Black', 'Charcoal', 'Sapphire'], occasions: 'Professional, chic' },
                    { item: 'Cashmere Sweater', colors: ['Deep Purple', 'Ruby Red', 'Pure White'], occasions: 'Luxury comfort' },
                    { item: 'Coat', colors: ['Black', 'Charcoal', 'Deep Purple'], occasions: 'Outerwear, statement' },
                    { item: 'Silk Scarf', colors: ['Ruby Red', 'Emerald', 'Deep Purple'], occasions: 'Accessory luxury' },
                    { item: 'Heels', colors: ['Black', 'Ruby Red', 'Platinum'], occasions: 'Dressy, powerful' },
                    { item: 'Handbag', colors: ['Black', 'Charcoal'], occasions: 'Everyday luxury' }
                ]
            },
            combinations: [
                { outfit: 'Power Dressing', colors: ['Black', 'Pure White', 'Ruby Red'] },
                { outfit: 'Formal Gala', colors: ['Deep Purple', 'Platinum', 'Black'] },
                { outfit: 'Executive Meeting', colors: ['Sapphire', 'Charcoal', 'Pure White'] },
                { outfit: 'Elegant Evening', colors: ['Emerald', 'Black', 'Platinum'] }
            ],
            seasonalTips: {
                spring: 'Emerald and sapphire with pure white',
                summer: 'Pure white with ruby red accents',
                autumn: 'Deep purple with charcoal for richness',
                winter: 'Layer black with ruby red and platinum'
            },
            avoidColors: ['Warm browns', 'Orange', 'Golden yellow'],
            bestFor: ['Bold jewel tones', 'Platinum/silver jewelry', 'High contrast']
        },

        // NEUTRAL UNDERTONE PALETTES
        neutral_light: {
            name: 'Light Neutral Skin',
            description: 'Versatile sophisticated tones for balanced elegance',
            colors: [
                { name: 'Greige', hex: '#B6AFA6', category: 'Modern Neutral' },
                { name: 'Soft Taupe', hex: '#B38B6D', category: 'Warm Elegant' },
                { name: 'Dusty Blue', hex: '#8B9DC3', category: 'Cool Refined' },
                { name: 'Mauve', hex: '#B784A7', category: 'Subtle Luxe' },
                { name: 'Charcoal', hex: '#36454F', category: 'Classic Base' },
                { name: 'Sage', hex: '#9CAF88', category: 'Muted Elegant' },
                { name: 'Ivory', hex: '#FAF9F6', category: 'Soft Luxury' },
                { name: 'Pewter', hex: '#8F8E84', category: 'Metallic Detail' }
            ],
            wardrobeEssentials: {
                men: [
                    { item: 'Suit', colors: ['Charcoal', 'Greige'], occasions: 'Formal, business' },
                    { item: 'Blazer', colors: ['Charcoal', 'Soft Taupe', 'Dusty Blue'], occasions: 'Professional, versatile' },
                    { item: 'Dress Shirt', colors: ['Ivory', 'Dusty Blue'], occasions: 'Office, formal' },
                    { item: 'Casual Shirt', colors: ['Sage', 'Mauve', 'Soft Taupe'], occasions: 'Smart casual' },
                    { item: 'Trousers', colors: ['Charcoal', 'Greige', 'Dusty Blue'], occasions: 'Work, dressy' },
                    { item: 'Sweater', colors: ['Mauve', 'Sage', 'Soft Taupe'], occasions: 'Layering, refined' },
                    { item: 'Overcoat', colors: ['Charcoal', 'Greige'], occasions: 'Winter, classic' },
                    { item: 'Polo Shirt', colors: ['Dusty Blue', 'Sage'], occasions: 'Casual elegant' },
                    { item: 'Dress Shoes', colors: ['Charcoal', 'Soft Taupe'], occasions: 'Formal, professional' },
                    { item: 'Belt', colors: ['Soft Taupe', 'Pewter'], occasions: 'Accessory detail' }
                ],
                women: [
                    { item: 'Blazer', colors: ['Charcoal', 'Greige', 'Mauve'], occasions: 'Professional, polished' },
                    { item: 'Blouse', colors: ['Ivory', 'Dusty Blue', 'Sage'], occasions: 'Office, elegant' },
                    { item: 'Trousers', colors: ['Charcoal', 'Greige', 'Soft Taupe'], occasions: 'Work, sophisticated' },
                    { item: 'Dress', colors: ['Mauve', 'Dusty Blue', 'Sage'], occasions: 'Events, elegant' },
                    { item: 'Skirt', colors: ['Charcoal', 'Greige', 'Soft Taupe'], occasions: 'Professional, chic' },
                    { item: 'Cashmere Sweater', colors: ['Mauve', 'Sage', 'Ivory'], occasions: 'Luxury comfort' },
                    { item: 'Coat', colors: ['Charcoal', 'Greige'], occasions: 'Outerwear, timeless' },
                    { item: 'Silk Scarf', colors: ['Mauve', 'Dusty Blue', 'Sage'], occasions: 'Accessory elegance' },
                    { item: 'Pumps', colors: ['Pewter', 'Soft Taupe', 'Charcoal'], occasions: 'Dressy, refined' },
                    { item: 'Handbag', colors: ['Greige', 'Pewter'], occasions: 'Everyday luxury' }
                ]
            },
            combinations: [
                { outfit: 'Professional Meeting', colors: ['Charcoal', 'Ivory', 'Pewter'] },
                { outfit: 'Business Lunch', colors: ['Greige', 'Dusty Blue', 'Soft Taupe'] },
                { outfit: 'Evening Event', colors: ['Mauve', 'Charcoal', 'Ivory'] },
                { outfit: 'Elegant Casual', colors: ['Sage', 'Soft Taupe', 'Ivory'] }
            ],
            seasonalTips: {
                spring: 'Sage and dusty blue with ivory',
                summer: 'Mauve and ivory in light fabrics',
                autumn: 'Soft taupe with greige for warmth',
                winter: 'Layer charcoal with ivory and pewter'
            },
            avoidColors: ['Extremely bright neons', 'Very dark blacks'],
            bestFor: ['Versatile neutrals', 'Mixed metals', 'Balanced sophistication']
        },

        neutral_medium: {
            name: 'Medium Neutral Skin',
            description: 'Refined balance of warm and cool sophisticated tones',
            colors: [
                { name: 'Charcoal', hex: '#36454F', category: 'Classic Elegant' },
                { name: 'Slate', hex: '#708090', category: 'Modern Neutral' },
                { name: 'Plum', hex: '#8E4585', category: 'Rich Refined' },
                { name: 'Teal', hex: '#014D4E', category: 'Jewel Accent' },
                { name: 'Taupe', hex: '#B38B6D', category: 'Warm Base' },
                { name: 'Burgundy', hex: '#6B1F3A', category: 'Deep Luxe' },
                { name: 'Ivory', hex: '#F5F5F5', category: 'Soft Luxury' },
                { name: 'Bronze', hex: '#8C7853', category: 'Metallic Detail' }
            ],
            wardrobeEssentials: {
                men: [
                    { item: 'Suit', colors: ['Charcoal', 'Slate'], occasions: 'Formal, executive' },
                    { item: 'Blazer', colors: ['Charcoal', 'Teal', 'Burgundy'], occasions: 'Professional, versatile' },
                    { item: 'Dress Shirt', colors: ['Ivory', 'Slate'], occasions: 'Office, formal' },
                    { item: 'Casual Shirt', colors: ['Teal', 'Plum', 'Taupe'], occasions: 'Smart casual' },
                    { item: 'Trousers', colors: ['Charcoal', 'Slate', 'Taupe'], occasions: 'Work, dressy' },
                    { item: 'Sweater', colors: ['Burgundy', 'Teal', 'Plum'], occasions: 'Layering, elegant' },
                    { item: 'Overcoat', colors: ['Charcoal', 'Slate'], occasions: 'Winter, classic' },
                    { item: 'Turtleneck', colors: ['Burgundy', 'Teal', 'Charcoal'], occasions: 'Refined casual' },
                    { item: 'Dress Shoes', colors: ['Charcoal', 'Bronze'], occasions: 'Formal, professional' },
                    { item: 'Watch Strap', colors: ['Bronze', 'Taupe'], occasions: 'Accessory detail' }
                ],
                women: [
                    { item: 'Blazer', colors: ['Charcoal', 'Plum', 'Teal'], occasions: 'Professional, powerful' },
                    { item: 'Blouse', colors: ['Ivory', 'Plum', 'Slate'], occasions: 'Office, elegant' },
                    { item: 'Trousers', colors: ['Charcoal', 'Slate', 'Taupe'], occasions: 'Work, sophisticated' },
                    { item: 'Dress', colors: ['Burgundy', 'Teal', 'Plum'], occasions: 'Events, formal' },
                    { item: 'Skirt', colors: ['Charcoal', 'Slate', 'Taupe'], occasions: 'Professional, chic' },
                    { item: 'Cashmere Sweater', colors: ['Burgundy', 'Plum', 'Ivory'], occasions: 'Luxury layering' },
                    { item: 'Coat', colors: ['Charcoal', 'Slate', 'Burgundy'], occasions: 'Outerwear, statement' },
                    { item: 'Silk Scarf', colors: ['Plum', 'Teal', 'Burgundy'], occasions: 'Accessory luxury' },
                    { item: 'Heels', colors: ['Burgundy', 'Bronze', 'Charcoal'], occasions: 'Dressy, elegant' },
                    { item: 'Handbag', colors: ['Charcoal', 'Taupe'], occasions: 'Everyday sophistication' }
                ]
            },
            combinations: [
                { outfit: 'Executive Meeting', colors: ['Charcoal', 'Ivory', 'Burgundy'] },
                { outfit: 'Business Dinner', colors: ['Teal', 'Slate', 'Bronze'] },
                { outfit: 'Formal Event', colors: ['Plum', 'Charcoal', 'Ivory'] },
                { outfit: 'Elegant Casual', colors: ['Burgundy', 'Taupe', 'Ivory'] }
            ],
            seasonalTips: {
                spring: 'Teal and plum with ivory',
                summer: 'Slate and ivory in luxe fabrics',
                autumn: 'Burgundy with taupe for richness',
                winter: 'Layer charcoal with burgundy and bronze'
            },
            avoidColors: ['Muddy tones', 'Overly muted colors'],
            bestFor: ['Balanced sophistication', 'Mixed metals', 'Versatile elegance']
        },

        neutral_deep: {
            name: 'Deep Neutral Skin',
            description: 'Bold, luxurious tones for commanding presence',
            colors: [
                { name: 'Black', hex: '#1A1A1A', category: 'Ultimate Elegance' },
                { name: 'Deep Burgundy', hex: '#6B1F3A', category: 'Regal Luxe' },
                { name: 'Forest Green', hex: '#2C5530', category: 'Rich Jewel' },
                { name: 'Sapphire', hex: '#0F52BA', category: 'Bold Refined' },
                { name: 'Cognac', hex: '#9A463D', category: 'Warm Classic' },
                { name: 'Charcoal', hex: '#2C2C2C', category: 'Sophisticated Base' },
                { name: 'Champagne', hex: '#F7E7CE', category: 'Contrast Luxury' },
                { name: 'Bronze', hex: '#8C7853', category: 'Metallic Accent' }
            ],
            wardrobeEssentials: {
                men: [
                    { item: 'Suit', colors: ['Black', 'Charcoal', 'Sapphire'], occasions: 'Formal, executive' },
                    { item: 'Blazer', colors: ['Black', 'Forest Green', 'Deep Burgundy'], occasions: 'Professional, powerful' },
                    { item: 'Dress Shirt', colors: ['Champagne', 'Sapphire'], occasions: 'Office, formal' },
                    { item: 'Casual Shirt', colors: ['Forest Green', 'Cognac', 'Deep Burgundy'], occasions: 'Smart casual' },
                    { item: 'Trousers', colors: ['Black', 'Charcoal', 'Forest Green'], occasions: 'Work, dressy' },
                    { item: 'Sweater', colors: ['Deep Burgundy', 'Sapphire', 'Cognac'], occasions: 'Layering, sophisticated' },
                    { item: 'Overcoat', colors: ['Black', 'Charcoal', 'Cognac'], occasions: 'Winter, luxury' },
                    { item: 'Turtleneck', colors: ['Black', 'Deep Burgundy', 'Forest Green'], occasions: 'Elegant casual' },
                    { item: 'Dress Shoes', colors: ['Black', 'Cognac'], occasions: 'Formal, professional' },
                    { item: 'Leather Belt', colors: ['Cognac', 'Bronze'], occasions: 'Accessory detail' }
                ],
                women: [
                    { item: 'Blazer', colors: ['Black', 'Deep Burgundy', 'Forest Green'], occasions: 'Professional, commanding' },
                    { item: 'Blouse', colors: ['Champagne', 'Sapphire', 'Deep Burgundy'], occasions: 'Office, elegant' },
                    { item: 'Trousers', colors: ['Black', 'Charcoal', 'Forest Green'], occasions: 'Work, sophisticated' },
                    { item: 'Evening Gown', colors: ['Deep Burgundy', 'Forest Green', 'Sapphire'], occasions: 'Formal, gala' },
                    { item: 'Skirt', colors: ['Black', 'Charcoal', 'Cognac'], occasions: 'Professional, chic' },
                    { item: 'Cashmere Sweater', colors: ['Deep Burgundy', 'Champagne', 'Sapphire'], occasions: 'Luxury comfort' },
                    { item: 'Coat', colors: ['Black', 'Charcoal', 'Cognac'], occasions: 'Outerwear, statement' },
                    { item: 'Silk Scarf', colors: ['Deep Burgundy', 'Forest Green', 'Bronze'], occasions: 'Accessory luxury' },
                    { item: 'Heels', colors: ['Black', 'Cognac', 'Deep Burgundy'], occasions: 'Dressy, powerful' },
                    { item: 'Handbag', colors: ['Black', 'Cognac'], occasions: 'Everyday luxury' }
                ]
            },
            combinations: [
                { outfit: 'Power Dressing', colors: ['Black', 'Champagne', 'Deep Burgundy'] },
                { outfit: 'Formal Gala', colors: ['Forest Green', 'Bronze', 'Champagne'] },
                { outfit: 'Executive Meeting', colors: ['Sapphire', 'Charcoal', 'Champagne'] },
                { outfit: 'Elegant Evening', colors: ['Deep Burgundy', 'Cognac', 'Black'] }
            ],
            seasonalTips: {
                spring: 'Forest green and sapphire with champagne',
                summer: 'Champagne and cognac in luxe fabrics',
                autumn: 'Deep burgundy with cognac for richness',
                winter: 'Layer black with deep burgundy and bronze'
            },
            avoidColors: ['Pale pastels', 'Washed-out colors'],
            bestFor: ['Bold sophistication', 'Mixed metals', 'Luxe fabrics']
        }
    }
};

// Export for use in other modules
export default PaletteRecommender;
