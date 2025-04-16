import React, { useState } from 'react';
import { evaluateExerciseProgress, getStatusColor, getProgressMessage } from '../utils/progressEvaluation';

const ProgressEvaluator = () => {
  const [exerciseData, setExerciseData] = useState({
    reps: '',
    weight: ''
  });

  const [plannedData, setPlannedData] = useState({
    reps: '',
    weight: ''
  });

  const [evaluation, setEvaluation] = useState(null);

  const handleExerciseChange = (e) => {
    const { name, value } = e.target;
    setExerciseData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlannedChange = (e) => {
    const { name, value } = e.target;
    setPlannedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const evaluateProgress = () => {
    const result = evaluateExerciseProgress(
      {
        reps: Number(exerciseData.reps),
        weight: Number(exerciseData.weight)
      },
      plannedData
    );
    setEvaluation(result);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Evaluador de Progreso de Ejercicios
      </h2>

      <div style={{ display: 'grid', gap: '20px', marginBottom: '20px' }}>
        <div>
          <h3>Ejercicio Realizado</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            <input
              type="number"
              name="reps"
              placeholder="Repeticiones realizadas"
              value={exerciseData.reps}
              onChange={handleExerciseChange}
              style={{ padding: '8px' }}
            />
            <input
              type="number"
              name="weight"
              placeholder="Peso utilizado (kg)"
              value={exerciseData.weight}
              onChange={handleExerciseChange}
              style={{ padding: '8px' }}
            />
          </div>
        </div>

        <div>
          <h3>Ejercicio Planificado</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            <input
              type="text"
              name="reps"
              placeholder="Rango de repeticiones (ej: 12-14)"
              value={plannedData.reps}
              onChange={handlePlannedChange}
              style={{ padding: '8px' }}
            />
            <input
              type="text"
              name="weight"
              placeholder="Rango de peso (ej: 30-40)"
              value={plannedData.weight}
              onChange={handlePlannedChange}
              style={{ padding: '8px' }}
            />
          </div>
        </div>

        <button
          onClick={evaluateProgress}
          style={{
            padding: '10px',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Evaluar Progreso
        </button>
      </div>

      {evaluation && (
        <div style={{ 
          display: 'grid', 
          gap: '15px',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}>
          <div>
            <h3>Evaluación de Repeticiones</h3>
            <div style={{
              padding: '10px',
              backgroundColor: getStatusColor(evaluation.reps.status),
              color: 'white',
              borderRadius: '4px'
            }}>
              {getProgressMessage(evaluation.reps)}
            </div>
          </div>

          <div>
            <h3>Evaluación de Peso</h3>
            <div style={{
              padding: '10px',
              backgroundColor: getStatusColor(evaluation.weight.status),
              color: 'white',
              borderRadius: '4px'
            }}>
              {getProgressMessage(evaluation.weight)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressEvaluator; 