// Script para añadir la funcionalidad de comparación entre valores planificados y reales a todos los ejercicios

document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar todos los ejercicios que no tienen la funcionalidad implementada
    const exerciseCards = document.querySelectorAll('.bg-white.rounded-xl.shadow-card.p-5.mb-5');
    
    exerciseCards.forEach(card => {
        // Verificar si el ejercicio ya tiene la funcionalidad implementada
        if (!card.querySelector('.grid.grid-cols-5.gap-2')) {
            // Obtener información del ejercicio
            const titleElement = card.querySelector('h3.text-lg.font-bold');
            if (!titleElement) return;
            
            const title = titleElement.textContent.trim();
            
            // Buscar información de series, repeticiones y peso
            let series = '3';
            let reps = '12-15';
            let weight = '0';
            
            const infoTexts = card.querySelectorAll('.flex.items-center.text-sm.text-gray-600 span');
            infoTexts.forEach(span => {
                const text = span.textContent.trim();
                if (text.includes('series x')) {
                    series = text.split('series x')[0].trim();
                    reps = text.split('series x')[1].trim();
                } else if (text.includes('Peso:')) {
                    weight = text.split('Peso:')[1].trim();
                }
            });
            
            // Eliminar el botón existente
            const button = card.querySelector('button');
            if (button) {
                button.parentNode.removeChild(button);
            }
            
            // Crear el formulario de comparación
            const formHTML = `
            <div class="mt-5 border-t border-gray-100 pt-5">
                <h4 class="font-semibold text-gray-800 mb-3">Registrar series:</h4>
                
                <div class="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div class="grid grid-cols-5 gap-2 text-sm text-gray-600 mb-2 px-2">
                        <div class="font-medium">Serie</div>
                        <div class="col-span-2 text-center flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span>Planificado (Fase 1)</span>
                        </div>
                        <div class="col-span-2 text-center flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Realizado</span>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-5 gap-2 text-sm text-gray-600 mb-1 px-2">
                        <div></div>
                        <div>Repeticiones</div>
                        <div>Peso (kg)</div>
                        <div>Repeticiones</div>
                        <div>Peso (kg)</div>
                    </div>
                    
                    <div class="space-y-3" id="series-container-${title.replace(/\s+/g, '-').toLowerCase()}">
                        <!-- Las series se añadirán dinámicamente -->
                    </div>
                </div>
                
                <div class="mt-4 mb-4">
                    <textarea placeholder="Notas (opcional)" class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" rows="2"></textarea>
                </div>
                
                <div class="flex justify-end gap-3">
                    <button class="px-5 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
                        Cancelar
                    </button>
                    <button class="px-5 py-3 bg-primary-600 text-white rounded-lg font-medium shadow-button hover:bg-primary-700 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50">
                        Guardar
                    </button>
                </div>
            </div>
            `;
            
            // Añadir el formulario al ejercicio
            card.innerHTML = card.innerHTML + formHTML;
            
            // Añadir las series dinámicamente
            const seriesContainer = card.querySelector(`#series-container-${title.replace(/\s+/g, '-').toLowerCase()}`);
            const numSeries = parseInt(series);
            
            for (let i = 1; i <= numSeries; i++) {
                const serieHTML = `
                <!-- Serie ${i} -->
                <div class="grid grid-cols-5 gap-2 items-center">
                    <div class="w-10 h-10 flex items-center justify-center bg-primary-100 text-primary-800 font-bold rounded-lg">
                        ${i}
                    </div>
                    <div class="bg-white p-2 rounded border border-gray-200 text-center">${reps}</div>
                    <div class="bg-white p-2 rounded border border-gray-200 text-center">${weight}</div>
                    <div>
                        <input type="text" inputmode="numeric" placeholder="Reps" class="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all">
                    </div>
                    <div>
                        <input type="text" inputmode="decimal" placeholder="Peso" class="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all">
                    </div>
                </div>
                `;
                
                seriesContainer.innerHTML += serieHTML;
            }
        }
    });
});
