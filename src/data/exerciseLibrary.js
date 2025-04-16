const exerciseLibrary = [
  {
    id: 1,
    name: "Prensa de piernas",
    description: "Siéntate en la máquina con la espalda apoyada en el respaldo. Coloca los pies en la plataforma a la anchura de los hombros. Empuja la plataforma extendiendo las piernas y luego regresa controladamente a la posición inicial.",
    muscleGroups: ["Cuádriceps", "Glúteos", "Isquiotibiales"],
    category: "Piernas",
    equipment: "Máquina",
    steps: [
      "Siéntate en la máquina con la espalda completamente apoyada en el respaldo",
      "Coloca los pies en la plataforma a la anchura de los hombros",
      "Desbloquea los seguros de la máquina",
      "Empuja la plataforma extendiendo las piernas (sin bloquear las rodillas)",
      "Regresa controladamente a la posición inicial doblando las rodillas",
      "Repite el movimiento manteniendo la tensión en las piernas"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/leg-press-machine.gif",
    videoUrl: "https://www.youtube.com/watch?v=IZxyjW7MPJQ"
  },
  {
    id: 2,
    name: "Sentadilla Goblet con mancuerna",
    description: "Sujeta una mancuerna verticalmente contra el pecho, con los codos hacia abajo. Separa los pies a la anchura de los hombros y realiza una sentadilla manteniendo la espalda recta.",
    muscleGroups: ["Cuádriceps", "Glúteos", "Core"],
    category: "Piernas",
    equipment: "Mancuerna",
    steps: [
      "Sujeta una mancuerna verticalmente contra el pecho con ambas manos",
      "Mantén los codos apuntando hacia abajo",
      "Separa los pies a la anchura de los hombros",
      "Realiza una sentadilla bajando las caderas como si fueras a sentarte",
      "Mantén la espalda recta y el pecho elevado",
      "Empuja a través de los talones para volver a la posición inicial"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/04/dumbbell-goblet-squat.gif",
    videoUrl: "https://www.youtube.com/watch?v=MeIiIdhvXT4"
  },
  {
    id: 3,
    name: "Extensión de piernas",
    description: "Siéntate en la máquina con la espalda apoyada en el respaldo. Coloca los tobillos detrás del rodillo acolchado. Extiende las piernas hasta que estén completamente rectas y luego baja controladamente.",
    muscleGroups: ["Cuádriceps"],
    category: "Piernas",
    equipment: "Máquina",
    steps: [
      "Siéntate en la máquina con la espalda apoyada en el respaldo",
      "Ajusta el rodillo acolchado para que quede justo encima de los tobillos",
      "Agarra los mangos laterales para estabilizarte",
      "Extiende las piernas hasta que estén completamente rectas",
      "Haz una pausa en la posición superior",
      "Baja controladamente a la posición inicial"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/03/leg-extension.gif",
    videoUrl: "https://www.youtube.com/watch?v=YyvSfVjQeL0"
  },
  {
    id: 4,
    name: "Curl femoral tumbado",
    description: "Túmbate boca abajo en la máquina con los tobillos debajo del rodillo acolchado. Flexiona las piernas llevando los talones hacia los glúteos y luego baja controladamente.",
    muscleGroups: ["Isquiotibiales", "Glúteos"],
    category: "Piernas",
    equipment: "Máquina",
    steps: [
      "Túmbate boca abajo en la máquina",
      "Coloca los tobillos debajo del rodillo acolchado",
      "Agarra los mangos para estabilizarte",
      "Flexiona las piernas llevando los talones hacia los glúteos",
      "Haz una pausa en la posición contraída",
      "Baja controladamente a la posición inicial"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/lying-leg-curl.gif",
    videoUrl: "https://www.youtube.com/watch?v=1Tq3QdYUuHs"
  },
  {
    id: 5,
    name: "Plancha frontal",
    description: "Apóyate sobre los antebrazos y las puntas de los pies, manteniendo el cuerpo en línea recta desde la cabeza hasta los talones. Mantén la posición contrayendo el core.",
    muscleGroups: ["Core", "Abdominales", "Estabilizadores"],
    category: "Core",
    equipment: "Peso corporal",
    steps: [
      "Colócate boca abajo con los antebrazos apoyados en el suelo",
      "Eleva el cuerpo apoyándote solo en los antebrazos y las puntas de los pies",
      "Mantén el cuerpo en línea recta desde la cabeza hasta los talones",
      "Contrae el abdomen y los glúteos",
      "Mantén la posición respirando normalmente",
      "No dejes que las caderas se hundan o se eleven"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/plank.gif",
    videoUrl: "https://www.youtube.com/watch?v=pSHjTRCQxIw"
  },
  {
    id: 6,
    name: "Russian twist con mancuerna",
    description: "Siéntate en el suelo con las rodillas flexionadas y los pies elevados. Sujeta una mancuerna con ambas manos y gira el torso de lado a lado manteniendo el core contraído.",
    muscleGroups: ["Oblicuos", "Core"],
    category: "Core",
    equipment: "Mancuerna",
    steps: [
      "Siéntate en el suelo con las rodillas flexionadas",
      "Eleva los pies del suelo (opcional)",
      "Sujeta una mancuerna con ambas manos frente a ti",
      "Inclina ligeramente el torso hacia atrás",
      "Gira el torso hacia la derecha, llevando la mancuerna hacia ese lado",
      "Gira hacia el lado opuesto en un movimiento controlado",
      "Continúa alternando lados manteniendo el core contraído"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/russian-twist.gif",
    videoUrl: "https://www.youtube.com/watch?v=NeAtimSCxsY"
  },
  {
    id: 7,
    name: "Jalón al pecho",
    description: "Siéntate en la máquina y agarra la barra con las manos más anchas que los hombros. Tira de la barra hacia abajo hasta que toque la parte superior del pecho, luego regresa controladamente.",
    muscleGroups: ["Dorsal", "Bíceps", "Romboides"],
    category: "Espalda",
    equipment: "Máquina",
    steps: [
      "Siéntate en la máquina con los muslos asegurados bajo los cojines",
      "Agarra la barra con un agarre más ancho que los hombros",
      "Inclina ligeramente el torso hacia atrás",
      "Tira de la barra hacia abajo hasta que toque la parte superior del pecho",
      "Aprieta los músculos de la espalda en la posición inferior",
      "Regresa controladamente a la posición inicial"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/lat-pulldown.gif",
    videoUrl: "https://www.youtube.com/watch?v=CAwf7n6Luuc"
  },
  {
    id: 8,
    name: "Curl de bíceps con polea",
    description: "De pie frente a una máquina de poleas bajas, agarra el maneral con las palmas hacia arriba. Flexiona los codos para llevar el maneral hacia los hombros, manteniendo los codos pegados al cuerpo.",
    muscleGroups: ["Bíceps"],
    category: "Brazos",
    equipment: "Polea",
    steps: [
      "Colócate de pie frente a una máquina de poleas bajas",
      "Agarra el maneral con las palmas hacia arriba",
      "Mantén los codos pegados a los costados",
      "Flexiona los codos para llevar el maneral hacia los hombros",
      "Aprieta los bíceps en la posición superior",
      "Baja controladamente a la posición inicial"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/cable-bicep-curl.gif",
    videoUrl: "https://www.youtube.com/watch?v=AsAVbj7puKo"
  },
  {
    id: 9,
    name: "Press de banca",
    description: "Acuéstate en un banco plano con los pies apoyados en el suelo. Agarra la barra con las manos más anchas que los hombros. Baja la barra hasta el pecho y luego empuja hacia arriba hasta extender los brazos.",
    muscleGroups: ["Pectoral", "Tríceps", "Deltoides"],
    category: "Pecho",
    equipment: "Barra",
    steps: [
      "Acuéstate en un banco plano con los pies apoyados firmemente en el suelo",
      "Agarra la barra con un agarre más ancho que los hombros",
      "Desenganche la barra del soporte",
      "Baja la barra controladamente hasta que toque ligeramente el pecho",
      "Empuja la barra hacia arriba hasta extender completamente los brazos",
      "Repite el movimiento manteniendo los hombros hacia atrás y abajo"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/bench-press.gif"
  },
  {
    id: 10,
    name: "Elevaciones laterales",
    description: "De pie con una mancuerna en cada mano a los lados del cuerpo. Eleva los brazos hacia los lados hasta que estén paralelos al suelo, manteniendo los codos ligeramente flexionados.",
    muscleGroups: ["Deltoides", "Hombros"],
    category: "Hombros",
    equipment: "Mancuernas",
    steps: [
      "Ponte de pie con una mancuerna en cada mano a los lados del cuerpo",
      "Mantén una ligera flexión en los codos",
      "Eleva los brazos hacia los lados hasta que estén paralelos al suelo",
      "Mantén las muñecas en posición neutral (pulgares ligeramente más altos que los meñiques)",
      "Haz una breve pausa en la posición superior",
      "Baja controladamente a la posición inicial"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/dumbbell-lateral-raise.gif"
  },
  {
    id: 11,
    name: "Zancadas",
    description: "Da un paso hacia adelante con una pierna y baja el cuerpo hasta que ambas rodillas formen un ángulo de 90 grados. Empuja con el pie delantero para volver a la posición inicial.",
    muscleGroups: ["Cuádriceps", "Glúteos", "Isquiotibiales"],
    category: "Piernas",
    equipment: "Peso corporal",
    steps: [
      "Ponte de pie con los pies juntos",
      "Da un paso hacia adelante con una pierna",
      "Baja el cuerpo hasta que ambas rodillas formen un ángulo de 90 grados",
      "La rodilla trasera debe quedar cerca del suelo sin tocarlo",
      "Empuja con el pie delantero para volver a la posición inicial",
      "Repite con la otra pierna"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/walking-lunge.gif"
  },
  {
    id: 12,
    name: "Peso muerto",
    description: "Con los pies a la anchura de las caderas, flexiona las caderas y las rodillas para agarrar la barra. Mantén la espalda recta y levanta la barra extendiendo las caderas y las rodillas.",
    muscleGroups: ["Isquiotibiales", "Glúteos", "Espalda baja", "Trapecios"],
    category: "Espalda",
    equipment: "Barra",
    steps: [
      "Colócate con los pies a la anchura de las caderas",
      "Flexiona las caderas y las rodillas para agarrar la barra",
      "Agarra la barra con las manos a la anchura de los hombros",
      "Mantén la espalda recta y el pecho elevado",
      "Levanta la barra extendiendo las caderas y las rodillas",
      "En la posición superior, aprieta los glúteos",
      "Baja la barra controladamente manteniendo la espalda recta"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/barbell-deadlift.gif"
  },
  {
    id: 13,
    name: "Fondos en paralelas",
    description: "Sujétate en las barras paralelas con los brazos extendidos. Baja el cuerpo flexionando los codos hasta que los hombros estén a la altura de los codos, luego empuja hacia arriba.",
    muscleGroups: ["Tríceps", "Pectoral", "Hombros"],
    category: "Brazos",
    equipment: "Barras paralelas",
    steps: [
      "Sujétate en las barras paralelas con los brazos completamente extendidos",
      "Inclina ligeramente el torso hacia adelante para trabajar más el pecho (o mantente vertical para enfocarte en los tríceps)",
      "Baja el cuerpo flexionando los codos hasta que los hombros estén a la altura de los codos",
      "Mantén los codos cerca del cuerpo",
      "Empuja hacia arriba hasta extender completamente los brazos",
      "Repite el movimiento manteniendo el control"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/dips.gif"
  },
  {
    id: 14,
    name: "Dominadas",
    description: "Cuelga de una barra con los brazos extendidos y las palmas hacia adelante. Tira del cuerpo hacia arriba hasta que la barbilla supere la barra, luego baja controladamente.",
    muscleGroups: ["Dorsal", "Bíceps", "Antebrazos"],
    category: "Espalda",
    equipment: "Barra de dominadas",
    steps: [
      "Cuelga de una barra con los brazos completamente extendidos",
      "Agarra la barra con las palmas hacia adelante (agarre prono)",
      "Tira del cuerpo hacia arriba contrayendo la espalda",
      "Continúa hasta que la barbilla supere la barra",
      "Baja controladamente a la posición inicial",
      "Repite el movimiento manteniendo la tensión en la espalda"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/pull-up.gif"
  },
  {
    id: 15,
    name: "Abdominales en máquina",
    description: "Siéntate en la máquina de abdominales con los pies asegurados. Sujeta las asas y flexiona el torso hacia adelante, luego regresa controladamente a la posición inicial.",
    muscleGroups: ["Abdominales", "Core"],
    category: "Core",
    equipment: "Máquina",
    steps: [
      "Siéntate en la máquina de abdominales con los pies asegurados",
      "Ajusta el peso adecuado",
      "Sujeta las asas o coloca las manos en el pecho",
      "Flexiona el torso hacia adelante contrayendo los abdominales",
      "Haz una pausa en la posición contraída",
      "Regresa controladamente a la posición inicial"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/machine-crunch.gif"
  },
  {
    id: 16,
    name: "Hip Thrust",
    description: "Siéntate en el suelo con la espalda apoyada en un banco y una barra sobre las caderas. Empuja con los talones para elevar las caderas hasta que el cuerpo forme una línea recta desde los hombros hasta las rodillas.",
    muscleGroups: ["Glúteos", "Isquiotibiales", "Espalda baja"],
    category: "Glúteos",
    equipment: "Barra y banco",
    steps: [
      "Siéntate en el suelo con la espalda apoyada en un banco",
      "Coloca una barra acolchada sobre las caderas",
      "Coloca los pies en el suelo a la anchura de las caderas",
      "Empuja con los talones para elevar las caderas",
      "En la posición superior, tu cuerpo debe formar una línea recta desde los hombros hasta las rodillas",
      "Aprieta los glúteos en la posición superior",
      "Baja controladamente a la posición inicial"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/barbell-hip-thrust.gif"
  },
  {
    id: 17,
    name: "Remo con barra",
    description: "Inclínate hacia adelante con la espalda recta y agarra una barra con las manos. Tira de la barra hacia el abdomen manteniendo los codos cerca del cuerpo, luego baja controladamente.",
    muscleGroups: ["Dorsal", "Romboides", "Bíceps", "Trapecios"],
    category: "Espalda",
    equipment: "Barra",
    steps: [
      "Inclínate hacia adelante con las rodillas ligeramente flexionadas",
      "Mantén la espalda recta y el pecho elevado",
      "Agarra la barra con las manos a la anchura de los hombros",
      "Tira de la barra hacia el abdomen manteniendo los codos cerca del cuerpo",
      "Aprieta los omóplatos juntos en la posición contraída",
      "Baja controladamente a la posición inicial"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/barbell-row.gif"
  },
  {
    id: 18,
    name: "Press militar",
    description: "De pie con una barra a la altura de los hombros, empuja la barra hacia arriba hasta extender completamente los brazos. Luego, baja controladamente a la posición inicial.",
    muscleGroups: ["Deltoides", "Tríceps", "Trapecio"],
    category: "Hombros",
    equipment: "Barra",
    steps: [
      "Ponte de pie con los pies a la anchura de las caderas",
      "Agarra la barra con un agarre ligeramente más ancho que los hombros",
      "Coloca la barra a la altura de los hombros, frente al cuello",
      "Empuja la barra hacia arriba hasta extender completamente los brazos",
      "Haz una breve pausa en la posición superior",
      "Baja controladamente a la posición inicial"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/overhead-press.gif"
  },
  {
    id: 19,
    name: "Extensiones de tríceps con polea",
    description: "De pie frente a una máquina de poleas altas, agarra el maneral con ambas manos. Mantén los codos cerca de la cabeza y extiende los brazos hacia abajo, luego regresa controladamente.",
    muscleGroups: ["Tríceps"],
    category: "Brazos",
    equipment: "Polea",
    steps: [
      "Colócate de pie frente a una máquina de poleas altas",
      "Agarra el maneral con ambas manos",
      "Mantén los codos cerca de la cabeza y los brazos superiores inmóviles",
      "Extiende los antebrazos hacia abajo hasta que los brazos estén completamente rectos",
      "Haz una pausa en la posición contraída",
      "Regresa controladamente a la posición inicial"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/triceps-pushdown.gif"
  },
  {
    id: 20,
    name: "Elevaciones de pantorrillas",
    description: "De pie con los pies apoyados en el borde de una plataforma o step, eleva los talones lo más alto posible, luego baja controladamente hasta sentir un estiramiento en las pantorrillas.",
    muscleGroups: ["Gemelos", "Sóleo"],
    category: "Piernas",
    equipment: "Plataforma o step",
    steps: [
      "Colócate de pie con la punta de los pies apoyada en el borde de una plataforma o step",
      "Deja que los talones cuelguen por debajo del nivel de la plataforma",
      "Mantén las piernas rectas (o ligeramente flexionadas)",
      "Eleva los talones lo más alto posible contrayendo las pantorrillas",
      "Haz una pausa en la posición superior",
      "Baja controladamente hasta sentir un estiramiento en las pantorrillas"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/standing-calf-raise.gif"
  },
  {
    id: 11,
    name: "Press de banca",
    description: "Acúéstate en el banco con los pies apoyados en el suelo. Agarra la barra con las manos a una distancia mayor que la anchura de los hombros. Baja la barra hasta rozar el pecho y empuja hacia arriba hasta extender los brazos.",
    muscleGroups: ["Pectoral", "Deltoides", "Tríceps"],
    category: "Pecho",
    equipment: "Barra",
    steps: [
      "Acúéstate en el banco con los pies firmemente apoyados en el suelo",
      "Agarra la barra con las manos a una distancia mayor que la anchura de los hombros",
      "Desbloquea la barra del soporte y manténla sobre tu pecho con los brazos extendidos",
      "Baja la barra controladamente hasta que roce ligeramente el pecho",
      "Empuja la barra hacia arriba hasta extender completamente los brazos",
      "Mantén los hombros hacia atrás y abajo durante todo el movimiento"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/barbell-bench-press.gif",
    videoUrl: "https://www.youtube.com/watch?v=rT7DgCr-3pg"
  },
  {
    id: 12,
    name: "Jalón al pecho",
    description: "Siéntate en la máquina con los muslos bajo los soportes. Agarra la barra con las manos a una distancia mayor que la anchura de los hombros. Tira de la barra hacia abajo hasta que toque la parte superior del pecho, manteniendo la espalda recta.",
    muscleGroups: ["Dorsal", "Bíceps", "Romboides"],
    category: "Espalda",
    equipment: "Máquina",
    steps: [
      "Siéntate en la máquina con los muslos asegurados bajo los soportes",
      "Agarra la barra con las manos a una distancia mayor que la anchura de los hombros",
      "Mantén la espalda recta y el pecho elevado",
      "Tira de la barra hacia abajo hasta que toque la parte superior del pecho",
      "Aprieta los omóplatos juntos en la posición inferior",
      "Regresa controladamente a la posición inicial con los brazos extendidos"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/lat-pulldown.gif",
    videoUrl: "https://www.youtube.com/watch?v=CAwf7n6Luuc"
  },
  {
    id: 13,
    name: "Elevaciones laterales",
    description: "De pie con una mancuerna en cada mano, levanta los brazos hacia los lados hasta que estén paralelos al suelo. Mantén los codos ligeramente flexionados y baja controladamente.",
    muscleGroups: ["Deltoides"],
    category: "Hombros",
    equipment: "Mancuernas",
    steps: [
      "De pie con los pies separados a la anchura de los hombros",
      "Sujeta una mancuerna en cada mano a los lados del cuerpo",
      "Mantén los codos ligeramente flexionados",
      "Levanta los brazos hacia los lados hasta que estén paralelos al suelo",
      "Haz una breve pausa en la posición superior",
      "Baja controladamente a la posición inicial"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/dumbbell-lateral-raise.gif",
    videoUrl: "https://www.youtube.com/watch?v=3VcKaXpzqRo"
  },
  {
    id: 14,
    name: "Extensión de tríceps",
    description: "De pie frente a la polea, agarra la barra con las manos a la anchura de los hombros. Mantén los codos pegados al cuerpo y extiende los brazos hacia abajo. Regresa controladamente a la posición inicial.",
    muscleGroups: ["Tríceps"],
    category: "Brazos",
    equipment: "Polea",
    steps: [
      "De pie frente a la polea alta, agarra la barra con las manos a la anchura de los hombros",
      "Mantén los codos pegados a los lados del cuerpo",
      "Comienza con los antebrazos paralelos al suelo",
      "Extiende los brazos hacia abajo, manteniendo los codos fijos",
      "Haz una pausa en la posición de extensión completa",
      "Regresa controladamente a la posición inicial"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/triceps-pushdown.gif",
    videoUrl: "https://www.youtube.com/watch?v=2-LAMcpzODU"
  },
  {
    id: 15,
    name: "Plancha frontal",
    description: "Apóyate sobre los antebrazos y las puntas de los pies, manteniendo el cuerpo en línea recta. Mantén la posición contrayendo el core.",
    muscleGroups: ["Core", "Abdominales"],
    category: "Core",
    equipment: "Peso corporal",
    steps: [
      "Apóyate sobre los antebrazos con los codos directamente debajo de los hombros",
      "Extiende las piernas hacia atrás, apoyándote sobre las puntas de los pies",
      "Mantén el cuerpo en una línea recta desde la cabeza hasta los talones",
      "Contrae el core y los glúteos",
      "Mantén la posición durante el tiempo indicado",
      "Respira normalmente durante el ejercicio"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/plank.gif",
    videoUrl: "https://www.youtube.com/watch?v=pSHjTRCQxIw"
  },
  {
    id: 16,
    name: "Remo en máquina",
    description: "Siéntate en la máquina con el pecho apoyado en el respaldo. Agarra las manijas y tira hacia atrás, llevando los codos hacia atrás y apretando los omóplatos. Regresa controladamente a la posición inicial.",
    muscleGroups: ["Dorsal", "Bíceps", "Romboides"],
    category: "Espalda",
    equipment: "Máquina",
    steps: [
      "Siéntate en la máquina con el pecho apoyado firmemente en el respaldo",
      "Agarra las manijas con los brazos extendidos",
      "Tira de las manijas hacia atrás, llevando los codos hacia atrás",
      "Aprieta los omóplatos juntos en la posición contraída",
      "Haz una breve pausa en la posición de máxima contracción",
      "Regresa controladamente a la posición inicial"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/seated-cable-row.gif",
    videoUrl: "https://www.youtube.com/watch?v=GZbfZ033f74"
  },
  {
    id: 17,
    name: "Press de hombros con mancuernas",
    description: "Siéntate en un banco con respaldo vertical. Sostén una mancuerna en cada mano a la altura de los hombros, con las palmas hacia adelante. Empuja las mancuernas hacia arriba hasta extender los brazos y luego bájalas controladamente.",
    muscleGroups: ["Deltoides", "Tríceps"],
    category: "Hombros",
    equipment: "Mancuernas",
    steps: [
      "Siéntate en un banco con respaldo vertical",
      "Sostén una mancuerna en cada mano a la altura de los hombros",
      "Gira las palmas hacia adelante",
      "Empuja las mancuernas hacia arriba hasta extender completamente los brazos",
      "Haz una breve pausa en la posición superior",
      "Baja las mancuernas controladamente a la posición inicial"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/dumbbell-shoulder-press.gif",
    videoUrl: "https://www.youtube.com/watch?v=qEwKCR5JCog"
  },
  {
    id: 18,
    name: "Curl femoral tumbado",
    description: "Túmbate boca abajo en la máquina con los tobillos debajo del rodillo acolchado. Flexiona las rodillas para llevar los talones hacia los glúteos y luego baja controladamente.",
    muscleGroups: ["Isquiotibiales", "Glúteos"],
    category: "Piernas",
    equipment: "Máquina",
    steps: [
      "Túmbate boca abajo en la máquina",
      "Coloca los tobillos debajo del rodillo acolchado",
      "Agarra los mangos laterales para estabilizarte",
      "Flexiona las rodillas para llevar los talones hacia los glúteos",
      "Haz una pausa en la posición contraída",
      "Baja controladamente a la posición inicial"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/lying-leg-curl.gif",
    videoUrl: "https://www.youtube.com/watch?v=1Tq3QdYUuHs"
  },
  {
    id: 19,
    name: "Curl de bíceps con polea",
    description: "De pie frente a la polea, agarra la barra con las palmas hacia arriba. Mantén los codos pegados al cuerpo y flexiona los brazos, llevando la barra hacia los hombros. Regresa controladamente a la posición inicial.",
    muscleGroups: ["Bíceps"],
    category: "Brazos",
    equipment: "Polea",
    steps: [
      "De pie frente a la polea baja, agarra la barra con las palmas hacia arriba",
      "Mantén los codos pegados a los lados del cuerpo",
      "Mantén la espalda recta y los hombros hacia atrás",
      "Flexiona los brazos, llevando la barra hacia los hombros",
      "Aprieta los bíceps en la posición superior",
      "Baja controladamente a la posición inicial"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/cable-bicep-curl.gif",
    videoUrl: "https://www.youtube.com/watch?v=AsAVbj7puKo"
  },
  {
    id: 20,
    name: "Abducción de cadera",
    description: "Siéntate en la máquina con las piernas juntas y las almohadillas contra la parte exterior de los muslos. Separa las piernas hacia afuera contra la resistencia y luego regresa controladamente.",
    muscleGroups: ["Glúteo medio", "Estabilizadores de cadera"],
    category: "Piernas",
    equipment: "Máquina",
    steps: [
      "Siéntate en la máquina con las piernas juntas",
      "Coloca las almohadillas contra la parte exterior de los muslos",
      "Agarra los mangos laterales para estabilizarte",
      "Separa las piernas hacia afuera contra la resistencia",
      "Haz una pausa en la posición de máxima apertura",
      "Regresa controladamente a la posición inicial"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/hip-abduction-machine.gif",
    videoUrl: "https://www.youtube.com/watch?v=8bnDCHpSVkI"
  },
  {
    id: 21,
    name: "Russian twist con mancuerna",
    description: "Siéntate en el suelo con las rodillas flexionadas y los pies elevados. Sujeta una mancuerna con ambas manos frente a ti. Gira el torso de un lado a otro, tocando la mancuerna en el suelo a cada lado.",
    muscleGroups: ["Oblicuos", "Core"],
    category: "Core",
    equipment: "Mancuerna",
    steps: [
      "Siéntate en el suelo con las rodillas flexionadas",
      "Eleva los pies ligeramente del suelo",
      "Sujeta una mancuerna con ambas manos frente a ti",
      "Inclina el torso ligeramente hacia atrás",
      "Gira el torso hacia la derecha, tocando la mancuerna cerca del suelo",
      "Gira hacia la izquierda, tocando la mancuerna cerca del suelo al otro lado",
      "Continúa alternando de lado a lado"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/russian-twist.gif",
    videoUrl: "https://www.youtube.com/watch?v=NeAtimSCxsY"
  },
  {
    id: 22,
    name: "Sentadilla búlgara con mancuernas",
    description: "De pie frente a un banco, coloca un pie sobre el banco detrás de ti. Sostén una mancuerna en cada mano. Flexiona la rodilla de la pierna delantera hasta que el muslo esté paralelo al suelo. Empuja hacia arriba para volver a la posición inicial.",
    muscleGroups: ["Cuádriceps", "Glúteos", "Isquiotibiales"],
    category: "Piernas",
    equipment: "Mancuernas",
    steps: [
      "De pie frente a un banco, coloca un pie sobre el banco detrás de ti",
      "Sostén una mancuerna en cada mano a los lados del cuerpo",
      "Mantén la espalda recta y el pecho elevado",
      "Flexiona la rodilla de la pierna delantera hasta que el muslo esté paralelo al suelo",
      "Empuja a través del talón de la pierna delantera para volver a la posición inicial",
      "Completa todas las repeticiones con una pierna antes de cambiar a la otra"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/dumbbell-bulgarian-split-squat.gif",
    videoUrl: "https://www.youtube.com/watch?v=2C-uNgKwPLE"
  },
  {
    id: 23,
    name: "Press de banca con mancuernas",
    description: "Acúéstate en un banco plano con una mancuerna en cada mano. Extiende los brazos hacia arriba y luego baja las mancuernas hasta que los codos estén a la altura del pecho. Empuja hacia arriba hasta extender los brazos.",
    muscleGroups: ["Pectoral", "Deltoides", "Tríceps"],
    category: "Pecho",
    equipment: "Mancuernas",
    steps: [
      "Acúéstate en un banco plano con los pies apoyados en el suelo",
      "Sostén una mancuerna en cada mano a la altura del pecho",
      "Empuja las mancuernas hacia arriba hasta que los brazos estén completamente extendidos",
      "Mantén las mancuernas alineadas con la parte media del pecho",
      "Baja las mancuernas controladamente hasta que los codos estén a la altura del pecho",
      "Empuja nuevamente hacia arriba para repetir el movimiento"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/dumbbell-bench-press.gif",
    videoUrl: "https://www.youtube.com/watch?v=QsYre__-aro"
  },
  {
    id: 24,
    name: "Remo inclinado con mancuernas",
    description: "Inclínate hacia adelante con las rodillas ligeramente flexionadas. Sostén una mancuerna en cada mano con los brazos colgando. Tira de las mancuernas hacia arriba, llevando los codos hacia atrás y apretando los omóplatos.",
    muscleGroups: ["Dorsal", "Bíceps", "Romboides"],
    category: "Espalda",
    equipment: "Mancuernas",
    steps: [
      "Inclínate hacia adelante desde la cadera con las rodillas ligeramente flexionadas",
      "Mantén la espalda recta y el pecho hacia adelante",
      "Sostén una mancuerna en cada mano con los brazos completamente extendidos",
      "Tira de las mancuernas hacia arriba, llevando los codos hacia atrás",
      "Aprieta los omóplatos juntos en la posición superior",
      "Baja las mancuernas controladamente a la posición inicial"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/bent-over-dumbbell-row.gif",
    videoUrl: "https://www.youtube.com/watch?v=roCP3wJY5xI"
  },
  {
    id: 25,
    name: "Aducción de cadera",
    description: "Siéntate en la máquina con las piernas separadas y las almohadillas contra la parte interior de los muslos. Junta las piernas contra la resistencia y luego regresa controladamente.",
    muscleGroups: ["Aductores", "Estabilizadores de cadera"],
    category: "Piernas",
    equipment: "Máquina",
    steps: [
      "Siéntate en la máquina con las piernas separadas",
      "Coloca las almohadillas contra la parte interior de los muslos",
      "Agarra los mangos laterales para estabilizarte",
      "Junta las piernas contra la resistencia",
      "Haz una pausa en la posición de máxima contracción",
      "Regresa controladamente a la posición inicial"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/hip-adduction-machine.gif",
    videoUrl: "https://www.youtube.com/watch?v=dBQ1WuQvY9o"
  },
  {
    id: 26,
    name: "Curl araña con mancuerna",
    description: "Apoya el pecho en un banco inclinado. Sostén una mancuerna en cada mano con los brazos colgando. Flexiona los brazos, llevando las mancuernas hacia los hombros. Regresa controladamente a la posición inicial.",
    muscleGroups: ["Bíceps", "Core"],
    category: "Brazos",
    equipment: "Mancuernas",
    steps: [
      "Apoya el pecho en un banco inclinado a 45 grados",
      "Sostén una mancuerna en cada mano con los brazos completamente extendidos",
      "Mantén los codos fijos y cerca del cuerpo",
      "Flexiona los brazos, llevando las mancuernas hacia los hombros",
      "Aprieta los bíceps en la posición superior",
      "Baja las mancuernas controladamente a la posición inicial"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/incline-dumbbell-curl.gif",
    videoUrl: "https://www.youtube.com/watch?v=soxrZlIl35U"
  },
  {
    id: 27,
    name: "Fondos en banco",
    description: "Siéntate en el borde de un banco con las manos apoyadas a los lados. Desliza el cuerpo hacia adelante hasta que las piernas estén extendidas y el peso recaiga sobre las manos. Flexiona los codos para bajar el cuerpo y luego extiéndelos para volver a subir.",
    muscleGroups: ["Tríceps", "Pectoral inferior"],
    category: "Brazos",
    equipment: "Banco",
    steps: [
      "Siéntate en el borde de un banco con las manos apoyadas a los lados",
      "Desliza el cuerpo hacia adelante hasta que las piernas estén extendidas",
      "Mantén los hombros hacia abajo y lejos de las orejas",
      "Flexiona los codos para bajar el cuerpo hacia el suelo",
      "Detente cuando los codos formen un ángulo de 90 grados",
      "Empuja a través de las palmas para extender los codos y volver a subir"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/bench-dips.gif",
    videoUrl: "https://www.youtube.com/watch?v=c3ZGl4pAwZ4"
  },
  {
    id: 28,
    name: "Balanceo con mancuerna",
    description: "De pie con los pies separados a la anchura de los hombros. Sostén una mancuerna con ambas manos entre las piernas. Flexiona ligeramente las rodillas y balancea la mancuerna hacia adelante, extendiendo las caderas. Regresa controladamente a la posición inicial.",
    muscleGroups: ["Glúteos", "Isquiotibiales", "Core"],
    category: "Funcional",
    equipment: "Mancuerna",
    steps: [
      "De pie con los pies separados a la anchura de los hombros",
      "Sostén una mancuerna con ambas manos entre las piernas",
      "Flexiona ligeramente las rodillas y dobla la cadera hacia adelante",
      "Balancea la mancuerna entre las piernas",
      "Impulsa con las caderas para llevar la mancuerna hacia adelante y arriba",
      "Aprieta los glúteos en la posición superior",
      "Permite que la mancuerna baje controladamente para repetir el movimiento"
    ],
    gifUrl: "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/dumbbell-swing.gif",
    videoUrl: "https://www.youtube.com/watch?v=mKDIuUbH3nk"
  }
];

export default exerciseLibrary;
