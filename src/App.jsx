import React, { useState, useEffect } from 'react';
import SkinToneAnalyzer from './utils/SkinToneAnalyzer';
import PaletteRecommender from './utils/PaletteRecommender';
import ImageUploader from './components/ImageUploader';
import AnalysisResults from './components/AnalysisResults';
import OnboardingPanel from './components/OnboardingPanel';
import PrivacyPanel from './components/PrivacyPanel';

const ONBOARDING_KEY = 'skinToneAnalyzer_onboardingComplete';

function App() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [palette, setPalette] = useState(null);
    const [skinPixels, setSkinPixels] = useState([]);
    const [confidence, setConfidence] = useState(0);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState(null);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [hasVisited, setHasVisited] = useState(false);

    useEffect(() => {
        const visited = localStorage.getItem(ONBOARDING_KEY);
        if (!visited) {
            setShowOnboarding(true);
        }
        setHasVisited(!!visited);
    }, []);

    const dismissOnboarding = () => {
        localStorage.setItem(ONBOARDING_KEY, 'true');
        setShowOnboarding(false);
        setHasVisited(true);
    };

    const handleImageSelect = (file) => {
        setSelectedImage(file);
        setAnalysis(null);
        setPalette(null);
        setError(null);
    };

    const handleAnalyze = async (file) => {
        setIsAnalyzing(true);
        setError(null);

        try {
            const result = await SkinToneAnalyzer.analyzeImage(file);
            setAnalysis(result);

            if (result.skinPixels) {
                setSkinPixels(result.skinPixels);
            }
            
            const confidenceScore = result.confidence || Math.min(95, 70 + (result.skinPixels?.length || 0) / 10);
            setConfidence(Math.round(confidenceScore));

            const recommendedPalette = PaletteRecommender.getPalette(result);
            setPalette(recommendedPalette);

            setTimeout(() => {
                const resultsElement = document.querySelector('.results-container');
                if (resultsElement) {
                    resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        } catch (err) {
            setError(err.message || 'Failed to analyze image. Please try another photo.');
            console.error('Analysis error:', err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="app-container">
            {showOnboarding && (
                <OnboardingPanel onDismiss={dismissOnboarding} />
            )}

            <header className="app-header">
                <h1 className="app-title">Skin Tone Analyzer</h1>
                <p className="app-subtitle">
                    Discover your perfect color palette based on your unique skin tone
                </p>
            </header>

            <main className="main-content">
                <ImageUploader
                    onImageSelect={handleImageSelect}
                    onAnalyze={handleAnalyze}
                />

                {isAnalyzing && (
                    <div style={{
                        textAlign: 'center',
                        marginTop: 'var(--spacing-xl)',
                        color: 'var(--text-secondary)',
                        fontSize: 'var(--font-size-lg)'
                    }}>
                        <div style={{
                            fontSize: '3rem',
                            marginBottom: 'var(--spacing-md)',
                            animation: 'pulse 1.5s ease-in-out infinite'
                        }}>
                            🔍
                        </div>
                        Analyzing your skin tone...
                    </div>
                )}

                {error && (
                    <div style={{
                        marginTop: 'var(--spacing-xl)',
                        padding: 'var(--spacing-lg)',
                        background: 'hsla(0, 70%, 50%, 0.1)',
                        border: '1px solid hsla(0, 70%, 50%, 0.3)',
                        borderRadius: 'var(--radius-md)',
                        color: 'hsl(0, 70%, 70%)',
                        textAlign: 'center'
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                {analysis && palette && !isAnalyzing && (
                    <AnalysisResults 
                        analysis={analysis} 
                        palette={palette}
                        skinPixels={skinPixels}
                        confidence={confidence}
                    />
                )}
            </main>

            <footer className="app-footer">
                <PrivacyPanel />
            </footer>

            <style>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }
            `}</style>
        </div>
    );
}

export default App;
