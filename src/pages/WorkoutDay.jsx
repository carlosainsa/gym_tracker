import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaCalendarDay } from 'react-icons/fa';
import { useWorkout } from '../context/WorkoutContext';
import ExerciseCard from '../components/ExerciseCard';

const WorkoutDay = () => {
  const navigate = useNavigate();
  const { dayNumber } = useParams();
  const { plan, currentPhase } = useWorkout();
  const [day, setDay] = useState(null);
  const [error, setError] = useState(null);

  // Usar useEffect para cargar los datos y manejar errores
  useEffect(() => {
    try {
      console.log('WorkoutDay - Parámetros:', { dayNumber, currentPhase });
      console.log('WorkoutDay - Plan completo:', plan);

      if (!plan || !Array.isArray(plan)) {
        throw new Error('El plan de entrenamiento no es válido');
      }

      // Filtrar los días del plan por la fase actual
      const currentPhaseDays = plan.filter(d => d.phase === currentPhase);
      console.log('WorkoutDay - Días de fase actual:', currentPhaseDays);

      if (!currentPhaseDays || currentPhaseDays.length === 0) {
        throw new Error(`No hay días disponibles para la fase ${currentPhase}`);
      }

      // Convertir dayNumber a número
      const dayNum = parseInt(dayNumber);
      console.log('WorkoutDay - Número de día parseado:', dayNum);

      if (isNaN(dayNum)) {
        throw new Error(`Número de día inválido: ${dayNumber}`);
      }

      // Calcular el índice (base 0)
      const dayIndex = dayNum - 1;
      console.log('WorkoutDay - Índice calculado:', dayIndex);

      // Verificar si el índice es válido
      if (dayIndex < 0 || dayIndex >= currentPhaseDays.length) {
        throw new Error(`Índice fuera de rango: ${dayIndex}`);
      }

      // Obtener el día
      const selectedDay = currentPhaseDays[dayIndex];
      console.log('WorkoutDay - Día seleccionado:', selectedDay);

      if (!selectedDay) {
        throw new Error(`No se encontró el día con índice ${dayIndex}`);
      }

      setDay(selectedDay);
      setError(null);
    } catch (err) {
      console.error('Error en WorkoutDay:', err);
      setError(err.message);
      setDay(null);
    }
  }, [dayNumber, currentPhase, plan]);

  // Si hay un error o no se encuentra el día, mostrar un mensaje y un botón para volver
  if (!day) {
    return (
      <div className="container mx-auto px-4 py-6 pt-16 pb-24 max-w-lg">
        <div className="text-center py-10">
          <p className="text-lg text-gray-800 mb-4">No se encontró el entrenamiento solicitado</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-left">
              <p className="font-medium">Error:</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 pt-16 pb-24 max-w-lg">
      {/* Encabezado con botón de regreso */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/')}
          className="mr-3 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <FaArrowLeft className="text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 flex-1">{day.name}</h1>
      </div>

      {/* Información del día */}
      <div className="bg-white rounded-xl shadow-md p-5 mb-6">
        <div className="flex items-start">
          <FaCalendarDay className="text-primary-600 text-xl mt-1 mr-3" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{day.name}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {day.recommendedDay || 'Flexible'} • {day.exercises.length} ejercicios
            </p>
            {day.description && (
              <p className="text-sm text-gray-700 mt-3">{day.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Lista de ejercicios */}
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Ejercicios</h3>
      <div className="space-y-4">
        {day.exercises.map(exercise => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            dayId={day.id}
            showDetails={true}
          />
        ))}
      </div>
    </div>
  );
};

export default WorkoutDay;
