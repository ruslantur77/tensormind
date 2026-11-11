import React, { useEffect, useState, useCallback } from 'react';
import { Flame, Sparkles } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { streakRepository } from '@/entities/streak/model/repository';
import { xpRepository } from '@/entities/xp/model/repository';
import { STATS_UPDATED_EVENT } from '@/shared/lib/events';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [streakCount, setStreakCount] = useState(0);
  const [totalXP, setTotalXP] = useState(0);

  const loadStats = useCallback(async () => {
    try {
      const streak = await streakRepository.getStreak();
      setStreakCount(streak.currentStreak);
      const xp = await xpRepository.getTotalXP();
      setTotalXP(xp);
    } catch (e) {
      console.error('Failed to reload stats in Header:', e);
    }
  }, []);

  // Reload on mount and whenever location changes
  useEffect(() => {
    loadStats();
  }, [location.pathname, loadStats]);

  // Synchronize immediately on custom event and window focus/storage
  useEffect(() => {
    window.addEventListener(STATS_UPDATED_EVENT, loadStats);
    window.addEventListener('storage', loadStats);
    window.addEventListener('focus', loadStats);

    return () => {
      window.removeEventListener(STATS_UPDATED_EVENT, loadStats);
      window.removeEventListener('storage', loadStats);
      window.removeEventListener('focus', loadStats);
    };
  }, [loadStats]);

  return (
    <header className="sticky top-0 z-40 w-full aero-glass border-b border-slate-200/80 dark:border-white/10 safe-top">
      <div className="max-w-5xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          {/* Logo boldly filling the white square badge */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white shadow-sm border border-slate-200/80 dark:border-white/20 group-hover:scale-105 transition-transform flex items-center justify-center shrink-0 overflow-hidden relative">
            <img
              src="/logo.png"
              alt="TensorMind"
              className="w-full h-full object-contain pointer-events-none select-none"
            />
          </div>
          <div>
            <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
              Tensor<span className="text-sky-600 dark:text-sky-400">Mind</span>
            </h1>
          </div>
        </div>

        {/* Badges: Streak & XP */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak */}
          <div
            onClick={() => navigate('/stats')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-semibold cursor-pointer hover:bg-amber-500/25 transition"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{streakCount}</span>
          </div>

          {/* XP */}
          <div
            onClick={() => navigate('/stats')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-700 dark:text-sky-400 text-xs font-semibold cursor-pointer hover:bg-sky-500/25 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>{totalXP} XP</span>
          </div>
        </div>
      </div>
    </header>
  );
};
