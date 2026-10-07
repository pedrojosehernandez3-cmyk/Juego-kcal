import React from 'react';
import { FoodItem } from '../data/foods';
import { NutritionMission } from '../data/missions';
import { sound } from '../utils/audio';
import { ShoppingCart, X, RotateCcw, Zap, Sparkles, ArrowRight, Trash2 } from 'lucide-react';

interface ShoppingCartModalProps {
  cart: FoodItem[];
  mission: NutritionMission;
  onRemoveItem: (foodId: string, index?: number) => void;
  onClearCart: () => void;
  onClose: () => void;
  onProceedToCheckout: () => void;
  lang: 'en' | 'es';
}

export const ShoppingCartModal: React.FC<ShoppingCartModalProps> = ({
  cart,
  mission,
  onRemoveItem,
  onClearCart,
  onClose,
  onProceedToCheckout,
  lang
}) => {
  const totalCalories = cart.reduce((acc, f) => acc + f.calories, 0);
  const target = mission.energyTarget;
  const percent = Math.min(100, Math.round((totalCalories / target) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh] text-white">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4 pr-10">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black font-display text-white">
              {lang === 'en' ? 'YOUR SHOPPING CART' : 'TU CESTA DE LA COMPRA'}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'en'
                ? `Mission: ${mission.title} (Target: ~${mission.energyTarget} energy points)`
                : `Misión: ${mission.titleEs} (Objetivo: ~${mission.energyTarget} puntos)`}
            </p>
          </div>
        </div>

        {/* Energy & Products Progress Bar */}
        <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 mb-4">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <div className="flex items-center gap-1.5 text-slate-300">
              <ShoppingCart className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'en' ? 'PRODUCTS' : 'PRODUCTOS'}: <strong className="text-white">{cart.length}</strong></span>
            </div>

            <div className="flex items-center gap-1.5 text-amber-300">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>{lang === 'en' ? 'ENERGY' : 'ENERGÍA'}: <strong className="text-white tabular-nums">{totalCalories}</strong> / {target}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-3 bg-slate-700/80 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                percent >= 85 && percent <= 115
                  ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                  : percent > 115
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                  : 'bg-gradient-to-r from-blue-500 to-emerald-400'
              }`}
              style={{ width: `${Math.min(100, percent)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
            <span>{percent}% {lang === 'en' ? 'of energy target' : 'del objetivo'}</span>
            <span>
              {percent >= 85 && percent <= 115
                ? (lang === 'en' ? '✓ Sweet spot balance!' : '✓ ¡En el rango ideal!')
                : percent < 85
                ? (lang === 'en' ? 'Add more sustaining foods' : 'Añade más alimentos')
                : (lang === 'en' ? 'Careful not to overload' : 'Cuidado con no sobrecargar')}
            </span>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 mb-4 min-h-[140px]">
          {cart.map((food, idx) => (
            <div
              key={`${food.id}-${idx}`}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-700/70 hover:border-slate-600 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{food.icon}</span>
                <div>
                  <div className="font-extrabold text-sm text-white">
                    {lang === 'en' ? food.name : food.nameEs}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{lang === 'en' ? food.categoryLabel : food.categoryLabelEs}</span>
                    <span>•</span>
                    <span className="text-amber-300 font-semibold tabular-nums">{food.calories} kcal</span>
                  </div>
                </div>
              </div>

              {/* Remove button */}
              <button
                onClick={() => {
                  sound.playRemove();
                  onRemoveItem(food.id, idx);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                title={lang === 'en' ? 'Remove from cart' : 'Quitar de la cesta'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          ))}

          {cart.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400">
              <ShoppingCart className="w-10 h-10 mb-2 opacity-30 text-slate-500" />
              <p className="text-sm font-semibold">
                {lang === 'en' ? 'Your shopping cart is empty!' : '¡Tu cesta de la compra está vacía!'}
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                {lang === 'en'
                  ? 'Walk through the supermarket aisles to pick up healthy items for your mission.'
                  : 'Recorre los pasillos del súper para coger alimentos saludables para tu misión.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
          {cart.length > 0 ? (
            <button
              onClick={() => {
                sound.playRemove();
                onClearCart();
              }}
              className="py-2.5 px-3 rounded-xl text-slate-400 hover:text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>{lang === 'en' ? 'Empty Cart' : 'Vaciar Cesta'}</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              {lang === 'en' ? 'Continue Shopping' : 'Seguir Comprando'}
            </button>

            {cart.length >= 3 && (
              <button
                onClick={() => {
                  sound.playClick();
                  onProceedToCheckout();
                }}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-400 hover:to-green-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{lang === 'en' ? 'Go to Checkout' : 'Ir a Cajas'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
