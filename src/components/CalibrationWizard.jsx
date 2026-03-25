import React, { useState } from 'react';

function CalibrationWizard({ onComplete }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [calibrationData, setCalibrationData] = useState({
        lightingCondition: null,
        skinArea: null,
        photoQuality: null
    });

    const steps = [
        {
            id: 'lighting',
            title: 'Lighting Conditions',
            description: 'What type of lighting was your photo taken in?',
            options: [
                { id: 'natural', label: 'Natural Daylight', icon: '☀️', description: 'Near a window or outdoors' },
                { id: 'indoor', label: 'Indoor Lighting', icon: '💡', description: 'LED or fluorescent lights' },
                { id: 'mixed', label: 'Mixed Lighting', icon: '🔆', description: 'Combination of natural and artificial' },
                { id: 'unknown', label: 'Not Sure', icon: '❓', description: 'Cannot determine lighting type' }
            ]
        },
        {
            id: 'skin-area',
            title: 'Face Visibility',
            description: 'How clearly is your face visible in the photo?',
            options: [
                { id: 'full', label: 'Full Face', icon: '😊', description: 'Entire face clearly visible' },
                { id: 'partial', label: 'Partial Face', icon: '😐', description: 'Part of face covered or in shadow' },
                { id: 'multiple', label: 'Multiple People', icon: '👥', description: 'More than one face in photo' },
                { id: 'unclear', label: 'Unclear', icon: '❓', description: 'Face not clearly visible' }
            ]
        },
        {
            id: 'quality',
            title: 'Photo Quality',
            description: 'How would you rate the quality of your photo?',
            options: [
                { id: 'high', label: 'High Quality', icon: '⭐', description: 'Sharp, well-lit, professional' },
                { id: 'medium', label: 'Good Quality', icon: '👍', description: 'Acceptable, slight issues' },
                { id: 'low', label: 'Low Quality', icon: '👎', description: 'Blurry, dark, or pixelated' }
            ]
        },
        {
            id: 'results',
            title: 'Calibration Results',
            description: 'Based on your input, here are recommendations',
            results: true
        }
    ];

    const handleOptionSelect = (stepId, optionId) => {
        setCalibrationData(prev => ({
            ...prev,
            [stepId]: optionId
        }));
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = () => {
        const confidence = calculateAdjustedConfidence();
        onComplete({
            ...calibrationData,
            adjustedConfidence: confidence,
            recommendations: getRecommendations()
        });
    };

    const calculateAdjustedConfidence = () => {
        let baseConfidence = 80;
        
        if (calibrationData.lightingCondition === 'natural') baseConfidence += 15;
        else if (calibrationData.lightingCondition === 'indoor') baseConfidence += 5;
        else if (calibrationData.lightingCondition === 'mixed') baseConfidence += 0;
        else baseConfidence -= 10;

        if (calibrationData.skinArea === 'full') baseConfidence += 10;
        else if (calibrationData.skinArea === 'partial') baseConfidence += 0;
        else baseConfidence -= 15;

        if (calibrationData.photoQuality === 'high') baseConfidence += 10;
        else if (calibrationData.photoQuality === 'medium') baseConfidence += 0;
        else baseConfidence -= 20;

        return Math.max(10, Math.min(100, baseConfidence));
    };

    const getRecommendations = () => {
        const recommendations = [];

        if (calibrationData.lightingCondition !== 'natural') {
            recommendations.push({
                type: 'warning',
                text: 'For more accurate results, try taking a photo in natural daylight near a window.'
            });
        }

        if (calibrationData.skinArea !== 'full') {
            recommendations.push({
                type: 'info',
                text: 'Ensure your entire face is visible and well-lit for best results.'
            });
        }

        if (calibrationData.photoQuality === 'low') {
            recommendations.push({
                type: 'warning',
                text: 'Low quality photos may affect accuracy. Consider retaking with better lighting.'
            });
        }

        if (recommendations.length === 0) {
            recommendations.push({
                type: 'success',
                text: 'Your photo conditions look good! Results should be highly accurate.'
            });
        }

        return recommendations;
    };

    const step = steps[currentStep];
    const canProceed = calibrationData[step.id] !== null || step.results;
    const progress = ((currentStep + 1) / steps.length) * 100;

    return (
        <div className="calibration-wizard">
            <div className="wizard-header">
                <h3 className="wizard-title">Calibration Wizard</h3>
                <div className="progress-bar">
                    <div 
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                        role="progressbar"
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    />
                </div>
                <span className="progress-text">
                    Step {currentStep + 1} of {steps.length}
                </span>
            </div>

            <div className="wizard-content">
                {!step.results ? (
                    <>
                        <h4 className="step-title">{step.title}</h4>
                        <p className="step-description">{step.description}</p>

                        <div className="options-grid">
                            {step.options.map((option) => (
                                <button
                                    key={option.id}
                                    className={`option-card ${calibrationData[step.id] === option.id ? 'selected' : ''}`}
                                    onClick={() => handleOptionSelect(step.id, option.id)}
                                    aria-pressed={calibrationData[step.id] === option.id}
                                >
                                    <span className="option-icon">{option.icon}</span>
                                    <span className="option-label">{option.label}</span>
                                    <span className="option-description">{option.description}</span>
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="results-section">
                        <div className="confidence-display">
                            <div className="confidence-circle">
                                <span className="confidence-value">
                                    {calculateAdjustedConfidence()}%
                                </span>
                                <span className="confidence-label">Confidence</span>
                            </div>
                        </div>

                        <div className="recommendations-list">
                            {getRecommendations().map((rec, index) => (
                                <div 
                                    key={index} 
                                    className={`recommendation ${rec.type}`}
                                >
                                    <span className="rec-icon">
                                        {rec.type === 'success' && '✓'}
                                        {rec.type === 'warning' && '⚠'}
                                        {rec.type === 'info' && 'ℹ'}
                                    </span>
                                    <span className="rec-text">{rec.text}</span>
                                </div>
                            ))}
                        </div>

                        <div className="summary-section">
                            <h5>Summary</h5>
                            <div className="summary-grid">
                                <div className="summary-item">
                                    <span className="summary-label">Lighting</span>
                                    <span className="summary-value">
                                        {steps[0].options.find(o => o.id === calibrationData.lightingCondition)?.label}
                                    </span>
                                </div>
                                <div className="summary-item">
                                    <span className="summary-label">Face Visibility</span>
                                    <span className="summary-value">
                                        {steps[1].options.find(o => o.id === calibrationData.skinArea)?.label}
                                    </span>
                                </div>
                                <div className="summary-item">
                                    <span className="summary-label">Photo Quality</span>
                                    <span className="summary-value">
                                        {steps[2].options.find(o => o.id === calibrationData.photoQuality)?.label}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="wizard-footer">
                <button 
                    className="wizard-btn back"
                    onClick={handleBack}
                    disabled={currentStep === 0}
                >
                    Back
                </button>
                {!step.results ? (
                    <button 
                        className="wizard-btn next"
                        onClick={handleNext}
                        disabled={!canProceed}
                    >
                        Next
                    </button>
                ) : (
                    <button 
                        className="wizard-btn complete"
                        onClick={handleComplete}
                    >
                        Complete Calibration
                    </button>
                )}
            </div>
        </div>
    );
}

export default CalibrationWizard;
