import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaArrowUp, FaArrowDown, FaSave, FaSearch, FaFilter, FaDumbbell, FaClipboardList } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';
import exerciseData from '../data/exerciseLibrary';

const CreateRoutinePage = () => {
  const navigate = useNavigate();
  const { saveRoutine } = useWorkout();

  const [trainingName, setTrainingName] = useState('');
  const [trainingDescription, setTrainingDescription] = useState('');
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');

  // Obtener todos los grupos musculares únicos
  const allMuscleGroups = [...new Set(exerciseData.flatMap(ex => ex.muscleGroups))].sort();

  useEffect(() => {
    setFilteredExercises(exerciseData);
  }, []);

  useEffect(() => {
    let result = exerciseData;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      result = result.filter(ex =>
        ex.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por grupo muscular
    if (selectedMuscleGroup) {
      result = result.filter(ex =>
        ex.muscleGroups.includes(selectedMuscleGroup)
      );
    }

    setFilteredExercises(result);
  }, [searchTerm, selectedMuscleGroup]);

  const addExerciseToTraining = (exercise) => {
    const newExercise = {
      ...exercise,
      sets: 3,
      reps: '8-12',
      weight: 0,
      trainingExerciseId: Date.now() // ID único para este ejercicio en el entrenamiento
    };

    setSelectedExercises(prev => [...prev, newExercise]);
  };

  const removeExercise = (trainingExerciseId) => {
    setSelectedExercises(prev =>
      prev.filter(ex => ex.trainingExerciseId !== trainingExerciseId)
    );
  };

  const moveExercise = (index, direction) => {
    const newExercises = [...selectedExercises];
    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= newExercises.length) return;

    // Intercambiar ejercicios
    [newExercises[index], newExercises[newIndex]] = [newExercises[newIndex], newExercises[index]];

    setSelectedExercises(newExercises);
  };

  const updateExerciseDetails = (trainingExerciseId, field, value) => {
    setSelectedExercises(prev =>
      prev.map(ex =>
        ex.trainingExerciseId === trainingExerciseId
          ? { ...ex, [field]: value }
          : ex
      )
    );
  };

  const handleSaveTraining = () => {
    if (!trainingName.trim()) {
      alert('Por favor, ingresa un nombre para el entrenamiento');
      return;
    }

    if (selectedExercises.length === 0) {
      alert('Por favor, añade al menos un ejercicio al entrenamiento');
      return;
    }

    const newTraining = {
      id: Date.now(),
      name: trainingName,
      description: trainingDescription,
      exercises: selectedExercises,
      createdAt: new Date().toISOString()
    };

    saveRoutine(newTraining);
    navigate('/plan');
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-16 pb-24 max-w-6xl animate-fadeIn">
      {/* Encabezado con título */}
      <div className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <FaDumbbell className="text-white/80" />
          Crear Nuevo Entrenamiento
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Panel izquierdo: Detalles del entrenamiento y ejercicios seleccionados */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-primary-100 text-primary-700 p-1.5 rounded-lg">
                <FaClipboardList />
              </span>
              Detalles del Entrenamiento
            </h2>

            <div className="space-y-5">
              <div>
                <label htmlFor="trainingName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Entrenamiento *
                </label>
                <input
                  type="text"
                  id="trainingName"
                  value={trainingName}
                  onChange={(e) => setTrainingName(e.target.value)}
                  className="block w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 shadow-sm"
                  placeholder="Ej: Entrenamiento de Fuerza, Día de Piernas, etc."
                />
              </div>

              <div>
                <label htmlFor="trainingDescription" className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  id="trainingDescription"
                  value={trainingDescription}
                  onChange={(e) => setTrainingDescription(e.target.value)}
                  rows="4"
                  className="block w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 shadow-sm"
                  placeholder="Describe el objetivo de este entrenamiento..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <span className="bg-primary-100 text-primary-700 p-1.5 rounded-lg">
                  <FaDumbbell />
                </span>
                Ejercicios Seleccionados
              </h2>
              <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">{selectedExercises.length} ejercicios</span>
            </div>

            {selectedExercises.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                <div className="text-gray-400 mb-3">
                  <FaDumbbell className="h-12 w-12 mx-auto opacity-50" />
                </div>
                <p className="text-gray-600 font-medium">No hay ejercicios seleccionados</p>
                <p className="text-sm text-gray-500 mt-2">Busca y añade ejercicios desde el panel derecho</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedExercises.map((exercise, index) => (
                  <div key={exercise.trainingExerciseId} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">{exercise.name}</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {exercise.muscleGroups.map(muscle => (
                            <span key={muscle} className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded">
                              {muscle}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => moveExercise(index, -1)}
                          disabled={index === 0}
                          className={`p-1 rounded ${index === 0 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                          <FaArrowUp />
                        </button>
                        <button
                          onClick={() => moveExercise(index, 1)}
                          disabled={index === selectedExercises.length - 1}
                          className={`p-1 rounded ${index === selectedExercises.length - 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                          <FaArrowDown />
                        </button>
                        <button
                          onClick={() => removeExercise(exercise.trainingExerciseId)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mt-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Series
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={exercise.sets}
                          onChange={(e) => updateExerciseDetails(exercise.trainingExerciseId, 'sets', parseInt(e.target.value) || 1)}
                          className="block w-full p-1.5 text-sm border border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Repeticiones
                        </label>
                        <input
                          type="text"
                          value={exercise.reps}
                          onChange={(e) => updateExerciseDetails(exercise.routineExerciseId, 'reps', e.target.value)}
                          className="block w-full p-1.5 text-sm border border-gray-300 rounded"
                          placeholder="Ej: 10 o 8-12"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Peso (kg)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={exercise.weight}
                          onChange={(e) => updateExerciseDetails(exercise.routineExerciseId, 'weight', parseFloat(e.target.value) || 0)}
                          className="block w-full p-1.5 text-sm border border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8">
              <button
                onClick={handleSaveTraining}
                disabled={!trainingName.trim() || selectedExercises.length === 0}
                className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium text-base shadow-sm ${
                  !trainingName.trim() || selectedExercises.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-md'
                } transition-all`}
              >
                <FaSave className="text-lg" /> Guardar Entrenamiento
              </button>
              {(!trainingName.trim() || selectedExercises.length === 0) && (
                <p className="text-center text-sm text-gray-500 mt-2">
                  {!trainingName.trim() ? 'Debes asignar un nombre al entrenamiento' : 'Debes añadir al menos un ejercicio'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Panel derecho: Búsqueda y selección de ejercicios */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 sticky top-20 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-primary-100 text-primary-700 p-1.5 rounded-lg">
                <FaPlus />
              </span>
              Añadir Ejercicios
            </h2>

            <div className="space-y-5">
              <div>
                <label htmlFor="searchExercise" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <FaSearch className="text-gray-400 text-xs" />
                  Buscar Ejercicios
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="searchExercise"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 shadow-sm"
                    placeholder="Nombre del ejercicio..."
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="muscleGroup" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <FaFilter className="text-gray-400 text-xs" />
                  Filtrar por Grupo Muscular
                </label>
                <select
                  id="muscleGroup"
                  value={selectedMuscleGroup}
                  onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                  className="block w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 shadow-sm"
                >
                  <option value="">Todos los grupos musculares</option>
                  {allMuscleGroups.map(muscle => (
                    <option key={muscle} value={muscle}>{muscle}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 max-h-[500px] overflow-y-auto pr-2">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                  Resultados ({filteredExercises.length})
                </h3>
                {(searchTerm || selectedMuscleGroup) && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedMuscleGroup('');
                    }}
                    className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    <FaTimes className="h-3 w-3" /> Limpiar filtros
                  </button>
                )}
              </div>

              {filteredExercises.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                  <div className="text-gray-400 mb-2">
                    <FaSearch className="h-8 w-8 mx-auto opacity-50" />
                  </div>
                  <p className="text-gray-600">No se encontraron ejercicios</p>
                  {(searchTerm || selectedMuscleGroup) && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedMuscleGroup('');
                      }}
                      className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Limpiar filtros
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredExercises.map(exercise => (
                    <div
                      key={exercise.id}
                      className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm hover:shadow"
                    >
                      <div>
                        <h4 className="font-medium text-gray-800">{exercise.name}</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {exercise.muscleGroups.map(muscle => (
                            <span key={muscle} className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded-md">
                              {muscle}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => addExerciseToTraining(exercise)}
                        className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                        aria-label={`Añadir ${exercise.name}`}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoutinePage;
