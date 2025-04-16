import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaChevronLeft, FaTimes } from 'react-icons/fa';

// Datos de ejercicios estáticos
const exerciseData = [
  // Entrenamiento 1: Énfasis en Empuje
  {
    id: 1,
    name: "Prensa de piernas",
    description: "Siéntate en la máquina con la espalda apoyada en el respaldo. Coloca los pies en la plataforma a la anchura de los hombros. Empuja la plataforma extendiendo las piernas y luego regresa controladamente a la posición inicial.",
    muscleGroups: ["Cuádriceps", "Glúteos", "Isquiotibiales"],
    category: "Piernas",
    equipment: "Máquina"
  },
  {
    id: 2,
    name: "Sentadilla Goblet con mancuerna",
    description: "De pie con los pies separados a la anchura de los hombros, sostén una mancuerna verticalmente contra el pecho. Baja flexionando las rodillas y caderas, manteniendo la espalda recta. Regresa a la posición inicial empujando a través de los talones.",
    muscleGroups: ["Cuádriceps", "Glúteos", "Core"],
    category: "Piernas",
    equipment: "Mancuerna"
  },
  {
    id: 3,
    name: "Press de Banca",
    description: "Acuéstate en el banco con los pies apoyados en el suelo. Agarra la barra con las manos a una distancia mayor que la anchura de los hombros. Baja la barra hasta rozar el pecho y empuja hacia arriba hasta extender los brazos.",
    muscleGroups: ["Pecho", "Hombros", "Tríceps"],
    category: "Pecho",
    equipment: "Barra"
  },
  {
    id: 4,
    name: "Press de hombros con mancuernas",
    description: "Sentado o de pie, sostén una mancuerna en cada mano a la altura de los hombros. Empuja las mancuernas hacia arriba hasta extender los brazos y luego bájalas controladamente a la posición inicial.",
    muscleGroups: ["Hombros", "Tríceps"],
    category: "Hombros",
    equipment: "Mancuernas"
  },
  {
    id: 5,
    name: "Extensión de tríceps con polea",
    description: "De pie frente a la polea alta, agarra la cuerda o barra con las manos. Mantén los codos cerca del cuerpo y extiende los antebrazos hacia abajo. Regresa lentamente a la posición inicial.",
    muscleGroups: ["Tríceps"],
    category: "Brazos",
    equipment: "Polea"
  },

  // Entrenamiento 2: Énfasis en Tracción
  {
    id: 6,
    name: "Dominadas",
    description: "Agarra la barra con las palmas hacia afuera y las manos separadas a la anchura de los hombros. Tira de tu cuerpo hacia arriba hasta que tu barbilla esté por encima de la barra. Baja controladamente a la posición inicial.",
    muscleGroups: ["Espalda", "Bíceps", "Antebrazos"],
    category: "Espalda",
    equipment: "Peso corporal"
  },
  {
    id: 7,
    name: "Remo con barra",
    description: "Inclínate hacia adelante con las rodillas ligeramente flexionadas y agarra la barra con las manos. Tira de la barra hacia el abdomen, manteniendo la espalda recta. Baja la barra controladamente a la posición inicial.",
    muscleGroups: ["Espalda", "Bíceps"],
    category: "Espalda",
    equipment: "Barra"
  },
  {
    id: 8,
    name: "Curl de bíceps con barra",
    description: "De pie, agarra la barra con las palmas hacia arriba y las manos separadas a la anchura de los hombros. Flexiona los codos para levantar la barra hacia los hombros. Baja controladamente a la posición inicial.",
    muscleGroups: ["Bíceps", "Antebrazos"],
    category: "Brazos",
    equipment: "Barra"
  },
  {
    id: 9,
    name: "Remo en máquina",
    description: "Siéntate en la máquina con el pecho apoyado en el soporte. Agarra las manijas y tira hacia atrás, llevando los codos hacia atrás y juntando las escápulas. Regresa controladamente a la posición inicial.",
    muscleGroups: ["Espalda", "Trapecios", "Romboides"],
    category: "Espalda",
    equipment: "Máquina"
  },

  // Entrenamiento 3: Énfasis en Piernas y Funcional
  {
    id: 10,
    name: "Sentadilla búlgara",
    description: "Coloca un pie detrás de ti sobre un banco. Baja flexionando la rodilla delantera hasta que el muslo esté paralelo al suelo. Empuja a través del talón para volver a la posición inicial. Repite con la otra pierna.",
    muscleGroups: ["Cuádriceps", "Glúteos", "Equilibrio"],
    category: "Piernas",
    equipment: "Peso corporal"
  },
  {
    id: 11,
    name: "Peso Muerto",
    description: "Colócate de pie con los pies a la anchura de las caderas y la barra sobre los pies. Flexiona las caderas y rodillas para agarrar la barra. Levanta la barra extendiendo las caderas y rodillas. Baja controladamente a la posición inicial.",
    muscleGroups: ["Espalda", "Piernas", "Glúteos"],
    category: "Espalda",
    equipment: "Barra"
  },
  {
    id: 12,
    name: "Elevaciones laterales",
    description: "De pie con una mancuerna en cada mano a los lados del cuerpo. Levanta las mancuernas lateralmente hasta la altura de los hombros. Baja controladamente a la posición inicial.",
    muscleGroups: ["Hombros", "Deltoides lateral"],
    category: "Hombros",
    equipment: "Mancuernas"
  },
  {
    id: 13,
    name: "Plancha abdominal",
    description: "Apóyate sobre los antebrazos y las puntas de los pies, manteniendo el cuerpo en línea recta. Mantén la posición activando el core y respirando normalmente.",
    muscleGroups: ["Core", "Abdominales", "Estabilizadores"],
    category: "Core",
    equipment: "Peso corporal"
  },
  {
    id: 14,
    name: "Zancadas",
    description: "De pie, da un paso hacia adelante y baja flexionando ambas rodillas hasta formar ángulos de 90 grados. Empuja con el pie delantero para volver a la posición inicial. Alterna las piernas.",
    muscleGroups: ["Cuádriceps", "Glúteos", "Isquiotibiales"],
    category: "Piernas",
    equipment: "Peso corporal"
  },
  {
    id: 15,
    name: "Extensión de espalda",
    description: "Acuéstate boca abajo con las manos detrás de la cabeza. Levanta el pecho del suelo contrayendo los músculos de la espalda. Baja controladamente a la posición inicial.",
    muscleGroups: ["Espalda", "Lumbares", "Estabilizadores"],
    category: "Espalda",
    equipment: "Peso corporal"
  }
];

// Extraer categorías, grupos musculares y equipos únicos
const allCategories = [...new Set(exerciseData.map(ex => ex.category))].sort();
const allMuscleGroups = [...new Set(exerciseData.flatMap(ex => ex.muscleGroups))].sort();
const allEquipment = [...new Set(exerciseData.map(ex => ex.equipment))].sort();

const StandaloneExerciseLibrary = () => {
  // Estados
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Filtrar ejercicios
  const filteredExercises = exerciseData.filter(exercise => {
    // Filtrar por término de búsqueda
    if (searchTerm && !exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !exercise.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Filtrar por categoría
    if (selectedCategory && exercise.category !== selectedCategory) {
      return false;
    }

    // Filtrar por grupo muscular
    if (selectedMuscleGroup && !exercise.muscleGroups.includes(selectedMuscleGroup)) {
      return false;
    }

    // Filtrar por equipo
    if (selectedEquipment && exercise.equipment !== selectedEquipment) {
      return false;
    }

    return true;
  });

  // Resetear filtros
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedMuscleGroup('');
    setSelectedEquipment('');
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-16 pb-24 max-w-lg">
      {/* Encabezado con título y botones */}
      <div className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Biblioteca de Ejercicios</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg transition-colors"
              aria-label={showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
            >
              <FaFilter className="text-sm" />
              <span className="text-sm">{showFilters ? 'Ocultar' : 'Filtros'}</span>
            </button>
            <Link
              to="/"
              className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg transition-colors"
              aria-label="Volver a la página principal"
            >
              <FaChevronLeft className="text-sm" />
              <span className="text-sm">Volver</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar ejercicios..."
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Limpiar búsqueda"
          >
            <FaTimes className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md mb-6 border border-gray-100 dark:border-gray-700 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro por categoría */}
            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Categoría</h3>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Todas las categorías</option>
                {allCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Filtro por grupo muscular */}
            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Grupo Muscular</h3>
              <select
                value={selectedMuscleGroup}
                onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                className="block w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Todos los grupos musculares</option>
                {allMuscleGroups.map(muscle => (
                  <option key={muscle} value={muscle}>{muscle}</option>
                ))}
              </select>
            </div>

            {/* Filtro por equipo */}
            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Equipo</h3>
              <select
                value={selectedEquipment}
                onChange={(e) => setSelectedEquipment(e.target.value)}
                className="block w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Todo el equipo</option>
                {allEquipment.map(equipment => (
                  <option key={equipment} value={equipment}>{equipment}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              <FaTimes className="h-3 w-3" />
              Restablecer Filtros
            </button>
          </div>
        </div>
      )}

      {/* Lista de ejercicios */}
      {filteredExercises.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredExercises.map(exercise => (
            <div
              key={exercise.id}
              onClick={() => setSelectedExercise(exercise)}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer transform hover:scale-[1.01] overflow-hidden"
            >
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">{exercise.name}</h3>
                <div className="flex flex-wrap gap-1 mt-2 mb-3">
                  {exercise.muscleGroups.map(muscle => (
                    <span key={muscle} className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 text-xs font-medium px-2 py-1 rounded-md">
                      {muscle}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{exercise.description}</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Categoría</div>
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{exercise.category}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Equipo</div>
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{exercise.equipment}</div>
                  </div>
                </div>
                <button className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
                  Ver detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-gray-400 mb-3">
            <FaSearch className="h-12 w-12 mx-auto opacity-50" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">No se encontraron ejercicios que coincidan con los criterios de búsqueda.</p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center gap-2"
          >
            <FaTimes className="h-3 w-3" />
            Restablecer Filtros
          </button>
        </div>
      )}

      {/* Modal de detalles del ejercicio */}
      {selectedExercise && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up">
            {/* Encabezado del modal con gradiente */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-5 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">{selectedExercise.name}</h2>
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="text-white/80 hover:text-white transition-colors rounded-full p-1 hover:bg-white/10"
                  aria-label="Cerrar modal"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <span className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 p-1 rounded-md mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  Descripción
                </h3>
                <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">{selectedExercise.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <span className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 p-1 rounded-md mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Músculos trabajados
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedExercise.muscleGroups.map(muscle => (
                    <span key={muscle} className="px-3 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 rounded-lg text-sm">
                      {muscle}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                    <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1 text-sm">Categoría</h3>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">{selectedExercise.category}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                    <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1 text-sm">Equipo</h3>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">{selectedExercise.equipment}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <FaChevronLeft className="h-3 w-3" />
                  Volver a la biblioteca
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StandaloneExerciseLibrary;
