import { TRAINING_CONFIG, generateTrainingName } from '../config/trainingConfig';

// Datos del plan de entrenamiento
export const workoutPlan = [
    // Fase 1
    {
      id: 1,
      name: generateTrainingName(0, TRAINING_CONFIG.trainingTypes[0], 1),
      recommendedDay: "Lunes",
      phase: 1,
      progress: 0,
      description: `
I. Calentamiento (10 min)
   - 5 min bicicleta estática (bajo impacto)
   - Movilidad articular progresiva (hombros, cadera, tobillos)

II. Bloque Principal (50-55 min)

III. Finalización (10 min)
   - Estiramientos estáticos para pecho, hombros y cuádriceps
   - Movilidad específica de cadera
   - Automasaje plantar (para fasciitis)`,
      exercises: [
        {
          id: 1,
          name: "Prensa de piernas",
          description: "Siéntate en la máquina con la espalda apoyada en el respaldo. Coloca los pies en la plataforma a la anchura de los hombros. Empuja la plataforma extendiendo las piernas y luego regresa controladamente a la posición inicial.",
          muscleGroups: ["Cuádriceps", "Glúteos", "Isquiotibiales"],
          category: "Principal tren inferior",
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
          name: "Press de banca",
          description: "Acuéstate en el banco con los pies apoyados en el suelo. Agarra la barra con las manos a una distancia mayor que la anchura de los hombros. Baja la barra hasta rozar el pecho y empuja hacia arriba hasta extender los brazos.",
          muscleGroups: ["Pectoral", "Deltoides", "Tríceps"],
          category: "Principal empuje superior",
          equipment: "Barra",
          rest: "75 seg",
          progress: 0,
          sets: [
            { reps: "12-15", weight: 30 },
            { reps: "12-15", weight: 32.5 },
            { reps: "12-15", weight: 35 }
          ],
          actualSets: []
        },
        {
          id: 3,
          name: "Jalón al pecho",
          description: "Siéntate en la máquina con los muslos bajo los soportes. Agarra la barra con las manos a una distancia mayor que la anchura de los hombros. Tira de la barra hacia abajo hasta que toque la parte superior del pecho, manteniendo la espalda recta.",
          muscleGroups: ["Dorsal", "Bíceps", "Romboides"],
          category: "Tracción vertical",
          equipment: "Máquina",
          rest: "75 seg",
          progress: 0,
          sets: [
            { reps: "12-15", weight: 32 },
            { reps: "12-15", weight: 33.5 },
            { reps: "12-15", weight: 35 }
          ],
          actualSets: []
        },
        {
          id: 4,
          name: "Extensión de piernas",
          description: "Siéntate en la máquina con la espalda apoyada en el respaldo. Coloca los tobillos detrás del rodillo acolchado. Extiende las piernas hasta que estén completamente rectas y luego baja controladamente.",
          muscleGroups: ["Cuádriceps"],
          category: "Aislamiento cuádriceps",
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
          name: "Elevaciones laterales",
          description: "De pie con una mancuerna en cada mano, levanta los brazos hacia los lados hasta que estén paralelos al suelo. Mantén los codos ligeramente flexionados y baja controladamente.",
          muscleGroups: ["Deltoides"],
          category: "Aislamiento hombros",
          equipment: "Mancuernas",
          rest: "60 seg",
          progress: 0,
          sets: [
            { reps: "12-15", weight: 7 },
            { reps: "12-15", weight: 7.5 },
            { reps: "12-15", weight: 8 }
          ],
          actualSets: []
        },
        {
          id: 6,
          name: "Extensión de tríceps",
          description: "De pie frente a la polea, agarra la barra con las manos a la anchura de los hombros. Mantén los codos pegados al cuerpo y extiende los brazos hacia abajo. Regresa controladamente a la posición inicial.",
          muscleGroups: ["Tríceps"],
          category: "Aislamiento tríceps",
          equipment: "Polea",
          rest: "60 seg",
          progress: 0,
          sets: [
            { reps: "12-15", weight: 20 },
            { reps: "12-15", weight: 21 },
            { reps: "12-15", weight: 22 }
          ],
          actualSets: []
        },
        {
          id: 7,
          name: "Plancha frontal",
          description: "Apóyate sobre los antebrazos y las puntas de los pies, manteniendo el cuerpo en línea recta. Mantén la posición contrayendo el core.",
          muscleGroups: ["Core", "Abdominales"],
          category: "Core",
          equipment: "Peso corporal",
          rest: "45 seg",
          progress: 0,
          sets: [
            { reps: "45-60 seg", weight: 0 },
            { reps: "45-60 seg", weight: 0 },
            { reps: "45-60 seg", weight: 0 }
          ],
          actualSets: []
        }
      ]
    },
    {
      id: 2,
      name: generateTrainingName(1, TRAINING_CONFIG.trainingTypes[1], 1),
      recommendedDay: "Miércoles",
      phase: 1,
      progress: 0,
      description: `
I. Calentamiento (10 min)
   - 5 min bicicleta estática (bajo impacto)
   - Movilidad articular progresiva (hombros, cadera, tobillos)

II. Bloque Principal (50-55 min)

III. Finalización (10 min)
   - Estiramientos estáticos para espalda, bíceps y antebrazos
   - Movilidad específica de hombros
   - Automasaje para trapecios y zona cervical`,
      exercises: [
        {
          id: 8,
          name: "Sentadilla Goblet con mancuerna",
          description: "Sujeta una mancuerna verticalmente contra el pecho, con los codos hacia abajo. Separa los pies a la anchura de los hombros y realiza una sentadilla manteniendo la espalda recta.",
          muscleGroups: ["Cuádriceps", "Glúteos", "Core"],
          category: "Piernas",
          equipment: "Mancuerna",
          rest: "75 seg",
          progress: 0,
          sets: [
            { reps: "10-12", weight: 12 },
            { reps: "10-12", weight: 13.5 },
            { reps: "10-12", weight: 15 }
          ],
          actualSets: []
        },
        {
          id: 9,
          name: "Remo en máquina",
          description: "Siéntate en la máquina con el pecho apoyado en el respaldo. Agarra las manijas y tira hacia atrás, llevando los codos hacia atrás y apretando los omóplatos. Regresa controladamente a la posición inicial.",
          muscleGroups: ["Dorsal", "Bíceps", "Romboides"],
          category: "Espalda",
          equipment: "Máquina",
          rest: "75 seg",
          progress: 0,
          sets: [
            { reps: "12-15", weight: 36 },
            { reps: "12-15", weight: 38 },
            { reps: "12-15", weight: 40 }
          ],
          actualSets: []
        },
        {
          id: 10,
          name: "Press de hombros con mancuernas",
          description: "Siéntate en un banco con respaldo vertical. Sostén una mancuerna en cada mano a la altura de los hombros, con las palmas hacia adelante. Empuja las mancuernas hacia arriba hasta extender los brazos y luego bájalas controladamente.",
          muscleGroups: ["Deltoides", "Tríceps"],
          category: "Hombros",
          equipment: "Mancuernas",
          rest: "75 seg",
          progress: 0,
          sets: [
            { reps: "12-15", weight: 15 },
            { reps: "12-15", weight: 16 },
            { reps: "12-15", weight: 17 }
          ],
          actualSets: []
        },
        {
          id: 11,
          name: "Curl femoral tumbado",
          description: "Túmbate boca abajo en la máquina con los tobillos debajo del rodillo acolchado. Flexiona las rodillas para llevar los talones hacia los glúteos y luego baja controladamente.",
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
          id: 12,
          name: "Curl de bíceps con polea",
          description: "De pie frente a la polea, agarra la barra con las palmas hacia arriba. Mantén los codos pegados al cuerpo y flexiona los brazos, llevando la barra hacia los hombros. Regresa controladamente a la posición inicial.",
          muscleGroups: ["Bíceps"],
          category: "Brazos",
          equipment: "Polea",
          rest: "60 seg",
          progress: 0,
          sets: [
            { reps: "12-15", weight: 30 },
            { reps: "12-15", weight: 31.5 },
            { reps: "12-15", weight: 33 }
          ],
          actualSets: []
        },
        {
          id: 13,
          name: "Abducción de cadera",
          description: "Siéntate en la máquina con las piernas juntas y las almohadillas contra la parte exterior de los muslos. Separa las piernas hacia afuera contra la resistencia y luego regresa controladamente.",
          muscleGroups: ["Glúteo medio", "Estabilizadores de cadera"],
          category: "Piernas",
          equipment: "Máquina",
          rest: "60 seg",
          progress: 0,
          sets: [
            { reps: "15", weight: 45 },
            { reps: "15", weight: 47.5 },
            { reps: "15", weight: 50 }
          ],
          actualSets: []
        },
        {
          id: 14,
          name: "Russian twist con mancuerna",
          description: "Siéntate en el suelo con las rodillas flexionadas y los pies elevados. Sujeta una mancuerna con ambas manos frente a ti. Gira el torso de un lado a otro, tocando la mancuerna en el suelo a cada lado.",
          muscleGroups: ["Oblicuos", "Core"],
          category: "Core",
          equipment: "Mancuerna",
          rest: "45 seg",
          progress: 0,
          sets: [
            { reps: "15 reps/lado", weight: 6 },
            { reps: "15 reps/lado", weight: 7 },
            { reps: "15 reps/lado", weight: 8 }
          ],
          actualSets: []
        }
      ]
    },
    {
      id: 3,
      name: generateTrainingName(2, TRAINING_CONFIG.trainingTypes[2], 1),
      recommendedDay: "Viernes",
      phase: 1,
      progress: 0,
      description: `
I. Calentamiento (10 min)
   - 5 min bicicleta estática (bajo impacto)
   - Movilidad articular progresiva (hombros, cadera, tobillos)

II. Bloque Principal (50-55 min)

III. Finalización (10 min)
   - Estiramientos estáticos para piernas, glúteos e isquiotibiales
   - Movilidad específica de cadera y rodillas
   - Automasaje para cuadriceps y zona lumbar`,
      exercises: [
        {
          id: 15,
          name: "Sentadilla búlgara con mancuernas",
          description: "De pie frente a un banco, coloca un pie sobre el banco detrás de ti. Sostén una mancuerna en cada mano. Flexiona la rodilla de la pierna delantera hasta que el muslo esté paralelo al suelo. Empuja hacia arriba para volver a la posición inicial.",
          muscleGroups: ["Cuádriceps", "Glúteos", "Isquiotibiales"],
          category: "Piernas",
          equipment: "Mancuernas",
          rest: "75 seg",
          progress: 0,
          sets: [
            { reps: "10 reps/pierna", weight: 8 },
            { reps: "10 reps/pierna", weight: 9 },
            { reps: "10 reps/pierna", weight: 10 }
          ],
          actualSets: []
        },
        {
          id: 16,
          name: "Press de banca con mancuernas",
          description: "Acuéstate en un banco plano con una mancuerna en cada mano. Extiende los brazos hacia arriba y luego baja las mancuernas hasta que los codos estén a la altura del pecho. Empuja hacia arriba hasta extender los brazos.",
          muscleGroups: ["Pectoral", "Deltoides", "Tríceps"],
          category: "Pecho",
          equipment: "Mancuernas",
          rest: "75 seg",
          progress: 0,
          sets: [
            { reps: "12-15", weight: 15 },
            { reps: "12-15", weight: 16 },
            { reps: "12-15", weight: 17 }
          ],
          actualSets: []
        },
        {
          id: 17,
          name: "Remo inclinado con mancuernas",
          description: "Inclínate hacia adelante con las rodillas ligeramente flexionadas. Sostén una mancuerna en cada mano con los brazos colgando. Tira de las mancuernas hacia arriba, llevando los codos hacia atrás y apretando los omóplatos.",
          muscleGroups: ["Dorsal", "Bíceps", "Romboides"],
          category: "Espalda",
          equipment: "Mancuernas",
          rest: "75 seg",
          progress: 0,
          sets: [
            { reps: "10-12", weight: 12 },
            { reps: "10-12", weight: 13.5 },
            { reps: "10-12", weight: 15 }
          ],
          actualSets: []
        },
        {
          id: 18,
          name: "Aducción de cadera",
          description: "Siéntate en la máquina con las piernas separadas y las almohadillas contra la parte interior de los muslos. Junta las piernas contra la resistencia y luego regresa controladamente.",
          muscleGroups: ["Aductores", "Estabilizadores de cadera"],
          category: "Piernas",
          equipment: "Máquina",
          rest: "60 seg",
          progress: 0,
          sets: [
            { reps: "15", weight: 45 },
            { reps: "15", weight: 47.5 },
            { reps: "15", weight: 50 }
          ],
          actualSets: []
        },
        {
          id: 19,
          name: "Curl araña con mancuerna",
          description: "Apoya el pecho en un banco inclinado. Sostén una mancuerna en cada mano con los brazos colgando. Flexiona los brazos, llevando las mancuernas hacia los hombros. Regresa controladamente a la posición inicial.",
          muscleGroups: ["Bíceps", "Core"],
          category: "Brazos",
          equipment: "Mancuernas",
          rest: "60 seg",
          progress: 0,
          sets: [
            { reps: "10-12", weight: 10 },
            { reps: "10-12", weight: 11 },
            { reps: "10-12", weight: 12 }
          ],
          actualSets: []
        },
        {
          id: 20,
          name: "Fondos en banco",
          description: "Siéntate en el borde de un banco con las manos apoyadas a los lados. Desliza el cuerpo hacia adelante hasta que las piernas estén extendidas y el peso recaiga sobre las manos. Flexiona los codos para bajar el cuerpo y luego extiéndelos para volver a subir.",
          muscleGroups: ["Tríceps", "Pectoral inferior"],
          category: "Brazos",
          equipment: "Banco",
          rest: "60 seg",
          progress: 0,
          sets: [
            { reps: "12-15", weight: "Peso corporal" },
            { reps: "12-15", weight: "Peso corporal" },
            { reps: "12-15", weight: "Peso corporal" }
          ],
          actualSets: []
        },
        {
          id: 21,
          name: "Balanceo con mancuerna",
          description: "De pie con los pies separados a la anchura de los hombros. Sostén una mancuerna con ambas manos entre las piernas. Flexiona ligeramente las rodillas y balancea la mancuerna hacia adelante, extendiendo las caderas. Regresa controladamente a la posición inicial.",
          muscleGroups: ["Glúteos", "Isquiotibiales", "Core"],
          category: "Funcional",
          equipment: "Mancuerna",
          rest: "60 seg",
          progress: 0,
          sets: [
            { reps: "15", weight: 15 },
            { reps: "15", weight: 17.5 },
            { reps: "15", weight: 20 }
          ],
          actualSets: []
        }
      ]
    },
    // Fase 2
    {
      id: 4,
      name: "Entrenamiento 1: Cuerpo Completo - Énfasis en Empuje (Fase 2)",
      recommendedDay: "Lunes",
      phase: 2,
      progress: 0,
      exercises: [
        {
          id: 22,
          name: "Prensa de piernas",
          description: "Siéntate en la máquina con la espalda apoyada en el respaldo. Coloca los pies en la plataforma a la anchura de los hombros. Empuja la plataforma extendiendo las piernas y luego regresa controladamente a la posición inicial.",
          muscleGroups: ["Cuádriceps", "Glúteos", "Isquiotibiales"],
          category: "Piernas",
          equipment: "Máquina",
          rest: "90 seg",
          progress: 0,
          sets: [
            { reps: "10-12", weight: 75 },
            { reps: "10-12", weight: 77.5 },
            { reps: "10-12", weight: 80 }
          ],
          actualSets: []
        },
        {
          id: 23,
          name: "Press de banca",
          description: "Acuéstate en el banco con los pies apoyados en el suelo. Agarra la barra con las manos a una distancia mayor que la anchura de los hombros. Baja la barra hasta rozar el pecho y empuja hacia arriba hasta extender los brazos.",
          muscleGroups: ["Pectoral", "Deltoides", "Tríceps"],
          category: "Pecho",
          equipment: "Barra",
          rest: "90 seg",
          progress: 0,
          sets: [
            { reps: "10-12", weight: 37 },
            { reps: "10-12", weight: 39.5 },
            { reps: "10-12", weight: 42 }
          ],
          actualSets: []
        },
        {
          id: 24,
          name: "Jalón al pecho",
          description: "Siéntate en la máquina con los muslos bajo los soportes. Agarra la barra con las manos a una distancia mayor que la anchura de los hombros. Tira de la barra hacia abajo hasta que toque la parte superior del pecho, manteniendo la espalda recta.",
          muscleGroups: ["Dorsal", "Bíceps", "Romboides"],
          category: "Espalda",
          equipment: "Máquina",
          rest: "90 seg",
          progress: 0,
          sets: [
            { reps: "10-12", weight: 38 },
            { reps: "10-12", weight: 40 },
            { reps: "10-12", weight: 42 }
          ],
          actualSets: []
        },
        {
          id: 25,
          name: "Extensión de piernas",
          description: "Siéntate en la máquina con la espalda apoyada en el respaldo. Coloca los tobillos detrás del rodillo acolchado. Extiende las piernas hasta que estén completamente rectas y luego baja controladamente.",
          muscleGroups: ["Cuádriceps"],
          category: "Piernas",
          equipment: "Máquina",
          rest: "75 seg",
          progress: 0,
          sets: [
            { reps: "10-12", weight: 48 },
            { reps: "10-12", weight: 51.5 },
            { reps: "10-12", weight: 55 }
          ],
          actualSets: []
        },
        {
          id: 26,
          name: "Elevaciones laterales",
          description: "De pie con una mancuerna en cada mano, levanta los brazos hacia los lados hasta que estén paralelos al suelo. Mantén los codos ligeramente flexionados y baja controladamente.",
          muscleGroups: ["Deltoides"],
          category: "Hombros",
          equipment: "Mancuernas",
          rest: "75 seg",
          progress: 0,
          sets: [
            { reps: "10-12", weight: 8 },
            { reps: "10-12", weight: 8.5 },
            { reps: "10-12", weight: 9 }
          ],
          actualSets: []
        },
        {
          id: 27,
          name: "Extensión de tríceps",
          description: "De pie frente a la polea, agarra la barra con las manos a la anchura de los hombros. Mantén los codos pegados al cuerpo y extiende los brazos hacia abajo. Regresa controladamente a la posición inicial.",
          muscleGroups: ["Tríceps"],
          category: "Brazos",
          equipment: "Polea",
          rest: "75 seg",
          progress: 0,
          sets: [
            { reps: "10-12", weight: 24 },
            { reps: "10-12", weight: 25 },
            { reps: "10-12", weight: 26 }
          ],
          actualSets: []
        },
        {
          id: 28,
          name: "Plancha frontal + elevación alterna de piernas",
          description: "Apóyate sobre los antebrazos y las puntas de los pies, manteniendo el cuerpo en línea recta. Alterna elevando cada pierna mientras mantienes la posición de plancha.",
          muscleGroups: ["Core", "Abdominales", "Estabilizadores"],
          category: "Core",
          equipment: "Peso corporal",
          rest: "60 seg",
          progress: 0,
          sets: [
            { reps: "60 seg", weight: "Peso corporal" },
            { reps: "60 seg", weight: "Peso corporal" },
            { reps: "60 seg", weight: "Peso corporal" }
          ],
          actualSets: []
        }
      ]
    },
    {
      id: 5,
      name: "Entrenamiento 2: Cuerpo Completo - Énfasis en Tracción (Fase 2)",
      recommendedDay: "Miércoles",
      phase: 2,
      progress: 0,
      exercises: [
        {
          id: 29,
          name: "Sentadilla Goblet con mancuerna",
          description: "Sujeta una mancuerna verticalmente contra el pecho, con los codos hacia abajo. Separa los pies a la anchura de los hombros y realiza una sentadilla manteniendo la espalda recta.",
          muscleGroups: ["Cuádriceps", "Glúteos", "Core"],
          category: "Piernas",
          equipment: "Mancuerna",
          rest: "90 seg",
          progress: 0,
          sets: [
            { reps: "8-10", weight: 16 },
            { reps: "8-10", weight: 17 },
            { reps: "8-10", weight: 18 }
          ],
          actualSets: []
        },
        {
          id: 30,
          name: "Remo en máquina",
          description: "Siéntate en la máquina con el pecho apoyado en el respaldo. Agarra las manijas y tira hacia atrás, llevando los codos hacia atrás y apretando los omóplatos. Regresa controladamente a la posición inicial.",
          muscleGroups: ["Dorsal", "Bíceps", "Romboides"],
          category: "Espalda",
          equipment: "Máquina",
          rest: "90 seg",
      progress: 0,
          sets: [
            { reps: "10-12", weight: 44 },
            { reps: "10-12", weight: 46 },
            { reps: "10-12", weight: 48 }
          ],
          actualSets: []
        },
        {
          id: 31,
          name: "Press de hombros con mancuernas",
          description: "Siéntate en un banco con respaldo vertical. Sostén una mancuerna en cada mano a la altura de los hombros, con las palmas hacia adelante. Empuja las mancuernas hacia arriba hasta extender los brazos y luego bájalas controladamente.",
          muscleGroups: ["Deltoides", "Tríceps"],
          category: "Hombros",
          equipment: "Mancuernas",
          rest: "90 seg",
          progress: 0,
          sets: [
            { reps: "10-12", weight: 18 },
            { reps: "10-12", weight: 19 },
            { reps: "10-12", weight: 20 }
          ],
          actualSets: []
        },
        {
          id: 32,
          name: "Curl femoral tumbado",
          description: "Túmbate boca abajo en la máquina con los tobillos debajo del rodillo acolchado. Flexiona las rodillas para llevar los talones hacia los glúteos y luego baja controladamente.",
          muscleGroups: ["Isquiotibiales", "Glúteos"],
          category: "Piernas",
          equipment: "Máquina",
          rest: "75 seg",
          progress: 0,
          sets: [
            { reps: "10-12", weight: 48 },
            { reps: "10-12", weight: 50 },
            { reps: "10-12", weight: 52 }
          ],
          actualSets: []
        },
        {
          id: 33,
          name: "Curl de bíceps con polea",
          description: "De pie frente a la polea, agarra la barra con las palmas hacia arriba. Mantén los codos pegados al cuerpo y flexiona los brazos, llevando la barra hacia los hombros. Regresa controladamente a la posición inicial.",
          muscleGroups: ["Bíceps"],
          category: "Brazos",
          equipment: "Polea",
          rest: "75 seg",
          progress: 0,
          sets: [
            { reps: "10-12", weight: 35 },
            { reps: "10-12", weight: 36.5 },
            { reps: "10-12", weight: 38 }
          ],
          actualSets: []
        },
        {
          id: 34,
          name: "Abducción de cadera",
          description: "Siéntate en la máquina con las piernas juntas y las almohadillas contra la parte exterior de los muslos. Separa las piernas hacia afuera contra la resistencia y luego regresa controladamente.",
          muscleGroups: ["Glúteo medio", "Estabilizadores de cadera"],
          category: "Piernas",
          equipment: "Máquina",
          rest: "75 seg",
          progress: 0,
          sets: [
            { reps: "12", weight: 55 },
            { reps: "12", weight: 57.5 },
            { reps: "12", weight: 60 }
          ],
          actualSets: []
        },
        {
          id: 35,
          name: "Russian twist con mancuerna",
          description: "Siéntate en el suelo con las rodillas flexionadas y los pies elevados. Sujeta una mancuerna con ambas manos frente a ti. Gira el torso de un lado a otro, tocando la mancuerna en el suelo a cada lado.",
          muscleGroups: ["Oblicuos", "Core"],
          category: "Core",
          equipment: "Mancuerna",
          rest: "60 seg",
          progress: 0,
          sets: [
            { reps: "12 reps/lado", weight: 9 },
            { reps: "12 reps/lado", weight: 9.5 },
            { reps: "12 reps/lado", weight: 10 }
          ],
          actualSets: []
        }
      ]
    },
    {
      id: 6,
      name: "Entrenamiento 3: Cuerpo Completo - Énfasis en Piernas y Funcional (Fase 2)",
      recommendedDay: "Viernes",
      phase: 2,
      progress: 0,
      exercises: [
        {
          id: 36,
          name: "Sentadilla búlgara con mancuernas",
          description: "De pie frente a un banco, coloca un pie sobre el banco detrás de ti. Sostén una mancuerna en cada mano. Flexiona la rodilla de la pierna delantera hasta que el muslo esté paralelo al suelo. Empuja hacia arriba para volver a la posición inicial.",
          muscleGroups: ["Cuádriceps", "Glúteos", "Isquiotibiales"],
          category: "Piernas",
          equipment: "Mancuernas",
          rest: "90 seg",
          progress: 0,
          sets: [
            { reps: "8-10 reps/pierna", weight: 12 },
            { reps: "8-10 reps/pierna", weight: 13 },
            { reps: "8-10 reps/pierna", weight: 14 }
          ],
          actualSets: []
        },
        {
          id: 37,
          name: "Press de banca con mancuernas",
          description: "Acuéstate en un banco plano con una mancuerna en cada mano. Extiende los brazos hacia arriba y luego baja las mancuernas hasta que los codos estén a la altura del pecho. Empuja hacia arriba hasta extender los brazos.",
          muscleGroups: ["Pectoral", "Deltoides", "Tríceps"],
          category: "Pecho",
          equipment: "Mancuernas",
          rest: "90 seg",
          progress: 0,
          sets: [
            { reps: "10-12", weight: 18 },
            { reps: "10-12", weight: 19 },
            { reps: "10-12", weight: 20 }
          ],
          actualSets: []
        },
        {
          id: 38,
          name: "Remo inclinado con mancuernas",
          description: "Inclínate hacia adelante con las rodillas ligeramente flexionadas. Sostén una mancuerna en cada mano con los brazos colgando. Tira de las mancuernas hacia arriba, llevando los codos hacia atrás y apretando los omóplatos.",
          muscleGroups: ["Dorsal", "Bíceps", "Romboides"],
          category: "Espalda",
          equipment: "Mancuernas",
          rest: "90 seg",
          progress: 0,
          sets: [
            { reps: "10-12", weight: 16 },
            { reps: "10-12", weight: 17 },
            { reps: "10-12", weight: 18 }
          ],
          actualSets: []
        },
        {
          id: 39,
          name: "Aducción de cadera",
          description: "Siéntate en la máquina con las piernas separadas y las almohadillas contra la parte interior de los muslos. Junta las piernas contra la resistencia y luego regresa controladamente.",
          muscleGroups: ["Aductores", "Estabilizadores de cadera"],
          category: "Piernas",
          equipment: "Máquina",
          rest: "75 seg",
          progress: 0,
          sets: [
            { reps: "12", weight: 55 },
            { reps: "12", weight: 57.5 },
            { reps: "12", weight: 60 }
          ],
          actualSets: []
        },
        {
          id: 40,
          name: "Curl araña con mancuerna",
          description: "Apoya el pecho en un banco inclinado. Sostén una mancuerna en cada mano con los brazos colgando. Flexiona los brazos, llevando las mancuernas hacia los hombros. Regresa controladamente a la posición inicial.",
          muscleGroups: ["Bíceps", "Core"],
          category: "Brazos",
          equipment: "Mancuernas",
          rest: "75 seg",
          progress: 0,
          sets: [
            { reps: "10-12", weight: 12 },
            { reps: "10-12", weight: 13 },
            { reps: "10-12", weight: 14 }
          ],
          actualSets: []
        },
        {
          id: 41,
          name: "Fondos en banco con peso",
          description: "Siéntate en el borde de un banco con las manos apoyadas a los lados. Coloca un peso en el regazo. Desliza el cuerpo hacia adelante hasta que las piernas estén extendidas. Flexiona los codos para bajar el cuerpo y luego extiéndelos para volver a subir.",
          muscleGroups: ["Tríceps", "Pectoral inferior"],
          category: "Brazos",
          equipment: "Banco + Peso",
          rest: "75 seg",
          progress: 0,
          sets: [
            { reps: "12", weight: "Peso corporal + 5kg" },
            { reps: "12", weight: "Peso corporal + 7.5kg" },
            { reps: "12", weight: "Peso corporal + 10kg" }
          ],
          actualSets: []
        },
        {
          id: 42,
          name: "Balanceo con mancuerna",
          description: "De pie con los pies separados a la anchura de los hombros. Sostén una mancuerna con ambas manos entre las piernas. Flexiona ligeramente las rodillas y balancea la mancuerna hacia adelante, extendiendo las caderas. Regresa controladamente a la posición inicial.",
          muscleGroups: ["Glúteos", "Isquiotibiales", "Core"],
          category: "Funcional",
          equipment: "Mancuerna",
          rest: "75 seg",
          progress: 0,
          sets: [
            { reps: "12", weight: 20 },
            { reps: "12", weight: 22.5 },
            { reps: "12", weight: 25 }
          ],
          actualSets: []
        }
      ]
    },
    // Fase 3
    {
      id: 7,
      name: "Entrenamiento 1: Cuerpo Completo - Énfasis en Empuje (Fase 3)",
      recommendedDay: "Lunes",
      phase: 3,
      progress: 0,
      exercises: [
        {
          id: 43,
          name: "Prensa de piernas",
          description: "Siéntate en la máquina con la espalda apoyada en el respaldo. Coloca los pies en la plataforma a la anchura de los hombros. Empuja la plataforma extendiendo las piernas y luego regresa controladamente a la posición inicial.",
          muscleGroups: ["Cuádriceps", "Glúteos", "Isquiotibiales"],
          category: "Piernas",
          equipment: "Máquina",
          rest: "120 seg",
          progress: 0,
          sets: [
            { reps: "8-10", weight: 85 },
            { reps: "8-10", weight: 90 },
            { reps: "8-10", weight: 95 }
          ],
          actualSets: []
        },
        {
          id: 44,
          name: "Press de banca",
          description: "Acuéstate en el banco con los pies apoyados en el suelo. Agarra la barra con las manos a una distancia mayor que la anchura de los hombros. Baja la barra hasta rozar el pecho y empuja hacia arriba hasta extender los brazos.",
          muscleGroups: ["Pectoral", "Deltoides", "Tríceps"],
          category: "Pecho",
          equipment: "Barra",
          rest: "120 seg",
          progress: 0,
          sets: [
            { reps: "8-10", weight: 43 },
            { reps: "8-10", weight: 45.5 },
            { reps: "8-10", weight: 48 }
          ],
          actualSets: []
        },
        {
          id: 45,
          name: "Jalón al pecho",
          description: "Siéntate en la máquina con los muslos bajo los soportes. Agarra la barra con las manos a una distancia mayor que la anchura de los hombros. Tira de la barra hacia abajo hasta que toque la parte superior del pecho, manteniendo la espalda recta.",
          muscleGroups: ["Dorsal", "Bíceps", "Romboides"],
          category: "Espalda",
          equipment: "Máquina",
          rest: "120 seg",
          progress: 0,
          sets: [
            { reps: "8-10", weight: 45 },
            { reps: "8-10", weight: 47.5 },
            { reps: "8-10", weight: 50 }
          ],
          actualSets: []
        },
        {
          id: 46,
          name: "Extensión de piernas",
          description: "Siéntate en la máquina con la espalda apoyada en el respaldo. Coloca los tobillos detrás del rodillo acolchado. Extiende las piernas hasta que estén completamente rectas y luego baja controladamente.",
          muscleGroups: ["Cuádriceps"],
          category: "Piernas",
          equipment: "Máquina",
          rest: "90 seg",
          progress: 0,
          sets: [
            { reps: "10", weight: 55 },
            { reps: "10", weight: 57.5 },
            { reps: "10", weight: 60 }
          ],
          actualSets: []
        },
        {
          id: 47,
          name: "Elevaciones laterales",
          description: "De pie con una mancuerna en cada mano, levanta los brazos hacia los lados hasta que estén paralelos al suelo. Mantén los codos ligeramente flexionados y baja controladamente.",
          muscleGroups: ["Deltoides"],
          category: "Hombros",
          equipment: "Mancuernas",
          rest: "75 seg",
          progress: 0,
          sets: [
            { reps: "10-12", weight: 9 },
            { reps: "10-12", weight: 9.5 },
            { reps: "10-12", weight: 10 }
          ],
          actualSets: []
        },
        {
          id: 48,
          name: "Extensión de tríceps",
          description: "De pie frente a la polea, agarra la barra con las manos a la anchura de los hombros. Mantén los codos pegados al cuerpo y extiende los brazos hacia abajo. Regresa controladamente a la posición inicial.",
          muscleGroups: ["Tríceps"],
          category: "Brazos",
          equipment: "Polea",
          rest: "90 seg",
          progress: 0,
          sets: [
            { reps: "10", weight: 27 },
            { reps: "10", weight: 28.5 },
            { reps: "10", weight: 30 }
          ],
          actualSets: []
        },
        {
          id: 49,
          name: "Plancha frontal con rotación",
          description: "Apóyate sobre los antebrazos y las puntas de los pies, manteniendo el cuerpo en línea recta. Gira el torso hacia un lado, llevando un brazo hacia arriba, y luego hacia el otro lado.",
          muscleGroups: ["Core", "Oblicuos", "Estabilizadores"],
          category: "Core",
          equipment: "Peso corporal",
          rest: "60 seg",
          progress: 0,
          sets: [
            { reps: "45 seg", weight: "Peso corporal" },
            { reps: "45 seg", weight: "Peso corporal" },
            { reps: "45 seg", weight: "Peso corporal" }
          ],
          actualSets: []
        },
        {
          id: 50,
          name: "Face Pull",
          description: "De pie frente a la polea alta, agarra la cuerda con las palmas hacia adentro. Tira de la cuerda hacia tu cara, separando las manos y llevando los codos hacia atrás. Mantén la posición por un momento y regresa controladamente.",
          muscleGroups: ["Deltoides posterior", "Romboides", "Trapecio"],
          category: "Hombros",
          equipment: "Polea",
          rest: "60 seg",
          progress: 0,
          sets: [
            { reps: "15", weight: "Peso moderado" },
            { reps: "15", weight: "Peso moderado" },
            { reps: "15", weight: "Peso moderado" }
          ],
          actualSets: []
        }
      ]
    },
    {
      id: 8,
      name: "Entrenamiento 2: Cuerpo Completo - Énfasis en Tracción (Fase 3)",
      recommendedDay: "Miércoles",
      phase: 3,
      progress: 0,
      exercises: [
        {
          id: 51,
          name: "Sentadilla Goblet con mancuerna",
          description: "Sujeta una mancuerna verticalmente contra el pecho, con los codos hacia abajo. Separa los pies a la anchura de los hombros y realiza una sentadilla manteniendo la espalda recta.",
          muscleGroups: ["Cuádriceps", "Glúteos", "Core"],
          category: "Piernas",
          equipment: "Mancuerna",
          rest: "120 seg",
          progress: 0,
          sets: [
            { reps: "8-10", weight: 20 },
            { reps: "8-10", weight: 21 },
            { reps: "8-10", weight: 22 }
          ],
          actualSets: []
        },
        {
          id: 52,
          name: "Remo en máquina",
          description: "Siéntate en la máquina con el pecho apoyado en el respaldo. Agarra las manijas y tira hacia atrás, llevando los codos hacia atrás y apretando los omóplatos. Regresa controladamente a la posición inicial.",
          muscleGroups: ["Dorsal", "Bíceps", "Romboides"],
          category: "Espalda",
          equipment: "Máquina",
          rest: "120 seg",
          progress: 0,
          sets: [
            { reps: "8-10", weight: 50 },
            { reps: "8-10", weight: 52 },
            { reps: "8-10", weight: 54 }
          ],
          actualSets: []
        },
        {
          id: 53,
          name: "Press de hombros con mancuernas",
          description: "Siéntate en un banco con respaldo vertical. Sostén una mancuerna en cada mano a la altura de los hombros, con las palmas hacia adelante. Empuja las mancuernas hacia arriba hasta extender los brazos y luego bájalas controladamente.",
          muscleGroups: ["Deltoides", "Tríceps"],
          category: "Hombros",
          equipment: "Mancuernas",
          rest: "120 seg",
          progress: 0,
          sets: [
            { reps: "8-10", weight: 22 },
            { reps: "8-10", weight: 23 },
            { reps: "8-10", weight: 24 }
          ],
          actualSets: []
        },
        {
          id: 54,
          name: "Curl femoral tumbado",
          description: "Túmbate boca abajo en la máquina con los tobillos debajo del rodillo acolchado. Flexiona las rodillas para llevar los talones hacia los glúteos y luego baja controladamente.",
          muscleGroups: ["Isquiotibiales", "Glúteos"],
          category: "Piernas",
          equipment: "Máquina",
          rest: "90 seg",
          progress: 0,
          sets: [
            { reps: "10", weight: 55 },
            { reps: "10", weight: 57.5 },
            { reps: "10", weight: 60 }
          ],
          actualSets: []
        },
        {
          id: 55,
          name: "Curl de bíceps con polea",
          description: "De pie frente a la polea, agarra la barra con las palmas hacia arriba. Mantén los codos pegados al cuerpo y flexiona los brazos, llevando la barra hacia los hombros. Regresa controladamente a la posición inicial.",
          muscleGroups: ["Bíceps"],
          category: "Brazos",
          equipment: "Polea",
          rest: "90 seg",
          progress: 0,
          sets: [
            { reps: "10", weight: 40 },
            { reps: "10", weight: 41.5 },
            { reps: "10", weight: 43 }
          ],
          actualSets: []
        },
        {
          id: 56,
          name: "Abducción de cadera",
          description: "Siéntate en la máquina con las piernas juntas y las almohadillas contra la parte exterior de los muslos. Separa las piernas hacia afuera contra la resistencia y luego regresa controladamente.",
          muscleGroups: ["Glúteo medio", "Estabilizadores de cadera"],
          category: "Piernas",
          equipment: "Máquina",
          rest: "90 seg",
          progress: 0,
          sets: [
            { reps: "12", weight: 65 },
            { reps: "12", weight: 66.5 },
            { reps: "12", weight: 68 }
          ],
          actualSets: []
        },
        {
          id: 57,
          name: "Russian twist con mancuerna",
          description: "Siéntate en el suelo con las rodillas flexionadas y los pies elevados. Sujeta una mancuerna con ambas manos frente a ti. Gira el torso de un lado a otro, tocando la mancuerna en el suelo a cada lado.",
          muscleGroups: ["Oblicuos", "Core"],
          category: "Core",
          equipment: "Mancuerna",
          rest: "75 seg",
          progress: 0,
          sets: [
            { reps: "12 reps/lado", weight: 12 },
            { reps: "12 reps/lado", weight: 12 },
            { reps: "12 reps/lado", weight: 12 }
          ],
          actualSets: []
        },
        {
          id: 58,
          name: "Reverse Hyperextension",
          description: "Túmbate boca abajo en la máquina con las caderas en el borde del soporte. Sujeta las manijas y mantén las piernas rectas. Eleva las piernas hasta que estén paralelas al suelo y luego baja controladamente.",
          muscleGroups: ["Glúteos", "Isquiotibiales", "Espalda baja"],
          category: "Espalda",
          equipment: "Máquina",
          rest: "60 seg",
          progress: 0,
          sets: [
            { reps: "12", weight: "Peso corporal" },
            { reps: "12", weight: "Peso corporal" },
            { reps: "12", weight: "Peso corporal" }
          ],
          actualSets: []
        }
      ]
    },
    {
      id: 9,
      name: "Entrenamiento 3: Cuerpo Completo - Énfasis en Piernas y Funcional (Fase 3)",
      recommendedDay: "Viernes",
      phase: 3,
      progress: 0,
      exercises: [
        {
          id: 59,
          name: "Sentadilla búlgara con mancuernas",
          description: "De pie frente a un banco, coloca un pie sobre el banco detrás de ti. Sostén una mancuerna en cada mano. Flexiona la rodilla de la pierna delantera hasta que el muslo esté paralelo al suelo. Empuja hacia arriba para volver a la posición inicial.",
          muscleGroups: ["Cuádriceps", "Glúteos", "Isquiotibiales"],
          category: "Piernas",
          equipment: "Mancuernas",
          rest: "120 seg",
          progress: 0,
          sets: [
            { reps: "8 reps/pierna", weight: 15 },
            { reps: "8 reps/pierna", weight: 15.5 },
            { reps: "8 reps/pierna", weight: 16 }
          ],
          actualSets: []
        },
        {
          id: 60,
          name: "Press de banca inclinado con mancuernas",
          description: "Acuéstate en un banco inclinado con una mancuerna en cada mano. Extiende los brazos hacia arriba y luego baja las mancuernas hasta que los codos estén a la altura del pecho. Empuja hacia arriba hasta extender los brazos.",
          muscleGroups: ["Pectoral superior", "Deltoides", "Tríceps"],
          category: "Pecho",
          equipment: "Mancuernas",
          rest: "120 seg",
          progress: 0,
          sets: [
            { reps: "8-10", weight: 20 },
            { reps: "8-10", weight: 21 },
            { reps: "8-10", weight: 22 }
          ],
          actualSets: []
        },
        {
          id: 61,
          name: "Remo inclinado con mancuernas",
          description: "Inclínate hacia adelante con las rodillas ligeramente flexionadas. Sostén una mancuerna en cada mano con los brazos colgando. Tira de las mancuernas hacia arriba, llevando los codos hacia atrás y apretando los omóplatos.",
          muscleGroups: ["Dorsal", "Bíceps", "Romboides"],
          category: "Espalda",
          equipment: "Mancuernas",
          rest: "120 seg",
          progress: 0,
          sets: [
            { reps: "8-10", weight: 20 },
            { reps: "8-10", weight: 20 },
            { reps: "8-10", weight: 20 }
          ],
          actualSets: []
        },
        {
          id: 62,
          name: "Aducción de cadera",
          description: "Siéntate en la máquina con las piernas separadas y las almohadillas contra la parte interior de los muslos. Junta las piernas contra la resistencia y luego regresa controladamente.",
          muscleGroups: ["Aductores", "Estabilizadores de cadera"],
          category: "Piernas",
          equipment: "Máquina",
          rest: "90 seg",
          progress: 0,
          sets: [
            { reps: "10", weight: 65 },
            { reps: "10", weight: 66.5 },
            { reps: "10", weight: 68 }
          ],
          actualSets: []
        },
        {
          id: 63,
          name: "Dumbbell Clean",
          description: "De pie con los pies separados a la anchura de los hombros. Sostén una mancuerna en cada mano. Flexiona las rodillas y caderas, luego extiéndelas explosivamente mientras llevas las mancuernas hacia los hombros.",
          muscleGroups: ["Cuádriceps", "Glúteos", "Hombros"],
          category: "Funcional",
          equipment: "Mancuernas",
          rest: "90 seg",
          progress: 0,
          sets: [
            { reps: "8 reps/lado", weight: 14 },
            { reps: "8 reps/lado", weight: 15 },
            { reps: "8 reps/lado", weight: 16 }
          ],
          actualSets: []
        },
        {
          id: 64,
          name: "Extensión de tríceps con mancuerna sobre cabeza",
          description: "De pie o sentado, sostén una mancuerna con ambas manos por encima de la cabeza. Flexiona los codos para bajar la mancuerna detrás de la cabeza y luego extiéndelos para volver a la posición inicial.",
          muscleGroups: ["Tríceps"],
          category: "Brazos",
          equipment: "Mancuerna",
          rest: "75 seg",
          progress: 0,
          sets: [
            { reps: "10", weight: 10 },
            { reps: "10", weight: 11 },
            { reps: "10", weight: 12 }
          ],
          actualSets: []
        },
        {
          id: 65,
          name: "Balanceo con mancuerna",
          description: "De pie con los pies separados a la anchura de los hombros. Sostén una mancuerna con ambas manos entre las piernas. Flexiona ligeramente las rodillas y balancea la mancuerna hacia adelante, extendiendo las caderas. Regresa controladamente a la posición inicial.",
          muscleGroups: ["Glúteos", "Isquiotibiales", "Core"],
          category: "Funcional",
          equipment: "Mancuerna",
          rest: "90 seg",
          progress: 0,
          sets: [
            { reps: "10", weight: 25 },
            { reps: "10", weight: 27.5 },
            { reps: "10", weight: 30 }
          ],
          actualSets: []
        }
      ]
    }
];

// Estructura para almacenar los registros de entrenamiento
export const emptyWorkoutLog = {
  logs: []
};
