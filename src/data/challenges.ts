export interface ChallengeScenario {
  id: string;
  title: string;
  titleEs: string;
  icon: string;
  badge: string;
  badgeEs: string;
  description: string;
  descriptionEs: string;
  focusMessage: string;
  focusMessageEs: string;
  waterBonusWeight: number; // multiplier
  energyBonusWeight: number;
  carbBonusWeight: number;
  hasBirthdayCakeRule?: boolean;
}

export const CHALLENGES: ChallengeScenario[] = [
  {
    id: 'sports_day',
    title: 'SPORTS DAY',
    titleEs: 'DÍA DE DEPORTE',
    icon: '⚽',
    badge: 'Football Match Today!',
    badgeEs: '¡Partido de fútbol hoy!',
    description: 'You have football training today. Make choices that provide enough energy and hydration.',
    descriptionEs: 'Hoy tienes entrenamiento de fútbol. Elige alimentos que aporten buena energía e hidratación constante.',
    focusMessage: 'High activity day: extra water and sustained carbohydrates are essential!',
    focusMessageEs: 'Día de alta actividad: ¡el agua y los carbohidratos saludables son esenciales!',
    waterBonusWeight: 1.3,
    energyBonusWeight: 1.2,
    carbBonusWeight: 1.2
  },
  {
    id: 'school_day',
    title: 'SCHOOL DAY',
    titleEs: 'DÍA DE COLEGIO',
    icon: '📚',
    badge: 'Long Study & Play Day',
    badgeEs: 'Jornada escolar completa',
    description: 'You have a long school day. Build meals that help you stay active and focused.',
    descriptionEs: 'Tienes un día largo de colegio. Elige comidas que te ayuden a estar atento, concentrado y lleno de vitalidad.',
    focusMessage: 'Brain fuel required: wholegrains, fruits and hydration help your memory and attention!',
    focusMessageEs: 'Alimento para el cerebro: ¡cereales integrales, fruta y agua ayudan a tu memoria!',
    waterBonusWeight: 1.0,
    energyBonusWeight: 1.0,
    carbBonusWeight: 1.1
  },
  {
    id: 'excursion_day',
    title: 'EXCURSION DAY',
    titleEs: 'DÍA DE EXCURSIÓN',
    icon: '🥾',
    badge: 'Mountain Hiking Trip',
    badgeEs: 'Ruta de senderismo',
    description: 'You are going hiking. You will need enough food, energy and water.',
    descriptionEs: 'Vas de excursión a la montaña. Necesitarás suficiente comida duradera, energía y mucha agua.',
    focusMessage: 'Hiking demands steady fuel: pack handy fruits, nuts, sandwiches and refill your water!',
    focusMessageEs: 'Caminar por la montaña gasta energía: ¡lleva fruta, frutos secos, bocadillo y mucha agua!',
    waterBonusWeight: 1.4,
    energyBonusWeight: 1.3,
    carbBonusWeight: 1.2
  },
  {
    id: 'birthday_day',
    title: 'BIRTHDAY DAY',
    titleEs: 'DÍA DE CUMPLEAÑOS',
    icon: '🎂',
    badge: 'Birthday Celebration!',
    badgeEs: '¡Fiesta de cumpleaños!',
    description: 'There will be birthday cake this afternoon. Can you balance the rest of your day?',
    descriptionEs: '¡Habrá tarta de cumpleaños esta tarde! ¿Puedes disfrutarla y equilibrar el resto de tu día?',
    focusMessage: 'Celebrations are part of life! Enjoy the party treat, and choose plenty of fresh fruits and veggies in other meals.',
    focusMessageEs: '¡Las celebraciones son normales y divertidas! Disfruta la fiesta y compensa con fruta y verdura en las demás comidas.',
    waterBonusWeight: 1.0,
    energyBonusWeight: 1.0,
    carbBonusWeight: 1.0,
    hasBirthdayCakeRule: true
  },
  {
    id: 'active_day',
    title: 'ACTIVE DAY',
    titleEs: 'DÍA DE NATACIÓN ACTIVO',
    icon: '🏊',
    badge: 'Swimming Practice',
    badgeEs: 'Entrenamiento de natación',
    description: 'You have swimming practice. Remember energy and hydration!',
    descriptionEs: 'Tienes entrenamiento de natación. ¡Recuerda beber agua y cargar buenas reservas de energía!',
    focusMessage: 'Swimming uses all your muscles: lean proteins, clean carbs and water keep you strong in the pool!',
    focusMessageEs: 'Nadar activa todos los músculos: ¡proteínas limpias, carbohidratos y agua te mantendrán fuerte en el agua!',
    waterBonusWeight: 1.3,
    energyBonusWeight: 1.2,
    carbBonusWeight: 1.2
  }
];
