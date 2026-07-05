import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50">
          <div className="max-w-lg text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">! حدث خطأ</h1>
            <pre className="text-sm text-left bg-white p-4 rounded-xl border border-red-200 overflow-auto max-h-60 mb-4">
              {this.state.error.message}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              إعادة تحميل
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
