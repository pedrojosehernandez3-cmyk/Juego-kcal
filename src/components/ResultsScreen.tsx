import React, { useEffect } from 'react';
import { FoodItem } from '../data/foods';
import { NutritionMission } from '../data/missions';
import { ScoreBreakdown } from '../utils/scoring';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Trophy,
  RotateCcw,
  Sparkles,
  Zap,
  Apple,
  Wheat,
  Dumbbell,
  Droplets,
  Layers,
  ArrowRight,
  Target
} from 'lucide-react';

interface ResultsScreenProps {
  scoreData: ScoreBreakdown;
  mission: NutritionMission;
  purchasedFoods: FoodItem[];
  nickname: string;
  onTryAgain: () => void;
  onNewMission: () => void;
  onOpenLeaderboard: () => void;
  lang: 'en' | 'es';
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  scoreData,
  mission,
  purchasedFoods,
  nickname,
  onTryAgain,
  onNewMission,
  onOpenLeaderboard,
  lang
}) => {
  useEffect(() => {
    sound.playVictory();
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  const { rank, evaluations, tips, totalScore } = scoreData;

  return (
    <div className="w-full max-w-4xl mx-auto py-5 sm:py-8 px-3 animate-fade-in text-white">
      {/* Result Card Container */}
      <div className="relative bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Glow halo backdrop */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header Ribbon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-black text-emerald-400 uppercase tracking-widest mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>MISSION COMPLETE!</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white mb-1">
            {lang === 'en' ? `Well Done, ${nickname}!` : `¡Bien Hecho, ${nickname}!`}
          </h2>
          <p className="text-xs text-slate-400">
            {lang === 'en' ? `Completed Mission: ${mission.title}` : `Misión Completada: ${mission.titleEs}`}
          </p>

          {/* Large Animated Score Display: ⭐ 87 / 100 ⭐ */}
          <div className="mt-4 flex flex-col items-center justify-center">
            <div className="text-4xl sm:text-6xl font-black font-display text-amber-300 drop-shadow-md flex items-center gap-2 sm:gap-3 tabular-nums animate-bounce-subtle">
              <span>⭐</span>
              <span>{totalScore} / 100</span>
              <span>⭐</span>
            </div>

            {/* Rank Badge */}
            <div className="mt-3 flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-slate-800/90 border border-slate-700 shadow-md">
              <span className="text-2xl">{rank.medal}</span>
              <span className={`text-sm sm:text-base font-black font-display uppercase tracking-wide ${rank.color}`}>
                {lang === 'en' ? rank.title : rank.titleEs}
              </span>
            </div>
          </div>
        </div>

        {/* 6-Part Required Visual Score Breakdown */}
        <div className="bg-slate-800/60 rounded-2xl p-4 sm:p-5 border border-slate-700/60 mb-6">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>{lang === 'en' ? 'Score Breakdown' : 'Desglose de Puntuación'}</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            {/* 1. ⚡ ENERGY TARGET — XX/20 */}
            <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold mb-1">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="truncate">{lang === 'en' ? 'ENERGY TARGET' : 'OBJETIVO ENERGÍA'}</span>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <span className={`font-black text-xs ${getRatingColor(evaluations.energy.level)}`}>
                  {lang === 'en' ? evaluations.energy.rating : evaluations.energy.ratingEs}
                </span>
                <span className="text-white font-extrabold tabular-nums">{scoreData.energyScore} / 20</span>
              </div>
            </div>

            {/* 2. 🍎 FRUIT & VEGETABLES — XX/20 */}
            <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-emerald-300 font-bold mb-1">
                <Apple className="w-4 h-4 text-red-400" />
                <span className="truncate">{lang === 'en' ? 'FRUIT & VEGETABLES' : 'FRUTA Y VERDURA'}</span>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <span className={`font-black text-xs ${getRatingColor(evaluations.fruitVeg.level)}`}>
                  {lang === 'en' ? evaluations.fruitVeg.rating : evaluations.fruitVeg.ratingEs}
                </span>
                <span className="text-white font-extrabold tabular-nums">{scoreData.fruitVegScore} / 20</span>
              </div>
            </div>

            {/* 3. 🌾 CARBOHYDRATES — XX/15 */}
            <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-yellow-300 font-bold mb-1">
                <Wheat className="w-4 h-4 text-yellow-400" />
                <span className="truncate">{lang === 'en' ? 'CARBOHYDRATES' : 'CARBOHIDRATOS'}</span>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <span className={`font-black text-xs ${getRatingColor(evaluations.carbs.level)}`}>
                  {lang === 'en' ? evaluations.carbs.rating : evaluations.carbs.ratingEs}
                </span>
                <span className="text-white font-extrabold tabular-nums">{scoreData.carbsScore} / 15</span>
              </div>
            </div>

            {/* 4. 💪 PROTEIN — XX/15 */}
            <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-blue-300 font-bold mb-1">
                <Dumbbell className="w-4 h-4 text-blue-400" />
                <span className="truncate">{lang === 'en' ? 'PROTEIN' : 'PROTEÍNAS'}</span>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <span className={`font-black text-xs ${getRatingColor(evaluations.protein.level)}`}>
                  {lang === 'en' ? evaluations.protein.rating : evaluations.protein.ratingEs}
                </span>
                <span className="text-white font-extrabold tabular-nums">{scoreData.proteinScore} / 15</span>
              </div>
            </div>

            {/* 5. 💧 HYDRATION — XX/10 */}
            <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-cyan-300 font-bold mb-1">
                <Droplets className="w-4 h-4 text-cyan-400" />
                <span className="truncate">{lang === 'en' ? 'HYDRATION' : 'HIDRATACIÓN'}</span>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <span className={`font-black text-xs ${getRatingColor(evaluations.hydration.level)}`}>
                  {lang === 'en' ? evaluations.hydration.rating : evaluations.hydration.ratingEs}
                </span>
                <span className="text-white font-extrabold tabular-nums">{scoreData.hydrationScore} / 10</span>
              </div>
            </div>

            {/* 6. 🌈 VARIETY & BALANCE — XX/20 */}
            <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-purple-300 font-bold mb-1">
                <Layers className="w-4 h-4 text-purple-400" />
                <span className="truncate">{lang === 'en' ? 'VARIETY & BALANCE' : 'VARIEDAD Y EQUILIBRIO'}</span>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <span className={`font-black text-xs ${getRatingColor(evaluations.variety.level)}`}>
                  {lang === 'en' ? evaluations.variety.rating : evaluations.variety.ratingEs}
                </span>
                <span className="text-white font-extrabold tabular-nums">{scoreData.varietyScore} / 20</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-3 Personalized Educational Comments Based on Actual Products */}
        <div className="bg-gradient-to-r from-emerald-950/40 to-slate-900 rounded-2xl p-4 sm:p-5 border border-emerald-800/40 mb-6">
          <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2.5 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{lang === 'en' ? 'Coach Nutrition Feedback' : 'Consejos Personalizados del Entrenador'}</span>
          </h4>

          <div className="space-y-2">
            {tips.map((tip, idx) => (
              <p
                key={idx}
                className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium bg-slate-900/70 p-2.5 rounded-xl border border-slate-800"
              >
                {lang === 'en' ? tip.en : tip.es}
              </p>
            ))}
          </div>
        </div>

        {/* Display The Products Bought at the Supermarket */}
        <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/50 mb-6">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
            {lang === 'en' ? 'Products You Purchased' : 'Productos que compraste en el súper'} ({purchasedFoods.length}):
          </span>

          <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
            {purchasedFoods.map((food, idx) => (
              <span
                key={`${food.id}-${idx}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 shadow-sm"
              >
                <span className="text-base">{food.icon}</span>
                <span>{lang === 'en' ? food.name : food.nameEs}</span>
                <span className="text-[10px] text-amber-300 font-bold tabular-nums">({food.calories} kcal)</span>
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons: TRY AGAIN / NEW MISSION / LEADERBOARD */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={() => {
              sound.playClick();
              onOpenLeaderboard();
            }}
            className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-amber-300 font-extrabold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>{lang === 'en' ? 'LEADERBOARD' : 'CLASIFICACIÓN'}</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                sound.playClick();
                onTryAgain();
              }}
              className="flex-1 sm:flex-none py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{lang === 'en' ? 'TRY AGAIN' : 'REPETIR'}</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onNewMission();
              }}
              className="flex-1 sm:flex-none py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-400 hover:to-green-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Target className="w-4 h-4 stroke-[2.5]" />
              <span>{lang === 'en' ? 'NEW MISSION' : 'NUEVA MISIÓN'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function getRatingColor(level: 'excellent' | 'good' | 'needs_more' | 'needs_adjustment'): string {
  switch (level) {
    case 'excellent':
      return 'text-emerald-400';
    case 'good':
      return 'text-blue-400';
    case 'needs_more':
    case 'needs_adjustment':
      return 'text-amber-400';
  }
}
