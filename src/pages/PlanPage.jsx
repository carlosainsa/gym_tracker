import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';
import { FaCalendarAlt, FaChevronDown, FaChevronUp, FaPlus, FaEdit, FaTrashAlt, FaCheck, FaHistory, FaPlay, FaPause } from 'react-icons/fa';
import ExerciseCard from '../components/ExerciseCard';

const PlanPage = () => {
  const {
    plan,
    currentPhase,
    routines,
    deleteRoutine,
    addDayToPlan,
    expandedDay,
    setExpandedDay,
    updateRoutine
  } = useWorkout();

  const [activeTab, setActiveTab] = useState('active');
  const [editingRoutineId, setEditingRoutineId] = useState(null);
  const [editedRoutineName, setEditedRoutineName] = useState('');
  const [editedRoutineDescription, setEditedRoutineDescription] = useState('');

  // Filtrar los días del plan por la fase actual
  const currentPhaseDays = plan.filter(day => day.phase === currentPhase);

  // Clasificar los entrenamientos
  const activeTrainings = currentPhaseDays;
  const availableTrainings = routines.filter(routine =>
    !currentPhaseDays.some(day => day.routineId === routine.id)
  );
  const historicalTrainings = routines.filter(routine =>
    routine.isArchived || routine.isCompleted
  );

  const toggleDay = (dayId) => {
    if (expandedDay === dayId) {
      setExpandedDay(null);
    } else {
      setExpandedDay(dayId);
    }
  };

  const handleAddRoutine = (routineId) => {
    addDayToPlan(routineId);
  };

  const handleDeleteRoutine = (e, routineId) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de que quieres eliminar este entrenamiento?')) {
      deleteRoutine(routineId);
    }
  };

  const handleEditRoutine = (routine) => {
    setEditingRoutineId(routine.id);
    setEditedRoutineName(routine.name);
    setEditedRoutineDescription(routine.description || '');
  };

  const handleSaveEdit = () => {
    if (!editedRoutineName.trim()) {
      alert('El nombre del entrenamiento no puede estar vacío');
      return;
    }

    const updatedRoutine = {
      ...routines.find(r => r.id === editingRoutineId),
      name: editedRoutineName.trim(),
      description: editedRoutineDescription.trim()
    };

    updateRoutine(updatedRoutine);
    setEditingRoutineId(null);
  };

  const handleCancelEdit = () => {
    setEditingRoutineId(null);
  };

  const handleArchiveRoutine = (e, routineId) => {
    e.stopPropagation();
    const routine = routines.find(r => r.id === routineId);
    if (routine) {
      const updatedRoutine = {
        ...routine,
        isArchived: !routine.isArchived
      };
      updateRoutine(updatedRoutine);
    }
  };

  // Calcular el progreso general de la fase actual
  const calculatePhaseProgress = () => {
    if (currentPhaseDays.length === 0) return 0;

    const totalProgress = currentPhaseDays.reduce((sum, day) => sum + (day.progress || 0), 0);
    return Math.round(totalProgress / currentPhaseDays.length);
  };

  const phaseProgress = calculatePhaseProgress();

  // Renderizar la lista de entrenamientos
  const renderTrainingList = (trainings, type) => {
    if (trainings.length === 0) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {type === 'active'
              ? `No hay entrenamientos activos para la fase ${currentPhase}`
              : type === 'available'
                ? 'No hay entrenamientos disponibles'
                : 'No hay entrenamientos históricos'}
          </p>
          {type === 'active' && (
            <div className="flex justify-center space-x-4">
              <Link
                to="/create-routine"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <FaPlus className="mr-2" /> Crear Entrenamiento
              </Link>
              {availableTrainings.length > 0 && (
                <button
                  onClick={() => setActiveTab('available')}
                  className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Ver Entrenamientos Disponibles
                </button>
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {trainings.map(training => (
          <div key={training.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            {editingRoutineId === training.id ? (
              <div className="p-4">
                <div className="mb-3">
                  <label htmlFor="routineName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nombre del Entrenamiento
                  </label>
                  <input
                    type="text"
                    id="routineName"
                    value={editedRoutineName}
                    onChange={(e) => setEditedRoutineName(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="routineDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descripción (opcional)
                  </label>
                  <textarea
                    id="routineDescription"
                    value={editedRoutineDescription}
                    onChange={(e) => setEditedRoutineDescription(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows="2"
                  ></textarea>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={() => toggleDay(training.id)}
                  className="w-full p-4 text-left flex justify-between items-center"
                >
                  <div>
                    <div className="flex items-center">
                      <div className="mb-2">
                        {training.phase && (
                          <div className="text-gray-700 dark:text-gray-300 font-medium">Fase {training.phase}</div>
                        )}
                        {training.id && (
                          <div className="text-lg font-bold text-gray-800 dark:text-white">Entrenamiento {training.id}</div>
                        )}
                        <div className="text-md font-semibold text-gray-800 dark:text-white">Cuerpo Completo</div>
                        {training.name && training.name.includes('Empuje') && (
                          <div className="text-md font-semibold text-gray-800 dark:text-white">Énfasis en Empuje</div>
                        )}
                        {training.name && training.name.includes('Tracción') && (
                          <div className="text-md font-semibold text-gray-800 dark:text-white">Énfasis en Tracción</div>
                        )}
                        {training.name && training.name.includes('Piernas') && (
                          <div className="text-md font-semibold text-gray-800 dark:text-white">Énfasis en Piernas y Funcional</div>
                        )}
                      </div>
                      {training.progress > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-medium">
                          {training.progress}%
                        </span>
                      )}
                      {training.isArchived && (
                        <span className="ml-2 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs font-medium">
                          Archivado
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {training.recommendedDay || 'Flexible'} • {training.exercises?.length || 0} ejercicios
                    </p>
                    {/* Eliminamos la descripción detallada del entrenamiento */}
                  </div>

                  <div className="flex items-center">
                    <div className="p-2 text-gray-400 dark:text-gray-500">
                      {expandedDay === training.id ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                  </div>
                </button>

                {expandedDay === training.id && (
                  <div className="border-t border-gray-100 dark:border-gray-700">
                    {training.exercises?.map(exercise => (
                      <ExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        dayId={training.id}
                      />
                    ))}

                    <div className="p-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex justify-end space-x-2">
                      {type === 'available' && (
                        <button
                          onClick={() => handleAddRoutine(training.id)}
                          className="p-1.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                          title="Añadir a entrenamientos activos"
                        >
                          <FaPlay size={14} />
                        </button>
                      )}

                      <button
                        onClick={() => handleEditRoutine(training)}
                        className="p-1.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                        title="Editar entrenamiento"
                      >
                        <FaEdit size={14} />
                      </button>

                      <button
                        onClick={(e) => handleArchiveRoutine(e, training.id)}
                        className="p-1.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors"
                        title={training.isArchived ? "Desarchivar entrenamiento" : "Archivar entrenamiento"}
                      >
                        {training.isArchived ? <FaPlay size={14} /> : <FaPause size={14} />}
                      </button>

                      <button
                        onClick={(e) => handleDeleteRoutine(e, training.id)}
                        className="p-1.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                        title="Eliminar entrenamiento"
                      >
                        <FaTrashAlt size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 pt-16 pb-24 max-w-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Planes de Entrenamiento</h1>
        <div className="flex items-center space-x-2">
          <Link
            to="/plans"
            className="text-sm font-medium px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full flex items-center"
          >
            <FaCalendarAlt className="mr-1" size={12} /> Gestionar Planes
          </Link>
          <Link
            to="/plan/new"
            className="text-sm font-medium px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full flex items-center"
          >
            <FaPlus className="mr-1" size={12} /> Nuevo Plan
          </Link>
          <span className="text-sm font-medium px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full">
            Fase {currentPhase}
          </span>
        </div>
      </div>

      {/* Progreso general */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Progreso General</h2>
          <span className="text-sm font-medium">{phaseProgress}%</span>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${
              phaseProgress >= 100
                ? 'bg-green-500'
                : phaseProgress >= 80
                  ? 'bg-yellow-500'
                  : phaseProgress > 0
                    ? 'bg-red-500'
                    : 'bg-gray-300 dark:bg-gray-600'
            }`}
            style={{ width: `${phaseProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Pestañas para las diferentes secciones */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'active'
                ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('active')}
          >
            Entrenamientos Activos
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'available'
                ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('available')}
          >
            Entrenamientos Disponibles
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'historical'
                ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('historical')}
          >
            Entrenamientos Históricos
          </button>
        </div>
      </div>

      {/* Contenido según la pestaña activa */}
      <div className="mb-6">
        {activeTab === 'active' && renderTrainingList(activeTrainings, 'active')}
        {activeTab === 'available' && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                <FaCalendarAlt className="mr-2 text-primary-600" />
                Entrenamientos Disponibles
              </h2>
              <Link
                to="/create-routine"
                className="text-sm font-medium text-primary-600 dark:text-primary-400 flex items-center"
              >
                <FaPlus className="mr-1" /> Crear Nuevo
              </Link>
            </div>
            {renderTrainingList(availableTrainings, 'available')}
          </>
        )}
        {activeTab === 'historical' && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                <FaHistory className="mr-2 text-primary-600" />
                Entrenamientos Históricos
              </h2>
            </div>
            {renderTrainingList(historicalTrainings, 'historical')}
          </>
        )}
      </div>

      {/* Consejos */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 mt-6">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Consejos para tu entrenamiento</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <FaCheck className="text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Realiza siempre un calentamiento adecuado antes de cada sesión</span>
          </li>
          <li className="flex items-start">
            <FaCheck className="text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Mantén una buena técnica en todos los ejercicios</span>
          </li>
          <li className="flex items-start">
            <FaCheck className="text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Ajusta los pesos según tu capacidad actual</span>
          </li>
          <li className="flex items-start">
            <FaCheck className="text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Registra tus entrenamientos para seguir tu progreso</span>
          </li>
          <li className="flex items-start">
            <FaCheck className="text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Descansa adecuadamente entre sesiones (24-48 horas para cada grupo muscular)</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PlanPage;
