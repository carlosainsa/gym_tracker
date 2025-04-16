// Configuración de días de entrenamiento
export const TRAINING_DAYS = {
  MONDAY: 1,
  WEDNESDAY: 3,
  FRIDAY: 5,
};

// Días de descanso (0=Domingo, 1=Lunes, ...)
export const REST_DAYS = {
  TUESDAY: 2,
  THURSDAY: 4,
  SATURDAY: 6,
  SUNDAY: 0,
};

// Mapeo de días a nombres en español
export const DAY_NAMES = {
  0: 'Domingo',
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado'
};

// Días festivos en Chile para 2025 (formato MM-DD)
export const CHILEAN_HOLIDAYS = [
  '01-01', // Año Nuevo
  '04-18', // Viernes Santo
  '04-19', // Sábado Santo
  '05-01', // Día del Trabajo
  '05-21', // Día de las Glorias Navales
  '06-29', // San Pedro y San Pablo
  '07-16', // Día de la Virgen del Carmen
  '08-15', // Asunción de la Virgen
  '09-18', // Independencia Nacional
  '09-19', // Día de las Glorias del Ejército
  '10-12', // Día del Encuentro de Dos Mundos
  '10-31', // Día de las Iglesias Evangélicas
  '11-01', // Día de Todos los Santos
  '12-08', // Inmaculada Concepción
  '12-25', // Navidad
];

// Función para verificar si una fecha es un día festivo en Chile
export const isChileanHoliday = (date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateString = `${month}-${day}`;
  return CHILEAN_HOLIDAYS.includes(dateString);
};

// Configuración de entrenamientos
export const TRAINING_CONFIG = {
  // Días de entrenamiento y su mapeo a índices
  trainingDays: [
    { dayNumber: 1, name: 'Lunes', trainingIndex: 0 },
    { dayNumber: 3, name: 'Miércoles', trainingIndex: 1 },
    { dayNumber: 5, name: 'Viernes', trainingIndex: 2 }
  ],

  // Días de descanso
  restDays: [0, 2, 4, 6],

  // Tipos de entrenamiento
  trainingTypes: [
    {
      id: 'push',
      name: 'Énfasis en Empuje',
      description: 'Enfoque en ejercicios de empuje para pecho, hombros y tríceps'
    },
    {
      id: 'pull',
      name: 'Énfasis en Tracción',
      description: 'Enfoque en ejercicios de tracción para espalda y bíceps'
    },
    {
      id: 'legs',
      name: 'Énfasis en Piernas y Funcional',
      description: 'Enfoque en ejercicios para piernas y movimientos funcionales'
    }
  ],

  // Duración de sesión recomendada
  recommendedSessionDuration: 60, // minutos

  // Configuración de split recomendada
  recommendedSplitConfiguration: 'fullbody',

  // Configuración de periodización recomendada
  recommendedPeriodizationType: 'linear',

  // Duración de plan recomendada
  recommendedPlanDuration: 12, // semanas

  // Objetivo principal recomendado
  recommendedPrimaryGoal: 'hypertrophy',

  // Equipamiento recomendado
  recommendedEquipment: ['all'],

  // Configuración de autoregulación
  autoRegulation: {
    // Escala RPE (Rating of Perceived Exertion)
    rpeScale: [
      { value: 10, description: 'Máximo esfuerzo, no podría hacer más repeticiones' },
      { value: 9, description: 'Podría hacer 1 repetición más' },
      { value: 8, description: 'Podría hacer 2 repeticiones más' },
      { value: 7, description: 'Podría hacer 3 repeticiones más' },
      { value: 6, description: 'Podría hacer 4-5 repeticiones más' },
      { value: 5, description: 'Podría hacer 6+ repeticiones más' }
    ],

    // Ajustes de carga basados en RPE
    loadAdjustments: {
      tooHeavy: { rpe: 10, adjustment: -5 }, // Reducir 5% si RPE es 10
      heavy: { rpe: 9, adjustment: -2.5 }, // Reducir 2.5% si RPE es 9
      optimal: { rpe: 8, adjustment: 0 }, // Mantener si RPE es 8
      light: { rpe: 7, adjustment: 2.5 }, // Aumentar 2.5% si RPE es 7
      tooLight: { rpe: 6, adjustment: 5 } // Aumentar 5% si RPE es 6 o menos
    }
  }
};

// Función para generar el nombre del entrenamiento
export const generateTrainingName = (index, type, phase = null) => {
  const baseName = `Sesión de Entrenamiento ${index + 1}: Cuerpo Completo - ${type.name}`;
  return phase ? `${baseName} (Fase ${phase})` : baseName;
};

// Función para verificar si es día de entrenamiento
export const isTrainingDay = (dayNumber) => {
  // Verificar si es un día festivo en Chile
  const today = new Date();
  if (isChileanHoliday(today)) {
    return false;
  }

  // Verificar si es un día de descanso (martes, jueves, sábado, domingo)
  if (dayNumber === REST_DAYS.TUESDAY ||
      dayNumber === REST_DAYS.THURSDAY ||
      dayNumber === REST_DAYS.SATURDAY ||
      dayNumber === REST_DAYS.SUNDAY) {
    return false;
  }

  // Verificar si es un día de entrenamiento configurado
  return TRAINING_CONFIG.trainingDays.some(day => day.dayNumber === dayNumber);
};

// Función para obtener el índice de entrenamiento según el día
export const getTrainingIndexForDay = (dayNumber) => {
  // Si es un día festivo, devolver -1 (descanso)
  const today = new Date();
  if (isChileanHoliday(today)) {
    return -1;
  }

  // Si es un día de descanso (martes, jueves, sábado, domingo), devolver -1 (descanso)
  if (dayNumber === REST_DAYS.TUESDAY ||
      dayNumber === REST_DAYS.THURSDAY ||
      dayNumber === REST_DAYS.SATURDAY ||
      dayNumber === REST_DAYS.SUNDAY) {
    return -1;
  }

  // Buscar el día en la configuración
  const day = TRAINING_CONFIG.trainingDays.find(d => d.dayNumber === dayNumber);

  // Si se encuentra el día, devolver su índice de entrenamiento
  // Si no, devolver -1 (descanso)
  return day ? day.trainingIndex : -1;
};

// Función para obtener el siguiente día de entrenamiento
export const getNextTrainingDay = (currentDay) => {
  const sortedDays = TRAINING_CONFIG.trainingDays
    .map(d => d.dayNumber)
    .sort((a, b) => a - b);

  const nextDay = sortedDays.find(day => day > currentDay);
  return nextDay || sortedDays[0]; // Si no hay siguiente, volver al primero
};