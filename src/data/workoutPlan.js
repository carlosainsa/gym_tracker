// Datos del plan de entrenamiento
export const workoutPlan = {
  name: "Plan de Entrenamiento Personalizado",
  phases: [
    {
      name: "Fase 1",
      weeks: "1-4",
      description: "Adaptación y base"
    },
    {
      name: "Fase 2",
      weeks: "5-8",
      description: "Progresión de carga"
    },
    {
      name: "Fase 3",
      weeks: "9-12",
      description: "Intensificación"
    }
  ],
  days: [
    {
      id: 1,
      name: "Día 1: Piernas + Core",
      recommendedDay: "Lunes",
      exercises: [
        {
          id: 1,
          name: "Prensa de piernas",
          sets: 3,
          reps: "12-15",
          weight: "65-70 kg",
          rest: "75 seg",
          phase1: {
            sets: 3,
            reps: "12-15",
            weight: "65-70 kg"
          },
          phase2: {
            sets: 3,
            reps: "10-12",
            weight: "75-80 kg"
          },
          phase3: {
            sets: 4,
            reps: "8-10",
            weight: "85-90 kg"
          }
        },
        {
          id: 2,
          name: "Sentadilla Goblet con mancuerna",
          sets: 3,
          reps: "10-12",
          weight: "12-15 kg",
          rest: "75 seg",
          phase1: {
            sets: 3,
            reps: "10-12",
            weight: "12-15 kg"
          },
          phase2: {
            sets: 3,
            reps: "10-12",
            weight: "15-18 kg"
          },
          phase3: {
            sets: 4,
            reps: "8-10",
            weight: "18-22 kg"
          }
        },
        {
          id: 3,
          name: "Extensión de piernas",
          sets: 3,
          reps: "12-15",
          weight: "40-45 kg",
          rest: "60 seg",
          phase1: {
            sets: 3,
            reps: "12-15",
            weight: "40-45 kg"
          },
          phase2: {
            sets: 3,
            reps: "10-12",
            weight: "45-50 kg"
          },
          phase3: {
            sets: 4,
            reps: "8-10",
            weight: "50-55 kg"
          }
        },
        {
          id: 4,
          name: "Curl femoral tumbado",
          sets: 3,
          reps: "12-15",
          weight: "40-45 kg",
          rest: "60 seg",
          phase1: {
            sets: 3,
            reps: "12-15",
            weight: "40-45 kg"
          },
          phase2: {
            sets: 3,
            reps: "10-12",
            weight: "45-50 kg"
          },
          phase3: {
            sets: 4,
            reps: "8-10",
            weight: "50-55 kg"
          }
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
      name: "Día 2: Pecho, Hombros y Tríceps",
      recommendedDay: "Miércoles",
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
      name: "Día 3: Espalda, Bíceps y Complementos",
      recommendedDay: "Viernes",
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
    }
  ]
};

// Estructura para almacenar los registros de entrenamiento
export const emptyWorkoutLog = {
  logs: []
};
