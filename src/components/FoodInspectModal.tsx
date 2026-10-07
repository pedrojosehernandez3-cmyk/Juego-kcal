import React, { useEffect } from 'react';
import { FoodItem } from '../data/foods';
import { Zap, ShoppingCart, X } from 'lucide-react';
import { sound } from '../utils/audio';

interface FoodInspectModalProps {
  food: FoodItem | null;
  onClose: () => void;
  onAdd: (food: FoodItem) => void;
  cartCount?: number;
  lang: 'en' | 'es';
}

export const FoodInspectModal: React.FC<FoodInspectModalProps> = ({
  food,
  onClose,
  onAdd,
  cartCount = 0,
  lang
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!food) return null;

  const handleAddToCart = () => {
    sound.playCollect();
    onAdd(food);
    onClose();
  };

  const isOccasional = food.type === 'occasional';

  // Category Icon helper
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fruit_veg': return '🍎';
      case 'carbs': return '🥖';
      case 'protein': return '🥩';
      case 'dairy': return '🥛';
      case 'water': return '💧';
      case 'occasional': return '🍪';
      default: return '🥗';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in select-none"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-sm sm:max-w-md bg-slate-900 border-2 border-slate-700 rounded-3xl p-6 shadow-2xl overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: `0 25px 60px -15px ${food.color || '#3B82F6'}40`
        }}
      >
        {/* Glow accent */}
        <div 
          className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl opacity-25 pointer-events-none"
          style={{ backgroundColor: food.color || '#3B82F6' }}
        />

        {/* Top Close button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer"
          aria-label={lang === 'en' ? 'Close' : 'Cerrar'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Food Icon Showcase */}
        <div className="flex flex-col items-center text-center mt-1 mb-4">
          <div 
            className="w-24 h-24 rounded-3xl flex items-center justify-center text-6xl shadow-inner border border-white/20 mb-3 animate-bounce-subtle select-none"
            style={{ backgroundColor: `${food.color || '#FFFFFF'}25` }}
          >
            {food.icon}
          </div>

          {/* Food Name */}
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-wide font-display uppercase">
            {lang === 'en' ? food.name : food.nameEs}
          </h3>

          {/* Nutrients & Calories Row */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2.5">
            {/* Calories (Prominent kcal value) */}
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-sm font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm tabular-nums">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{food.calories} kcal</span>
            </span>

            {/* Category */}
            <span className="flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700">
              <span>{getCategoryIcon(food.category)}</span>
              <span>{lang === 'en' ? `Category: ${food.categoryLabel}` : `Categoría: ${food.categoryLabelEs}`}</span>
            </span>

            {/* Type badge */}
            <span className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border ${
              isOccasional
                ? 'bg-purple-950/80 text-purple-300 border-purple-700/60'
                : 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
            }`}>
              {isOccasional 
                ? (lang === 'en' ? '★ Occasional Food' : '★ Alimento Ocasional')
                : (lang === 'en' ? '✓ Everyday Food' : '✓ Alimento de Diario')
              }
            </span>
          </div>

          {/* Macronutrients breakdown if available */}
          {food.macros && food.macros.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
              {(lang === 'en' ? food.macros : (food.macrosEs || food.macros)).map((macro, idx) => (
                <span 
                  key={idx} 
                  className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-800/90 text-slate-300 border border-slate-700/80"
                >
                  {macro}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Educational Quote / Message */}
        <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 mb-5 text-center">
          <p className="text-sm text-slate-100 font-medium italic leading-relaxed">
            “{lang === 'en' ? food.message : food.messageEs}”
          </p>
        </div>

        {/* Status in Cart if already added */}
        {cartCount > 0 && (
          <div className="text-center text-xs text-emerald-400 font-bold mb-4 bg-emerald-950/50 border border-emerald-800/60 py-1.5 rounded-xl flex items-center justify-center gap-1.5">
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>
              {lang === 'en' 
                ? `Currently in your cart: ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`
                : `En tu cesta: ${cartCount} ${cartCount === 1 ? 'unidad' : 'unidades'}`
              }
            </span>
          </div>
        )}

        {/* Buttons: ADD TO CART & CANCEL */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer text-center"
          >
            {lang === 'en' ? 'CANCEL' : 'CANCELAR'}
          </button>

          <button
            onClick={handleAddToCart}
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4 fill-slate-950" />
            <span>{lang === 'en' ? 'ADD TO CART' : 'AÑADIR A LA CESTA'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
