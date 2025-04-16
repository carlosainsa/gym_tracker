import React, { useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const SavedNotification = ({ show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed bottom-20 left-0 right-0 flex justify-center z-50">
      <div className="bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center">
        <FaCheckCircle className="mr-2" size={18} />
        <span className="font-medium">Entrenamiento guardado correctamente</span>
      </div>
    </div>
  );
};

export default SavedNotification;
