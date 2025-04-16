import {
  evaluateExerciseProgress,
  getStatusColor,
  getProgressMessage,
  ValidationStatus
} from '../progressEvaluation';

describe('Progress Evaluation Functions', () => {
  describe('evaluateExerciseProgress', () => {
    it('should return danger status when no data is provided', () => {
      const result = evaluateExerciseProgress(null, null);
      expect(result.reps.status).toBe(ValidationStatus.DANGER);
      expect(result.weight.status).toBe(ValidationStatus.DANGER);
      expect(result.reps.percentage).toBe(0);
      expect(result.weight.percentage).toBe(0);
    });

    it('should evaluate correctly when actual values are within range', () => {
      const exerciseData = { reps: '12', weight: '35' };
      const plannedData = { reps: '10-15', weight: '30-40' };

      const result = evaluateExerciseProgress(exerciseData, plannedData);

      expect(result.reps.status).toBe(ValidationStatus.SUCCESS);
      expect(result.weight.status).toBe(ValidationStatus.SUCCESS);
      expect(result.reps.percentage).toBe(100);
      expect(result.weight.percentage).toBe(100);
    });

    it('should evaluate correctly when actual values exceed range', () => {
      const exerciseData = { reps: '16', weight: '45' };
      const plannedData = { reps: '10-15', weight: '30-40' };

      const result = evaluateExerciseProgress(exerciseData, plannedData);

      expect(result.reps.status).toBe(ValidationStatus.SUCCESS);
      expect(result.weight.status).toBe(ValidationStatus.SUCCESS);
      expect(result.reps.percentage).toBe(110);
      expect(result.weight.percentage).toBe(110);
    });

    it('should evaluate correctly when actual values are below 80% of the minimum range', () => {
      const exerciseData = { reps: '7', weight: '23' };
      const plannedData = { reps: '10-15', weight: '30-40' };

      const result = evaluateExerciseProgress(exerciseData, plannedData);

      expect(result.reps.status).toBe(ValidationStatus.DANGER);
      expect(result.weight.status).toBe(ValidationStatus.DANGER);
      expect(result.reps.percentage).toBe(70);
      expect(result.weight.percentage).toBe(76.67);
    });

    it('should evaluate correctly when actual values are between 80% and 99% of the minimum range', () => {
      const exerciseData = { reps: '9', weight: '28' };
      const plannedData = { reps: '10-15', weight: '30-40' };

      const result = evaluateExerciseProgress(exerciseData, plannedData);

      expect(result.reps.status).toBe(ValidationStatus.WARNING);
      expect(result.weight.status).toBe(ValidationStatus.WARNING);
      expect(result.reps.percentage).toBe(90);
      expect(result.weight.percentage).toBe(93.33);
    });

    it('should evaluate correctly when actual values are exactly at the minimum range', () => {
      const exerciseData = { reps: '10', weight: '30' };
      const plannedData = { reps: '10-15', weight: '30-40' };

      const result = evaluateExerciseProgress(exerciseData, plannedData);

      expect(result.reps.status).toBe(ValidationStatus.SUCCESS);
      expect(result.weight.status).toBe(ValidationStatus.SUCCESS);
      expect(result.reps.percentage).toBe(100);
      expect(result.weight.percentage).toBe(100);
    });

    // Nuevas pruebas para valores absolutos (pesos)
    it('should evaluate correctly when weight is an absolute value and actual meets or exceeds it', () => {
      const exerciseData = { reps: '12', weight: '65' };
      const plannedData = { reps: '10-15', weight: '65' };

      const result = evaluateExerciseProgress(exerciseData, plannedData);

      expect(result.reps.status).toBe(ValidationStatus.SUCCESS);
      expect(result.weight.status).toBe(ValidationStatus.SUCCESS);
      expect(result.reps.percentage).toBe(100);
      expect(result.weight.percentage).toBe(100);
    });

    it('should evaluate correctly when weight is an absolute value and actual is between 80-99%', () => {
      const exerciseData = { reps: '12', weight: '55' };
      const plannedData = { reps: '10-15', weight: '65' };

      const result = evaluateExerciseProgress(exerciseData, plannedData);

      expect(result.reps.status).toBe(ValidationStatus.SUCCESS);
      expect(result.weight.status).toBe(ValidationStatus.WARNING);
      expect(result.reps.percentage).toBe(100);
      expect(result.weight.percentage).toBe(84.62);
    });

    it('should evaluate correctly when weight is an absolute value and actual is below 80%', () => {
      const exerciseData = { reps: '12', weight: '50' };
      const plannedData = { reps: '10-15', weight: '65' };

      const result = evaluateExerciseProgress(exerciseData, plannedData);

      expect(result.reps.status).toBe(ValidationStatus.SUCCESS);
      expect(result.weight.status).toBe(ValidationStatus.DANGER);
      expect(result.reps.percentage).toBe(100);
      expect(result.weight.percentage).toBe(76.92);
    });
  });

  describe('getStatusColor', () => {
    it('should return green for success status', () => {
      const color = getStatusColor(ValidationStatus.SUCCESS);
      expect(color).toBe('#4caf50');
    });

    it('should return yellow for warning status', () => {
      const color = getStatusColor(ValidationStatus.WARNING);
      expect(color).toBe('#ff9800');
    });

    it('should return red for danger status', () => {
      const color = getStatusColor(ValidationStatus.DANGER);
      expect(color).toBe('#f44336');
    });

    it('should return red for unknown status', () => {
      const color = getStatusColor('unknown');
      expect(color).toBe('#f44336');
    });
  });

  describe('getProgressMessage', () => {
    // Pruebas para rangos (repeticiones)
    it('should return appropriate message for success status with range', () => {
      const validation = {
        status: ValidationStatus.SUCCESS,
        percentage: 100,
        range: { min: 10, max: 15, isRange: true }
      };

      const message = getProgressMessage(validation);
      expect(message).toContain('Excelente');
      expect(message).toContain('dentro del rango planificado');
      expect(message).toContain('10-15');
      expect(message).toContain('100.0%');
    });

    it('should return appropriate message for exceeding success with range', () => {
      const validation = {
        status: ValidationStatus.SUCCESS,
        percentage: 110,
        range: { min: 10, max: 15, isRange: true }
      };

      const message = getProgressMessage(validation);
      expect(message).toContain('Sobresaliente');
      expect(message).toContain('superado el rango planificado');
      expect(message).toContain('10-15');
      expect(message).toContain('110.0%');
    });

    it('should return appropriate message for warning status with range', () => {
      const validation = {
        status: ValidationStatus.WARNING,
        percentage: 90,
        range: { min: 10, max: 15, isRange: true }
      };

      const message = getProgressMessage(validation);
      expect(message).toContain('entre el 80% y 99% del rango planificado');
      expect(message).toContain('10-15');
      expect(message).toContain('90.0%');
    });

    it('should return appropriate message for danger status with range', () => {
      const validation = {
        status: ValidationStatus.DANGER,
        percentage: 70,
        range: { min: 10, max: 15, isRange: true }
      };

      const message = getProgressMessage(validation);
      expect(message).toContain('por debajo del 80% del rango planificado');
      expect(message).toContain('10-15');
      expect(message).toContain('70.0%');
    });

    // Pruebas para valores absolutos (pesos)
    it('should return appropriate message for success status with absolute value', () => {
      const validation = {
        status: ValidationStatus.SUCCESS,
        percentage: 100,
        range: { min: 65, max: null, isRange: false }
      };

      const message = getProgressMessage(validation);
      expect(message).toContain('Excelente');
      expect(message).toContain('alcanzado o superado el peso planificado');
      expect(message).toContain('65kg');
      expect(message).toContain('100.0%');
    });

    it('should return appropriate message for warning status with absolute value', () => {
      const validation = {
        status: ValidationStatus.WARNING,
        percentage: 85,
        range: { min: 65, max: null, isRange: false }
      };

      const message = getProgressMessage(validation);
      expect(message).toContain('entre el 80% y 99% del peso planificado');
      expect(message).toContain('65kg');
      expect(message).toContain('85.0%');
    });

    it('should return appropriate message for danger status with absolute value', () => {
      const validation = {
        status: ValidationStatus.DANGER,
        percentage: 75,
        range: { min: 65, max: null, isRange: false }
      };

      const message = getProgressMessage(validation);
      expect(message).toContain('por debajo del 80% del peso planificado');
      expect(message).toContain('65kg');
      expect(message).toContain('75.0%');
    });

    it('should handle missing range data', () => {
      const validation = {
        status: ValidationStatus.DANGER,
        percentage: 70
      };

      const message = getProgressMessage(validation);
      expect(message).toContain('por debajo del 80%');
      expect(message).toContain('N/A');
      expect(message).toContain('70.0%');
    });
  });
});
