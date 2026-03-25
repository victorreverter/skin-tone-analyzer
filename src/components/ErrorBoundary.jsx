import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false, 
            error: null, 
            errorInfo: null 
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error,
            errorInfo
        });
        
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
        
        console.error('Error caught by boundary:', error, errorInfo);
    }

    handleReload = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.reload();
    };

    handleGoHome = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        if (this.props.onReset) {
            this.props.onReset();
        }
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary" role="alert">
                    <div className="error-content">
                        <div className="error-icon">⚠️</div>
                        <h2 className="error-title">Something went wrong</h2>
                        <p className="error-message">
                            We encountered an unexpected error. This has been logged and we'll look into it.
                        </p>
                        <div className="error-actions">
                            <button 
                                className="error-btn primary"
                                onClick={this.handleReload}
                            >
                                Reload Page
                            </button>
                            <button 
                                className="error-btn secondary"
                                onClick={this.handleGoHome}
                            >
                                Start Over
                            </button>
                        </div>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="error-details">
                                <summary>Error Details (Development)</summary>
                                <pre className="error-stack">
                                    {this.state.error.toString()}
                                    {'\n\n'}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

function ErrorMessage({ message, onDismiss, onRetry }) {
    return (
        <div className="error-message-box" role="alert">
            <div className="error-message-content">
                <span className="error-message-icon">⚠️</span>
                <span className="error-message-text">{message}</span>
            </div>
            <div className="error-message-actions">
                {onRetry && (
                    <button 
                        className="error-message-btn"
                        onClick={onRetry}
                    >
                        Try Again
                    </button>
                )}
                {onDismiss && (
                    <button 
                        className="error-message-btn dismiss"
                        onClick={onDismiss}
                        aria-label="Dismiss error"
                    >
                        ×
                    </button>
                )}
            </div>
        </div>
    );
}

export { ErrorBoundary, ErrorMessage };
