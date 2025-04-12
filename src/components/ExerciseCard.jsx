import React, { useState, useEffect } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { FaPlus, FaDumbbell, FaStopwatch, FaWeight, FaArrowRight, FaInfoCircle, FaThumbsUp,
         FaExclamationTriangle, FaExclamationCircle, FaBolt, FaSkull, FaFireAlt, FaCheckCircle } from 'react-icons/fa';
import { IoWarning } from 'react-icons/io5';

const ExerciseCard = ({ exercise, dayId, showDetails = false }) => {
  const { updateExerciseProgress, getExerciseLogs } = useWorkout();
  const [isLogging, setIsLogging] = useState(false);
  const [isExpanded, setIsExpanded] = useState(showDetails);
  const [logData, setLogData] = useState({
    sets: [],
    notes: ''
  });
  const [feedback, setFeedback] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [unreasonableValues, setUnreasonableValues] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Normalizar la estructura de sets para manejar diferentes formatos de datos
  const normalizedSets = React.useMemo(() => {
    // Si sets es un array, usarlo directamente
    if (Array.isArray(exercise.sets)) {
      return exercise.sets;
    }

    // Si sets es un número, crear un array con ese número de elementos
    if (typeof exercise.sets === 'number') {
      const numSets = exercise.sets;
      const currentPhase = exercise.phase1 ? 1 : exercise.phase2 ? 2 : exercise.phase3 ? 3 : 1;
      const phaseData = exercise[`phase${currentPhase}`] || {};

      // Verificar si hay pesos específicos para cada serie
      const hasSpecificWeights = Array.isArray(phaseData.weights) || Array.isArray(exercise.weights);
      const weightsArray = hasSpecificWeights ?
        (phaseData.weights || exercise.weights || []) :
        [];

      return Array(numSets).fill().map((_, i) => {
        // Si hay un peso específico para esta serie, usarlo
        const seriesWeight = weightsArray[i] || phaseData.weight || exercise.weight || '-';

        return {
          reps: phaseData.reps || exercise.reps || '?',
          weight: seriesWeight
        };
      });
    }

    // Fallback: devolver un array con un elemento por defecto
    return [{ reps: exercise.reps || '?', weight: exercise.weight || '-' }];
  }, [exercise]);

  // Función para extraer el valor mínimo de un rango (ej: "12-15" -> 12)
  const getMinValue = (rangeStr) => {
    if (!rangeStr || typeof rangeStr !== 'string') return 0;

    // Si es un rango como "12-15"
    if (rangeStr.includes('-')) {
      const min = parseInt(rangeStr.split('-')[0]);
      return isNaN(min) ? 0 : min;
    }

    // Si es un valor único como "12"
    const value = parseInt(rangeStr);
    return isNaN(value) ? 0 : value;
  };

  // Función para extraer el valor numérico del peso (ej: "30-40 kg" -> 30)
  const getMinWeight = (weightStr) => {
    // Si es un número, devolverlo directamente
    if (typeof weightStr === 'number') return weightStr;

    // Si no es string ni número, devolver 0
    if (!weightStr) return 0;

    // Convertir a string si no lo es
    const strValue = weightStr.toString();

    // Eliminar "kg" y espacios (usando expresión regular para ser más robusto)
    const cleanStr = strValue.replace(/kg/gi, '').trim();

    // Mostrar para depuración
    console.log(`Procesando peso: '${weightStr}' -> '${cleanStr}'`);

    // Si es un rango como "30-40"
    if (cleanStr.includes('-')) {
      const min = parseFloat(cleanStr.split('-')[0]);
      return isNaN(min) ? 0 : min;
    }

    // Si es un valor único como "30"
    const value = parseFloat(cleanStr);
    return isNaN(value) ? 0 : value;
  };

  // Función para evaluar el porcentaje de cumplimiento
  const evaluatePerformance = (actual, planned) => {
    // Procesar el valor planificado
    let plannedNum;
    if (typeof planned === 'string') {
      // Si es string, usar getMinWeight para manejar formatos como "65 kg"
      plannedNum = getMinWeight(planned);
    } else {
      plannedNum = planned;
    }

    // Procesar el valor actual
    let actualNum;
    if (typeof actual === 'string') {
      // Si es string, usar getMinWeight para manejar formatos como "65 kg"
      actualNum = getMinWeight(actual);
    } else {
      actualNum = actual;
    }

    // Validaciones
    if (!plannedNum || plannedNum <= 0) return 100; // Si no hay valor planificado, considerar como 100%
    if (!actualNum || isNaN(actualNum)) return 0; // Si no hay valor real, considerar como 0%
    if (isNaN(plannedNum)) return 0;

    // Cálculo del porcentaje
    const percentage = (actualNum / plannedNum) * 100;
    console.log(`EVALUACIÓN MEJORADA: ${actualNum} / ${plannedNum} = ${percentage.toFixed(1)}%`);
    return percentage;
  };

  // Función para obtener la clase de color según el porcentaje
  // Esta función ya no se usa, aplicamos los estilos directamente

  // Verificar si el ejercicio ya tiene valores registrados
  const hasActualValues = exercise.actualSets && exercise.actualSets.length > 0;

  // Cargar feedback existente si hay valores registrados
  useEffect(() => {
    if (hasActualValues && exercise.actualSets[0]?.feedback) {
      setFeedback(exercise.actualSets[0].feedback);
    }
  }, [hasActualValues, exercise.actualSets]);

  // Calcular el progreso del ejercicio
  const progress = exercise.progress || 0;

  // Determinar el color del indicador de progreso
  const getProgressColor = () => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 80) return 'bg-yellow-500';
    if (progress > 0) return 'bg-red-500';
    return 'bg-gray-300';
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formatear duración
  const formatDuration = (seconds) => {
    if (!seconds) return '0 min';

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes === 0) {
      return `${remainingSeconds} seg`;
    } else if (remainingSeconds === 0) {
      return `${minutes} min`;
    } else {
      return `${minutes} min ${remainingSeconds} seg`;
    }
  };

  // Obtener los registros históricos del ejercicio
  const exerciseLogs = getExerciseLogs(exercise.id);

  // Inicializar los sets cuando se abre el formulario de registro
  const handleStartLogging = () => {
    // Crear sets iniciales basados en los sets planificados normalizados
    const initialSets = normalizedSets.map(() => ({
      reps: '',
      weight: ''
    }));

    // Registrar la hora de inicio del ejercicio
    setStartTime(new Date());

    setLogData({ sets: initialSets, notes: '' });
    setIsLogging(true);
  };

  // Actualizar los datos de un set específico con validación en tiempo real
  const handleSetChange = (index, field, value) => {
    // Validar el valor ingresado
    const validation = validateInputValue(value, field, index);

    // Si el valor excede los límites absolutos, no permitir la entrada
    if (validation && validation.isValid === false && validation.severity === 'high') {
      // Mostrar alerta y no actualizar el valor
      alert(validation.message);
      return;
    }

    // Actualizar el valor
    const newSets = [...logData.sets];
    newSets[index] = { ...newSets[index], [field]: value };
    setLogData({ ...logData, sets: newSets });

    // Generar feedback preliminar basado en los valores actuales
    updateLivePerformance();
  };

  // Función para actualizar el rendimiento en tiempo real
  const updateLivePerformance = () => {
    let totalRepsPercentage = 0;
    let totalWeightPercentage = 0;
    let setCount = 0;

    logData.sets.forEach((set, index) => {
      if (index < normalizedSets.length) {
        const plannedSet = normalizedSets[index];
        const plannedReps = getMinValue(plannedSet.reps);
        const plannedWeight = getMinWeight(plannedSet.weight);

        const actualReps = set.reps ? parseInt(set.reps) : 0;
        const actualWeight = set.weight ? parseFloat(set.weight) : 0;

        if (plannedReps > 0 && actualReps > 0) {
          totalRepsPercentage += evaluatePerformance(actualReps, plannedReps);
          setCount++;
        }

        if (plannedWeight > 0 && actualWeight > 0) {
          totalWeightPercentage += evaluatePerformance(actualWeight, plannedWeight);
          setCount++;
        }
      }
    });

    const avgRepsPercentage = setCount > 0 ? totalRepsPercentage / setCount : 0;
    const avgWeightPercentage = setCount > 0 ? totalWeightPercentage / setCount : 0;
    const overallPerformance = (avgRepsPercentage + avgWeightPercentage) / 2;

    let feedbackMessage = '';

    if (overallPerformance >= 100) {
      feedbackMessage = '¡Excelente trabajo! Has superado o igualado todos los objetivos planificados. Considera aumentar el peso en la próxima sesión.';
    } else if (overallPerformance >= 85) {
      feedbackMessage = 'Buen trabajo. Estás cerca de alcanzar todos tus objetivos. Mantén la consistencia y pronto podrás superarlos.';
    } else if (overallPerformance > 0) {
      feedbackMessage = 'Has completado el ejercicio, pero hay margen de mejora. Asegúrate de descansar adecuadamente y mantener buena técnica.';
    }

    // Actualizar el feedback en tiempo real
    if (feedbackMessage) {
      setFeedback(feedbackMessage);
    }
  };

  // Criterios de razonabilidad para pesos y repeticiones
  const reasonabilityCriteria = {
    // Límites absolutos para prevenir valores absurdos
    absoluteLimits: {
      maxReps: 100,  // Límite absoluto de repeticiones (muy pocas personas superan 100 reps)
      maxWeight: 500 // Límite absoluto de peso en kg (récords mundiales están por debajo de 500kg)
    },
    // Pesos máximos razonables por ejercicio específico (en kg) para un hombre promedio
    maxWeightsByExercise: {
      // Ejercicios de piernas
      'Prensa de piernas': 300,     // Máquina con ventaja mecánica
      'Sentadilla': 180,            // Ejercicio compuesto pesado
      'Extensión de piernas': 120,  // Máquina aislada para cuádriceps
      'Curl de piernas': 100,       // Máquina aislada para isquiotibiales
      'Peso muerto': 200,           // Ejercicio compuesto muy pesado
      'Sentadilla Goblet': 50,      // Variante con mancuerna
      'Zancadas': 80,               // Con mancuernas o barra

      // Ejercicios de pecho
      'Press de banca': 150,        // Ejercicio compuesto para pecho
      'Press inclinado': 130,       // Variante inclinada
      'Press declinado': 140,       // Variante declinada
      'Aperturas': 60,              // Con mancuernas, aislamiento
      'Fondos': 50,                 // Con peso adicional
      'Pullover': 40,               // Con mancuerna

      // Ejercicios de espalda
      'Remo': 120,                  // Remo con barra
      'Dominadas': 50,              // Con peso adicional
      'Jalones al pecho': 100,      // En polea alta
      'Remo en máquina': 120,       // En máquina
      'Remo con mancuerna': 50,     // Unilateral

      // Ejercicios de hombros
      'Press militar': 80,          // Press de hombros con barra
      'Elevaciones laterales': 25,  // Aislamiento para deltoides
      'Pájaro': 30,                 // Para deltoides posterior
      'Press Arnold': 35,           // Con mancuernas

      // Ejercicios de bíceps
      'Curl de bíceps': 30,         // Con barra
      'Curl martillo': 25,          // Con mancuernas
      'Curl concentrado': 20,       // Aislamiento
      'Curl predicador': 35,        // En banco predicador

      // Ejercicios de tríceps
      'Press francés': 35,          // Con barra o mancuernas
      'Extensiones': 40,            // En polea
      'Fondos para tríceps': 50,    // Con peso adicional
      'Patada de tríceps': 20,      // Con mancuerna

      // Ejercicios de core
      'Abdominales': 30,            // Con peso adicional
      'Plancha': 40,                // Con peso adicional
      'Russian twist': 25,          // Con peso
      'Elevación de piernas': 20,   // Con peso adicional
    },

    // Pesos máximos razonables por categoría de ejercicio (en kg)
    maxWeights: {
      'Piernas': 200,  // Sentadillas, peso muerto, etc.
      'Pecho': 120,    // Press de banca, etc.
      'Espalda': 120,  // Remo, dominadas, etc.
      'Hombros': 70,   // Press militar, elevaciones laterales, etc.
      'Bíceps': 40,    // Curl de bíceps, etc.
      'Tríceps': 40,    // Press francés, extensiones, etc.
      'Core': 30,      // Abdominales, etc.
      'default': 80    // Valor por defecto para otras categorías
    },

    // Repeticiones máximas razonables por tipo de entrenamiento
    maxRepsByTrainingType: {
      'Fuerza': 8,           // Entrenamiento de fuerza pura (1-8 reps)
      'Hipertrofia': 15,     // Entrenamiento para aumento muscular (8-15 reps)
      'Resistencia': 30,     // Entrenamiento de resistencia muscular (15-30 reps)
      'Cardio': 50,          // Entrenamiento cardiovascular con pesos (30+ reps)
      'default': 30          // Valor por defecto
    },

    // Repeticiones máximas razonables general
    maxReps: 30,

    // Combinaciones sospechosas (muchas repeticiones con peso alto)
    suspiciousCombinations: {
      'Piernas': { reps: 12, weight: 120 },  // Más de 12 reps con más de 120kg
      'Pecho': { reps: 12, weight: 70 },     // Más de 12 reps con más de 70kg
      'Espalda': { reps: 12, weight: 70 },   // Más de 12 reps con más de 70kg
      'Hombros': { reps: 12, weight: 35 },   // Más de 12 reps con más de 35kg
      'Bíceps': { reps: 12, weight: 25 },    // Más de 12 reps con más de 25kg
      'Tríceps': { reps: 12, weight: 25 },   // Más de 12 reps con más de 25kg
      'Core': { reps: 20, weight: 20 },      // Más de 20 reps con más de 20kg
      'default': { reps: 15, weight: 40 }    // Valor por defecto
    },

    // Límite para truncar porcentajes en la visualización
    maxDisplayPercentage: 300 // Porcentaje máximo a mostrar antes de truncar
  };

  // Validar si los valores son razonables
  const validateReasonableValues = (sets) => {
    const unreasonable = [];
    const category = exercise.category || 'default';
    const exerciseName = exercise.name || '';

    // Determinar el límite de peso basado en el ejercicio específico o la categoría
    let maxWeight;
    if (reasonabilityCriteria.maxWeightsByExercise[exerciseName]) {
      maxWeight = reasonabilityCriteria.maxWeightsByExercise[exerciseName];
    } else {
      maxWeight = reasonabilityCriteria.maxWeights[category] || reasonabilityCriteria.maxWeights.default;
    }

    const maxReps = reasonabilityCriteria.maxReps;
    const suspiciousCombination = reasonabilityCriteria.suspiciousCombinations[category] ||
                                reasonabilityCriteria.suspiciousCombinations.default;

    sets.forEach((set, index) => {
      const reps = set.reps ? parseInt(set.reps) : 0;
      const weight = set.weight ? parseFloat(set.weight) : 0;

      // Verificar valores absurdos (por encima de los límites absolutos)
      if (reps > reasonabilityCriteria.absoluteLimits.maxReps) {
        unreasonable.push({
          type: 'absurd_reps',
          setIndex: index,
          value: reps,
          message: `${reps} repeticiones en la serie ${index + 1} excede el límite máximo permitido (${reasonabilityCriteria.absoluteLimits.maxReps}).`,
          severity: 'high'
        });
      }

      if (weight > reasonabilityCriteria.absoluteLimits.maxWeight) {
        unreasonable.push({
          type: 'absurd_weight',
          setIndex: index,
          value: weight,
          message: `${weight}kg en la serie ${index + 1} excede el límite máximo permitido (${reasonabilityCriteria.absoluteLimits.maxWeight}kg).`,
          severity: 'high'
        });
      }

      // Verificar peso excesivo pero dentro de límites absolutos
      else if (weight > maxWeight) {
        let message;
        if (reasonabilityCriteria.maxWeightsByExercise[exerciseName]) {
          message = `El peso de ${weight}kg en la serie ${index + 1} parece muy alto para ${exerciseName}. El límite recomendado es ${maxWeight}kg.`;
        } else {
          message = `El peso de ${weight}kg en la serie ${index + 1} parece muy alto para un ejercicio de ${category}. El límite recomendado es ${maxWeight}kg.`;
        }

        unreasonable.push({
          type: 'weight',
          setIndex: index,
          value: weight,
          message: message,
          severity: 'medium'
        });
      }

      // Verificar repeticiones excesivas pero dentro de límites absolutos
      if (reps <= reasonabilityCriteria.absoluteLimits.maxReps && reps > maxReps) {
        unreasonable.push({
          type: 'reps',
          setIndex: index,
          value: reps,
          message: `${reps} repeticiones en la serie ${index + 1} parece un número muy alto. El límite recomendado es ${maxReps} repeticiones.`,
          severity: 'medium'
        });
      }

      // Verificar combinaciones sospechosas
      if (reps > suspiciousCombination.reps && weight > suspiciousCombination.weight) {
        unreasonable.push({
          type: 'combination',
          setIndex: index,
          value: { reps, weight },
          message: `${reps} repeticiones con ${weight}kg en la serie ${index + 1} es una combinación inusualmente alta. Lo normal sería máximo ${suspiciousCombination.reps} repeticiones con ese peso.`,
          severity: 'medium'
        });
      }
    });

    return unreasonable;
  };

  // Función para validar en tiempo real mientras el usuario escribe
  const validateInputValue = (value, type) => {
    const category = exercise.category || 'default';
    const exerciseName = exercise.name || '';

    if (type === 'reps') {
      const reps = parseInt(value);
      if (isNaN(reps)) return null; // No es un número válido

      // Verificar límites absolutos
      if (reps > reasonabilityCriteria.absoluteLimits.maxReps) {
        return {
          isValid: false,
          message: `Máximo ${reasonabilityCriteria.absoluteLimits.maxReps} repeticiones permitidas`,
          severity: 'high'
        };
      }

      // Verificar límites razonables
      if (reps > reasonabilityCriteria.maxReps) {
        return {
          isValid: true, // Permitido pero con advertencia
          message: `${reps} repeticiones parece muy alto para un ejercicio normal`,
          severity: 'medium'
        };
      }
    }

    if (type === 'weight') {
      const weight = parseFloat(value);
      if (isNaN(weight)) return null; // No es un número válido

      // Verificar límites absolutos
      if (weight > reasonabilityCriteria.absoluteLimits.maxWeight) {
        return {
          isValid: false,
          message: `Máximo ${reasonabilityCriteria.absoluteLimits.maxWeight}kg permitidos`,
          severity: 'high'
        };
      }

      // Determinar el límite de peso basado en el ejercicio específico o la categoría
      let maxWeight;
      if (reasonabilityCriteria.maxWeightsByExercise[exerciseName]) {
        maxWeight = reasonabilityCriteria.maxWeightsByExercise[exerciseName];

        // Verificar límites razonables por ejercicio específico
        if (weight > maxWeight) {
          return {
            isValid: true, // Permitido pero con advertencia
            message: `${weight}kg parece muy alto para ${exerciseName}. El límite recomendado es ${maxWeight}kg.`,
            severity: 'medium'
          };
        }
      } else {
        // Usar categoría si no hay ejercicio específico
        maxWeight = reasonabilityCriteria.maxWeights[category] || reasonabilityCriteria.maxWeights.default;

        // Verificar límites razonables por categoría
        if (weight > maxWeight) {
          return {
            isValid: true, // Permitido pero con advertencia
            message: `${weight}kg parece muy alto para un ejercicio de ${category}. El límite recomendado es ${maxWeight}kg.`,
            severity: 'medium'
          };
        }
      }
    }

    return { isValid: true }; // Valor válido sin advertencias
  };

  // Guardar el registro de entrenamiento
  const handleSaveLog = () => {
    // Validar que al menos un set tenga datos
    const hasData = logData.sets.some(set => set.reps || set.weight);
    if (!hasData) {
      alert('Por favor, ingresa al menos un valor de repeticiones o peso');
      return;
    }

    // Convertir valores de texto a números para validación
    const setsToValidate = logData.sets.map(set => ({
      reps: set.reps ? parseInt(set.reps) : 0,
      weight: set.weight ? parseFloat(set.weight) : 0
    }));

    // Validar valores razonables
    const unreasonable = validateReasonableValues(setsToValidate);

    if (unreasonable.length > 0 && !showConfirmation) {
      // Mostrar advertencia y pedir confirmación
      setUnreasonableValues(unreasonable);
      setShowConfirmation(true);
      return;
    }

    // Si el usuario confirmó o no hay valores irrazonables, continuar con el guardado
    setShowConfirmation(false);
    setUnreasonableValues([]);

    // Procesar los sets para guardar
    const processedSets = logData.sets.map(set => ({
      reps: set.reps ? parseInt(set.reps) : 0,
      weight: set.weight ? parseFloat(set.weight) : 0
    }));

    // Generar feedback basado en el rendimiento
    let totalRepsPercentage = 0;
    let totalWeightPercentage = 0;
    let setCount = 0;

    processedSets.forEach((set, index) => {
      if (index < normalizedSets.length) {
        const plannedSet = normalizedSets[index];
        const plannedReps = getMinValue(plannedSet.reps);
        const plannedWeight = getMinWeight(plannedSet.weight);

        if (plannedReps > 0 && set.reps > 0) {
          totalRepsPercentage += evaluatePerformance(set.reps, plannedReps);
          setCount++;
        }

        if (plannedWeight > 0 && set.weight > 0) {
          totalWeightPercentage += evaluatePerformance(set.weight, plannedWeight);
        }
      }
    });

    const avgRepsPercentage = setCount > 0 ? totalRepsPercentage / setCount : 0;
    const avgWeightPercentage = setCount > 0 ? totalWeightPercentage / setCount : 0;
    const overallPerformance = (avgRepsPercentage + avgWeightPercentage) / 2;

    let feedbackMessage = '';

    if (overallPerformance >= 100) {
      feedbackMessage = '¡Excelente trabajo! Has superado o igualado todos los objetivos planificados. Considera aumentar el peso en la próxima sesión.';
    } else if (overallPerformance >= 85) {
      feedbackMessage = 'Buen trabajo. Estás cerca de alcanzar todos tus objetivos. Mantén la consistencia y pronto podrás superarlos.';
    } else {
      feedbackMessage = 'Has completado el ejercicio, pero hay margen de mejora. Asegúrate de descansar adecuadamente y mantener buena técnica.';
    }

    // Guardar el feedback
    setFeedback(feedbackMessage);

    // Registrar la hora de finalización
    const endTime = new Date();

    // Calcular la duración del ejercicio
    const duration = startTime ? Math.floor((endTime - startTime) / 1000) : 0; // duración en segundos

    // Actualizar el progreso del ejercicio con el feedback y tiempos
    const updatedSets = processedSets.map(set => ({
      ...set,
      feedback: feedbackMessage
    }));

    // Crear el log con información de tiempo
    const exerciseLog = {
      exerciseId: exercise.id,
      dayId: dayId,
      actualSets: updatedSets,
      notes: logData.notes,
      startTime: startTime ? startTime.toISOString() : null,
      endTime: endTime.toISOString(),
      duration: duration, // duración en segundos
      feedback: feedbackMessage
    };

    // Actualizar el progreso y guardar el log
    updateExerciseProgress(exercise.id, updatedSets, exerciseLog);

    setIsLogging(false);
    setIsExpanded(true); // Mantener expandido para mostrar el feedback
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 mb-5 border border-gray-100 transition-all hover:shadow-lg relative overflow-hidden">
      {/* Indicador de progreso */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${getProgressColor()}`}></div>

      <div className="flex justify-between items-start">
        <div
          className="flex-1 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h3 className="text-lg font-bold text-gray-800">{exercise.name}</h3>

          <div className="mt-2 space-y-1">
            <div className="flex items-center text-sm text-gray-600">
              <FaDumbbell className="mr-2 text-primary-500" />
              <span>
                {Array.isArray(exercise.sets) ? exercise.sets.length : exercise.sets || 1} series x {normalizedSets[0]?.reps || '?'} reps
              </span>
            </div>

            {normalizedSets[0]?.weight && normalizedSets[0].weight !== '-' && (
              <div className="flex items-center text-sm text-gray-600">
                <FaWeight className="mr-2 text-primary-500" />
                <span>Peso: {normalizedSets[0].weight} kg</span>
              </div>
            )}

            {exercise.rest && (
              <div className="flex items-center text-sm text-gray-600">
                <FaStopwatch className="mr-2 text-primary-500" />
                <span>Descanso: {exercise.rest}</span>
              </div>
            )}
          </div>

          {/* Indicador de progreso */}
          {progress > 0 && (
            <div className="mt-3 flex items-center">
              <div className="flex-1 bg-gray-200 rounded-full h-1.5 mr-2">
                <div
                  className={`h-1.5 rounded-full ${getProgressColor()}`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium text-gray-500">{progress}%</span>
            </div>
          )}
        </div>

        {!isLogging ? (
          <button
            onClick={handleStartLogging}
            className="bg-primary-600 text-white p-2.5 rounded-full shadow-md hover:bg-primary-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
            aria-label="Registrar ejercicio"
          >
            <FaPlus size={16} />
          </button>
        ) : null}
      </div>

      {/* Detalles expandidos */}
      {isExpanded && !isLogging && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {/* Valores planificados */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Valores planificados:</h4>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="font-medium text-gray-500">Serie</div>
                <div className="font-medium text-gray-500">Reps</div>
                <div className="font-medium text-gray-500">Peso (kg)</div>

                {normalizedSets.map((set, index) => (
                  <React.Fragment key={`planned-${index}`}>
                    <div className="text-gray-800">{index + 1}</div>
                    <div className="text-gray-800">{set.reps}</div>
                    <div className="text-gray-800">{set.weight || '-'}</div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Valores reales (si existen) */}
          {hasActualValues && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Valores realizados:</h4>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="font-medium text-gray-500">Serie</div>
                  <div className="font-medium text-gray-500">Reps</div>
                  <div className="font-medium text-gray-500">Peso (kg)</div>

                  {exercise.actualSets.map((set, index) => {
                    // Obtener valores planificados para esta serie
                    const plannedSet = index < normalizedSets.length ? normalizedSets[index] : null;

                    // REPETICIONES - Extraer y convertir valores
                    const plannedReps = plannedSet ? getMinValue(plannedSet.reps) : 0;
                    const actualReps = typeof set.reps === 'string' ? parseInt(set.reps) : (set.reps || 0);

                    // PESOS - Extraer y convertir valores
                    const plannedWeight = plannedSet ? getMinWeight(plannedSet.weight) : 0;
                    const actualWeight = typeof set.weight === 'string' ? parseFloat(set.weight) : (set.weight || 0);

                    // Calcular porcentajes manualmente para mayor control
                    let repsPercentage = 0;
                    if (plannedReps > 0 && actualReps > 0) {
                      repsPercentage = (actualReps / plannedReps) * 100;
                    } else if (plannedReps <= 0) {
                      repsPercentage = 100; // Si no hay valor planificado, considerar como 100%
                    }

                    let weightPercentage = 0;
                    if (plannedWeight > 0 && actualWeight > 0) {
                      weightPercentage = (actualWeight / plannedWeight) * 100;
                    } else if (plannedWeight <= 0) {
                      weightPercentage = 100; // Si no hay valor planificado, considerar como 100%
                    }

                    // Mostrar porcentajes en consola para depuración
                    console.log(`Serie ${index+1} - Reps: ${actualReps}/${plannedReps} = ${repsPercentage.toFixed(0)}%, Peso: ${actualWeight}/${plannedWeight} = ${weightPercentage.toFixed(0)}%`);

                    // Determinar clases de color directamente
                    let repsColorClass = '';
                    if (repsPercentage >= 100) repsColorClass = 'bg-green-100 text-green-800';
                    else if (repsPercentage >= 85) repsColorClass = 'bg-yellow-100 text-yellow-800';
                    else if (repsPercentage > 0) repsColorClass = 'bg-red-100 text-red-800';
                    else repsColorClass = 'bg-gray-100 text-gray-800';

                    // Nota: Ya no necesitamos weightColorClass porque aplicamos los estilos directamente

                    return (
                      <React.Fragment key={`actual-${index}`}>
                        <div className="text-gray-800">{index + 1}</div>
                        <div className={`rounded-md px-2 py-1 ${repsColorClass}`}>
                          {set.reps || '-'}
                          {plannedReps > 0 && actualReps > 0 && (
                            <span className="text-xs block">
                              {repsPercentage > reasonabilityCriteria.maxDisplayPercentage
                                ? `>${reasonabilityCriteria.maxDisplayPercentage}%`
                                : `${repsPercentage.toFixed(0)}%`}
                            </span>
                          )}
                        </div>
                        {/* PESO: Aplicamos colores directamente sin IIFE */}
                        <div
                          className={`rounded-md px-2 py-1 ${
                            actualWeight > 0 ? (
                              weightPercentage >= 100 ? 'bg-green-100 text-green-800' :
                              weightPercentage >= 85 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            ) : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {set.weight || '-'}
                          {plannedWeight > 0 && actualWeight > 0 && (
                            <span className="text-xs block">
                              {weightPercentage > reasonabilityCriteria.maxDisplayPercentage
                                ? `>${reasonabilityCriteria.maxDisplayPercentage}%`
                                : `${weightPercentage.toFixed(0)}%`}
                            </span>
                          )}
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Feedback basado en el rendimiento */}
          {hasActualValues && feedback && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-start">
                <FaThumbsUp className="text-blue-500 mt-1 mr-2" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Feedback:</h4>
                  <p className="text-sm text-gray-600">{feedback}</p>
                </div>
              </div>
            </div>
          )}

          {/* Historial de registros */}
          {exerciseLogs && exerciseLogs.length > 0 && (
            <div className="mb-2">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Historial reciente:</h4>
              <div className="space-y-2">
                {exerciseLogs.slice(0, 3).map((log, index) => (
                  <div key={`log-${index}`} className="bg-gray-50 rounded-lg p-3 text-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-500">{formatDate(log.date)}</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        {log.sets?.length || 0} series
                      </span>
                    </div>

                    {/* Mostrar duración del ejercicio */}
                    {log.duration && (
                      <div className="text-xs text-gray-600 mb-2 flex items-center">
                        <FaStopwatch className="mr-1 text-primary-500" />
                        <span>Duración: {formatDuration(log.duration)}</span>
                      </div>
                    )}

                    {log.sets && log.sets.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <div className="font-medium text-gray-500">Serie</div>
                        <div className="font-medium text-gray-500">Reps</div>
                        <div className="font-medium text-gray-500">Peso</div>

                        {log.sets.map((set, setIndex) => (
                          <React.Fragment key={`log-${index}-set-${setIndex}`}>
                            <div className="text-gray-800">{setIndex + 1}</div>
                            <div className="text-gray-800">{set.reps || '-'}</div>
                            <div className="text-gray-800">{set.weight || '-'}</div>
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {exerciseLogs.length > 3 && (
                  <div className="text-center">
                    <button className="text-primary-600 text-sm font-medium flex items-center justify-center mx-auto">
                      Ver más <FaArrowRight className="ml-1" size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Descripción del ejercicio */}
          {exercise.description && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Descripción:</h4>
              <p className="text-sm text-gray-600">{exercise.description}</p>
            </div>
          )}
        </div>
      )}

      {/* Formulario de registro */}
      {isLogging && (
        <div className="mt-5 border-t border-gray-100 pt-5">
          <div className="flex items-center mb-4">
            <FaInfoCircle className="text-primary-500 mr-2" />
            <p className="text-sm text-gray-600">
              Registra los valores reales que has realizado en cada serie.
            </p>
          </div>

          <div className="space-y-3">
            {logData.sets.map((set, index) => (
              <div key={index} className="flex gap-3 items-center">
                <div className="w-10 h-10 flex items-center justify-center bg-primary-100 text-primary-800 font-bold rounded-lg">
                  {index + 1}
                </div>
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Repeticiones</label>
                    {/* Obtener valores planificados y calcular porcentaje */}
                    {(() => {
                      const plannedSet = index < normalizedSets.length ? normalizedSets[index] : null;
                      const plannedReps = plannedSet ? getMinValue(plannedSet.reps) : 0;
                      const actualReps = typeof set.reps === 'string' ? parseInt(set.reps) : (set.reps || 0);

                      // Calcular porcentaje directamente
                      let repsPercentage = 0;
                      if (plannedReps > 0 && actualReps > 0) {
                        repsPercentage = (actualReps / plannedReps) * 100;
                      } else if (plannedReps <= 0) {
                        repsPercentage = 100;
                      }

                      // Determinar clase de color directamente
                      let repsColorClass = '';
                      if (actualReps > 0) {
                        if (repsPercentage >= 100) repsColorClass = 'bg-green-100 text-green-800';
                        else if (repsPercentage >= 85) repsColorClass = 'bg-yellow-100 text-yellow-800';
                        else repsColorClass = 'bg-red-100 text-red-800';
                      }

                      // Función para manejar el evento onBlur
                      const handleRepsBlur = (e) => {
                        const validation = validateInputValue(e.target.value, 'reps');
                        if (validation && validation.severity === 'medium') {
                          // Mostrar advertencia pero permitir el valor
                          // Usar el mismo enfoque de alerta personalizada que en handleWeightBlur
                          if (confirm(`⚠️ ADVERTENCIA ⚠️\n\n${validation.message}\n\n¿Estás seguro de que este valor es correcto?`)) {
                            // Usuario confirmó, mantener el valor
                          } else {
                            // Usuario canceló, limpiar el valor
                            const newSets = [...logData.sets];
                            newSets[index] = { ...newSets[index], reps: '' };
                            setLogData({ ...logData, sets: newSets });
                          }
                        }
                      };

                      return (
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="numeric"
                            min="0"
                            max={reasonabilityCriteria.absoluteLimits.maxReps}
                            placeholder={normalizedSets[index]?.reps || 'Reps'}
                            value={set.reps}
                            onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
                            onBlur={handleRepsBlur}
                            className={`w-full border ${actualReps > 0 ? repsColorClass : 'border-gray-300'} rounded-lg p-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all`}
                          />
                          {actualReps > 0 && plannedReps > 0 && (
                            <span className="absolute right-2 top-2 text-xs font-medium">
                              {repsPercentage > reasonabilityCriteria.maxDisplayPercentage
                                ? `>${reasonabilityCriteria.maxDisplayPercentage}%`
                                : `${repsPercentage.toFixed(0)}%`}
                            </span>
                          )}
                        </div>
                      );
                    })()} {/* Fin del input de repeticiones */}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Peso (kg)</label>
                    {/* Obtener valores planificados y calcular porcentaje */}
                    {(() => {
                      const plannedSet = index < normalizedSets.length ? normalizedSets[index] : null;
                      const plannedWeight = plannedSet ? getMinWeight(plannedSet.weight) : 0;
                      const actualWeight = typeof set.weight === 'string' ? parseFloat(set.weight) : (set.weight || 0);

                      // Calcular porcentaje directamente
                      let weightPercentage = 0;
                      if (plannedWeight > 0 && actualWeight > 0) {
                        weightPercentage = (actualWeight / plannedWeight) * 100;
                      } else if (plannedWeight <= 0) {
                        weightPercentage = 100;
                      }

                      // Determinar el color basado en el porcentaje - Simplificado
                      let colorClass = '';

                      if (actualWeight > 0) {
                        if (weightPercentage >= 100) {
                          colorClass = 'bg-green-100 text-green-800';
                        } else if (weightPercentage >= 85) {
                          colorClass = 'bg-yellow-100 text-yellow-800';
                        } else {
                          colorClass = 'bg-red-100 text-red-800';
                        }
                      }

                      // Mostrar información de depuración detallada
                      console.log(`INPUT PESO - Serie ${index+1}: ${actualWeight}/${plannedWeight} = ${weightPercentage.toFixed(1)}%, Color: ${colorClass}`);

                      // Función para manejar el evento onBlur
                      const handleWeightBlur = (e) => {
                        const validation = validateInputValue(e.target.value, 'weight');
                        if (validation && validation.severity === 'medium') {
                          // Mostrar advertencia pero permitir el valor
                          // Crear un elemento de alerta personalizado con animaciones
                          const alertContainer = document.createElement('div');
                          alertContainer.className = 'fixed inset-0 flex items-center justify-center z-50 animate-fade-in';
                          alertContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';

                          const alertContent = document.createElement('div');
                          alertContent.className = 'bg-white rounded-lg shadow-xl p-6 max-w-md mx-auto border-l-4 border-yellow-500 animate-slide-up';

                          const alertHeader = document.createElement('div');
                          alertHeader.className = 'flex items-center mb-4';
                          alertHeader.innerHTML = `<div class="bg-yellow-100 p-2 rounded-full mr-3 animate-pulse-attention"><svg class="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg></div><h3 class="text-lg font-bold text-yellow-800">⚠️ Advertencia</h3>`;

                          const alertMessage = document.createElement('p');
                          alertMessage.className = 'text-gray-700 mb-6';
                          alertMessage.textContent = validation.message;

                          const alertActions = document.createElement('div');
                          alertActions.className = 'flex justify-end space-x-3';

                          const cancelBtn = document.createElement('button');
                          cancelBtn.className = 'px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all hover-scale';
                          cancelBtn.textContent = 'Cancelar';
                          cancelBtn.onclick = () => {
                            // Limpiar el valor
                            const newSets = [...logData.sets];
                            newSets[index] = { ...newSets[index], [type === 'reps' ? 'reps' : 'weight']: '' };
                            setLogData({ ...logData, sets: newSets });
                            document.body.removeChild(alertContainer);
                          };

                          const confirmBtn = document.createElement('button');
                          confirmBtn.className = 'px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all hover-scale';
                          confirmBtn.textContent = 'Confirmar';
                          confirmBtn.onclick = () => {
                            // Mantener el valor
                            document.body.removeChild(alertContainer);
                          };

                          alertActions.appendChild(cancelBtn);
                          alertActions.appendChild(confirmBtn);

                          alertContent.appendChild(alertHeader);
                          alertContent.appendChild(alertMessage);
                          alertContent.appendChild(alertActions);
                          alertContainer.appendChild(alertContent);

                          document.body.appendChild(alertContainer);

                          // Configurar los manejadores de eventos para los botones
                          confirmBtn.onclick = () => {
                            document.body.removeChild(alertContainer);
                            // Mantener el valor (no hacer nada)
                          };

                          cancelBtn.onclick = () => {
                            document.body.removeChild(alertContainer);
                            // Limpiar el valor
                            const newSets = [...logData.sets];
                            newSets[index] = { ...newSets[index], weight: '' };
                            setLogData({ ...logData, sets: newSets });
                          };

                          // Usar un enfoque más simple por ahora debido a las limitaciones
                          if (confirm(`⚠️ ADVERTENCIA ⚠️\n\n${validation.message}\n\n¿Estás seguro de que este valor es correcto?`)) {
                            // Usuario confirmó, mantener el valor
                          } else {
                            // Usuario canceló, limpiar el valor
                            const newSets = [...logData.sets];
                            newSets[index] = { ...newSets[index], weight: '' };
                            setLogData({ ...logData, sets: newSets });
                          }
                        }
                      };

                      return (
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            min="0"
                            max={reasonabilityCriteria.absoluteLimits.maxWeight}
                            step="0.5"
                            placeholder={normalizedSets[index]?.weight || 'Peso'}
                            value={set.weight}
                            onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
                            id={`weight-input-${index}`}
                            onBlur={handleWeightBlur}
                            className={`w-full border ${actualWeight > 0 ? `${colorClass} border-0` : 'border-gray-300'} rounded-lg p-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all`}
                          />
                          {actualWeight > 0 && plannedWeight > 0 && (
                            <span className="absolute right-2 top-2 text-xs font-medium">
                              {weightPercentage > reasonabilityCriteria.maxDisplayPercentage
                                ? `>${reasonabilityCriteria.maxDisplayPercentage}%`
                                : `${weightPercentage.toFixed(0)}%`}
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 mb-4">
            <label className="text-xs text-gray-500 mb-1 block">Notas (opcional)</label>
            <textarea
              placeholder="Ej: Aumentar peso en la próxima sesión"
              value={logData.notes}
              onChange={(e) => setLogData({ ...logData, notes: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              rows="2"
            ></textarea>
          </div>

          {/* Feedback en tiempo real */}
          {feedback && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-start">
                <FaThumbsUp className="text-blue-500 mt-1 mr-2" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Feedback preliminar:</h4>
                  <p className="text-sm text-gray-600">{feedback}</p>
                </div>
              </div>
            </div>
          )}

          {/* Confirmación para valores irrazonables - Diseño mejorado con animaciones */}
          {showConfirmation && unreasonableValues.length > 0 && (
            <div className="mt-6 mb-4 overflow-hidden rounded-xl shadow-md border-l-4 border-yellow-500 bg-gradient-to-r from-yellow-50 to-white animate-slide-up animate-highlight-pulse transition-all-300">
              {/* Encabezado con animación */}
              <div className="px-4 py-3 bg-yellow-100 flex items-center animate-slide-down" style={{animationDelay: '0.1s'}}>
                <div className="mr-3 flex-shrink-0 bg-yellow-200 p-2 rounded-full animate-pulse-attention">
                  <IoWarning className="text-yellow-600 text-xl" />
                </div>
                <h4 className="font-bold text-yellow-800">Advertencia: Valores inusuales detectados</h4>
              </div>

              {/* Contenido */}
              <div className="p-4 animate-fade-in" style={{animationDelay: '0.2s'}}>
                <ul className="space-y-3 transition-all-300">
                  {unreasonableValues.map((item, index) => {
                    // Determinar el icono y estilo basado en el tipo y severidad
                    let icon, bgColor, textColor, borderColor, title;

                    if (item.severity === 'high') {
                      bgColor = 'bg-red-50';
                      textColor = 'text-red-800';
                      borderColor = 'border-red-300';
                      title = 'Valor extremo';

                      if (item.type.includes('weight')) {
                        icon = <FaSkull className="text-red-500" />;
                      } else if (item.type.includes('reps')) {
                        icon = <FaBolt className="text-red-500" />;
                      } else {
                        icon = <FaExclamationCircle className="text-red-500" />;
                      }
                    } else {
                      bgColor = 'bg-amber-50';
                      textColor = 'text-amber-800';
                      borderColor = 'border-amber-300';
                      title = 'Valor inusual';

                      if (item.type === 'weight') {
                        icon = <FaWeight className="text-amber-500" />;
                      } else if (item.type === 'reps') {
                        icon = <FaFireAlt className="text-amber-500" />;
                      } else if (item.type === 'combination') {
                        icon = <FaExclamationTriangle className="text-amber-500" />;
                      } else {
                        icon = <FaInfoCircle className="text-amber-500" />;
                      }
                    }

                    return (
                      <li key={index} className={`${bgColor} ${textColor} p-3 rounded-lg border ${borderColor} flex items-start hover-scale animate-slide-in-right transition-all-300`} style={{animationDelay: `${0.3 + index * 0.1}s`}}>
                        <div className="mr-3 mt-0.5 transition-transform-300 hover:rotate-12">{icon}</div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <span className="font-medium">{title}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-white border border-current">
                              Serie {item.setIndex + 1}
                            </span>
                          </div>
                          <p className="mt-1 text-sm">{item.message}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-4 text-center animate-fade-in" style={{animationDelay: '0.6s'}}>
                  <p className="text-sm font-medium text-gray-700 mb-3">¿Estás seguro de que estos valores son correctos?</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            {showConfirmation ? (
              <>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 flex items-center hover-scale animate-slide-in-right"
                >
                  <FaExclamationCircle className="mr-2 text-gray-500 transition-transform-300 group-hover:rotate-12" />
                  Revisar valores
                </button>
                <button
                  onClick={handleSaveLog}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-medium shadow-md hover:bg-yellow-700 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 flex items-center hover-scale animate-slide-in-right"
                  style={{animationDelay: '0.1s'}}
                >
                  <FaCheckCircle className="mr-2 transition-transform-300 group-hover:scale-110" />
                  Confirmar y guardar
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsLogging(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 flex items-center hover-scale animate-slide-in-right group"
                >
                  <FaExclamationCircle className="mr-2 text-gray-500" />
                  Cancelar
                </button>
                <button
                  onClick={handleSaveLog}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium shadow-md hover:bg-primary-700 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 flex items-center hover-scale animate-slide-in-right group"
                  style={{animationDelay: '0.1s'}}
                >
                  <FaCheckCircle className="mr-2" />
                  Guardar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseCard;
