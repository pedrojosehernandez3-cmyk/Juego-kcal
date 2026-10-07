import React from 'react';
import { CHALLENGES, ChallengeScenario } from '../data/challenges';
import { X, Flame, Dices, ArrowRight, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface ChallengeSelectModalProps {
  onSelectChallenge: (challenge: ChallengeScenario) => void;
  onClose: () => void;
  lang: 'en' | 'es';
}

export const ChallengeSelectModal: React.FC<ChallengeSelectModalProps> = ({
  onSelectChallenge,
  onClose,
  lang
}) => {
  const handleRandom = () => {
    sound.playClick();
    const randomIndex = Math.floor(Math.random() * CHALLENGES.length);
    onSelectChallenge(CHALLENGES[randomIndex]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl my-auto text-white">
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

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Flame className="w-7 h-7 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black font-display text-white">
                {lang === 'en' ? 'CHALLENGE MODE 🔥' : 'MODO DESAFÍO 🔥'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'en' ? 'Special real-life daily scenarios!' : '¡Escenarios especiales de la vida real!'}
              </p>
            </div>
          </div>

          {/* Randomizer CTA */}
          <button
            onClick={handleRandom}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
          >
            <Dices className="w-4 h-4" />
            <span>{lang === 'en' ? 'RANDOM CHALLENGE' : 'DESAFÍO ALEATORIO'}</span>
          </button>
        </div>

        {/* Challenge Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[60vh] overflow-y-auto pr-1">
          {CHALLENGES.map((ch) => (
            <div
              key={ch.id}
              onClick={() => {
                sound.playClick();
                onSelectChallenge(ch);
              }}
              className="bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/60 rounded-2xl p-4 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{ch.icon}</span>
                    <span className="font-extrabold text-white text-sm group-hover:text-amber-300 transition-colors">
                      {lang === 'en' ? ch.title : ch.titleEs}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700 font-semibold">
                    {lang === 'en' ? ch.badge : ch.badgeEs}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  "{lang === 'en' ? ch.description : ch.descriptionEs}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-700/50 text-xs">
                <span className="text-[11px] text-amber-300 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>{lang === 'en' ? ch.focusMessage : ch.focusMessageEs}</span>
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-300 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
