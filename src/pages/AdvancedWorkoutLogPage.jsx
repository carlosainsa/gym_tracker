import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheck, FaClock, FaDumbbell, FaCalendarAlt, FaSave, FaStopwatch, FaAdjust } from 'react-icons/fa';
import AutoRegulationPanel from '../components/AutoRegulationPanel';
import { useTraining } from '../context/TrainingContext';
import AdvancedExerciseRecorder from '../components/AdvancedExerciseRecorder';
import AdvancedTimer from '../components/AdvancedTimer';

/**
 * Página de registro de entrenamiento avanzado
 */
const AdvancedWorkoutLogPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { trainingPlan, addWorkoutLog } = useTraining();

  const [session, setSession] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [completedExercises, setCompletedExercises] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [duration, setDuration] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [autoStartTimers, setAutoStartTimers] = useState(false);
  const [adjustedExercises, setAdjustedExercises] = useState(false);

  // Cargar la sesión de entrenamiento
  useEffect(() => {
    if (trainingPlan && sessionId) {
      // Buscar la sesión en todos los microciclos
      let foundSession = null;

      for (const microcycle of trainingPlan.microcycles) {
        const session = microcycle.trainingSessions.find(s => s.id === sessionId);
        if (session) {
          foundSession = session;
          break;
        }
      }

      if (foundSession) {
        setSession(foundSession);
        setExercises(foundSession.exercises || []);
      }
    }
  }, [trainingPlan, sessionId]);

  // Inicializar el tiempo de inicio cuando se monta el componente
  useEffect(() => {
    if (!startTime) {
      setStartTime(new Date());
    }

    // Iniciar un temporizador para actualizar la duración cada segundo
    const timer = setInterval(() => {
      if (!endTime) {
        const currentDuration = Math.floor((new Date() - startTime) / 1000);
        setDuration(currentDuration);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, endTime]);

  // Manejar completado de un ejercicio
  const handleExerciseComplete = (completedExercise, exerciseIndex) => {
    // Actualizar el array de ejercicios
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex] = completedExercise;
    setExercises(updatedExercises);

    // Actualizar el contador de ejercicios completados
    setCompletedExercises(prevCount => {
      const newCount = prevCount + 1;

      // Si todos los ejercicios están completados, marcar el entrenamiento como completado
      if (newCount === exercises.length) {
        setEndTime(new Date());
        setIsCompleted(true);
      }

      return newCount;
    });
  };

  // Guardar el registro de entrenamiento
  const saveWorkoutLog = () => {
    if (isSaving) return;

    setIsSaving(true);

    // Calcular la duración total del entrenamiento
    const totalDuration = endTime ? Math.floor((endTime - startTime) / 1000) : duration;

    // Crear el registro de entrenamiento
    const workoutLog = {
      sessionId: session.id,
      sessionName: session.name,
      exercises: exercises.map(exercise => ({
        id: exercise.id,
        name: exercise.name,
        sets: exercise.sets,
        isCompleted: exercise.isCompleted,
        duration: exercise.duration || 0
      })),
      startTime: startTime.toISOString(),
      endTime: endTime ? endTime.toISOString() : new Date().toISOString(),
      duration: totalDuration,
      isCompleted: isCompleted
    };

    // Añadir el registro al contexto
    addWorkoutLog(workoutLog);

    // Mostrar confirmación
    setShowConfirmation(true);

    // Ocultar la confirmación después de 3 segundos
    setTimeout(() => {
      setShowConfirmation(false);
      setIsSaving(false);
    }, 3000);
  };

  // Finalizar el entrenamiento manualmente
  const finishWorkout = () => {
    setEndTime(new Date());
    setIsCompleted(true);
  };

  // Aplicar ajustes de autoregulación
  const applyAutoRegulation = ({ loadAdjustment, volumeAdjustment }) => {
    if (adjustedExercises) return;

    // Crear una copia de los ejercicios
    const updatedExercises = [...exercises];

    // Aplicar ajustes a cada ejercicio
    updatedExercises.forEach(exercise => {
      // Ajustar el peso de cada serie
      if (exercise.sets) {
        exercise.sets.forEach(set => {
          // Solo ajustar si hay un peso y no es peso corporal
          if (set.weight && set.weight !== 'Peso corporal') {
            const currentWeight = parseFloat(set.weight);
            const adjustedWeight = currentWeight * (1 + loadAdjustment / 100);
            set.weight = adjustedWeight.toFixed(1);
          }
        });
      }
    });

    // Actualizar el estado
    setExercises(updatedExercises);
    setAdjustedExercises(true);

    // Mostrar mensaje de confirmación
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 3000);
  };

  // Calcular el progreso del entrenamiento
  const calculateProgress = () => {
    if (!exercises || exercises.length === 0) return 0;
    return Math.round((completedExercises / exercises.length) * 100);
  };

  // Formatear el tiempo en horas:minutos:segundos
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
  };

  // Si no se encuentra la sesión, mostrar mensaje de error
  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8 pt-16 pb-24 max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <FaArrowLeft className="text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Entrenamiento</h1>
          <div className="w-8"></div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-xl border border-yellow-200 dark:border-yellow-800">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Sesión no encontrada</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No se ha encontrado la sesión de entrenamiento solicitada.
          </p>
          <button
            onClick={() => navigate('/plan/new')}
            className="py-2 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Volver al plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-16 pb-24 max-w-lg">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <FaArrowLeft className="text-gray-600 dark:text-gray-300" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Registro de Entrenamiento</h1>
        <div className="w-8"></div>
      </div>

      {/* Información del entrenamiento */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <h2 className="text-xl font-bold">{session.name}</h2>
          <div className="flex items-center mt-1 text-white text-opacity-90">
            <FaCalendarAlt className="mr-1" />
            <span>{session.recommendedDay}</span>
            <span className="mx-2">•</span>
            <FaDumbbell className="mr-1" />
            <span>{exercises.length} ejercicios</span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <FaClock className="text-primary-500 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tiempo de entrenamiento
              </span>
            </div>
            <div className="text-lg font-bold text-gray-800 dark:text-white">
              {formatTime(duration)}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Progreso</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {completedExercises}/{exercises.length} ejercicios
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-primary-600 h-2.5 rounded-full"
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <label className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={autoStartTimers}
                  onChange={() => setAutoStartTimers(!autoStartTimers)}
                  className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                Iniciar temporizadores automáticamente
              </label>
            </div>

            {!isCompleted ? (
              <button
                onClick={finishWorkout}
                className="py-1 px-3 bg-primary-600 text-white text-sm rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center"
              >
                <FaCheck className="mr-1" />
                Finalizar
              </button>
            ) : (
              <span className="py-1 px-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-lg font-medium flex items-center">
                <FaCheck className="mr-1" />
                Completado
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Panel de autoregulación */}
      <AutoRegulationPanel onAdjustments={applyAutoRegulation} />

      {/* Lista de ejercicios */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
          <FaDumbbell className="mr-2 text-primary-500" />
          Ejercicios
        </h2>

        {exercises.map((exercise, index) => (
          <AdvancedExerciseRecorder
            key={exercise.id}
            exercise={exercise}
            index={index}
            onExerciseComplete={handleExerciseComplete}
            autoStartTimers={autoStartTimers}
          />
        ))}
      </div>

      {/* Botón de guardar */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={saveWorkoutLog}
          disabled={isSaving}
          className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaSave className="mr-2" />
          {isSaving ? 'Guardando...' : 'Guardar registro'}
        </button>
      </div>

      {/* Notificación de confirmación */}
      {showConfirmation && (
        <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 py-2 px-4 rounded-lg shadow-lg flex items-center">
          <FaCheck className="mr-2" />
          Registro guardado correctamente
        </div>
      )}
    </div>
  );
};

export default AdvancedWorkoutLogPage;
