import { v4 as uuidv4 } from 'uuid';
import { TrainingPlan } from '../models/TrainingPlan';
import planService from './planService';
import statisticsService from './statisticsService';
import analyticsService from './analyticsService';

/**
 * Servicio para gestionar planes históricos
 */
class HistoricalPlanService {
  /**
   * Archiva un plan de entrenamiento
   * @param {string} planId - ID del plan a archivar
   * @param {Object} options - Opciones de archivado
   * @returns {TrainingPlan} - Plan archivado
   */
  archivePlan(planId, options = {}) {
    try {
      const {
        archiveReason = '',
        includeNotes = true,
        generateSummary = true,
        archiveDate = new Date().toISOString()
      } = options;
      
      // Obtener el plan
      const plan = planService.getPlanById(planId);
      if (!plan) {
        throw new Error('Plan no encontrado');
      }
      
      // Generar resumen si es necesario
      let summary = null;
      if (generateSummary) {
        summary = this.generatePlanSummary(plan);
      }
      
      // Actualizar el plan
      const archivedPlan = {
        ...plan,
        status: 'archived',
        archivedAt: archiveDate,
        archiveReason,
        summary
      };
      
      // Guardar el plan actualizado
      planService.updatePlan(archivedPlan);
      
      return archivedPlan;
    } catch (error) {
      console.error('Error al archivar plan:', error);
      throw new Error(`No se pudo archivar el plan: ${error.message}`);
    }
  }
  
  /**
   * Restaura un plan archivado
   * @param {string} planId - ID del plan a restaurar
   * @returns {TrainingPlan} - Plan restaurado
   */
  restorePlan(planId) {
    try {
      // Obtener el plan
      const plan = planService.getPlanById(planId);
      if (!plan) {
        throw new Error('Plan no encontrado');
      }
      
      if (plan.status !== 'archived') {
        throw new Error('El plan no está archivado');
      }
      
      // Actualizar el plan
      const restoredPlan = {
        ...plan,
        status: 'available',
        archivedAt: null,
        archiveReason: null
      };
      
      // Guardar el plan actualizado
      planService.updatePlan(restoredPlan);
      
      return restoredPlan;
    } catch (error) {
      console.error('Error al restaurar plan:', error);
      throw new Error(`No se pudo restaurar el plan: ${error.message}`);
    }
  }
  
  /**
   * Genera un resumen del plan
   * @param {TrainingPlan} plan - Plan de entrenamiento
   * @returns {Object} - Resumen del plan
   */
  generatePlanSummary(plan) {
    try {
      // Calcular estadísticas básicas
      const stats = statisticsService.calculatePlanStats(plan);
      
      // Calcular análisis avanzado
      const analysis = analyticsService.analyzePlan(plan);
      
      // Crear resumen
      return {
        id: uuidv4(),
        planId: plan.id,
        planName: plan.name,
        createdAt: new Date().toISOString(),
        duration: {
          weeks: plan.microcycles.length,
          sessions: plan.getAllSessions().length,
          completedSessions: plan.getAllSessions().filter(s => s.completed).length
        },
        volume: {
          total: stats.totalVolume,
          byMuscleGroup: stats.volumeByMuscleGroup
        },
        intensity: {
          average: stats.avgIntensity,
          byMuscleGroup: stats.intensityByMuscleGroup
        },
        progression: {
          weightProgression: analysis.progression.weightProgression,
          volumeProgression: analysis.progression.volumeProgression
        },
        compliance: {
          overall: stats.complianceRate,
          byExercise: stats.complianceByExercise
        },
        achievements: this.identifyAchievements(plan, stats, analysis)
      };
    } catch (error) {
      console.error('Error al generar resumen del plan:', error);
      return {
        id: uuidv4(),
        planId: plan.id,
        planName: plan.name,
        createdAt: new Date().toISOString(),
        error: 'No se pudo generar el resumen completo'
      };
    }
  }
  
  /**
   * Identifica logros destacables del plan
   * @param {TrainingPlan} plan - Plan de entrenamiento
   * @param {Object} stats - Estadísticas del plan
   * @param {Object} analysis - Análisis del plan
   * @returns {Array} - Lista de logros
   */
  identifyAchievements(plan, stats, analysis) {
    const achievements = [];
    
    // Logro de cumplimiento
    if (stats.complianceRate >= 0.9) {
      achievements.push({
        type: 'compliance',
        title: 'Alta adherencia',
        description: `Completaste el ${Math.round(stats.complianceRate * 100)}% de las sesiones programadas`
      });
    }
    
    // Logro de progresión
    if (analysis.progression.weightProgression > 0.1) {
      achievements.push({
        type: 'progression',
        title: 'Progresión significativa',
        description: `Aumentaste tus pesos un ${Math.round(analysis.progression.weightProgression * 100)}% en promedio`
      });
    }
    
    // Logro de volumen
    if (stats.totalVolume > 10000) {
      achievements.push({
        type: 'volume',
        title: 'Alto volumen',
        description: `Acumulaste más de ${Math.round(stats.totalVolume / 1000)}K kg de volumen total`
      });
    }
    
    // Logro de consistencia
    const consistentExercises = Object.entries(stats.complianceByExercise)
      .filter(([_, rate]) => rate >= 0.95)
      .length;
    
    if (consistentExercises >= 5) {
      achievements.push({
        type: 'consistency',
        title: 'Consistencia ejemplar',
        description: `Fuiste consistente en ${consistentExercises} ejercicios clave`
      });
    }
    
    return achievements;
  }
  
  /**
   * Obtiene todos los planes históricos
   * @returns {Array} - Lista de planes históricos
   */
  getAllHistoricalPlans() {
    try {
      // Obtener todos los planes
      const allPlans = planService.getAllPlans();
      
      // Filtrar los planes archivados
      return allPlans.filter(plan => plan.status === 'archived');
    } catch (error) {
      console.error('Error al obtener planes históricos:', error);
      throw new Error(`No se pudieron obtener los planes históricos: ${error.message}`);
    }
  }
  
  /**
   * Busca planes históricos según criterios
   * @param {Object} criteria - Criterios de búsqueda
   * @returns {Array} - Lista de planes históricos filtrados
   */
  searchHistoricalPlans(criteria = {}) {
    try {
      const {
        query = '',
        startDate,
        endDate,
        sortBy = 'archivedAt',
        sortOrder = 'desc',
        limit = 100
      } = criteria;
      
      // Obtener todos los planes históricos
      let plans = this.getAllHistoricalPlans();
      
      // Filtrar por texto
      if (query) {
        const lowerQuery = query.toLowerCase();
        plans = plans.filter(plan => 
          plan.name.toLowerCase().includes(lowerQuery) ||
          (plan.description && plan.description.toLowerCase().includes(lowerQuery)) ||
          (plan.archiveReason && plan.archiveReason.toLowerCase().includes(lowerQuery))
        );
      }
      
      // Filtrar por fecha de inicio
      if (startDate) {
        const start = new Date(startDate).getTime();
        plans = plans.filter(plan => new Date(plan.archivedAt).getTime() >= start);
      }
      
      // Filtrar por fecha de fin
      if (endDate) {
        const end = new Date(endDate).getTime();
        plans = plans.filter(plan => new Date(plan.archivedAt).getTime() <= end);
      }
      
      // Ordenar resultados
      plans.sort((a, b) => {
        let valueA, valueB;
        
        // Determinar los valores a comparar
        switch (sortBy) {
          case 'name':
            valueA = a.name.toLowerCase();
            valueB = b.name.toLowerCase();
            break;
          case 'createdAt':
            valueA = new Date(a.createdAt).getTime();
            valueB = new Date(b.createdAt).getTime();
            break;
          case 'archivedAt':
          default:
            valueA = new Date(a.archivedAt).getTime();
            valueB = new Date(b.archivedAt).getTime();
            break;
        }
        
        // Aplicar el orden
        return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
      });
      
      // Limitar resultados
      return plans.slice(0, limit);
    } catch (error) {
      console.error('Error al buscar planes históricos:', error);
      throw new Error(`No se pudieron buscar los planes históricos: ${error.message}`);
    }
  }
  
  /**
   * Elimina permanentemente un plan histórico
   * @param {string} planId - ID del plan a eliminar
   * @returns {boolean} - true si se eliminó correctamente
   */
  deletePermanently(planId) {
    try {
      // Obtener el plan
      const plan = planService.getPlanById(planId);
      if (!plan) {
        throw new Error('Plan no encontrado');
      }
      
      if (plan.status !== 'archived') {
        throw new Error('Solo se pueden eliminar permanentemente planes archivados');
      }
      
      // Eliminar el plan
      planService.deletePlan(planId);
      
      return true;
    } catch (error) {
      console.error('Error al eliminar permanentemente el plan:', error);
      throw new Error(`No se pudo eliminar el plan: ${error.message}`);
    }
  }
  
  /**
   * Exporta un plan histórico con su resumen
   * @param {string} planId - ID del plan a exportar
   * @returns {Object} - Plan histórico con su resumen
   */
  exportHistoricalPlan(planId) {
    try {
      // Obtener el plan
      const plan = planService.getPlanById(planId);
      if (!plan) {
        throw new Error('Plan no encontrado');
      }
      
      if (plan.status !== 'archived') {
        throw new Error('Solo se pueden exportar planes archivados');
      }
      
      // Si el plan no tiene resumen, generarlo
      if (!plan.summary) {
        plan.summary = this.generatePlanSummary(plan);
        planService.updatePlan(plan);
      }
      
      return {
        plan,
        summary: plan.summary
      };
    } catch (error) {
      console.error('Error al exportar plan histórico:', error);
      throw new Error(`No se pudo exportar el plan histórico: ${error.message}`);
    }
  }
}

export default new HistoricalPlanService();
