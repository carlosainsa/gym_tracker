import React, { useState, useEffect } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { FaPlus, FaCheck, FaDumbbell, FaStopwatch, FaWeight, FaArrowRight, FaInfoCircle } from 'react-icons/fa';

const ExerciseCard = ({ exercise, dayId, showDetails = false }) => {
  const { updateExerciseProgress, getExerciseLogs } = useWorkout();
  const [isLogging, setIsLogging] = useState(false);
  const [isExpanded, setIsExpanded] = useState(showDetails);
  const [logData, setLogData] = useState({
    sets: [],
    notes: ''
  });

  // Verificar si el ejercicio ya tiene valores registrados
  const hasActualValues = exercise.actualSets && exercise.actualSets.length > 0;

  // Calcular el progreso del ejercicio
  const progress = exercise.progress || 0;

  // Determinar el color del indicador de progreso
  const getProgressColor = () => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 80) return 'bg-yellow-500';
    if (progress > 0) return 'bg-red-500';
    return 'bg-gray-300';
  };

  // Obtener los registros históricos del ejercicio
  const exerciseLogs = getExerciseLogs(exercise.id);

  // Inicializar los sets cuando se abre el formulario de registro
  const handleStartLogging = () => {
    // Crear sets iniciales basados en los sets planificados
    const initialSets = exercise.sets.map(set => ({
      reps: '',
      weight: ''
    }));

    setLogData({ sets: initialSets, notes: '' });
    setIsLogging(true);
  };

  // Actualizar los datos de un set específico
  const handleSetChange = (index, field, value) => {
    const newSets = [...logData.sets];
    newSets[index] = { ...newSets[index], [field]: value };
    setLogData({ ...logData, sets: newSets });
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

    setIsLogging(false);
    setIsExpanded(false);
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
                {exercise.sets.length} series x {exercise.sets[0]?.reps || '?'} reps
              </span>
            </div>

            {exercise.sets[0]?.weight && (
              <div className="flex items-center text-sm text-gray-600">
                <FaWeight className="mr-2 text-primary-500" />
                <span>Peso: {exercise.sets[0].weight} kg</span>
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

                {exercise.sets.map((set, index) => (
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
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder={exercise.sets[index]?.reps || 'Reps'}
                      value={set.reps}
                      onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Peso (kg)</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder={exercise.sets[index]?.weight || 'Peso'}
                      value={set.weight}
                      onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    />
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

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsLogging(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveLog}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium shadow-md hover:bg-primary-700 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
            >
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseCard;
