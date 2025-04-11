import { useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { FaPlus, FaCheck, FaDumbbell, FaStopwatch, FaWeight } from 'react-icons/fa';

const ExerciseCard = ({ exercise, dayId }) => {
  const { currentPhase, addWorkoutLog } = useWorkout();
  const [isLogging, setIsLogging] = useState(false);
  const [logData, setLogData] = useState({
    sets: [],
    notes: ''
  });
  const [completed, setCompleted] = useState(false);

  // Obtener los datos de la fase actual
  const phaseData = exercise[`phase${currentPhase}`];

  // Inicializar los sets cuando se abre el formulario de registro
  const handleStartLogging = () => {
    const initialSets = Array(phaseData.sets).fill().map(() => ({
      reps: '',
      weight: ''
    }));

    setLogData({ sets: initialSets, notes: '' });
    setIsLogging(true);
  };

  // Actualizar los datos de un set específico
  const handleSetChange = (index, field, value) => {
    const newSets = [...logData.sets];
    newSets[index] = { ...newSets[index], [field]: value };
    setLogData({ ...logData, sets: newSets });
  };

  // Guardar el registro de entrenamiento
  const handleSaveLog = () => {
    const newLog = {
      exerciseId: exercise.id,
      dayId,
      phase: currentPhase,
      sets: logData.sets,
      notes: logData.notes
    };

    addWorkoutLog(newLog);
    setIsLogging(false);
    setCompleted(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-5 mb-5 border border-gray-100 transition-all hover:shadow-lg">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800">{exercise.name}</h3>
          <div className="mt-2 space-y-1">
            <div className="flex items-center text-sm text-gray-600">
              <FaDumbbell className="mr-2 text-primary-500" />
              <span>{phaseData.sets} series x {phaseData.reps} reps</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FaWeight className="mr-2 text-primary-500" />
              <span>Peso: {phaseData.weight}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FaStopwatch className="mr-2 text-primary-500" />
              <span>Descanso: {exercise.rest}</span>
            </div>
          </div>
        </div>

        {!isLogging && !completed ? (
          <button
            onClick={handleStartLogging}
            className="bg-primary-600 text-white p-3 rounded-full shadow-button hover:bg-primary-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
            aria-label="Registrar ejercicio"
          >
            <FaPlus />
          </button>
        ) : completed ? (
          <div className="bg-green-500 text-white p-3 rounded-full shadow-md">
            <FaCheck />
          </div>
        ) : null}
      </div>

      {isLogging && (
        <div className="mt-5 border-t border-gray-100 pt-5">
          <h4 className="font-semibold text-gray-800 mb-3">Registrar series:</h4>

          <div className="space-y-3">
            {logData.sets.map((set, index) => (
              <div key={index} className="flex gap-3 items-center">
                <div className="w-10 h-10 flex items-center justify-center bg-primary-100 text-primary-800 font-bold rounded-lg">
                  {index + 1}
                </div>
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Reps"
                    value={set.reps}
                    onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  />
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="Peso (kg)"
                    value={set.weight}
                    onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 mb-4">
            <textarea
              placeholder="Notas (opcional)"
              value={logData.notes}
              onChange={(e) => setLogData({ ...logData, notes: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              rows="2"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsLogging(false)}
              className="px-5 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveLog}
              className="px-5 py-3 bg-primary-600 text-white rounded-lg font-medium shadow-button hover:bg-primary-700 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
            >
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseCard;
