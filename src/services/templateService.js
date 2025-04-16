import { PlanTemplate, SYSTEM_TEMPLATES } from '../models/PlanTemplate';
import { TrainingPlan, Microcycle, TrainingSession, Exercise, Set } from '../models/TrainingPlan';
import trainingPlanService from './trainingPlanService';

/**
 * Servicio para gestionar plantillas de planes de entrenamiento
 */
class TemplateService {
  /**
   * Obtener todas las plantillas disponibles
   * @returns {Array} - Lista de plantillas
   */
  getAllTemplates() {
    // Obtener plantillas del sistema
    const systemTemplates = [...SYSTEM_TEMPLATES];
    
    // Obtener plantillas del usuario desde localStorage
    const userTemplates = this.getUserTemplates();
    
    // Combinar y ordenar por categoría y nombre
    return [...systemTemplates, ...userTemplates].sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.name.localeCompare(b.name);
    });
  }
  
  /**
   * Obtener plantillas del usuario
   * @returns {Array} - Lista de plantillas del usuario
   */
  getUserTemplates() {
    try {
      const savedTemplates = localStorage.getItem('userTemplates');
      if (!savedTemplates) return [];
      
      const templates = JSON.parse(savedTemplates);
      return templates.map(template => new PlanTemplate(template));
    } catch (error) {
      console.error('Error al cargar plantillas del usuario:', error);
      return [];
    }
  }
  
  /**
   * Guardar una plantilla
   * @param {PlanTemplate} template - Plantilla a guardar
   * @returns {PlanTemplate} - Plantilla guardada
   */
  saveTemplate(template) {
    try {
      // Obtener plantillas existentes
      const templates = this.getUserTemplates();
      
      // Verificar si la plantilla ya existe
      const existingIndex = templates.findIndex(t => t.id === template.id);
      
      if (existingIndex >= 0) {
        // Actualizar plantilla existente
        templates[existingIndex] = template;
      } else {
        // Añadir nueva plantilla
        templates.push(template);
      }
      
      // Guardar en localStorage
      localStorage.setItem('userTemplates', JSON.stringify(templates));
      
      return template;
    } catch (error) {
      console.error('Error al guardar plantilla:', error);
      throw error;
    }
  }
  
  /**
   * Eliminar una plantilla
   * @param {string} templateId - ID de la plantilla a eliminar
   * @returns {boolean} - true si se eliminó correctamente
   */
  deleteTemplate(templateId) {
    try {
      // Obtener plantillas existentes
      const templates = this.getUserTemplates();
      
      // Filtrar la plantilla a eliminar
      const filteredTemplates = templates.filter(t => t.id !== templateId);
      
      // Verificar si se eliminó alguna plantilla
      if (filteredTemplates.length === templates.length) {
        return false;
      }
      
      // Guardar en localStorage
      localStorage.setItem('userTemplates', JSON.stringify(filteredTemplates));
      
      return true;
    } catch (error) {
      console.error('Error al eliminar plantilla:', error);
      throw error;
    }
  }
  
  /**
   * Crear un plan de entrenamiento a partir de una plantilla
   * @param {string} templateId - ID de la plantilla
   * @param {object} customizations - Personalizaciones para el plan
   * @returns {TrainingPlan} - Plan de entrenamiento creado
   */
  createPlanFromTemplate(templateId, customizations = {}) {
    // Buscar la plantilla
    const template = this.getAllTemplates().find(t => t.id === templateId);
    
    if (!template) {
      throw new Error(`Plantilla con ID ${templateId} no encontrada`);
    }
    
    // Si la plantilla tiene una estructura de plan completa, usarla
    if (template.planStructure) {
      const plan = new TrainingPlan(template.planStructure);
      
      // Aplicar personalizaciones
      plan.name = customizations.name || template.name;
      plan.description = customizations.description || template.description;
      
      return plan;
    }
    
    // Si no tiene estructura, crear un plan nuevo basado en los parámetros de la plantilla
    const planPreferences = {
      name: customizations.name || template.name,
      description: customizations.description || template.description,
      primaryGoal: customizations.primaryGoal || template.primaryGoal,
      secondaryGoals: customizations.secondaryGoals || template.secondaryGoals,
      planDuration: customizations.planDuration || template.planDuration,
      periodizationType: customizations.periodizationType || template.periodizationType,
      splitConfiguration: customizations.splitConfiguration || template.splitConfiguration,
      weeklyFrequency: customizations.weeklyFrequency || template.weeklyFrequency,
      trainingDays: customizations.trainingDays || template.trainingDays,
      sessionDuration: customizations.sessionDuration || template.sessionDuration,
      equipment: customizations.equipment || template.equipment
    };
    
    return trainingPlanService.createNewPlan(planPreferences);
  }
  
  /**
   * Crear una plantilla a partir de un plan existente
   * @param {TrainingPlan} plan - Plan de entrenamiento
   * @param {string} name - Nombre de la plantilla
   * @param {string} description - Descripción de la plantilla
   * @returns {PlanTemplate} - Plantilla creada
   */
  createTemplateFromPlan(plan, name, description) {
    const template = PlanTemplate.fromTrainingPlan(plan, name, description);
    return this.saveTemplate(template);
  }
  
  /**
   * Exportar una plantilla a JSON
   * @param {string} templateId - ID de la plantilla
   * @returns {string} - JSON de la plantilla
   */
  exportTemplate(templateId) {
    const template = this.getAllTemplates().find(t => t.id === templateId);
    
    if (!template) {
      throw new Error(`Plantilla con ID ${templateId} no encontrada`);
    }
    
    return JSON.stringify(template);
  }
  
  /**
   * Importar una plantilla desde JSON
   * @param {string} json - JSON de la plantilla
   * @returns {PlanTemplate} - Plantilla importada
   */
  importTemplate(json) {
    try {
      const templateData = JSON.parse(json);
      const template = new PlanTemplate(templateData);
      
      // Generar un nuevo ID para evitar conflictos
      template.id = `template_${Date.now()}`;
      template.isSystem = false;
      template.author = 'user';
      
      return this.saveTemplate(template);
    } catch (error) {
      console.error('Error al importar plantilla:', error);
      throw error;
    }
  }
}

export default new TemplateService();
