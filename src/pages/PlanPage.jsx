import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';
import { FaCalendarAlt, FaChevronDown, FaChevronUp, FaPlus, FaEdit, FaTrashAlt, FaCheck } from 'react-icons/fa';
import ExerciseCard from '../components/ExerciseCard';

const PlanPage = () => {
  const { plan, currentPhase, routines, deleteRoutine, addDayToPlan } = useWorkout();
  const [expandedDay, setExpandedDay] = useState(null);
  const [showRoutines, setShowRoutines] = useState(false);

  // Filtrar los días del plan por la fase actual
  const currentPhaseDays = plan.filter(day => day.phase === currentPhase);

  const toggleDay = (dayId) => {
    if (expandedDay === dayId) {
      setExpandedDay(null);
    } else {
      setExpandedDay(dayId);
    }
  };

  const handleAddRoutine = (routineId) => {
    addDayToPlan(routineId);
    setShowRoutines(false);
  };

  const handleDeleteRoutine = (e, routineId) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de que quieres eliminar esta rutina?')) {
      deleteRoutine(routineId);
    }
  };

  // Calcular el progreso general de la fase actual
  const calculatePhaseProgress = () => {
    if (currentPhaseDays.length === 0) return 0;

    const totalProgress = currentPhaseDays.reduce((sum, day) => sum + (day.progress || 0), 0);
    return Math.round(totalProgress / currentPhaseDays.length);
  };

  const phaseProgress = calculatePhaseProgress();

  return (
    <div className="container mx-auto px-4 py-6 pt-16 pb-24 max-w-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Plan de Entrenamiento</h1>
        <span className="text-sm font-medium px-3 py-1 bg-primary-100 text-primary-800 rounded-full">
          Fase {currentPhase}
        </span>
      </div>

      {/* Progreso general */}
      <div className="bg-white rounded-xl shadow-md p-5 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Progreso General</h2>
          <span className="text-sm font-medium">{phaseProgress}%</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${phaseProgress >= 100 ? 'bg-green-500' : phaseProgress >= 80 ? 'bg-yellow-500' : phaseProgress > 0 ? 'bg-red-500' : 'bg-gray-300'}`}
            style={{ width: `${phaseProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Días de entrenamiento */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <FaCalendarAlt className="mr-2 text-primary-600" />
          Rutinas
        </h2>
        <button
          onClick={() => setShowRoutines(!showRoutines)}
          className="text-sm font-medium text-primary-600 flex items-center"
        >
          {showRoutines ? 'Ocultar rutinas guardadas' : 'Ver rutinas guardadas'}
          {showRoutines ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
        </button>
      </div>

      {/* Rutinas guardadas */}
      {showRoutines && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-4 bg-gray-50 border-b border-gray-100">
            <h3 className="font-medium text-gray-800">Rutinas Guardadas</h3>
          </div>

          {routines.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {routines.map(routine => (
                <div key={routine.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-800">{routine.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{routine.exercises.length} ejercicios</p>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAddRoutine(routine.id)}
                        className="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                        title="Añadir al plan"
                      >
                        <FaPlus size={14} />
                      </button>
                      <button
                        onClick={(e) => handleDeleteRoutine(e, routine.id)}
                        className="p-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        title="Eliminar rutina"
                      >
                        <FaTrashAlt size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500 mb-4">No tienes rutinas guardadas</p>
              <Link
                to="/create-routine"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <FaPlus className="mr-2" /> Crear Rutina
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Días del plan */}
      <div className="space-y-4">
        {currentPhaseDays.length > 0 ? (
          currentPhaseDays.map(day => (
            <div key={day.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <button
                onClick={() => toggleDay(day.id)}
                className="w-full p-4 text-left flex justify-between items-center"
              >
                <div>
                  <div className="flex items-center">
                    <h3 className="font-semibold text-gray-800">{day.name}</h3>
                    {day.progress > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        {day.progress}%
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {day.recommendedDay || 'Flexible'} • {day.exercises.length} ejercicios
                  </p>
                </div>

                <div className="flex items-center">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    {expandedDay === day.id ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>
              </button>

              {expandedDay === day.id && (
                <div className="border-t border-gray-100">
                  {day.exercises.map(exercise => (
                    <ExerciseCard
                      key={exercise.id}
                      exercise={exercise}
                      dayId={day.id}
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-gray-500 mb-4">No hay rutinas para la fase {currentPhase}</p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/create-routine"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <FaPlus className="mr-2" /> Crear Rutina
              </Link>
              {routines.length > 0 && (
                <button
                  onClick={() => setShowRoutines(true)}
                  className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Ver Rutinas Guardadas
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Consejos */}
      <div className="bg-white rounded-xl shadow-md p-5 mt-6">
        <h3 className="font-semibold text-gray-800 mb-3">Consejos para tu entrenamiento</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
            <span className="text-sm text-gray-600">Realiza siempre un calentamiento adecuado antes de cada sesión</span>
          </li>
          <li className="flex items-start">
            <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
            <span className="text-sm text-gray-600">Mantén una buena técnica en todos los ejercicios</span>
          </li>
          <li className="flex items-start">
            <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
            <span className="text-sm text-gray-600">Ajusta los pesos según tu capacidad actual</span>
          </li>
          <li className="flex items-start">
            <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
            <span className="text-sm text-gray-600">Registra tus entrenamientos para seguir tu progreso</span>
          </li>
          <li className="flex items-start">
            <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
            <span className="text-sm text-gray-600">Descansa adecuadamente entre sesiones (24-48 horas para cada grupo muscular)</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PlanPage;
