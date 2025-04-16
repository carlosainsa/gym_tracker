import React, { useState } from 'react';
import { FaInfoCircle, FaTimes } from 'react-icons/fa';

const DevModeNotice = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-50 mx-auto max-w-md px-4">
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg shadow-lg animate-fade-in">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <FaInfoCircle className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium">
              <strong>Modo de desarrollo activo</strong>
            </p>
            <p className="text-sm mt-1">
              <span className="font-bold text-red-600">AUTENTICACIÓN DESACTIVADA TEMPORALMENTE</span><br/>
              Estás usando una sesión simulada. No es necesario iniciar sesión.
              Todos los datos se guardarán localmente en este dispositivo.
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="ml-4 flex-shrink-0 text-yellow-500 hover:text-yellow-700"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DevModeNotice;
