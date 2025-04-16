/**
 * Modelo para plantillas de planes de entrenamiento
 */
export class PlanTemplate {
  constructor({
    id = `template_${Date.now()}`,
    name = '',
    description = '',
    category = 'custom',
    difficulty = 'intermediate',
    primaryGoal = 'hypertrophy',
    secondaryGoals = [],
    planDuration = 12,
    periodizationType = 'linear',
    splitConfiguration = 'fullbody',
    weeklyFrequency = 3,
    trainingDays = [1, 3, 5],
    sessionDuration = 60,
    equipment = ['all'],
    thumbnail = '',
    author = 'system',
    isSystem = false,
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString(),
    planStructure = null
  } = {}) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.category = category;
    this.difficulty = difficulty;
    this.primaryGoal = primaryGoal;
    this.secondaryGoals = secondaryGoals;
    this.planDuration = planDuration;
    this.periodizationType = periodizationType;
    this.splitConfiguration = splitConfiguration;
    this.weeklyFrequency = weeklyFrequency;
    this.trainingDays = trainingDays;
    this.sessionDuration = sessionDuration;
    this.equipment = equipment;
    this.thumbnail = thumbnail;
    this.author = author;
    this.isSystem = isSystem;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.planStructure = planStructure;
  }

  /**
   * Convierte un plan de entrenamiento existente en una plantilla
   * @param {TrainingPlan} trainingPlan - Plan de entrenamiento a convertir
   * @param {string} name - Nombre de la plantilla
   * @param {string} description - Descripción de la plantilla
   * @returns {PlanTemplate} - Nueva plantilla de plan
   */
  static fromTrainingPlan(trainingPlan, name, description) {
    return new PlanTemplate({
      name: name || trainingPlan.name,
      description: description || trainingPlan.description,
      category: 'custom',
      difficulty: 'intermediate',
      primaryGoal: trainingPlan.primaryGoal,
      secondaryGoals: trainingPlan.secondaryGoals,
      planDuration: trainingPlan.planDuration,
      periodizationType: trainingPlan.periodizationType,
      splitConfiguration: trainingPlan.microcycles[0]?.splitConfiguration || 'fullbody',
      weeklyFrequency: trainingPlan.microcycles[0]?.weeklyFrequency || 3,
      trainingDays: trainingPlan.microcycles[0]?.trainingDays || [1, 3, 5],
      sessionDuration: trainingPlan.microcycles[0]?.trainingSessions[0]?.sessionDuration || 60,
      equipment: trainingPlan.microcycles[0]?.trainingSessions[0]?.availableEquipment || ['all'],
      author: 'user',
      isSystem: false,
      planStructure: trainingPlan
    });
  }
}

/**
 * Plantillas predefinidas del sistema
 */
export const SYSTEM_TEMPLATES = [
  // Plantilla para hipertrofia
  new PlanTemplate({
    id: 'template_hypertrophy',
    name: 'Plan de Hipertrofia',
    description: 'Plan de entrenamiento enfocado en el crecimiento muscular con énfasis en volumen y tiempo bajo tensión.',
    category: 'muscle',
    difficulty: 'intermediate',
    primaryGoal: 'hypertrophy',
    secondaryGoals: ['strength'],
    planDuration: 12,
    periodizationType: 'linear',
    splitConfiguration: 'fullbody',
    weeklyFrequency: 3,
    trainingDays: [1, 3, 5],
    sessionDuration: 60,
    equipment: ['all'],
    thumbnail: '/assets/templates/hypertrophy.jpg',
    author: 'system',
    isSystem: true
  }),
  
  // Plantilla para fuerza
  new PlanTemplate({
    id: 'template_strength',
    name: 'Plan de Fuerza',
    description: 'Plan de entrenamiento enfocado en el desarrollo de fuerza máxima con énfasis en cargas pesadas y baja repetición.',
    category: 'strength',
    difficulty: 'advanced',
    primaryGoal: 'strength',
    secondaryGoals: ['hypertrophy'],
    planDuration: 16,
    periodizationType: 'undulating',
    splitConfiguration: 'upper_lower',
    weeklyFrequency: 4,
    trainingDays: [1, 2, 4, 5],
    sessionDuration: 75,
    equipment: ['barbell', 'dumbbell', 'machine'],
    thumbnail: '/assets/templates/strength.jpg',
    author: 'system',
    isSystem: true
  }),
  
  // Plantilla para pérdida de grasa
  new PlanTemplate({
    id: 'template_fat_loss',
    name: 'Plan de Pérdida de Grasa',
    description: 'Plan de entrenamiento enfocado en la pérdida de grasa con énfasis en circuitos de alta intensidad y menor descanso.',
    category: 'fat_loss',
    difficulty: 'beginner',
    primaryGoal: 'fat_loss',
    secondaryGoals: ['endurance'],
    planDuration: 8,
    periodizationType: 'linear',
    splitConfiguration: 'fullbody',
    weeklyFrequency: 4,
    trainingDays: [1, 3, 5, 6],
    sessionDuration: 45,
    equipment: ['bodyweight', 'dumbbell', 'kettlebell'],
    thumbnail: '/assets/templates/fat_loss.jpg',
    author: 'system',
    isSystem: true
  }),
  
  // Plantilla para resistencia
  new PlanTemplate({
    id: 'template_endurance',
    name: 'Plan de Resistencia Muscular',
    description: 'Plan de entrenamiento enfocado en mejorar la resistencia muscular con énfasis en altas repeticiones y descansos cortos.',
    category: 'endurance',
    difficulty: 'intermediate',
    primaryGoal: 'endurance',
    secondaryGoals: ['fat_loss'],
    planDuration: 10,
    periodizationType: 'linear',
    splitConfiguration: 'push_pull_legs',
    weeklyFrequency: 5,
    trainingDays: [1, 2, 3, 5, 6],
    sessionDuration: 50,
    equipment: ['bodyweight', 'dumbbell', 'cable'],
    thumbnail: '/assets/templates/endurance.jpg',
    author: 'system',
    isSystem: true
  }),
  
  // Plantilla para principiantes
  new PlanTemplate({
    id: 'template_beginner',
    name: 'Plan para Principiantes',
    description: 'Plan de entrenamiento diseñado para principiantes con énfasis en aprender la técnica correcta y establecer una base sólida.',
    category: 'beginner',
    difficulty: 'beginner',
    primaryGoal: 'general',
    secondaryGoals: ['strength', 'hypertrophy'],
    planDuration: 8,
    periodizationType: 'linear',
    splitConfiguration: 'fullbody',
    weeklyFrequency: 3,
    trainingDays: [1, 3, 5],
    sessionDuration: 45,
    equipment: ['machine', 'dumbbell', 'bodyweight'],
    thumbnail: '/assets/templates/beginner.jpg',
    author: 'system',
    isSystem: true
  })
];
