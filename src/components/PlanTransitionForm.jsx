import React, { useState, useEffect } from 'react';
import { FaArrowRight, FaCheck, FaInfoCircle, FaSpinner } from 'react-icons/fa';
import planTransitionService from '../services/planTransitionService';
import { useTraining } from '../context/TrainingContext';

/**
 * Componente para crear un plan de transición a partir de un plan existente
 */
const PlanTransitionForm = ({ sourcePlan, onTransitionComplete }) => {
  const { workoutLogs, createNewPlan } = useTraining();
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [formData, setFormData] = useState({
    name: `Transición desde ${sourcePlan?.name || 'plan actual'}`,
    description: `Plan de transición basado en ${sourcePlan?.name || 'plan actual'}`,
    adjustWeights: true,
    weightAdjustmentFactor: 1.05,
    keepExercises: true,
    keepStructure: true,
    duration: sourcePlan?.duration || 4,
    periodizationType: sourcePlan?.periodizationType || 'linear',
    frequency: sourcePlan?.frequency || 3,
    splitType: sourcePlan?.splitType || 'full_body',
    equipment: sourcePlan?.equipment || ['bodyweight', 'dumbbell', 'barbell'],
    primaryGoal: sourcePlan?.primaryGoal || 'strength',
    secondaryGoal: sourcePlan?.secondaryGoal || 'hypertrophy',
    difficultyLevel: sourcePlan?.difficultyLevel || 'intermediate'
  });
  
  // Analizar el plan para sugerencias
  useEffect(() => {
    if (sourcePlan && workoutLogs) {
      const planAnalysis = planTransitionService.analyzePlanForTransition(sourcePlan, workoutLogs);
      
      if (planAnalysis) {
        setAnalysis(planAnalysis);
        
        // Actualizar el formulario con las sugerencias
        setFormData(prev => ({
          ...prev,
          weightAdjustmentFactor: planAnalysis.globalWeightAdjustment,
          periodizationType: planAnalysis.suggestedPeriodizationType,
          frequency: planAnalysis.suggestedFrequency,
          duration: planAnalysis.suggestedDuration
        }));
      }
      
      setLoading(false);
    }
  }, [sourcePlan, workoutLogs]);
  
  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Manejar cambios en selección múltiple
  const handleMultiSelectChange = (e) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    
    setFormData(prev => ({
      ...prev,
      [name]: selectedValues
    }));
  };
  
  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      // Crear el plan de transición
      const transitionPlan = planTransitionService.createTransitionPlan(sourcePlan, formData);
      
      // Guardar el nuevo plan
      createNewPlan(transitionPlan);
      
      // Notificar que la transición se ha completado
      if (onTransitionComplete) {
        onTransitionComplete(transitionPlan);
      }
    } catch (error) {
      console.error('Error al crear el plan de transición:', error);
      alert('Error al crear el plan de transición: ' + error.message);
    }
  };
  
  // Mapeo de tipos de periodización a nombres legibles
  const periodizationTypes = {
    'linear': 'Lineal',
    'undulating': 'Ondulante',
    'block': 'Por bloques',
    'conjugate': 'Conjugada'
  };
  
  // Mapeo de tipos de split a nombres legibles
  const splitTypes = {
    'full_body': 'Cuerpo completo',
    'upper_lower': 'Superior/Inferior',
    'push_pull_legs': 'Empuje/Tirón/Piernas',
    'body_part_split': 'División por grupos musculares'
  };
  
  // Mapeo de objetivos a nombres legibles
  const goals = {
    'strength': 'Fuerza',
    'hypertrophy': 'Hipertrofia',
    'endurance': 'Resistencia',
    'fat_loss': 'Pérdida de grasa',
    'general': 'General'
  };
  
  // Mapeo de niveles de dificultad a nombres legibles
  const difficultyLevels = {
    'beginner': 'Principiante',
    'intermediate': 'Intermedio',
    'advanced': 'Avanzado'
  };
  
  // Mapeo de equipamiento a nombres legibles
  const equipmentOptions = {
    'bodyweight': 'Peso corporal',
    'dumbbell': 'Mancuernas',
    'barbell': 'Barra',
    'machine': 'Máquinas',
    'kettlebell': 'Kettlebell',
    'resistance_band': 'Bandas elásticas',
    'cable': 'Poleas',
    'suspension_trainer': 'TRX/Suspensión'
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <FaSpinner className="text-primary-500 text-3xl animate-spin mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Analizando el plan actual...</p>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información básica */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white">Información básica</h3>
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nombre del plan
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
          />
        </div>
      </div>
      
      {/* Opciones de transición */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white">Opciones de transición</h3>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="adjustWeights"
            name="adjustWeights"
            checked={formData.adjustWeights}
            onChange={handleChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="adjustWeights" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Ajustar pesos automáticamente
          </label>
          
          {analysis && (
            <div className="ml-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <FaInfoCircle className="mr-1" />
              Tasa de éxito global: {Math.round(analysis.globalSuccessRate)}%
            </div>
          )}
        </div>
        
        {formData.adjustWeights && (
          <div>
            <label htmlFor="weightAdjustmentFactor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Factor de ajuste de peso
            </label>
            <div className="flex items-center">
              <input
                type="range"
                id="weightAdjustmentFactor"
                name="weightAdjustmentFactor"
                min="0.8"
                max="1.2"
                step="0.01"
                value={formData.weightAdjustmentFactor}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[60px]">
                {(formData.weightAdjustmentFactor > 1 ? '+' : '') + Math.round((formData.weightAdjustmentFactor - 1) * 100) + '%'}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formData.weightAdjustmentFactor < 1 
                ? 'Reducir los pesos para mejorar la técnica y completar las series.' 
                : 'Aumentar los pesos para seguir progresando.'}
            </p>
          </div>
        )}
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="keepExercises"
            name="keepExercises"
            checked={formData.keepExercises}
            onChange={handleChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="keepExercises" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Mantener los mismos ejercicios
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="keepStructure"
            name="keepStructure"
            checked={formData.keepStructure}
            onChange={handleChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="keepStructure" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Mantener la misma estructura
          </label>
        </div>
      </div>
      
      {/* Parámetros del plan */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white">Parámetros del plan</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Duración (semanas)
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              min="1"
              max="16"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              required
            />
          </div>
          
          <div>
            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Frecuencia (días/semana)
            </label>
            <input
              type="number"
              id="frequency"
              name="frequency"
              min="1"
              max="7"
              value={formData.frequency}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              required
            />
          </div>
          
          <div>
            <label htmlFor="periodizationType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tipo de periodización
            </label>
            <select
              id="periodizationType"
              name="periodizationType"
              value={formData.periodizationType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              required
            >
              {Object.entries(periodizationTypes).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="splitType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tipo de división
            </label>
            <select
              id="splitType"
              name="splitType"
              value={formData.splitType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              required
            >
              {Object.entries(splitTypes).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="primaryGoal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Objetivo principal
            </label>
            <select
              id="primaryGoal"
              name="primaryGoal"
              value={formData.primaryGoal}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              required
            >
              {Object.entries(goals).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="secondaryGoal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Objetivo secundario
            </label>
            <select
              id="secondaryGoal"
              name="secondaryGoal"
              value={formData.secondaryGoal}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            >
              <option value="">Ninguno</option>
              {Object.entries(goals).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="difficultyLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nivel de dificultad
            </label>
            <select
              id="difficultyLevel"
              name="difficultyLevel"
              value={formData.difficultyLevel}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              required
            >
              {Object.entries(difficultyLevels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="equipment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Equipamiento disponible
            </label>
            <select
              id="equipment"
              name="equipment"
              multiple
              value={formData.equipment}
              onChange={handleMultiSelectChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              size="4"
              required
            >
              {Object.entries(equipmentOptions).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Mantén presionada la tecla Ctrl (o Cmd en Mac) para seleccionar múltiples opciones.
            </p>
          </div>
        </div>
      </div>
      
      {/* Botones de acción */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => onTransitionComplete && onTransitionComplete(null)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Cancelar
        </button>
        
        <button
          type="submit"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center"
        >
          <FaCheck className="mr-2" />
          Crear Plan de Transición
        </button>
      </div>
      
      {/* Análisis del plan */}
      {analysis && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
            <FaInfoCircle className="mr-2 text-primary-500" />
            Análisis del plan actual
          </h3>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tasa de éxito global: <span className="font-medium">{Math.round(analysis.globalSuccessRate)}%</span>
            </p>
            
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ajuste de peso recomendado: <span className="font-medium">{(analysis.globalWeightAdjustment > 1 ? '+' : '') + Math.round((analysis.globalWeightAdjustment - 1) * 100) + '%'}</span>
            </p>
            
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Periodización recomendada: <span className="font-medium">{periodizationTypes[analysis.suggestedPeriodizationType]}</span>
            </p>
            
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Frecuencia recomendada: <span className="font-medium">{analysis.suggestedFrequency} días/semana</span>
            </p>
          </div>
        </div>
      )}
    </form>
  );
};

export default PlanTransitionForm;
