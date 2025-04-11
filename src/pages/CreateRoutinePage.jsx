import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaArrowUp, FaArrowDown, FaSave } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';
import exerciseData from '../data/exerciseLibrary';

const CreateRoutinePage = () => {
  const navigate = useNavigate();
  const { saveRoutine } = useWorkout();
  
  const [routineName, setRoutineName] = useState('');
  const [routineDescription, setRoutineDescription] = useState('');
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
  
  const addExerciseToRoutine = (exercise) => {
    const newExercise = {
      ...exercise,
      sets: 3,
      reps: '8-12',
      weight: 0,
      routineExerciseId: Date.now() // ID único para este ejercicio en la rutina
    };
    
    setSelectedExercises(prev => [...prev, newExercise]);
  };
  
  const removeExercise = (routineExerciseId) => {
    setSelectedExercises(prev => 
      prev.filter(ex => ex.routineExerciseId !== routineExerciseId)
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
  
  const updateExerciseDetails = (routineExerciseId, field, value) => {
    setSelectedExercises(prev => 
      prev.map(ex => 
        ex.routineExerciseId === routineExerciseId 
          ? { ...ex, [field]: value }
          : ex
      )
    );
  };
  
  const handleSaveRoutine = () => {
    if (!routineName.trim()) {
      alert('Por favor, ingresa un nombre para la rutina');
      return;
    }
    
    if (selectedExercises.length === 0) {
      alert('Por favor, añade al menos un ejercicio a la rutina');
      return;
    }
    
    const newRoutine = {
      id: Date.now(),
      name: routineName,
      description: routineDescription,
      exercises: selectedExercises,
      createdAt: new Date().toISOString()
    };
    
    saveRoutine(newRoutine);
    navigate('/plan');
  };
  
  return (
    <div className="animate-fadeIn">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Crear Nueva Rutina</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Panel izquierdo: Detalles de la rutina y ejercicios seleccionados */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Detalles de la Rutina</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="routineName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Rutina *
                </label>
                <input
                  type="text"
                  id="routineName"
                  value={routineName}
                  onChange={(e) => setRoutineName(e.target.value)}
                  className="block w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Ej: Rutina de Fuerza, Día de Piernas, etc."
                />
              </div>
              
              <div>
                <label htmlFor="routineDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción (opcional)
                </label>
                <textarea
                  id="routineDescription"
                  value={routineDescription}
                  onChange={(e) => setRoutineDescription(e.target.value)}
                  rows="3"
                  className="block w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Describe el objetivo de esta rutina..."
                />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Ejercicios Seleccionados</h2>
              <span className="text-sm text-gray-500">{selectedExercises.length} ejercicios</span>
            </div>
            
            {selectedExercises.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">No hay ejercicios seleccionados</p>
                <p className="text-sm text-gray-400 mt-1">Busca y añade ejercicios desde el panel derecho</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedExercises.map((exercise, index) => (
                  <div key={exercise.routineExerciseId} className="border border-gray-200 rounded-lg p-4">
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
                          onClick={() => removeExercise(exercise.routineExerciseId)}
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
                          onChange={(e) => updateExerciseDetails(exercise.routineExerciseId, 'sets', parseInt(e.target.value) || 1)}
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
            
            <div className="mt-6">
              <button
                onClick={handleSaveRoutine}
                disabled={!routineName.trim() || selectedExercises.length === 0}
                className={`flex items-center justify-center gap-2 w-full py-2 rounded-lg ${
                  !routineName.trim() || selectedExercises.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                } transition-colors`}
              >
                <FaSave /> Guardar Rutina
              </button>
            </div>
          </div>
        </div>
        
        {/* Panel derecho: Búsqueda y selección de ejercicios */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Añadir Ejercicios</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="searchExercise" className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar Ejercicios
                </label>
                <input
                  type="text"
                  id="searchExercise"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Nombre del ejercicio..."
                />
              </div>
              
              <div>
                <label htmlFor="muscleGroup" className="block text-sm font-medium text-gray-700 mb-1">
                  Filtrar por Grupo Muscular
                </label>
                <select
                  id="muscleGroup"
                  value={selectedMuscleGroup}
                  onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                  className="block w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Todos los grupos musculares</option>
                  {allMuscleGroups.map(muscle => (
                    <option key={muscle} value={muscle}>{muscle}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-4 max-h-[500px] overflow-y-auto pr-2">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Resultados ({filteredExercises.length})
              </h3>
              
              {filteredExercises.length === 0 ? (
                <p className="text-center py-4 text-gray-500">No se encontraron ejercicios</p>
              ) : (
                <div className="space-y-2">
                  {filteredExercises.map(exercise => (
                    <div 
                      key={exercise.id}
                      className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <h4 className="font-medium text-gray-800">{exercise.name}</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {exercise.muscleGroups.map(muscle => (
                            <span key={muscle} className="bg-primary-100 text-primary-800 text-xs font-medium px-1.5 py-0.5 rounded">
                              {muscle}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => addExerciseToRoutine(exercise)}
                        className="p-1.5 bg-green-100 text-green-700 rounded-full hover:bg-green-200"
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
