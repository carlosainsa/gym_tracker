import React, { useState } from 'react';
import { FaAdjust, FaChevronDown, FaChevronUp, FaInfoCircle, FaCheck } from 'react-icons/fa';
import { TRAINING_CONFIG } from '../config/trainingConfig';

/**
 * Componente para la autoregulación del entrenamiento
 */
const AutoRegulationPanel = ({ onAdjustments }) => {
  const [expanded, setExpanded] = useState(false);
  const [rpe, setRpe] = useState(8);
  const [fatigue, setFatigue] = useState('normal');
  const [showInfo, setShowInfo] = useState(false);
  const [adjustmentsApplied, setAdjustmentsApplied] = useState(false);
  
  // Obtener la configuración de autoregulación
  const { rpeScale, loadAdjustments, volumeAdjustments } = TRAINING_CONFIG.autoRegulation;
  
  // Calcular ajustes basados en RPE y fatiga
  const calculateAdjustments = () => {
    // Ajuste de carga basado en RPE
    let loadAdjustment = 0;
    if (rpe >= 10) {
      loadAdjustment = loadAdjustments.tooHeavy.adjustment;
    } else if (rpe >= 9) {
      loadAdjustment = loadAdjustments.heavy.adjustment;
    } else if (rpe === 8) {
      loadAdjustment = loadAdjustments.optimal.adjustment;
    } else if (rpe === 7) {
      loadAdjustment = loadAdjustments.light.adjustment;
    } else {
      loadAdjustment = loadAdjustments.tooLight.adjustment;
    }
    
    // Ajuste de volumen basado en fatiga
    let volumeAdjustment = 0;
    switch (fatigue) {
      case 'high':
        volumeAdjustment = volumeAdjustments.highFatigue.adjustment;
        break;
      case 'moderate':
        volumeAdjustment = volumeAdjustments.moderateFatigue.adjustment;
        break;
      case 'normal':
        volumeAdjustment = volumeAdjustments.normalFatigue.adjustment;
        break;
      case 'low':
        volumeAdjustment = volumeAdjustments.lowFatigue.adjustment;
        break;
      case 'veryLow':
        volumeAdjustment = volumeAdjustments.veryLowFatigue.adjustment;
        break;
      default:
        volumeAdjustment = 0;
    }
    
    return { loadAdjustment, volumeAdjustment };
  };
  
  // Aplicar ajustes
  const applyAdjustments = () => {
    const adjustments = calculateAdjustments();
    onAdjustments(adjustments);
    setAdjustmentsApplied(true);
    
    // Resetear el estado después de 3 segundos
    setTimeout(() => {
      setAdjustmentsApplied(false);
    }, 3000);
  };
  
  // Obtener descripción de RPE
  const getRpeDescription = (value) => {
    const rpeItem = rpeScale.find(item => item.value === value);
    return rpeItem ? rpeItem.description : '';
  };
  
  // Obtener descripción de fatiga
  const getFatigueDescription = (level) => {
    switch (level) {
      case 'high':
        return 'Alta fatiga - Recuperación muy limitada, dolor muscular significativo';
      case 'moderate':
        return 'Fatiga moderada - Recuperación parcial, algo de dolor muscular';
      case 'normal':
        return 'Fatiga normal - Recuperación adecuada, leve dolor muscular';
      case 'low':
        return 'Fatiga baja - Buena recuperación, mínimo dolor muscular';
      case 'veryLow':
        return 'Fatiga muy baja - Recuperación completa, sin dolor muscular';
      default:
        return '';
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
      <div 
        className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <FaAdjust className="text-primary-500 mr-2" />
          <h2 className="font-medium text-gray-800 dark:text-white">Autoregulación</h2>
        </div>
        <div className="flex items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowInfo(!showInfo);
            }}
            className="mr-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <FaInfoCircle className="text-gray-500 dark:text-gray-400" />
          </button>
          {expanded ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
        </div>
      </div>
      
      {showInfo && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800">
          <h3 className="text-sm font-medium text-gray-800 dark:text-white mb-2">¿Qué es la autoregulación?</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            La autoregulación te permite ajustar tu entrenamiento basándote en cómo te sientes hoy, 
            optimizando la carga y el volumen según tu estado actual.
          </p>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">RPE (Esfuerzo Percibido)</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Indica qué tan difícil te resultó el último entrenamiento. Un RPE de 10 significa máximo esfuerzo, 
            mientras que un RPE de 6 o menos significa que fue demasiado fácil.
          </p>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">Nivel de Fatiga</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Indica tu nivel actual de fatiga y recuperación. Esto afectará principalmente al volumen 
            de entrenamiento recomendado.
          </p>
        </div>
      )}
      
      {expanded && (
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              RPE - Esfuerzo Percibido
            </label>
            <div className="flex items-center">
              <input
                type="range"
                min="5"
                max="10"
                step="1"
                value={rpe}
                onChange={(e) => setRpe(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="ml-2 text-lg font-bold text-primary-600 dark:text-primary-400 min-w-[2rem] text-center">
                {rpe}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 italic">
              "{getRpeDescription(rpe)}"
            </p>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nivel de Fatiga
            </label>
            <div className="grid grid-cols-5 gap-2">
              <button
                onClick={() => setFatigue('high')}
                className={`py-2 px-1 rounded-lg text-xs font-medium ${
                  fatigue === 'high'
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Alta
              </button>
              <button
                onClick={() => setFatigue('moderate')}
                className={`py-2 px-1 rounded-lg text-xs font-medium ${
                  fatigue === 'moderate'
                    ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-700'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Moderada
              </button>
              <button
                onClick={() => setFatigue('normal')}
                className={`py-2 px-1 rounded-lg text-xs font-medium ${
                  fatigue === 'normal'
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Normal
              </button>
              <button
                onClick={() => setFatigue('low')}
                className={`py-2 px-1 rounded-lg text-xs font-medium ${
                  fatigue === 'low'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Baja
              </button>
              <button
                onClick={() => setFatigue('veryLow')}
                className={`py-2 px-1 rounded-lg text-xs font-medium ${
                  fatigue === 'veryLow'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Muy Baja
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 italic">
              "{getFatigueDescription(fatigue)}"
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ajustes recomendados:</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Ajuste de carga:</p>
                <p className={`text-lg font-bold ${
                  calculateAdjustments().loadAdjustment > 0
                    ? 'text-green-600 dark:text-green-400'
                    : calculateAdjustments().loadAdjustment < 0
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-800 dark:text-white'
                }`}>
                  {calculateAdjustments().loadAdjustment > 0 ? '+' : ''}
                  {calculateAdjustments().loadAdjustment}%
                </p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Ajuste de volumen:</p>
                <p className={`text-lg font-bold ${
                  calculateAdjustments().volumeAdjustment > 0
                    ? 'text-green-600 dark:text-green-400'
                    : calculateAdjustments().volumeAdjustment < 0
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-800 dark:text-white'
                }`}>
                  {calculateAdjustments().volumeAdjustment > 0 ? '+' : ''}
                  {calculateAdjustments().volumeAdjustment}%
                </p>
              </div>
            </div>
          </div>
          
          <button
            onClick={applyAdjustments}
            className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center"
            disabled={adjustmentsApplied}
          >
            {adjustmentsApplied ? (
              <>
                <FaCheck className="mr-2" />
                Ajustes aplicados
              </>
            ) : (
              'Aplicar ajustes'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default AutoRegulationPanel;
