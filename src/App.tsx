import React, { useState, useEffect } from 'react';
import { FoodItem } from './data/foods';
import { NUTRITION_MISSIONS, NutritionMission } from './data/missions';
import { HERO_AVATARS, HeroAvatar } from './components/GameArena';
import { SupermarketArena } from './components/SupermarketArena';
import { MissionSelectScreen } from './components/MissionSelectScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { LeaderboardModal } from './components/LeaderboardModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { HeroSelectModal } from './components/HeroSelectModal';
import { evaluateMissionShopping, ScoreBreakdown } from './utils/scoring';
import { LeaderboardService } from './utils/leaderboard';
import { sound } from './utils/audio';
import {
  Volume2,
  VolumeX,
  Languages,
  User,
  Trophy,
  HelpCircle,
  ShoppingCart
} from 'lucide-react';

export default function App() {
  // Game State: 'MISSION_SELECT' | 'SUPERMARKET' | 'RESULTS'
  const [gameState, setGameState] = useState<'MISSION_SELECT' | 'SUPERMARKET' | 'RESULTS'>('MISSION_SELECT');
  const [selectedMission, setSelectedMission] = useState<NutritionMission>(NUTRITION_MISSIONS[0]);
  const [cart, setCart] = useState<FoodItem[]>([]);
  const [nickname, setNickname] = useState<string>(() => LeaderboardService.getSavedNickname() || 'HeroPlayer');

  // Customization & Settings
  const [selectedAvatar, setSelectedAvatar] = useState<HeroAvatar>(HERO_AVATARS[0]);
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const [isMuted, setIsMuted] = useState(sound.isMuted);

  // Modals
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showHeroSelect, setShowHeroSelect] = useState(false);

  // Results State
  const [scoreData, setScoreData] = useState<ScoreBreakdown | null>(null);

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const toggleLang = () => {
    sound.playClick();
    setLang(prev => (prev === 'en' ? 'es' : 'en'));
  };

  // Start Supermarket with a mission
  const handleSelectMission = (mission: NutritionMission) => {
    setSelectedMission(mission);
    setCart([]);
    setGameState('SUPERMARKET');
  };

  // Cart operations
  const handleAddToCart = (food: FoodItem) => {
    setCart(prev => [...prev, food]);
  };

  const handleRemoveFromCart = (foodId: string, index?: number) => {
    setCart(prev => {
      if (typeof index === 'number') {
        return prev.filter((_, i) => i !== index);
      }
      const idx = prev.findIndex(f => f.id === foodId);
      if (idx !== -1) {
        return prev.filter((_, i) => i !== idx);
      }
      return prev;
    });
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Physical Checkout Finished -> Navigate to Results Screen
  const handleFinishShopping = () => {
    const evaluation = evaluateMissionShopping(cart, selectedMission);
    setScoreData(evaluation);

    // Save to Persistent Leaderboard
    const totalEnergy = cart.reduce((acc, f) => acc + f.calories, 0);
    LeaderboardService.addEntry({
      nickname: nickname || 'HeroPlayer',
      missionId: selectedMission.id,
      missionTitle: lang === 'en' ? selectedMission.title : selectedMission.titleEs,
      score: evaluation.totalScore,
      energyPoints: totalEnergy
    });

    setGameState('RESULTS');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* Universal 3-Zone Clean Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Zone 1: Single text element Brand Title */}
          <button
            onClick={() => {
              sound.playClick();
              setGameState('MISSION_SELECT');
            }}
            className="text-lg sm:text-xl font-black tracking-tight text-white font-display hover:text-emerald-400 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>🥗</span>
            <span>HEALTHY HEROES</span>
          </button>

          {/* Zone 2: Navigation Links */}
          <div className="hidden md:flex items-center gap-4 text-xs font-bold text-slate-300">
            <button
              onClick={() => {
                sound.playClick();
                setGameState('MISSION_SELECT');
              }}
              className={`hover:text-emerald-400 transition-colors ${
                gameState === 'MISSION_SELECT' ? 'text-emerald-400' : ''
              }`}
            >
              {lang === 'en' ? 'Missions' : 'Misiones'}
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setShowLeaderboard(true);
              }}
              className="hover:text-emerald-400 transition-colors"
            >
              {lang === 'en' ? 'Leaderboard' : 'Clasificación'}
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setShowHowToPlay(true);
              }}
              className="hover:text-emerald-400 transition-colors"
            >
              {lang === 'en' ? 'How to Play' : 'Cómo Jugar'}
            </button>
          </div>

          {/* Zone 3: Quick Action Buttons (Hero, Leaderboard, Language, Sound) */}
          <div className="flex items-center gap-2">
            {/* Player Nickname / Hero Avatar Picker */}
            <button
              onClick={() => {
                sound.playClick();
                setShowHeroSelect(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-colors"
              title={lang === 'en' ? 'Choose Hero Character' : 'Elegir Personaje'}
            >
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">{nickname}</span>
            </button>

            {/* Leaderboard CTA */}
            <button
              onClick={() => {
                sound.playClick();
                setShowLeaderboard(true);
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-colors"
              title={lang === 'en' ? 'View Leaderboard' : 'Ver Clasificación'}
            >
              <Trophy className="w-4 h-4" />
            </button>

            {/* Language Switch */}
            <button
              onClick={toggleLang}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
              title="Change language / Cambiar idioma"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang.toUpperCase()}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              aria-label="Sound Toggle"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col justify-center">
        {/* ========================================================= */}
        {/* VIEW 1: MISSION SELECTION SCREEN */}
        {/* ========================================================= */}
        {gameState === 'MISSION_SELECT' && (
          <MissionSelectScreen
            currentNickname={nickname}
            onSetNickname={(name) => setNickname(name)}
            onSelectMission={handleSelectMission}
            onOpenLeaderboard={() => setShowLeaderboard(true)}
            onOpenHowToPlay={() => setShowHowToPlay(true)}
            lang={lang}
          />
        )}

        {/* ========================================================= */}
        {/* VIEW 2: 2D SUPERMARKET ADVENTURE */}
        {/* ========================================================= */}
        {gameState === 'SUPERMARKET' && (
          <SupermarketArena
            mission={selectedMission}
            avatar={selectedAvatar}
            cart={cart}
            nickname={nickname}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onFinishShopping={handleFinishShopping}
            lang={lang}
          />
        )}

        {/* ========================================================= */}
        {/* VIEW 3: FULL RESULTS SCREEN */}
        {/* ========================================================= */}
        {gameState === 'RESULTS' && scoreData && (
          <ResultsScreen
            scoreData={scoreData}
            mission={selectedMission}
            purchasedFoods={cart}
            nickname={nickname}
            onTryAgain={() => {
              setCart([]);
              setGameState('SUPERMARKET');
            }}
            onNewMission={() => {
              setGameState('MISSION_SELECT');
            }}
            onOpenLeaderboard={() => {
              setShowLeaderboard(true);
            }}
            lang={lang}
          />
        )}
      </main>

      {/* Floating Modals */}
      {showLeaderboard && (
        <LeaderboardModal
          currentNickname={nickname}
          onClose={() => setShowLeaderboard(false)}
          lang={lang}
        />
      )}

      {showHowToPlay && (
        <HowToPlayModal
          onClose={() => setShowHowToPlay(false)}
          lang={lang}
        />
      )}

      {showHeroSelect && (
        <HeroSelectModal
          currentAvatar={selectedAvatar}
          onSelectAvatar={(av) => setSelectedAvatar(av)}
          onClose={() => setShowHeroSelect(false)}
          lang={lang}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 py-3 px-4 text-center text-xs text-slate-500">
        Healthy Heroes · Supermarket Adventure · PE Nutrition Video Game · 5th & 6th Primary
      </footer>
    </div>
  );
}
