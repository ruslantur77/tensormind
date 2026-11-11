import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Layers, Zap, GraduationCap } from 'lucide-react';
import { CardsPage } from '@/pages/cards/CardsPage';
import { SpeedrunPage } from '@/pages/speedrun/SpeedrunPage';
import { ExamPage } from '@/pages/exam/ExamPage';
import { platform } from '@/shared/lib/platform';

export type PracticeTab = 'cards' | 'speedrun' | 'exam';

interface PracticePageProps {
  initialTab?: PracticeTab;
}

export const PracticePage: React.FC<PracticePageProps> = ({ initialTab }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const tabParam = searchParams.get('tab') as PracticeTab | null;
  const currentTab: PracticeTab = tabParam || initialTab || 'cards';

  const switchTab = (tab: PracticeTab) => {
    platform.haptics.light();
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('tab', tab);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {/* Sleek Segmented Glass Switcher: Карточки | Спидран | Экзамен */}
      <div className="sticky top-14 sm:top-16 z-30 pt-1 pb-3 backdrop-blur-md bg-[var(--tm-bg)]/80">
        <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl aero-inset max-w-md mx-auto shadow-sm">
          <button
            type="button"
            onClick={() => switchTab('cards')}
            className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none ${
              currentTab === 'cards'
                ? 'bg-white/20 dark:bg-white/15 text-slate-900 dark:text-white shadow-sm border border-white/20 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>Карточки</span>
          </button>

          <button
            type="button"
            onClick={() => switchTab('speedrun')}
            className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none ${
              currentTab === 'speedrun'
                ? 'bg-white/20 dark:bg-white/15 text-slate-900 dark:text-white shadow-sm border border-white/20 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Спидран</span>
          </button>

          <button
            type="button"
            onClick={() => switchTab('exam')}
            className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none ${
              currentTab === 'exam'
                ? 'bg-white/20 dark:bg-white/15 text-slate-900 dark:text-white shadow-sm border border-white/20 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Экзамен</span>
          </button>
        </div>
      </div>

      {/* Render Active Practice Mode */}
      <div>
        {currentTab === 'cards' && <CardsPage />}
        {currentTab === 'speedrun' && <SpeedrunPage />}
        {currentTab === 'exam' && <ExamPage />}
      </div>
    </div>
  );
};
