import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Layers,
  HelpCircle,
  Play,
} from 'lucide-react';
import { GlassPanel } from '@/shared/ui/GlassPanel';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { ProgressBar } from '@/shared/ui/ProgressBar';
import { contentRegistry } from '@/shared/content';
import { getLocalized } from '@/shared/lib/schemas';
import { lessonRepository } from '@/entities/lesson/model/repository';
import { platform } from '@/shared/lib/platform';
import { ModuleIcon } from '@/shared/ui/AppIcons';
import { MathText } from '@/shared/lib/katex/MathText';

export const ModulePage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t, i18n } = useTranslation();

  const isFromRoadmap = searchParams.get('from') === 'roadmap';
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());

  const moduleData = moduleId ? contentRegistry.getModule(moduleId) : undefined;
  const lang = (i18n.language === 'en' ? 'en' : 'ru') as 'ru' | 'en';

  useEffect(() => {
    async function loadProgress() {
      const progress = await lessonRepository.getAllProgress();
      setCompletedLessonIds(new Set(progress.map(p => p.lessonId)));
    }
    loadProgress();
  }, [moduleId]);

  if (!moduleData) {
    return (
      <div className="py-12 text-center space-y-4">
        <p className="text-slate-500 dark:text-slate-400">Модуль не найден</p>
        <Button onClick={() => navigate('/')}>На главную</Button>
      </div>
    );
  }

  const completedCount = moduleData.lessons.filter(l => completedLessonIds.has(l.id)).length;
  const totalLessons = moduleData.lessons.length;
  const progressPercent = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => {
          platform.haptics.light();
          navigate(isFromRoadmap ? '/?tab=roadmap' : '/?tab=modules');
        }}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>
          {isFromRoadmap
            ? (lang === 'en' ? 'Path' : 'Путь')
            : (lang === 'en' ? 'Back to Modules' : 'Назад к модулям')}
        </span>
      </button>

      {/* Module Header Card */}
      <GlassPanel glow className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0 shadow-md">
              <ModuleIcon moduleId={moduleData.meta.id} className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-mono text-sky-600 dark:text-sky-400 font-bold">
                Модуль {moduleData.meta.order}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {moduleData.meta.title[lang]}
              </h2>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                <MathText text={moduleData.meta.description[lang]} inlineOnly />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex sm:flex-col gap-2 shrink-0">
            {moduleData.cards.length > 0 && (
              <Button
                variant="glass"
                size="sm"
                icon={<Layers className="w-4 h-4 text-sky-500" />}
                onClick={() => navigate(`/cards?module=${moduleData.meta.id}`)}
              >
                Карточки ({moduleData.cards.length})
              </Button>
            )}
            {moduleData.quiz.length > 0 && (
              <Button
                variant="glass"
                size="sm"
                icon={<HelpCircle className="w-4 h-4 text-indigo-500" />}
                onClick={() => navigate(`/quiz?module=${moduleData.meta.id}`)}
              >
                Тест ({moduleData.quiz.length})
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>
              Пройдено: {completedCount} из {totalLessons} уроков
            </span>
            <span className="text-sky-600 dark:text-sky-400 font-bold">{Math.round(progressPercent)}%</span>
          </div>
          <ProgressBar value={progressPercent} height="sm" variant="gradient" />
        </div>
      </GlassPanel>

      {/* Lessons List */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-sky-500" />
          <span>Уроки раздела</span>
        </h3>

        <div className="space-y-2.5">
          {moduleData.lessons.map((lesson, idx) => {
            const isCompleted = completedLessonIds.has(lesson.id);

            return (
              <Card
                key={lesson.id}
                interactive
                onClick={() => {
                  platform.haptics.light();
                  navigate(
                    `/module/${moduleData.meta.id}/lesson/${lesson.id}${
                      isFromRoadmap ? '?from=roadmap' : '?from=modules'
                    }`
                  );
                }}
                className="hover:border-sky-500/40 p-4 transition"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-white/50 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-white/80 dark:border-white/10 backdrop-blur-sm'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {getLocalized(lesson.title, lang)}
                        </h4>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        <span className="flex items-center gap-1 shrink-0 whitespace-nowrap">
                          <Clock className="w-3 h-3 shrink-0" />
                          {lesson.estimatedMinutes} мин
                        </span>
                        {lesson.checkpointQuiz && (
                          <>
                            <span className="text-slate-300 dark:text-slate-600 select-none">•</span>
                            <span className="shrink-0 whitespace-nowrap">{lesson.checkpointQuiz.length} проверочных вопросов</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl text-slate-400 hover:text-sky-500 transition shrink-0">
                    <Play className="w-4 h-4 fill-current" />
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
