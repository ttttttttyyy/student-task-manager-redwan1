import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { console.error('Student Task Manager UI error:', error, info); }
  render() {
    if (this.state.hasError) return <main className="fatal-fallback"><div className="fallback-icon">!</div><h1>Something went wrong</h1><p>We couldn’t display your tasks. Try refreshing the page.</p><button className="primary-btn" onClick={() => window.location.reload()}>Refresh app</button></main>;
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(<React.StrictMode><ErrorBoundary><App /></ErrorBoundary></React.StrictMode>);
