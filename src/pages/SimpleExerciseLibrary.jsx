import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

// Datos de ejercicios estáticos para evitar problemas de importación
const staticExercises = [
  // Entrenamiento 1: Énfasis en Empuje
  {
    id: 1,
    name: "Prensa de piernas",
    description: "Siéntate en la máquina con la espalda apoyada en el respaldo. Coloca los pies en la plataforma a la anchura de los hombros. Empuja la plataforma extendiendo las piernas y luego regresa controladamente a la posición inicial.",
    muscleGroups: ["Cuádriceps", "Glúteos", "Isquiotibiales"],
    category: "Piernas",
    equipment: "Máquina",
    steps: [
      "Siéntate en la máquina con la espalda completamente apoyada en el respaldo",
      "Coloca los pies en la plataforma a la anchura de los hombros",
      "Desbloquea los seguros de la máquina",
      "Empuja la plataforma extendiendo las piernas (sin bloquear las rodillas)",
      "Regresa controladamente a la posición inicial doblando las rodillas"
    ]
  },
  {
    id: 2,
    name: "Sentadilla Goblet con mancuerna",
    description: "De pie con los pies separados a la anchura de los hombros, sostén una mancuerna verticalmente contra el pecho. Baja flexionando las rodillas y caderas, manteniendo la espalda recta. Regresa a la posición inicial empujando a través de los talones.",
    muscleGroups: ["Cuádriceps", "Glúteos", "Core"],
    category: "Piernas",
    equipment: "Mancuerna",
    steps: [
      "Sostén una mancuerna verticalmente contra el pecho con ambas manos",
      "Coloca los pies a la anchura de los hombros",
      "Baja flexionando las rodillas y caderas, manteniendo la espalda recta",
      "Desciende hasta que los muslos estén paralelos al suelo",
      "Regresa a la posición inicial empujando a través de los talones"
    ]
  },
  {
    id: 3,
    name: "Press de Banca",
    description: "Acuéstate en el banco con los pies apoyados en el suelo. Agarra la barra con las manos a una distancia mayor que la anchura de los hombros. Baja la barra hasta rozar el pecho y empuja hacia arriba hasta extender los brazos.",
    muscleGroups: ["Pecho", "Hombros", "Tríceps"],
    category: "Pecho",
    equipment: "Barra",
    steps: [
      "Acuéstate en un banco plano con los pies apoyados en el suelo",
      "Agarra la barra con las manos a una distancia mayor que la anchura de los hombros",
      "Baja la barra lentamente hasta rozar el pecho",
      "Empuja la barra hacia arriba hasta extender los brazos",
      "Mantén el control durante todo el movimiento"
    ]
  },
  {
    id: 4,
    name: "Press de hombros con mancuernas",
    description: "Sentado o de pie, sostén una mancuerna en cada mano a la altura de los hombros. Empuja las mancuernas hacia arriba hasta extender los brazos y luego bájalas controladamente a la posición inicial.",
    muscleGroups: ["Hombros", "Tríceps"],
    category: "Hombros",
    equipment: "Mancuernas",
    steps: [
      "Siéntate o ponte de pie con la espalda recta",
      "Sostén una mancuerna en cada mano a la altura de los hombros",
      "Empuja las mancuernas hacia arriba hasta extender los brazos",
      "Baja las mancuernas controladamente a la posición inicial",
      "Mantén el core activado durante todo el ejercicio"
    ]
  },
  {
    id: 5,
    name: "Extensión de tríceps con polea",
    description: "De pie frente a la polea alta, agarra la cuerda o barra con las manos. Mantén los codos cerca del cuerpo y extiende los antebrazos hacia abajo. Regresa lentamente a la posición inicial.",
    muscleGroups: ["Tríceps"],
    category: "Brazos",
    equipment: "Polea",
    steps: [
      "Colócate de pie frente a la polea alta",
      "Agarra la cuerda o barra con ambas manos",
      "Mantén los codos pegados al cuerpo",
      "Extiende los antebrazos hacia abajo hasta que estén completamente estirados",
      "Regresa lentamente a la posición inicial"
    ]
  },

  // Entrenamiento 2: Énfasis en Tracción
  {
    id: 6,
    name: "Dominadas",
    description: "Agarra la barra con las palmas hacia afuera y las manos separadas a la anchura de los hombros. Tira de tu cuerpo hacia arriba hasta que tu barbilla esté por encima de la barra. Baja controladamente a la posición inicial.",
    muscleGroups: ["Espalda", "Bíceps", "Antebrazos"],
    category: "Espalda",
    equipment: "Peso corporal",
    steps: [
      "Agarra la barra con las palmas hacia afuera (agarre prono)",
      "Cuelga completamente con los brazos extendidos",
      "Tira de tu cuerpo hacia arriba hasta que tu barbilla esté por encima de la barra",
      "Baja controladamente hasta la posición inicial",
      "Mantén la tensión en la espalda durante todo el movimiento"
    ]
  },
  {
    id: 7,
    name: "Remo con barra",
    description: "Inclínate hacia adelante con las rodillas ligeramente flexionadas y agarra la barra con las manos. Tira de la barra hacia el abdomen, manteniendo la espalda recta. Baja la barra controladamente a la posición inicial.",
    muscleGroups: ["Espalda", "Bíceps"],
    category: "Espalda",
    equipment: "Barra",
    steps: [
      "Inclínate hacia adelante con las rodillas ligeramente flexionadas",
      "Agarra la barra con las manos a la anchura de los hombros",
      "Mantén la espalda recta y el core activado",
      "Tira de la barra hacia el abdomen, juntando las escápulas",
      "Baja la barra controladamente a la posición inicial"
    ]
  },
  {
    id: 8,
    name: "Curl de bíceps con barra",
    description: "De pie, agarra la barra con las palmas hacia arriba y las manos separadas a la anchura de los hombros. Flexiona los codos para levantar la barra hacia los hombros. Baja controladamente a la posición inicial.",
    muscleGroups: ["Bíceps", "Antebrazos"],
    category: "Brazos",
    equipment: "Barra",
    steps: [
      "De pie, agarra la barra con las palmas hacia arriba",
      "Mantén los codos pegados al cuerpo",
      "Flexiona los codos para levantar la barra hacia los hombros",
      "Aprieta los bíceps en la parte superior del movimiento",
      "Baja controladamente a la posición inicial"
    ]
  },
  {
    id: 9,
    name: "Remo en máquina",
    description: "Siéntate en la máquina con el pecho apoyado en el soporte. Agarra las manijas y tira hacia atrás, llevando los codos hacia atrás y juntando las escápulas. Regresa controladamente a la posición inicial.",
    muscleGroups: ["Espalda", "Trapecios", "Romboides"],
    category: "Espalda",
    equipment: "Máquina",
    steps: [
      "Siéntate en la máquina con el pecho apoyado en el soporte",
      "Agarra las manijas con ambas manos",
      "Tira hacia atrás, llevando los codos hacia atrás",
      "Junta las escápulas en la parte posterior del movimiento",
      "Regresa controladamente a la posición inicial"
    ]
  },

  // Entrenamiento 3: Énfasis en Piernas y Funcional
  {
    id: 10,
    name: "Sentadilla búlgara",
    description: "Coloca un pie detrás de ti sobre un banco. Baja flexionando la rodilla delantera hasta que el muslo esté paralelo al suelo. Empuja a través del talón para volver a la posición inicial. Repite con la otra pierna.",
    muscleGroups: ["Cuádriceps", "Glúteos", "Equilibrio"],
    category: "Piernas",
    equipment: "Peso corporal",
    steps: [
      "Coloca un pie detrás de ti sobre un banco",
      "Mantén la espalda recta y el core activado",
      "Baja flexionando la rodilla delantera hasta que el muslo esté paralelo al suelo",
      "Empuja a través del talón para volver a la posición inicial",
      "Repite con la otra pierna"
    ]
  },
  {
    id: 11,
    name: "Peso Muerto",
    description: "Colócate de pie con los pies a la anchura de las caderas y la barra sobre los pies. Flexiona las caderas y rodillas para agarrar la barra. Levanta la barra extendiendo las caderas y rodillas. Baja controladamente a la posición inicial.",
    muscleGroups: ["Espalda", "Piernas", "Glúteos"],
    category: "Espalda",
    equipment: "Barra",
    steps: [
      "Colócate de pie con los pies a la anchura de las caderas",
      "Flexiona las caderas y rodillas para agarrar la barra",
      "Mantén la espalda recta y el pecho hacia arriba",
      "Levanta la barra extendiendo las caderas y rodillas simultáneamente",
      "Baja la barra controladamente manteniendo la espalda recta"
    ]
  },
  {
    id: 12,
    name: "Elevaciones laterales",
    description: "De pie con una mancuerna en cada mano a los lados del cuerpo. Levanta las mancuernas lateralmente hasta la altura de los hombros. Baja controladamente a la posición inicial.",
    muscleGroups: ["Hombros", "Deltoides lateral"],
    category: "Hombros",
    equipment: "Mancuernas",
    steps: [
      "De pie con una mancuerna en cada mano a los lados del cuerpo",
      "Mantén una ligera flexión en los codos",
      "Levanta las mancuernas lateralmente hasta la altura de los hombros",
      "Mantén una breve pausa en la parte superior",
      "Baja controladamente a la posición inicial"
    ]
  },
  {
    id: 13,
    name: "Plancha abdominal",
    description: "Apóyate sobre los antebrazos y las puntas de los pies, manteniendo el cuerpo en línea recta. Mantén la posición activando el core y respirando normalmente.",
    muscleGroups: ["Core", "Abdominales", "Estabilizadores"],
    category: "Core",
    equipment: "Peso corporal",
    steps: [
      "Apóyate sobre los antebrazos y las puntas de los pies",
      "Mantén el cuerpo en línea recta desde la cabeza hasta los talones",
      "Activa el core contrayendo los abdominales",
      "Mantén la posición respirando normalmente",
      "Evita arquear la espalda o elevar las caderas"
    ]
  },
  {
    id: 14,
    name: "Zancadas",
    description: "De pie, da un paso hacia adelante y baja flexionando ambas rodillas hasta formar ángulos de 90 grados. Empuja con el pie delantero para volver a la posición inicial. Alterna las piernas.",
    muscleGroups: ["Cuádriceps", "Glúteos", "Isquiotibiales"],
    category: "Piernas",
    equipment: "Peso corporal",
    steps: [
      "De pie con los pies juntos",
      "Da un paso hacia adelante con una pierna",
      "Baja flexionando ambas rodillas hasta formar ángulos de 90 grados",
      "Empuja con el pie delantero para volver a la posición inicial",
      "Alterna las piernas en cada repetición"
    ]
  },
  {
    id: 15,
    name: "Extensión de espalda",
    description: "Acuéstate boca abajo con las manos detrás de la cabeza. Levanta el pecho del suelo contrayendo los músculos de la espalda. Baja controladamente a la posición inicial.",
    muscleGroups: ["Espalda", "Lumbares", "Estabilizadores"],
    category: "Espalda",
    equipment: "Peso corporal",
    steps: [
      "Acuéstate boca abajo con las manos detrás de la cabeza",
      "Mantén las piernas extendidas y apoyadas en el suelo",
      "Levanta el pecho del suelo contrayendo los músculos de la espalda",
      "Mantén una breve pausa en la parte superior",
      "Baja controladamente a la posición inicial"
    ]
  }
];

const SimpleExerciseLibrary = () => {
  // Estados
  const [exercises, setExercises] = useState(staticExercises);
  const [filteredExercises, setFilteredExercises] = useState(staticExercises);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Obtener todos los grupos musculares, categorías y equipos únicos
  const allMuscleGroups = [...new Set(exercises.flatMap(ex => ex.muscleGroups))].sort();
  const allCategories = [...new Set(exercises.map(ex => ex.category))].sort();
  const allEquipment = [...new Set(exercises.map(ex => ex.equipment))].sort();

  // Filtrar ejercicios cuando cambian los criterios de búsqueda
  useEffect(() => {
    let result = [...exercises];

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(ex =>
        ex.name.toLowerCase().includes(term) ||
        ex.description.toLowerCase().includes(term)
      );
    }

    // Filtrar por grupos musculares seleccionados
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

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Biblioteca de Ejercicios</h1>
        <div className="flex flex-wrap gap-3 w-full md:w-auto justify-center md:justify-end">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors min-w-[140px]"
          >
            <FaFilter className="text-sm" /> {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </button>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors min-w-[140px]"
          >
            <FaChevronLeft className="text-sm" /> Volver
          </button>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar ejercicios..."
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <FaTimes />
          </button>
        )}
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6 animate-slideDown">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro por grupo muscular */}
            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Grupos Musculares</h3>
              <div className="flex flex-wrap gap-2">
                {allMuscleGroups.map(muscle => (
                  <button
                    key={muscle}
                    onClick={() => toggleMuscleGroup(muscle)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedMuscleGroups.includes(muscle)
                        ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700'
                        : 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
                    } border`}
                  >
                    {muscle}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro por categoría */}
            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Categoría</h3>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">Todas las categorías</option>
                {allCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Filtro por equipo */}
            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Equipo</h3>
              <select
                value={selectedEquipment}
                onChange={(e) => setSelectedEquipment(e.target.value)}
                className="block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Restablecer Filtros
            </button>
          </div>
        </div>
      )}

      {/* Lista de ejercicios */}
      {filteredExercises.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map(exercise => (
            <div
              key={exercise.id}
              onClick={() => showExerciseDetails(exercise)}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer transform hover:scale-[1.01] relative"
            >
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">{exercise.name}</h3>
                <div className="flex flex-wrap gap-1 mt-1 mb-2">
                  {exercise.muscleGroups.map(muscle => (
                    <span key={muscle} className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-medium px-2 py-0.5 rounded">
                      {muscle}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">{exercise.description}</p>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium mr-2">Categoría:</span>
                    <span>{exercise.category}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium mr-2">Equipo:</span>
                    <span>{exercise.equipment}</span>
                  </div>
                </div>
                <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Ver detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300">No se encontraron ejercicios que coincidan con los criterios de búsqueda.</p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Restablecer Filtros
          </button>
        </div>
      )}

      {/* Modal de detalles del ejercicio */}
      {selectedExercise && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{selectedExercise.name}</h2>
                <button
                  onClick={closeExerciseDetails}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Descripción</h3>
                  <p className="text-gray-600 dark:text-gray-400">{selectedExercise.description}</p>

                  <div className="mt-4 space-y-2">
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Categoría: </span>
                      <span className="text-gray-600 dark:text-gray-400">{selectedExercise.category}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Equipo: </span>
                      <span className="text-gray-600 dark:text-gray-400">{selectedExercise.equipment}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Cómo realizar</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
                    {selectedExercise.steps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Músculos trabajados</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedExercise.muscleGroups.map(muscle => (
                    <span key={muscle} className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                      {muscle}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={closeExerciseDetails}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
                >
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

export default SimpleExerciseLibrary;
