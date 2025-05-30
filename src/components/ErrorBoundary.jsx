import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-red-800 mb-4">Algo salió mal</h2>
        <div className="bg-white p-4 rounded-lg mb-4 overflow-auto max-h-60">
          <pre className="text-sm text-red-600 whitespace-pre-wrap">
            {error.message}
          </pre>
        </div>
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}

export default function AppErrorBoundary({ children }) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reiniciar el estado de la aplicación
        window.location.href = '/';
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}