import React, { useState, useEffect } from 'react';
import SkinToneAnalyzer from './utils/SkinToneAnalyzer';
import PaletteRecommender from './utils/PaletteRecommender';
import ImageUploader from './components/ImageUploader';
import AnalysisResults from './components/AnalysisResults';
import OnboardingPanel from './components/OnboardingPanel';
import PrivacyPanel from './components/PrivacyPanel';
import { ErrorBoundary, ErrorMessage } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingStates';

const ONBOARDING_KEY = 'skinToneAnalyzer_onboardingComplete';

function App() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
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

    const handleImageSelect = (file, previewUrl) => {
        setSelectedImage(file);
        setImagePreview(previewUrl);
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
        <ErrorBoundary>
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
                        <div className="analyzing-container">
                            <LoadingSpinner size="large" message="Analyzing your skin tone..." />
                        </div>
                    )}

                    {error && (
                        <ErrorMessage 
                            message={error}
                            onDismiss={() => setError(null)}
                            onRetry={() => selectedImage && handleAnalyze(selectedImage)}
                        />
                    )}

                    {analysis && palette && !isAnalyzing && (
                        <AnalysisResults 
                            analysis={analysis} 
                            palette={palette}
                            skinPixels={skinPixels}
                            confidence={confidence}
                            imagePreview={imagePreview}
                        />
                    )}
                </main>

                <footer className="app-footer">
                    <PrivacyPanel />
                </footer>
            </div>
        </ErrorBoundary>
    );
}

export default App;
