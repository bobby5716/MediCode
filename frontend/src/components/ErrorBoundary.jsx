import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.warn('Section failed:', this.props.label, error);
  }
  render() {
    if (this.state.hasError) {
      if (this.props.silent) return null;
      return (
        <div className="py-12 px-6 text-center text-white/20 text-xs font-mono">
          {this.props.label || 'Section'} unavailable
        </div>
      );
    }
    return this.props.children;
  }
}