import { useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import PhaseSelector from '../components/PhaseSelector';

const PlanPage = () => {
  const { plan, currentPhase } = useWorkout();
  const [expandedDay, setExpandedDay] = useState(null);

  const toggleDay = (dayId) => {
    if (expandedDay === dayId) {
      setExpandedDay(null);
    } else {
      setExpandedDay(dayId);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 pt-14 pb-20">
      <h1 className="text-2xl font-bold mb-4">Plan de Entrenamiento</h1>

      <PhaseSelector />

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">{plan.name}</h2>
        <p className="text-gray-600">
          Este plan está diseñado para optimizar tu entrenamiento según tus objetivos específicos de reducir grasa, ganar músculo y mejorar la flexibilidad de cadera.
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-3">Días de entrenamiento</h2>

      {plan.days.map(day => (
        <div key={day.id} className="bg-white rounded-lg shadow mb-4 overflow-hidden">
          <button
            onClick={() => toggleDay(day.id)}
            className="w-full p-4 text-left flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{day.name}</h3>
              <p className="text-sm text-gray-600">Recomendado: {day.recommendedDay}</p>
            </div>
            <span className="text-xl">
              {expandedDay === day.id ? '−' : '+'}
            </span>
          </button>

          {expandedDay === day.id && (
            <div className="p-4 border-t">
              <h4 className="font-medium mb-2">Ejercicios (Fase {currentPhase}):</h4>

              <div className="space-y-3">
                {day.exercises.map(exercise => {
                  const phaseData = exercise[`phase${currentPhase}`];

                  return (
                    <div key={exercise.id} className="border-b pb-3">
                      <h5 className="font-medium">{exercise.name}</h5>
                      <div className="grid grid-cols-3 text-sm mt-1">
                        <div>
                          <span className="text-gray-600">Series:</span> {phaseData.sets}
                        </div>
                        <div>
                          <span className="text-gray-600">Reps:</span> {phaseData.reps}
                        </div>
                        <div>
                          <span className="text-gray-600">Peso:</span> {phaseData.weight}
                        </div>
                      </div>
                      <div className="text-sm mt-1">
                        <span className="text-gray-600">Descanso:</span> {exercise.rest}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="bg-white rounded-lg shadow p-4 mt-6">
        <h3 className="font-semibold mb-2">Notas importantes</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          <li>Realiza siempre un calentamiento adecuado antes de cada sesión</li>
          <li>Mantén una buena técnica en todos los ejercicios</li>
          <li>Ajusta los pesos según tu capacidad actual</li>
          <li>Registra tus entrenamientos para seguir tu progreso</li>
          <li>Descansa adecuadamente entre sesiones (24-48 horas para cada grupo muscular)</li>
        </ul>
      </div>
    </div>
  );
};

export default PlanPage;
