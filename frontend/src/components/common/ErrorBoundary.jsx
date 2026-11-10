import React from "react";
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // In production, error logging services (like Sentry) would be notified here
    if (process.env.NODE_ENV !== "production") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          resetError: this.handleReset,
        });
      }

      return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#f7f5f0] dark:bg-[#07090e] text-[#1c1815] dark:text-[#f3f0ea] transition-colors duration-300 relative overflow-hidden">
          {/* Ambient background glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-amber-500/10 dark:bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-rose-500/10 dark:bg-rose-500/5 blur-[100px] rounded-full pointer-events-none" />

          {/* Luxury Glassy Error Card */}
          <div className="relative w-full max-w-xl mx-auto rounded-[32px] p-8 sm:p-10 bg-white/75 dark:bg-[#10141d]/85 backdrop-blur-2xl border border-[#241c14]/10 dark:border-white/10 shadow-2xl text-center">

            {/* Warning Badge Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/25 dark:border-amber-400/20 text-amber-600 dark:text-amber-400 mb-6 shadow-inner animate-pulse">
              <AlertTriangle className="w-10 h-10" strokeWidth={1.8} />
            </div>

            {/* Error Headlines */}
            <span className="inline-block text-[11px] font-sans font-bold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3.5 py-1 rounded-full mb-3 border border-amber-500/20">
              System Notice
            </span>

            <h1 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#1c1815] dark:text-[#f8f6f0] mb-3">
              Something unexpected occurred
            </h1>

            <p className="font-sans text-sm sm:text-base text-[#60554b] dark:text-[#9ea3b0] max-w-md mx-auto leading-relaxed mb-8">
              We encountered a glitch while displaying this section. Your data is safe. You can refresh the view or return to the main dashboard.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-sans font-bold tracking-wider uppercase bg-[#1c1815] text-[#f7f5f0] hover:bg-black dark:bg-[#e8be74] dark:text-[#0b0e14] dark:hover:bg-[#f3ce8a] transition-all shadow-md active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reload Page
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-sans font-bold tracking-wider uppercase bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-[#302720] dark:text-[#d8dce6] border border-[#241c14]/10 dark:border-white/10 transition-all active:scale-95"
              >
                <Home className="w-3.5 h-3.5" />
                Return Home
              </button>
            </div>

            {/* Technical details toggle (useful for developer diagnosis without disturbing casual users) */}
            {this.state.error && (
              <div className="pt-4 border-t border-[#241c14]/5 dark:border-white/5 text-left">
                <button
                  type="button"
                  onClick={this.toggleDetails}
                  className="inline-flex items-center gap-1.5 text-xs text-[#8a7f73] dark:text-[#788094] hover:text-[#1c1815] dark:hover:text-[#f8f6f0] transition-colors"
                >
                  <span>{this.state.showDetails ? "Hide technical details" : "Show technical details"}</span>
                  {this.state.showDetails ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>

                {this.state.showDetails && (
                  <div className="mt-3 p-4 rounded-2xl bg-black/5 dark:bg-black/40 border border-[#241c14]/10 dark:border-white/10 text-xs font-mono text-red-600 dark:text-red-400 overflow-x-auto max-h-48 whitespace-pre-wrap select-all">
                    <p className="font-bold mb-1">{this.state.error.toString()}</p>
                    {this.state.errorInfo?.componentStack && (
                      <p className="text-[11px] opacity-75">{this.state.errorInfo.componentStack}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

