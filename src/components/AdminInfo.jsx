import React, { useEffect, useState } from 'react';
import { adminCredentials, createAdminUser } from '../utils/createAdminUser';
import { FaUser, FaKey, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';

const AdminInfo = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [adminCreated, setAdminCreated] = useState(false);

  useEffect(() => {
    // Intentar crear el usuario administrador al montar el componente
    const createAdmin = async () => {
      try {
        const user = await createAdminUser();
        setAdminCreated(true);
      } catch (error) {
        console.error('Error al crear usuario administrador:', error);
      }
    };

    createAdmin();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowInfo(!showInfo)}
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors duration-200 flex items-center justify-center"
        aria-label="Información de administrador"
      >
        <FaInfoCircle className="h-6 w-6" />
      </button>

      {showInfo && (
        <div className="absolute bottom-14 right-0 bg-white dark:bg-gray-800 p-5 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-80 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <FaUser className="mr-2 text-blue-500" />
              Credenciales de Acceso
            </h3>
            <div className="bg-blue-100 dark:bg-blue-900 p-1 rounded-full">
              {adminCreated ? (
                <FaCheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              ) : (
                <FaInfoCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              )}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-600">
            <div className="flex items-center mb-3">
              <FaUser className="text-gray-500 dark:text-gray-400 mr-3" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">{adminCredentials.email}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaKey className="text-gray-500 dark:text-gray-400 mr-3" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Contraseña</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">{adminCredentials.password}</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            {adminCreated
              ? "Usuario creado exitosamente. Puedes usar estas credenciales para iniciar sesión."
              : "El usuario ya existe. Usa estas credenciales para iniciar sesión."}
          </p>

          <button
            onClick={() => setShowInfo(false)}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
          >
            Entendido
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminInfo;
