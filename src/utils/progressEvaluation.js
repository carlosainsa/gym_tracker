/**
 * Funciones de validación para ejercicios
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
  // Asegurarnos de que el porcentaje es un número válido
  if (isNaN(percentage) || percentage === null) return ValidationStatus.DANGER;

  // Evaluación simplificada a 3 estados según la nueva lógica:
  // 1. Si está dentro o por encima del rango planificado (100%+): Verde
  if (percentage >= 100) return ValidationStatus.SUCCESS;

  // 2. Si está entre el 80% y 99% del rango planificado: Amarillo
  if (percentage >= 80 && percentage < 100) return ValidationStatus.WARNING;

  // 3. Si está por debajo del 80% del rango planificado: Rojo
  return ValidationStatus.DANGER;
};

/**
 * Extrae los valores mínimo y máximo de un rango
 * @param {string} rangeStr - Cadena con formato "X-Y" o "X reps/pierna"
 * @returns {Object} - Objeto con valores mínimo y máximo del rango
 */
const getRangeValues = (rangeStr) => {
  if (!rangeStr || typeof rangeStr !== 'string') return { min: null, max: null };

  // Verificar si es un ejercicio por pierna/lado/brazo
  const isPerSide = /\/pierna|\/lado|\/brazo/i.test(rangeStr);

  // Factor de multiplicación para ejercicios por pierna/lado
  const multiplier = isPerSide ? 2 : 1;

  // Limpiar y validar el formato (eliminar el sufijo /pierna, /lado, etc.)
  let cleanStr = rangeStr.trim();
  if (isPerSide) {
    cleanStr = cleanStr.replace(/\/pierna|\/lado|\/brazo/gi, '').trim();
  }
  cleanStr = cleanStr.replace(/\s+/g, '');

  // Verificar si es un rango (contiene un guion)
  if (cleanStr.includes('-')) {
    const parts = cleanStr.split('-');

    if (parts.length !== 2) return { min: null, max: null };

    const min = parseInt(parts[0]) * multiplier;
    const max = parseInt(parts[1]) * multiplier;

    return {
      min: isNaN(min) ? null : min,
      max: isNaN(max) ? null : max,
      isRange: true,
      isPerSide: isPerSide
    };
  } else {
    // Si no es un rango, es un valor único
    const value = parseFloat(cleanStr);
    return {
      min: isNaN(value) ? null : value * multiplier,
      max: null,
      isRange: false,
      isPerSide: isPerSide
    };
  }
};

/**
 * Calcula el porcentaje alcanzado respecto al rango objetivo o valor absoluto
 * @param {number|string} actual - Valor actual
 * @param {Object} range - Objeto con valores min y max del rango objetivo y flag isRange
 * @returns {number} - Porcentaje alcanzado
 */
const calculatePercentage = (actual, range) => {
  // Convertir y validar los valores
  const actualNum = parseFloat(actual);
  const { min, max, isRange } = range;

  // Si no hay valores válidos, retornar 0
  if (isNaN(actualNum) || min === null || min === 0) {
    return 0;
  }

  // LÓGICA PARA RANGOS (repeticiones)
  if (isRange) {
    // 1. Si el valor actual está dentro del rango, es 100%
    if (actualNum >= min && (max === null || actualNum <= max)) {
      return 100;
    }

    // Si el valor actual es mayor que el máximo, es un 110% (bonus)
    if (max !== null && actualNum > max) {
      return 110;
    }

    // 2. Si el valor actual está entre (mínimo del rango × 0.8) y (máximo del rango × 0.99), es entre 80% y 99%
    const minThreshold = min * 0.8;

    if (actualNum >= minThreshold && actualNum < min) {
      // Calcular el porcentaje respecto al mínimo
      const percentage = (actualNum / min) * 100;

      // Devolver el porcentaje con precisión de 2 decimales
      return Number(percentage.toFixed(2));
    }

    // 3. Si el valor actual está por debajo del 80% del mínimo, calcular el porcentaje exacto
    const percentage = (actualNum / min) * 100;
    return Number(percentage.toFixed(2));
  }
  // LÓGICA PARA VALORES ABSOLUTOS (pesos)
  else {
    // 1. Si el valor real es mayor o igual al valor planificado, es 100%
    if (actualNum >= min) {
      return 100;
    }

    // 2. Si el valor real está entre el 80% y 99% del valor planificado
    const percentage = (actualNum / min) * 100;

    // Devolver el porcentaje con precisión de 2 decimales
    return Number(percentage.toFixed(2));
  }
};

/**
 * Evalúa el progreso de un ejercicio y retorna el estado y porcentaje para repeticiones y peso
 * @param {Object} exerciseData - Datos del ejercicio realizado
 * @param {Object} plannedData - Datos planificados del ejercicio
 * @returns {Object} Objeto con evaluación de repeticiones y peso
 */
export const evaluateExerciseProgress = (exerciseData, plannedData) => {
  if (!exerciseData || !plannedData) {
    return {
      reps: { status: ValidationStatus.DANGER, percentage: 0 },
      weight: { status: ValidationStatus.DANGER, percentage: 0 }
    };
  }

  // Obtener los valores de los rangos
  const repsRange = getRangeValues(plannedData.reps);
  const weightRange = getRangeValues(plannedData.weight);

  // Calcular porcentajes
  const repsPercentage = calculatePercentage(exerciseData.reps, repsRange);
  const weightPercentage = calculatePercentage(exerciseData.weight, weightRange);

  return {
    reps: {
      status: getStatusByPercentage(repsPercentage),
      percentage: repsPercentage,
      range: repsRange
    },
    weight: {
      status: getStatusByPercentage(weightPercentage),
      percentage: weightPercentage,
      range: weightRange
    }
  };
};

/**
 * Obtiene el color CSS correspondiente al estado de validación
 * @param {string} status - Estado de validación
 * @returns {string} Color CSS correspondiente
 */
export const getStatusColor = (status) => {
  const colors = {
    [ValidationStatus.SUCCESS]: '#4caf50', // Verde
    [ValidationStatus.WARNING]: '#ff9800', // Amarillo
    [ValidationStatus.DANGER]: '#f44336'   // Rojo
  };
  return colors[status] || colors[ValidationStatus.DANGER];
};

/**
 * Obtiene el color exacto según el porcentaje (simplificado a 3 colores)
 * @param {number} percentage - Porcentaje alcanzado
 * @returns {string} - Código de color hexadecimal
 */
export const getExactColorByPercentage = (percentage) => {
  // Asegurarnos de que el porcentaje es un número válido
  if (isNaN(percentage) || percentage === null) {
    return '#f44336'; // rojo por defecto
  }

  // Solo tres colores según la nueva lógica:
  // 1. Si está dentro o por encima del rango planificado (100%+): Verde
  if (percentage >= 100) {
    return '#4caf50'; // Verde (100% o más): Has alcanzado o superado el objetivo
  }

  // 2. Si está entre el 80% y 99% del rango planificado: Amarillo
  if (percentage >= 80) {
    return '#ffc107'; // Amarillo (80-99%): Estás acercándote al objetivo
  }

  // 3. Si está por debajo del 80% del rango planificado: Rojo
  return '#f44336'; // Rojo (menos de 80%): Estás muy lejos del objetivo
};

/**
 * Obtiene el mensaje descriptivo del progreso
 * @param {Object} validation - Objeto con status, percentage y range
 * @returns {string} Mensaje descriptivo
 */
export const getProgressMessage = (validation) => {
  const { status, percentage, range } = validation;

  // Formatear el porcentaje con 1 decimal
  const formattedPercentage = percentage.toFixed(1);

  // Determinar si es un rango o un valor absoluto
  const isRange = range && range.isRange;
  const isPerSide = range && range.isPerSide;

  // Obtener el valor objetivo como texto
  let targetText;
  if (!range) {
    targetText = 'N/A';
  } else if (isRange) {
    // Si es por pierna/lado, dividir entre 2 para mostrar el valor original
    const displayMin = isPerSide ? range.min / 2 : range.min;
    const displayMax = isPerSide ? range.max / 2 : range.max;
    targetText = `${displayMin}-${displayMax}`;
    if (isPerSide) {
      targetText += ' por lado';
    }
  } else {
    // Si es por pierna/lado, dividir entre 2 para mostrar el valor original
    const displayValue = isPerSide ? range.min / 2 : range.min;
    targetText = `${displayValue}`;
    if (isPerSide) {
      targetText += ' por lado';
    }
  }

  // Mensajes para rangos (repeticiones)
  if (isRange) {
    switch (status) {
      case ValidationStatus.SUCCESS:
        if (percentage > 100) {
          return `¡Sobresaliente! Has superado el rango planificado de ${targetText} (${formattedPercentage}%)`;
        }
        return `¡Excelente! Estás dentro del rango planificado de ${targetText} (${formattedPercentage}%)`;

      case ValidationStatus.WARNING:
        return `Estás entre el 80% y 99% del rango planificado de ${targetText} (${formattedPercentage}%)`;

      case ValidationStatus.DANGER:
        return `Estás por debajo del 80% del rango planificado de ${targetText} (${formattedPercentage}%)`;

      default:
        return 'No hay datos suficientes para evaluar';
    }
  }
  // Mensajes para valores absolutos (pesos)
  else {
    switch (status) {
      case ValidationStatus.SUCCESS:
        return `¡Excelente! Has alcanzado o superado el peso planificado de ${targetText}kg (${formattedPercentage}%)`;

      case ValidationStatus.WARNING:
        return `Estás entre el 80% y 99% del peso planificado de ${targetText}kg (${formattedPercentage}%)`;

      case ValidationStatus.DANGER:
        return `Estás por debajo del 80% del peso planificado de ${targetText}kg (${formattedPercentage}%)`;

      default:
        return 'No hay datos suficientes para evaluar';
    }
  }
};