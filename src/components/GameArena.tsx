import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FoodItem } from '../data/foods';
import { FoodInspectModal } from './FoodInspectModal';
import { sound } from '../utils/audio';
import {
  Check,
  RotateCcw,
  Sparkles,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Utensils,
  ShoppingBag,
  Info
} from 'lucide-react';

export interface HeroAvatar {
  id: string;
  name: string;
  color: string;
  hairColor: string;
  skinColor: string;
  shirtColor: string;
}

export const HERO_AVATARS: HeroAvatar[] = [
  { id: 'leo', name: 'Leo', color: '#3B82F6', hairColor: '#451A03', skinColor: '#FDE047', shirtColor: '#2563EB' },
  { id: 'maya', name: 'Maya', color: '#EC4899', hairColor: '#172554', skinColor: '#FED7AA', shirtColor: '#DB2777' },
  { id: 'sam', name: 'Sam', color: '#10B981', hairColor: '#78350F', skinColor: '#FEF08A', shirtColor: '#059669' },
  { id: 'alex', name: 'Alex', color: '#F59E0B', hairColor: '#374151', skinColor: '#FBCFE8', shirtColor: '#D97706' }
];

interface PositionedFood {
  food: FoodItem;
  x: number; // in virtual arena units 0 - 800
  y: number; // in virtual arena units 0 - 460
  collected: boolean;
}

interface GameArenaProps {
  mission: any;
  avatar: HeroAvatar;
  currentMealFoods: FoodItem[];
  onAddFood: (food: FoodItem) => void;
  onRemoveFood: (foodId: string) => void;
  onFinishMeal: () => void;
  lang: 'en' | 'es';
}

export const GameArena: React.FC<GameArenaProps> = ({
  mission,
  avatar,
  currentMealFoods,
  onAddFood,
  onRemoveFood,
  onFinishMeal,
  lang
}) => {
  // Virtual arena coordinates: 800 x 480
  const ARENA_WIDTH = 800;
  const ARENA_HEIGHT = 480;
  const PLAYER_RADIUS = 24;
  const FOOD_RADIUS = 28;

  const [playerPos, setPlayerPos] = useState({ x: 400, y: 260 });
  const [playerFacing, setPlayerFacing] = useState<'left' | 'right'>('right');
  const [isWalking, setIsWalking] = useState(false);
  const [positionedFoods, setPositionedFoods] = useState<PositionedFood[]>([]);
  const [inspectedFood, setInspectedFood] = useState<FoodItem | null>(null);

  // Keyboard keys pressed
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const arenaRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  const targetPosRef = useRef<{ x: number; y: number } | null>(null);

  // Educational popup tips rotation
  const [currentTip, setCurrentTip] = useState(mission.tip);

  useEffect(() => {
    setCurrentTip(lang === 'en' ? mission.tip : mission.tipEs);
  }, [mission, lang]);

  // Seed / randomize food positions on mission change
  useEffect(() => {
    // Reset player position
    setPlayerPos({ x: 400, y: 260 });
    targetPosRef.current = null;

    // Distribute foods with nice spacing in the arena
    const foods = [...mission.foods];
    // Shuffle
    const shuffled = foods.sort(() => Math.random() - 0.5);

    const positions: PositionedFood[] = [];
    const minPaddingX = 70;
    const maxPaddingX = ARENA_WIDTH - 70;
    const minPaddingY = 90;
    const maxPaddingY = ARENA_HEIGHT - 65;

    shuffled.forEach((food) => {
      let attempts = 0;
      let valid = false;
      let x = 0;
      let y = 0;

      while (!valid && attempts < 50) {
        attempts++;
        x = Math.floor(minPaddingX + Math.random() * (maxPaddingX - minPaddingX));
        y = Math.floor(minPaddingY + Math.random() * (maxPaddingY - minPaddingY));

        // Keep distance from center spawn point
        const distToCenter = Math.hypot(x - 400, y - 260);
        if (distToCenter < 70) continue;

        // Keep distance from other foods
        const tooClose = positions.some(p => Math.hypot(p.x - x, p.y - y) < 68);
        if (!tooClose) {
          valid = true;
        }
      }

      positions.push({
        food,
        x,
        y,
        collected: currentMealFoods.some(f => f.id === food.id)
      });
    });

    setPositionedFoods(positions);
  }, [mission]);

  // Keep collected status synced with currentMealFoods
  useEffect(() => {
    setPositionedFoods(prev =>
      prev.map(item => ({
        ...item,
        collected: currentMealFoods.some(f => f.id === item.food.id)
      }))
    );
  }, [currentMealFoods]);

  // Check collision with foods
  const checkCollisions = useCallback((px: number, py: number) => {
    for (const item of positionedFoods) {
      if (!item.collected) {
        const dist = Math.hypot(item.x - px, item.y - py);
        if (dist < PLAYER_RADIUS + FOOD_RADIUS) {
          // Trigger inspect or add
          setInspectedFood(item.food);
          targetPosRef.current = null;
          break;
        }
      }
    }
  }, [positionedFoods]);

  // Main game loop for movement
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      let dx = 0;
      let dy = 0;
      const speed = 250; // pixels per second

      // Keyboard input
      if (keysPressed.current['ArrowUp'] || keysPressed.current['KeyW'] || keysPressed.current['w']) dy -= 1;
      if (keysPressed.current['ArrowDown'] || keysPressed.current['KeyS'] || keysPressed.current['s']) dy += 1;
      if (keysPressed.current['ArrowLeft'] || keysPressed.current['KeyA'] || keysPressed.current['a']) dx -= 1;
      if (keysPressed.current['ArrowRight'] || keysPressed.current['KeyD'] || keysPressed.current['d']) dx += 1;

      // Click/Tap target movement
      if (targetPosRef.current) {
        const tDistX = targetPosRef.current.x - playerPos.x;
        const tDistY = targetPosRef.current.y - playerPos.y;
        const dist = Math.hypot(tDistX, tDistY);

        if (dist > 8) {
          dx = tDistX / dist;
          dy = tDistY / dist;
        } else {
          targetPosRef.current = null;
        }
      }

      if (dx !== 0 || dy !== 0) {
        setIsWalking(true);
        if (dx < 0) setPlayerFacing('left');
        if (dx > 0) setPlayerFacing('right');

        // Normalize diagonal
        const len = Math.hypot(dx, dy);
        const normDx = (dx / len) * speed * dt;
        const normDy = (dy / len) * speed * dt;

        setPlayerPos(prev => {
          const newX = Math.max(30, Math.min(ARENA_WIDTH - 30, prev.x + normDx));
          const newY = Math.max(75, Math.min(ARENA_HEIGHT - 35, prev.y + normDy));
          checkCollisions(newX, newY);
          return { x: newX, y: newY };
        });
      } else {
        setIsWalking(false);
      }

      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [playerPos, checkCollisions]);

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(e.key)) {
        keysPressed.current[e.key] = true;
        targetPosRef.current = null; // Keyboard overrides target tap
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Arena Click / Tap to move or select
  const handleArenaClick = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!arenaRef.current) return;
    const rect = arenaRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = ARENA_WIDTH / rect.width;
    const scaleY = ARENA_HEIGHT / rect.height;

    const targetX = (clientX - rect.left) * scaleX;
    const targetY = (clientY - rect.top) * scaleY;

    targetPosRef.current = {
      x: Math.max(30, Math.min(ARENA_WIDTH - 30, targetX)),
      y: Math.max(75, Math.min(ARENA_HEIGHT - 35, targetY))
    };
  };

  const handleFoodClickDirect = (item: PositionedFood, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    setInspectedFood(item.food);
  };

  // D-Pad / Touch Buttons handlers
  const handleDpadPress = (dir: 'up' | 'down' | 'left' | 'right', isPressed: boolean) => {
    targetPosRef.current = null;
    const keyMap = {
      up: 'ArrowUp',
      down: 'ArrowDown',
      left: 'ArrowLeft',
      right: 'ArrowRight'
    };
    keysPressed.current[keyMap[dir]] = isPressed;
  };

  const canFinish = currentMealFoods.length >= mission.minItems;
  const isPlateFull = currentMealFoods.length >= mission.maxItems;

  return (
    <div className="flex flex-col gap-3 w-full max-w-5xl mx-auto">
      {/* Level Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-2.5 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-black text-sm sm:text-base tracking-wide text-white font-display">
              {lang === 'en' ? mission.title : mission.titleEs}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-md font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {lang === 'en' ? mission.environmentName : mission.environmentNameEs}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5 font-medium">
            {lang === 'en' ? mission.subtitle : mission.subtitleEs}
          </p>
        </div>

        {/* Tip Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs text-amber-300 max-w-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="line-clamp-2">{currentTip}</span>
        </div>
      </div>

      {/* 2D Interactive Game Arena Canvas / Stage */}
      <div
        ref={arenaRef}
        onClick={handleArenaClick}
        className="relative w-full aspect-[800/480] rounded-3xl overflow-hidden border-2 border-slate-700 shadow-2xl cursor-pointer select-none"
        style={{
          background: getEnvironmentBackground(mission.theme)
        }}
      >
        {/* Environment Decor Details (SVG/CSS scenery) */}
        {renderEnvironmentDecor(mission.theme)}

        {/* Food Items placed in the arena */}
        {positionedFoods.map((item) => {
          if (item.collected) return null; // already picked up

          return (
            <div
              key={item.food.id}
              onClick={(e) => handleFoodClickDirect(item, e)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition-transform duration-200 hover:scale-110 active:scale-95"
              style={{
                left: `${(item.x / ARENA_WIDTH) * 100}%`,
                top: `${(item.y / ARENA_HEIGHT) * 100}%`
              }}
            >
              {/* Item Aura Glow */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-3xl shadow-lg border border-white/30 backdrop-blur-xs animate-float"
                style={{
                  backgroundColor: `${item.food.color}40`,
                  boxShadow: `0 8px 18px -4px ${item.food.color}70`
                }}
              >
                {item.food.icon}
              </div>

              {/* Food Name Label */}
              <div className="mt-1 px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-700/80 text-[10px] sm:text-xs font-bold text-white tracking-wide shadow-md whitespace-nowrap pointer-events-none">
                {lang === 'en' ? item.food.name : item.food.nameEs}
              </div>
            </div>
          );
        })}

        {/* The Animated Player Character */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-75"
          style={{
            left: `${(playerPos.x / ARENA_WIDTH) * 100}%`,
            top: `${(playerPos.y / ARENA_HEIGHT) * 100}%`
          }}
        >
          {/* Character Shadow */}
          <div className="w-10 h-3 bg-black/35 rounded-full blur-[2px] mx-auto mt-12" />

          {/* Character SVG Sprite */}
          <div
            className={`absolute top-0 left-0 w-12 h-14 transition-transform ${
              playerFacing === 'left' ? 'scale-x-[-1]' : 'scale-x-1'
            } ${isWalking ? 'animate-bounce-subtle' : ''}`}
          >
            <CharacterSprite avatar={avatar} isWalking={isWalking} />
          </div>

          {/* Hero Name Tag */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-1.5 py-0.2 rounded bg-slate-900/90 text-[9px] font-extrabold text-white border border-slate-700/80 whitespace-nowrap">
            {avatar.name}
          </div>
        </div>

        {/* On-screen Controls Overlay Hint for Touch / Keyboard */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300 pointer-events-none backdrop-blur-xs">
          <span>🎮</span>
          <span>{lang === 'en' ? 'Use WASD / Arrows / Tap screen to walk' : 'Usa flechas / WASD / Toca la pantalla para moverte'}</span>
        </div>
      </div>

      {/* Bottom Bar: Player Meal Basket / Plate & Controls */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-3 sm:p-4 shadow-xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Current Selection Plate */}
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {mission.theme === 'supermarket' ? (
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                ) : (
                  <Utensils className="w-4 h-4 text-emerald-400" />
                )}
                <span className="text-xs font-extrabold uppercase tracking-wider text-white">
                  {mission.theme === 'supermarket'
                    ? (lang === 'en' ? 'Your Shopping Basket' : 'Tu Cesta de la Compra')
                    : (lang === 'en' ? 'Your Plate' : 'Tu Plato')
                  }
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  ({currentMealFoods.length}/{mission.maxItems} {lang === 'en' ? 'items' : 'alimentos'})
                </span>
              </div>

              <span className="text-xs text-slate-400">
                {currentMealFoods.length < mission.minItems
                  ? (lang === 'en'
                      ? `Select at least ${mission.minItems} items`
                      : `Elige al menos ${mission.minItems} alimentos`)
                  : (lang === 'en' ? '✓ Ready to finish' : '✓ Listo para terminar')}
              </span>
            </div>

            {/* Food items on the plate */}
            <div className="flex flex-wrap items-center gap-2 min-h-[50px] p-2 bg-slate-800/60 rounded-xl border border-dashed border-slate-700">
              {currentMealFoods.map((food) => (
                <div
                  key={food.id}
                  className="flex items-center gap-1.5 pl-2 pr-1 py-1 rounded-lg bg-slate-900 border border-slate-700 shadow-sm text-xs text-white group"
                >
                  <span className="text-base">{food.icon}</span>
                  <span className="font-semibold text-xs">
                    {lang === 'en' ? food.name : food.nameEs}
                  </span>
                  {/* Remove / Undo Button */}
                  <button
                    onClick={() => {
                      sound.playRemove();
                      onRemoveFood(food.id);
                    }}
                    className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors ml-0.5"
                    title={lang === 'en' ? 'Remove food' : 'Quitar alimento'}
                    aria-label="Remove"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {currentMealFoods.length === 0 && (
                <div className="flex items-center justify-center w-full text-xs text-slate-400 py-1 font-medium">
                  {lang === 'en'
                    ? 'Walk up to food items in the room or click them to add them!'
                    : '¡Acércate a los alimentos o tócalos para añadirlos al plato!'}
                </div>
              )}
            </div>
          </div>

          {/* D-Pad Buttons for Touchscreens / Tablets + Finish Meal Button */}
          <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
            {/* Virtual Touch D-Pad (Great for tablets and smartboards) */}
            <div className="flex items-center gap-1 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/60">
              <button
                onMouseDown={() => handleDpadPress('left', true)}
                onMouseUp={() => handleDpadPress('left', false)}
                onTouchStart={() => handleDpadPress('left', true)}
                onTouchEnd={() => handleDpadPress('left', false)}
                className="w-9 h-9 rounded-xl bg-slate-700 hover:bg-slate-600 active:bg-emerald-600 flex items-center justify-center text-slate-200 transition-colors"
                aria-label="Move left"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="flex flex-col gap-1">
                <button
                  onMouseDown={() => handleDpadPress('up', true)}
                  onMouseUp={() => handleDpadPress('up', false)}
                  onTouchStart={() => handleDpadPress('up', true)}
                  onTouchEnd={() => handleDpadPress('up', false)}
                  className="w-9 h-9 rounded-xl bg-slate-700 hover:bg-slate-600 active:bg-emerald-600 flex items-center justify-center text-slate-200 transition-colors"
                  aria-label="Move up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onMouseDown={() => handleDpadPress('down', true)}
                  onMouseUp={() => handleDpadPress('down', false)}
                  onTouchStart={() => handleDpadPress('down', true)}
                  onTouchEnd={() => handleDpadPress('down', false)}
                  className="w-9 h-9 rounded-xl bg-slate-700 hover:bg-slate-600 active:bg-emerald-600 flex items-center justify-center text-slate-200 transition-colors"
                  aria-label="Move down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>

              <button
                onMouseDown={() => handleDpadPress('right', true)}
                onMouseUp={() => handleDpadPress('right', false)}
                onTouchStart={() => handleDpadPress('right', true)}
                onTouchEnd={() => handleDpadPress('right', false)}
                className="w-9 h-9 rounded-xl bg-slate-700 hover:bg-slate-600 active:bg-emerald-600 flex items-center justify-center text-slate-200 transition-colors"
                aria-label="Move right"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* ✅ FINISH MEAL Button */}
            <button
              onClick={() => {
                if (canFinish) {
                  sound.playCompleteMeal();
                  onFinishMeal();
                }
              }}
              disabled={!canFinish}
              className={`py-3 px-6 rounded-2xl font-black text-sm tracking-wide transition-all transform flex items-center gap-2 shadow-xl shrink-0 ${
                canFinish
                  ? 'bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-400 hover:to-green-300 text-slate-950 active:scale-95 shadow-emerald-500/25 cursor-pointer ring-2 ring-emerald-300/40 animate-pulse-subtle'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
              }`}
            >
              <Check className="w-5 h-5 stroke-[3]" />
              <span>{lang === 'en' ? 'FINISH MEAL' : 'TERMINAR COMIDA'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Food Inspection Modal */}
      {inspectedFood && (
        <FoodInspectModal
          food={inspectedFood}
          onClose={() => setInspectedFood(null)}
          onAdd={(food) => {
            onAddFood(food);
            setInspectedFood(null);
          }}
          cartCount={currentMealFoods.filter(f => f.id === inspectedFood.id).length}
          lang={lang}
        />
      )}
    </div>
  );
};

// Character Sprite SVG Graphic
const CharacterSprite: React.FC<{ avatar: HeroAvatar; isWalking: boolean }> = ({ avatar, isWalking }) => {
  return (
    <svg viewBox="0 0 48 56" className="w-full h-full drop-shadow-md">
      {/* Hair */}
      <circle cx="24" cy="14" r="11" fill={avatar.hairColor} />

      {/* Head */}
      <circle cx="24" cy="15" r="9" fill={avatar.skinColor} />

      {/* Eyes & Smile */}
      <circle cx="21" cy="14" r="1.5" fill="#1E293B" />
      <circle cx="27" cy="14" r="1.5" fill="#1E293B" />
      <path d="M 21 18 Q 24 21 27 18" stroke="#1E293B" strokeWidth="1.2" fill="none" strokeLinecap="round" />

      {/* Sport Headband */}
      <path d="M 15 11 Q 24 9 33 11" stroke="#EF4444" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Shirt / Athletic Jersey */}
      <path d="M 17 24 L 31 24 L 33 38 L 15 38 Z" fill={avatar.shirtColor} rx="3" />
      {/* Sports Number */}
      <circle cx="24" cy="30" r="3.5" fill="#FFFFFF" />
      <text x="24" y="32.5" fontSize="5" fontWeight="bold" textAnchor="middle" fill={avatar.shirtColor}>7</text>

      {/* Arms */}
      <rect x="12" y="24" width="4" height="11" rx="2" fill={avatar.skinColor} />
      <rect x="32" y="24" width="4" height="11" rx="2" fill={avatar.skinColor} />

      {/* Shorts */}
      <rect x="16" y="38" width="16" height="7" rx="1" fill="#1E293B" />

      {/* Animated Legs / Sneakers */}
      <rect
        x="17"
        y="45"
        width="5"
        height="7"
        rx="2"
        fill={avatar.skinColor}
        className={isWalking ? 'animate-pulse' : ''}
      />
      <rect
        x="26"
        y="45"
        width="5"
        height="7"
        rx="2"
        fill={avatar.skinColor}
        className={isWalking ? 'animate-pulse' : ''}
      />

      {/* Running Shoes */}
      <rect x="15" y="50" width="7" height="4" rx="2" fill="#FFFFFF" />
      <rect x="26" y="50" width="7" height="4" rx="2" fill="#FFFFFF" />
    </svg>
  );
};

// Helper: Scenery backgrounds
function getEnvironmentBackground(theme?: string): string {
  switch (theme) {
    case 'kitchen_morning':
      return 'linear-gradient(180deg, #FDE68A 0%, #FEF3C7 35%, #F1F5F9 35%, #E2E8F0 100%)';
    case 'playground':
      return 'linear-gradient(180deg, #93C5FD 0%, #BAE6FD 30%, #475569 30%, #334155 100%)';
    case 'supermarket':
      return 'linear-gradient(180deg, #E0F2FE 0%, #BAE6FD 25%, #CBD5E1 25%, #94A3B8 100%)';
    case 'park':
      return 'linear-gradient(180deg, #60A5FA 0%, #93C5FD 28%, #15803D 28%, #166534 100%)';
    case 'kitchen_night':
      return 'linear-gradient(180deg, #0F172A 0%, #1E1B4B 35%, #334155 35%, #1E293B 100%)';
    default:
      return 'linear-gradient(180deg, #93C5FD 0%, #BAE6FD 30%, #475569 30%, #334155 100%)';
  }
}

// Scenery decor elements
function renderEnvironmentDecor(theme?: string) {
  switch (theme) {
    case 'kitchen_morning':
      return (
        <div className="absolute inset-0 pointer-events-none opacity-40">
          {/* Morning Window with Sun */}
          <div className="absolute top-4 left-10 w-24 h-24 bg-amber-200 border-4 border-amber-800/40 rounded-lg overflow-hidden flex items-center justify-center">
            <div className="w-12 h-12 bg-amber-400 rounded-full shadow-lg" />
          </div>
          {/* Tiles pattern */}
          <div className="absolute top-[35%] inset-x-0 bottom-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
          {/* Kitchen counter bar */}
          <div className="absolute top-[32%] inset-x-0 h-4 bg-amber-800/40" />
        </div>
      );
    case 'playground':
      return (
        <div className="absolute inset-0 pointer-events-none opacity-40">
          {/* Basketball Hoop */}
          <div className="absolute top-3 right-12 flex flex-col items-center">
            <div className="w-14 h-10 bg-white border-2 border-red-500 rounded flex items-center justify-center">
              <div className="w-6 h-4 border border-red-500" />
            </div>
            <div className="w-2 h-14 bg-slate-700" />
          </div>
          {/* School Building silhouette */}
          <div className="absolute top-2 left-6 w-36 h-24 bg-amber-700/60 rounded-t-lg border-2 border-amber-900" />
          {/* Court lines */}
          <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-48 h-48 border-2 border-white/40 rounded-full" />
        </div>
      );
    case 'supermarket':
      return (
        <div className="absolute inset-0 pointer-events-none opacity-40">
          {/* Grocery shelf racks top */}
          <div className="absolute top-4 inset-x-8 h-14 bg-slate-800 rounded-lg flex items-center justify-around px-4 border border-slate-600">
            <span className="text-xl">🥫</span>
            <span className="text-xl">🌾</span>
            <span className="text-xl">🍇</span>
            <span className="text-xl">🥛</span>
            <span className="text-xl">🥕</span>
          </div>
          {/* Floor tiles */}
          <div className="absolute top-[28%] inset-x-0 bottom-0 bg-[linear-gradient(to_right,#64748b_1px,transparent_1px),linear-gradient(to_bottom,#64748b_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20" />
        </div>
      );
    case 'park':
      return (
        <div className="absolute inset-0 pointer-events-none opacity-50">
          {/* Trees */}
          <div className="absolute top-2 left-8 text-4xl">🌳</div>
          <div className="absolute top-4 left-32 text-3xl">🌲</div>
          <div className="absolute top-3 right-12 text-4xl">🌳</div>
          {/* Duck Pond */}
          <div className="absolute bottom-6 right-10 w-28 h-20 bg-sky-400/60 rounded-full border-2 border-sky-300 flex items-center justify-center">
            <span className="text-lg">🦆</span>
          </div>
          {/* Flower beds */}
          <div className="absolute bottom-4 left-10 text-xl">🌷🌼🌸</div>
        </div>
      );
    case 'kitchen_night':
      return (
        <div className="absolute inset-0 pointer-events-none opacity-60">
          {/* Night window with moon and stars */}
          <div className="absolute top-4 right-10 w-24 h-24 bg-indigo-950 border-4 border-slate-700 rounded-lg overflow-hidden flex items-center justify-center relative">
            <div className="absolute top-2 right-2 text-2xl">🌙</div>
            <div className="absolute bottom-3 left-3 text-xs text-amber-200">✨</div>
            <div className="absolute top-4 left-6 text-xs text-amber-100">⭐</div>
          </div>
          {/* Hanging warm ceiling lamp */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="w-1 h-12 bg-slate-500" />
            <div className="w-12 h-6 bg-amber-500 rounded-t-full shadow-lg shadow-amber-500/50" />
            <div className="w-36 h-36 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />
          </div>
        </div>
      );
  }
}
