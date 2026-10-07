import { FoodItem, ALL_FOODS } from './foods';

export type SupermarketSectionId =
  | 'fruit_veg'
  | 'bakery_grains'
  | 'protein'
  | 'dairy'
  | 'snacks_occasional'
  | 'drinks'
  | 'checkout';

export interface SupermarketSection {
  id: SupermarketSectionId;
  name: string;
  nameEs: string;
  icon: string;
  color: string;
  accentBg: string;
  description: string;
  descriptionEs: string;
  zone: { x: number; y: number; w: number; h: number };
}

export interface ShelfFixture {
  id: string;
  sectionId: SupermarketSectionId;
  x: number;
  y: number;
  w: number;
  h: number;
  type: 'fruit_stand' | 'bakery_shelf' | 'protein_counter' | 'dairy_fridge' | 'snack_gondola' | 'drink_cooler' | 'checkout_counter';
  label: string;
  labelEs: string;
  color: string;
}

export interface PlacedProduct {
  food: FoodItem;
  fixtureId: string;
  shelfX: number; // coordinate where product sits on the fixture
  shelfY: number;
  sectionId: SupermarketSectionId;
}

// Total expansive map dimensions (1800 x 1300)
export const SUPERMARKET_MAP_CONFIG = {
  width: 1800,
  height: 1300,
  playerStartX: 360,
  playerStartY: 1140, // Near the entrance next to checkouts
};

export const SUPERMARKET_SECTIONS: SupermarketSection[] = [
  {
    id: 'fruit_veg',
    name: 'FRUIT & VEGETABLES',
    nameEs: 'FRUTA Y VERDURA',
    icon: '🍎',
    color: '#22C55E',
    accentBg: '#DCFCE7',
    description: 'Fresh farm fruits, crisp vegetables and garden vitamins.',
    descriptionEs: 'Frutas frescas, verduras crujientes y vitaminas.',
    zone: { x: 80, y: 80, w: 720, h: 420 }
  },
  {
    id: 'bakery_grains',
    name: 'BREAD, CEREALS, RICE & PASTA',
    nameEs: 'PAN, CEREALES, ARROZ Y PASTA',
    icon: '🥖',
    color: '#F59E0B',
    accentBg: '#FEF3C7',
    description: 'Wholegrains, pasta, rice, tubers and steady morning energy.',
    descriptionEs: 'Cereales integrales, pasta, arroz y energía duradera.',
    zone: { x: 920, y: 80, w: 780, h: 420 }
  },
  {
    id: 'protein',
    name: 'PROTEIN & LEGUMES',
    nameEs: 'PROTEÍNAS Y LEGUMBRES',
    icon: '🥩',
    color: '#EF4444',
    accentBg: '#FEE2E2',
    description: 'Lean poultry, fresh fish, eggs and nutrient-rich legumes.',
    descriptionEs: 'Aves magras, pescado fresco, huevos y legumbres.',
    zone: { x: 80, y: 550, w: 500, h: 440 }
  },
  {
    id: 'dairy',
    name: 'DAIRY & ALTERNATIVES',
    nameEs: 'LÁCTEOS Y DERIVADOS',
    icon: '🥛',
    color: '#3B82F6',
    accentBg: '#DBEAFE',
    description: 'Milk, natural yogurts, cheeses and calcium for strong bones.',
    descriptionEs: 'Leche, yogures naturales y quesos para tus huesos.',
    zone: { x: 640, y: 550, w: 500, h: 440 }
  },
  {
    id: 'drinks',
    name: 'DRINKS & HYDRATION',
    nameEs: 'BEBIDAS E HIDRATACIÓN',
    icon: '💧',
    color: '#06B6D4',
    accentBg: '#CFFAFE',
    description: 'Fresh bottled water, 100% juices and refreshing beverages.',
    descriptionEs: 'Agua mineral fresca, zumos y bebidas hidratantes.',
    zone: { x: 1200, y: 550, w: 500, h: 440 }
  },
  {
    id: 'snacks_occasional',
    name: 'SNACKS & OCCASIONAL FOODS',
    nameEs: 'MERIENDAS Y ALIMENTOS OCASIONALES',
    icon: '🍪',
    color: '#EC4899',
    accentBg: '#FCE7F3',
    description: 'Nuts, sandwiches, treats, biscuits and celebratory foods.',
    descriptionEs: 'Frutos secos, bocadillos y caprichos ocasionales.',
    zone: { x: 640, y: 1040, w: 1060, h: 220 }
  },
  {
    id: 'checkout',
    name: 'CHECKOUT COUNTERS',
    nameEs: 'LÍNEA DE CAJAS',
    icon: '🏁',
    color: '#10B981',
    accentBg: '#D1FAE5',
    description: 'Express cash registers and scanner lanes.',
    descriptionEs: 'Cajas registradoras y salida.',
    zone: { x: 80, y: 1040, w: 500, h: 220 }
  }
];

// Generously spaced physical shelf fixtures inside the 1800x1300 supermarket
export const SHELF_FIXTURES: ShelfFixture[] = [
  // ----------------------------------------------------
  // SECTION 1: FRUIT & VEGETABLES (Top Left)
  // ----------------------------------------------------
  {
    id: 'stand_fruit_top',
    sectionId: 'fruit_veg',
    x: 100,
    y: 140,
    w: 320,
    h: 80,
    type: 'fruit_stand',
    label: 'Fresh Orchard Fruits',
    labelEs: 'Frutas del Huerto',
    color: '#16A34A'
  },
  {
    id: 'stand_veg_top',
    sectionId: 'fruit_veg',
    x: 480,
    y: 140,
    w: 300,
    h: 80,
    type: 'fruit_stand',
    label: 'Garden Greens & Roots',
    labelEs: 'Verduras y Hortalizas',
    color: '#15803D'
  },
  {
    id: 'stand_fruit_mid',
    sectionId: 'fruit_veg',
    x: 100,
    y: 340,
    w: 680,
    h: 80,
    type: 'fruit_stand',
    label: 'Berries, Citrus & Crisp Greens',
    labelEs: 'Cítricos, Fresas y Hojas Verdes',
    color: '#16A34A'
  },

  // ----------------------------------------------------
  // SECTION 2: BREAD, CEREALS, RICE & PASTA (Top Right)
  // ----------------------------------------------------
  {
    id: 'shelf_bakery_top',
    sectionId: 'bakery_grains',
    x: 960,
    y: 140,
    w: 320,
    h: 80,
    type: 'bakery_shelf',
    label: 'Bakery & Wholegrain Bread',
    labelEs: 'Panadería y Pan Integral',
    color: '#D97706'
  },
  {
    id: 'shelf_grains_top',
    sectionId: 'bakery_grains',
    x: 1340,
    y: 140,
    w: 340,
    h: 80,
    type: 'bakery_shelf',
    label: 'Rice, Pasta & Potatoes',
    labelEs: 'Arroz, Pasta y Patatas',
    color: '#B45309'
  },
  {
    id: 'shelf_cereals_mid',
    sectionId: 'bakery_grains',
    x: 960,
    y: 340,
    w: 720,
    h: 80,
    type: 'bakery_shelf',
    label: 'Oats & Breakfast Cereals',
    labelEs: 'Avena y Cereales',
    color: '#D97706'
  },

  // ----------------------------------------------------
  // SECTION 3: PROTEIN & LEGUMES (Middle Left)
  // ----------------------------------------------------
  {
    id: 'counter_meat_fish',
    sectionId: 'protein',
    x: 100,
    y: 620,
    w: 440,
    h: 85,
    type: 'protein_counter',
    label: 'Fresh Poultry & Fish Counter',
    labelEs: 'Pescadería y Aves',
    color: '#DC2626'
  },
  {
    id: 'counter_eggs_legumes',
    sectionId: 'protein',
    x: 100,
    y: 820,
    w: 440,
    h: 85,
    type: 'protein_counter',
    label: 'Eggs & Stewed Legumes',
    labelEs: 'Huevos y Legumbres',
    color: '#B91C1C'
  },

  // ----------------------------------------------------
  // SECTION 4: DAIRY & ALTERNATIVES (Middle Center)
  // ----------------------------------------------------
  {
    id: 'chiller_dairy_milk',
    sectionId: 'dairy',
    x: 660,
    y: 620,
    w: 440,
    h: 85,
    type: 'dairy_fridge',
    label: 'Fresh Milk & Natural Yogurts',
    labelEs: 'Leche y Yogures Naturales',
    color: '#2563EB'
  },
  {
    id: 'chiller_dairy_cheese',
    sectionId: 'dairy',
    x: 660,
    y: 820,
    w: 440,
    h: 85,
    type: 'dairy_fridge',
    label: 'Cheeses, Omelettes & Soups',
    labelEs: 'Quesos, Tortillas y Cremas',
    color: '#1D4ED8'
  },

  // ----------------------------------------------------
  // SECTION 5: DRINKS & HYDRATION (Middle Right)
  // ----------------------------------------------------
  {
    id: 'cooler_drinks_water',
    sectionId: 'drinks',
    x: 1220,
    y: 620,
    w: 440,
    h: 85,
    type: 'drink_cooler',
    label: 'Mineral Water & Fresh Juices',
    labelEs: 'Agua Mineral y Zumos Naturales',
    color: '#0891B2'
  },
  {
    id: 'cooler_drinks_refresh',
    sectionId: 'drinks',
    x: 1220,
    y: 820,
    w: 440,
    h: 85,
    type: 'drink_cooler',
    label: 'Smoothies & Occasional Drinks',
    labelEs: 'Batidos y Refrescos',
    color: '#0E7490'
  },

  // ----------------------------------------------------
  // SECTION 6: SNACKS & OCCASIONAL FOODS (Bottom Right)
  // ----------------------------------------------------
  {
    id: 'gondola_snacks_healthy',
    sectionId: 'snacks_occasional',
    x: 660,
    y: 1100,
    w: 460,
    h: 85,
    type: 'snack_gondola',
    label: 'Nuts & Wholesome Sandwiches',
    labelEs: 'Frutos Secos y Bocadillos',
    color: '#9333EA'
  },
  {
    id: 'gondola_snacks_sweets',
    sectionId: 'snacks_occasional',
    x: 1180,
    y: 1100,
    w: 480,
    h: 85,
    type: 'snack_gondola',
    label: 'Cookies, Chocolates & Treats',
    labelEs: 'Galletas, Chocolates y Caprichos',
    color: '#DB2777'
  },

  // ----------------------------------------------------
  // SECTION 7: CHECKOUT & EXIT (Bottom Left)
  // ----------------------------------------------------
  {
    id: 'checkout_lane_1',
    sectionId: 'checkout',
    x: 100,
    y: 1080,
    w: 220,
    h: 80,
    type: 'checkout_counter',
    label: 'Express Lane #1',
    labelEs: 'Caja Exprés #1',
    color: '#059669'
  },
  {
    id: 'checkout_lane_2',
    sectionId: 'checkout',
    x: 360,
    y: 1080,
    w: 220,
    h: 80,
    type: 'checkout_counter',
    label: 'Checkout Register #2',
    labelEs: 'Caja Registradora #2',
    color: '#047857'
  }
];

// Placed products positioned naturally ON shelf compartments with wide ~80-120px spacing
export const SUPERMARKET_PRODUCTS: PlacedProduct[] = [
  // --------------------------------------------------
  // Produce: Fruit Stand Top (x: 100, y: 140, w: 320)
  // --------------------------------------------------
  { food: ALL_FOODS.banana, fixtureId: 'stand_fruit_top', shelfX: 150, shelfY: 175, sectionId: 'fruit_veg' },
  { food: ALL_FOODS.apple, fixtureId: 'stand_fruit_top', shelfX: 250, shelfY: 175, sectionId: 'fruit_veg' },
  { food: ALL_FOODS.pear, fixtureId: 'stand_fruit_top', shelfX: 350, shelfY: 175, sectionId: 'fruit_veg' },

  // Produce: Veg Stand Top (x: 480, y: 140, w: 300)
  { food: ALL_FOODS.tomatoes, fixtureId: 'stand_veg_top', shelfX: 530, shelfY: 175, sectionId: 'fruit_veg' },
  { food: ALL_FOODS.carrots, fixtureId: 'stand_veg_top', shelfX: 630, shelfY: 175, sectionId: 'fruit_veg' },
  { food: ALL_FOODS.broccoli, fixtureId: 'stand_veg_top', shelfX: 730, shelfY: 175, sectionId: 'fruit_veg' },

  // Produce: Long Lower Stand (x: 100, y: 340, w: 680)
  { food: ALL_FOODS.mandarin, fixtureId: 'stand_fruit_mid', shelfX: 160, shelfY: 375, sectionId: 'fruit_veg' },
  { food: ALL_FOODS.strawberries, fixtureId: 'stand_fruit_mid', shelfX: 290, shelfY: 375, sectionId: 'fruit_veg' },
  { food: ALL_FOODS.lettuce, fixtureId: 'stand_fruit_mid', shelfX: 430, shelfY: 375, sectionId: 'fruit_veg' },
  { food: ALL_FOODS.peppers, fixtureId: 'stand_fruit_mid', shelfX: 570, shelfY: 375, sectionId: 'fruit_veg' },
  { food: ALL_FOODS.zucchini, fixtureId: 'stand_fruit_mid', shelfX: 710, shelfY: 375, sectionId: 'fruit_veg' },

  // --------------------------------------------------
  // Bakery Top (x: 960, y: 140, w: 320)
  // --------------------------------------------------
  { food: ALL_FOODS.wholegrain_toast, fixtureId: 'shelf_bakery_top', shelfX: 1040, shelfY: 175, sectionId: 'bakery_grains' },
  { food: ALL_FOODS.white_bread, fixtureId: 'shelf_bakery_top', shelfX: 1200, shelfY: 175, sectionId: 'bakery_grains' },

  // Grains Top (x: 1340, y: 140, w: 340)
  { food: ALL_FOODS.rice, fixtureId: 'shelf_grains_top', shelfX: 1400, shelfY: 175, sectionId: 'bakery_grains' },
  { food: ALL_FOODS.pasta, fixtureId: 'shelf_grains_top', shelfX: 1510, shelfY: 175, sectionId: 'bakery_grains' },
  { food: ALL_FOODS.potatoes, fixtureId: 'shelf_grains_top', shelfX: 1620, shelfY: 175, sectionId: 'bakery_grains' },

  // Cereals Mid (x: 960, y: 340, w: 720)
  { food: ALL_FOODS.oatmeal, fixtureId: 'shelf_cereals_mid', shelfX: 1080, shelfY: 375, sectionId: 'bakery_grains' },
  { food: ALL_FOODS.sugary_cereal, fixtureId: 'shelf_cereals_mid', shelfX: 1320, shelfY: 375, sectionId: 'bakery_grains' },
  { food: ALL_FOODS.chocolate_cereal, fixtureId: 'shelf_cereals_mid', shelfX: 1560, shelfY: 375, sectionId: 'bakery_grains' },

  // --------------------------------------------------
  // Protein Top Counter (x: 100, y: 620, w: 440)
  // --------------------------------------------------
  { food: ALL_FOODS.chicken, fixtureId: 'counter_meat_fish', shelfX: 180, shelfY: 660, sectionId: 'protein' },
  { food: ALL_FOODS.fish, fixtureId: 'counter_meat_fish', shelfX: 320, shelfY: 660, sectionId: 'protein' },
  { food: ALL_FOODS.salmon, fixtureId: 'counter_meat_fish', shelfX: 460, shelfY: 660, sectionId: 'protein' },

  // Protein Lower Counter (x: 100, y: 820, w: 440)
  { food: ALL_FOODS.egg, fixtureId: 'counter_eggs_legumes', shelfX: 180, shelfY: 860, sectionId: 'protein' },
  { food: ALL_FOODS.lentils, fixtureId: 'counter_eggs_legumes', shelfX: 320, shelfY: 860, sectionId: 'protein' },
  { food: ALL_FOODS.chickpeas, fixtureId: 'counter_eggs_legumes', shelfX: 460, shelfY: 860, sectionId: 'protein' },

  // --------------------------------------------------
  // Dairy Top Chiller (x: 660, y: 620, w: 440)
  // --------------------------------------------------
  { food: ALL_FOODS.milk, fixtureId: 'chiller_dairy_milk', shelfX: 740, shelfY: 660, sectionId: 'dairy' },
  { food: ALL_FOODS.natural_yogurt, fixtureId: 'chiller_dairy_milk', shelfX: 880, shelfY: 660, sectionId: 'dairy' },
  { food: ALL_FOODS.smoothie, fixtureId: 'chiller_dairy_milk', shelfX: 1020, shelfY: 660, sectionId: 'dairy' },

  // Dairy Lower Chiller (x: 660, y: 820, w: 440)
  { food: ALL_FOODS.cheese, fixtureId: 'chiller_dairy_cheese', shelfX: 740, shelfY: 860, sectionId: 'dairy' },
  { food: ALL_FOODS.omelette, fixtureId: 'chiller_dairy_cheese', shelfX: 880, shelfY: 860, sectionId: 'dairy' },
  { food: ALL_FOODS.vegetable_soup, fixtureId: 'chiller_dairy_cheese', shelfX: 1020, shelfY: 860, sectionId: 'dairy' },

  // --------------------------------------------------
  // Drinks Top Cooler (x: 1220, y: 620, w: 440)
  // --------------------------------------------------
  { food: ALL_FOODS.water, fixtureId: 'cooler_drinks_water', shelfX: 1330, shelfY: 660, sectionId: 'drinks' },
  { food: ALL_FOODS.orange_juice, fixtureId: 'cooler_drinks_water', shelfX: 1540, shelfY: 660, sectionId: 'drinks' },

  // Drinks Lower Cooler (x: 1220, y: 820, w: 440)
  { food: ALL_FOODS.soft_drink, fixtureId: 'cooler_drinks_refresh', shelfX: 1330, shelfY: 860, sectionId: 'drinks' },
  { food: ALL_FOODS.sugary_drink, fixtureId: 'cooler_drinks_refresh', shelfX: 1540, shelfY: 860, sectionId: 'drinks' },

  // --------------------------------------------------
  // Healthy Snacks (x: 660, y: 1100, w: 460)
  // --------------------------------------------------
  { food: ALL_FOODS.nuts, fixtureId: 'gondola_snacks_healthy', shelfX: 730, shelfY: 1140, sectionId: 'snacks_occasional' },
  { food: ALL_FOODS.turkey_sandwich, fixtureId: 'gondola_snacks_healthy', shelfX: 840, shelfY: 1140, sectionId: 'snacks_occasional' },
  { food: ALL_FOODS.small_sandwich, fixtureId: 'gondola_snacks_healthy', shelfX: 950, shelfY: 1140, sectionId: 'snacks_occasional' },
  { food: ALL_FOODS.cheese_sandwich, fixtureId: 'gondola_snacks_healthy', shelfX: 1050, shelfY: 1140, sectionId: 'snacks_occasional' },

  // --------------------------------------------------
  // Occasional Sweets & Treats (x: 1180, y: 1100, w: 480)
  // --------------------------------------------------
  { food: ALL_FOODS.cookies, fixtureId: 'gondola_snacks_sweets', shelfX: 1240, shelfY: 1140, sectionId: 'snacks_occasional' },
  { food: ALL_FOODS.chocolate_bar, fixtureId: 'gondola_snacks_sweets', shelfX: 1320, shelfY: 1140, sectionId: 'snacks_occasional' },
  { food: ALL_FOODS.pastry, fixtureId: 'gondola_snacks_sweets', shelfX: 1400, shelfY: 1140, sectionId: 'snacks_occasional' },
  { food: ALL_FOODS.donut, fixtureId: 'gondola_snacks_sweets', shelfX: 1480, shelfY: 1140, sectionId: 'snacks_occasional' },
  { food: ALL_FOODS.chips, fixtureId: 'gondola_snacks_sweets', shelfX: 1560, shelfY: 1140, sectionId: 'snacks_occasional' },
  { food: ALL_FOODS.birthday_cake, fixtureId: 'gondola_snacks_sweets', shelfX: 1625, shelfY: 1140, sectionId: 'snacks_occasional' }
];

// Physical checkout zone trigger bounding box
export const CHECKOUT_TRIGGER_ZONE = {
  x: 80,
  y: 1040,
  w: 520,
  h: 210
};
