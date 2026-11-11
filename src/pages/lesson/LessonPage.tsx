import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { GlassPanel } from '@/shared/ui/GlassPanel';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { MathText } from '@/shared/lib/katex/MathText';
import { MLDiagrams } from '@/shared/ui/MLDiagrams';
import { contentRegistry } from '@/shared/content';
import { lessonRepository } from '@/entities/lesson/model/repository';
import { xpRepository } from '@/entities/xp/model/repository';
import { streakRepository } from '@/entities/streak/model/repository';
import { achievementRepository } from '@/entities/achievement/model/repository';
import { getLocalized } from '@/shared/lib/schemas';
import { XP_REWARDS } from '@/shared/config';
import { platform } from '@/shared/lib/platform';
import { LessonPracticeBlock } from '@/widgets/lesson/LessonPracticeBlock';

export const LessonPage: React.FC = () => {
  const { moduleId, lessonId } = useParams<{ moduleId: string; lessonId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromSource = searchParams.get('from');
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === 'en' ? 'en' : 'ru') as 'ru' | 'en';

  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  const lesson = moduleId && lessonId ? contentRegistry.getLesson(moduleId, lessonId) : undefined;
  const moduleData = moduleId ? contentRegistry.getModule(moduleId) : undefined;

  useEffect(() => {
    setSelectedAnswers({});
    setShowResults(false);
    setIsFinishing(false);

    async function checkCompletion() {
      if (lessonId) {
        const completed = await lessonRepository.isLessonCompleted(lessonId);
        setIsCompleted(completed);
      }
    }
    checkCompletion();
    // Scroll to top on lesson switch
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [lessonId]);

  if (!lesson || !moduleData) {
    return (
      <div className="py-12 text-center space-y-4">
        <p className="text-slate-400">Урок не найден</p>
        <Button onClick={() => navigate('/')}>На главную</Button>
      </div>
    );
  }

  const DiagramComponent = lesson.svgDiagram ? MLDiagrams[lesson.svgDiagram] : null;

  const handleSelectAnswer = (qIdx: number, optIdx: number) => {
    platform.haptics.light();
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleCompleteLesson = async () => {
    if (!moduleId || !lessonId) return;
    setIsFinishing(true);

    await lessonRepository.markLessonCompleted(lessonId, moduleId, 100);
    await xpRepository.addXP(XP_REWARDS.LESSON_COMPLETE, `Урок: ${lesson.title}`);
    await streakRepository.recordActivityToday();
    await achievementRepository.unlock('first_lesson');

    // Check count of completed lessons
    const allCompletedLessons = await lessonRepository.getAllProgress();
    if (allCompletedLessons.length >= 5) {
      await achievementRepository.unlock('lessons_5');
    }
    if (allCompletedLessons.length >= 15) {
      await achievementRepository.unlock('lessons_15');
    }

    // Check if entire module completed
    if (moduleId === 'python-foundations') {
      const pyMod = contentRegistry.getModule('python-foundations');
      const pyDoneCount = allCompletedLessons.filter(l => l.moduleId === 'python-foundations').length;
      if (pyMod && pyDoneCount >= pyMod.lessons.length) {
        await achievementRepository.unlock('python_guru');
      }
    } else if (moduleId === 'mlops-production') {
      const mlopsMod = contentRegistry.getModule('mlops-production');
      const mlopsDoneCount = allCompletedLessons.filter(l => l.moduleId === 'mlops-production').length;
      if (mlopsMod && mlopsDoneCount >= mlopsMod.lessons.length) {
        await achievementRepository.unlock('mlops_architect');
      }
    }

    platform.haptics.success();
    setIsCompleted(true);
    setIsFinishing(false);

    const fromQuery = fromSource ? `?from=${fromSource}` : '';
    // Find next lesson in module
    const currentIdx = moduleData.lessons.findIndex(l => l.id === lessonId);
    if (currentIdx !== -1 && currentIdx < moduleData.lessons.length - 1) {
      const nextLesson = moduleData.lessons[currentIdx + 1];
      navigate(`/module/${moduleId}/lesson/${nextLesson.id}${fromQuery}`);
    } else {
      navigate(`/module/${moduleId}${fromQuery}`);
    }
  };

  // Deterministically shuffle quiz options so the correct answer is never always at index 0
  const checkpointQuizzes = useMemo(() => {
    if (!lesson.checkpointQuiz || lesson.checkpointQuiz.length === 0) return [];
    return lesson.checkpointQuiz.map((q) => {
      const indexed = q.options.map((opt, idx) => ({
        opt,
        isCorrect: idx === q.correctAnswer,
      }));

      let hash = 0;
      const seedStr = `${q.id}-${lesson.id}`;
      for (let i = 0; i < seedStr.length; i++) {
        hash = (hash << 5) - hash + seedStr.charCodeAt(i);
        hash |= 0;
      }
      let state = Math.abs(hash) || 5381;

      const shuffled = [...indexed];
      for (let i = shuffled.length - 1; i > 0; i--) {
        state = (state * 1664525 + 1013904223) % 4294967296;
        const j = Math.floor((state / 4294967296) * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      // If correct answer still happened to land at index 0 and options count > 1, swap it so it's not always first
      const firstCorrectIdx = shuffled.findIndex(item => item.isCorrect);
      if (firstCorrectIdx === 0 && shuffled.length > 1) {
        const targetSlot = (seedStr.length % (shuffled.length - 1)) + 1;
        [shuffled[0], shuffled[targetSlot]] = [shuffled[targetSlot], shuffled[0]];
      }

      const newCorrectIdx = shuffled.findIndex(item => item.isCorrect);

      return {
        ...q,
        options: shuffled.map(item => item.opt),
        correctAnswer: newCorrectIdx,
      };
    });
  }, [lesson.id, lesson.checkpointQuiz]);

  const allAnswered = checkpointQuizzes.length === 0 || checkpointQuizzes.every((_, idx) => selectedAnswers[idx] !== undefined);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => {
          platform.haptics.light();
          navigate(`/module/${moduleId}${fromSource ? `?from=${fromSource}` : ''}`);
        }}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Назад к урокам</span>
      </button>

      {/* Lesson Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="cyan" size="sm">
            {lang === 'en' ? `Module ${moduleData.meta.order}` : `Модуль ${moduleData.meta.order}`}
          </Badge>
          {isCompleted && (
            <Badge variant="success" size="sm" icon={<CheckCircle2 className="w-3 h-3" />}>
              {lang === 'en' ? 'Completed' : 'Пройден'}
            </Badge>
          )}
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          {getLocalized(lesson.title, lang)}
        </h1>
      </div>

      {/* Theory Body */}
      <GlassPanel className="p-6 sm:p-8 space-y-6 leading-relaxed text-slate-800 dark:text-slate-200 shadow-sm">
        {/* SVG Diagram if available */}
        {DiagramComponent && (
          <div className="my-2">
            <DiagramComponent />
          </div>
        )}

        <div className="space-y-4 text-sm sm:text-base leading-relaxed">
          <MathText text={getLocalized(lesson.theoryMarkdown, lang)} />
        </div>

        {/* Common Mistakes */}
        {lesson.commonMistakes && lesson.commonMistakes.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
              <AlertCircle className="w-4 h-4" />
              <span>{t('lesson.common_mistakes')}</span>
            </div>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
              {lesson.commonMistakes.map((mistake, idx) => (
                <li key={idx} className="leading-relaxed">
                  <MathText text={getLocalized(mistake, lang)} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </GlassPanel>

      {/* Hands-on Practice Block */}
      <LessonPracticeBlock
        lesson={lesson}
        lang={lang}
      />

      {/* Checkpoint Mini-Quiz */}
      {checkpointQuizzes.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {t('lesson.checkpoint_quiz')}
            </h3>
          </div>

          <div className="space-y-4">
            {checkpointQuizzes.map((q, qIdx) => {
              const selected = selectedAnswers[qIdx];
              const isAnswered = selected !== undefined;
              const isCorrect = selected === q.correctAnswer;

              return (
                <Card key={q.id} className="p-5 space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    <MathText text={getLocalized(q.question, lang)} />
                  </h4>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      let btnStyle = 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 bg-white/70 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200';
                      if (isAnswered) {
                        if (optIdx === q.correctAnswer) {
                          btnStyle = 'border-emerald-500/60 bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-medium';
                        } else if (selected === optIdx) {
                          btnStyle = 'border-red-500/60 bg-red-500/15 text-red-800 dark:text-red-300';
                        }
                      } else if (selected === optIdx) {
                        btnStyle = 'border-sky-500 bg-sky-500/20 text-slate-900 dark:text-white font-medium';
                      }

                      return (
                        <div
                          key={optIdx}
                          onClick={() => !isAnswered && handleSelectAnswer(qIdx, optIdx)}
                          className={`p-3.5 rounded-xl border text-xs sm:text-sm cursor-pointer transition flex items-center justify-between shadow-xs ${btnStyle}`}
                        >
                          <MathText text={getLocalized(opt, lang)} />
                          {isAnswered && optIdx === q.correctAnswer && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 ml-2" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {isAnswered && (
                    <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                      <span className="font-bold text-sky-600 dark:text-sky-400">{lang === 'en' ? 'Explanation: ' : 'Объяснение: '}</span>
                      <MathText text={getLocalized(q.explanation, lang)} />
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Completion Button */}
      <div className="pt-4 pb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>Награда за урок: +{XP_REWARDS.LESSON_COMPLETE} XP</span>
        </div>

        <Button
          variant="primary"
          size="lg"
          disabled={!allAnswered || isFinishing}
          onClick={handleCompleteLesson}
          icon={<CheckCircle2 className="w-5 h-5" />}
        >
          {isCompleted ? 'Урок уже пройден — Далее' : t('lesson.complete_lesson')}
        </Button>
      </div>
    </div>
  );
};
