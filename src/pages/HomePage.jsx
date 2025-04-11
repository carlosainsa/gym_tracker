import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';
import { FaCalendarDay, FaCheckCircle, FaArrowRight, FaInfoCircle, FaHistory } from 'react-icons/fa';

const HomePage = () => {
  const { plan, currentPhase, workoutLogs } = useWorkout();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [todaysWorkout, setTodaysWorkout] = useState(null);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [completionRate, setCompletionRate] = useState(0);

  // Filtrar los días del plan por la fase actual
  const currentPhaseDays = plan.filter(day => day.phase === currentPhase);

  // Seleccionar el día actual
  const currentDay = currentPhaseDays[selectedDayIndex] || null;

  // Calcular el día de la semana actual
  useEffect(() => {
    const today = new Date().getDay(); // 0 = Domingo, 1 = Lunes, etc.
    const dayMapping = {
      1: 'Lunes',
      2: 'Martes',
      3: 'Miércoles',
      4: 'Jueves',
      5: 'Viernes',
      6: 'Sábado',
      0: 'Domingo'
    };

    // Buscar un día recomendado para hoy
    const todayName = dayMapping[today];
    const recommendedIndex = currentPhaseDays.findIndex(day =>
      day.recommendedDay && day.recommendedDay.includes(todayName)
    );

    if (recommendedIndex !== -1) {
      setSelectedDayIndex(recommendedIndex);
      setTodaysWorkout(currentPhaseDays[recommendedIndex]);
    } else {
      setTodaysWorkout(null);
    }

    // Obtener entrenamientos recientes
    if (workoutLogs && workoutLogs.logs) {
      const sortedLogs = [...workoutLogs.logs]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
      setRecentWorkouts(sortedLogs);
    }

    // Calcular tasa de completado
    if (currentPhaseDays.length > 0) {
      const totalProgress = currentPhaseDays.reduce((sum, day) => sum + (day.progress || 0), 0);
      setCompletionRate(Math.round(totalProgress / currentPhaseDays.length));
    }
  }, [currentPhase, currentPhaseDays, workoutLogs]);

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

  return (
    <div className="container mx-auto px-4 py-6 pt-16 pb-24 max-w-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Bienvenido a Gym Tracker</h1>

      {/* Resumen de progreso */}
      <div className="bg-white rounded-xl shadow-md p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Progreso Fase {currentPhase}</h2>
          <span className="text-sm font-medium px-3 py-1 bg-primary-100 text-primary-800 rounded-full">
            {completionRate}% completado
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-primary-600 h-2.5 rounded-full"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      </div>

      {/* Entrenamiento de hoy */}
      <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
        <FaCalendarDay className="mr-2 text-primary-600" />
        Entrenamiento de Hoy
      </h2>

      {todaysWorkout ? (
        <div className="bg-white rounded-xl shadow-md p-5 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-800">{todaysWorkout.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{todaysWorkout.description || 'Sin descripción'}</p>

              <div className="mt-3 flex items-center text-sm">
                <span className="text-gray-600 mr-2">{todaysWorkout.exercises.length} ejercicios</span>
                {todaysWorkout.progress > 0 && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    {todaysWorkout.progress}% completado
                  </span>
                )}
              </div>
            </div>

            <Link
              to="/plan"
              className="flex items-center justify-center bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <FaArrowRight />
            </Link>
          </div>

          {todaysWorkout.exercises.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Ejercicios destacados:</h4>
              <ul className="space-y-2">
                {todaysWorkout.exercises.slice(0, 3).map(exercise => (
                  <li key={exercise.id} className="text-sm text-gray-600 flex items-center">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                    {exercise.name}
                  </li>
                ))}
                {todaysWorkout.exercises.length > 3 && (
                  <li className="text-xs text-gray-500 italic">
                    Y {todaysWorkout.exercises.length - 3} ejercicios más...
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-5 mb-6 border-l-4 border-yellow-500">
          <div className="flex items-start">
            <FaInfoCircle className="text-yellow-500 mr-3 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800">No hay entrenamiento programado para hoy</h3>
              <p className="text-sm text-gray-600 mt-1">
                Puedes seleccionar un entrenamiento de la lista de rutinas disponibles.
              </p>
              <Link
                to="/plan"
                className="mt-3 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800"
              >
                Ver rutinas disponibles <FaArrowRight className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Otros entrenamientos */}
      <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
        <FaCheckCircle className="mr-2 text-primary-600" />
        Otras Rutinas
      </h2>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="grid grid-cols-1 divide-y divide-gray-100">
          {currentPhaseDays.map((day, index) => (
            <button
              key={day.id}
              onClick={() => setSelectedDayIndex(index)}
              className={`w-full text-left p-4 transition-colors ${selectedDayIndex === index ? 'bg-primary-50' : 'hover:bg-gray-50'}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-800">{day.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {day.recommendedDay || 'Flexible'} • {day.exercises.length} ejercicios
                  </p>
                </div>

                {day.progress > 0 && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    {day.progress}%
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Actividad reciente */}
      {recentWorkouts.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
            <FaHistory className="mr-2 text-primary-600" />
            Actividad Reciente
          </h2>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="grid grid-cols-1 divide-y divide-gray-100">
              {recentWorkouts.map(log => {
                const exercise = plan.flatMap(day => day.exercises).find(ex => ex.id === log.exerciseId);
                return (
                  <div key={log.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">{exercise?.name || 'Ejercicio'}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{formatDate(log.date)}</p>
                      </div>

                      <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                        {log.actualSets?.length || 0} series
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
