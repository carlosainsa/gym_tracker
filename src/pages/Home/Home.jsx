import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const menuItems = [
    {
      title: 'Entrenar',
      description: 'Comienza tu sesión de entrenamiento de hoy',
      icon: '💪',
      path: '/workout'
    },
    {
      title: 'Progreso',
      description: 'Visualiza tu progreso',
      icon: '📈',
      path: '/progress'
    },
    {
      title: 'Plan',
      description: 'Tu plan de entrenamiento',
      icon: '📋',
      path: '/plan'
    },
    {
      title: 'Ejercicios',
      description: 'Biblioteca de ejercicios',
      icon: '🏋️‍♂️',
      path: '/exercises'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Gym Tracker</h1>
        <p className="text-gray-600">Tu compañero de entrenamiento</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 text-left"
          >
            <div className="flex items-center">
              <span className="text-4xl mr-4">{item.icon}</span>
              <div>
                <h2 className="text-xl font-semibold mb-1">{item.title}</h2>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => navigate('/profile')}
          className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
        >
          Mi Perfil
        </button>
      </div>
    </div>
  );
}

export default Home;