// Script para añadir indicadores de progreso a los ejercicios

document.addEventListener('DOMContentLoaded', function() {
    // Añadir event listeners a todos los inputs de repeticiones y peso
    const repInputs = document.querySelectorAll('input[placeholder="Reps"]');
    const weightInputs = document.querySelectorAll('input[placeholder="Peso"]');
    
    // Añadir event listeners a los inputs
    repInputs.forEach(input => {
        input.addEventListener('input', updateIndicators);
    });
    
    weightInputs.forEach(input => {
        input.addEventListener('input', updateIndicators);
    });
    
    // Añadir botones de guardar para actualizar los indicadores
    const saveButtons = document.querySelectorAll('button:contains("Guardar")');
    saveButtons.forEach(button => {
        button.addEventListener('click', updateAllIndicators);
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
            
            // Añadir o actualizar indicadores
            updateIndicator(actualRepsInput, repPercentage);
            updateIndicator(actualWeightInput, weightPercentage);
            
            // Actualizar indicador de la serie
            updateSeriesIndicator(row, repPercentage, weightPercentage);
        }
    }
    
    // Función para calcular el porcentaje de cumplimiento
    function calculatePercentage(planned, actual) {
        // Manejar rangos en los valores planificados (ej: "12-15")
        let plannedValue;
        if (planned.includes('-')) {
            const range = planned.split('-');
            plannedValue = (parseFloat(range[0]) + parseFloat(range[1])) / 2;
        } else {
            plannedValue = parseFloat(planned);
        }
        
        const actualValue = parseFloat(actual);
        
        if (isNaN(plannedValue) || isNaN(actualValue) || plannedValue === 0) {
            return 0;
        }
        
        return (actualValue / plannedValue) * 100;
    }
    
    // Función para actualizar el indicador visual
    function updateIndicator(input, percentage) {
        // Eliminar indicadores existentes
        const existingIndicator = input.nextElementSibling;
        if (existingIndicator && existingIndicator.classList.contains('progress-indicator')) {
            existingIndicator.remove();
        }
        
        // Crear nuevo indicador
        const indicator = document.createElement('div');
        indicator.classList.add('progress-indicator', 'ml-2', 'flex', 'items-center', 'justify-center');
        
        if (percentage >= 100) {
            // Cumplimiento completo (verde)
            indicator.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>';
            indicator.title = '100% o más completado';
        } else if (percentage >= 80) {
            // Cumplimiento parcial (amarillo)
            indicator.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v5a1 1 0 102 0V7z" clip-rule="evenodd" /></svg>';
            indicator.title = 'Entre 80% y 99.9% completado';
        } else {
            // Cumplimiento bajo (rojo)
            indicator.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>';
            indicator.title = 'Menos del 80% completado';
        }
        
        // Añadir el indicador después del input
        input.parentNode.appendChild(indicator);
    }
    
    // Función para actualizar el indicador de la serie completa
    function updateSeriesIndicator(row, repPercentage, weightPercentage) {
        // Calcular el promedio de los porcentajes
        const avgPercentage = (repPercentage + weightPercentage) / 2;
        
        // Eliminar indicador existente
        const existingIndicator = row.querySelector('.series-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
        // Crear nuevo indicador
        const indicator = document.createElement('div');
        indicator.classList.add('series-indicator', 'absolute', 'right-0', 'top-0', 'mt-2', 'mr-2');
        
        if (avgPercentage >= 100) {
            // Cumplimiento completo (verde)
            indicator.innerHTML = '<div class="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">✓</div>';
            indicator.title = 'Serie completada al 100% o más';
        } else if (avgPercentage >= 80) {
            // Cumplimiento parcial (amarillo)
            indicator.innerHTML = '<div class="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">−</div>';
            indicator.title = 'Serie completada entre 80% y 99.9%';
        } else {
            // Cumplimiento bajo (rojo)
            indicator.innerHTML = '<div class="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">✗</div>';
            indicator.title = 'Serie completada menos del 80%';
        }
        
        // Añadir posición relativa al row si no la tiene
        if (!row.style.position) {
            row.style.position = 'relative';
        }
        
        // Añadir el indicador al row
        row.appendChild(indicator);
    }
    
    // Función para actualizar el indicador del ejercicio completo
    function updateExerciseIndicator(exerciseCard) {
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
            
            // Eliminar indicador existente
            const existingIndicator = exerciseCard.querySelector('.exercise-indicator');
            if (existingIndicator) {
                existingIndicator.remove();
            }
            
            // Crear nuevo indicador
            const indicator = document.createElement('div');
            indicator.classList.add('exercise-indicator', 'absolute', 'right-0', 'top-0', 'mt-4', 'mr-4');
            
            if (avgPercentage >= 100) {
                // Cumplimiento completo (verde)
                indicator.innerHTML = '<div class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg">✓</div>';
                indicator.title = 'Ejercicio completado al 100% o más';
            } else if (avgPercentage >= 80) {
                // Cumplimiento parcial (amarillo)
                indicator.innerHTML = '<div class="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold text-lg">−</div>';
                indicator.title = 'Ejercicio completado entre 80% y 99.9%';
            } else {
                // Cumplimiento bajo (rojo)
                indicator.innerHTML = '<div class="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-lg">✗</div>';
                indicator.title = 'Ejercicio completado menos del 80%';
            }
            
            // Añadir posición relativa al ejercicio si no la tiene
            if (!exerciseCard.style.position) {
                exerciseCard.style.position = 'relative';
            }
            
            // Añadir el indicador al ejercicio
            exerciseCard.appendChild(indicator);
            
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
            const percentage = updateExerciseIndicator(card);
            if (percentage > 0) {
                totalPercentage += percentage;
                completedExercises++;
            }
        });
        
        // Solo proceder si al menos un ejercicio está completo
        if (completedExercises > 0) {
            const avgPercentage = totalPercentage / completedExercises;
            
            // Eliminar indicador existente
            const existingIndicator = document.querySelector('.day-indicator');
            if (existingIndicator) {
                existingIndicator.remove();
            }
            
            // Crear nuevo indicador
            const indicator = document.createElement('div');
            indicator.classList.add('day-indicator', 'fixed', 'top-0', 'right-0', 'mt-16', 'mr-4', 'z-50');
            
            if (avgPercentage >= 100) {
                // Cumplimiento completo (verde)
                indicator.innerHTML = '<div class="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">✓</div>';
                indicator.title = 'Día completado al 100% o más';
            } else if (avgPercentage >= 80) {
                // Cumplimiento parcial (amarillo)
                indicator.innerHTML = '<div class="w-12 h-12 rounded-full bg-yellow-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">−</div>';
                indicator.title = 'Día completado entre 80% y 99.9%';
            } else {
                // Cumplimiento bajo (rojo)
                indicator.innerHTML = '<div class="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">✗</div>';
                indicator.title = 'Día completado menos del 80%';
            }
            
            // Añadir el indicador al body
            document.body.appendChild(indicator);
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
                    
                    updateIndicator(repInput, repPercentage);
                    updateIndicator(weightInput, weightPercentage);
                    updateSeriesIndicator(row, repPercentage, weightPercentage);
                }
            });
            
            updateExerciseIndicator(card);
        });
        
        updateDayIndicator();
    }
    
    // Añadir estilos CSS para los indicadores
    const style = document.createElement('style');
    style.textContent = `
        .progress-indicator {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
        }
        
        input[placeholder="Reps"],
        input[placeholder="Peso"] {
            position: relative;
        }
        
        .grid.grid-cols-5.gap-2.items-center {
            position: relative;
        }
        
        .bg-white.rounded-xl.shadow-card.p-5.mb-5 {
            position: relative;
        }
    `;
    document.head.appendChild(style);
    
    // Añadir jQuery-like selector para botones
    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }
    
    if (!NodeList.prototype.forEach) {
        NodeList.prototype.forEach = Array.prototype.forEach;
    }
    
    if (!HTMLCollection.prototype.forEach) {
        HTMLCollection.prototype.forEach = Array.prototype.forEach;
    }
    
    NodeList.prototype.filter = Array.prototype.filter;
    HTMLCollection.prototype.filter = Array.prototype.filter;
    
    function getElementByText(selector, text) {
        const elements = document.querySelectorAll(selector);
        return Array.from(elements).filter(element => element.textContent.trim() === text);
    }
    
    // Extender el prototipo de NodeList para incluir el método :contains
    NodeList.prototype.contains = function(text) {
        return Array.from(this).filter(element => element.textContent.includes(text));
    };
    
    // Añadir selector :contains a querySelectorAll
    document.querySelectorAll = (function(originalQuerySelectorAll) {
        return function(selector) {
            if (selector.includes(':contains(')) {
                const parts = selector.split(':contains(');
                const baseSelector = parts[0];
                const searchText = parts[1].slice(0, -1);
                const elements = originalQuerySelectorAll.call(this, baseSelector);
                return elements.filter(element => element.textContent.includes(searchText));
            } else {
                return originalQuerySelectorAll.call(this, selector);
            }
        };
    })(document.querySelectorAll);
});
