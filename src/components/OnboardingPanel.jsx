import React, { useState } from 'react';

function OnboardingPanel({ onDismiss }) {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        {
            title: 'Discover Your Perfect Colors',
            description: 'Upload a photo to analyze your unique skin tone and get personalized color recommendations for your wardrobe.',
            icon: '🎨'
        },
        {
            title: 'Accurate Analysis',
            description: 'Our algorithm detects skin tone, undertone, and seasonal type to recommend colors that complement your natural coloring.',
            icon: '✨'
        },
        {
            title: 'Privacy First',
            description: 'All analysis happens on your device. Your photos are never uploaded to any server.',
            icon: '🔒'
        },
        {
            title: 'Build Your Palette',
            description: 'Get outfit combinations, wardrobe essentials, and seasonal tips tailored to your skin tone.',
            icon: '👔'
        }
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onDismiss();
        }
    };

    const handleSkip = () => {
        onDismiss();
    };

    const step = steps[currentStep];
    const isLastStep = currentStep === steps.length - 1;

    return (
        <div 
            className="onboarding-panel"
            role="dialog"
            aria-labelledby="onboarding-title"
            aria-describedby="onboarding-description"
        >
            <button 
                className="onboarding-skip"
                onClick={handleSkip}
                aria-label="Skip onboarding"
            >
                Skip
            </button>

            <div className="onboarding-icon" aria-hidden="true">
                {step.icon}
            </div>

            <h2 id="onboarding-title" className="onboarding-title">
                {step.title}
            </h2>

            <p id="onboarding-description" className="onboarding-description">
                {step.description}
            </p>

            <div className="onboarding-progress" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={steps.length}>
                {steps.map((_, index) => (
                    <div 
                        key={index}
                        className={`progress-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                        aria-hidden="true"
                    />
                ))}
            </div>

            <div className="onboarding-actions">
                {currentStep > 0 && (
                    <button 
                        className="onboarding-back"
                        onClick={() => setCurrentStep(currentStep - 1)}
                        aria-label="Previous step"
                    >
                        Back
                    </button>
                )}
                <button 
                    className="onboarding-next"
                    onClick={handleNext}
                    aria-label={isLastStep ? 'Get started' : 'Next step'}
                >
                    {isLastStep ? 'Get Started' : 'Next'}
                </button>
            </div>
        </div>
    );
}

export default OnboardingPanel;
