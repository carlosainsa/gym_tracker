import { TrainingPlan, Microcycle, TrainingSession, Exercise, Set } from '../models/TrainingPlan';

/**
 * Primer Plan de Entrenamiento con las características especificadas
 */
export const primerPlan = new TrainingPlan({
  name: 'Primer Plan de Entrenamiento',
  description: 'Plan de entrenamiento personalizado para hipertrofia con énfasis en pérdida de grasa',
  primaryGoal: 'hypertrophy',
  secondaryGoals: ['fat_loss'],
  planDuration: 12,
  periodizationType: 'linear',
  microcycles: [
    // Primer microciclo (semana 1)
    new Microcycle({
      name: 'Semana 1',
      description: 'Microciclo de la semana 1 - Fase 1',
      phase: 1,
      weekNumber: 1,
      weeklyFrequency: 3,
      splitConfiguration: 'fullbody',
      trainingDays: [1, 3, 5], // Lunes, Miércoles, Viernes
      cycleIntensity: 'medium',
      isDeload: false,
      trainingSessions: [
        // Sesión 1 (Lunes)
        new TrainingSession({
          id: 'session_1',
          name: 'Sesión de Entrenamiento 1: Cuerpo Completo - Énfasis en Empuje',
          description: 'Sesión de entrenamiento para cuerpo completo con énfasis en ejercicios de empuje',
          recommendedDay: 'Lunes',
          sessionDuration: 60,
          sessionFocus: ['push'],
          availableEquipment: ['all'],
          exercises: [
            // Ejercicios de la sesión 1
            new Exercise({
              id: 'exercise_1_1',
              name: 'Sentadilla con barra',
              description: 'Coloca la barra sobre los trapecios, baja flexionando rodillas y caderas manteniendo la espalda recta, y luego sube extendiendo las piernas.',
              muscleGroups: ['Cuádriceps', 'Glúteos', 'Isquiotibiales'],
              category: 'Piernas',
              equipment: 'Barra',
              rest: '90 seg',
              sets: [
                new Set({ reps: '8-10', weight: '60' }),
                new Set({ reps: '8-10', weight: '65' }),
                new Set({ reps: '8-10', weight: '70' })
              ]
            }),
            new Exercise({
              id: 'exercise_1_2',
              name: 'Press de banca',
              description: 'Acuéstate en el banco, agarra la barra con las manos a una distancia mayor que los hombros, baja la barra al pecho y luego empuja hacia arriba.',
              muscleGroups: ['Pecho', 'Tríceps', 'Hombros'],
              category: 'Empuje',
              equipment: 'Barra',
              rest: '90 seg',
              sets: [
                new Set({ reps: '8-10', weight: '50' }),
                new Set({ reps: '8-10', weight: '55' }),
                new Set({ reps: '8-10', weight: '60' })
              ]
            }),
            new Exercise({
              id: 'exercise_1_3',
              name: 'Remo con barra',
              description: 'Inclínate hacia adelante con la espalda recta, agarra la barra con las manos a la anchura de los hombros, y tira hacia el abdomen.',
              muscleGroups: ['Espalda', 'Bíceps'],
              category: 'Tracción',
              equipment: 'Barra',
              rest: '90 seg',
              sets: [
                new Set({ reps: '8-10', weight: '45' }),
                new Set({ reps: '8-10', weight: '50' }),
                new Set({ reps: '8-10', weight: '55' })
              ]
            }),
            new Exercise({
              id: 'exercise_1_4',
              name: 'Press militar',
              description: 'De pie, con la barra a la altura de los hombros, empuja hacia arriba hasta extender los brazos por completo.',
              muscleGroups: ['Hombros', 'Tríceps'],
              category: 'Empuje',
              equipment: 'Barra',
              rest: '90 seg',
              sets: [
                new Set({ reps: '8-10', weight: '30' }),
                new Set({ reps: '8-10', weight: '35' }),
                new Set({ reps: '8-10', weight: '40' })
              ]
            }),
            new Exercise({
              id: 'exercise_1_5',
              name: 'Curl de bíceps con barra',
              description: 'De pie, con la barra en las manos, flexiona los codos para levantar la barra hacia los hombros.',
              muscleGroups: ['Bíceps'],
              category: 'Brazos',
              equipment: 'Barra',
              rest: '60 seg',
              sets: [
                new Set({ reps: '10-12', weight: '25' }),
                new Set({ reps: '10-12', weight: '27.5' }),
                new Set({ reps: '10-12', weight: '30' })
              ]
            }),
            new Exercise({
              id: 'exercise_1_6',
              name: 'Extensión de tríceps en polea',
              description: 'Con la polea alta, agarra la cuerda y extiende los brazos hacia abajo, manteniendo los codos cerca del cuerpo.',
              muscleGroups: ['Tríceps'],
              category: 'Brazos',
              equipment: 'Cable',
              rest: '60 seg',
              sets: [
                new Set({ reps: '10-12', weight: '20' }),
                new Set({ reps: '10-12', weight: '22.5' }),
                new Set({ reps: '10-12', weight: '25' })
              ]
            }),
            new Exercise({
              id: 'exercise_1_7',
              name: 'Plancha abdominal',
              description: 'Apóyate sobre los antebrazos y las puntas de los pies, manteniendo el cuerpo en línea recta.',
              muscleGroups: ['Core'],
              category: 'Core',
              equipment: 'Peso corporal',
              rest: '45 seg',
              isTimeBased: true,
              sets: [
                new Set({ reps: '30 seg', weight: 'Peso corporal' }),
                new Set({ reps: '30 seg', weight: 'Peso corporal' }),
                new Set({ reps: '30 seg', weight: 'Peso corporal' })
              ]
            })
          ],
          sessionStructure: {
            warmup: [
              '5 min bicicleta estática (bajo impacto)',
              'Movilidad articular progresiva (hombros, cadera, tobillos)'
            ],
            main: [],
            finisher: [
              'Estiramientos estáticos para los grupos musculares trabajados',
              '5 min de caminata ligera para reducir la frecuencia cardíaca'
            ]
          }
        }),
        
        // Sesión 2 (Miércoles)
        new TrainingSession({
          id: 'session_2',
          name: 'Sesión de Entrenamiento 2: Cuerpo Completo - Énfasis en Tracción',
          description: 'Sesión de entrenamiento para cuerpo completo con énfasis en ejercicios de tracción',
          recommendedDay: 'Miércoles',
          sessionDuration: 60,
          sessionFocus: ['pull'],
          availableEquipment: ['all'],
          exercises: [
            // Ejercicios de la sesión 2
            new Exercise({
              id: 'exercise_2_1',
              name: 'Peso muerto',
              description: 'Con la barra en el suelo, flexiona caderas y rodillas para agarrarla, y luego levántala extendiendo caderas y rodillas manteniendo la espalda recta.',
              muscleGroups: ['Isquiotibiales', 'Glúteos', 'Espalda baja'],
              category: 'Piernas',
              equipment: 'Barra',
              rest: '90 seg',
              sets: [
                new Set({ reps: '8-10', weight: '70' }),
                new Set({ reps: '8-10', weight: '75' }),
                new Set({ reps: '8-10', weight: '80' })
              ]
            }),
            new Exercise({
              id: 'exercise_2_2',
              name: 'Dominadas asistidas',
              description: 'Agárrate a la barra con las palmas hacia adelante, y tira de tu cuerpo hacia arriba hasta que la barbilla supere la barra.',
              muscleGroups: ['Espalda', 'Bíceps'],
              category: 'Tracción',
              equipment: 'Peso corporal',
              rest: '90 seg',
              sets: [
                new Set({ reps: '8-10', weight: 'Peso corporal' }),
                new Set({ reps: '8-10', weight: 'Peso corporal' }),
                new Set({ reps: '8-10', weight: 'Peso corporal' })
              ]
            }),
            new Exercise({
              id: 'exercise_2_3',
              name: 'Press de banca inclinado',
              description: 'Acuéstate en el banco inclinado, agarra la barra y bájala al pecho, luego empuja hacia arriba.',
              muscleGroups: ['Pecho superior', 'Hombros', 'Tríceps'],
              category: 'Empuje',
              equipment: 'Barra',
              rest: '90 seg',
              sets: [
                new Set({ reps: '8-10', weight: '45' }),
                new Set({ reps: '8-10', weight: '50' }),
                new Set({ reps: '8-10', weight: '55' })
              ]
            }),
            new Exercise({
              id: 'exercise_2_4',
              name: 'Remo en máquina',
              description: 'Siéntate en la máquina, agarra los mangos y tira hacia ti manteniendo la espalda recta.',
              muscleGroups: ['Espalda', 'Bíceps'],
              category: 'Tracción',
              equipment: 'Máquina',
              rest: '90 seg',
              sets: [
                new Set({ reps: '8-10', weight: '50' }),
                new Set({ reps: '8-10', weight: '55' }),
                new Set({ reps: '8-10', weight: '60' })
              ]
            }),
            new Exercise({
              id: 'exercise_2_5',
              name: 'Elevaciones laterales',
              description: 'De pie, con mancuernas en las manos, eleva los brazos hacia los lados hasta la altura de los hombros.',
              muscleGroups: ['Hombros'],
              category: 'Hombros',
              equipment: 'Mancuernas',
              rest: '60 seg',
              sets: [
                new Set({ reps: '10-12', weight: '7.5' }),
                new Set({ reps: '10-12', weight: '10' }),
                new Set({ reps: '10-12', weight: '10' })
              ]
            }),
            new Exercise({
              id: 'exercise_2_6',
              name: 'Curl de bíceps con mancuernas',
              description: 'De pie, con mancuernas en las manos, flexiona los codos para levantar las mancuernas hacia los hombros.',
              muscleGroups: ['Bíceps'],
              category: 'Brazos',
              equipment: 'Mancuernas',
              rest: '60 seg',
              sets: [
                new Set({ reps: '10-12', weight: '12.5' }),
                new Set({ reps: '10-12', weight: '15' }),
                new Set({ reps: '10-12', weight: '15' })
              ]
            }),
            new Exercise({
              id: 'exercise_2_7',
              name: 'Crunch abdominal',
              description: 'Acuéstate boca arriba con las rodillas flexionadas, coloca las manos detrás de la cabeza y levanta los hombros del suelo.',
              muscleGroups: ['Core'],
              category: 'Core',
              equipment: 'Peso corporal',
              rest: '45 seg',
              sets: [
                new Set({ reps: '15-20', weight: 'Peso corporal' }),
                new Set({ reps: '15-20', weight: 'Peso corporal' }),
                new Set({ reps: '15-20', weight: 'Peso corporal' })
              ]
            })
          ],
          sessionStructure: {
            warmup: [
              '5 min bicicleta estática (bajo impacto)',
              'Movilidad articular progresiva (hombros, cadera, tobillos)'
            ],
            main: [],
            finisher: [
              'Estiramientos estáticos para los grupos musculares trabajados',
              '5 min de caminata ligera para reducir la frecuencia cardíaca'
            ]
          }
        }),
        
        // Sesión 3 (Viernes)
        new TrainingSession({
          id: 'session_3',
          name: 'Sesión de Entrenamiento 3: Cuerpo Completo - Énfasis en Piernas y Funcional',
          description: 'Sesión de entrenamiento para cuerpo completo con énfasis en piernas y ejercicios funcionales',
          recommendedDay: 'Viernes',
          sessionDuration: 60,
          sessionFocus: ['legs'],
          availableEquipment: ['all'],
          exercises: [
            // Ejercicios de la sesión 3
            new Exercise({
              id: 'exercise_3_1',
              name: 'Prensa de piernas',
              description: 'Siéntate en la máquina con la espalda apoyada, coloca los pies en la plataforma y empuja extendiendo las piernas.',
              muscleGroups: ['Cuádriceps', 'Glúteos', 'Isquiotibiales'],
              category: 'Piernas',
              equipment: 'Máquina',
              rest: '90 seg',
              sets: [
                new Set({ reps: '10-12', weight: '100' }),
                new Set({ reps: '10-12', weight: '110' }),
                new Set({ reps: '10-12', weight: '120' })
              ]
            }),
            new Exercise({
              id: 'exercise_3_2',
              name: 'Extensión de cuádriceps',
              description: 'Siéntate en la máquina, coloca los pies debajo del rodillo y extiende las piernas.',
              muscleGroups: ['Cuádriceps'],
              category: 'Piernas',
              equipment: 'Máquina',
              rest: '60 seg',
              sets: [
                new Set({ reps: '12-15', weight: '40' }),
                new Set({ reps: '12-15', weight: '45' }),
                new Set({ reps: '12-15', weight: '50' })
              ]
            }),
            new Exercise({
              id: 'exercise_3_3',
              name: 'Curl femoral',
              description: 'Acuéstate boca abajo en la máquina, coloca los talones debajo del rodillo y flexiona las piernas.',
              muscleGroups: ['Isquiotibiales'],
              category: 'Piernas',
              equipment: 'Máquina',
              rest: '60 seg',
              sets: [
                new Set({ reps: '12-15', weight: '35' }),
                new Set({ reps: '12-15', weight: '40' }),
                new Set({ reps: '12-15', weight: '45' })
              ]
            }),
            new Exercise({
              id: 'exercise_3_4',
              name: 'Elevación de talones',
              description: 'De pie en la máquina, con los hombros bajo los cojines, eleva los talones lo más alto posible.',
              muscleGroups: ['Pantorrillas'],
              category: 'Piernas',
              equipment: 'Máquina',
              rest: '60 seg',
              sets: [
                new Set({ reps: '15-20', weight: '60' }),
                new Set({ reps: '15-20', weight: '65' }),
                new Set({ reps: '15-20', weight: '70' })
              ]
            }),
            new Exercise({
              id: 'exercise_3_5',
              name: 'Pullover con mancuerna',
              description: 'Acuéstate en un banco con una mancuerna sostenida sobre el pecho, baja la mancuerna por detrás de la cabeza y regresa a la posición inicial.',
              muscleGroups: ['Espalda', 'Pecho'],
              category: 'Tracción',
              equipment: 'Mancuernas',
              rest: '60 seg',
              sets: [
                new Set({ reps: '10-12', weight: '20' }),
                new Set({ reps: '10-12', weight: '22.5' }),
                new Set({ reps: '10-12', weight: '25' })
              ]
            }),
            new Exercise({
              id: 'exercise_3_6',
              name: 'Press de hombros con mancuernas',
              description: 'Sentado o de pie, con mancuernas a la altura de los hombros, empuja hacia arriba hasta extender los brazos.',
              muscleGroups: ['Hombros', 'Tríceps'],
              category: 'Empuje',
              equipment: 'Mancuernas',
              rest: '60 seg',
              sets: [
                new Set({ reps: '10-12', weight: '15' }),
                new Set({ reps: '10-12', weight: '17.5' }),
                new Set({ reps: '10-12', weight: '20' })
              ]
            }),
            new Exercise({
              id: 'exercise_3_7',
              name: 'Plancha lateral',
              description: 'Apóyate sobre un antebrazo con el cuerpo de lado, manteniendo una línea recta desde la cabeza hasta los pies.',
              muscleGroups: ['Core', 'Oblicuos'],
              category: 'Core',
              equipment: 'Peso corporal',
              rest: '45 seg',
              isTimeBased: true,
              sets: [
                new Set({ reps: '30 seg/lado', weight: 'Peso corporal' }),
                new Set({ reps: '30 seg/lado', weight: 'Peso corporal' }),
                new Set({ reps: '30 seg/lado', weight: 'Peso corporal' })
              ]
            })
          ],
          sessionStructure: {
            warmup: [
              '5 min bicicleta estática (bajo impacto)',
              'Movilidad articular progresiva (hombros, cadera, tobillos)'
            ],
            main: [],
            finisher: [
              'Estiramientos estáticos para los grupos musculares trabajados',
              '5 min de caminata ligera para reducir la frecuencia cardíaca'
            ]
          }
        })
      ]
    })
  ]
});
