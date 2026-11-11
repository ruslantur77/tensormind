import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Flame,
  Sparkles,
  Layers,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Lock,
  Clock,
  AlertTriangle,
  Play,
  RotateCcw,
  Compass,
} from 'lucide-react';
import { GlassPanel } from '@/shared/ui/GlassPanel';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { ProgressBar } from '@/shared/ui/ProgressBar';
import { profileRepository } from '@/entities/profile/model/repository';
import { streakRepository } from '@/entities/streak/model/repository';
import { xpRepository } from '@/entities/xp/model/repository';
import { cardRepository } from '@/entities/card/model/repository';
import { lessonRepository } from '@/entities/lesson/model/repository';
import { contentRegistry } from '@/shared/content';
import { backupManager } from '@/features/backup/model/backupManager';
import { platform } from '@/shared/lib/platform';
import { ModuleIcon } from '@/shared/ui/AppIcons';
import { LocalizedString, getLocalized } from '@/shared/lib/schemas';
import { LearningRoadmap } from '@/widgets/roadmap/LearningRoadmap';
import { MathText } from '@/shared/lib/katex/MathText';
import { getRandomSplash } from '@/shared/config/splashPhrases';

import { STATS_UPDATED_EVENT } from '@/shared/lib/events';

interface HomeDataCache {
  userName: string;
  level: number;
  totalXP: number;
  streakDays: number;
  dailyGoalTarget: number;
  cardsReviewedToday: number;
  dueCardIds: string[];
  completedLessonIds: Set<string>;
  lastIncompleteLesson: {
    moduleId: string;
    lessonId: string;
    title: LocalizedString;
  } | null;
  showBackupBanner: boolean;
  isInitialLoaded: boolean;
}

// Module-level singleton cache: preserves state across tab navigations to avoid layout jumps
let homeDataCache: HomeDataCache | null = null;

export const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');

  const [isInitialLoaded, setIsInitialLoaded] = useState(homeDataCache?.isInitialLoaded ?? false);
  const [userName, setUserName] = useState(homeDataCache?.userName ?? '');
  const [level, setLevel] = useState(homeDataCache?.level ?? 1);
  const [totalXP, setTotalXP] = useState(homeDataCache?.totalXP ?? 0);
  const [streakDays, setStreakDays] = useState(homeDataCache?.streakDays ?? 0);
  const [dailyGoalTarget, setDailyGoalTarget] = useState(homeDataCache?.dailyGoalTarget ?? 15);
  const [cardsReviewedToday, setCardsReviewedToday] = useState(homeDataCache?.cardsReviewedToday ?? 0);
  const [dueCardIds, setDueCardIds] = useState<string[]>(homeDataCache?.dueCardIds ?? []);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(homeDataCache?.completedLessonIds ?? new Set());
  const [showBackupBanner, setShowBackupBanner] = useState(homeDataCache?.showBackupBanner ?? false);
  const [lastIncompleteLesson, setLastIncompleteLesson] = useState<{
    moduleId: string;
    lessonId: string;
    title: LocalizedString;
  } | null>(homeDataCache?.lastIncompleteLesson ?? null);

  const [homeTab, setHomeTab] = useState<'modules' | 'roadmap'>(
    tabParam === 'roadmap' ? 'roadmap' : 'modules'
  );
  const lang = (i18n.language === 'en' ? 'en' : 'ru') as 'ru' | 'en';
  const [splashText, setSplashText] = useState<string>(() => getRandomSplash(i18n.language === 'en' ? 'en' : 'ru'));

  useEffect(() => {
    if (tabParam === 'roadmap' || tabParam === 'modules') {
      setHomeTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    async function loadData() {
      const allCardIds = contentRegistry.getAllCards().map(c => c.id);

      // Concurrent fetch of all database stores in a single parallel batch
      const [profile, xp, streak, reviewedToday, due, completed, backupNeeded] = await Promise.all([
        profileRepository.getProfile(),
        xpRepository.getTotalXP(),
        streakRepository.getStreak(),
        cardRepository.getReviewLogsCountToday(),
        cardRepository.getDueCards(allCardIds),
        lessonRepository.getAllProgress(),
        backupManager.isBackupDue(7),
      ]);

      if (!profile) {
        navigate('/onboarding', { replace: true });
        return;
      }

      const compSet = new Set(completed.map(c => c.lessonId));

      // Find first incomplete lesson for "Continue"
      let foundIncomplete: { moduleId: string; lessonId: string; title: LocalizedString } | null = null;
      for (const mod of contentRegistry.modules) {
        if (mod.meta.isPlaceholder) continue;
        for (const lesson of mod.lessons) {
          if (!compSet.has(lesson.id)) {
            foundIncomplete = {
              moduleId: mod.meta.id,
              lessonId: lesson.id,
              title: lesson.title,
            };
            break;
          }
        }
        if (foundIncomplete) break;
      }

      const calculatedLevel = xpRepository.calculateLevel(xp);
      const targetGoal = profile.dailyGoal?.target || 15;

      // Update module-level cache for instantaneous zero-jank subsequent page visits
      homeDataCache = {
        userName: profile.name,
        level: calculatedLevel,
        totalXP: xp,
        streakDays: streak.currentStreak,
        dailyGoalTarget: targetGoal,
        cardsReviewedToday: reviewedToday,
        dueCardIds: due,
        completedLessonIds: compSet,
        lastIncompleteLesson: foundIncomplete,
        showBackupBanner: backupNeeded,
        isInitialLoaded: true,
      };

      // Atomic batched update in React 18
      setUserName(profile.name);
      setDailyGoalTarget(targetGoal);
      setTotalXP(xp);
      setLevel(calculatedLevel);
      setStreakDays(streak.currentStreak);
      setCardsReviewedToday(reviewedToday);
      setDueCardIds(due);
      setCompletedLessonIds(compSet);
      setLastIncompleteLesson(foundIncomplete);
      setShowBackupBanner(backupNeeded);
      setIsInitialLoaded(true);
    }

    loadData();
    window.addEventListener(STATS_UPDATED_EVENT, loadData);
    return () => {
      window.removeEventListener(STATS_UPDATED_EVENT, loadData);
    };
  }, [navigate]);

  return (
    <div className="space-y-6">
      {/* Backup Reminder Banner */}
      {showBackupBanner && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-amber-800 dark:text-amber-300">
                {t('home.backup_banner_title')}
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                {t('home.backup_banner_desc')}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="glass"
            className="border-amber-500/40 text-amber-800 dark:text-amber-300 shrink-0"
            onClick={() => navigate('/settings')}
          >
            {t('home.backup_banner_action')}
          </Button>
        </div>
      )}

      {/* Hero Profile & Daily Goal */}
      <GlassPanel glow className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="cyan" size="sm">
                {t('home.level', { level })}
              </Badge>
              <div
                onClick={() => navigate('/stats')}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-semibold cursor-pointer hover:bg-amber-500/25 transition"
              >
                <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>{t('home.streak_days', { count: streakDays })}</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {t('home.xp_total', { count: totalXP })}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {userName ? t('home.welcome', { name: userName }) : (lang === 'en' ? 'Welcome!' : 'Привет!')}
            </h2>
            <div
              onClick={() => {
                platform.haptics.light();
                setSplashText(getRandomSplash(lang));
              }}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition cursor-pointer select-none group pt-0.5"
              title={lang === 'en' ? 'Click for another tip!' : 'Нажми, чтобы обновить фразу!'}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 group-hover:rotate-12 transition-transform" />
              <span className="italic font-medium">{splashText}</span>
            </div>
          </div>

          {/* Daily Progress */}
          <div className="sm:w-64 p-3.5 rounded-xl bg-white/45 dark:bg-slate-900/60 border border-white/70 dark:border-white/10 space-y-2 shadow-sm backdrop-blur-md">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                {t('home.daily_goal')}
              </span>
              <span className="text-sky-600 dark:text-sky-400 font-mono font-bold">
                {cardsReviewedToday} / {dailyGoalTarget}
              </span>
            </div>
            <ProgressBar
              value={(cardsReviewedToday / Math.max(1, dailyGoalTarget)) * 100}
              height="sm"
              variant="gradient"
            />
          </div>
        </div>
      </GlassPanel>

      {/* Due SRS Cards & Continue Lesson */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Due Cards */}
        <Card className="flex flex-col justify-between p-5 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4 shrink-0" />
                {t('home.due_cards_title')}
              </span>
              <Badge variant={dueCardIds.length > 0 ? 'warning' : 'success'} size="sm">
                {dueCardIds.length}
              </Badge>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {isInitialLoaded
                ? dueCardIds.length > 0
                  ? t('home.due_cards_count', { count: dueCardIds.length })
                  : t('home.all_caught_up')
                : (lang === 'en' ? 'Checking due cards...' : 'Проверка карточек...')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Алгоритм FSRS рассчитывает оптимальный интервал повторения для максимального удержания в долговременной памяти.
            </p>
          </div>

          <Button
            variant={dueCardIds.length > 0 ? 'primary' : 'secondary'}
            size="md"
            fullWidth
            onClick={() => navigate('/cards')}
            icon={<RotateCcw className="w-4 h-4" />}
          >
            {t('home.due_cards_start')}
          </Button>
        </Card>

        {/* Continue Learning */}
        <Card className="flex flex-col justify-between p-5 space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 shrink-0" />
              {t('home.continue_learning')}
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
              {isInitialLoaded
                ? lastIncompleteLesson
                  ? getLocalized(lastIncompleteLesson.title, lang)
                  : (lang === 'en' ? 'All available lessons completed!' : 'Все доступные уроки завершены!')
                : (lang === 'en' ? 'Loading next lesson...' : 'Поиск следующего урока...')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {lastIncompleteLesson
                ? 'Закрепите теорию и пройдите мини-квиз для перехода к следующему разделу.'
                : 'Вы изучили весь базовый курс ML! Закрепляйте знания в режиме Экзамена.'}
            </p>
          </div>

          {lastIncompleteLesson ? (
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() =>
                navigate(
                  `/module/${lastIncompleteLesson.moduleId}/lesson/${lastIncompleteLesson.lessonId}`
                )
              }
              icon={<Play className="w-4 h-4 fill-current" />}
            >
              Перейти к уроку
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => navigate('/exam')}
            >
              Сдать экзамен
            </Button>
          )}
        </Card>
      </div>

      {/* Quick Glossary Quick-Access Banner */}
      <div
        onClick={() => {
          platform.haptics.light();
          navigate('/glossary');
        }}
        className="relative overflow-hidden rounded-2xl border border-sky-500/20 dark:border-white/10 bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-purple-500/10 hover:from-sky-500/15 hover:via-indigo-500/15 hover:to-purple-500/15 p-4 sm:p-5 transition-all duration-200 cursor-pointer shadow-xs group"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0 group-hover:scale-105 transition-transform shadow-xs">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">
                  {lang === 'en' ? 'ML Formulas & Glossary' : 'Глоссарий формул & терминов'}
                </h4>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/20 text-sky-700 dark:text-sky-300">
                  F1, L1, ROC, PPO...
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 mt-0.5">
                {lang === 'en'
                  ? 'Quick cheat sheet: math formulas, production use cases, and interview gotchas.'
                  : 'Быстрый справочник: математические формулы, для чего применять и подводные камни на собеседованиях.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-white/10 text-xs font-bold text-sky-600 dark:text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition shadow-2xs shrink-0">
            <span className="hidden sm:inline">{lang === 'en' ? 'Open' : 'Открыть'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Modules and Learning Path Tabs */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Segmented Control / Tabs */}
          <div className="inline-flex p-1.5 rounded-2xl aero-inset border border-slate-200/80 dark:border-white/10 w-full sm:w-auto">
            <button
              onClick={() => {
                platform.haptics.light();
                setHomeTab('modules');
                setSearchParams({}, { replace: true });
              }}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                homeTab === 'modules'
                  ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-sm border border-slate-200/60 dark:border-white/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4 text-sky-500 shrink-0" />
              <span>{lang === 'en' ? 'Learning Modules' : 'Учебные модули'}</span>
            </button>

            <button
              onClick={() => {
                platform.haptics.light();
                setHomeTab('roadmap');
                setSearchParams({ tab: 'roadmap' }, { replace: true });
              }}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                homeTab === 'roadmap'
                  ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-sm border border-slate-200/60 dark:border-white/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4 text-violet-500 shrink-0" />
              <span>{lang === 'en' ? 'Roadmap' : 'Роадмап'}</span>
            </button>
          </div>

          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            {contentRegistry.modules.filter(m => !m.meta.isPlaceholder).length} {lang === 'en' ? 'modules total' : 'разделов'}
          </span>
        </div>

        {homeTab === 'modules' ? (
          <div className="grid grid-cols-1 gap-3">
            {contentRegistry.modules.map((mod) => {
              const isPlaceholder = mod.meta.isPlaceholder;
              const completedInModule = mod.lessons.filter(l =>
                completedLessonIds.has(l.id)
              ).length;
              const totalInModule = mod.lessons.length;
              const progressPercent = totalInModule > 0 ? (completedInModule / totalInModule) * 100 : 0;
              const isCompleted = totalInModule > 0 && completedInModule === totalInModule;

              return (
                <Card
                  key={mod.meta.id}
                  interactive={!isPlaceholder}
                  onClick={() => {
                    if (!isPlaceholder) {
                      platform.haptics.light();
                      navigate(`/module/${mod.meta.id}?from=modules`);
                    }
                  }}
                  className={`transition ${
                    isPlaceholder
                      ? 'opacity-60 cursor-not-allowed border-dashed'
                      : 'hover:border-sky-500/40'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-white/50 dark:bg-slate-900/80 border border-white/80 dark:border-white/10 flex items-center justify-center shrink-0 shadow-sm backdrop-blur-md">
                        <ModuleIcon moduleId={mod.meta.id} className="w-6 h-6" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                            #{mod.meta.order}
                          </span>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                            {mod.meta.title[lang]}
                          </h4>
                          {isCompleted && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                          )}
                          {isPlaceholder && (
                            <Badge variant="neutral" size="sm">
                              Скоро
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 max-w-xl leading-relaxed">
                          <MathText text={mod.meta.description[lang]} inlineOnly />
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1 font-medium">
                          <span className="flex items-center gap-1 shrink-0 whitespace-nowrap">
                            <Clock className="w-3 h-3 shrink-0" />
                            {t('home.estimated_time', { min: mod.meta.estimatedMinutes })}
                          </span>
                          <span className="text-slate-300 dark:text-slate-600 select-none">•</span>
                          <span className="shrink-0 whitespace-nowrap">
                            {t('home.lessons_count', { count: mod.lessons.length })}
                          </span>
                          <span className="text-slate-300 dark:text-slate-600 select-none">•</span>
                          <span className="shrink-0 whitespace-nowrap">{mod.cards.length} карточек</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress & Action */}
                    <div className="sm:w-40 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                      {!isPlaceholder ? (
                        <>
                          <div className="w-full space-y-1">
                            <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                              <span>Прогресс</span>
                              <span className="text-sky-600 dark:text-sky-400 font-bold">{Math.round(progressPercent)}%</span>
                            </div>
                            <ProgressBar value={progressPercent} height="sm" variant={isCompleted ? 'success' : 'cyan'} />
                          </div>
                          <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-500">
                            Открыть <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                          </span>
                        </>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Lock className="w-4 h-4 shrink-0" />
                          <span>В разработке</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <LearningRoadmap completedLessonIds={completedLessonIds} />
        )}
      </div>
    </div>
  );
};
