import React, { useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { FaPlus, FaCheck, FaDumbbell, FaStopwatch, FaWeight, FaInfoCircle } from 'react-icons/fa';
import { evaluateExerciseProgress, getProgressMessage, getExactColorByPercentage } from '../utils/progressEvaluation';
import RestTimer from './RestTimer';

const ExerciseCard = ({ exercise, dayId, showDetails = false }) => {
  const { updateExerciseProgress, getExerciseLogs } = useWorkout();
  const [isLogging, setIsLogging] = useState(false);
  const [isExpanded, setIsExpanded] = useState(showDetails);
  const [logData, setLogData] = useState({
    sets: [],
    notes: ''
  });
  const [evaluation, setEvaluation] = useState(null);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [showRestTimer, setShowRestTimer] = useState(false);

  // Verificar si el ejercicio ya tiene valores registrados
  const hasActualValues = exercise.actualSets && exercise.actualSets.length > 0;

  // Calcular el progreso del ejercicio
  const progress = exercise.progress || 0;

  // Determinar el color del indicador de progreso
  const getProgressColor = () => {
    // Usar la función getExactColorByPercentage para obtener un color más preciso
    const color = getExactColorByPercentage(progress);

    // Convertir el color hexadecimal a una clase de Tailwind
    switch (color) {
      case '#4caf50': return 'bg-green-500'; // Verde (100% o más): Has alcanzado o superado el objetivo
      case '#ffc107': return 'bg-yellow-500'; // Amarillo (80-99%): Estás acercándote al objetivo
      case '#f44336': return 'bg-red-500';   // Rojo (menos de 80%): Estás muy lejos del objetivo
      default: return 'bg-gray-300';         // sin progreso
    }
  };

  // Obtener los registros históricos del ejercicio
  const exerciseLogs = getExerciseLogs(exercise.id);

  // Inicializar los sets cuando se abre el formulario de registro
  const handleStartLogging = () => {
    // Crear sets iniciales basados en los sets planificados
    const initialSets = Array.isArray(exercise.sets)
      ? exercise.sets.map(set => ({
          reps: '',
          weight: ''
        }))
      : Array(exercise.sets || 3).fill().map(() => ({
      reps: '',
      weight: ''
    }));

    setLogData({ sets: initialSets, notes: '' });
    setCurrentSetIndex(0);
    setShowRestTimer(false);
    setIsLogging(true);
  };

  // Actualizar los datos de un set específico
  const handleSetChange = (index, field, value) => {
    const newSets = [...logData.sets];
    newSets[index] = { ...newSets[index], [field]: value };
    setLogData({ ...logData, sets: newSets });

    // Evaluar el progreso cuando se actualizan los datos
    evaluateSet(newSets);
  };

  // Función para manejar la finalización de una serie y mostrar el temporizador
  const handleSetComplete = (index) => {
    // Solo mostrar el temporizador si no es la última serie
    if (index < logData.sets.length - 1) {
      setCurrentSetIndex(index);
      setShowRestTimer(true);
      console.log('Mostrando temporizador para la serie:', index);
    } else {
      // Si es la última serie, simplemente avanzamos
      setCurrentSetIndex(index + 1);
      console.log('Última serie completada');
    }
  };

  // Función para manejar la finalización del temporizador de descanso
  const handleRestComplete = () => {
    // Esperar un momento para que el usuario vea el mensaje "¡Listos para la próxima serie!"
    setTimeout(() => {
      setShowRestTimer(false);
      setCurrentSetIndex(currentSetIndex + 1);
    }, 2000);
  };

  // Evaluar el progreso de un set
  const evaluateSet = (sets) => {
    if (!sets || sets.length === 0) return;

    // Preparar los datos para la evaluación
    const exerciseData = {
      reps: sets[0].reps, // Tomamos el primer set como referencia
      weight: sets[0].weight
    };

    // Obtener los rangos planificados del texto mostrado
    const planText = exercise.planificado || ''; // "12-15 x 32-35 kgkg"
    const matches = planText.match(/(\d+)-(\d+)\s*x\s*(\d+)-(\d+)/);

    if (!matches) {
      console.error('No se pudo extraer el rango planificado:', planText);
      return;
    }

    // Extraer los valores mínimos de los rangos
    const [_, minReps, maxReps, minWeight, maxWeight] = matches;

    // Preparar los rangos planificados usando los valores mínimos
    const plannedData = {
      reps: `${minReps}-${maxReps}`,
      weight: `${minWeight}-${maxWeight}`
    };

    console.log('Evaluando con:', {
      exerciseData,
      plannedData,
      minReps,
      maxReps,
      minWeight,
      maxWeight
    });

    // Realizar la evaluación
    const result = evaluateExerciseProgress(exerciseData, plannedData);
    setEvaluation(result);
  };

  // Guardar el registro de entrenamiento
  const handleSaveLog = () => {
    // Validar que al menos un set tenga datos
    const hasData = logData.sets.some(set => set.reps || set.weight);
    if (!hasData) {
      alert('Por favor, ingresa al menos un valor de repeticiones o peso');
      return;
    }

    // Convertir valores de texto a números
    const processedSets = logData.sets.map(set => ({
      reps: set.reps ? parseInt(set.reps) : 0,
      weight: set.weight ? parseFloat(set.weight) : 0
    }));

    // Actualizar el progreso del ejercicio
    updateExerciseProgress(exercise.id, processedSets);

    // Reiniciar estados
    setIsLogging(false);
    setIsExpanded(false);
    setEvaluation(null);
    setShowRestTimer(false);
    setCurrentSetIndex(0);
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
                {Array.isArray(exercise.sets)
                  ? `${exercise.sets.length} series x ${exercise.sets[0]?.reps || '?'} reps`
                  : typeof exercise.sets === 'number'
                    ? `${exercise.sets} series x ${exercise.reps || '?'} reps`
                    : 'Series no disponibles'
                }
              </span>
            </div>

            {((Array.isArray(exercise.sets) && exercise.sets[0]?.weight) ||
              (typeof exercise.sets === 'number' && exercise.weight)) && (
              <div className="flex items-center text-sm text-gray-600">
                <FaWeight className="mr-2 text-primary-500" />
                <span>Peso: {Array.isArray(exercise.sets) ? exercise.sets[0].weight : exercise.weight} kg</span>
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
              <React.Fragment key={index}>
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 flex items-center justify-center bg-primary-100 text-primary-800 font-bold rounded-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Repeticiones</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder={
                          Array.isArray(exercise.sets)
                            ? exercise.sets[index]?.reps
                            : exercise.reps || 'Reps'
                        }
                        value={set.reps}
                        onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                        disabled={showRestTimer && index > currentSetIndex}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Peso (kg)</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder={
                          Array.isArray(exercise.sets)
                            ? exercise.sets[index]?.weight
                            : exercise.weight || 'Peso'
                        }
                        value={set.weight}
                        onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                        disabled={showRestTimer && index > currentSetIndex}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handleSetComplete(index)}
                    className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-all"
                    disabled={showRestTimer || (index !== currentSetIndex) || (!set.reps && !set.weight)}
                  >
                    <FaCheck size={16} />
                  </button>
                </div>

                {/* Temporizador de descanso después de cada serie (excepto la última) */}
                {showRestTimer && index === currentSetIndex && (
                  <div className="mt-3 border-t border-blue-200 pt-3">
                    <RestTimer
                      duration={exercise.rest ? parseInt(exercise.rest.replace(/[^0-9]/g, '')) : 60}
                      onComplete={handleRestComplete}
                      isActive={true}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Evaluación en tiempo real */}
          {evaluation && (
            <div className="mt-4 space-y-3">
              <div className="p-3 rounded-lg" style={{ backgroundColor: getExactColorByPercentage(evaluation.reps.percentage) }}>
                <p className="text-white text-sm">
                  Repeticiones: {getProgressMessage(evaluation.reps)}
                </p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: getExactColorByPercentage(evaluation.weight.percentage) }}>
                <p className="text-white text-sm">
                  Peso: {getProgressMessage(evaluation.weight)}
                </p>
              </div>
            </div>
          )}

          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => {
                setIsLogging(false);
                setEvaluation(null);
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveLog}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-all flex items-center"
            >
              <FaCheck className="mr-2" />
              Guardar
            </button>
          </div>
        </div>
      )}

      {isExpanded && (
        <div className="mt-5 border-t border-gray-100 pt-5">
          {/* Valores reales (si existen) */}
          {hasActualValues && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Valores realizados:</h4>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="font-medium text-gray-500">Serie</div>
                  <div className="font-medium text-gray-500">Reps</div>
                  <div className="font-medium text-gray-500">Peso (kg)</div>

                  {exercise.actualSets.map((set, index) => (
                    <React.Fragment key={`actual-${index}`}>
                      <div className="text-gray-800">{index + 1}</div>
                      <div className="text-gray-800">{set.reps || '-'}</div>
                      <div className="text-gray-800">{set.weight || '-'}</div>
                    </React.Fragment>
                  ))}
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
                      <span className="text-gray-500">{new Date(log.date).toLocaleDateString('es-ES')}</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        {log.sets?.length || 0} series
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {log.sets.map((set, setIndex) => (
                        <React.Fragment key={`set-${setIndex}`}>
                          <div className="text-gray-600">Serie {setIndex + 1}</div>
                          <div>{set.reps || '-'} reps</div>
                          <div>{set.weight || '-'} kg</div>
                          </React.Fragment>
                        ))}
                      </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExerciseCard;
