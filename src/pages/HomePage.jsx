import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';
import { FaCalendarDay, FaCheckCircle, FaArrowRight, FaInfoCircle, FaHistory } from 'react-icons/fa';

const HomePage = () => {
  const navigate = useNavigate();
  const { plan, currentPhase, workoutLogs } = useWorkout();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [todaysWorkout, setTodaysWorkout] = useState(null);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [completionRate, setCompletionRate] = useState(0);

  // Filtrar los días del plan por la fase actual
  const currentPhaseDays = plan.filter(day => day.phase === currentPhase);

  // Seleccionar el día actual
  const currentDay = currentPhaseDays[selectedDayIndex] || null;

  // Calcular el día de la semana actual y determinar el entrenamiento recomendado
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

    // Días de entrenamiento: Lunes (Día 1), Miércoles (Día 2), Viernes (Día 3)
    // Días de descanso: Martes, Jueves, Sábado, Domingo
    const isRestDay = ['Martes', 'Jueves', 'Sábado', 'Domingo'].includes(todayName);

    if (isRestDay) {
      // Día de descanso
      setTodaysWorkout(null);
      // Mantener el último día seleccionado o establecer el primero por defecto
      if (currentPhaseDays.length > 0 && selectedDayIndex >= currentPhaseDays.length) {
        setSelectedDayIndex(0);
      }
    } else {
      // Día de entrenamiento
      const recommendedIndex = currentPhaseDays.findIndex(day =>
        day.recommendedDay && day.recommendedDay.includes(todayName)
      );

      if (recommendedIndex !== -1) {
        setSelectedDayIndex(recommendedIndex);
        setTodaysWorkout(currentPhaseDays[recommendedIndex]);
      } else if (currentPhaseDays.length > 0) {
        // Si no hay día recomendado pero hay días disponibles, mostrar el primero
        setSelectedDayIndex(0);
        setTodaysWorkout(currentPhaseDays[0]);
      } else {
        setTodaysWorkout(null);
      }
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
  }, [currentPhase, currentPhaseDays, workoutLogs, selectedDayIndex]);

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
            <button
              onClick={() => {
                try {
                  // Extraer el número del día directamente del nombre (Día 1, Día 2, Día 3)
                  const match = todaysWorkout.name.match(/Día (\d+)/);
                  let dayNumber;

                  if (match && match[1]) {
                    // Si se encuentra el número en el nombre
                    dayNumber = parseInt(match[1]);
                  } else {
                    // Alternativa: usar el índice + 1
                    const dayIndex = currentPhaseDays.findIndex(d => d.id === todaysWorkout.id);
                    dayNumber = dayIndex + 1;
                  }

                  console.log('HomePage - Navegando al entrenamiento de hoy:', todaysWorkout, 'Día:', dayNumber);
                  navigate(`/workout/${dayNumber}`);
                } catch (err) {
                  console.error('Error al navegar al entrenamiento de hoy:', err);
                  // Navegar al primer día como fallback
                  navigate('/workout/1');
                }
              }}
              className="p-3 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            >
              <FaArrowRight />
            </button>
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
        <div className="bg-white rounded-xl shadow-md p-5 mb-6 border-l-4 border-blue-500">
          <div className="flex items-start">
            <FaInfoCircle className="text-blue-500 mr-3 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800">Día de descanso</h3>
              <p className="text-sm text-gray-600 mt-1">
                Hoy es tu día de descanso. Recuerda que el descanso es tan importante como el entrenamiento para la recuperación muscular y el progreso.
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Si aún así deseas entrenar, puedes seleccionar una rutina de la lista a continuación.
              </p>
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
            <div
              key={day.id}
              className={`w-full text-left p-4 transition-colors ${selectedDayIndex === index ? 'bg-primary-50' : 'hover:bg-gray-50'}`}
            >
              <div className="flex justify-between items-center">
                <div onClick={() => setSelectedDayIndex(index)} className="flex-1 cursor-pointer">
                  <h3 className="font-medium text-gray-800">{day.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {day.recommendedDay || 'Flexible'} • {day.exercises.length} ejercicios
                  </p>
                </div>

                <div className="flex items-center">
                  {day.progress > 0 && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium mr-2">
                      {day.progress}%
                    </span>
                  )}
                  <button
                    onClick={() => {
                      try {
                        // Obtener el índice del día en la lista de días de la fase actual
                        const dayIndex = currentPhaseDays.findIndex(d => d.id === day.id);

                        if (dayIndex === -1) {
                          throw new Error(`No se encontró el día con ID ${day.id}`);
                        }

                        // Usar el índice + 1 como número de día (1, 2, 3)
                        const dayNumber = dayIndex + 1;
                        console.log('HomePage - Navegando a otra rutina:', day, 'Día:', dayNumber);
                        navigate(`/workout/${dayNumber}`);
                      } catch (err) {
                        console.error('Error al navegar a otra rutina:', err);
                        alert(`Error al navegar: ${err.message}`);
                      }
                    }}
                    className="p-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                  >
                    <FaArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
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
