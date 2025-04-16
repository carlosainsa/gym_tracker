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

// Función para formatear el título del entrenamiento
const formatWorkoutTitle = (title) => {
  if (!title) return '';

  // Ejemplo: "Entrenamiento 1: Cuerpo Completo - Énfasis en Empuje (Fase 1)"
  // Resultado deseado:
  // Fase 1
  // Entrenamiento 1
  // Cuerpo Completo
  // Énfasis en Empuje

  // Extraer la fase
  const phaseMatch = title.match(/\(Fase (\d+)\)/);
  const phase = phaseMatch ? `Fase ${phaseMatch[1]}` : '';

  // Extraer el número de entrenamiento
  const trainingMatch = title.match(/Entrenamiento (\d+)/);
  const trainingNumber = trainingMatch ? `Entrenamiento ${trainingMatch[1]}` : '';

  // Extraer el tipo de entrenamiento (Cuerpo Completo, etc.)
  const typeMatch = title.match(/: ([^-]+)/);
  const trainingType = typeMatch ? typeMatch[1].trim() : '';

  // Extraer el énfasis
  const emphasisMatch = title.match(/- ([^(]+)/);
  const emphasis = emphasisMatch ? emphasisMatch[1].trim() : '';

  return { phase, trainingNumber, trainingType, emphasis };
};

const TodaysWorkoutCard = ({ workout }) => {
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

  // Formatear el título del entrenamiento
  let phase = '';
  let trainingNumber = '';
  let trainingType = '';
  let emphasis = '';

  if (!workout.isRestDay && workout.name) {
    // Extraer directamente las partes del título usando expresiones regulares
    const phaseMatch = workout.name.match(/\(Fase (\d+)\)/);
    phase = phaseMatch ? `Fase ${phaseMatch[1]}` : '';

    const trainingMatch = workout.name.match(/Entrenamiento (\d+)/);
    trainingNumber = trainingMatch ? `Entrenamiento ${trainingMatch[1]}` : '';

    const typeMatch = workout.name.match(/: ([^-]+)/);
    trainingType = typeMatch ? typeMatch[1].trim() : '';

    const emphasisMatch = workout.name.match(/- ([^(]+)/);
    emphasis = emphasisMatch ? emphasisMatch[1].trim() : '';

    console.log('Workout name:', workout.name);
    console.log('Formatted title parts:', { phase, trainingNumber, trainingType, emphasis });
  }

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex flex-col">
        {/* Título del entrenamiento */}
        {!workout.isRestDay ? (
          <div className="mb-4">
            {workout.phase && (
              <div className="text-gray-700 dark:text-gray-300 font-medium">Fase {workout.phase}</div>
            )}
            {workout.id && (
              <div className="text-xl font-bold text-gray-800 dark:text-white">Entrenamiento {workout.id}</div>
            )}
            <div className="text-lg font-semibold text-gray-800 dark:text-white">Cuerpo Completo</div>
            {workout.name && workout.name.includes('Empuje') && (
              <div className="text-lg font-semibold text-gray-800 dark:text-white">Énfasis en Empuje</div>
            )}
            {workout.name && workout.name.includes('Tracción') && (
              <div className="text-lg font-semibold text-gray-800 dark:text-white">Énfasis en Tracción</div>
            )}
            {workout.name && workout.name.includes('Piernas') && (
              <div className="text-lg font-semibold text-gray-800 dark:text-white">Énfasis en Piernas y Funcional</div>
            )}
          </div>
        ) : (
          <div className="mb-4">
            <div className="text-xl font-bold text-gray-800 dark:text-white">{workout.name}</div>
          </div>
        )}

        {/* Descripción */}
        {workout.description ? (
          <div
            className="text-gray-600 dark:text-gray-300 mb-4"
            dangerouslySetInnerHTML={{
              __html: formatWorkoutDescription(workout.description, workout)
            }}
          />
        ) : (
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Entrenamiento completo para mejorar fuerza y resistencia
          </p>
        )}

        {/* Detalles del entrenamiento */}
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mb-4">
          <div className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
            Detalles del entrenamiento:
          </div>
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

        {/* Botón de iniciar entrenamiento */}
        <div className="flex justify-end">
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
      </div>
    </article>
  );
};

export default TodaysWorkoutCard;
