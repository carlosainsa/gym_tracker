import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error capturado en ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Algo salió mal</h1>
          <p className="mb-4">Ha ocurrido un error al cargar esta página.</p>
          <div className="bg-gray-100 p-4 rounded-lg mb-4 overflow-auto max-h-60">
            <p className="font-mono text-sm text-red-600">
              {this.state.error && this.state.error.toString()}
            </p>
          </div>
          <p className="mb-4 text-sm">Por favor, abre la consola del navegador (F12) para ver más detalles.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg"
          >
            Volver al inicio
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
