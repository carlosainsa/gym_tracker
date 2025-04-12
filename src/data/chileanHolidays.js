// Días feriados de Chile para el año 2024
export const chileanHolidays2024 = [
  new Date(2024, 0, 1),   // Año Nuevo
  new Date(2024, 3, 19),  // Viernes Santo
  new Date(2024, 3, 20),  // Sábado Santo
  new Date(2024, 4, 1),   // Día del Trabajo
  new Date(2024, 4, 21),  // Día de las Glorias Navales
  new Date(2024, 5, 29),  // San Pedro y San Pablo
  new Date(2024, 6, 16),  // Día de la Virgen del Carmen
  new Date(2024, 7, 15),  // Asunción de la Virgen
  new Date(2024, 8, 18),  // Fiestas Patrias
  new Date(2024, 8, 19),  // Día de las Glorias del Ejército
  new Date(2024, 9, 12),  // Encuentro de Dos Mundos
  new Date(2024, 9, 31),  // Día de las Iglesias Evangélicas y Protestantes
  new Date(2024, 10, 1),  // Día de Todos los Santos
  new Date(2024, 11, 8),  // Inmaculada Concepción
  new Date(2024, 11, 25), // Navidad
];

// Función para verificar si una fecha es feriado en Chile
export const isChileanHoliday = (date) => {
  // Convertir la fecha a medianoche para comparar solo día, mes y año
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  // Verificar si la fecha está en la lista de feriados
  return chileanHolidays2024.some(holiday => {
    const holidayDate = new Date(holiday);
    holidayDate.setHours(0, 0, 0, 0);
    return holidayDate.getTime() === checkDate.getTime();
  });
};
