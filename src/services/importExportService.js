import { TrainingPlan, Microcycle, TrainingSession, Exercise, Set } from '../models/TrainingPlan';

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
   * Importa un plan de entrenamiento desde formato JSON
   * @param {string} jsonString - Cadena JSON del plan
   * @returns {TrainingPlan} - Plan de entrenamiento importado
   */
  importPlanFromJson(jsonString) {
    try {
      // Parsear el JSON
      const planData = JSON.parse(jsonString);
      
      // Verificar que sea un plan válido
      if (!planData.name || !planData.id) {
        throw new Error('El archivo no contiene un plan de entrenamiento válido');
      }
      
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
        id: `imported_${Date.now()}`,
        // Actualizar fechas
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return importedPlan;
    } catch (error) {
      console.error('Error al importar el plan:', error);
      throw new Error('No se pudo importar el plan. Detalles: ' + error.message);
    }
  }
  
  /**
   * Descarga un archivo JSON con el plan exportado
   * @param {TrainingPlan} plan - Plan de entrenamiento a exportar
   */
  downloadPlanAsJson(plan) {
    try {
      const jsonString = this.exportPlanToJson(plan);
      const fileName = `${plan.name.replace(/\\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
      
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
    } catch (error) {
      console.error('Error al descargar el plan:', error);
      throw new Error('No se pudo descargar el plan. Detalles: ' + error.message);
    }
  }
  
  /**
   * Valida un archivo antes de importarlo
   * @param {File} file - Archivo a validar
   * @returns {Promise<boolean>} - Promesa que resuelve a true si el archivo es válido
   */
  async validateImportFile(file) {
    return new Promise((resolve, reject) => {
      // Verificar el tipo de archivo
      if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        reject(new Error('El archivo debe ser de tipo JSON'));
        return;
      }
      
      // Verificar el tamaño del archivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        reject(new Error('El archivo es demasiado grande (máximo 5MB)'));
        return;
      }
      
      // Leer el contenido del archivo
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          // Intentar parsear el JSON
          const planData = JSON.parse(e.target.result);
          
          // Verificar que sea un plan válido
          if (!planData.name || !planData.id || !planData.microcycles) {
            reject(new Error('El archivo no contiene un plan de entrenamiento válido'));
            return;
          }
          
          resolve(true);
        } catch (error) {
          reject(new Error('El archivo no contiene un JSON válido'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error al leer el archivo'));
      };
      
      reader.readAsText(file);
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
