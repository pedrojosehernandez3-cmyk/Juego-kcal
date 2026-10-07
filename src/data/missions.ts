export interface NutritionMission {
  id: string;
  title: string;
  titleEs: string;
  icon: string;
  badge: string;
  badgeEs: string;
  energyTarget: number; // fictional game points
  description: string;
  descriptionEs: string;
  priorities: string[];
  prioritiesEs: string[];
  focusHint: string;
  focusHintEs: string;
  recommendedItemsCount: { min: number; max: number };
}

export const NUTRITION_MISSIONS: NutritionMission[] = [
  {
    id: 'football_player',
    title: 'FOOTBALL PLAYER',
    titleEs: 'FUTBOLISTA',
    icon: '⚽',
    badge: 'Match Day Stamina',
    badgeEs: 'Resistencia en Partido',
    energyTarget: 2800,
    description: 'Build a balanced day for a football player preparing for training and a match.',
    descriptionEs: 'Construye un día equilibrado para un futbolista que prepara su entrenamiento y partido.',
    priorities: ['Carbohydrates', 'Lean Protein', 'Fruit & Vegetables', 'Hydration'],
    prioritiesEs: ['Carbohidratos', 'Proteínas Magras', 'Fruta y Verdura', 'Hidratación'],
    focusHint: 'Needs high sustained energy: prioritize whole carbs, plenty of fresh water and muscle-repairing proteins.',
    focusHintEs: 'Necesita energía duradera: prioriza carbohidratos saludables, abundante agua y proteínas para los músculos.',
    recommendedItemsCount: { min: 8, max: 14 }
  },
  {
    id: 'astronaut',
    title: 'ASTRONAUT',
    titleEs: 'ASTRONAUTA',
    icon: '🚀',
    badge: 'Space Station Mission',
    badgeEs: 'Misión Espacial Orbital',
    energyTarget: 2400,
    description: 'Prepare a balanced menu for an astronaut living in microgravity.',
    descriptionEs: 'Prepara un menú equilibrado para un astronauta en microgravedad.',
    priorities: ['Nutrient Variety', 'High Protein', 'Fruit & Vegetables', 'Balanced Energy'],
    prioritiesEs: ['Variedad de Nutrientes', 'Proteínas de Calidad', 'Fruta y Verdura', 'Energía Equilibrada'],
    focusHint: 'In microgravity, muscles and bones need top-quality protein, variety of vitamins, and clean energy without heaviness.',
    focusHintEs: 'En gravedad cero, los huesos y músculos necesitan proteínas de calidad, vitaminas variadas y energía limpia.',
    recommendedItemsCount: { min: 7, max: 12 }
  },
  {
    id: 'student_10',
    title: '10-YEAR-OLD STUDENT',
    titleEs: 'ESTUDIANTE DE 10 AÑOS',
    icon: '🧒',
    badge: 'Active School & PE Day',
    badgeEs: 'Día Escolar y E.F.',
    energyTarget: 2000,
    description: 'Build a balanced day for an active 10-year-old student with classes, playground games and PE.',
    descriptionEs: 'Construye un día equilibrado para un estudiante activo de 10 años con colegio, recreo y E.F.',
    priorities: ['Fruit & Vegetables', 'Variety', 'Carbohydrates', 'Protein & Calcium', 'Hydration'],
    prioritiesEs: ['Fruta y Verdura', 'Variedad', 'Carbohidratos', 'Proteína y Calcio', 'Hidratación'],
    focusHint: 'Growing bodies and brains need fresh fruits, dairy or plant calcium, steady carbs for class focus, and everyday water.',
    focusHintEs: 'Cuerpo y mente en crecimiento necesitan fruta fresca, calcio, carbohidratos para concentrarse y agua.',
    recommendedItemsCount: { min: 6, max: 11 }
  },
  {
    id: 'hiker',
    title: 'MOUNTAIN HIKER',
    titleEs: 'SENDERISTA DE MONTAÑA',
    icon: '🥾',
    badge: 'Mountain Expedition',
    badgeEs: 'Ruta de Senderismo',
    energyTarget: 2600,
    description: 'Prepare an energizing pack for a full-day mountain hike.',
    descriptionEs: 'Prepara una selección energética para una ruta exigente por la montaña.',
    priorities: ['Energy', 'Carbohydrates', 'Practical Foods & Nuts', 'High Hydration'],
    prioritiesEs: ['Energía', 'Carbohidratos', 'Alimentos Prácticos y Frutos Secos', 'Mucha Hidratación'],
    focusHint: 'Hiking burns steady energy over hours: pack nuts, sandwiches, fruits, and make sure your hydration is rock-solid.',
    focusHintEs: 'Caminar por montaña quema energía constante: lleva frutos secos, bocadillos, fruta y mucha agua.',
    recommendedItemsCount: { min: 7, max: 13 }
  },
  {
    id: 'swimmer',
    title: 'SWIMMER',
    titleEs: 'NADADOR/A',
    icon: '🏊',
    badge: 'Intensive Lap Training',
    badgeEs: 'Entrenamiento en Piscina',
    energyTarget: 2700,
    description: 'Fuel a competitive swimmer for intense morning and afternoon pool sessions.',
    descriptionEs: 'Aporta la energía necesaria a un nadador para sus sesiones intensas en la piscina.',
    priorities: ['Fast & Slow Carbs', 'Muscle Protein', 'Hydration', 'Fruit & Vegetables'],
    prioritiesEs: ['Carbohidratos Variados', 'Proteína Muscular', 'Hidratación', 'Fruta y Verdura'],
    focusHint: 'Swimming works every muscle group in cool water: needs high energy, recovery protein, and lots of fluids even without feeling thirsty.',
    focusHintEs: 'Nadar activa todos los músculos: requiere alta energía, proteína recuperadora y líquidos abundantes.',
    recommendedItemsCount: { min: 8, max: 14 }
  }
];

export const EDUCATIONAL_DISCLAIMER = {
  en: 'IMPORTANT EDUCATIONAL NOTE: These numbers are fictional GAME TARGETS for educational gameplay. They do not represent personalised medical recommendations or universal calorie requirements.',
  es: 'NOTA EDUCATIVA IMPORTANTE: Estos valores son OBJETIVOS DEL JUEGO con fines didácticos. No representan recomendaciones médicas personalizadas ni requerimientos universales.'
};
