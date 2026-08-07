
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 left-1/3 w-[600px] h-[600px] rounded-full bg-blue-600/15 blur-[140px]" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-900/30 blur-[120px]" />
          </div>
          <div className="relative max-w-md w-full mx-4">
            <div className="app-card p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              
              <h1 className="text-xl font-bold tracking-tight text-white mb-3">
                Er is iets misgegaan
              </h1>
              
              <p className="text-slate-400 mb-6">
                We ondervinden momenteel een technisch probleem. Probeer de pagina te vernieuwen.
              </p>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => window.location.reload()}
                  className="w-full app-btn-primary rounded-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Pagina vernieuwen
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/'}
                  className="w-full rounded-full bg-transparent border border-white/10 text-slate-200 hover:bg-white/5 hover:text-white"
                >
                  Naar homepagina
                </Button>
              </div>
              
              {import.meta.env.DEV && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm text-slate-400 hover:text-slate-200">
                    Technische details (development mode)
                  </summary>
                  <pre className="mt-2 text-xs bg-white/5 border border-white/10 p-3 rounded-lg text-red-300 overflow-auto">
                    {this.state.error.message}
                    {'\n'}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );

    }

    return this.props.children;
  }
}

export default ErrorBoundary;
