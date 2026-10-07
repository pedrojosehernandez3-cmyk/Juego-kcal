import React from 'react';
import { LeaderboardEntry, LeaderboardService } from '../utils/leaderboard';
import { sound } from '../utils/audio';
import { Trophy, X, Medal, Sparkles, User, Zap } from 'lucide-react';

interface LeaderboardModalProps {
  currentNickname: string;
  onClose: () => void;
  lang: 'en' | 'es';
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  currentNickname,
  onClose,
  lang
}) => {
  const entries = LeaderboardService.getEntries();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col max-h-[88vh] text-white">
        {/* Close button */}
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
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black font-display text-white">
              {lang === 'en' ? 'HEALTHY HEROES LEADERBOARD' : 'CLASIFICACIÓN HEALTHY HEROES'}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'en'
                ? 'School PE Hall of Fame · High Scores'
                : 'Salón de la Fama de Educación Física · Mejores Puntuaciones'}
            </p>
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950/60 pr-1">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase tracking-wider font-bold">
                <th className="py-3 px-3 w-16 text-center">
                  {lang === 'en' ? 'RANK' : 'PUESTO'}
                </th>
                <th className="py-3 px-3">
                  {lang === 'en' ? 'NICKNAME' : 'APODO'}
                </th>
                <th className="py-3 px-3 hidden sm:table-cell">
                  {lang === 'en' ? 'MISSION' : 'MISIÓN'}
                </th>
                <th className="py-3 px-3 text-right">
                  {lang === 'en' ? 'SCORE' : 'PUNTOS'}
                </th>
                <th className="py-3 px-3 text-right hidden sm:table-cell">
                  {lang === 'en' ? 'ENERGY' : 'ENERGÍA'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {entries.map((entry, idx) => {
                const isCurrentPlayer = entry.nickname.toLowerCase() === currentNickname.toLowerCase();
                const rankNum = idx + 1;

                return (
                  <tr
                    key={entry.id || idx}
                    className={`transition-colors ${
                      isCurrentPlayer
                        ? 'bg-emerald-500/15 text-white font-extrabold'
                        : 'hover:bg-slate-800/40 text-slate-200'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3 px-3 text-center">
                      {rankNum === 1 ? (
                        <span className="text-base">🥇</span>
                      ) : rankNum === 2 ? (
                        <span className="text-base">🥈</span>
                      ) : rankNum === 3 ? (
                        <span className="text-base">🥉</span>
                      ) : (
                        <span className="text-slate-400 font-bold tabular-nums">#{rankNum}</span>
                      )}
                    </td>

                    {/* Nickname */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-sm">{entry.nickname}</span>
                        {isCurrentPlayer && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 font-black">
                            {lang === 'en' ? 'YOU' : 'TÚ'}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Mission */}
                    <td className="py-3 px-3 hidden sm:table-cell text-slate-400 text-[11px]">
                      {entry.missionTitle}
                    </td>

                    {/* Score */}
                    <td className="py-3 px-3 text-right">
                      <span className="text-sm font-black text-amber-400 tabular-nums">
                        {entry.score}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-0.5">/100</span>
                    </td>

                    {/* Energy */}
                    <td className="py-3 px-3 text-right hidden sm:table-cell text-slate-400 tabular-nums">
                      {entry.energyPoints} kcal
                    </td>
                  </tr>
                );
              })}

              {entries.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    {lang === 'en' ? 'No scores recorded yet. Be the first!' : '¡Aún no hay puntuaciones, sé el primero!'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-800 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'en' ? 'Local school device records' : 'Registros guardados en este dispositivo'}</span>
          </span>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="py-2 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
          >
            {lang === 'en' ? 'Close' : 'Cerrar'}
          </button>
        </div>
      </div>
    </div>
  );
};
