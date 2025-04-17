import { TrainingPlan, Microcycle, TrainingSession, Exercise, Set } from '../models/TrainingPlan';
import { v4 as uuidv4 } from 'uuid';

/**
 * Servicio para importar y exportar planes de entrenamiento
 */
class ImportExportService {
  /**
   * Exporta un plan de entrenamiento a formato JSON
   * @param {TrainingPlan} plan - Plan de entrenamiento a exportar
   * @returns {string} - Cadena JSON del plan
   */
  exportPlanToJson(plan) {
    try {
      // Crear una copia del plan para evitar referencias circulares
      const planCopy = JSON.parse(JSON.stringify(plan));

      // Agregar metadatos de exportación
      planCopy.exportMetadata = {
        version: '2.0',
        exportDate: new Date().toISOString(),
        appName: 'GymTracker'
      };

      // Convertir a JSON con formato legible
      return JSON.stringify(planCopy, null, 2);
    } catch (error) {
      console.error('Error al exportar el plan:', error);
      throw new Error('No se pudo exportar el plan. Detalles: ' + error.message);
    }
  }

  /**
   * Exporta todos los planes de entrenamiento a formato JSON
   * @param {Array<TrainingPlan>} plans - Planes de entrenamiento a exportar
   * @returns {string} - Cadena JSON de los planes
   */
  exportAllPlansToJson(plans) {
    try {
      // Crear una copia de los planes para evitar referencias circulares
      const plansCopy = JSON.parse(JSON.stringify(plans));

      // Agregar metadatos de exportación
      const exportData = {
        plans: plansCopy,
        exportMetadata: {
          version: '2.0',
          exportDate: new Date().toISOString(),
          appName: 'GymTracker',
          type: 'multiple_plans'
        }
      };

      // Convertir a JSON con formato legible
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error al exportar los planes:', error);
      throw new Error('No se pudo exportar los planes. Detalles: ' + error.message);
    }
  }

  /**
   * Importa un plan de entrenamiento desde formato JSON
   * @param {string} jsonString - Cadena JSON del plan
   * @returns {TrainingPlan|Array<TrainingPlan>} - Plan de entrenamiento importado o array de planes
   */
  importPlanFromJson(jsonString) {
    try {
      // Parsear el JSON
      const data = JSON.parse(jsonString);

      // Verificar si es una exportación de múltiples planes
      if (data.exportMetadata && data.exportMetadata.type === 'multiple_plans' && Array.isArray(data.plans)) {
        return this.importMultiplePlans(data.plans);
      }

      // Procesar como un solo plan
      const planData = data;

      // Verificar que sea un plan válido
      if (!planData.name || !planData.id) {
        throw new Error('El archivo no contiene un plan de entrenamiento válido');
      }

      return this.reconstructPlan(planData);
    } catch (error) {
      console.error('Error al importar el plan:', error);
      throw new Error('No se pudo importar el plan. Detalles: ' + error.message);
    }
  }

  /**
   * Importa múltiples planes de entrenamiento
   * @param {Array<Object>} plansData - Datos de los planes
   * @returns {Array<TrainingPlan>} - Planes de entrenamiento importados
   */
  importMultiplePlans(plansData) {
    if (!Array.isArray(plansData)) {
      throw new Error('Los datos no contienen un array de planes válido');
    }

    return plansData.map(planData => this.reconstructPlan(planData));
  }

  /**
   * Reconstruye un plan de entrenamiento a partir de datos JSON
   * @param {Object} planData - Datos del plan
   * @returns {TrainingPlan} - Plan de entrenamiento reconstruido
   */
  reconstructPlan(planData) {
    // Reconstruir el plan con las clases adecuadas
    const microcycles = planData.microcycles.map(mc => {
      // Reconstruir las sesiones de entrenamiento
      const trainingSessions = mc.trainingSessions.map(session => {
        // Reconstruir los ejercicios
        const exercises = session.exercises.map(ex => {
          // Reconstruir las series
          const sets = ex.sets.map(set => new Set(set));

          return new Exercise({
            ...ex,
            sets
          });
        });

        return new TrainingSession({
          ...session,
          exercises
        });
      });

      return new Microcycle({
        ...mc,
        trainingSessions
      });
    });

    // Crear el plan completo
    const importedPlan = new TrainingPlan({
      ...planData,
      microcycles,
      // Generar un nuevo ID para evitar conflictos
      id: `imported_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      // Actualizar fechas
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return importedPlan;
  }

  /**
   * Descarga un archivo JSON con el plan exportado
   * @param {TrainingPlan} plan - Plan de entrenamiento a exportar
   */
  downloadPlanAsJson(plan) {
    try {
      const jsonString = this.exportPlanToJson(plan);
      const fileName = `${plan.name.replace(/\\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;

      return this.downloadJsonFile(jsonString, fileName);
    } catch (error) {
      console.error('Error al descargar el plan:', error);
      throw new Error('No se pudo descargar el plan. Detalles: ' + error.message);
    }
  }

  /**
   * Descarga un archivo JSON con todos los planes exportados
   * @param {Array<TrainingPlan>} plans - Planes de entrenamiento a exportar
   */
  downloadAllPlansAsJson(plans) {
    try {
      const jsonString = this.exportAllPlansToJson(plans);
      const fileName = `todos_los_planes_${new Date().toISOString().split('T')[0]}.json`;

      return this.downloadJsonFile(jsonString, fileName);
    } catch (error) {
      console.error('Error al descargar los planes:', error);
      throw new Error('No se pudo descargar los planes. Detalles: ' + error.message);
    }
  }

  /**
   * Descarga un archivo JSON genérico
   * @param {string} jsonString - Contenido JSON a descargar
   * @param {string} fileName - Nombre del archivo
   * @returns {boolean} - true si la descarga se inició correctamente
   */
  downloadJsonFile(jsonString, fileName) {
    // Crear un blob con el contenido JSON
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Crear un enlace para descargar el archivo
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;

    // Simular clic en el enlace para iniciar la descarga
    document.body.appendChild(a);
    a.click();

    // Limpiar
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);

    return true;
  }

  /**
   * Descarga un archivo genérico
   * @param {string} content - Contenido a descargar
   * @param {string} fileName - Nombre del archivo
   * @param {string} mimeType - Tipo MIME del archivo
   * @returns {boolean} - true si la descarga se inició correctamente
   */
  downloadFile(content, fileName, mimeType) {
    // Crear un blob con el contenido
    const blob = new Blob([content], { type: mimeType });

    // Crear un enlace para descargar el archivo
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;

    // Simular clic en el enlace para iniciar la descarga
    document.body.appendChild(a);
    a.click();

    // Limpiar
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);

    return true;
  }

  /**
   * Descarga un plan como archivo JSON
   * @param {TrainingPlan} plan - Plan a descargar
   * @returns {boolean} - true si la descarga se inició correctamente
   */
  downloadPlanAsJson(plan) {
    try {
      // Exportar el plan a JSON
      const exportData = this.exportPlan(plan.id);
      const jsonString = JSON.stringify(exportData, null, 2);

      // Descargar el archivo
      return this.downloadFile(
        jsonString,
        `${plan.name.replace(/\s+/g, '_')}.json`,
        'application/json'
      );
    } catch (error) {
      console.error('Error al descargar plan como JSON:', error);
      throw new Error(`No se pudo descargar el plan: ${error.message}`);
    }
  }

  /**
   * Convierte un plan a formato CSV
   * @param {TrainingPlan} plan - Plan a convertir
   * @returns {string} - Contenido CSV
   */
  convertPlanToCsv(plan) {
    try {
      // Encabezados CSV
      const headers = [
        'Microciclo',
        'Día',
        'Sesión',
        'Ejercicio',
        'Series',
        'Repeticiones',
        'Peso (kg)',
        'Descanso (seg)',
        'Notas'
      ];

      // Filas de datos
      const rows = [];

      // Agregar encabezados
      rows.push(headers.join(','));

      // Recorrer microciclos
      plan.microcycles.forEach(microcycle => {
        // Recorrer sesiones
        microcycle.trainingSessions.forEach(session => {
          // Recorrer ejercicios
          session.exercises.forEach(exercise => {
            // Recorrer series
            exercise.sets.forEach((set, setIndex) => {
              const row = [
                `"Semana ${microcycle.weekNumber}"`,
                `"${session.day}"`,
                `"${session.name || 'Sesión ' + session.day}"`,
                `"${exercise.name}"`,
                setIndex + 1,
                set.repsMin && set.repsMax ? `${set.repsMin}-${set.repsMax}` : set.reps || '',
                set.weight || '',
                set.rest || '',
                `"${exercise.notes || ''}"`,
              ];

              rows.push(row.join(','));
            });
          });
        });
      });

      return rows.join('\n');
    } catch (error) {
      console.error('Error al convertir plan a CSV:', error);
      throw new Error(`No se pudo convertir el plan a CSV: ${error.message}`);
    }
  }

  /**
   * Descarga un plan como archivo CSV
   * @param {TrainingPlan} plan - Plan a descargar
   * @returns {boolean} - true si la descarga se inició correctamente
   */
  downloadPlanAsCsv(plan) {
    try {
      // Convertir el plan a CSV
      const csvContent = this.convertPlanToCsv(plan);

      // Descargar el archivo
      return this.downloadFile(
        csvContent,
        `${plan.name.replace(/\s+/g, '_')}.csv`,
        'text/csv;charset=utf-8'
      );
    } catch (error) {
      console.error('Error al descargar plan como CSV:', error);
      throw new Error(`No se pudo descargar el plan: ${error.message}`);
    }
  }

  /**
   * Exporta un plan de entrenamiento a formato CSV
   * @param {TrainingPlan} plan - Plan de entrenamiento a exportar
   * @returns {string} - Contenido CSV del plan
   */
  exportPlanToCsv(plan) {
    try {
      if (!plan) {
        throw new Error('Se requiere un plan para exportar');
      }

      // Crear cabeceras
      const headers = [
        'Microciclo',
        'Sesión',
        'Día',
        'Ejercicio',
        'Serie',
        'Repeticiones Mínimas',
        'Repeticiones Máximas',
        'Peso (kg)',
        'Descanso (s)',
        'Notas'
      ];

      // Crear filas
      const rows = [];

      // Recorrer microciclos
      plan.microcycles.forEach(microcycle => {
        // Recorrer sesiones
        microcycle.trainingSessions.forEach(session => {
          // Recorrer ejercicios
          session.exercises.forEach(exercise => {
            // Recorrer series
            exercise.sets.forEach((set, setIndex) => {
              const row = [
                microcycle.name || `Microciclo ${microcycle.weekNumber || '?'}`,
                session.name || `Sesión ${session.day || '?'}`,
                session.day || '?',
                exercise.name || 'Ejercicio sin nombre',
                setIndex + 1,
                set.repsMin || set.reps || '',
                set.repsMax || set.reps || '',
                set.weight || '',
                set.restTime || '',
                set.notes || ''
              ];

              rows.push(row);
            });
          });
        });
      });

      // Convertir a CSV
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      return csvContent;
    } catch (error) {
      console.error('Error al exportar el plan a CSV:', error);
      throw new Error('No se pudo exportar el plan a CSV. Detalles: ' + error.message);
    }
  }

  /**
   * Descarga un plan como archivo CSV
   * @param {TrainingPlan} plan - Plan de entrenamiento a exportar
   */
  downloadPlanAsCsv(plan) {
    try {
      const csvContent = this.exportPlanToCsv(plan);
      const fileName = `${plan.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;

      return this.downloadFile(csvContent, fileName, 'text/csv;charset=utf-8');
    } catch (error) {
      console.error('Error al descargar el plan como CSV:', error);
      throw new Error('No se pudo descargar el plan como CSV. Detalles: ' + error.message);
    }
  }

  /**
   * Importa un plan desde un archivo CSV
   * @param {string} csvContent - Contenido CSV del plan
   * @param {Object} options - Opciones de importación
   * @returns {TrainingPlan} - Plan de entrenamiento importado
   */
  importPlanFromCsv(csvContent, options = {}) {
    try {
      const {
        planName = `Plan importado ${new Date().toLocaleDateString()}`,
        planDescription = 'Plan importado desde CSV',
        delimiter = ','
      } = options;

      // Parsear el CSV
      const lines = csvContent.split('\n').filter(line => line.trim());

      if (lines.length < 2) {
        throw new Error('El archivo CSV no contiene datos suficientes');
      }

      // Obtener cabeceras
      const headers = this.parseCSVLine(lines[0], delimiter);

      // Verificar cabeceras mínimas requeridas
      const requiredHeaders = ['Ejercicio', 'Serie', 'Repeticiones'];
      const missingHeaders = requiredHeaders.filter(header =>
        !headers.some(h => h.toLowerCase().includes(header.toLowerCase()))
      );

      if (missingHeaders.length > 0) {
        throw new Error(`Faltan cabeceras requeridas: ${missingHeaders.join(', ')}`);
      }

      // Crear un nuevo plan
      const plan = new TrainingPlan({
        id: uuidv4(),
        name: planName,
        description: planDescription,
        status: 'available',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        microcycles: []
      });

      // Estructura para organizar los datos
      const microcyclesMap = new Map();

      // Procesar filas de datos
      for (let i = 1; i < lines.length; i++) {
        const values = this.parseCSVLine(lines[i], delimiter);

        if (values.length !== headers.length) {
          console.warn(`La línea ${i + 1} tiene un número incorrecto de columnas y será ignorada`);
          continue;
        }

        // Crear un objeto con los datos de la fila
        const rowData = {};
        headers.forEach((header, index) => {
          rowData[header] = values[index];
        });

        // Extraer información
        const microcycleName = rowData['Microciclo'] || 'Microciclo 1';
        const sessionName = rowData['Sesión'] || 'Sesión 1';
        const day = parseInt(rowData['Día']) || 1;
        const exerciseName = rowData['Ejercicio'] || 'Ejercicio sin nombre';
        const setNumber = parseInt(rowData['Serie']) || 1;

        // Determinar repeticiones
        let repsMin, repsMax;
        if (rowData['Repeticiones Mínimas'] && rowData['Repeticiones Máximas']) {
          repsMin = parseInt(rowData['Repeticiones Mínimas']) || null;
          repsMax = parseInt(rowData['Repeticiones Máximas']) || null;
        } else if (rowData['Repeticiones']) {
          const repsValue = rowData['Repeticiones'];
          if (repsValue.includes('-')) {
            const [min, max] = repsValue.split('-').map(v => parseInt(v.trim()));
            repsMin = min || null;
            repsMax = max || null;
          } else {
            repsMin = parseInt(repsValue) || null;
            repsMax = repsMin;
          }
        }

        const weight = parseFloat(rowData['Peso (kg)']) || null;
        const restTime = parseInt(rowData['Descanso (s)']) || null;
        const notes = rowData['Notas'] || '';

        // Organizar en la estructura jerárquica
        if (!microcyclesMap.has(microcycleName)) {
          microcyclesMap.set(microcycleName, new Map());
        }

        const sessionsMap = microcyclesMap.get(microcycleName);
        if (!sessionsMap.has(sessionName)) {
          sessionsMap.set(sessionName, new Map());
        }

        const exercisesMap = sessionsMap.get(sessionName);
        if (!exercisesMap.has(exerciseName)) {
          exercisesMap.set(exerciseName, []);
        }

        // Agregar la serie
        exercisesMap.get(exerciseName).push({
          id: uuidv4(),
          setNumber,
          repsMin,
          repsMax,
          weight,
          restTime,
          notes
        });
      }

      // Construir el plan a partir de la estructura
      let weekNumber = 1;
      microcyclesMap.forEach((sessionsMap, microcycleName) => {
        const microcycle = new Microcycle({
          id: uuidv4(),
          name: microcycleName,
          weekNumber: weekNumber++,
          trainingSessions: []
        });

        let dayNumber = 1;
        sessionsMap.forEach((exercisesMap, sessionName) => {
          const session = new TrainingSession({
            id: uuidv4(),
            name: sessionName,
            day: dayNumber++,
            exercises: []
          });

          exercisesMap.forEach((sets, exerciseName) => {
            // Ordenar series por número
            sets.sort((a, b) => a.setNumber - b.setNumber);

            const exercise = new Exercise({
              id: uuidv4(),
              name: exerciseName,
              sets: sets.map(setData => new Set({
                id: setData.id,
                repsMin: setData.repsMin,
                repsMax: setData.repsMax,
                weight: setData.weight,
                restTime: setData.restTime,
                notes: setData.notes
              }))
            });

            session.exercises.push(exercise);
          });

          microcycle.trainingSessions.push(session);
        });

        plan.microcycles.push(microcycle);
      });

      return plan;
    } catch (error) {
      console.error('Error al importar el plan desde CSV:', error);
      throw new Error('No se pudo importar el plan desde CSV. Detalles: ' + error.message);
    }
  }

  /**
   * Parsea una línea de CSV teniendo en cuenta las comillas
   * @param {string} line - Línea de CSV
   * @param {string} delimiter - Delimitador
   * @returns {Array<string>} - Array de valores
   */
  parseCSVLine(line, delimiter = ',') {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        // Si encontramos comillas dobles dentro de comillas, las tratamos como una sola comilla
        if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++; // Saltar la siguiente comilla
        } else {
          // Cambiar el estado de inQuotes
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        // Si encontramos el delimitador y no estamos dentro de comillas, terminamos el campo actual
        result.push(current);
        current = '';
      } else {
        // Cualquier otro carácter lo agregamos al campo actual
        current += char;
      }
    }

    // Agregar el último campo
    result.push(current);

    return result;
  }

  /**
   * Valida un archivo antes de importarlo
   * @param {File} file - Archivo a validar
   * @returns {Promise<Object>} - Promesa que resuelve a un objeto con información de validación
   */
  async validateImportFile(file) {
    return new Promise((resolve, reject) => {
      // Verificar el tamaño del archivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        reject(new Error('El archivo es demasiado grande (máximo 5MB)'));
        return;
      }

      // Verificar el tipo de archivo
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        // Validar JSON
        const reader = new FileReader();

        reader.onload = (e) => {
          try {
            // Intentar parsear el JSON
            const data = JSON.parse(e.target.result);

            // Verificar si es una exportación de múltiples planes
            if (data.exportMetadata && data.exportMetadata.type === 'multiple_plans' && Array.isArray(data.plans)) {
              // Verificar que al menos un plan sea válido
              if (data.plans.length === 0) {
                reject(new Error('El archivo no contiene planes de entrenamiento'));
                return;
              }

              // Verificar que al menos el primer plan sea válido
              const firstPlan = data.plans[0];
              if (!firstPlan.name || !firstPlan.id || !firstPlan.microcycles) {
                reject(new Error('El archivo contiene planes de entrenamiento inválidos'));
                return;
              }

              resolve({ valid: true, fileType: 'json', isMultiple: true, plansCount: data.plans.length });
              return;
            }

            // Verificar que sea un plan individual válido
            if (!data.name || !data.id || !data.microcycles) {
              reject(new Error('El archivo no contiene un plan de entrenamiento válido'));
              return;
            }

            resolve({ valid: true, fileType: 'json', isMultiple: false, planName: data.name });
          } catch (error) {
            reject(new Error('El archivo no contiene un JSON válido'));
          }
        };

        reader.onerror = () => {
          reject(new Error('Error al leer el archivo'));
        };

        reader.readAsText(file);
      } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        // Validar CSV
        const reader = new FileReader();

        reader.onload = (e) => {
          try {
            const content = e.target.result;
            const lines = content.split('\n').filter(line => line.trim());

            // Verificar que tenga al menos dos líneas (encabezados + datos)
            if (lines.length < 2) {
              reject(new Error('El archivo CSV no contiene suficientes datos'));
              return;
            }

            // Verificar encabezados
            const headers = this.parseCSVLine(lines[0]);
            const requiredHeaders = ['Microciclo', 'Sesión', 'Ejercicio'];
            const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));

            if (missingHeaders.length > 0) {
              reject(new Error(`El archivo CSV no contiene los encabezados requeridos: ${missingHeaders.join(', ')}`));
              return;
            }

            resolve({
              valid: true,
              fileType: 'csv',
              rowsCount: lines.length - 1,
              headers: headers
            });
          } catch (error) {
            reject(new Error(`Error al validar el archivo CSV: ${error.message}`));
          }
        };

        reader.onerror = () => {
          reject(new Error('Error al leer el archivo'));
        };

        reader.readAsText(file);
      } else {
        reject(new Error('Formato de archivo no soportado. Use JSON o CSV'));
      }
    });
  }

  /**
   * Lee un archivo y devuelve su contenido como texto
   * @param {File} file - Archivo a leer
   * @returns {Promise<string>} - Promesa que resuelve al contenido del archivo
   */
  readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        resolve(e.target.result);
      };

      reader.onerror = () => {
        reject(new Error('Error al leer el archivo'));
      };

      reader.readAsText(file);
    });
  }
}

export default new ImportExportService();
