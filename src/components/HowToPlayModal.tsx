import React from 'react';
import { X, Gamepad2, ShoppingCart, Zap, Flag, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface HowToPlayModalProps {
  onClose: () => void;
  lang: 'en' | 'es';
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose, lang }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl my-auto text-white">
        {/* Close button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black font-display text-white">
              {lang === 'en' ? 'HOW TO PLAY: SUPERMARKET ADVENTURE' : 'CÓMO JUGAR: AVENTURA EN EL SÚPER'}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'en' ? 'Healthy Heroes Physical Education Mission' : 'Misión de Nutrición para Educación Física'}
            </p>
          </div>
        </div>

        {/* 4 Supermarket Game Rules */}
        <div className="space-y-4 text-xs sm:text-sm">
          {/* 1. Walk the Aisles */}
          <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 flex items-start gap-3">
            <div className="text-2xl mt-0.5">🛒</div>
            <div>
              <h4 className="font-extrabold text-amber-300 mb-1">
                {lang === 'en' ? '1. Walk the Supermarket Aisles' : '1. Recorre los Pasillos del Súper'}
              </h4>
              <p className="text-slate-300 leading-relaxed">
                {lang === 'en'
                  ? 'Use WASD, Arrow keys, or the on-screen touch D-pad / tap the floor to move your hero. Foods are neatly placed on supermarket shelves, displays and refrigerators!'
                  : 'Usa WASD, flechas o la cruceta táctil / toca el suelo para mover a tu héroe. ¡Los alimentos están colocados en estanterías, neveras y puestos de fruta!'}
              </p>
            </div>
          </div>

          {/* 2. Pick and inspect products */}
          <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 flex items-start gap-3">
            <div className="text-2xl mt-0.5">🍎</div>
            <div>
              <h4 className="font-extrabold text-emerald-300 mb-1">
                {lang === 'en' ? '2. Fill Your Shopping Cart' : '2. Llena tu Cesta de la Compra'}
              </h4>
              <p className="text-slate-300 leading-relaxed">
                {lang === 'en'
                  ? 'Approach any shelf product to inspect its nutrients, energy and category. Add it to your cart. You can open your cart anytime to view or remove items.'
                  : 'Acércate a cualquier producto para ver sus nutrientes, calorías y categoría. Añádelo a tu cesta y ábrela cuando quieras para revisar o quitar.'}
              </p>
            </div>
          </div>

          {/* 3. Balanced Energy, not just calories */}
          <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 flex items-start gap-3">
            <div className="text-2xl mt-0.5">⚖️</div>
            <div>
              <h4 className="font-extrabold text-blue-300 mb-1">
                {lang === 'en' ? '3. Balance Energy & Food Groups' : '3. Equilibra Energía y Grupos de Alimentos'}
              </h4>
              <p className="text-slate-300 leading-relaxed">
                {lang === 'en'
                  ? 'Try to reach approximately your mission’s energy target. But beware: you cannot win simply by picking high-calorie snacks! You need fruit, vegetables, whole carbs, protein, and bottled water for hydration.'
                  : 'Intenta acercarte al objetivo de energía de tu misión. Pero ojo: ¡no se gana solo con comida hipercalórica! Necesitas fruta, verdura, carbohidratos, proteína y agua fresca.'}
              </p>
            </div>
          </div>

          {/* 4. Checkout */}
          <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 flex items-start gap-3">
            <div className="text-2xl mt-0.5">🏁</div>
            <div>
              <h4 className="font-extrabold text-purple-300 mb-1">
                {lang === 'en' ? '4. Walk to Checkout & Scan' : '4. Ve a la Caja y Escanea'}
              </h4>
              <p className="text-slate-300 leading-relaxed">
                {lang === 'en'
                  ? 'When your basket is ready, walk to the checkout counters at the bottom-left of the supermarket. Confirm and scan your shopping to receive your 0–100 score and Hall of Fame ranking!'
                  : 'Cuando tu cesta esté lista, ve a las cajas registradoras abajo a la izquierda. ¡Confirma tu compra para ver tu puntuación de 0 a 100 y puesto en la clasificación!'}
              </p>
            </div>
          </div>
        </div>

        {/* Start / Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full sm:w-auto py-3 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/25 transition-all cursor-pointer active:scale-95"
          >
            {lang === 'en' ? 'GOT IT, LET’S SHOP!' : '¡ENTENDIDO, A COMPRAR!'}
          </button>
        </div>
      </div>
    </div>
  );
};
