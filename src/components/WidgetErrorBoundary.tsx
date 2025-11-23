import React, { Component, ReactNode } from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import type { WidgetType } from '../types';

interface Props {
  children: ReactNode;
  widgetId: string;
  widgetType: WidgetType;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class WidgetErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('Widget Error:', {
        widgetId: this.props.widgetId,
        widgetType: this.props.widgetType,
        error,
        errorInfo,
      });
    }

    this.setState({
      error,
      errorInfo,
    });

    // In production, you could send to error tracking service like Sentry
    // Sentry.captureException(error, { extra: { widgetId, widgetType, errorInfo } });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 h-full flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/10 rounded-lg border-2 border-red-200 dark:border-red-800">
          <FiAlertTriangle className="w-12 h-12 text-red-500 dark:text-red-400 mb-4" />

          <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">
            Widget Error
          </h3>

          <p className="text-sm text-red-700 dark:text-red-300 text-center mb-4 max-w-sm">
            This {this.props.widgetType} widget encountered an error and couldn't load properly.
          </p>

          {import.meta.env.DEV && this.state.error && (
            <details className="mb-4 w-full max-w-md">
              <summary className="text-xs text-red-600 dark:text-red-400 cursor-pointer hover:underline">
                Error Details (Dev Only)
              </summary>
              <pre className="mt-2 p-2 bg-red-100 dark:bg-red-900/20 rounded text-xs overflow-auto max-h-40 text-red-800 dark:text-red-300">
                {this.state.error.toString()}
                {this.state.errorInfo && '\n\n' + this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}

          <button
            onClick={this.handleReset}
            className="btn-primary flex items-center space-x-2"
          >
            <FiRefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default WidgetErrorBoundary;
