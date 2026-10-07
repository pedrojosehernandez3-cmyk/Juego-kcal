import React from 'react';
import { HeroAvatar, HERO_AVATARS } from './GameArena';
import { X, Check } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeroSelectModalProps {
  currentAvatar: HeroAvatar;
  onSelectAvatar: (avatar: HeroAvatar) => void;
  onClose: () => void;
  lang: 'en' | 'es';
}

export const HeroSelectModal: React.FC<HeroSelectModalProps> = ({
  currentAvatar,
  onSelectAvatar,
  onClose,
  lang
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-white">
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

        <h3 className="text-xl font-black font-display mb-1 text-white">
          {lang === 'en' ? 'CHOOSE YOUR HEALTHY HERO 🏃' : 'ELIGE A TU HÉROE SALUDABLE 🏃'}
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          {lang === 'en' ? 'Pick your athletic character for PE class!' : '¡Elige a tu personaje para la clase de E.F.!'}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-5">
          {HERO_AVATARS.map((avatar) => {
            const isSelected = avatar.id === currentAvatar.id;
            return (
              <div
                key={avatar.id}
                onClick={() => {
                  sound.playClick();
                  onSelectAvatar(avatar);
                }}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-2 ${
                  isSelected
                    ? 'bg-slate-800 border-emerald-400 shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-800/50 border-slate-700/80 hover:border-slate-500 hover:bg-slate-800'
                }`}
              >
                {/* Avatar SVG Portrait */}
                <div className="w-16 h-16 rounded-2xl bg-slate-700/60 flex items-center justify-center p-1 relative">
                  <svg viewBox="0 0 48 56" className="w-full h-full">
                    <circle cx="24" cy="14" r="11" fill={avatar.hairColor} />
                    <circle cx="24" cy="15" r="9" fill={avatar.skinColor} />
                    <circle cx="21" cy="14" r="1.5" fill="#1E293B" />
                    <circle cx="27" cy="14" r="1.5" fill="#1E293B" />
                    <path d="M 21 18 Q 24 21 27 18" stroke="#1E293B" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                    <path d="M 15 11 Q 24 9 33 11" stroke="#EF4444" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <path d="M 17 24 L 31 24 L 33 38 L 15 38 Z" fill={avatar.shirtColor} rx="3" />
                  </svg>

                  {isSelected && (
                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                <span className="font-extrabold text-sm text-white">
                  {avatar.name}
                </span>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all"
        >
          {lang === 'en' ? 'CONFIRM HERO' : 'CONFIRMAR HÉROE'}
        </button>
      </div>
    </div>
  );
};
