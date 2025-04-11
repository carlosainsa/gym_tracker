import { useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import ExerciseCard from '../components/ExerciseCard';
import PhaseSelector from '../components/PhaseSelector';

const HomePage = () => {
  const { plan } = useWorkout();
  const [selectedDay, setSelectedDay] = useState(1);

  // Encontrar el día seleccionado
  const currentDay = plan.days.find(day => day.id === selectedDay);

  return (
    <div className="container mx-auto px-4 py-6 pt-14 pb-20">
      <h1 className="text-2xl font-bold mb-4">Gym Tracker</h1>

      <PhaseSelector />

      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h2 className="text-lg font-semibold mb-2">Selecciona un día</h2>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {plan.days.map(day => (
            <button
              key={day.id}
              onClick={() => setSelectedDay(day.id)}
              className={`py-2 px-4 rounded-lg whitespace-nowrap ${
                selectedDay === day.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {day.name.split(':')[0]}
            </button>
          ))}
        </div>
      </div>

      {currentDay && (
        <div>
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <h2 className="text-lg font-semibold">{currentDay.name}</h2>
            <p className="text-gray-600">Recomendado: {currentDay.recommendedDay}</p>
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-3">Ejercicios</h3>

          {currentDay.exercises.map(exercise => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              dayId={currentDay.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
