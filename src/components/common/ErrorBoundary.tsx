import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 bg-rose-50 text-rose-900 border border-rose-200 rounded-xl m-4">
          <h1 className="text-xl font-black mb-2">Something went wrong.</h1>
          <p className="text-sm">Please refresh or contact support if the issue persists.</p>
          <pre className="text-xs mt-4 p-4 bg-white rounded border border-rose-100 overflow-auto">{this.state.error?.message}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}
