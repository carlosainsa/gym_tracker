// Biblioteca de ejercicios - Versión 2

document.addEventListener('DOMContentLoaded', function() {
    // Datos de ejercicios
    const exercisesData = [
        {
            id: "prensa-piernas",
            name: "Prensa de piernas",
            muscleGroups: ["Cuádriceps", "Glúteos", "Isquiotibiales"],
            description: "Siéntate en la máquina con la espalda apoyada en el respaldo. Coloca los pies en la plataforma a la anchura de los hombros. Empuja la plataforma extendiendo las piernas y luego regresa controladamente a la posición inicial.",
            category: "Piernas",
            equipment: "Máquina",
            difficulty: "Principiante",
            animation: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/leg-press-machine.gif",
            tips: [
                "Mantén la espalda baja apoyada en el respaldo",
                "No bloquees completamente las rodillas al extender",
                "Ajusta la posición de los pies para enfocarte en diferentes músculos"
            ]
        },
        {
            id: "sentadilla-goblet",
            name: "Sentadilla Goblet con mancuerna",
            muscleGroups: ["Cuádriceps", "Glúteos", "Core"],
            description: "Sujeta una mancuerna verticalmente contra el pecho, con los codos hacia abajo. Separa los pies a la anchura de los hombros, baja las caderas como si te sentaras en una silla, manteniendo la espalda recta. Regresa a la posición inicial.",
            category: "Piernas",
            equipment: "Mancuerna",
            difficulty: "Principiante",
            animation: "https://www.inspireusafoundation.org/wp-content/uploads/2022/03/goblet-squat.gif",
            tips: [
                "Mantén el pecho elevado durante todo el movimiento",
                "Baja hasta que los muslos estén paralelos al suelo",
                "Empuja a través de los talones para subir"
            ]
        },
        {
            id: "extension-piernas",
            name: "Extensión de piernas",
            muscleGroups: ["Cuádriceps"],
            description: "Siéntate en la máquina con la espalda apoyada en el respaldo. Coloca los tobillos detrás del rodillo acolchado. Extiende las piernas hasta que estén completamente rectas y luego baja controladamente.",
            category: "Piernas",
            equipment: "Máquina",
            difficulty: "Principiante",
            animation: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/leg-extension.gif",
            tips: [
                "Mantén la espalda apoyada en el respaldo durante todo el movimiento",
                "Extiende completamente las piernas en la parte superior",
                "Baja el peso de forma controlada"
            ]
        },
        {
            id: "curl-femoral",
            name: "Curl femoral tumbado",
            muscleGroups: ["Isquiotibiales", "Glúteos"],
            description: "Túmbate boca abajo en la máquina con los tobillos debajo del rodillo acolchado. Flexiona las rodillas para llevar los talones hacia los glúteos y luego baja controladamente.",
            category: "Piernas",
            equipment: "Máquina",
            difficulty: "Principiante",
            animation: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/lying-leg-curl.gif",
            tips: [
                "Mantén las caderas apoyadas en el banco durante todo el movimiento",
                "Evita levantar las caderas al flexionar las rodillas",
                "Contrae los isquiotibiales en la parte superior del movimiento"
            ]
        },
        {
            id: "plancha-frontal",
            name: "Plancha frontal",
            muscleGroups: ["Core", "Abdominales", "Estabilizadores"],
            description: "Apóyate sobre los antebrazos y las puntas de los pies, manteniendo el cuerpo en línea recta desde la cabeza hasta los talones. Contrae el abdomen y mantén la posición durante el tiempo indicado.",
            category: "Core",
            equipment: "Peso corporal",
            difficulty: "Intermedio",
            animation: "https://www.inspireusafoundation.org/wp-content/uploads/2022/03/forearm-plank.gif",
            tips: [
                "Mantén el cuerpo en línea recta, evitando que las caderas se hundan o se eleven",
                "Contrae el abdomen y los glúteos durante todo el ejercicio",
                "Respira de manera constante y evita contener la respiración"
            ]
        },
        {
            id: "russian-twist",
            name: "Russian twist con mancuerna",
            muscleGroups: ["Oblicuos", "Core"],
            description: "Siéntate en el suelo con las rodillas flexionadas y los pies elevados. Sujeta una mancuerna con ambas manos frente a ti. Gira el torso de un lado a otro, tocando la mancuerna en el suelo a cada lado.",
            category: "Core",
            equipment: "Mancuerna",
            difficulty: "Intermedio",
            animation: "https://www.inspireusafoundation.org/wp-content/uploads/2022/03/russian-twist.gif",
            tips: [
                "Mantén la espalda recta y el pecho elevado",
                "Gira desde la cintura, no solo los brazos",
                "Para aumentar la dificultad, eleva los pies del suelo"
            ]
        },
        {
            id: "press-banca",
            name: "Press de banca",
            muscleGroups: ["Pectoral", "Deltoides", "Tríceps"],
            description: "Acuéstate en el banco con los pies apoyados en el suelo. Agarra la barra con las manos a una distancia mayor que la anchura de los hombros. Baja la barra hasta rozar el pecho y empuja hacia arriba hasta extender los brazos.",
            category: "Pecho",
            equipment: "Barra",
            difficulty: "Intermedio",
            animation: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/barbell-bench-press.gif",
            tips: [
                "Mantén los pies firmemente apoyados en el suelo",
                "Arquea ligeramente la espalda para mantener una curva natural",
                "Mantén las muñecas rectas y los codos a unos 45 grados del cuerpo"
            ]
        },
        {
            id: "jalon-pecho",
            name: "Jalón al pecho",
            muscleGroups: ["Dorsal", "Bíceps", "Romboides"],
            description: "Siéntate en la máquina con los muslos bajo los soportes. Agarra la barra con las manos a una distancia mayor que la anchura de los hombros. Tira de la barra hacia abajo hasta que toque la parte superior del pecho, manteniendo la espalda recta.",
            category: "Espalda",
            equipment: "Máquina",
            difficulty: "Principiante",
            animation: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/lat-pulldown.gif",
            tips: [
                "Mantén la espalda ligeramente arqueada",
                "Tira con los codos, no con las manos",
                "Evita balancearte para usar el impulso"
            ]
        },
        {
            id: "curl-biceps",
            name: "Curl de bíceps con polea",
            muscleGroups: ["Bíceps"],
            description: "De pie frente a la polea baja, agarra la barra con las manos a la anchura de los hombros. Mantén los codos pegados al cuerpo y flexiona los antebrazos para llevar la barra hacia los hombros. Baja lentamente a la posición inicial.",
            category: "Brazos",
            equipment: "Polea",
            difficulty: "Principiante",
            animation: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/cable-curl.gif",
            tips: [
                "Mantén los codos pegados a los costados durante todo el movimiento",
                "Evita balancearte para usar el impulso",
                "Contrae los bíceps en la parte superior del movimiento"
            ]
        }
    ];

    // Categorías y grupos musculares para los filtros
    const categories = ["Piernas", "Core", "Pecho", "Hombros", "Brazos", "Espalda"];
    const muscleGroups = [
        "Cuádriceps", "Glúteos", "Isquiotibiales", "Core", "Abdominales", "Oblicuos",
        "Estabilizadores", "Pectoral", "Deltoides", "Tríceps", "Dorsal", "Bíceps", "Romboides"
    ];
    const equipment = ["Máquina", "Mancuerna", "Peso corporal", "Barra", "Polea"];

    // Elementos del DOM
    const exerciseList = document.getElementById('exercise-list');
    const categoryFilter = document.getElementById('category-filter');
    const muscleFilter = document.getElementById('muscle-filter');
    const equipmentFilter = document.getElementById('equipment-filter');
    const searchInput = document.getElementById('search-input');
    const modal = document.getElementById('exercise-modal');
    const modalContent = document.getElementById('modal-content');
    const modalTitle = document.getElementById('modal-title');
    const closeModalBtn = document.getElementById('close-modal');

    // Inicializar filtros
    function initializeFilters() {
        // Llenar filtro de categorías
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });

        // Llenar filtro de grupos musculares
        muscleGroups.forEach(muscle => {
            const option = document.createElement('option');
            option.value = muscle;
            option.textContent = muscle;
            muscleFilter.appendChild(option);
        });

        // Llenar filtro de equipo
        equipment.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            option.textContent = item;
            equipmentFilter.appendChild(option);
        });

        // Añadir event listeners a los filtros
        categoryFilter.addEventListener('change', filterExercises);
        muscleFilter.addEventListener('change', filterExercises);
        equipmentFilter.addEventListener('change', filterExercises);
        searchInput.addEventListener('input', filterExercises);
    }

    // Filtrar ejercicios
    function filterExercises() {
        const categoryValue = categoryFilter.value;
        const muscleValue = muscleFilter.value;
        const equipmentValue = equipmentFilter.value;
        const searchValue = searchInput.value.toLowerCase();

        const filteredExercises = exercisesData.filter(exercise => {
            // Filtrar por categoría
            if (categoryValue && exercise.category !== categoryValue) {
                return false;
            }

            // Filtrar por grupo muscular
            if (muscleValue && !exercise.muscleGroups.includes(muscleValue)) {
                return false;
            }

            // Filtrar por equipo
            if (equipmentValue && exercise.equipment !== equipmentValue) {
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

            card.innerHTML = `
                <div class="flex justify-between items-start">
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

                    <button class="view-exercise bg-primary-600 text-white p-3 rounded-full shadow-button hover:bg-primary-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50" data-id="${exercise.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </button>
                </div>
            `;

            exerciseList.appendChild(card);

            // Añadir event listener al botón de ver ejercicio
            const viewButton = card.querySelector('.view-exercise');
            viewButton.addEventListener('click', function() {
                const exerciseId = this.getAttribute('data-id');
                showExerciseDetails(exerciseId);
            });
        });
    }

    // Mostrar detalles del ejercicio
    function showExerciseDetails(exerciseId) {
        const exercise = exercisesData.find(ex => ex.id === exerciseId);

        if (!exercise) {
            console.error('Ejercicio no encontrado:', exerciseId);
            return;
        }

        modalTitle.textContent = exercise.name;

        // Crear etiquetas para grupos musculares
        const muscleGroupsHTML = exercise.muscleGroups.map(muscle =>
            `<span class="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded mr-1 mb-1 inline-block">${muscle}</span>`
        ).join('');

        // Preparar HTML para los consejos
        let tipsHTML = '';
        if (exercise.tips && exercise.tips.length > 0) {
            tipsHTML = `
                <div class="mt-4">
                    <h4 class="font-semibold text-gray-800 mb-2">Consejos para realizar el ejercicio:</h4>
                    <ul class="exercise-tips space-y-1">
                        ${exercise.tips.map(tip => `<li class="text-gray-700">${tip}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        // Preparar HTML para la animación
        let animationHTML = '';
        if (exercise.animation) {
            animationHTML = `
                <div class="mt-6 mb-6">
                    <h4 class="font-semibold text-gray-800 mb-3">Cómo realizar el ejercicio:</h4>
                    <div class="flex justify-center">
                        <div class="rounded-lg overflow-hidden shadow-lg border border-gray-200 w-full max-w-lg exercise-animation">
                            <img src="${exercise.animation}" alt="Animación de ${exercise.name}" class="w-full h-auto"
                                 style="max-height: 300px; object-fit: contain;" />
                        </div>
                    </div>
                </div>
            `;
        }

        modalContent.innerHTML = `
            <div class="mb-4">
                <div class="flex flex-wrap mb-2">
                    ${muscleGroupsHTML}
                </div>
                <p class="text-gray-700">${exercise.description}</p>
                ${tipsHTML}
            </div>

            ${animationHTML}

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-gray-800 mb-2">Categoría</h4>
                    <p class="text-gray-700">${exercise.category}</p>
                </div>

                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-gray-800 mb-2">Equipo</h4>
                    <p class="text-gray-700">${exercise.equipment}</p>
                </div>

                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-gray-800 mb-2">Dificultad</h4>
                    <p class="text-gray-700">${exercise.difficulty}</p>
                </div>

                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-gray-800 mb-2">Grupos musculares</h4>
                    <p class="text-gray-700">${exercise.muscleGroups.join(', ')}</p>
                </div>
            </div>

            <div class="mt-6 flex justify-end">
                <button class="px-5 py-3 bg-primary-600 text-white rounded-lg font-medium shadow-button hover:bg-primary-700 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50" id="add-to-plan">
                    Añadir a mi plan
                </button>
            </div>
        `;

        // Mostrar modal
        modal.classList.remove('hidden');

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
            alert(`Ejercicio "${exercise.name}" añadido al plan`);
            closeModal();
        });
    }

    // Función para cerrar el modal
    function closeModal() {
        const modalContainer = document.getElementById('modal-container');
        if (modalContainer) {
            modalContainer.classList.remove('scale-100', 'opacity-100');
            modalContainer.classList.add('scale-95', 'opacity-0');

            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        } else {
            modal.classList.add('hidden');
        }
    }

    // Event listeners para cerrar el modal
    closeModalBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // Inicializar la aplicación
    initializeFilters();
    displayExercises(exercisesData);
});
