import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaPlus } from 'react-icons/fa';
import exerciseData from '../data/exerciseLibrary';

const ExerciseLibraryPage = () => {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Obtener todos los grupos musculares, categorías y equipos únicos
  const allMuscleGroups = [...new Set(exerciseData.flatMap(ex => ex.muscleGroups))].sort();
  const allCategories = [...new Set(exerciseData.map(ex => ex.category))].sort();
  const allEquipment = [...new Set(exerciseData.map(ex => ex.equipment))].sort();

  useEffect(() => {
    setExercises(exerciseData);
    setFilteredExercises(exerciseData);
  }, []);

  useEffect(() => {
    let result = exercises;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      result = result.filter(ex => 
        ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por grupos musculares
    if (selectedMuscleGroups.length > 0) {
      result = result.filter(ex => 
        selectedMuscleGroups.some(muscle => ex.muscleGroups.includes(muscle))
      );
    }

    // Filtrar por categoría
    if (selectedCategory) {
      result = result.filter(ex => ex.category === selectedCategory);
    }

    // Filtrar por equipo
    if (selectedEquipment) {
      result = result.filter(ex => ex.equipment === selectedEquipment);
    }

    setFilteredExercises(result);
  }, [exercises, searchTerm, selectedMuscleGroups, selectedCategory, selectedEquipment]);

  const handleMuscleGroupChange = (muscle) => {
    setSelectedMuscleGroups(prev => 
      prev.includes(muscle)
        ? prev.filter(m => m !== muscle)
        : [...prev, muscle]
    );
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedMuscleGroups([]);
    setSelectedCategory('');
    setSelectedEquipment('');
  };

  const showExerciseDetails = (exercise) => {
    setSelectedExercise(exercise);
  };

  const closeExerciseDetails = () => {
    setSelectedExercise(null);
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Biblioteca de Ejercicios</h1>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <FaFilter /> {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar ejercicios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 animate-slideDown">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro por grupo muscular */}
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Grupos Musculares</h3>
              <div className="flex flex-wrap gap-2">
                {allMuscleGroups.map(muscle => (
                  <button
                    key={muscle}
                    onClick={() => handleMuscleGroupChange(muscle)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedMuscleGroups.includes(muscle)
                        ? 'bg-primary-100 text-primary-800 border-primary-300'
                        : 'bg-gray-100 text-gray-800 border-gray-300'
                    } border`}
                  >
                    {muscle}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro por categoría */}
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Categoría</h3>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Todas las categorías</option>
                {allCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Filtro por equipo */}
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Equipo</h3>
              <select
                value={selectedEquipment}
                onChange={(e) => setSelectedEquipment(e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Todo el equipo</option>
                {allEquipment.map(equipment => (
                  <option key={equipment} value={equipment}>{equipment}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Restablecer Filtros
            </button>
          </div>
        </div>
      )}

      {/* Lista de ejercicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map(exercise => (
          <div 
            key={exercise.id}
            onClick={() => showExerciseDetails(exercise)}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer transform hover:scale-[1.01] relative"
          >
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800">{exercise.name}</h3>
              <div className="flex flex-wrap gap-1 mt-1 mb-2">
                {exercise.muscleGroups.map(muscle => (
                  <span key={muscle} className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded">
                    {muscle}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{exercise.description}</p>
              <div className="mt-2 space-y-1">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium mr-2">Categoría:</span>
                  <span>{exercise.category}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium mr-2">Equipo:</span>
                  <span>{exercise.equipment}</span>
                </div>
              </div>
            </div>
            <div className="absolute top-3 right-3 bg-green-600 text-white p-2 rounded-full shadow-lg hover:bg-green-700 transition-all transform hover:scale-110 z-10">
              <FaPlus />
            </div>
          </div>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No se encontraron ejercicios con los filtros seleccionados.</p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Restablecer Filtros
          </button>
        </div>
      )}

      {/* Modal de detalles del ejercicio */}
      {selectedExercise && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-gray-800">{selectedExercise.name}</h2>
                <button 
                  onClick={closeExerciseDetails}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2 mb-4">
                {selectedExercise.muscleGroups.map(muscle => (
                  <span key={muscle} className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded">
                    {muscle}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Descripción</h3>
                  <p className="text-gray-600">{selectedExercise.description}</p>
                  
                  <div className="mt-4 space-y-2">
                    <div>
                      <span className="font-medium text-gray-700">Categoría: </span>
                      <span className="text-gray-600">{selectedExercise.category}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Equipo: </span>
                      <span className="text-gray-600">{selectedExercise.equipment}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Cómo realizar</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600">
                    {selectedExercise.steps?.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>

              {selectedExercise.gifUrl && (
                <div className="mt-4">
                  <h3 className="font-medium text-gray-700 mb-2">Demostración</h3>
                  <div className="bg-gray-100 rounded-lg p-2 flex justify-center">
                    <img 
                      src={selectedExercise.gifUrl} 
                      alt={`Demostración de ${selectedExercise.name}`} 
                      className="max-h-60 object-contain"
                    />
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeExerciseDetails}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseLibraryPage;
