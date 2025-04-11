import { useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import ExerciseProgress from '../components/ExerciseProgress';
import ExportData from '../components/ExportData';
import { FaChartLine, FaArrowLeft, FaCalendarAlt, FaDumbbell, FaListUl } from 'react-icons/fa';

const ProgressPage = () => {
  const { plan, workoutLogs } = useWorkout();
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Obtener todos los ejercicios
  const allExercises = plan.days.flatMap(day => day.exercises);

  // Filtrar solo los ejercicios que tienen registros
  const exercisesWithLogs = allExercises.filter(exercise =>
    workoutLogs.logs.some(log => log.exerciseId === exercise.id)
  );

  // Agrupar ejercicios por día
  const exercisesByDay = plan.days.map(day => ({
    dayId: day.id,
    dayName: day.name,
    exercises: day.exercises.filter(exercise =>
      workoutLogs.logs.some(log => log.exerciseId === exercise.id)
    )
  })).filter(day => day.exercises.length > 0);

  // Calcular el número de días únicos de entrenamiento
  const uniqueTrainingDays = new Set(workoutLogs.logs.map(log => log.date.split('T')[0])).size;

  // Calcular el peso total levantado
  const totalWeightLifted = workoutLogs.logs.reduce((total, log) => {
    const logWeight = log.sets.reduce((setTotal, set) => {
      const weight = parseFloat(set.weight);
      const reps = parseFloat(set.reps);
      return !isNaN(weight) && !isNaN(reps) ? setTotal + (weight * reps) : setTotal;
    }, 0);
    return total + logWeight;
  }, 0);

  return (
    <div className="container mx-auto px-4 py-6 pt-14 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tu Progreso</h1>
        {workoutLogs.logs.length > 0 && !selectedExercise && (
          <ExportData />
        )}
      </div>

      {workoutLogs.logs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-card p-8 text-center border border-gray-100">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaChartLine className="text-2xl text-primary-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No hay datos todavía</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Comienza a registrar tus entrenamientos para ver tu progreso aquí. Las estadísticas y gráficas aparecerán automáticamente.
          </p>
        </div>
      ) : (
        <>
          {selectedExercise ? (
            <>
              <button
                onClick={() => setSelectedExercise(null)}
                className="mb-5 flex items-center text-primary-600 font-medium hover:text-primary-700 transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                Volver a todos los ejercicios
              </button>

              <ExerciseProgress exerciseId={selectedExercise} />
            </>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-card p-6 mb-8 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <FaChartLine className="mr-2 text-primary-500" />
                  Resumen de Progreso
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center mb-1">
                      <FaCalendarAlt className="text-primary-500 mr-2" />
                      <p className="text-sm font-medium text-gray-600">Entrenamientos</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{uniqueTrainingDays}</p>
                    <p className="text-xs text-gray-500 mt-1">Días de entrenamiento registrados</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center mb-1">
                      <FaDumbbell className="text-primary-500 mr-2" />
                      <p className="text-sm font-medium text-gray-600">Ejercicios</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{exercisesWithLogs.length}</p>
                    <p className="text-xs text-gray-500 mt-1">Ejercicios con registros</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center mb-1">
                      <FaListUl className="text-primary-500 mr-2" />
                      <p className="text-sm font-medium text-gray-600">Peso total</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{totalWeightLifted.toLocaleString()} kg</p>
                    <p className="text-xs text-gray-500 mt-1">Peso total levantado</p>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-4">Ejercicios por día</h2>

              {exercisesByDay.map(day => (
                <div key={day.dayId} className="mb-8">
                  <h3 className="font-semibold text-gray-700 mb-3 pl-2 border-l-4 border-primary-500">{day.dayName}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {day.exercises.map(exercise => (
                      <button
                        key={exercise.id}
                        onClick={() => setSelectedExercise(exercise.id)}
                        className="bg-white rounded-xl shadow-card p-5 text-left hover:shadow-lg transition-all border border-gray-100"
                      >
                        <h4 className="font-bold text-gray-800">{exercise.name}</h4>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-sm text-gray-600">
                            {workoutLogs.logs.filter(log => log.exerciseId === exercise.id).length} registros
                          </p>
                          <span className="text-primary-600 text-sm font-medium">Ver detalles →</span>
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
    </div>
  );
};

export default ProgressPage;
