import React, { useState } from 'react';
import { NUTRITION_MISSIONS, NutritionMission, EDUCATIONAL_DISCLAIMER } from '../data/missions';
import { LeaderboardService } from '../utils/leaderboard';
import { sound } from '../utils/audio';
import {
  Sparkles,
  ArrowRight,
  Info,
  User,
  Zap,
  CheckCircle,
  Trophy,
  HelpCircle
} from 'lucide-react';

interface MissionSelectScreenProps {
  currentNickname: string;
  onSetNickname: (nickname: string) => void;
  onSelectMission: (mission: NutritionMission) => void;
  onOpenLeaderboard: () => void;
  onOpenHowToPlay: () => void;
  lang: 'en' | 'es';
}

export const MissionSelectScreen: React.FC<MissionSelectScreenProps> = ({
  currentNickname,
  onSetNickname,
  onSelectMission,
  onOpenLeaderboard,
  onOpenHowToPlay,
  lang
}) => {
  const [nicknameInput, setNicknameInput] = useState(currentNickname || 'HeroPlayer');
  const [errorMsg, setErrorMsg] = useState('');

  const handleStartMission = (mission: NutritionMission) => {
    const trimmed = nicknameInput.trim();
    if (!trimmed) {
      setErrorMsg(lang === 'en' ? 'Please enter a nickname first!' : '¡Introduce un apodo primero!');
      return;
    }
    sound.playClick();
    onSetNickname(trimmed);
    LeaderboardService.saveNickname(trimmed);
    onSelectMission(mission);
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-5xl mx-auto w-full py-4 sm:py-6 animate-fade-in">
      {/* Title & PE Hero Header */}
      <div className="text-center mb-6 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-black text-emerald-400 uppercase tracking-widest mb-2 shadow-sm">
          <span>🛒 Supermarket Adventure</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight">
          {lang === 'en' ? 'CHOOSE YOUR NUTRITION MISSION' : 'ELIGE TU MISIÓN NUTRICIONAL'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
          {lang === 'en'
            ? 'Enter the supermarket, walk the aisles, and build the perfect shopping basket!'
            : '¡Entra al supermercado, recorre los pasillos y llena tu cesta de forma equilibrada!'}
        </p>
      </div>

      {/* Nickname Input Box (Short Nickname Only, No Personal Data) */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-700 rounded-2xl p-4 shadow-xl mb-6 flex flex-col gap-2">
        <label className="flex items-center gap-2 text-xs font-extrabold text-slate-200">
          <User className="w-4 h-4 text-emerald-400" />
          <span>{lang === 'en' ? 'Enter Player Nickname' : 'Introduce tu Apodo de Jugador'}:</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            maxLength={15}
            value={nicknameInput}
            onChange={(e) => {
              setNicknameInput(e.target.value.slice(0, 15));
              if (errorMsg) setErrorMsg('');
            }}
            placeholder={lang === 'en' ? 'e.g. RunnerHero, Leo22...' : 'ej. Campeon, Maya9...'}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-sm focus:outline-hidden focus:border-emerald-400 transition-colors"
          />
          <button
            onClick={() => {
              sound.playClick();
              onOpenLeaderboard();
            }}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Leaderboard"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">{lang === 'en' ? 'Scores' : 'Récords'}</span>
          </button>
        </div>
        {errorMsg && <p className="text-[11px] font-bold text-rose-400">{errorMsg}</p>}
      </div>

      {/* Mandatory Educational Disclaimer Card */}
      <div className="w-full max-w-4xl bg-amber-950/30 border border-amber-800/40 rounded-2xl p-3.5 mb-6 flex items-start gap-3 shadow-inner">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-200/90 leading-relaxed font-medium">
          {lang === 'en' ? EDUCATIONAL_DISCLAIMER.en : EDUCATIONAL_DISCLAIMER.es}
        </p>
      </div>

      {/* 5 Missions Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mb-6">
        {NUTRITION_MISSIONS.map((mission) => (
          <div
            key={mission.id}
            onClick={() => handleStartMission(mission)}
            className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-emerald-400/80 rounded-3xl p-5 shadow-xl transition-all cursor-pointer group flex flex-col justify-between hover:-translate-y-1"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2 rounded-2xl bg-slate-800 border border-slate-700 shadow-sm group-hover:scale-110 transition-transform">
                    {mission.icon}
                  </span>
                  <div>
                    <h3 className="font-black text-base text-white group-hover:text-emerald-300 transition-colors font-display">
                      {lang === 'en' ? mission.title : mission.titleEs}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                      {lang === 'en' ? mission.badge : mission.badgeEs}
                    </span>
                  </div>
                </div>
              </div>

              {/* Energy Target Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-800/50 text-amber-300 text-xs font-bold mb-3 tabular-nums">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>
                  {lang === 'en' ? 'Target' : 'Objetivo'}: ~{mission.energyTarget} {lang === 'en' ? 'energy points' : 'puntos'}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                "{lang === 'en' ? mission.description : mission.descriptionEs}"
              </p>

              {/* Priorities Tags */}
              <div className="mb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  {lang === 'en' ? 'Priorities' : 'Prioridades'}:
                </span>
                <div className="flex flex-wrap gap-1">
                  {(lang === 'en' ? mission.priorities : mission.prioritiesEs).map((pri, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700/80 font-medium"
                    >
                      {pri}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-emerald-400 font-bold group-hover:underline">
                {lang === 'en' ? 'Start Supermarket Run' : 'Empezar Compra'}
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 group-hover:bg-emerald-500 text-emerald-400 group-hover:text-slate-950 flex items-center justify-center transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}

        {/* How to Play Helper Card */}
        <div
          onClick={() => {
            sound.playClick();
            onOpenHowToPlay();
          }}
          className="bg-slate-900/60 hover:bg-slate-900 border border-dashed border-slate-700 rounded-3xl p-5 shadow-xl transition-all cursor-pointer flex flex-col justify-between hover:border-slate-500"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3 text-2xl">
              📖
            </div>
            <h3 className="font-black text-base text-white font-display mb-1">
              {lang === 'en' ? 'HOW TO PLAY' : 'CÓMO JUGAR'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {lang === 'en'
                ? 'Learn how to move with WASD/Arrows, explore shelves, avoid junk traps, and score 100 points at the checkout!'
                : 'Aprende a moverte con WASD/flechas, explorar estanterías y sacar 100 puntos en caja.'}
            </p>
          </div>

          <div className="text-xs text-blue-400 font-bold flex items-center gap-1">
            <span>{lang === 'en' ? 'View Game Rules' : 'Ver Reglas'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
