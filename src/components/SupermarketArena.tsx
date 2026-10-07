import React, { useRef, useEffect, useState, useCallback } from 'react';
import { FoodItem, ALL_FOODS } from '../data/foods';
import { NutritionMission } from '../data/missions';
import { HeroAvatar } from './GameArena';
import { ShoppingCartModal } from './ShoppingCartModal';
import { FoodInspectModal } from './FoodInspectModal';
import { sound } from '../utils/audio';
import {
  ShoppingCart,
  Zap,
  Flag,
  Plus,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface SupermarketArenaProps {
  mission: NutritionMission;
  avatar: HeroAvatar;
  cart: FoodItem[];
  nickname: string;
  onAddToCart: (food: FoodItem) => void;
  onRemoveFromCart: (foodId: string, index?: number) => void;
  onClearCart: () => void;
  onFinishShopping: () => void;
  lang: 'en' | 'es';
}

// ---------------------------------------------------------------------------
// 2D WORLD SPECIFICATION (2000 x 1400 game pixels)
// ---------------------------------------------------------------------------
const WORLD_W = 2000;
const WORLD_H = 1400;

interface WorldObstacle {
  x: number;
  y: number;
  w: number;
  h: number;
  type: 'shelf_produce' | 'shelf_bakery' | 'shelf_protein' | 'shelf_dairy' | 'shelf_snacks' | 'shelf_drinks' | 'checkout';
  label: string;
  color: string;
}

interface InteractiveProduct {
  food: FoodItem;
  x: number; // world x
  y: number; // world y
}

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  alpha: number;
}

// ---------------------------------------------------------------------------
// SOLID SUPERMARKET OBSTACLES (SHELVES, COUNTERS, WALLS)
// ---------------------------------------------------------------------------
const OBSTACLES: WorldObstacle[] = [
  // Aisle 1: FRUIT & VEGETABLES (Y: 140 to 230)
  { x: 140, y: 140, w: 760, h: 90, type: 'shelf_produce', label: 'FRUIT & VEG', color: '#16A34A' },
  { x: 1100, y: 140, w: 760, h: 90, type: 'shelf_produce', label: 'FRUIT & VEG', color: '#16A34A' },

  // Aisle 2: BREAD & CEREALS (Y: 380 to 470)
  { x: 140, y: 380, w: 760, h: 90, type: 'shelf_bakery', label: 'BREAD & CEREALS', color: '#D97706' },
  { x: 1100, y: 380, w: 760, h: 90, type: 'shelf_bakery', label: 'RICE & PASTA', color: '#D97706' },

  // Aisle 3: PROTEIN & LEGUMES (Y: 620 to 710)
  { x: 140, y: 620, w: 760, h: 90, type: 'shelf_protein', label: 'PROTEIN & FISH', color: '#DC2626' },
  { x: 1100, y: 620, w: 760, h: 90, type: 'shelf_protein', label: 'EGGS & LEGUMES', color: '#DC2626' },

  // Aisle 4: DAIRY (Y: 860 to 950)
  { x: 140, y: 860, w: 760, h: 90, type: 'shelf_dairy', label: 'DAIRY & MILK', color: '#2563EB' },
  { x: 1100, y: 860, w: 760, h: 90, type: 'shelf_dairy', label: 'YOGURTS & CHEESE', color: '#2563EB' },

  // Aisle 5: SNACKS & OCCASIONAL FOODS (Left) and DRINKS (Right) (Y: 1100 to 1190)
  { x: 140, y: 1100, w: 760, h: 90, type: 'shelf_snacks', label: 'SNACKS & TREATS', color: '#9333EA' },
  { x: 1100, y: 1100, w: 760, h: 90, type: 'shelf_drinks', label: 'DRINKS & WATER', color: '#0891B2' },

  // CHECKOUT COUNTERS (Bottom) (Y: 1280 to 1350)
  { x: 260, y: 1280, w: 420, h: 70, type: 'checkout', label: 'CHECKOUT #1', color: '#059669' },
  { x: 1320, y: 1280, w: 420, h: 70, type: 'checkout', label: 'CHECKOUT #2', color: '#059669' }
];

// Interactive products positioned clearly ON shelf surfaces (generously spaced)
const PRODUCTS_ON_SHELVES: InteractiveProduct[] = [
  // Produce Left
  { food: ALL_FOODS.banana, x: 240, y: 185 },
  { food: ALL_FOODS.apple, x: 380, y: 185 },
  { food: ALL_FOODS.pear, x: 520, y: 185 },
  { food: ALL_FOODS.mandarin, x: 660, y: 185 },
  { food: ALL_FOODS.strawberries, x: 800, y: 185 },

  // Produce Right
  { food: ALL_FOODS.tomatoes, x: 1200, y: 185 },
  { food: ALL_FOODS.carrots, x: 1340, y: 185 },
  { food: ALL_FOODS.lettuce, x: 1480, y: 185 },
  { food: ALL_FOODS.broccoli, x: 1620, y: 185 },
  { food: ALL_FOODS.peppers, x: 1760, y: 185 },

  // Bakery Left
  { food: ALL_FOODS.wholegrain_toast, x: 280, y: 425 },
  { food: ALL_FOODS.white_bread, x: 440, y: 425 },
  { food: ALL_FOODS.oatmeal, x: 600, y: 425 },
  { food: ALL_FOODS.sugary_cereal, x: 760, y: 425 },

  // Grains Right
  { food: ALL_FOODS.rice, x: 1220, y: 425 },
  { food: ALL_FOODS.pasta, x: 1380, y: 425 },
  { food: ALL_FOODS.potatoes, x: 1540, y: 425 },
  { food: ALL_FOODS.chocolate_cereal, x: 1700, y: 425 },

  // Protein Left
  { food: ALL_FOODS.chicken, x: 280, y: 665 },
  { food: ALL_FOODS.fish, x: 440, y: 665 },
  { food: ALL_FOODS.salmon, x: 600, y: 665 },
  { food: ALL_FOODS.egg, x: 760, y: 665 },

  // Legumes Right
  { food: ALL_FOODS.lentils, x: 1240, y: 665 },
  { food: ALL_FOODS.chickpeas, x: 1420, y: 665 },
  { food: ALL_FOODS.zucchini, x: 1600, y: 665 },
  { food: ALL_FOODS.vegetable_soup, x: 1740, y: 665 },

  // Dairy Left
  { food: ALL_FOODS.milk, x: 280, y: 905 },
  { food: ALL_FOODS.natural_yogurt, x: 460, y: 905 },
  { food: ALL_FOODS.cheese, x: 640, y: 905 },
  { food: ALL_FOODS.smoothie, x: 800, y: 905 },

  // Dairy Right
  { food: ALL_FOODS.omelette, x: 1240, y: 905 },
  { food: ALL_FOODS.tuna_salad, x: 1420, y: 905 },
  { food: ALL_FOODS.green_salad, x: 1600, y: 905 },
  { food: ALL_FOODS.hot_chocolate, x: 1740, y: 905 },

  // Snacks Left
  { food: ALL_FOODS.nuts, x: 220, y: 1145 },
  { food: ALL_FOODS.small_sandwich, x: 320, y: 1145 },
  { food: ALL_FOODS.pizza, x: 420, y: 1145 },
  { food: ALL_FOODS.turkey_sandwich, x: 530, y: 1145 },
  { food: ALL_FOODS.cookies, x: 630, y: 1145 },
  { food: ALL_FOODS.chocolate_bar, x: 730, y: 1145 },
  { food: ALL_FOODS.donut, x: 820, y: 1145 },

  // Drinks Right (Water, Olive Oil, and Refreshments)
  { food: ALL_FOODS.water, x: 1180, y: 1145 },
  { food: ALL_FOODS.orange_juice, x: 1300, y: 1145 },
  { food: ALL_FOODS.olive_oil, x: 1420, y: 1145 },
  { food: ALL_FOODS.soft_drink, x: 1540, y: 1145 },
  { food: ALL_FOODS.chips, x: 1660, y: 1145 },
  { food: ALL_FOODS.birthday_cake, x: 1780, y: 1145 }
];

export const SupermarketArena: React.FC<SupermarketArenaProps> = ({
  mission,
  avatar,
  cart,
  nickname,
  onAddToCart,
  onRemoveFromCart,
  onClearCart,
  onFinishShopping,
  lang
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Player State
  const playerRef = useRef({
    x: 1000, // Spawn in center middle corridor
    y: 1240, // Near checkout exit
    vx: 0,
    vy: 0,
    facing: 'up' as 'up' | 'down' | 'left' | 'right',
    isMoving: false,
    animFrame: 0
  });

  // Camera State
  const cameraRef = useRef({ x: 0, y: 0 });

  // Floating text feedback (+ Item Name)
  const floatingTextsRef = useRef<FloatingText[]>([]);

  // Proximity & Checkout triggers (state for UI overlays)
  const [nearbyProduct, setNearbyProduct] = useState<InteractiveProduct | null>(null);
  const [isInCheckoutZone, setIsInCheckoutZone] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);

  // Inspection modal state & hovering
  const [inspectingFood, setInspectingFood] = useState<FoodItem | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<InteractiveProduct | null>(null);
  const hoveredProductRef = useRef<InteractiveProduct | null>(null);
  const nearbyProductRef = useRef<InteractiveProduct | null>(null);
  const pointerDownPosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    hoveredProductRef.current = hoveredProduct;
  }, [hoveredProduct]);

  useEffect(() => {
    nearbyProductRef.current = nearbyProduct;
  }, [nearbyProduct]);

  // Touch Virtual Joystick State
  const touchStateRef = useRef<{ active: boolean; dirX: number; dirY: number }>({
    active: false,
    dirX: 0,
    dirY: 0
  });

  // Keys Tracking
  const keysRef = useRef<{ [key: string]: boolean }>({});

  const totalCalories = cart.reduce((acc, f) => acc + f.calories, 0);

  // Trigger floating text animation
  const addFloatingText = (x: number, y: number, text: string) => {
    floatingTextsRef.current.push({
      id: Date.now() + Math.random(),
      x,
      y,
      text,
      alpha: 1.0
    });
  };

  // Canvas coordinate converter
  const getCanvasCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const canvasX = (clientX - rect.left) * scaleX;
    const canvasY = (clientY - rect.top) * scaleY;
    const worldX = canvasX + cameraRef.current.x;
    const worldY = canvasY + cameraRef.current.y;
    return { worldX, worldY };
  };

  // Canvas click / tap detection (Generous interaction area for mouse & touch)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!pointerDownPosRef.current) return;
    const start = pointerDownPosRef.current;
    const dist = Math.hypot(e.clientX - start.x, e.clientY - start.y);
    pointerDownPosRef.current = null;

    // Small movement (< 15px) = deliberate tap or click
    if (dist < 15) {
      const coords = getCanvasCoords(e.clientX, e.clientY);
      if (!coords) return;

      let closest: InteractiveProduct | null = null;
      let minDst = 48; // Generous 48px radius invisible interaction area around food icon
      for (const prod of PRODUCTS_ON_SHELVES) {
        const d = Math.hypot(prod.x - coords.worldX, prod.y - coords.worldY);
        if (d < minDst) {
          minDst = d;
          closest = prod;
        }
      }

      if (closest) {
        sound.playClick();
        setInspectingFood(closest.food);
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e.clientX, e.clientY);
    if (!coords) return;

    let closest: InteractiveProduct | null = null;
    let minDst = 48;
    for (const prod of PRODUCTS_ON_SHELVES) {
      const d = Math.hypot(prod.x - coords.worldX, prod.y - coords.worldY);
      if (d < minDst) {
        minDst = d;
        closest = prod;
      }
    }
    setHoveredProduct(closest);
  };

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent browser page scrolling when using game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', ' '].includes(e.key)) {
        e.preventDefault();
      }
      keysRef.current[e.key.toLowerCase()] = true;
      keysRef.current[e.code] = true;

      // Inspect nearby food hotkeys (E, Space, Enter)
      if ((e.key === 'e' || e.key === 'E' || e.key === ' ' || e.key === 'Enter') && nearbyProduct) {
        sound.playClick();
        setInspectingFood(nearbyProduct.food);
      }

      // Quick Cart hotkey
      if (e.key === 'c' || e.key === 'C') {
        setShowCartModal(prev => !prev);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
      keysRef.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nearbyProduct]);

  // Handle Pickup action
  const handlePickup = useCallback(() => {
    if (nearbyProduct) {
      sound.playCollect();
      onAddToCart(nearbyProduct.food);
      addFloatingText(
        nearbyProduct.x,
        nearbyProduct.y - 25,
        `+ ${lang === 'en' ? nearbyProduct.food.name : nearbyProduct.food.nameEs}`
      );
    }
  }, [nearbyProduct, onAddToCart, lang]);

  // -------------------------------------------------------------------------
  // MAIN 2D GAME ENGINE LOOP (Physics, Camera, Render)
  // -------------------------------------------------------------------------
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const checkCollision = (nx: number, ny: number): boolean => {
      const radius = 20; // Player collision radius

      // Outer World Boundaries
      if (nx - radius < 40 || nx + radius > WORLD_W - 40 || ny - radius < 40 || ny + radius > WORLD_H - 40) {
        return true;
      }

      // Shelf / Obstacle Collisions
      for (const obs of OBSTACLES) {
        if (
          nx + radius > obs.x &&
          nx - radius < obs.x + obs.w &&
          ny + radius > obs.y &&
          ny - radius < obs.y + obs.h
        ) {
          return true;
        }
      }
      return false;
    };

    const gameLoop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const canvas = canvasRef.current;
      const player = playerRef.current;
      const keys = keysRef.current;
      const touch = touchStateRef.current;

      // 1. Calculate Player Input
      let moveX = 0;
      let moveY = 0;

      if (keys['arrowup'] || keys['keyw'] || keys['w']) moveY -= 1;
      if (keys['arrowdown'] || keys['keys'] || keys['s']) moveY += 1;
      if (keys['arrowleft'] || keys['keya'] || keys['a']) moveX -= 1;
      if (keys['arrowright'] || keys['keyd'] || keys['d']) moveX += 1;

      // Touchpad override
      if (touch.active) {
        moveX = touch.dirX;
        moveY = touch.dirY;
      }

      const isMoving = moveX !== 0 || moveY !== 0;
      player.isMoving = isMoving;

      if (isMoving) {
        if (Math.abs(moveX) > Math.abs(moveY)) {
          player.facing = moveX > 0 ? 'right' : 'left';
        } else {
          player.facing = moveY > 0 ? 'down' : 'up';
        }

        const len = Math.hypot(moveX, moveY);
        const speed = 290; // pixels per second
        const vx = (moveX / len) * speed * dt;
        const vy = (moveY / len) * speed * dt;

        // Sliding Collision detection
        if (!checkCollision(player.x + vx, player.y)) {
          player.x += vx;
        }
        if (!checkCollision(player.x, player.y + vy)) {
          player.y += vy;
        }

        player.animFrame += dt * 8;
      }

      // 2. Interactive Proximity Check
      let closest: InteractiveProduct | null = null;
      let minDst = 65; // interactive radius in pixels

      for (const prod of PRODUCTS_ON_SHELVES) {
        const dst = Math.hypot(prod.x - player.x, prod.y - player.y);
        if (dst < minDst) {
          minDst = dst;
          closest = prod;
        }
      }
      setNearbyProduct(closest);

      // Checkout Zone Check (Exit at bottom center between checkout lanes)
      const inCheckout = (
        player.x >= 780 &&
        player.x <= 1220 &&
        player.y >= 1230 &&
        player.y <= 1360
      );
      setIsInCheckoutZone(inCheckout);

      // 3. REAL FIXED CAMERA MATH
      if (canvas) {
        const vpW = canvas.width;
        const vpH = canvas.height;

        // cameraX = playerX - viewportWidth / 2
        // cameraY = playerY - viewportHeight / 2
        let camX = player.x - vpW / 2;
        let camY = player.y - vpH / 2;

        // Clamp camera to world boundaries
        camX = Math.max(0, Math.min(WORLD_W - vpW, camX));
        camY = Math.max(0, Math.min(WORLD_H - vpH, camY));

        cameraRef.current.x = camX;
        cameraRef.current.y = camY;

        // 4. RENDER FRAME
        const ctx = canvas.getContext('2d');
        if (ctx) {
          renderSupermarket(ctx, vpW, vpH, camX, camY, player, cart);
        }
      }

      // Update floating texts
      floatingTextsRef.current.forEach(ft => {
        ft.y -= dt * 35;
        ft.alpha -= dt * 0.9;
      });
      floatingTextsRef.current = floatingTextsRef.current.filter(ft => ft.alpha > 0);

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [cart]);

  // Adjust canvas size to match container
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (container && canvas) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // -------------------------------------------------------------------------
  // CANVAS RENDERING ENGINE
  // -------------------------------------------------------------------------
  const renderSupermarket = (
    ctx: CanvasRenderingContext2D,
    vpW: number,
    vpH: number,
    camX: number,
    camY: number,
    player: typeof playerRef.current,
    currentCart: FoodItem[]
  ) => {
    // Clear screen
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, vpW, vpH);

    ctx.save();
    // WORLD SCROLL TRANSLATE: Everything drawn moves relative to camera
    ctx.translate(-camX, -camY);

    // 1. Tiled Supermarket Floor
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    // Grid lines for supermarket floor tiles
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    const tileSize = 60;
    const startTileX = Math.floor(camX / tileSize) * tileSize;
    const endTileX = Math.min(WORLD_W, camX + vpW + tileSize);
    const startTileY = Math.floor(camY / tileSize) * tileSize;
    const endTileY = Math.min(WORLD_H, camY + vpH + tileSize);

    ctx.beginPath();
    for (let x = startTileX; x <= endTileX; x += tileSize) {
      ctx.moveTo(x, startTileY);
      ctx.lineTo(x, endTileY);
    }
    for (let y = startTileY; y <= endTileY; y += tileSize) {
      ctx.moveTo(startTileX, y);
      ctx.lineTo(endTileX, y);
    }
    ctx.stroke();

    // Walking Corridor Center Guides
    ctx.fillStyle = '#EEF2F6';
    ctx.fillRect(940, 60, 120, 1200);

    // 2. Supermarket Outer Walls
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, 0, WORLD_W, 40); // Top wall
    ctx.fillRect(0, WORLD_H - 40, WORLD_W, 40); // Bottom wall
    ctx.fillRect(0, 0, 40, WORLD_H); // Left wall
    ctx.fillRect(WORLD_W - 40, 0, 40, WORLD_H); // Right wall

    // Wall Trim
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(40, 36, WORLD_W - 80, 6);
    ctx.fillRect(36, 40, 6, WORLD_H - 80);
    ctx.fillRect(WORLD_W - 42, 40, 6, WORLD_H - 80);

    // 3. Supermarket Shelves & Fixtures
    for (const obs of OBSTACLES) {
      // Drop Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.fillRect(obs.x + 4, obs.y + 6, obs.w, obs.h);

      // Shelf Base
      ctx.fillStyle = obs.type === 'checkout' ? '#065F46' : '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(obs.x, obs.y, obs.w, obs.h, 12);
      ctx.fill();

      // Top Colored Rim
      ctx.fillStyle = obs.color;
      ctx.beginPath();
      ctx.roundRect(obs.x, obs.y, obs.w, 14, [12, 12, 0, 0]);
      ctx.fill();

      // Shelf Border
      ctx.strokeStyle = obs.type === 'checkout' ? '#047857' : '#CBD5E1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(obs.x, obs.y, obs.w, obs.h, 12);
      ctx.stroke();

      // Shelf Texture Slots (Draw shelf dividers so it looks like authentic grocery aisles)
      if (obs.type !== 'checkout') {
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 1.5;
        const slots = 6;
        const slotW = obs.w / slots;
        for (let i = 1; i < slots; i++) {
          ctx.beginPath();
          ctx.moveTo(obs.x + i * slotW, obs.y + 16);
          ctx.lineTo(obs.x + i * slotW, obs.y + obs.h - 6);
          ctx.stroke();
        }
      } else {
        // Conveyor belt & register monitor on checkout
        ctx.fillStyle = '#1E293B';
        ctx.fillRect(obs.x + 30, obs.y + 24, obs.w - 120, 28);
        ctx.fillStyle = '#059669';
        ctx.fillRect(obs.x + obs.w - 70, obs.y + 20, 45, 35);
      }

      // Small clean aisle sign
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.beginPath();
      ctx.roundRect(obs.x + obs.w / 2 - 60, obs.y - 12, 120, 20, 6);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 10px Plus Jakarta Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(obs.label, obs.x + obs.w / 2, obs.y - 2);
    }

    // 4. Products Stocked on Shelves
    for (const prod of PRODUCTS_ON_SHELVES) {
      const isCollected = currentCart.some(c => c.id === prod.food.id);
      const isHovered = hoveredProductRef.current?.food.id === prod.food.id;
      const isNearby = nearbyProductRef.current?.food.id === prod.food.id;

      // Glow halo on hover or proximity
      if (isHovered || isNearby) {
        ctx.fillStyle = isHovered ? 'rgba(245, 158, 11, 0.25)' : 'rgba(16, 185, 129, 0.2)';
        ctx.beginPath();
        ctx.arc(prod.x, prod.y, 27, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = isHovered ? '#F59E0B' : '#10B981';
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }

      // Product shelf compartment circle
      ctx.fillStyle = isCollected ? 'rgba(16, 185, 129, 0.15)' : (isHovered ? 'rgba(254, 243, 199, 0.9)' : '#F1F5F9');
      ctx.beginPath();
      ctx.arc(prod.x, prod.y, isHovered ? 22 : 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = isCollected ? '#10B981' : (isHovered ? '#F59E0B' : '#CBD5E1');
      ctx.lineWidth = isHovered ? 2 : 1.5;
      ctx.stroke();

      // Product Emoji Icon
      ctx.font = isHovered ? '24px Apple Color Emoji, Segoe UI Emoji, sans-serif' : '22px Apple Color Emoji, Segoe UI Emoji, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(prod.food.icon, prod.x, prod.y + 2);

      // Subdued Checkmark if already picked
      if (isCollected) {
        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.arc(prod.x + 14, prod.y - 14, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText('✓', prod.x + 14, prod.y - 13);
      }
    }

    // 5. Checkout Zone Highlight & Exit Gateway
    ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
    ctx.fillRect(780, 1230, 440, 130);
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(780, 1230, 440, 130);
    ctx.setLineDash([]);

    // Floating Checkout Sign
    ctx.fillStyle = '#065F46';
    ctx.beginPath();
    ctx.roundRect(930, 1245, 140, 30, 10);
    ctx.fill();
    ctx.strokeStyle = '#34D399';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🏁 CHECKOUT', 1000, 1260);

    // 6. Draw Player Character + Cart
    const px = player.x;
    const py = player.y;

    // Soft Player Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(px, py + 16, 18, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Shopping Cart (Drawn connected to player facing direction)
    let cartOffsetX = 0;
    let cartOffsetY = 0;
    if (player.facing === 'right') { cartOffsetX = 24; cartOffsetY = 2; }
    else if (player.facing === 'left') { cartOffsetX = -24; cartOffsetY = 2; }
    else if (player.facing === 'down') { cartOffsetX = 0; cartOffsetY = 24; }
    else { cartOffsetX = 0; cartOffsetY = -24; }

    // Cart Body
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.beginPath();
    ctx.ellipse(px + cartOffsetX, py + cartOffsetY + 12, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(px + cartOffsetX - 13, py + cartOffsetY - 13, 26, 26, 6);
    ctx.fill();
    ctx.stroke();

    // Cart Icon / Items inside
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🛒', px + cartOffsetX, py + cartOffsetY);

    if (currentCart.length > 0) {
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.arc(px + cartOffsetX + 10, py + cartOffsetY - 10, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText(String(currentCart.length), px + cartOffsetX + 10, py + cartOffsetY - 9);
    }

    // Top-Down Player Body
    // Feet animation
    if (player.isMoving) {
      const bob = Math.sin(player.animFrame) * 4;
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(px - 10, py + 12 + bob, 7, 6);
      ctx.fillRect(px + 3, py + 12 - bob, 7, 6);
    } else {
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(px - 9, py + 12, 6, 6);
      ctx.fillRect(px + 3, py + 12, 6, 6);
    }

    // Torso / Jersey
    ctx.fillStyle = avatar.shirtColor || '#2563EB';
    ctx.beginPath();
    ctx.roundRect(px - 14, py - 6, 28, 20, 6);
    ctx.fill();
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Head
    ctx.fillStyle = avatar.skinColor || '#FDE047';
    ctx.beginPath();
    ctx.arc(px, py - 12, 12, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = avatar.hairColor || '#451A03';
    ctx.beginPath();
    ctx.arc(px, py - 15, 12, Math.PI, Math.PI * 2);
    ctx.fill();

    // Eyes in facing direction
    ctx.fillStyle = '#1E293B';
    if (player.facing === 'down') {
      ctx.fillRect(px - 5, py - 10, 3, 3);
      ctx.fillRect(px + 2, py - 10, 3, 3);
    } else if (player.facing === 'up') {
      // Back of head, just hair
      ctx.beginPath();
      ctx.arc(px, py - 13, 11, 0, Math.PI * 2);
      ctx.fill();
    } else if (player.facing === 'right') {
      ctx.fillRect(px + 3, py - 11, 3, 3);
    } else {
      ctx.fillRect(px - 6, py - 11, 3, 3);
    }

    // Player Nickname Tag above character
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.beginPath();
    ctx.roundRect(px - 36, py - 36, 72, 16, 6);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 9px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(nickname || 'Hero', px, py - 28);

    // 7. Floating Pickup Effects
    for (const ft of floatingTextsRef.current) {
      ctx.fillStyle = `rgba(245, 158, 11, ${ft.alpha})`;
      ctx.font = 'bold 12px Plus Jakarta Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(ft.text, ft.x, ft.y);
    }

    ctx.restore();
  };

  // -------------------------------------------------------------------------
  // TOUCHPAD VIRTUAL JOYSTICK / DPAD
  // -------------------------------------------------------------------------
  const handleTouchDpad = (dx: number, dy: number, active: boolean) => {
    touchStateRef.current = { active, dirX: dx, dirY: dy };
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-6xl mx-auto select-none">
      {/* ----------------------------------------------------------- */}
      {/* COMPACT FIXED TOP HUD (OUTSIDE PLAYABLE MAP)                */}
      {/* ----------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl px-4 py-2.5 shadow-xl flex items-center justify-between text-xs text-white">
        {/* Mission Name */}
        <div className="flex items-center gap-2">
          <span className="text-lg">{mission.icon}</span>
          <span className="font-black text-white tracking-wide font-display">
            {lang === 'en' ? mission.title : mission.titleEs}
          </span>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 font-bold text-amber-300 tabular-nums">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{totalCalories}</span>
            <span className="text-slate-400 font-normal">/ {mission.energyTarget}</span>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setShowCartModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-extrabold cursor-pointer transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-emerald-400" />
            <span>{cart.length}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 font-black">
              {lang === 'en' ? 'VIEW CART' : 'VER CESTA'}
            </span>
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------------- */}
      {/* FIXED GAME VIEWPORT (WORLD SCROLLS INSIDE!)                 */}
      {/* ----------------------------------------------------------- */}
      <div
        ref={containerRef}
        className="relative w-full h-[540px] sm:h-[600px] md:h-[650px] rounded-3xl overflow-hidden border-2 border-slate-700 shadow-2xl bg-slate-950 touch-none select-none"
        style={{ touchAction: 'none' }}
      >
        {/* HTML5 Game Canvas */}
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setHoveredProduct(null)}
          className="block w-full h-full"
          style={{
            cursor: hoveredProduct ? 'pointer' : 'default',
            touchAction: 'none'
          }}
        />

        {/* --------------------------------------------------------- */}
        {/* CONTEXTUAL PROXIMITY POPUP (APPEARS ONLY WHEN NEAR A FOOD) */}
        {/* --------------------------------------------------------- */}
        {nearbyProduct && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 bg-slate-900/95 border-2 border-amber-400 px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-3 text-white backdrop-blur-md animate-fade-in pointer-events-auto">
            <span className="text-2xl">{nearbyProduct.food.icon}</span>
            <div>
              <div className="text-xs font-black text-white">
                {lang === 'en' ? nearbyProduct.food.name : nearbyProduct.food.nameEs}
              </div>
              <div className="text-[11px] text-amber-300 font-bold">
                {nearbyProduct.food.calories} kcal · <span className="text-slate-300 font-normal">{lang === 'en' ? nearbyProduct.food.categoryLabel : nearbyProduct.food.categoryLabelEs}</span>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setInspectingFood(nearbyProduct.food);
              }}
              className="py-1.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-xs shadow transition-all flex items-center gap-1 cursor-pointer"
            >
              <span className="hidden sm:inline">[ E ]</span>
              <span>{lang === 'en' ? 'VIEW & ADD' : 'VER Y AÑADIR'}</span>
            </button>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* CHECKOUT BANNER WHEN NEAR EXIT GATE                       */}
        {/* --------------------------------------------------------- */}
        {isInCheckoutZone && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 bg-slate-900/95 border-2 border-emerald-400 px-5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 text-white backdrop-blur-md animate-bounce-subtle pointer-events-auto">
            <span className="text-2xl">🏁</span>
            <div>
              <div className="text-xs font-black text-emerald-400">
                {lang === 'en' ? 'CHECKOUT READY' : 'CAJA LISTA'}
              </div>
              <div className="text-[11px] text-slate-300">
                {lang === 'en' ? 'Ready to finish shopping?' : '¿Listo para terminar tu compra?'}
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setShowCheckoutModal(true);
              }}
              className="py-1.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow transition-all cursor-pointer"
            >
              {lang === 'en' ? 'FINISH SHOPPING' : 'PAGAR Y FINALIZAR'}
            </button>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* MOBILE CONTROLS (FIXED INSIDE VIEWPORT CORNERS)           */}
        {/* --------------------------------------------------------- */}
        {/* Virtual D-pad (Bottom Left of Viewport) */}
        <div className="absolute bottom-4 left-4 z-20 flex flex-col items-center gap-1 bg-slate-900/60 p-2 rounded-2xl border border-slate-700/60 backdrop-blur-xs select-none touch-none">
          <button
            onTouchStart={() => handleTouchDpad(0, -1, true)}
            onTouchEnd={() => handleTouchDpad(0, 0, false)}
            onMouseDown={() => handleTouchDpad(0, -1, true)}
            onMouseUp={() => handleTouchDpad(0, 0, false)}
            className="w-10 h-10 rounded-xl bg-slate-800/90 active:bg-emerald-500 text-white flex items-center justify-center font-bold"
            aria-label="Up"
          >
            <ArrowUp className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1">
            <button
              onTouchStart={() => handleTouchDpad(-1, 0, true)}
              onTouchEnd={() => handleTouchDpad(0, 0, false)}
              onMouseDown={() => handleTouchDpad(-1, 0, true)}
              onMouseUp={() => handleTouchDpad(0, 0, false)}
              className="w-10 h-10 rounded-xl bg-slate-800/90 active:bg-emerald-500 text-white flex items-center justify-center font-bold"
              aria-label="Left"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-950/40" />
            <button
              onTouchStart={() => handleTouchDpad(1, 0, true)}
              onTouchEnd={() => handleTouchDpad(0, 0, false)}
              onMouseDown={() => handleTouchDpad(1, 0, true)}
              onMouseUp={() => handleTouchDpad(0, 0, false)}
              className="w-10 h-10 rounded-xl bg-slate-800/90 active:bg-emerald-500 text-white flex items-center justify-center font-bold"
              aria-label="Right"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <button
            onTouchStart={() => handleTouchDpad(0, 1, true)}
            onTouchEnd={() => handleTouchDpad(0, 0, false)}
            onMouseDown={() => handleTouchDpad(0, 1, true)}
            onMouseUp={() => handleTouchDpad(0, 0, false)}
            className="w-10 h-10 rounded-xl bg-slate-800/90 active:bg-emerald-500 text-white flex items-center justify-center font-bold"
            aria-label="Down"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Action Buttons (Bottom Right of Viewport) */}
        <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2 items-end">
          {nearbyProduct && (
            <button
              onClick={() => {
                sound.playClick();
                setInspectingFood(nearbyProduct.food);
              }}
              className="py-3 px-5 rounded-2xl bg-amber-400 active:bg-amber-300 text-slate-950 font-black text-xs shadow-xl flex items-center gap-2 border-2 border-white/40 cursor-pointer animate-pulse-subtle"
            >
              <span className="text-base">{nearbyProduct.food.icon}</span>
              <span>{lang === 'en' ? 'VIEW FOOD' : 'VER ALIMENTO'}</span>
            </button>
          )}

          {isInCheckoutZone && (
            <button
              onClick={() => {
                sound.playClick();
                setShowCheckoutModal(true);
              }}
              className="py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-400 text-slate-950 font-black text-xs shadow-xl flex items-center gap-2 border-2 border-white/40 cursor-pointer"
            >
              <Flag className="w-4 h-4 fill-slate-950" />
              <span>{lang === 'en' ? 'FINISH' : 'FINALIZAR'}</span>
            </button>
          )}
        </div>
      </div>

      {/* ----------------------------------------------------------- */}
      {/* FOOD INFORMATION CARD MODAL (OPENED ON CLICK / TAP)        */}
      {/* ----------------------------------------------------------- */}
      {inspectingFood && (
        <FoodInspectModal
          food={inspectingFood}
          onClose={() => setInspectingFood(null)}
          onAdd={(food) => {
            onAddToCart(food);
            const prod = PRODUCTS_ON_SHELVES.find(p => p.food.id === food.id);
            const fx = prod ? prod.x : playerRef.current.x;
            const fy = prod ? prod.y - 30 : playerRef.current.y - 30;
            addFloatingText(fx, fy, `+ ${food.calories} kcal ${lang === 'en' ? food.name : food.nameEs}`);
          }}
          cartCount={cart.filter(c => c.id === inspectingFood.id).length}
          lang={lang}
        />
      )}

      {/* ----------------------------------------------------------- */}
      {/* SHOPPING CART MODAL                                         */}
      {/* ----------------------------------------------------------- */}
      {showCartModal && (
        <ShoppingCartModal
          cart={cart}
          mission={mission}
          onRemoveItem={onRemoveFromCart}
          onClearCart={onClearCart}
          onClose={() => setShowCartModal(false)}
          onProceedToCheckout={() => {
            setShowCartModal(false);
            setShowCheckoutModal(true);
          }}
          lang={lang}
        />
      )}

      {/* ----------------------------------------------------------- */}
      {/* CHECKOUT CONFIRMATION MODAL                                 */}
      {/* ----------------------------------------------------------- */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-3xl">
                🏁
              </div>
              <div>
                <h3 className="text-xl font-black font-display">
                  {lang === 'en' ? 'Ready to finish shopping?' : '¿Listo para terminar la compra?'}
                </h3>
                <p className="text-xs text-slate-400">
                  {lang === 'en' ? 'Supermarket Checkout Counter' : 'Caja del Supermercado'}
                </p>
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 mb-5 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>{lang === 'en' ? 'Items in Cart' : 'Productos en cesta'}:</span>
                <strong className="text-white">{cart.length}</strong>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>{lang === 'en' ? 'Energy Points' : 'Puntos de energía'}:</span>
                <strong className="text-amber-300 tabular-nums">{totalCalories} / {mission.energyTarget}</strong>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  sound.playClick();
                  setShowCheckoutModal(false);
                }}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
              >
                {lang === 'en' ? 'KEEP SHOPPING' : 'SEGUIR COMPRANDO'}
              </button>

              <button
                onClick={() => {
                  sound.playCheckout();
                  setShowCheckoutModal(false);
                  onFinishShopping();
                }}
                className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
              >
                {lang === 'en' ? 'FINISH SHOPPING' : 'PAGAR Y FINALIZAR'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
