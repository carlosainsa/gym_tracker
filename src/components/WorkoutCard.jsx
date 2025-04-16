import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { useWorkout } from '../context/WorkoutContext';



// Función para formatear la descripción del entrenamiento
const formatWorkoutDescription = (description, workout) => {
  if (!description) return '';

  // Dividir la descripción en líneas
  const lines = description.trim().split('\n');

  // Objeto para almacenar las secciones
  const sections = {
    calentamiento: { title: 'I. Calentamiento', items: [], found: false },
    principal: { title: 'II. Bloque Principal', items: [], found: false },
    finalizacion: { title: 'III. Finalización', items: [], found: false }
  };

  // Variable para rastrear la sección actual
  let currentSection = null;

  // Procesar cada línea
  for (const line of lines) {
    const trimmedLine = line.trim();

    // Saltar líneas vacías
    if (!trimmedLine) continue;

    // Detectar secciones
    if (trimmedLine.startsWith('I. Calentamiento')) {
      currentSection = 'calentamiento';
      sections.calentamiento.found = true;
      // Extraer el tiempo si está presente
      const timeMatch = trimmedLine.match(/\((.*?)\)/);
      if (timeMatch) {
        sections.calentamiento.title = `I. Calentamiento ${timeMatch[0]}`;
      }
      continue;
    } else if (trimmedLine.startsWith('II. Bloque Principal')) {
      currentSection = 'principal';
      sections.principal.found = true;
      // Extraer el tiempo si está presente
      const timeMatch = trimmedLine.match(/\((.*?)\)/);
      if (timeMatch) {
        sections.principal.title = `II. Bloque Principal ${timeMatch[0]}`;
      }
      continue;
    } else if (trimmedLine.startsWith('III. Finalización')) {
      currentSection = 'finalizacion';
      sections.finalizacion.found = true;
      // Extraer el tiempo si está presente
      const timeMatch = trimmedLine.match(/\((.*?)\)/);
      if (timeMatch) {
        sections.finalizacion.title = `III. Finalización ${timeMatch[0]}`;
      }
      continue;
    }

    // Añadir elementos a la sección actual
    if (currentSection && trimmedLine.startsWith('-')) {
      sections[currentSection].items.push(trimmedLine);
    }
  }

  // Construir el HTML formateado
  let formattedHTML = '';

  // Añadir cada sección encontrada
  for (const [key, section] of Object.entries(sections)) {
    if (section.found) {
      // Si es la sección principal y hay ejercicios, mostrarlos
      if (key === 'principal' && workout.exercises && workout.exercises.length > 0) {
        formattedHTML += `<div class="mb-3">
          <h4 class="font-medium text-gray-800 dark:text-gray-200 mb-1">${section.title}</h4>
          <ul class="pl-5 space-y-1 text-gray-600 dark:text-gray-400 text-sm">
            ${section.items.map(item => `<li>${item.substring(1).trim()}</li>`).join('')}
            ${workout.exercises.map(exercise =>
              `<li class="mt-2"><span class="font-medium">${exercise.name}</span>: ${exercise.sets.length} series × ${exercise.sets[0]?.reps || '?'} reps</li>`
            ).join('')}
          </ul>
        </div>`;
      } else {
        formattedHTML += `<div class="mb-3">
          <h4 class="font-medium text-gray-800 dark:text-gray-200 mb-1">${section.title}</h4>
          <ul class="pl-5 space-y-1 text-gray-600 dark:text-gray-400 text-sm">
            ${section.items.map(item => `<li>${item.substring(1).trim()}</li>`).join('')}
          </ul>
        </div>`;
      }
    }
  }

  return formattedHTML;
};

const WorkoutCard = ({ workout }) => {
  const navigate = useNavigate();
  const { setExpandedDay } = useWorkout();

  const handleStartWorkout = () => {
    // Si es un día de descanso, no hacer nada
    if (workout.isRestDay) {
      return;
    }

    // Establecer el día expandido antes de navegar
    setExpandedDay(workout.id);
    // Navegar a la página de registro de entrenamiento
    navigate(`/workout/${workout.id}`);
  };

  return (
    <article
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
      aria-labelledby={`workout-title-${workout.id}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          {!workout.isRestDay ? (
            <div className="mb-2">
              <div className="text-gray-700 dark:text-gray-300 font-medium">
                {workout.name.match(/\(Fase (\d+)\)/) ? `Fase ${workout.name.match(/\(Fase (\d+)\)/)[1]}` : ''}
              </div>
              <div className="text-xl font-bold text-gray-800 dark:text-white">
                {workout.name.match(/Entrenamiento (\d+)/) ? `Entrenamiento ${workout.name.match(/Entrenamiento (\d+)/)[1]}` : ''}
              </div>
              <div className="text-lg font-semibold text-gray-800 dark:text-white">
                {workout.name.match(/: ([^-]+)/) ? workout.name.match(/: ([^-]+)/)[1].trim() : ''}
              </div>
              <div className="text-lg font-semibold text-gray-800 dark:text-white">
                {workout.name.match(/- ([^(]+)/) ? workout.name.match(/- ([^(]+)/)[1].trim() : ''}
              </div>
            </div>
          ) : (
            <h2
              id={`workout-title-${workout.id}`}
              className="text-xl font-semibold text-gray-800 dark:text-white mb-2"
            >
              {workout.name}
            </h2>
          )}
          {workout.description ? (
            <div
              className="text-gray-600 dark:text-gray-300 mt-2"
              dangerouslySetInnerHTML={{
                __html: formatWorkoutDescription(workout.description, workout)
              }}
            />
          ) : (
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Entrenamiento completo para mejorar fuerza y resistencia
            </p>
          )}

          {/* Detalles adicionales del entrenamiento */}
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
              Detalles del entrenamiento:
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
              {!workout.isRestDay ? (
                <>
                  <li>• Duración estimada: 45-60 minutos</li>
                  <li>• Intensidad: {workout.intensity || 'Moderada'}</li>
                  <li>• Enfoque: {workout.focus || 'Entrenamiento completo'}</li>
                  <li>• Descanso entre series: 60-90 segundos</li>
                </>
              ) : (
                <>
                  <li>• Tipo: Día de recuperación activa</li>
                  <li>• Beneficios: Recuperación muscular, reducción de fatiga</li>
                  <li>• Recomendación: Mantener hidratación y alimentación adecuada</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      {workout.isRestDay && (
        <div className="mt-4">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Recomendaciones para el descanso:
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center text-gray-600 dark:text-gray-400">
              <span className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full mr-2" aria-hidden="true"></span>
              Caminata ligera (20-30 min)
            </li>
            <li className="flex items-center text-gray-600 dark:text-gray-400">
              <span className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full mr-2" aria-hidden="true"></span>
              Estiramientos suaves
            </li>
            <li className="flex items-center text-gray-600 dark:text-gray-400">
              <span className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full mr-2" aria-hidden="true"></span>
              Hidratación adecuada
            </li>
          </ul>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        {!workout.isRestDay ? (
          <button
            onClick={handleStartWorkout}
            className="flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            aria-label={`Iniciar entrenamiento de ${workout.name}`}
          >
            <span className="mr-2">Iniciar entrenamiento</span>
            <FaArrowRight aria-hidden="true" />
          </button>
        ) : (
          <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg">
            <span className="font-medium">Día de descanso</span>
          </div>
        )}
      </div>
    </article>
  );
};

export default WorkoutCard;