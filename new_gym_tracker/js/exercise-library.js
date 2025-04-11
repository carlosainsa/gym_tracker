// Script para la biblioteca de ejercicios

document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let filteredExercises = [];

    // Elementos del DOM
    const exerciseList = document.getElementById('exercise-list');
    const categoryFilter = document.getElementById('category-filter');
    const muscleFilter = document.getElementById('muscle-filter');
    const equipmentFilter = document.getElementById('equipment-filter');
    const searchInput = document.getElementById('search-input');
    const exerciseModal = document.getElementById('exercise-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    const closeModal = document.getElementById('close-modal');

    // Datos de ejercicios incorporados directamente en el código
    const exerciseData = {
      "exercises": [
        {
          "id": "prensa-piernas",
          "name": "Prensa de piernas",
          "muscleGroups": ["Cuádriceps", "Glúteos", "Isquiotibiales"],
          "description": "Siéntate en la máquina con la espalda apoyada en el respaldo. Coloca los pies en la plataforma a la anchura de los hombros. Empuja la plataforma extendiendo las piernas y luego regresa controladamente a la posición inicial.",
          "category": "Piernas",
          "equipment": "Máquina",
          "difficulty": "Principiante",
          "image": "prensa-piernas.jpg",
          "animation": "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/leg-press-machine.gif",
          "tips": ["Mantén la espalda baja apoyada en el respaldo", "No bloquees completamente las rodillas al extender", "Ajusta la posición de los pies para enfocarte en diferentes músculos"]
        },
        {
          "id": "sentadilla-goblet",
          "name": "Sentadilla Goblet con mancuerna",
          "muscleGroups": ["Cuádriceps", "Glúteos", "Core"],
          "description": "Sujeta una mancuerna verticalmente contra el pecho, con los codos hacia abajo. Separa los pies a la anchura de los hombros, baja las caderas como si te sentaras en una silla, manteniendo la espalda recta. Regresa a la posición inicial.",
          "category": "Piernas",
          "equipment": "Mancuerna",
          "difficulty": "Principiante",
          "image": "sentadilla-goblet.jpg",
          "animation": "https://www.inspireusafoundation.org/wp-content/uploads/2022/03/goblet-squat.gif",
          "tips": ["Mantén el pecho elevado durante todo el movimiento", "Baja hasta que los muslos estén paralelos al suelo", "Empuja a través de los talones para subir"]
        },
        {
          "id": "extension-piernas",
          "name": "Extensión de piernas",
          "muscleGroups": ["Cuádriceps"],
          "description": "Siéntate en la máquina con la espalda apoyada en el respaldo. Coloca los tobillos detrás del rodillo acolchado. Extiende las piernas hasta que estén completamente rectas y luego baja controladamente.",
          "category": "Piernas",
          "equipment": "Máquina",
          "difficulty": "Principiante",
          "image": "extension-piernas.jpg",
          "animation": "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/leg-extension.gif",
          "tips": ["Mantén la espalda apoyada en el respaldo durante todo el movimiento", "Extiende completamente las piernas en la parte superior", "Baja el peso de forma controlada"]
        },
        {
          "id": "curl-femoral",
          "name": "Curl femoral tumbado",
          "muscleGroups": ["Isquiotibiales", "Glúteos"],
          "description": "Túmbate boca abajo en la máquina con los tobillos debajo del rodillo acolchado. Flexiona las rodillas para llevar los talones hacia los glúteos y luego baja controladamente.",
          "category": "Piernas",
          "equipment": "Máquina",
          "difficulty": "Principiante",
          "image": "curl-femoral.jpg",
          "animation": "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/lying-leg-curl.gif",
          "tips": ["Mantén las caderas apoyadas en el banco durante todo el movimiento", "Evita levantar las caderas al flexionar las rodillas", "Contrae los isquiotibiales en la parte superior del movimiento"]
        },
        {
          "id": "abduccion-cadera",
          "name": "Abducción de cadera",
          "muscleGroups": ["Glúteo medio", "Estabilizadores de cadera"],
          "description": "Siéntate en la máquina con las piernas juntas y las almohadillas contra la parte exterior de los muslos. Separa las piernas hacia afuera contra la resistencia y luego regresa controladamente.",
          "category": "Piernas",
          "equipment": "Máquina",
          "difficulty": "Principiante",
          "image": "abduccion-cadera.jpg"
        },
        {
          "id": "aduccion-cadera",
          "name": "Aducción de cadera",
          "muscleGroups": ["Aductores", "Estabilizadores de cadera"],
          "description": "Siéntate en la máquina con las piernas separadas y las almohadillas contra la parte interior de los muslos. Junta las piernas contra la resistencia y luego regresa controladamente.",
          "category": "Piernas",
          "equipment": "Máquina",
          "difficulty": "Principiante",
          "image": "aduccion-cadera.jpg"
        },
        {
          "id": "plancha-frontal",
          "name": "Plancha frontal",
          "muscleGroups": ["Core", "Abdominales", "Estabilizadores"],
          "description": "Apóyate sobre los antebrazos y las puntas de los pies, manteniendo el cuerpo en línea recta desde la cabeza hasta los talones. Contrae el abdomen y mantén la posición durante el tiempo indicado.",
          "category": "Core",
          "equipment": "Peso corporal",
          "difficulty": "Intermedio",
          "image": "plancha-frontal.jpg",
          "animation": "https://www.inspireusafoundation.org/wp-content/uploads/2022/03/forearm-plank.gif",
          "tips": ["Mantén el cuerpo en línea recta, evitando que las caderas se hundan o se eleven", "Contrae el abdomen y los glúteos durante todo el ejercicio", "Respira de manera constante y evita contener la respiración"]
        },
        {
          "id": "russian-twist",
          "name": "Russian twist con mancuerna",
          "muscleGroups": ["Oblicuos", "Core"],
          "description": "Siéntate en el suelo con las rodillas flexionadas y los pies elevados. Sujeta una mancuerna con ambas manos frente a ti. Gira el torso de un lado a otro, tocando la mancuerna en el suelo a cada lado.",
          "category": "Core",
          "equipment": "Mancuerna",
          "difficulty": "Intermedio",
          "image": "russian-twist.jpg",
          "animation": "https://www.inspireusafoundation.org/wp-content/uploads/2022/03/russian-twist.gif",
          "tips": ["Mantén la espalda recta y el pecho elevado", "Gira desde la cintura, no solo los brazos", "Para aumentar la dificultad, eleva los pies del suelo"]
        },
        {
          "id": "press-banca",
          "name": "Press de banca",
          "muscleGroups": ["Pectoral", "Deltoides", "Tríceps"],
          "description": "Acuéstate en el banco con los pies apoyados en el suelo. Agarra la barra con las manos a una distancia mayor que la anchura de los hombros. Baja la barra hasta rozar el pecho y empuja hacia arriba hasta extender los brazos.",
          "category": "Pecho",
          "equipment": "Barra",
          "difficulty": "Intermedio",
          "image": "press-banca.jpg",
          "animation": "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/barbell-bench-press.gif",
          "tips": ["Mantén los pies firmemente apoyados en el suelo", "Arquea ligeramente la espalda para mantener una curva natural", "Mantén las muñecas rectas y los codos a unos 45 grados del cuerpo"]
        },
        {
          "id": "press-hombros",
          "name": "Press de hombros con mancuernas",
          "muscleGroups": ["Deltoides", "Tríceps"],
          "description": "Siéntate en un banco con respaldo vertical. Sostén una mancuerna en cada mano a la altura de los hombros, con las palmas hacia adelante. Empuja las mancuernas hacia arriba hasta extender los brazos y luego bájalas controladamente.",
          "category": "Hombros",
          "equipment": "Mancuernas",
          "difficulty": "Intermedio",
          "image": "press-hombros.jpg"
        },
        {
          "id": "aperturas-mancuernas",
          "name": "Aperturas con mancuernas",
          "muscleGroups": ["Pectoral", "Deltoides anterior"],
          "description": "Acuéstate en un banco plano con una mancuerna en cada mano. Extiende los brazos sobre el pecho con las palmas enfrentadas. Baja los brazos hacia los lados en un movimiento de arco hasta sentir un estiramiento en el pecho, luego vuelve a la posición inicial.",
          "category": "Pecho",
          "equipment": "Mancuernas",
          "difficulty": "Intermedio",
          "image": "aperturas-mancuernas.jpg"
        },
        {
          "id": "elevaciones-laterales",
          "name": "Elevaciones laterales",
          "muscleGroups": ["Deltoides lateral"],
          "description": "De pie con una mancuerna en cada mano a los lados del cuerpo. Mantén los codos ligeramente flexionados y eleva los brazos hacia los lados hasta que estén paralelos al suelo. Baja controladamente a la posición inicial.",
          "category": "Hombros",
          "equipment": "Mancuernas",
          "difficulty": "Principiante",
          "image": "elevaciones-laterales.jpg"
        },
        {
          "id": "extension-triceps",
          "name": "Extensión de tríceps polea",
          "muscleGroups": ["Tríceps"],
          "description": "De pie frente a la polea alta, agarra la cuerda o barra con las manos. Mantén los codos pegados al cuerpo y extiende los antebrazos hacia abajo hasta que los brazos estén completamente extendidos. Regresa lentamente a la posición inicial.",
          "category": "Brazos",
          "equipment": "Polea",
          "difficulty": "Principiante",
          "image": "extension-triceps.jpg"
        },
        {
          "id": "fondos-banco",
          "name": "Fondos en banco",
          "muscleGroups": ["Tríceps", "Pectoral inferior"],
          "description": "Siéntate en el borde de un banco con las manos apoyadas a los lados. Desliza el cuerpo hacia adelante hasta que las piernas estén extendidas y el peso recaiga sobre las manos. Flexiona los codos para bajar el cuerpo y luego extiéndelos para volver a subir.",
          "category": "Brazos",
          "equipment": "Banco",
          "difficulty": "Principiante",
          "image": "fondos-banco.jpg"
        },
        {
          "id": "plancha-rotacion",
          "name": "Plancha con rotación",
          "muscleGroups": ["Core", "Oblicuos", "Estabilizadores"],
          "description": "Comienza en posición de plancha frontal sobre los antebrazos. Gira el cuerpo hacia un lado, extendiendo el brazo superior hacia el techo mientras mantienes el equilibrio. Regresa a la posición inicial y repite hacia el otro lado.",
          "category": "Core",
          "equipment": "Peso corporal",
          "difficulty": "Intermedio",
          "image": "plancha-rotacion.jpg"
        },
        {
          "id": "jalon-pecho",
          "name": "Jalón al pecho",
          "muscleGroups": ["Dorsal", "Bíceps", "Romboides"],
          "description": "Siéntate en la máquina con los muslos bajo los soportes. Agarra la barra con las manos a una distancia mayor que la anchura de los hombros. Tira de la barra hacia abajo hasta que toque la parte superior del pecho, manteniendo la espalda recta.",
          "category": "Espalda",
          "equipment": "Máquina",
          "difficulty": "Principiante",
          "image": "jalon-pecho.jpg",
          "animation": "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/lat-pulldown.gif",
          "tips": ["Mantén la espalda ligeramente arqueada", "Tira con los codos, no con las manos", "Evita balancearte para usar el impulso"]
        },
        {
          "id": "remo-maquina",
          "name": "Remo en máquina",
          "muscleGroups": ["Dorsal", "Romboides", "Trápezos"],
          "description": "Siéntate en la máquina con el pecho apoyado en el soporte. Agarra las manijas y tira hacia atrás, llevando los codos hacia atrás y juntando las escápulas. Regresa controladamente a la posición inicial.",
          "category": "Espalda",
          "equipment": "Máquina",
          "difficulty": "Principiante",
          "image": "remo-maquina.jpg"
        },
        {
          "id": "remo-inclinado",
          "name": "Remo inclinado con mancuernas",
          "muscleGroups": ["Dorsal", "Romboides", "Bíceps"],
          "description": "Inclina el torso hacia adelante con las rodillas ligeramente flexionadas, manteniendo la espalda recta. Sujeta una mancuerna en cada mano con los brazos extendidos. Tira de las mancuernas hacia arriba, llevando los codos hacia el techo y juntando las escápulas.",
          "category": "Espalda",
          "equipment": "Mancuernas",
          "difficulty": "Intermedio",
          "image": "remo-inclinado.jpg"
        },
        {
          "id": "curl-biceps",
          "name": "Curl de bíceps con polea",
          "muscleGroups": ["Bíceps"],
          "description": "De pie frente a la polea baja, agarra la barra con las manos a la anchura de los hombros. Mantén los codos pegados al cuerpo y flexiona los antebrazos para llevar la barra hacia los hombros. Baja lentamente a la posición inicial.",
          "category": "Brazos",
          "equipment": "Polea",
          "difficulty": "Principiante",
          "image": "curl-biceps.jpg",
          "animation": "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/cable-curl.gif",
          "tips": ["Mantén los codos pegados a los costados durante todo el movimiento", "Evita balancearte para usar el impulso", "Contrae los bíceps en la parte superior del movimiento"]
        },
        {
          "id": "curl-arana",
          "name": "Curl araña con mancuerna",
          "muscleGroups": ["Bíceps"],
          "description": "Siéntate en un banco inclinado con el pecho apoyado en el respaldo. Sujeta una mancuerna en cada mano con los brazos extendidos. Flexiona los codos para llevar las mancuernas hacia los hombros, manteniendo los codos fijos. Baja controladamente.",
          "category": "Brazos",
          "equipment": "Mancuernas",
          "difficulty": "Intermedio",
          "image": "curl-arana.jpg"
        },
        {
          "id": "sentadilla-bulgara",
          "name": "Sentadilla búlgara",
          "muscleGroups": ["Cuádriceps", "Glúteos", "Equilibrio"],
          "description": "De pie, coloca un pie detrás de ti sobre un banco. Sostén una mancuerna en cada mano. Flexiona la rodilla delantera para bajar el cuerpo, manteniendo la espalda recta. Empuja con el talón para volver a la posición inicial. Completa todas las repeticiones con una pierna antes de cambiar.",
          "category": "Piernas",
          "equipment": "Mancuernas, Banco",
          "difficulty": "Avanzado",
          "image": "sentadilla-bulgara.jpg"
        },
        {
          "id": "balanceo-mancuerna",
          "name": "Balanceo con mancuerna (Kettlebell Swing)",
          "muscleGroups": ["Glúteos", "Isquiotibiales", "Core"],
          "description": "De pie con los pies separados a la anchura de los hombros, sujeta una mancuerna o kettlebell con ambas manos. Flexiona ligeramente las rodillas e inclina el torso hacia adelante. Balancea la mancuerna entre las piernas y luego impulsa con las caderas para llevarla hacia adelante y arriba hasta la altura del pecho.",
          "category": "Piernas",
          "equipment": "Mancuerna, Kettlebell",
          "difficulty": "Intermedio",
          "image": "balanceo-mancuerna.jpg"
        }
      ],
      "categories": [
        "Piernas",
        "Core",
        "Pecho",
        "Hombros",
        "Brazos",
        "Espalda"
      ],
      "muscleGroups": [
        "Cuádriceps",
        "Glúteos",
        "Isquiotibiales",
        "Core",
        "Abdominales",
        "Oblicuos",
        "Estabilizadores",
        "Pectoral",
        "Deltoides",
        "Deltoides anterior",
        "Deltoides lateral",
        "Tríceps",
        "Dorsal",
        "Romboides",
        "Trápezos",
        "Bíceps",
        "Aductores",
        "Glúteo medio",
        "Estabilizadores de cadera",
        "Equilibrio"
      ],
      "equipment": [
        "Máquina",
        "Mancuerna",
        "Peso corporal",
        "Barra",
        "Mancuernas",
        "Polea",
        "Banco",
        "Kettlebell"
      ],
      "difficulty": [
        "Principiante",
        "Intermedio",
        "Avanzado"
      ]
    };

    // Inicializar datos
    filteredExercises = [...exerciseData.exercises];

    // Inicializar filtros
    initializeFilters();

    // Mostrar ejercicios
    displayExercises(filteredExercises);

    // Inicializar filtros
    function initializeFilters() {
        // Llenar filtro de categorías
        exerciseData.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });

        // Llenar filtro de grupos musculares
        exerciseData.muscleGroups.forEach(muscle => {
            const option = document.createElement('option');
            option.value = muscle;
            option.textContent = muscle;
            muscleFilter.appendChild(option);
        });

        // Llenar filtro de equipo
        exerciseData.equipment.forEach(equipment => {
            const option = document.createElement('option');
            option.value = equipment;
            option.textContent = equipment;
            equipmentFilter.appendChild(option);
        });

        // Añadir event listeners a los filtros
        categoryFilter.addEventListener('change', applyFilters);
        muscleFilter.addEventListener('change', applyFilters);
        equipmentFilter.addEventListener('change', applyFilters);
        searchInput.addEventListener('input', applyFilters);
    }

    // Aplicar filtros
    function applyFilters() {
        const categoryValue = categoryFilter.value;
        const muscleValue = muscleFilter.value;
        const equipmentValue = equipmentFilter.value;
        const searchValue = searchInput.value.toLowerCase();

        filteredExercises = exerciseData.exercises.filter(exercise => {
            // Filtrar por categoría
            if (categoryValue && exercise.category !== categoryValue) {
                return false;
            }

            // Filtrar por grupo muscular
            if (muscleValue && !exercise.muscleGroups.includes(muscleValue)) {
                return false;
            }

            // Filtrar por equipo
            if (equipmentValue && !exercise.equipment.includes(equipmentValue)) {
                return false;
            }

            // Filtrar por búsqueda
            if (searchValue && !exercise.name.toLowerCase().includes(searchValue)) {
                return false;
            }

            return true;
        });

        displayExercises(filteredExercises);
    }

    // Mostrar ejercicios
    function displayExercises(exercises) {
        exerciseList.innerHTML = '';

        if (exercises.length === 0) {
            exerciseList.innerHTML = `
                <div class="col-span-full text-center py-8">
                    <p class="text-gray-500">No se encontraron ejercicios que coincidan con los filtros seleccionados.</p>
                </div>
            `;
            return;
        }

        exercises.forEach((exercise, index) => {
            const card = document.createElement('div');
            card.className = 'exercise-card bg-white rounded-xl shadow-card p-5 border border-gray-100 transition-all hover:shadow-lg animate-slide-up';
            card.style.animationDelay = `${index * 0.05}s`;

            // Crear etiquetas para grupos musculares
            const muscleGroupsHTML = exercise.muscleGroups.map(muscle =>
                `<span class="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded mr-1 mb-1 inline-block">${muscle}</span>`
            ).join('');

            card.className = 'bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all cursor-pointer transform hover:scale-[1.02] relative overflow-hidden';

            // Contenido principal de la tarjeta
            const cardContent = document.createElement('div');
            cardContent.className = 'p-4';
            cardContent.innerHTML = `
                <div class="flex-1">
                    <h3 class="text-lg font-bold text-gray-800">${exercise.name}</h3>
                    <p class="text-sm text-gray-600 mt-1 mb-2 flex flex-wrap">
                        ${muscleGroupsHTML}
                    </p>
                    <p class="text-sm text-gray-600 mb-2 line-clamp-2">${exercise.description}</p>
                    <div class="mt-2 space-y-1">
                        <div class="flex items-center text-sm text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <span>${exercise.category}</span>
                        </div>
                        <div class="flex items-center text-sm text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                            </svg>
                            <span>${exercise.equipment}</span>
                        </div>
                    </div>
                </div>
            `;
            card.appendChild(cardContent);

            // Botón de detalles (signo +)
            const detailsButton = document.createElement('div');
            detailsButton.className = 'plus-button view-details';
            detailsButton.setAttribute('data-id', exercise.id);
            detailsButton.innerHTML = `+`;
            card.appendChild(detailsButton);

            exerciseList.appendChild(card);

            // Añadir event listener al botón de detalles
            detailsButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Evitar que el clic se propague a la tarjeta
                console.log('Botón + clickeado:', exercise.id);
                showExerciseDetails(exercise.id);
            });

            // Añadir event listener a toda la tarjeta
            card.addEventListener('click', () => {
                console.log('Tarjeta clickeada:', exercise.id);
                showExerciseDetails(exercise.id);
            });
        });
    }

    // Mostrar detalles de ejercicio
    function showExerciseDetails(exerciseId) {
        console.log('Mostrando detalles del ejercicio con ID:', exerciseId);

        const exercise = exerciseData.exercises.find(ex => ex.id === exerciseId);

        if (!exercise) {
            console.error('Ejercicio no encontrado:', exerciseId);
            return;
        }

        console.log('Datos del ejercicio:', exercise);
        console.log('Tiene animación:', !!exercise.animation);
        console.log('Tiene consejos:', !!exercise.tips);

        // Mostrar el modal
        const modal = document.getElementById('exercise-modal');
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.add('opacity-100');
            document.body.classList.add('overflow-hidden');
        }, 10);

        modalTitle.textContent = exercise.name;

        // Crear etiquetas para grupos musculares
        const muscleGroupsHTML = exercise.muscleGroups.map(muscle =>
            `<span class="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded mr-1 mb-1 inline-block">${muscle}</span>`
        ).join('');

        // Preparar HTML para los consejos si existen
        let tipsHTML = '';
        if (exercise.tips && exercise.tips.length > 0) {
            tipsHTML = `
                <div class="mt-4">
                    <h4 class="font-semibold text-gray-800 mb-2">Consejos para realizar el ejercicio:</h4>
                    <ul class="list-disc pl-5 space-y-1">
                        ${exercise.tips.map(tip => `<li class="text-gray-700">${tip}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        // Preparar HTML para la animación si existe
        let animationHTML = '';
        if (exercise.animation) {
            animationHTML = `
                <div class="mt-4 flex justify-center">
                    <div class="rounded-lg overflow-hidden shadow-lg border border-gray-200 max-w-md">
                        <img src="${exercise.animation}" alt="Animación de ${exercise.name}" class="w-full h-auto" />
                    </div>
                </div>
            `;
        }

        // Dividir la descripción en pasos
        const steps = exercise.description.split('. ').filter(step => step.trim() !== '');

        // Crear HTML para los pasos
        let stepsHTML = '';
        if (steps.length > 0) {
            stepsHTML = `
                <div class="mt-6 mb-6 bg-gray-50 p-5 rounded-xl border border-gray-200">
                    <h4 class="font-semibold text-gray-800 mb-3 text-lg flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Cómo realizar el ejercicio correctamente
                    </h4>
                    <ol class="space-y-3 list-decimal pl-5">
                        ${steps.map(step => `<li class="text-gray-700">${step}.</li>`).join('')}
                    </ol>
                </div>
            `;
        } else if (exercise.description) {
            stepsHTML = `
                <div class="mt-6 mb-6 bg-gray-50 p-5 rounded-xl border border-gray-200">
                    <h4 class="font-semibold text-gray-800 mb-3 text-lg flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Descripción del ejercicio
                    </h4>
                    <p class="text-gray-700">${exercise.description}</p>
                </div>
            `;
        }

        // Construir el HTML completo del contenido del modal
        const contentHTML = `
            <div class="mb-4">
                <div class="flex flex-wrap mb-2">
                    ${muscleGroupsHTML}
                </div>
            </div>

            ${animationHTML}

            ${stepsHTML}

            ${tipsHTML}

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-6">
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 class="font-semibold text-gray-800 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Categoría
                    </h4>
                    <p class="text-gray-700">${exercise.category}</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 class="font-semibold text-gray-800 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                        </svg>
                        Equipo
                    </h4>
                    <p class="text-gray-700">${exercise.equipment}</p>
                </div>

                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 class="font-semibold text-gray-800 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Dificultad
                    </h4>
                    <p class="text-gray-700">${exercise.difficulty || 'Intermedio'}</p>
                </div>

                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 class="font-semibold text-gray-800 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        Grupos musculares
                    </h4>
                    <p class="text-gray-700">${exercise.muscleGroups.join(', ')}</p>
                </div>
            </div>

            <div class="mt-6 flex justify-end">
                <button class="px-5 py-3 bg-primary-600 text-white rounded-lg font-medium shadow-button hover:bg-primary-700 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50" id="add-to-plan">
                    Añadir a mi plan
                </button>
            </div>
        `;

        console.log('HTML del contenido del modal:', contentHTML);
        modalContent.innerHTML = contentHTML;

        // Mostrar modal con animación
        exerciseModal.classList.remove('hidden');

        // Animar la aparición del modal
        setTimeout(() => {
            const modalContainer = document.getElementById('modal-container');
            if (modalContainer) {
                modalContainer.classList.remove('scale-95', 'opacity-0');
                modalContainer.classList.add('scale-100', 'opacity-100');
            }
        }, 10);

        // Añadir event listener al botón de añadir al plan
        const addToPlanButton = document.getElementById('add-to-plan');
        addToPlanButton.addEventListener('click', () => {
            // Aquí se implementaría la funcionalidad para añadir al plan
            alert(`Ejercicio "${exercise.name}" añadido al plan`);
            closeModalWithAnimation();
        });
    }

    // Función para cerrar el modal con animación
    function closeModalWithAnimation() {
        const modalContainer = document.getElementById('modal-container');
        if (modalContainer) {
            modalContainer.classList.remove('scale-100', 'opacity-100');
            modalContainer.classList.add('scale-95', 'opacity-0');

            // Esperar a que termine la animación antes de ocultar el modal
            setTimeout(() => {
                exerciseModal.classList.add('hidden');
            }, 300);
        } else {
            exerciseModal.classList.add('hidden');
        }
    }

    // Cerrar modal
    closeModal.addEventListener('click', closeModalWithAnimation);

    // Cerrar modal al hacer clic fuera del contenido
    exerciseModal.addEventListener('click', (event) => {
        if (event.target === exerciseModal) {
            closeModalWithAnimation();
        }
    });

    // Cerrar modal con la tecla Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !exerciseModal.classList.contains('hidden')) {
            closeModalWithAnimation();
        }
    });
});
