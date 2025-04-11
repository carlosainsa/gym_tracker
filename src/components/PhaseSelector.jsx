import { useWorkout } from '../context/WorkoutContext';

const PhaseSelector = () => {
  const { plan, currentPhase, changePhase } = useWorkout();

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">Fase actual</h3>
      
      <div className="flex gap-2">
        {plan.phases.map((phase, index) => (
          <button
            key={index}
            onClick={() => changePhase(index + 1)}
            className={`flex-1 py-2 px-3 rounded-lg ${
              currentPhase === index + 1
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <div className="font-medium">{phase.name}</div>
            <div className="text-xs">{phase.weeks} semanas</div>
          </button>
        ))}
      </div>
      
      <div className="mt-3 text-sm text-gray-600">
        <p>Fase actual: {plan.phases[currentPhase - 1].description}</p>
      </div>
    </div>
  );
};

export default PhaseSelector;
