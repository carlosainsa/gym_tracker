// Script para el creador de rutinas

document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let currentDay = 1;
    let selectedExercise = null;
    let routineExercises = {}; // Objeto para almacenar los ejercicios por día

    // Elementos del DOM
    const routineNameInput = document.getElementById('routine-name');
    const routineDescriptionInput = document.getElementById('routine-description');
    const routineDaysSelect = document.getElementById('routine-days');
    const exerciseFilterSelect = document.getElementById('exercise-filter');
    const exerciseSearchInput = document.getElementById('exercise-search');
    const exerciseList = document.getElementById('exercise-list');
    const daysTabsContainer = document.getElementById('days-tabs');
    const daysContentContainer = document.getElementById('days-content');
    const clearRoutineButton = document.getElementById('clear-routine');
    const saveRoutineButton = document.getElementById('save-routine');

    // Modal de configuración de ejercicio
    const exerciseConfigModal = document.getElementById('exercise-config-modal');
    const modalContainer = document.getElementById('modal-container');
    const modalTitle = document.getElementById('modal-title');
    const exerciseName = document.getElementById('exercise-name');
    const exerciseDescription = document.getElementById('exercise-description');
    const exerciseSets = document.getElementById('exercise-sets');
    const exerciseRest = document.getElementById('exercise-rest');
    const exerciseRepsMin = document.getElementById('exercise-reps-min');
    const exerciseRepsMax = document.getElementById('exercise-reps-max');
    const exerciseWeightMin = document.getElementById('exercise-weight-min');
    const exerciseWeightMax = document.getElementById('exercise-weight-max');
    const exerciseNotes = document.getElementById('exercise-notes');
    const cancelConfigButton = document.getElementById('cancel-config');
    const addExerciseButton = document.getElementById('add-exercise');
    const closeModalButton = document.getElementById('close-modal');

    // Inicializar la aplicación
    initializeApp();

    // Función para inicializar la aplicación
    function initializeApp() {
        console.log('Inicializando aplicación');

        // Inicializar los días de la rutina
        initializeDays();

        // Cargar la biblioteca de ejercicios
        loadExercises();

        // Añadir event listeners
        addEventListeners();

        // Inicializar el objeto de ejercicios por día
        for (let i = 1; i <= parseInt(routineDaysSelect.value); i++) {
            routineExercises[i] = [];
        }

        console.log('Aplicación inicializada');
    }

    // Función para inicializar los días de la rutina
    function initializeDays() {
        const numDays = parseInt(routineDaysSelect.value);

        // Limpiar las pestañas y el contenido
        daysTabsContainer.innerHTML = '';
        daysContentContainer.innerHTML = '';

        // Crear las pestañas y el contenido para cada día
        for (let i = 1; i <= numDays; i++) {
            // Crear pestaña
            const tab = document.createElement('button');
            tab.className = `px-4 py-2 font-medium text-sm transition-all ${i === currentDay ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`;
            tab.textContent = `Entrenamiento ${i}`;
            tab.dataset.day = i;
            tab.addEventListener('click', () => switchDay(i));
            daysTabsContainer.appendChild(tab);

            // Crear contenido
            const content = document.createElement('div');
            content.className = `day-content ${i === currentDay ? 'block' : 'hidden'}`;
            content.dataset.day = i;
            content.innerHTML = `
                <div class="mb-4">
                    <h3 class="text-lg font-semibold text-gray-800 mb-2">Entrenamiento ${i}</h3>
                    <div id="day-${i}-exercises" class="space-y-3">
                        <div class="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                            <p class="text-gray-500">Añade ejercicios desde la biblioteca</p>
                        </div>
                    </div>
                </div>
            `;
            daysContentContainer.appendChild(content);
        }
    }

    // Función para cambiar de día
    function switchDay(day) {
        // Actualizar la variable de día actual
        currentDay = day;

        // Actualizar las pestañas
        const tabs = daysTabsContainer.querySelectorAll('button');
        tabs.forEach(tab => {
            if (parseInt(tab.dataset.day) === day) {
                tab.className = 'px-4 py-2 font-medium text-sm text-primary-600 border-b-2 border-primary-600 transition-all';
            } else {
                tab.className = 'px-4 py-2 font-medium text-sm text-gray-500 hover:text-gray-700 transition-all';
            }
        });

        // Actualizar el contenido
        const contents = daysContentContainer.querySelectorAll('.day-content');
        contents.forEach(content => {
            if (parseInt(content.dataset.day) === day) {
                content.classList.remove('hidden');
                content.classList.add('block');
            } else {
                content.classList.remove('block');
                content.classList.add('hidden');
            }
        });
    }

    // Función para añadir event listeners
    function addEventListeners() {
        // Event listener para el cambio de número de días
        routineDaysSelect.addEventListener('change', () => {
            initializeDays();
            // Reiniciar el objeto de ejercicios por día
            routineExercises = {};
            for (let i = 1; i <= parseInt(routineDaysSelect.value); i++) {
                routineExercises[i] = [];
            }
        });

        // Event listeners para los filtros de ejercicios
        exerciseFilterSelect.addEventListener('change', () => {
            displayExercises(window.exercisesData);
        });

        exerciseSearchInput.addEventListener('input', () => {
            displayExercises(window.exercisesData);
        });

        // Event listeners para los botones de acción
        clearRoutineButton.addEventListener('click', clearRoutine);
        saveRoutineButton.addEventListener('click', saveRoutine);

        // Event listeners para el modal
        closeModalButton.addEventListener('click', closeModal);
        cancelConfigButton.addEventListener('click', closeModal);

        // Guardar la función original para poder restaurarla después
        window.originalAddExerciseFunction = addExerciseToRoutine;

        // Añadir event listener al botón de añadir ejercicio
        addExerciseButton.addEventListener('click', function() {
            console.log('Botón de añadir ejercicio clickeado');
            window.originalAddExerciseFunction();
        });

        // Event listener para cerrar el modal al hacer clic fuera
        exerciseConfigModal.addEventListener('click', (event) => {
            if (event.target === exerciseConfigModal) {
                closeModal();
            }
        });

        // Event listener para cerrar el modal con la tecla Escape
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !exerciseConfigModal.classList.contains('hidden')) {
                closeModal();
            }
        });
    }

    // Función para cargar los ejercicios de la biblioteca
    function loadExercises() {
        // Datos de ejercicios (en una aplicación real, estos datos vendrían de una API o base de datos)
        const exercises = [
            {
                id: "prensa-piernas",
                name: "Prensa de piernas",
                muscleGroups: ["Cuádriceps", "Glúteos", "Isquiotibiales"],
                description: "Siéntate en la máquina con la espalda apoyada en el respaldo. Coloca los pies en la plataforma a la anchura de los hombros. Empuja la plataforma extendiendo las piernas y luego regresa controladamente a la posición inicial.",
                category: "Piernas",
                equipment: "Máquina",
                difficulty: "Principiante"
            },
            {
                id: "sentadilla-goblet",
                name: "Sentadilla Goblet con mancuerna",
                muscleGroups: ["Cuádriceps", "Glúteos", "Core"],
                description: "Sujeta una mancuerna verticalmente contra el pecho, con los codos hacia abajo. Separa los pies a la anchura de los hombros, baja las caderas como si te sentaras en una silla, manteniendo la espalda recta. Regresa a la posición inicial.",
                category: "Piernas",
                equipment: "Mancuerna",
                difficulty: "Principiante"
            },
            {
                id: "extension-piernas",
                name: "Extensión de piernas",
                muscleGroups: ["Cuádriceps"],
                description: "Siéntate en la máquina con la espalda apoyada en el respaldo. Coloca los tobillos detrás del rodillo acolchado. Extiende las piernas hasta que estén completamente rectas y luego baja controladamente.",
                category: "Piernas",
                equipment: "Máquina",
                difficulty: "Principiante"
            },
            {
                id: "curl-femoral",
                name: "Curl femoral tumbado",
                muscleGroups: ["Isquiotibiales", "Glúteos"],
                description: "Túmbate boca abajo en la máquina con los tobillos debajo del rodillo acolchado. Flexiona las rodillas para llevar los talones hacia los glúteos y luego baja controladamente.",
                category: "Piernas",
                equipment: "Máquina",
                difficulty: "Principiante"
            },
            {
                id: "plancha-frontal",
                name: "Plancha frontal",
                muscleGroups: ["Core", "Abdominales", "Estabilizadores"],
                description: "Apóyate sobre los antebrazos y las puntas de los pies, manteniendo el cuerpo en línea recta desde la cabeza hasta los talones. Contrae el abdomen y mantén la posición durante el tiempo indicado.",
                category: "Core",
                equipment: "Peso corporal",
                difficulty: "Intermedio"
            },
            {
                id: "russian-twist",
                name: "Russian twist con mancuerna",
                muscleGroups: ["Oblicuos", "Core"],
                description: "Siéntate en el suelo con las rodillas flexionadas y los pies elevados. Sujeta una mancuerna con ambas manos frente a ti. Gira el torso de un lado a otro, tocando la mancuerna en el suelo a cada lado.",
                category: "Core",
                equipment: "Mancuerna",
                difficulty: "Intermedio"
            },
            {
                id: "press-banca",
                name: "Press de banca",
                muscleGroups: ["Pectoral", "Deltoides", "Tríceps"],
                description: "Acuéstate en el banco con los pies apoyados en el suelo. Agarra la barra con las manos a una distancia mayor que la anchura de los hombros. Baja la barra hasta rozar el pecho y empuja hacia arriba hasta extender los brazos.",
                category: "Pecho",
                equipment: "Barra",
                difficulty: "Intermedio"
            },
            {
                id: "press-hombros",
                name: "Press de hombros con mancuernas",
                muscleGroups: ["Deltoides", "Tríceps"],
                description: "Siéntate en un banco con respaldo vertical. Sostén una mancuerna en cada mano a la altura de los hombros, con las palmas hacia adelante. Empuja las mancuernas hacia arriba hasta extender los brazos y luego bájalas controladamente.",
                category: "Hombros",
                equipment: "Mancuernas",
                difficulty: "Intermedio"
            },
            {
                id: "aperturas-mancuernas",
                name: "Aperturas con mancuernas",
                muscleGroups: ["Pectoral", "Deltoides anterior"],
                description: "Acuéstate en un banco plano con una mancuerna en cada mano. Extiende los brazos sobre el pecho con las palmas enfrentadas. Baja los brazos hacia los lados en un movimiento de arco hasta sentir un estiramiento en el pecho, luego vuelve a la posición inicial.",
                category: "Pecho",
                equipment: "Mancuernas",
                difficulty: "Intermedio"
            },
            {
                id: "elevaciones-laterales",
                name: "Elevaciones laterales",
                muscleGroups: ["Deltoides lateral"],
                description: "De pie con una mancuerna en cada mano a los lados del cuerpo. Mantén los codos ligeramente flexionados y eleva los brazos hacia los lados hasta que estén paralelos al suelo. Baja controladamente a la posición inicial.",
                category: "Hombros",
                equipment: "Mancuernas",
                difficulty: "Principiante"
            },
            {
                id: "extension-triceps",
                name: "Extensión de tríceps polea",
                muscleGroups: ["Tríceps"],
                description: "De pie frente a la polea alta, agarra la cuerda o barra con las manos. Mantén los codos pegados al cuerpo y extiende los antebrazos hacia abajo hasta que los brazos estén completamente extendidos. Regresa lentamente a la posición inicial.",
                category: "Brazos",
                equipment: "Polea",
                difficulty: "Principiante"
            },
            {
                id: "jalon-pecho",
                name: "Jalón al pecho",
                muscleGroups: ["Dorsal", "Bíceps", "Romboides"],
                description: "Siéntate en la máquina con los muslos bajo los soportes. Agarra la barra con las manos a una distancia mayor que la anchura de los hombros. Tira de la barra hacia abajo hasta que toque la parte superior del pecho, manteniendo la espalda recta.",
                category: "Espalda",
                equipment: "Máquina",
                difficulty: "Principiante"
            },
            {
                id: "remo-maquina",
                name: "Remo en máquina",
                muscleGroups: ["Dorsal", "Romboides", "Trápezos"],
                description: "Siéntate en la máquina con el pecho apoyado en el soporte. Agarra las manijas y tira hacia atrás, llevando los codos hacia atrás y juntando las escápulas. Regresa controladamente a la posición inicial.",
                category: "Espalda",
                equipment: "Máquina",
                difficulty: "Principiante"
            },
            {
                id: "curl-biceps",
                name: "Curl de bíceps con polea",
                muscleGroups: ["Bíceps"],
                description: "De pie frente a la polea baja, agarra la barra con las manos a la anchura de los hombros. Mantén los codos pegados al cuerpo y flexiona los antebrazos para llevar la barra hacia los hombros. Baja lentamente a la posición inicial.",
                category: "Brazos",
                equipment: "Polea",
                difficulty: "Principiante"
            }
        ];

        // Mostrar los ejercicios en la lista
        displayExercises(exercises);

        // Guardar los ejercicios en una variable global para usarlos más tarde
        window.exercisesData = exercises;
    }

    // Función para mostrar los ejercicios en la lista
    function displayExercises(exercises) {
        // Limpiar la lista de ejercicios
        exerciseList.innerHTML = '';

        // Filtrar los ejercicios según la categoría seleccionada
        const categoryFilter = exerciseFilterSelect.value;
        const searchFilter = exerciseSearchInput.value.toLowerCase();

        const filteredExercises = exercises.filter(exercise => {
            // Filtrar por categoría
            if (categoryFilter && exercise.category !== categoryFilter) {
                return false;
            }

            // Filtrar por búsqueda
            if (searchFilter && !exercise.name.toLowerCase().includes(searchFilter)) {
                return false;
            }

            return true;
        });

        // Mostrar mensaje si no hay ejercicios
        if (filteredExercises.length === 0) {
            exerciseList.innerHTML = `
                <div class="text-center py-4">
                    <p class="text-gray-500">No se encontraron ejercicios que coincidan con los filtros seleccionados.</p>
                </div>
            `;
            return;
        }

        // Mostrar los ejercicios filtrados
        filteredExercises.forEach(exercise => {
            const exerciseCard = document.createElement('div');
            exerciseCard.className = 'exercise-card bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-all';
            exerciseCard.dataset.id = exercise.id;

            // Crear etiquetas para grupos musculares
            const muscleGroupsHTML = exercise.muscleGroups.map(muscle =>
                `<span class="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded mr-1 mb-1 inline-block">${muscle}</span>`
            ).join('');

            exerciseCard.innerHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="font-semibold text-gray-800">${exercise.name}</h3>
                        <div class="flex flex-wrap mt-1 mb-1">
                            ${muscleGroupsHTML}
                        </div>
                        <p class="text-xs text-gray-600">${exercise.category} | ${exercise.equipment}</p>
                    </div>
                    <button class="add-exercise-btn bg-primary-600 text-white p-2 rounded-full shadow-sm hover:bg-primary-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            `;

            // Añadir event listener al botón de añadir ejercicio
            const addButton = exerciseCard.querySelector('.add-exercise-btn');
            addButton.addEventListener('click', () => {
                openExerciseConfigModal(exercise);
            });

            exerciseList.appendChild(exerciseCard);
        });
    }

    // Función para abrir el modal de configuración de ejercicio
    function openExerciseConfigModal(exercise) {
        // Guardar el ejercicio seleccionado
        selectedExercise = exercise;

        // Actualizar el título del modal
        modalTitle.textContent = 'Configurar Ejercicio';

        // Actualizar el contenido del modal
        exerciseName.textContent = exercise.name;
        exerciseDescription.textContent = exercise.description;

        // Restablecer los valores de los inputs
        exerciseSets.value = '3';
        exerciseRest.value = '60';
        exerciseRepsMin.value = '8';
        exerciseRepsMax.value = '12';
        exerciseWeightMin.value = '10';
        exerciseWeightMax.value = '15';
        exerciseNotes.value = '';

        // Mostrar el modal
        exerciseConfigModal.classList.remove('hidden');

        // Animar la aparición del modal
        setTimeout(() => {
            modalContainer.classList.remove('scale-95', 'opacity-0');
            modalContainer.classList.add('scale-100', 'opacity-100');
        }, 10);
    }

    // Función para cerrar el modal
    function closeModal() {
        // Animar la desaparición del modal
        modalContainer.classList.remove('scale-100', 'opacity-100');
        modalContainer.classList.add('scale-95', 'opacity-0');

        // Ocultar el modal después de la animación
        setTimeout(() => {
            exerciseConfigModal.classList.add('hidden');
        }, 300);
    }

    // Función para añadir un ejercicio a la rutina
    function addExerciseToRoutine() {
        console.log('Ejecutando addExerciseToRoutine');

        // Verificar que hay un ejercicio seleccionado
        if (!selectedExercise) {
            console.error('No hay ejercicio seleccionado');
            return;
        }

        console.log('Ejercicio seleccionado:', selectedExercise);

        // Obtener los valores de configuración
        const sets = parseInt(exerciseSets.value);
        const rest = parseInt(exerciseRest.value);
        const repsMin = parseInt(exerciseRepsMin.value);
        const repsMax = parseInt(exerciseRepsMax.value);
        const weightMin = parseFloat(exerciseWeightMin.value);
        const weightMax = parseFloat(exerciseWeightMax.value);
        const notes = exerciseNotes.value;

        // Crear el objeto de ejercicio configurado
        const configuredExercise = {
            ...selectedExercise,
            sets,
            rest,
            reps: {
                min: repsMin,
                max: repsMax
            },
            weight: {
                min: weightMin,
                max: weightMax
            },
            notes
        };

        // Añadir el ejercicio al día actual
        console.log('Día actual:', currentDay);
        console.log('Ejercicios antes de añadir:', JSON.stringify(routineExercises));

        routineExercises[currentDay].push(configuredExercise);

        console.log('Ejercicios después de añadir:', JSON.stringify(routineExercises));

        // Actualizar la visualización de los ejercicios del día
        updateDayExercises(currentDay);

        // Cerrar el modal
        closeModal();
    }

    // Función para actualizar la visualización de los ejercicios de un día
    function updateDayExercises(day) {
        console.log('Actualizando ejercicios del día:', day);

        const dayExercisesContainer = document.getElementById(`day-${day}-exercises`);
        console.log('Contenedor de ejercicios:', dayExercisesContainer);

        if (!dayExercisesContainer) {
            console.error(`No se encontró el contenedor para el día ${day}`);
            return;
        }

        // Verificar si hay ejercicios para este día
        console.log('Ejercicios para este día:', routineExercises[day]);

        if (routineExercises[day].length === 0) {
            console.log('No hay ejercicios para este día');
            dayExercisesContainer.innerHTML = `
                <div class="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <p class="text-gray-500">Añade ejercicios desde la biblioteca</p>
                </div>
            `;
            return;
        }

        // Limpiar el contenedor
        dayExercisesContainer.innerHTML = '';

        // Añadir cada ejercicio al contenedor
        routineExercises[day].forEach((exercise, index) => {
            const exerciseCard = document.createElement('div');
            exerciseCard.className = 'bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all';
            exerciseCard.dataset.id = exercise.id;

            // Crear etiquetas para grupos musculares
            const muscleGroupsHTML = exercise.muscleGroups.map(muscle =>
                `<span class="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded mr-1 mb-1 inline-block">${muscle}</span>`
            ).join('');

            exerciseCard.innerHTML = `
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h3 class="font-semibold text-gray-800">${exercise.name}</h3>
                        <div class="flex flex-wrap mt-1 mb-1">
                            ${muscleGroupsHTML}
                        </div>
                        <div class="grid grid-cols-2 gap-2 mt-2">
                            <div>
                                <p class="text-xs text-gray-600 font-medium">Series</p>
                                <p class="text-sm">${exercise.sets}</p>
                            </div>
                            <div>
                                <p class="text-xs text-gray-600 font-medium">Descanso</p>
                                <p class="text-sm">${exercise.rest} seg</p>
                            </div>
                            <div>
                                <p class="text-xs text-gray-600 font-medium">Repeticiones</p>
                                <p class="text-sm">${exercise.reps.min}-${exercise.reps.max}</p>
                            </div>
                            <div>
                                <p class="text-xs text-gray-600 font-medium">Peso (kg)</p>
                                <p class="text-sm">${exercise.weight.min}-${exercise.weight.max}</p>
                            </div>
                        </div>
                        ${exercise.notes ? `<p class="text-xs text-gray-600 mt-2 italic">Notas: ${exercise.notes}</p>` : ''}
                    </div>
                    <div class="flex flex-col space-y-2">
                        <button class="edit-exercise-btn p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-all" data-index="${index}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                        <button class="remove-exercise-btn p-2 text-red-600 hover:bg-red-50 rounded-full transition-all" data-index="${index}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            `;

            // Añadir event listeners a los botones
            const editButton = exerciseCard.querySelector('.edit-exercise-btn');
            editButton.addEventListener('click', () => {
                editExercise(day, index);
            });

            const removeButton = exerciseCard.querySelector('.remove-exercise-btn');
            removeButton.addEventListener('click', () => {
                removeExercise(day, index);
            });

            dayExercisesContainer.appendChild(exerciseCard);
        });
    }

    // Función para editar un ejercicio
    function editExercise(day, index) {
        // Obtener el ejercicio
        const exercise = routineExercises[day][index];

        // Guardar el ejercicio seleccionado
        selectedExercise = { ...exercise, index };

        // Actualizar el título del modal
        modalTitle.textContent = 'Editar Ejercicio';

        // Actualizar el contenido del modal
        exerciseName.textContent = exercise.name;
        exerciseDescription.textContent = exercise.description;

        // Establecer los valores de los inputs
        exerciseSets.value = exercise.sets;
        exerciseRest.value = exercise.rest;
        exerciseRepsMin.value = exercise.reps.min;
        exerciseRepsMax.value = exercise.reps.max;
        exerciseWeightMin.value = exercise.weight.min;
        exerciseWeightMax.value = exercise.weight.max;
        exerciseNotes.value = exercise.notes || '';

        // Cambiar el texto del botón de añadir
        addExerciseButton.textContent = 'Guardar Cambios';

        // Mostrar el modal
        exerciseConfigModal.classList.remove('hidden');

        // Animar la aparición del modal
        setTimeout(() => {
            modalContainer.classList.remove('scale-95', 'opacity-0');
            modalContainer.classList.add('scale-100', 'opacity-100');
        }, 10);

        // Eliminar todos los event listeners anteriores
        const newButton = addExerciseButton.cloneNode(true);
        addExerciseButton.parentNode.replaceChild(newButton, addExerciseButton);
        addExerciseButton = newButton;

        // Cambiar el texto del botón
        addExerciseButton.textContent = 'Guardar Cambios';

        // Añadir nuevo event listener para guardar cambios
        addExerciseButton.addEventListener('click', function saveChanges() {
            console.log('Guardando cambios del ejercicio');

            // Obtener los valores de configuración
            const sets = parseInt(exerciseSets.value);
            const rest = parseInt(exerciseRest.value);
            const repsMin = parseInt(exerciseRepsMin.value);
            const repsMax = parseInt(exerciseRepsMax.value);
            const weightMin = parseFloat(exerciseWeightMin.value);
            const weightMax = parseFloat(exerciseWeightMax.value);
            const notes = exerciseNotes.value;

            console.log('Valores de configuración:', { sets, rest, repsMin, repsMax, weightMin, weightMax, notes });

            // Actualizar el ejercicio
            routineExercises[day][index] = {
                ...exercise,
                sets,
                rest,
                reps: {
                    min: repsMin,
                    max: repsMax
                },
                weight: {
                    min: weightMin,
                    max: weightMax
                },
                notes
            };

            console.log('Ejercicio actualizado:', routineExercises[day][index]);

            // Actualizar la visualización de los ejercicios del día
            updateDayExercises(day);

            // Cerrar el modal
            closeModal();

            // Restaurar el botón original
            const newButton = addExerciseButton.cloneNode(true);
            addExerciseButton.parentNode.replaceChild(newButton, addExerciseButton);
            addExerciseButton = newButton;
            addExerciseButton.textContent = 'Añadir a la Rutina';

            // Restaurar el event listener original
            addExerciseButton.addEventListener('click', function() {
                console.log('Botón de añadir ejercicio clickeado (restaurado)');
                window.originalAddExerciseFunction();
            });
        });
    }

    // Función para eliminar un ejercicio
    function removeExercise(day, index) {
        // Eliminar el ejercicio del array
        routineExercises[day].splice(index, 1);

        // Actualizar la visualización de los ejercicios del día
        updateDayExercises(day);
    }

    // Función para limpiar la rutina
    function clearRoutine() {
        // Confirmar la acción
        if (confirm('¿Estás seguro de que quieres limpiar toda la rutina? Esta acción no se puede deshacer.')) {
            // Reiniciar el objeto de ejercicios por día
            routineExercises = {};
            for (let i = 1; i <= parseInt(routineDaysSelect.value); i++) {
                routineExercises[i] = [];
                updateDayExercises(i);
            }
        }
    }

    // Función para guardar la rutina
    function saveRoutine() {
        // Verificar que la rutina tenga un nombre
        if (!routineNameInput.value.trim()) {
            alert('Por favor, ingresa un nombre para la rutina.');
            routineNameInput.focus();
            return;
        }

        // Verificar que la rutina tenga al menos un ejercicio
        let hasExercises = false;
        for (const day in routineExercises) {
            if (routineExercises[day].length > 0) {
                hasExercises = true;
                break;
            }
        }

        if (!hasExercises) {
            alert('Por favor, añade al menos un ejercicio a la rutina.');
            return;
        }

        // Crear el objeto de rutina
        const routine = {
            name: routineNameInput.value.trim(),
            description: routineDescriptionInput.value.trim(),
            days: parseInt(routineDaysSelect.value),
            exercises: routineExercises,
            createdAt: new Date().toISOString()
        };

        // En una aplicación real, aquí se guardaría la rutina en una base de datos
        // Por ahora, solo la guardamos en el localStorage
        const routines = JSON.parse(localStorage.getItem('gym-tracker-routines') || '[]');
        routines.push(routine);
        localStorage.setItem('gym-tracker-routines', JSON.stringify(routines));

        // Mostrar mensaje de éxito
        alert(`Rutina "${routine.name}" guardada con éxito.`);

        // Opcional: redirigir a la página de rutinas
        // window.location.href = 'routines.html';
    }
});
