import React, { useState } from 'react';

function ImageUploader({ onImageSelect, onAnalyze }) {
    const [dragOver, setDragOver] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);

        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        handleFile(file);
    };

    const handleFile = (file) => {
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10MB');
            return;
        }

        setSelectedFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);

        // Notify parent component
        onImageSelect(file);
    };

    const handleAnalyzeClick = () => {
        if (selectedFile) {
            onAnalyze(selectedFile);
        }
    };

    return (
        <div className="uploader-container glass-card">
            <div
                className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input').click()}
            >
                <div className="upload-icon">📸</div>
                <div className="upload-text">
                    {imagePreview ? 'Upload a different photo' : 'Upload your photo'}
                </div>
                <div className="upload-hint">
                    Drag and drop or click to browse
                </div>
                <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    style={{ display: 'none' }}
                />
            </div>

            {imagePreview && (
                <div className="image-preview-container">
                    <img
                        src={imagePreview}
                        alt="Preview"
                        className="image-preview"
                    />
                    <button
                        className="analyze-button"
                        onClick={handleAnalyzeClick}
                    >
                        ✨ Analyze My Skin Tone
                    </button>
                </div>
            )}
        </div>
    );
}

export default ImageUploader;
