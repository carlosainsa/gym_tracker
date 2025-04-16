/**
 * Funciones de validación para ejercicios
 */

/**
 * Constantes para los estados de validación
 */
export const ValidationStatus = {
  SUCCESS: 'success', // verde
  WARNING: 'warning', // amarillo
  DANGER: 'danger'    // rojo
};

/**
 * Evalúa el estado basado en el porcentaje alcanzado
 * @param {number} percentage - Porcentaje alcanzado
 * @returns {string} - Estado de validación
 */
const getStatusByPercentage = (percentage) => {
  if (percentage >= 100) return ValidationStatus.SUCCESS;
  if (percentage >= 85) return ValidationStatus.WARNING;
  return ValidationStatus.DANGER;
};

/**
 * Valida las repeticiones y calcula el porcentaje alcanzado
 * @param {number} reps - Número de repeticiones realizadas
 * @param {Object} range - Objeto con min y max del rango esperado
 * @returns {Object} - Resultado de la validación con estado y porcentaje
 */
export const validateReps = (reps, range) => {
  if (!reps || isNaN(reps)) {
    return {
      status: ValidationStatus.DANGER,
      percentage: 0
    };
  }

  const repsNum = parseInt(reps);
  const targetReps = range.min; // Tomamos el mínimo como objetivo
  const percentage = (repsNum / targetReps) * 100;

  return {
    status: getStatusByPercentage(percentage),
    percentage: Math.round(percentage)
  };
};

/**
 * Valida el peso y calcula el porcentaje alcanzado
 * @param {number} weight - Peso realizado
 * @param {Object} range - Objeto con min y max del rango esperado
 * @returns {Object} - Resultado de la validación con estado y porcentaje
 */
export const validateWeight = (weight, range) => {
  if (!weight || isNaN(weight)) {
    return {
      status: ValidationStatus.DANGER,
      percentage: 0
    };
  }

  const weightNum = parseFloat(weight);
  const targetWeight = range.min; // Tomamos el mínimo como objetivo
  const percentage = (weightNum / targetWeight) * 100;

  return {
    status: getStatusByPercentage(percentage),
    percentage: Math.round(percentage)
  };
};

/**
 * Extrae el rango de una cadena de texto con formato "X-Y"
 * @param {string} rangeStr - Cadena con formato "X-Y"
 * @returns {Object} - Objeto con min y max
 */
export const parseRange = (rangeStr) => {
  if (!rangeStr || typeof rangeStr !== 'string') return null;
  
  const parts = rangeStr.split('-');
  if (parts.length !== 2) return null;

  const min = parseInt(parts[0]);
  const max = parseInt(parts[1]);

  if (isNaN(min) || isNaN(max)) return null;

  return { min, max };
};

/**
 * Valida un conjunto de ejercicios
 * @param {Object} set - Objeto con reps y weight
 * @param {Object} expectedRanges - Objeto con rangos esperados para reps y weight
 * @returns {Object} - Objeto con resultados de validación
 */
export const validateSet = (set, expectedRanges) => {
  const repsRange = parseRange(expectedRanges.reps);
  const weightRange = parseRange(expectedRanges.weight);

  const repsValidation = repsRange ? validateReps(set.reps, repsRange) : { status: ValidationStatus.SUCCESS, percentage: 100 };
  const weightValidation = weightRange ? validateWeight(set.weight, weightRange) : { status: ValidationStatus.SUCCESS, percentage: 100 };

  return {
    reps: repsValidation,
    weight: weightValidation
  };
}; 