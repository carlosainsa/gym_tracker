import React, { useState } from 'react';
import { FaChartLine, FaArrowUp, FaArrowDown, FaRandom, FaExchangeAlt, FaUserCog, FaChevronDown, FaChevronUp } from 'react-icons/fa';

/**
 * Componente para la configuración de periodización
 */
const PeriodizationConfig = ({ periodizationType, setPeriodizationType }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Opciones de periodización
  const periodizationOptions = [
    {
      id: 'linear',
      name: 'Lineal',
      description: 'Progresión gradual de volumen a intensidad',
      icon: <FaArrowUp />,
      details: 'La periodización lineal comienza con alto volumen y baja intensidad, y progresivamente aumenta la intensidad mientras reduce el volumen. Ideal para principiantes y personas que buscan un enfoque estructurado y predecible.',
      example: 'Semanas 1-4: 3x12-15 (60-70% 1RM)\nSemanas 5-8: 4x8-10 (70-80% 1RM)\nSemanas 9-12: 5x4-6 (80-90% 1RM)'
    },
    {
      id: 'undulating',
      name: 'Ondulante',
      description: 'Variación frecuente de volumen e intensidad',
      icon: <FaExchangeAlt />,
      details: 'La periodización ondulante varía el volumen y la intensidad dentro de la misma semana o incluso en el mismo día. Proporciona mayor variedad y puede prevenir estancamientos. Ideal para intermedios y avanzados.',
      example: 'Lunes: 3x12 (65% 1RM)\nMiércoles: 4x8 (75% 1RM)\nViernes: 5x5 (85% 1RM)'
    },
    {
      id: 'block',
      name: 'Bloques',
      description: 'Enfoque en objetivos específicos por bloques',
      icon: <FaChartLine />,
      details: 'La periodización por bloques divide el entrenamiento en fases específicas, cada una con un enfoque particular (hipertrofia, fuerza, potencia). Cada bloque construye sobre el anterior. Ideal para atletas con objetivos específicos.',
      example: 'Bloque 1 (4 semanas): Hipertrofia - 3-4x10-12\nBloque 2 (4 semanas): Fuerza - 4-5x6-8\nBloque 3 (4 semanas): Potencia - 5-6x3-5'
    },
    {
      id: 'conjugate',
      name: 'Conjugada',
      description: 'Desarrollo simultáneo de múltiples cualidades',
      icon: <FaRandom />,
      details: 'La periodización conjugada trabaja simultáneamente diferentes cualidades físicas (fuerza máxima, fuerza explosiva, resistencia muscular) utilizando una variedad de ejercicios y métodos. Ideal para atletas avanzados que necesitan desarrollar múltiples capacidades.',
      example: 'Día 1: Fuerza máxima (ejercicios principales)\nDía 2: Potencia y velocidad\nDía 3: Hipertrofia y resistencia muscular\nRotación constante de ejercicios cada 1-3 semanas'
    },
    {
      id: 'auto_regulated',
      name: 'Auto-regulada',
      description: 'Ajuste basado en el rendimiento diario',
      icon: <FaUserCog />,
      details: 'La periodización auto-regulada ajusta el entrenamiento basándose en el rendimiento y la recuperación del día. Utiliza métricas como RPE (Esfuerzo Percibido) o velocidad de ejecución para determinar cargas y volumen. Ideal para personas con experiencia que saben escuchar a su cuerpo.',
      example: 'En lugar de pesos fijos:\nSerie 1: RPE 7-8\nSerie 2: RPE 8-9\nSerie 3: RPE 9\nAjuste diario basado en fatiga y rendimiento'
    }
  ];

  // Obtener la opción seleccionada
  const selectedOption = periodizationOptions.find(option => option.id === periodizationType) || periodizationOptions[0];

  return (
    <div>
      <div className="grid grid-cols-1 gap-3 mb-4">
        {periodizationOptions.map(option => (
          <button
            key={option.id}
            onClick={() => setPeriodizationType(option.id)}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              periodizationType === option.id
                ? 'bg-purple-50 border-purple-200 dark:bg-purple-900/30 dark:border-purple-700'
                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            <div className="flex items-center">
              <span className={`mr-3 ${periodizationType === option.id ? 'text-purple-500 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}`}>
                {option.icon}
              </span>
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white">{option.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{option.description}</p>
              </div>
            </div>
            {periodizationType === option.id && (
              <span className="w-6 h-6 flex items-center justify-center bg-purple-100 dark:bg-purple-800 rounded-full">
                <svg className="w-4 h-4 text-purple-500 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Detalles de la periodización seleccionada */}
      <div className="mt-4">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center"
        >
          {showDetails ? 'Ocultar detalles' : 'Mostrar detalles'}
          <span className="ml-1">
            {showDetails ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
          </span>
        </button>

        {showDetails && (
          <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
            <h4 className="font-medium text-gray-800 dark:text-white mb-2">{selectedOption.name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{selectedOption.details}</p>

            <h5 className="font-medium text-gray-700 dark:text-gray-300 text-sm mb-1">Ejemplo:</h5>
            <pre className="text-xs bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700 overflow-x-auto">
              {selectedOption.example}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default PeriodizationConfig;
