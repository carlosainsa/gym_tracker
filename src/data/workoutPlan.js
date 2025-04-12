// Datos del plan de entrenamiento
export const workoutPlan = [
    {
      id: 1,
      name: "Entrenamiento 1: Piernas + Core",
      recommendedDay: "Lunes",
      phase: 1,
      progress: 0,
      exercises: [
        {
          id: 1,
          name: "Prensa de piernas",
          description: "Siéntate en la máquina con la espalda apoyada en el respaldo. Coloca los pies en la plataforma a la anchura de los hombros. Empuja la plataforma extendiendo las piernas y luego regresa controladamente a la posición inicial.",
          muscleGroups: ["Cuádriceps", "Glúteos", "Isquiotibiales"],
          category: "Piernas",
          equipment: "Máquina",
          rest: "75 seg",
          progress: 0,
          sets: [
            { reps: "12-15", weight: 65 },
            { reps: "12-15", weight: 67.5 },
            { reps: "12-15", weight: 70 }
          ],
          actualSets: []
        },
        {
          id: 2,
          name: "Sentadilla Goblet con mancuerna",
          description: "Sujeta una mancuerna verticalmente contra el pecho, con los codos hacia abajo. Separa los pies a la anchura de los hombros y realiza una sentadilla manteniendo la espalda recta.",
          muscleGroups: ["Cuádriceps", "Glúteos", "Core"],
          category: "Piernas",
          equipment: "Mancuerna",
          rest: "75 seg",
          progress: 0,
          sets: [
            { reps: "10-12", weight: 12 },
            { reps: "10-12", weight: 14 },
            { reps: "10-12", weight: 15 }
          ],
          actualSets: []
        },
        {
          id: 3,
          name: "Extensión de piernas",
          description: "Siéntate en la máquina con la espalda apoyada en el respaldo. Coloca los tobillos detrás del rodillo acolchado. Extiende las piernas hasta que estén completamente rectas y luego baja controladamente.",
          muscleGroups: ["Cuádriceps"],
          category: "Piernas",
          equipment: "Máquina",
          rest: "60 seg",
          progress: 0,
          sets: [
            { reps: "12-15", weight: 40 },
            { reps: "12-15", weight: 42.5 },
            { reps: "12-15", weight: 45 }
          ],
          actualSets: []
        },
        {
          id: 4,
          name: "Curl femoral tumbado",
          description: "Túmbate boca abajo en la máquina con los tobillos debajo del rodillo acolchado. Flexiona las piernas llevando los talones hacia los glúteos y luego baja controladamente.",
          muscleGroups: ["Isquiotibiales", "Glúteos"],
          category: "Piernas",
          equipment: "Máquina",
          rest: "60 seg",
          progress: 0,
          sets: [
            { reps: "12-15", weight: 40 },
            { reps: "12-15", weight: 42.5 },
            { reps: "12-15", weight: 45 }
          ],
          actualSets: []
        },
        {
          id: 5,
          name: "Abducción de cadera",
          sets: 3,
          reps: "15",
          weight: "45-50 kg",
          rest: "60 seg",
          phase1: {
            sets: 3,
            reps: "15",
            weight: "45-50 kg"
          },
          phase2: {
            sets: 3,
            reps: "12",
            weight: "50-55 kg"
          },
          phase3: {
            sets: 3,
            reps: "10",
            weight: "55-60 kg"
          }
        },
        {
          id: 6,
          name: "Aducción de cadera",
          sets: 3,
          reps: "15",
          weight: "45-50 kg",
          rest: "60 seg",
          phase1: {
            sets: 3,
            reps: "15",
            weight: "45-50 kg"
          },
          phase2: {
            sets: 3,
            reps: "12",
            weight: "50-55 kg"
          },
          phase3: {
            sets: 3,
            reps: "10",
            weight: "55-60 kg"
          }
        },
        {
          id: 7,
          name: "Plancha frontal",
          sets: 3,
          reps: "60 seg",
          weight: "Peso corporal",
          rest: "45 seg",
          phase1: {
            sets: 3,
            reps: "60 seg",
            weight: "Peso corporal"
          },
          phase2: {
            sets: 3,
            reps: "75 seg",
            weight: "Peso corporal"
          },
          phase3: {
            sets: 3,
            reps: "90 seg",
            weight: "Peso corporal"
          }
        },
        {
          id: 8,
          name: "Russian twist con mancuerna",
          sets: 3,
          reps: "15 reps/lado",
          weight: "6-8 kg",
          rest: "45 seg",
          phase1: {
            sets: 3,
            reps: "15 reps/lado",
            weight: "6-8 kg"
          },
          phase2: {
            sets: 3,
            reps: "12 reps/lado",
            weight: "8-10 kg"
          },
          phase3: {
            sets: 3,
            reps: "10 reps/lado",
            weight: "10-12 kg"
          }
        }
      ]
    },
    {
      id: 2,
      name: "Entrenamiento 2: Pecho, Hombros y Tríceps",
      recommendedDay: "Miércoles",
      phase: 1,
      progress: 0,
      exercises: [
        {
          id: 9,
          name: "Press de banca",
          sets: 3,
          reps: "12-15",
          weight: "30-35 kg",
          rest: "75 seg",
          phase1: {
            sets: 3,
            reps: "12-15",
            weight: "30-35 kg"
          },
          phase2: {
            sets: 3,
            reps: "10-12",
            weight: "35-40 kg"
          },
          phase3: {
            sets: 4,
            reps: "8-10",
            weight: "40-45 kg"
          }
        },
        {
          id: 10,
          name: "Press de hombros con mancuernas",
          sets: 3,
          reps: "12-15",
          weight: "15-17 kg por lado",
          rest: "75 seg",
          phase1: {
            sets: 3,
            reps: "12-15",
            weight: "15-17 kg por lado"
          },
          phase2: {
            sets: 3,
            reps: "10-12",
            weight: "17-20 kg por lado"
          },
          phase3: {
            sets: 4,
            reps: "8-10",
            weight: "20-22 kg por lado"
          }
        },
        {
          id: 11,
          name: "Aperturas con mancuernas",
          sets: 3,
          reps: "12-15",
          weight: "10-12 kg por lado",
          rest: "60 seg",
          phase1: {
            sets: 3,
            reps: "12-15",
            weight: "10-12 kg por lado"
          },
          phase2: {
            sets: 3,
            reps: "10-12",
            weight: "12-15 kg por lado"
          },
          phase3: {
            sets: 3,
            reps: "8-10",
            weight: "15-17 kg por lado"
          }
        },
        {
          id: 12,
          name: "Elevaciones laterales",
          sets: 3,
          reps: "12-15",
          weight: "7-8 kg por lado",
          rest: "60 seg",
          phase1: {
            sets: 3,
            reps: "12-15",
            weight: "7-8 kg por lado"
          },
          phase2: {
            sets: 3,
            reps: "10-12",
            weight: "8-10 kg por lado"
          },
          phase3: {
            sets: 3,
            reps: "8-10",
            weight: "10-12 kg por lado"
          }
        },
        {
          id: 13,
          name: "Extensión de tríceps polea",
          sets: 3,
          reps: "12-15",
          weight: "20-22 kg",
          rest: "60 seg",
          phase1: {
            sets: 3,
            reps: "12-15",
            weight: "20-22 kg"
          },
          phase2: {
            sets: 3,
            reps: "10-12",
            weight: "22-25 kg"
          },
          phase3: {
            sets: 3,
            reps: "8-10",
            weight: "25-28 kg"
          }
        },
        {
          id: 14,
          name: "Fondos en banco",
          sets: 3,
          reps: "12-15",
          weight: "Peso corporal",
          rest: "60 seg",
          phase1: {
            sets: 3,
            reps: "12-15",
            weight: "Peso corporal"
          },
          phase2: {
            sets: 3,
            reps: "15-20",
            weight: "Peso corporal"
          },
          phase3: {
            sets: 3,
            reps: "20-25",
            weight: "Peso corporal"
          }
        },
        {
          id: 15,
          name: "Plancha con rotación",
          sets: 3,
          reps: "8-10 reps por lado",
          weight: "Peso corporal",
          rest: "45 seg",
          phase1: {
            sets: 3,
            reps: "8-10 reps por lado",
            weight: "Peso corporal"
          },
          phase2: {
            sets: 3,
            reps: "10-12 reps por lado",
            weight: "Peso corporal"
          },
          phase3: {
            sets: 3,
            reps: "12-15 reps por lado",
            weight: "Peso corporal"
          }
        }
      ]
    },
    {
      id: 3,
      name: "Entrenamiento 3: Espalda, Bíceps y Complementos",
      recommendedDay: "Viernes",
      phase: 1,
      progress: 0,
      exercises: [
        {
          id: 16,
          name: "Jalón al pecho",
          sets: 3,
          reps: "12-15",
          weight: "32-35 kg",
          rest: "75 seg",
          phase1: {
            sets: 3,
            reps: "12-15",
            weight: "32-35 kg"
          },
          phase2: {
            sets: 3,
            reps: "10-12",
            weight: "35-40 kg"
          },
          phase3: {
            sets: 4,
            reps: "8-10",
            weight: "40-45 kg"
          }
        },
        {
          id: 17,
          name: "Remo en máquina",
          sets: 3,
          reps: "12-15",
          weight: "36-40 kg",
          rest: "75 seg",
          phase1: {
            sets: 3,
            reps: "12-15",
            weight: "36-40 kg"
          },
          phase2: {
            sets: 3,
            reps: "10-12",
            weight: "40-45 kg"
          },
          phase3: {
            sets: 4,
            reps: "8-10",
            weight: "45-50 kg"
          }
        },
        {
          id: 18,
          name: "Remo inclinado con mancuernas",
          sets: 3,
          reps: "10-12",
          weight: "12-15 kg por lado",
          rest: "75 seg",
          phase1: {
            sets: 3,
            reps: "10-12",
            weight: "12-15 kg por lado"
          },
          phase2: {
            sets: 3,
            reps: "8-10",
            weight: "15-18 kg por lado"
          },
          phase3: {
            sets: 3,
            reps: "6-8",
            weight: "18-20 kg por lado"
          }
        },
        {
          id: 19,
          name: "Curl de bíceps con polea",
          sets: 3,
          reps: "12-15",
          weight: "30-33 kg",
          rest: "60 seg",
          phase1: {
            sets: 3,
            reps: "12-15",
            weight: "30-33 kg"
          },
          phase2: {
            sets: 3,
            reps: "10-12",
            weight: "33-36 kg"
          },
          phase3: {
            sets: 3,
            reps: "8-10",
            weight: "36-40 kg"
          }
        },
        {
          id: 20,
          name: "Curl araña con mancuerna",
          sets: 3,
          reps: "10-12",
          weight: "12-15 kg",
          rest: "60 seg",
          phase1: {
            sets: 3,
            reps: "10-12",
            weight: "12-15 kg"
          },
          phase2: {
            sets: 3,
            reps: "8-10",
            weight: "15-18 kg"
          },
          phase3: {
            sets: 3,
            reps: "6-8",
            weight: "18-20 kg"
          }
        },
        {
          id: 21,
          name: "Sentadilla búlgara",
          sets: 3,
          reps: "10 reps por pierna",
          weight: "8-10 kg por mano",
          rest: "75 seg",
          phase1: {
            sets: 3,
            reps: "10 reps por pierna",
            weight: "8-10 kg por mano"
          },
          phase2: {
            sets: 3,
            reps: "8 reps por pierna",
            weight: "10-12 kg por mano"
          },
          phase3: {
            sets: 3,
            reps: "6 reps por pierna",
            weight: "12-15 kg por mano"
          }
        },
        {
          id: 22,
          name: "Balanceo con mancuerna (Kettlebell Swing)",
          sets: 3,
          reps: "15",
          weight: "15-20 kg",
          rest: "60 seg",
          phase1: {
            sets: 3,
            reps: "15",
            weight: "15-20 kg"
          },
          phase2: {
            sets: 3,
            reps: "12",
            weight: "20-25 kg"
          },
          phase3: {
            sets: 3,
            reps: "10",
            weight: "25-30 kg"
          }
        }
      ]
    },
    // Fase 2
    {
      id: 4,
      name: "Entrenamiento 1: Piernas + Core (Fase 2)",
      recommendedDay: "Lunes",
      phase: 2,
      progress: 0,
      exercises: []
    },
    {
      id: 5,
      name: "Entrenamiento 2: Pecho, Hombros y Tríceps (Fase 2)",
      recommendedDay: "Miércoles",
      phase: 2,
      progress: 0,
      exercises: []
    },
    {
      id: 6,
      name: "Entrenamiento 3: Espalda, Bíceps y Complementos (Fase 2)",
      recommendedDay: "Viernes",
      phase: 2,
      progress: 0,
      exercises: []
    },
    // Fase 3
    {
      id: 7,
      name: "Entrenamiento 1: Piernas + Core (Fase 3)",
      recommendedDay: "Lunes",
      phase: 3,
      progress: 0,
      exercises: []
    },
    {
      id: 8,
      name: "Entrenamiento 2: Pecho, Hombros y Tríceps (Fase 3)",
      recommendedDay: "Miércoles",
      phase: 3,
      progress: 0,
      exercises: []
    },
    {
      id: 9,
      name: "Entrenamiento 3: Espalda, Bíceps y Complementos (Fase 3)",
      recommendedDay: "Viernes",
      phase: 3,
      progress: 0,
      exercises: []
    }
];

// Estructura para almacenar los registros de entrenamiento
export const emptyWorkoutLog = {
  logs: []
};
