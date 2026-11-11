import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  GraduationCap,
  Clock,
  CheckCircle2,
  XCircle,
  Trophy,
  ArrowRight,
  Sparkles,
  BookOpen,
  RotateCcw,
  ListChecks,
} from 'lucide-react';
import { GlassPanel } from '@/shared/ui/GlassPanel';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { ProgressBar } from '@/shared/ui/ProgressBar';
import { MathText } from '@/shared/lib/katex/MathText';
import { contentRegistry } from '@/shared/content';
import { QuizQuestion, getLocalized } from '@/shared/lib/schemas';
import { CodeFillQuestion } from '@/shared/ui/CodeFillQuestion';
import { quizRepository } from '@/entities/quiz/model/repository';
import { xpRepository } from '@/entities/xp/model/repository';
import { streakRepository } from '@/entities/streak/model/repository';
import { achievementRepository } from '@/entities/achievement/model/repository';
import { fireCelebrationConfetti } from '@/shared/ui/Confetti';
import { PASSING_EXAM_PERCENT, XP_REWARDS } from '@/shared/config';
import { platform } from '@/shared/lib/platform';
import { ModuleIcon } from '@/shared/ui/AppIcons';

interface ExamTopic {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  timeLimitSec: number;
  moduleId: string; // 'all' or specific module id
}

export const ExamPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === 'en' ? 'en' : 'ru') as 'ru' | 'en';
  const navigate = useNavigate();

  // Selected topic for exam
  const [selectedTopicId, setSelectedTopicId] = useState<string>('comprehensive');

  const [isStarted, setIsStarted] = useState(false);
  const [examQuestions, setExamQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [timeLeftSec, setTimeLeftSec] = useState<number>(30 * 60);
  const [isFinished, setIsFinished] = useState(false);
  const [startedAt, setStartedAt] = useState('');

  // Build exam topics list dynamically based on loaded modules
  const allModules = contentRegistry.getAllModules();
  const topics: ExamTopic[] = [
    {
      id: 'comprehensive',
      title: 'Генеральный экзамен (Все темы)',
      description: 'Комплексная аттестация по всем модулям: линейные модели, Байес, деревья, бустинг и нейросети.',
      questionCount: 20,
      timeLimitSec: 30 * 60, // 30 minutes
      moduleId: 'all',
    },
    ...allModules.map(m => {
      const titleStr = typeof m.meta.title === 'string' ? m.meta.title : (lang === 'en' ? m.meta.title.en : m.meta.title.ru);
      const descStr = typeof m.meta.description === 'string' ? m.meta.description : (lang === 'en' ? m.meta.description.en : m.meta.description.ru);
      return {
        id: m.meta.id,
        title: `Экзамен: ${titleStr}`,
        description: descStr,
        questionCount: Math.min(10, Math.max(5, m.quiz.length || 10)),
        timeLimitSec: 15 * 60, // 15 minutes
        moduleId: m.meta.id,
      };
    }),
  ];

  const currentTopic = topics.find(tp => tp.id === selectedTopicId) || topics[0];

  // Start Exam
  const handleStartExam = () => {
    platform.haptics.medium();

    let pool: QuizQuestion[] = [];
    if (currentTopic.moduleId === 'all') {
      pool = contentRegistry.getAllQuizQuestions();
    } else {
      pool = contentRegistry.getQuizQuestionsByModule(currentTopic.moduleId);
    }

    if (pool.length === 0) {
      pool = contentRegistry.getAllQuizQuestions();
    }

    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const count = Math.min(currentTopic.questionCount, shuffled.length);
    const selected = shuffled.slice(0, count);

    setExamQuestions(selected);
    setCurrentIndex(0);
    setUserAnswers({});
    setTimeLeftSec(currentTopic.timeLimitSec);
    setIsStarted(true);
    setIsFinished(false);
    setStartedAt(new Date().toISOString());
  };

  // Timer countdown
  useEffect(() => {
    if (!isStarted || isFinished) return;

    const timer = setInterval(() => {
      setTimeLeftSec((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, isFinished]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const checkAnswer = (q: QuizQuestion, ans: any): boolean => {
    if (ans === undefined) return false;
    if (q.type === 'single' || q.type === 'code_fill') return ans === q.correctAnswer;
    if (q.type === 'multiple') {
      const arr = (ans as number[]) || [];
      return (
        arr.length === q.correctAnswers.length &&
        [...arr].sort().every((v, i) => v === [...q.correctAnswers].sort()[i])
      );
    }
    if (q.type === 'numeric') {
      const num = parseFloat(String(ans).replace(',', '.'));
      return !isNaN(num) && Math.abs(num - q.numericAnswer) <= (q.tolerance || 0.01);
    }
    if (q.type === 'formula') {
      return String(ans).replace(/\s+/g, '').toLowerCase() === q.formulaAnswer.replace(/\s+/g, '').toLowerCase();
    }
    return false;
  };

  const handleFinishExam = async () => {
    setIsFinished(true);

    let score = 0;
    for (const q of examQuestions) {
      if (checkAnswer(q, userAnswers[q.id])) {
        score++;
      }
    }

    const total = examQuestions.length;
    const percentage = Math.round((score / Math.max(1, total)) * 100);
    const passed = percentage >= PASSING_EXAM_PERCENT;

    await quizRepository.saveQuizAttempt({
      quizId: `exam_${currentTopic.id}`,
      moduleId: currentTopic.moduleId,
      answers: userAnswers,
      score,
      total,
      startedAt,
    });

    if (passed) {
      const reward = currentTopic.moduleId === 'all' ? XP_REWARDS.EXAM_PASSED : 150;
      await xpRepository.addXP(reward, `Экзамен сдан: ${currentTopic.title}`);
      await achievementRepository.unlock('exam_passed');
      fireCelebrationConfetti();
      platform.haptics.success();
    } else {
      platform.haptics.error();
    }

    await streakRepository.recordActivityToday();
  };

  // Welcome / Topic Selection screen
  if (!isStarted) {
    return (
      <div className="max-w-3xl mx-auto py-6 space-y-6">
        <GlassPanel glow className="p-6 sm:p-8 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-500/15 border border-sky-400/30 text-sky-400 shadow-lg mx-auto">
            <GraduationCap className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Экзаменационная аттестация
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
              Выберите генеральный экзамен по всему курсу или тематический срез знаний по конкретному модулю.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 max-w-md mx-auto">
            Порог сдачи: {PASSING_EXAM_PERCENT}% правильных ответов. Награды в XP начисляются при успешной сдаче.
          </div>
        </GlassPanel>

        {/* Topic Selector List */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-sky-500" />
            <span>Выберите тему экзамена:</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {topics.map((tp) => {
              const isSelected = selectedTopicId === tp.id;
              return (
                <div
                  key={tp.id}
                  onClick={() => {
                    platform.haptics.light();
                    setSelectedTopicId(tp.id);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'border-sky-500 bg-sky-500/10 dark:bg-sky-500/15 shadow-md shadow-sky-500/10 ring-2 ring-sky-500/40'
                      : 'border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 hover:border-sky-400/50 hover:bg-white/90 dark:hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 pt-0.5 text-sky-600 dark:text-sky-400">
                      <ModuleIcon moduleId={tp.moduleId === 'all' ? 'linear-models' : tp.moduleId} className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                          {tp.title}
                        </h4>
                        {tp.id === 'comprehensive' && (
                          <Badge variant="cyan" size="sm">
                            Курс
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {tp.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-200/60 dark:border-white/5 text-slate-500 dark:text-slate-400 font-medium">
                    <span className="flex items-center gap-1 text-sky-700 dark:text-sky-400">
                      <BookOpen className="w-3.5 h-3.5" />
                      {tp.questionCount} вопросов
                    </span>
                    <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                      <Clock className="w-3.5 h-3.5" />
                      {Math.round(tp.timeLimitSec / 60)} мин
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Topic Action Bar */}
        <div className="p-4 rounded-2xl aero-glass border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5 text-center sm:text-left">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Выбран экзамен:</span>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {currentTopic.title} ({currentTopic.questionCount} вопросов, {Math.round(currentTopic.timeLimitSec / 60)} мин)
            </h4>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-auto shrink-0"
            onClick={handleStartExam}
            icon={<GraduationCap className="w-5 h-5" />}
          >
            Начать аттестацию
          </Button>
        </div>
      </div>
    );
  }

  // Result Screen
  if (isFinished) {
    let score = 0;
    const mistakes: QuizQuestion[] = [];
    for (const q of examQuestions) {
      if (checkAnswer(q, userAnswers[q.id])) {
        score++;
      } else {
        mistakes.push(q);
      }
    }
    const percent = Math.round((score / Math.max(1, examQuestions.length)) * 100);
    const passed = percent >= PASSING_EXAM_PERCENT;
    const earnedXP = currentTopic.moduleId === 'all' ? XP_REWARDS.EXAM_PASSED : 150;

    return (
      <div className="max-w-xl mx-auto py-8 space-y-6">
        <GlassPanel glow className="p-6 sm:p-8 text-center space-y-4">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl border shadow-lg mx-auto ${
              passed
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/15 border-rose-500/30 text-rose-400'
            }`}
          >
            {passed ? (
              <CheckCircle2 className="w-8 h-8" />
            ) : (
              <XCircle className="w-8 h-8" />
            )}
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {passed ? t('exam.passed_title') : t('exam.failed_title')}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {passed
                ? `Поздравляем! Вы успешно подтвердили компетенции по теме: ${currentTopic.title}.`
                : `Для успешной сдачи необходимо набрать не менее ${PASSING_EXAM_PERCENT}%. Рекомендуем повторить теорию и карточки.`}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 max-w-sm mx-auto text-center space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400">Результат аттестации</span>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {score} / {examQuestions.length}{' '}
              <span className={`text-base font-semibold ${passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                ({percent}%)
              </span>
            </p>
          </div>

          {passed && (
            <Badge variant="success" size="md">
              Награда: +{earnedXP} XP
            </Badge>
          )}

          {/* Mistakes analysis */}
          {mistakes.length > 0 && (
            <div className="text-left space-y-3 pt-4 border-t border-slate-200 dark:border-white/10">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200">
                Разбор допущенных ошибок ({mistakes.length}):
              </h3>
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {mistakes.map((mq) => (
                  <Card key={mq.id} className="p-3.5 space-y-2 border-red-500/20 bg-red-500/5">
                    <h5 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      <MathText text={getLocalized(mq.question, lang)} />
                    </h5>
                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      <span className="font-semibold text-sky-700 dark:text-sky-400">Пояснение: </span>
                      <MathText text={getLocalized(mq.explanation, lang)} />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 flex flex-col gap-2.5">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => {
                setIsStarted(false);
                setIsFinished(false);
              }}
              icon={<RotateCcw className="w-5 h-5" />}
            >
              К выбору тем экзамена
            </Button>
            <Button variant="secondary" size="md" fullWidth onClick={() => navigate('/')}>
              На главную
            </Button>
          </div>
        </GlassPanel>
      </div>
    );
  }

  const currentQ = examQuestions[currentIndex];
  const currentAnswer = userAnswers[currentQ.id];

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {/* Timer & Question Counter Header */}
      <div className="flex items-center justify-between p-3 rounded-2xl aero-glass border border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 dark:text-sky-400">
          <GraduationCap className="w-4 h-4" />
          <span>
            {currentTopic.title} • Вопрос {currentIndex + 1} из {examQuestions.length}
          </span>
        </div>
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold ${
            timeLeftSec < 180
              ? 'bg-red-500/20 text-red-600 dark:text-red-400 animate-pulse'
              : 'bg-slate-200 dark:bg-slate-900 text-slate-800 dark:text-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{formatTimer(timeLeftSec)}</span>
        </div>
      </div>

      <ProgressBar
        value={((currentIndex + 1) / examQuestions.length) * 100}
        height="sm"
        variant="gradient"
      />

      {/* Exam Question Card */}
      <GlassPanel className="p-6 space-y-5">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
          <MathText text={getLocalized(currentQ.question, lang)} />
        </h3>

        {currentQ.type === 'single' && (
          <div className="space-y-2.5">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = currentAnswer === optIdx;
              return (
                <div
                  key={optIdx}
                  onClick={() => {
                    platform.haptics.light();
                    setUserAnswers(prev => ({ ...prev, [currentQ.id]: optIdx }));
                  }}
                  className={`p-3.5 rounded-xl border text-xs sm:text-sm cursor-pointer transition ${
                    isSelected
                      ? 'border-sky-500 bg-sky-500/15 text-sky-950 dark:text-sky-100 font-medium ring-1 ring-sky-500/40'
                      : 'border-slate-200 dark:border-white/10 hover:border-sky-400/40 bg-white/70 dark:bg-slate-900/60 text-slate-800 dark:text-slate-300'
                  }`}
                >
                  <MathText text={getLocalized(opt, lang)} />
                </div>
              );
            })}
          </div>
        )}

        {currentQ.type === 'multiple' && (
          <div className="space-y-2.5">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'en' ? 'Select all correct options:' : 'Выберите все верные варианты:'}
            </span>
            {currentQ.options.map((opt, optIdx) => {
              const arr = (currentAnswer as number[]) || [];
              const isSelected = arr.includes(optIdx);

              return (
                <div
                  key={optIdx}
                  onClick={() => {
                    platform.haptics.light();
                    const nextArr = isSelected
                      ? arr.filter(i => i !== optIdx)
                      : [...arr, optIdx];
                    setUserAnswers(prev => ({ ...prev, [currentQ.id]: nextArr }));
                  }}
                  className={`p-3.5 rounded-xl border text-xs sm:text-sm cursor-pointer transition flex items-center justify-between ${
                    isSelected
                      ? 'border-sky-500 bg-sky-500/15 text-sky-950 dark:text-sky-100 font-medium ring-1 ring-sky-500/40'
                      : 'border-slate-200 dark:border-white/10 hover:border-sky-400/40 bg-white/70 dark:bg-slate-900/60 text-slate-800 dark:text-slate-300'
                  }`}
                >
                  <MathText text={getLocalized(opt, lang)} />
                  <input
                    type="checkbox"
                    checked={isSelected}
                    readOnly
                    className="w-4 h-4 rounded text-sky-500 border-slate-300 dark:border-slate-700"
                  />
                </div>
              );
            })}
          </div>
        )}

        {(currentQ.type === 'numeric' || currentQ.type === 'formula') && (
          <div className="space-y-2">
            <input
              type="text"
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
              placeholder={
                currentQ.type === 'numeric'
                  ? (lang === 'en' ? 'Numeric answer (e.g. 0.5)' : 'Числовой ответ (например, 0.5)')
                  : (lang === 'en' ? 'Formula (e.g. X^T y)' : 'Формула (например, X^T y)')
              }
              value={currentAnswer || ''}
              onChange={(e) =>
                setUserAnswers(prev => ({ ...prev, [currentQ.id]: e.target.value }))
              }
            />
          </div>
        )}

        {currentQ.type === 'code_fill' && (
          <CodeFillQuestion
            question={getLocalized(currentQ.question, lang)}
            codeSnippet={currentQ.codeSnippet}
            options={currentQ.options}
            selectedOption={currentAnswer}
            onSelectOption={(optIdx) => {
              setUserAnswers(prev => ({ ...prev, [currentQ.id]: optIdx }));
            }}
            isSubmitted={false}
            correctAnswer={currentQ.correctAnswer}
            language={currentQ.language}
          />
        )}
      </GlassPanel>

      {/* Navigation between questions */}
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="secondary"
          size="md"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
        >
          Предыдущий
        </Button>

        {currentIndex < examQuestions.length - 1 ? (
          <Button
            variant="primary"
            size="md"
            onClick={() => setCurrentIndex(prev => prev + 1)}
          >
            Следующий
          </Button>
        ) : (
          <Button
            variant="success"
            size="md"
            onClick={handleFinishExam}
            icon={<CheckCircle2 className="w-4 h-4" />}
          >
            Завершить экзамен
          </Button>
        )}
      </div>
    </div>
  );
};
