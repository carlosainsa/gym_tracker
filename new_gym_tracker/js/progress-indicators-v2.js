// Script para añadir indicadores de progreso a los ejercicios (versión 2)
// Esta versión cambia el color de fondo de las cajas en lugar de añadir iconos

document.addEventListener('DOMContentLoaded', function() {
    // Añadir event listeners a todos los inputs de repeticiones y peso
    const repInputs = document.querySelectorAll('input[placeholder="Reps"]');
    const weightInputs = document.querySelectorAll('input[placeholder="Peso"]');

    // Añadir event listeners a los inputs
    repInputs.forEach(input => {
        input.addEventListener('input', updateIndicators);
        input.addEventListener('change', updateIndicators);
    });

    weightInputs.forEach(input => {
        input.addEventListener('input', updateIndicators);
        input.addEventListener('change', updateIndicators);
    });

    // Añadir event listeners a los botones de guardar
    const saveButtons = document.querySelectorAll('button');
    saveButtons.forEach(button => {
        if (button.textContent.trim() === 'Guardar') {
            button.addEventListener('click', updateAllIndicators);
        }
    });

    // Función para actualizar los indicadores cuando se ingresan valores
    function updateIndicators(event) {
        const input = event.target;
        const row = input.closest('.grid.grid-cols-5.gap-2.items-center');

        if (!row) return;

        // Obtener los valores planificados y reales
        const plannedReps = row.querySelector('.bg-white.p-2.rounded.border:nth-child(2)').textContent.trim();
        const plannedWeight = row.querySelector('.bg-white.p-2.rounded.border:nth-child(3)').textContent.trim();
        const actualRepsInput = row.querySelector('input[placeholder="Reps"]');
        const actualWeightInput = row.querySelector('input[placeholder="Peso"]');

        // Solo proceder si ambos valores reales están ingresados
        if (actualRepsInput.value && actualWeightInput.value) {
            // Calcular porcentajes de cumplimiento
            const repPercentage = calculatePercentage(plannedReps, actualRepsInput.value);
            const weightPercentage = calculatePercentage(plannedWeight, actualWeightInput.value);

            // Actualizar colores de los inputs
            updateInputColor(actualRepsInput, repPercentage);
            updateInputColor(actualWeightInput, weightPercentage);

            // Actualizar color del fondo de la fila
            updateRowColor(row, (repPercentage + weightPercentage) / 2);
        }
    }

    // Función para calcular el porcentaje de cumplimiento
    function calculatePercentage(planned, actual) {
        // Manejar rangos en los valores planificados (ej: "12-15")
        let plannedValue;
        if (planned.includes('-')) {
            const range = planned.split('-');
            // Usar el valor mínimo del rango como referencia
            // Por ejemplo, si el rango es 12-15 repeticiones, se toma 12 como referencia
            // Si el rango es 65-70 kg, se toma 65 como referencia
            plannedValue = parseFloat(range[0]);
            console.log(`Rango detectado: ${planned}. Usando valor mínimo: ${plannedValue} como referencia`);
        } else {
            plannedValue = parseFloat(planned);
        }

        const actualValue = parseFloat(actual);

        if (isNaN(plannedValue) || isNaN(actualValue) || plannedValue === 0) {
            return 0;
        }

        return (actualValue / plannedValue) * 100;
    }

    // Función para actualizar el color del input según el porcentaje
    function updateInputColor(input, percentage) {
        // Eliminar clases de color existentes
        input.classList.remove('bg-green-50', 'border-green-300', 'bg-yellow-50', 'border-yellow-300', 'bg-red-50', 'border-red-300');

        // Añadir clases según el porcentaje
        if (percentage >= 100) {
            // Cumplimiento completo (verde)
            input.classList.add('bg-green-50', 'border-green-300');
            input.title = '100% o más del valor mínimo completado';
        } else if (percentage >= 80) {
            // Cumplimiento parcial (amarillo)
            input.classList.add('bg-yellow-50', 'border-yellow-300');
            input.title = 'Entre 80% y 99.9% del valor mínimo completado';
        } else {
            // Cumplimiento bajo (rojo)
            input.classList.add('bg-red-50', 'border-red-300');
            input.title = 'Menos del 80% del valor mínimo completado';
        }
    }

    // Función para actualizar el color de la fila según el porcentaje promedio
    function updateRowColor(row, avgPercentage) {
        // Eliminar clases de color existentes
        row.classList.remove('bg-green-50', 'bg-yellow-50', 'bg-red-50');

        // Añadir una clase sutil según el porcentaje
        if (avgPercentage >= 100) {
            // Cumplimiento completo (verde sutil)
            row.classList.add('bg-green-50');
            row.title = 'Serie completada al 100% o más del valor mínimo';
        } else if (avgPercentage >= 80) {
            // Cumplimiento parcial (amarillo sutil)
            row.classList.add('bg-yellow-50');
            row.title = 'Serie completada entre 80% y 99.9% del valor mínimo';
        } else {
            // Cumplimiento bajo (rojo sutil)
            row.classList.add('bg-red-50');
            row.title = 'Serie completada menos del 80% del valor mínimo';
        }
    }

    // Función para actualizar el color del ejercicio según el porcentaje promedio
    function updateExerciseColor(exerciseCard) {
        const seriesRows = exerciseCard.querySelectorAll('.grid.grid-cols-5.gap-2.items-center');
        let totalPercentage = 0;
        let completedSeries = 0;

        seriesRows.forEach(row => {
            const repInput = row.querySelector('input[placeholder="Reps"]');
            const weightInput = row.querySelector('input[placeholder="Peso"]');

            if (repInput.value && weightInput.value) {
                const plannedReps = row.querySelector('.bg-white.p-2.rounded.border:nth-child(2)').textContent.trim();
                const plannedWeight = row.querySelector('.bg-white.p-2.rounded.border:nth-child(3)').textContent.trim();

                const repPercentage = calculatePercentage(plannedReps, repInput.value);
                const weightPercentage = calculatePercentage(plannedWeight, weightInput.value);

                totalPercentage += (repPercentage + weightPercentage) / 2;
                completedSeries++;
            }
        });

        // Solo proceder si al menos una serie está completa
        if (completedSeries > 0) {
            const avgPercentage = totalPercentage / completedSeries;

            // Eliminar clases de color existentes
            exerciseCard.classList.remove('border-green-200', 'border-yellow-200', 'border-red-200');

            // Añadir borde de color según el porcentaje
            if (avgPercentage >= 100) {
                // Cumplimiento completo (verde)
                exerciseCard.classList.add('border-green-200');
                exerciseCard.title = 'Ejercicio completado al 100% o más';
            } else if (avgPercentage >= 80) {
                // Cumplimiento parcial (amarillo)
                exerciseCard.classList.add('border-yellow-200');
                exerciseCard.title = 'Ejercicio completado entre 80% y 99.9%';
            } else {
                // Cumplimiento bajo (rojo)
                exerciseCard.classList.add('border-red-200');
                exerciseCard.title = 'Ejercicio completado menos del 80%';
            }

            return avgPercentage;
        }

        return 0;
    }

    // Función para actualizar el indicador de la rutina completa del día
    function updateDayIndicator() {
        const exerciseCards = document.querySelectorAll('.bg-white.rounded-xl.shadow-card.p-5.mb-5');
        let totalPercentage = 0;
        let completedExercises = 0;

        exerciseCards.forEach(card => {
            const percentage = updateExerciseColor(card);
            if (percentage > 0) {
                totalPercentage += percentage;
                completedExercises++;
            }
        });

        // Solo proceder si al menos un ejercicio está completo
        if (completedExercises > 0) {
            const avgPercentage = totalPercentage / completedExercises;

            // Obtener o crear el indicador del día
            let dayIndicator = document.getElementById('day-indicator');
            if (!dayIndicator) {
                dayIndicator = document.createElement('div');
                dayIndicator.id = 'day-indicator';
                dayIndicator.classList.add('fixed', 'top-0', 'right-0', 'mt-16', 'mr-4', 'z-50', 'p-2', 'rounded-lg', 'shadow-lg', 'font-bold', 'text-white');
                document.body.appendChild(dayIndicator);
            }

            // Eliminar clases de color existentes
            dayIndicator.classList.remove('bg-green-600', 'bg-yellow-600', 'bg-red-600');

            // Añadir color según el porcentaje
            if (avgPercentage >= 100) {
                // Cumplimiento completo (verde)
                dayIndicator.classList.add('bg-green-600');
                dayIndicator.textContent = 'Día: 100%+';
                dayIndicator.title = 'Día completado al 100% o más';
            } else if (avgPercentage >= 80) {
                // Cumplimiento parcial (amarillo)
                dayIndicator.classList.add('bg-yellow-600');
                dayIndicator.textContent = 'Día: ' + Math.round(avgPercentage) + '%';
                dayIndicator.title = 'Día completado entre 80% y 99.9%';
            } else {
                // Cumplimiento bajo (rojo)
                dayIndicator.classList.add('bg-red-600');
                dayIndicator.textContent = 'Día: ' + Math.round(avgPercentage) + '%';
                dayIndicator.title = 'Día completado menos del 80%';
            }
        }
    }

    // Función para actualizar todos los indicadores
    function updateAllIndicators() {
        const exerciseCards = document.querySelectorAll('.bg-white.rounded-xl.shadow-card.p-5.mb-5');

        exerciseCards.forEach(card => {
            const seriesRows = card.querySelectorAll('.grid.grid-cols-5.gap-2.items-center');

            seriesRows.forEach(row => {
                const repInput = row.querySelector('input[placeholder="Reps"]');
                const weightInput = row.querySelector('input[placeholder="Peso"]');

                if (repInput.value && weightInput.value) {
                    const plannedReps = row.querySelector('.bg-white.p-2.rounded.border:nth-child(2)').textContent.trim();
                    const plannedWeight = row.querySelector('.bg-white.p-2.rounded.border:nth-child(3)').textContent.trim();

                    const repPercentage = calculatePercentage(plannedReps, repInput.value);
                    const weightPercentage = calculatePercentage(plannedWeight, weightInput.value);

                    updateInputColor(repInput, repPercentage);
                    updateInputColor(weightInput, weightPercentage);
                    updateRowColor(row, (repPercentage + weightPercentage) / 2);
                }
            });

            updateExerciseColor(card);
        });

        updateDayIndicator();
    }
});
