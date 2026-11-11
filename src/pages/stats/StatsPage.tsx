import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart3,
  Flame,
  Sparkles,
  Trophy,
  Layers,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { GlassPanel } from '@/shared/ui/GlassPanel';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { ProgressBar } from '@/shared/ui/ProgressBar';
import { xpRepository } from '@/entities/xp/model/repository';
import { streakRepository } from '@/entities/streak/model/repository';
import { cardRepository } from '@/entities/card/model/repository';
import { lessonRepository } from '@/entities/lesson/model/repository';
import { quizRepository } from '@/entities/quiz/model/repository';
import { achievementRepository, ACHIEVEMENTS_LIST } from '@/entities/achievement/model/repository';
import { contentRegistry } from '@/shared/content';
import { AchievementIcon } from '@/shared/ui/AppIcons';
import { STATS_UPDATED_EVENT } from '@/shared/lib/events';

export const StatsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === 'en' ? 'en' : 'ru') as 'ru' | 'en';

  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [activeDates, setActiveDates] = useState<string[]>([]);
  const [cardsReviewedCount, setCardsReviewedCount] = useState(0);
  const [lessonsCompletedCount, setLessonsCompletedCount] = useState(0);
  const [unlockedAchievementIds, setUnlockedAchievementIds] = useState<Set<string>>(new Set());
  const [weakTopics, setWeakTopics] = useState<{ tag: string; mistakes: number }[]>([]);

  useEffect(() => {
    async function loadStats() {
      const xp = await xpRepository.getTotalXP();
      setTotalXP(xp);
      setLevel(xpRepository.calculateLevel(xp));

      const streak = await streakRepository.getStreak();
      setCurrentStreak(streak.currentStreak);
      setLongestStreak(streak.longestStreak);
      setActiveDates(streak.activeDates || []);

      const cardStates = await cardRepository.getAllCardStates();
      setCardsReviewedCount(cardStates.filter(c => c.reps > 0).length);

      const lessons = await lessonRepository.getAllProgress();
      setLessonsCompletedCount(lessons.length);

      const unlocked = await achievementRepository.getUnlocked();
      setUnlockedAchievementIds(new Set(unlocked.map(a => a.achievementId)));

      // Analyze weak topics from quiz attempts
      const attempts = await quizRepository.getAllAttempts();
      const allQ = contentRegistry.getAllQuizQuestions();
      const qMap = new Map(allQ.map(q => [q.id, q]));

      const tagMistakes: Record<string, number> = {};
      for (const attempt of attempts) {
        for (const [qId, ans] of Object.entries(attempt.answers)) {
          const q = qMap.get(qId);
          if (q && q.tag) {
            let isCorrect = false;
            if (q.type === 'single') isCorrect = ans === q.correctAnswer;
            else if (q.type === 'multiple') isCorrect = Array.isArray(ans) && ans.length === q.correctAnswers.length;
            else if (q.type === 'numeric') isCorrect = Math.abs(parseFloat(ans) - q.numericAnswer) <= (q.tolerance || 0.01);
            else if (q.type === 'formula') isCorrect = String(ans).toLowerCase().trim() === q.formulaAnswer.toLowerCase().trim();

            if (!isCorrect) {
              tagMistakes[q.tag] = (tagMistakes[q.tag] || 0) + 1;
            }
          }
        }
      }

      const sortedWeak = Object.entries(tagMistakes)
        .map(([tag, mistakes]) => ({ tag, mistakes }))
        .sort((a, b) => b.mistakes - a.mistakes)
        .slice(0, 5);

      setWeakTopics(sortedWeak);
    }

    loadStats();
    window.addEventListener(STATS_UPDATED_EVENT, loadStats);
    return () => {
      window.removeEventListener(STATS_UPDATED_EVENT, loadStats);
    };
  }, []);

  const { currentLevelXP, nextLevelXP } = xpRepository.getXPForNextLevel(level);
  const xpInCurrentLevel = totalXP - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;
  const levelProgress = Math.min(100, Math.max(0, (xpInCurrentLevel / Math.max(1, xpNeeded)) * 100));

  // Generate last 14 days calendar
  const last14Days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const localDateStr = `${year}-${month}-${day}`;
    const isoDateStr = d.toISOString().slice(0, 10);
    const isActive = activeDates.includes(localDateStr) || activeDates.includes(isoDateStr);
    return {
      date: localDateStr,
      day: d.getDate(),
      month: d.toLocaleString(lang === 'en' ? 'en-US' : 'ru-RU', { month: 'short' }),
      isActive,
    };
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t('stats.title')}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Детальная аналитика вашего прогресса и удержания знаний
          </p>
        </div>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4 space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            Всего опыта
          </span>
          <p className="text-xl sm:text-2xl font-extrabold text-sky-700 dark:text-sky-400 font-mono">
            {totalXP} XP
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Уровень {level}</span>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            Текущий стрик
          </span>
          <p className="text-xl sm:text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
            {currentStreak} дн.
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Рекорд: {longestStreak} дн.</span>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            Карточки
          </span>
          <p className="text-xl sm:text-2xl font-extrabold text-indigo-700 dark:text-indigo-400 font-mono">
            {cardsReviewedCount}
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">в долговременной памяти</span>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
            Уроки
          </span>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 font-mono">
            {lessonsCompletedCount}
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">полностью пройдено</span>
        </Card>
      </div>

      {/* Level Progress */}
      <GlassPanel className="p-5 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-700 dark:text-slate-300">
            Уровень {level} → Уровень {level + 1}
          </span>
          <span className="text-sky-700 dark:text-sky-400 font-mono font-bold">
            {xpInCurrentLevel} / {xpNeeded} XP
          </span>
        </div>
        <ProgressBar value={levelProgress} height="md" variant="gradient" />
      </GlassPanel>

      {/* 14-day Habit Calendar */}
      <GlassPanel className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sky-500" />
            <span>Календарь активности (последние 14 дней)</span>
          </h3>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {activeDates.length} активных дней
          </span>
        </div>

        <div className="grid grid-cols-7 sm:grid-cols-14 gap-2 pt-1">
          {last14Days.map((d, i) => (
            <div
              key={i}
              className={`p-2 rounded-xl flex flex-col items-center justify-center text-center transition ${
                d.isActive
                  ? 'bg-amber-500/20 border border-amber-500/40 text-amber-800 dark:text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.15)] font-semibold'
                  : 'bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-500'
              }`}
            >
              <span className="text-[10px] text-slate-500 dark:text-slate-400">{d.month}</span>
              <span className="text-xs font-bold font-mono">{d.day}</span>
              <div
                className={`w-1.5 h-1.5 rounded-full mt-1 ${
                  d.isActive ? 'bg-amber-500' : 'bg-transparent'
                }`}
              />
            </div>
          ))}
        </div>
      </GlassPanel>

      {/* Weak Topics Section */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-500" />
          <span>{t('stats.weak_topics_title')}</span>
        </h3>

        {weakTopics.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {weakTopics.map((item, idx) => (
              <Card key={idx} className="p-3.5 flex items-center justify-between border-amber-500/20 bg-amber-500/5">
                <div className="space-y-0.5">
                  <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200">
                    #{item.tag}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    Ошибок в тестах: {item.mistakes}
                  </span>
                </div>
                <Badge variant="warning" size="sm">
                  Требует повторения
                </Badge>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center text-slate-500 dark:text-slate-400 text-xs">
            {t('stats.no_weak_topics')}
          </Card>
        )}
      </div>

      {/* Achievements Showcase */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>{t('stats.achievements_title')}</span>
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {unlockedAchievementIds.size} / {ACHIEVEMENTS_LIST.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {ACHIEVEMENTS_LIST.map((ach) => {
            const isUnlocked = unlockedAchievementIds.has(ach.id);

            return (
              <Card
                key={ach.id}
                className={`p-4 transition ${
                  isUnlocked
                    ? 'border-sky-500/30 bg-sky-500/5 shadow-[0_0_15px_rgba(14,165,233,0.1)]'
                    : 'opacity-50 grayscale border-dashed'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 shrink-0">
                    <AchievementIcon achievementId={ach.id} className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {lang === 'en' ? ach.titleEn : ach.titleRu}
                      </h4>
                      {isUnlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                      {lang === 'en' ? ach.descEn : ach.descRu}
                    </p>
                    <span className="text-[10px] font-mono text-sky-700 dark:text-sky-400 block pt-0.5">
                      +{ach.xpReward} XP
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
