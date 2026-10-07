import { FoodItem } from '../data/foods';
import { NutritionMission } from '../data/missions';

export interface BasketTotals {
  fruitVegPoints: number;
  proteinPoints: number;
  carbsPoints: number;
  waterPoints: number;
  occasionalCount: number;
  totalCalories: number;
  totalItems: number;
  uniqueFoodCount: number;
  uniqueCategories: Set<string>;
}

export interface ScoreBreakdown {
  energyScore: number;        // max 20
  fruitVegScore: number;      // max 20
  carbsScore: number;         // max 15
  proteinScore: number;       // max 15
  hydrationScore: number;     // max 10
  varietyScore: number;       // max 20
  totalScore: number;         // 0 - 100
  rank: {
    title: string;
    titleEs: string;
    tier: 'rookie' | 'explorer' | 'expert' | 'master' | 'legend';
    medal: string;
    color: string;
  };
  evaluations: {
    energy: { rating: string; ratingEs: string; level: 'excellent' | 'good' | 'needs_adjustment' };
    fruitVeg: { rating: string; ratingEs: string; level: 'excellent' | 'good' | 'needs_more' };
    carbs: { rating: string; ratingEs: string; level: 'excellent' | 'good' | 'needs_more' };
    protein: { rating: string; ratingEs: string; level: 'excellent' | 'good' | 'needs_more' };
    hydration: { rating: string; ratingEs: string; level: 'excellent' | 'good' | 'needs_more' };
    variety: { rating: string; ratingEs: string; level: 'excellent' | 'good' | 'needs_more' };
  };
  tips: { en: string; es: string }[];
}

export function calculateBasketTotals(selectedFoods: FoodItem[]): BasketTotals {
  let fruitVegPoints = 0;
  let proteinPoints = 0;
  let carbsPoints = 0;
  let waterPoints = 0;
  let occasionalCount = 0;
  let totalCalories = 0;
  const uniqueIds = new Set<string>();
  const uniqueCategories = new Set<string>();

  for (const food of selectedFoods) {
    fruitVegPoints += food.nutrientPoints.fruitVeg;
    proteinPoints += food.nutrientPoints.protein;
    carbsPoints += food.nutrientPoints.carbs;
    waterPoints += food.nutrientPoints.water;
    if (food.type === 'occasional' || food.category === 'occasional') {
      occasionalCount++;
    }
    totalCalories += food.calories;
    uniqueIds.add(food.id);
    uniqueCategories.add(food.category);
  }

  return {
    fruitVegPoints,
    proteinPoints,
    carbsPoints,
    waterPoints,
    occasionalCount,
    totalCalories,
    totalItems: selectedFoods.length,
    uniqueFoodCount: uniqueIds.size,
    uniqueCategories
  };
}

export function evaluateMissionShopping(
  selectedFoods: FoodItem[],
  mission: NutritionMission
): ScoreBreakdown {
  const totals = calculateBasketTotals(selectedFoods);
  const totalItems = totals.totalItems;

  // Starvation / insufficient items check:
  // If player selects fewer than 5 items, scale down scores proportionally
  let sufficiencyRatio = 1.0;
  if (totalItems < 5) {
    sufficiencyRatio = Math.max(0.3, totalItems / 6);
  }

  // 1. ⚡ ENERGY TARGET (max 20 points)
  // Reaching approximately the energy target (fictional game target)
  const target = mission.energyTarget;
  const delta = Math.abs(totals.totalCalories - target);
  const percentDelta = delta / target;

  let energyScore = 0;
  if (totalItems === 0) {
    energyScore = 0;
  } else if (percentDelta <= 0.12) {
    energyScore = 20; // within 12% is perfect!
  } else if (percentDelta <= 0.20) {
    energyScore = 17;
  } else if (percentDelta <= 0.30) {
    energyScore = 13;
  } else if (percentDelta <= 0.45) {
    energyScore = 9;
  } else {
    energyScore = Math.max(4, Math.round(20 * Math.max(0.2, 1 - percentDelta)));
  }
  energyScore = Math.round(energyScore * sufficiencyRatio);

  // 2. 🍎 FRUIT & VEGETABLES (max 20 points)
  // Goal: ~3.5 to 5.0 portions of fruits and vegetables
  const fvTarget = 3.5;
  const fvRatio = Math.min(1.0, totals.fruitVegPoints / fvTarget);
  const fruitVegScore = Math.round(fvRatio * 20 * sufficiencyRatio);

  // 3. 🌾 CARBOHYDRATES (max 15 points)
  // Healthy wholegrains, oats, rice, pasta, potatoes
  const carbRatio = Math.min(1.0, totals.carbsPoints / 3.2);
  const carbsScore = Math.round(carbRatio * 15 * sufficiencyRatio);

  // 4. 💪 PROTEIN (max 15 points)
  // Quality poultry, fish, eggs, legumes, dairy
  const proteinRatio = Math.min(1.0, totals.proteinPoints / 2.8);
  const proteinScore = Math.round(proteinRatio * 15 * sufficiencyRatio);

  // 5. 💧 HYDRATION (max 10 points)
  // Pure water or hydrating fresh choices
  const waterRatio = Math.min(1.0, totals.waterPoints / 2.5);
  const hydrationScore = Math.round(waterRatio * 10 * sufficiencyRatio);

  // 6. 🌈 VARIETY & BALANCE (max 20 points)
  // Rewarding multiple food categories + moderation of occasional foods (0-2 sweets is fine; 4+ reduces balance)
  const catCount = totals.uniqueCategories.size;
  const catRatio = Math.min(1.0, catCount / 5); // 5 primary categories
  const uniqueRatio = Math.min(1.0, totals.uniqueFoodCount / 8);

  let moderationFactor = 1.0;
  if (totals.occasionalCount > 3) {
    moderationFactor = Math.max(0.5, 1.0 - (totals.occasionalCount - 3) * 0.15);
  }

  const rawVariety = ((catRatio * 0.6) + (uniqueRatio * 0.4)) * 20 * moderationFactor;
  const varietyScore = Math.round(rawVariety * sufficiencyRatio);

  // Total Score (0 - 100)
  const rawTotal = energyScore + fruitVegScore + carbsScore + proteinScore + hydrationScore + varietyScore;
  const totalScore = Math.min(100, Math.max(0, rawTotal));

  // Determine Rank based on user specifications:
  // 0–49: HEALTHY ROOKIE
  // 50–69: HEALTHY EXPLORER
  // 70–84: HEALTHY EXPERT
  // 85–94: HEALTHY MASTER
  // 95–100: HEALTHY LEGEND
  let rank: ScoreBreakdown['rank'];
  if (totalScore >= 95) {
    rank = {
      title: 'HEALTHY LEGEND',
      titleEs: 'LEYENDA SALUDABLE',
      tier: 'legend',
      medal: '👑',
      color: 'text-amber-300'
    };
  } else if (totalScore >= 85) {
    rank = {
      title: 'HEALTHY MASTER',
      titleEs: 'MAESTRO SALUDABLE',
      tier: 'master',
      medal: '🏆',
      color: 'text-amber-400'
    };
  } else if (totalScore >= 70) {
    rank = {
      title: 'HEALTHY EXPERT',
      titleEs: 'EXPERTO SALUDABLE',
      tier: 'expert',
      medal: '🥇',
      color: 'text-emerald-400'
    };
  } else if (totalScore >= 50) {
    rank = {
      title: 'HEALTHY EXPLORER',
      titleEs: 'EXPLORADOR SALUDABLE',
      tier: 'explorer',
      medal: '🥈',
      color: 'text-blue-400'
    };
  } else {
    rank = {
      title: 'HEALTHY ROOKIE',
      titleEs: 'NOVATO SALUDABLE',
      tier: 'rookie',
      medal: '🥉',
      color: 'text-orange-400'
    };
  }

  // Visual Category Evaluations
  const evaluations: ScoreBreakdown['evaluations'] = {
    energy: {
      rating: energyScore >= 17 ? 'BALANCED' : energyScore >= 12 ? 'CLOSE' : 'OFF TARGET',
      ratingEs: energyScore >= 17 ? 'EQUILIBRADO' : energyScore >= 12 ? 'CERCANO' : 'DESVIADO',
      level: energyScore >= 17 ? 'excellent' : energyScore >= 12 ? 'good' : 'needs_adjustment'
    },
    fruitVeg: {
      rating: fruitVegScore >= 16 ? 'EXCELLENT' : fruitVegScore >= 11 ? 'GOOD' : 'NEEDS MORE',
      ratingEs: fruitVegScore >= 16 ? 'EXCELENTE' : fruitVegScore >= 11 ? 'BUENO' : 'NECESITA MÁS',
      level: fruitVegScore >= 16 ? 'excellent' : fruitVegScore >= 11 ? 'good' : 'needs_more'
    },
    carbs: {
      rating: carbsScore >= 12 ? 'EXCELLENT' : carbsScore >= 9 ? 'GOOD' : 'NEEDS MORE',
      ratingEs: carbsScore >= 12 ? 'EXCELENTE' : carbsScore >= 9 ? 'BUENO' : 'NECESITA MÁS',
      level: carbsScore >= 12 ? 'excellent' : carbsScore >= 9 ? 'good' : 'needs_more'
    },
    protein: {
      rating: proteinScore >= 12 ? 'EXCELLENT' : proteinScore >= 9 ? 'GOOD' : 'NEEDS MORE',
      ratingEs: proteinScore >= 12 ? 'EXCELENTE' : proteinScore >= 9 ? 'BUENO' : 'NECESITA MÁS',
      level: proteinScore >= 12 ? 'excellent' : proteinScore >= 9 ? 'good' : 'needs_more'
    },
    hydration: {
      rating: hydrationScore >= 8 ? 'EXCELLENT' : hydrationScore >= 5 ? 'GOOD' : 'NEEDS MORE',
      ratingEs: hydrationScore >= 8 ? 'EXCELENTE' : hydrationScore >= 5 ? 'BUENO' : 'NECESITA MÁS',
      level: hydrationScore >= 8 ? 'excellent' : hydrationScore >= 5 ? 'good' : 'needs_more'
    },
    variety: {
      rating: varietyScore >= 16 ? 'EXCELLENT' : varietyScore >= 11 ? 'GOOD' : 'NEEDS VARIETY',
      ratingEs: varietyScore >= 16 ? 'EXCELENTE' : varietyScore >= 11 ? 'BUENO' : 'POCA VARIEDAD',
      level: varietyScore >= 16 ? 'excellent' : varietyScore >= 11 ? 'good' : 'needs_more'
    }
  };

  // Generate 2-3 Personalized Educational Comments based on ACTUAL products selected
  const tips: { en: string; es: string }[] = [];

  // Hydration tip
  if (totals.waterPoints >= 2.0) {
    tips.push({
      en: '💧 Excellent hydration! You picked fresh water to keep your body energized and alert.',
      es: '💧 ¡Excelente hidratación! Elegiste agua fresca para mantener el cuerpo activo y alerta.'
    });
  } else {
    tips.push({
      en: '💧 You needed more water. Remember bottled fresh water is essential for PE and active missions!',
      es: '💧 Te faltó hidratación. Recuerda que el agua fresca es esencial en E.F. y en días activos.'
    });
  }

  // Vegetables / Fruits tip
  if (totals.fruitVegPoints < 2.5) {
    tips.push({
      en: '🍎 You needed more vegetables and fruits from the produce aisle for natural vitamins and minerals.',
      es: '🍎 Te faltaron más verduras y frutas de la frutería para asegurar vitaminas y minerales naturales.'
    });
  } else {
    tips.push({
      en: '🥦 Great job picking fresh fruits and colorful vegetables to nourish your body and immune defenses!',
      es: '🥦 ¡Gran trabajo eligiendo fruta fresca y verduras variadas para cuidar tus defensas!'
    });
  }

  // Energy / Mission specific tip
  if (totals.totalCalories > target * 1.35) {
    tips.push({
      en: `⚡ You significantly exceeded the ${target} energy points target. Could you create a lighter, more balanced basket next time?`,
      es: `⚡ Superaste ampliamente el objetivo de ${target} puntos de energía. ¿Podrías crear una cesta más equilibrada la próxima vez?`
    });
  } else if (totals.totalCalories < target * 0.70) {
    tips.push({
      en: `⚡ You were well below the ${target} energy points target. Don't be afraid to add sustaining wholegrains, nuts and proteins!`,
      es: `⚡ Te quedaste muy por debajo del objetivo de ${target} puntos de energía. ¡Añade cereales integrales, frutos secos y proteínas!`
    });
  } else if (mission.id === 'football_player' && totals.carbsPoints >= 2.8) {
    tips.push({
      en: '⚽ Great carbohydrate choices for your football player! They provide sustained muscle stamina for 90 minutes of running.',
      es: '⚽ ¡Grandes elecciones de carbohidratos para tu futbolista! Aportan resistencia muscular para correr durante todo el partido.'
    });
  } else if (mission.id === 'astronaut' && totals.proteinPoints >= 2.5) {
    tips.push({
      en: '🚀 Outstanding protein selection for space exploration! High-quality protein keeps bones and muscles strong in microgravity.',
      es: '🚀 ¡Excelente selección de proteínas para la misión espacial! Mantienen fuertes los huesos y músculos en microgravedad.'
    });
  } else if (totals.occasionalCount > 3) {
    tips.push({
      en: '🍪 You picked several sweet or occasional treats. They are tasty for special moments, but balance them with everyday pantry items!',
      es: '🍪 Elegiste varios alimentos dulces u ocasionales. Son ricos para momentos especiales, ¡pero equilibra con comida de diario!'
    });
  } else {
    tips.push({
      en: '🌈 Wonderful overall variety! Choosing foods from different supermarket aisles ensures complete nutrition.',
      es: '🌈 ¡Estupenda variedad general! Elegir alimentos de diferentes pasillos del súper asegura una nutrición completa.'
    });
  }

  return {
    energyScore,
    fruitVegScore,
    carbsScore,
    proteinScore,
    hydrationScore,
    varietyScore,
    totalScore,
    rank,
    evaluations,
    tips
  };
}
