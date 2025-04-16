import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaPlus, FaTimes, FaChevronLeft, FaSync } from 'react-icons/fa';
// Importar los datos de ejercicios directamente
import exerciseLibrary from '../data/exerciseLibrary';
import { useWorkout } from '../context/WorkoutContext';

const ExerciseLibraryPage = () => {
  // Obtener los ejercicios del contexto
  const { exercises: contextExercises } = useWorkout();

  // Estados
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos de ejercicios
  useEffect(() => {
    try {
      if (exerciseLibrary && exerciseLibrary.length > 0) {
        setExercises(exerciseLibrary);
        setFilteredExercises(exerciseLibrary);
        console.log('Datos cargados:', exerciseLibrary.length);
      } else {
        setError('No se encontraron ejercicios en la biblioteca');
      }
    } catch (err) {
      console.error('Error al cargar la biblioteca de ejercicios:', err);
      setError(`Error al cargar datos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Extraer valores únicos para filtros
  const allMuscleGroups = exercises.length > 0
    ? [...new Set(exercises.flatMap(ex => ex.muscleGroups || []))].sort()
    : [];
  const allCategories = exercises.length > 0
    ? [...new Set(exercises.map(ex => ex.category))].sort()
    : [];
  const allEquipment = exercises.length > 0
    ? [...new Set(exercises.map(ex => ex.equipment))].sort()
    : [];

  // Manejar búsqueda y filtros
  useEffect(() => {
    if (exercises.length === 0) return;

    let result = [...exercises];

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(ex =>
        ex.name.toLowerCase().includes(term) ||
        ex.description.toLowerCase().includes(term)
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
  }, [searchTerm, selectedMuscleGroups, selectedCategory, selectedEquipment, exercises]);

  // Funciones auxiliares
  const toggleMuscleGroup = (muscle) => {
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

  // Función para recargar los datos manualmente
  const loadExerciseData = () => {
    setLoading(true);
    setError(null);
    try {
      if (exerciseLibrary && exerciseLibrary.length > 0) {
        setExercises(exerciseLibrary);
        setFilteredExercises(exerciseLibrary);
        console.log('Datos recargados:', exerciseLibrary.length);
      } else {
        setError('No se pudieron cargar los datos de ejercicios');
      }
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError(`Error al cargar datos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Biblioteca de Ejercicios</h1>
        <div className="flex gap-2">
          <button
            onClick={loadExerciseData}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <FaSync className="mr-2" /> Recargar Datos
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <FaFilter /> {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </button>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <button
            onClick={loadExerciseData}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Indicador de carga */}
      {loading && (
        <div className="text-center py-4 mb-4">
          <p className="text-gray-500 text-lg">Cargando ejercicios...</p>
        </div>
      )}

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
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        )}
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
                    onClick={() => toggleMuscleGroup(muscle)}
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
      {!loading && !error && filteredExercises.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No hay ejercicios disponibles.</p>
          <button
            onClick={loadExerciseData}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <FaPlus className="mr-2" /> Cargar Ejercicios
          </button>
        </div>
      )}

      {!loading && !error && filteredExercises.length > 0 && (
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

              {selectedExercise.videoUrl && (
                <div className="mt-4">
                  <h3 className="font-medium text-gray-700 mb-2">Video tutorial</h3>
                  <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Ver video tutorial sobre cómo realizar correctamente este ejercicio</p>
                      </div>
                    </div>
                    <a
                      href={selectedExercise.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center ml-4 whitespace-nowrap"
                    >
                      Ver video
                    </a>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeExerciseDetails}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
                >
                  <FaChevronLeft className="mr-2" /> Volver a la biblioteca
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
