import React, { useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import ExerciseProgress from '../components/ExerciseProgress';
import ProgressCharts from '../components/ProgressCharts';
import DataSync from '../components/DataSync';
import { FaChartLine, FaArrowLeft, FaCalendarAlt, FaDumbbell, FaListUl, FaChartBar } from 'react-icons/fa';

const ProgressPage = () => {
  const { plan, workoutLogs } = useWorkout();
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [activeTab, setActiveTab] = useState('exercises'); // 'exercises' o 'charts'

  // Obtener todos los ejercicios
  const allExercises = plan.flatMap(day => day.exercises || []);

  // Filtrar solo los ejercicios que tienen registros
  const exercisesWithLogs = allExercises.filter(exercise =>
    workoutLogs.logs && workoutLogs.logs.some(log => log.exerciseId === exercise.id)
  );

  // Agrupar ejercicios por día
  const exercisesByDay = plan.map(day => ({
    dayId: day.id,
    dayName: day.name,
    exercises: (day.exercises || []).filter(exercise =>
      workoutLogs.logs && workoutLogs.logs.some(log => log.exerciseId === exercise.id)
    )
  })).filter(day => day.exercises && day.exercises.length > 0);

  // Calcular el número de días únicos de entrenamiento
  const uniqueTrainingDays = workoutLogs.logs ? new Set(workoutLogs.logs.map(log => log.date.split('T')[0])).size : 0;

  // Calcular el peso total levantado
  const totalWeightLifted = workoutLogs.logs ? workoutLogs.logs.reduce((total, log) => {
    const logWeight = log.sets ? log.sets.reduce((setTotal, set) => {
      const weight = parseFloat(set.weight);
      const reps = parseFloat(set.reps);
      return !isNaN(weight) && !isNaN(reps) ? setTotal + (weight * reps) : setTotal;
    }, 0) : 0;
    return total + logWeight;
  }, 0) : 0;

  return (
    <div className="container mx-auto px-4 py-6 pt-14 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Tu Progreso</h1>
        <div className="flex items-center">
          <button
            onClick={() => window.location.href = '/progress/advanced'}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mr-2"
            title="Progreso Avanzado"
          >
            <FaChartLine className="text-primary-600 dark:text-primary-400" />
          </button>
          <DataSync />
        </div>
      </div>

      {/* Pestañas de navegación */}
      {workoutLogs.logs.length > 0 && !selectedExercise && (
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            className={`py-2 px-4 font-medium text-sm border-b-2 ${activeTab === 'exercises'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('exercises')}
          >
            <FaListUl className="inline-block mr-2" />
            Ejercicios
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm border-b-2 ${activeTab === 'charts'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('charts')}
          >
            <FaChartBar className="inline-block mr-2" />
            Gráficos
          </button>
        </div>
      )}

      {workoutLogs.logs.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-8 text-center border border-gray-100 dark:border-gray-700">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaChartLine className="text-2xl text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No hay datos todavía</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Comienza a registrar tus entrenamientos para ver tu progreso aquí. Las estadísticas y gráficas aparecerán automáticamente.
          </p>
        </div>
      ) : (
        <>
          {selectedExercise ? (
            <>
              <button
                onClick={() => setSelectedExercise(null)}
                className="mb-5 flex items-center text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                Volver a todos los ejercicios
              </button>

              <ExerciseProgress exerciseId={selectedExercise} />
            </>
          ) : (
            <>
              {activeTab === 'charts' ? (
                <ProgressCharts workoutLogs={workoutLogs} exercises={allExercises} />
              ) : (
                <>
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 mb-8 border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                  <FaChartLine className="mr-2 text-primary-500" />
                  Resumen de Progreso
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-100 dark:border-gray-600">
                    <div className="flex items-center mb-1">
                      <FaCalendarAlt className="text-primary-500 mr-2" />
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Entrenamientos</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{uniqueTrainingDays}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Días de entrenamiento registrados</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-100 dark:border-gray-600">
                    <div className="flex items-center mb-1">
                      <FaDumbbell className="text-primary-500 mr-2" />
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Ejercicios</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{exercisesWithLogs.length}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ejercicios con registros</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-100 dark:border-gray-600">
                    <div className="flex items-center mb-1">
                      <FaListUl className="text-primary-500 mr-2" />
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Peso total</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{totalWeightLifted.toLocaleString()} kg</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Peso total levantado</p>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Ejercicios por día</h2>

              {exercisesByDay.map(day => (
                <div key={day.dayId} className="mb-8">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 pl-2 border-l-4 border-primary-500">{day.dayName}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {day.exercises.map(exercise => (
                      <button
                        key={exercise.id}
                        onClick={() => setSelectedExercise(exercise.id)}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-5 text-left hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700"
                      >
                        <h4 className="font-bold text-gray-800 dark:text-white">{exercise.name}</h4>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {workoutLogs.logs.filter(log => log.exerciseId === exercise.id).length} registros
                          </p>
                          <span className="text-primary-600 dark:text-primary-400 text-sm font-medium">Ver detalles →</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ProgressPage;
