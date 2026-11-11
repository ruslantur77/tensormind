import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Zap,
  Flame,
  Clock,
  Trophy,
  Check,
  X,
  Play,
  RotateCcw,
  Layers,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Gauge,
} from 'lucide-react';
import { GlassPanel } from '@/shared/ui/GlassPanel';
import { Button } from '@/shared/ui/Button';
import { MathText } from '@/shared/lib/katex/MathText';
import { contentRegistry } from '@/shared/content';
import { Card as CardType, QuizQuestion, getLocalized } from '@/shared/lib/schemas';
import { speedrunRepository } from '@/entities/speedrun/model/repository';
import { streakRepository } from '@/entities/streak/model/repository';
import { xpRepository } from '@/entities/xp/model/repository';
import { achievementRepository } from '@/entities/achievement/model/repository';
import { fireCelebrationConfetti } from '@/shared/ui/Confetti';
import { platform } from '@/shared/lib/platform';
import { formatClozeQuestion, formatClozeAnswer } from '@/shared/lib/cloze';

interface QuizAnswerRecord {
  question: QuizQuestion;
  selectedIndex: number;
  isCorrect: boolean;
}

export const SpeedrunPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || 'ru') as 'ru' | 'en';

  const [activeTab, setActiveTab] = useState<'cards' | 'quiz'>('cards');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  // High scores
  const [bestCardsScore, setBestCardsScore] = useState(0);
  const [bestQuizScore, setBestQuizScore] = useState(0);

  // Difficulty & Filter State
  const [quizDifficulty, setQuizDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  // Cards Speedrun State
  const [cardsQueue, setCardsQueue] = useState<CardType[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [comboStreak, setComboStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // Speed Quiz State
  const [quizQueue, setQuizQueue] = useState<QuizQuestion[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizElapsedSec, setQuizElapsedSec] = useState(0);
  const [quizHistory, setQuizHistory] = useState<QuizAnswerRecord[]>([]);
  const [quizQuestionCount, setQuizQuestionCount] = useState<number>(25);

  useEffect(() => {
    async function loadHighScores() {
      const bestC = await speedrunRepository.getBestScore('cards');
      const bestQ = await speedrunRepository.getBestScore('quiz');
      setBestCardsScore(bestC);
      setBestQuizScore(bestQ);
    }
    loadHighScores();
  }, []);

  // Timer for Cards (60s countdown)
  useEffect(() => {
    if (!isPlaying || activeTab !== 'cards' || isGameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, activeTab, isGameOver]);

  // Timer for Speed Quiz (elapsed stopwatch)
  useEffect(() => {
    if (!isPlaying || activeTab !== 'quiz' || isGameOver) return;

    const timer = setInterval(() => {
      setQuizElapsedSec((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, activeTab, isGameOver]);

  const startCardsSpeedrun = () => {
    platform.haptics.medium();
    const cards = [...contentRegistry.getAllCards()].sort(() => 0.5 - Math.random());
    setCardsQueue(cards);
    setCardIndex(0);
    setIsCardFlipped(false);
    setTimeLeft(60);
    setScore(0);
    setComboStreak(0);
    setCorrectCount(0);
    setTotalCount(0);
    setIsPlaying(true);
    setIsGameOver(false);
    streakRepository.recordActivityToday();
  };

  const startQuizSpeedrun = (count: number = quizQuestionCount) => {
    platform.haptics.medium();

    // Pool from dedicated blitz questions + module single-choice and code_fill questions
    const allAvailable = [
      ...contentRegistry.getBlitzQuestions(),
      ...contentRegistry.getAllQuizQuestions().filter((q) => q.type === 'single' || q.type === 'code_fill'),
    ];

    // Deduplicate all available questions by question text (Russian key)
    const seen = new Set<string>();
    const allUnique: QuizQuestion[] = [];
    for (const q of allAvailable) {
      const qKey = typeof q.question === 'object' ? q.question.ru : q.question;
      if (!seen.has(qKey)) {
        seen.add(qKey);
        allUnique.push(q);
      }
    }

    let finalQueue: QuizQuestion[] = [];

    if (quizDifficulty === 'all') {
      const shuffled = [...allUnique].sort(() => 0.5 - Math.random());
      finalQueue = shuffled.slice(0, count);

      // If requested count exceeds unique count, cycle/backfill so count is always exact
      let cycleIdx = 0;
      while (finalQueue.length < count && allUnique.length > 0) {
        finalQueue.push(shuffled[cycleIdx % shuffled.length]);
        cycleIdx++;
      }
    } else {
      // Primary matching questions of chosen difficulty
      const matching = allUnique
        .filter((q) => (q.difficulty || 'medium') === quizDifficulty)
        .sort(() => 0.5 - Math.random());

      if (matching.length >= count) {
        finalQueue = matching.slice(0, count);
      } else {
        // Use all available matching questions first
        finalQueue = [...matching];

        // Fill remaining needed questions with other difficulties (closest difficulty prioritized)
        const others = allUnique
          .filter((q) => (q.difficulty || 'medium') !== quizDifficulty)
          .sort((a, b) => {
            if (quizDifficulty === 'hard') {
              if (a.difficulty === 'medium' && b.difficulty === 'easy') return -1;
              if (a.difficulty === 'easy' && b.difficulty === 'medium') return 1;
            }
            if (quizDifficulty === 'easy') {
              if (a.difficulty === 'medium' && b.difficulty === 'hard') return -1;
              if (a.difficulty === 'hard' && b.difficulty === 'medium') return 1;
            }
            return 0.5 - Math.random();
          });

        for (const q of others) {
          if (finalQueue.length >= count) break;
          finalQueue.push(q);
        }

        // If still under count, cycle through available pool
        let cycleIdx = 0;
        const fallbackSource = matching.length > 0 ? matching : allUnique;
        while (finalQueue.length < count && fallbackSource.length > 0) {
          finalQueue.push(fallbackSource[cycleIdx % fallbackSource.length]);
          cycleIdx++;
        }
      }
    }

    setQuizQueue(finalQueue);
    setQuizIndex(0);
    setQuizElapsedSec(0);
    setScore(0);
    setCorrectCount(0);
    setTotalCount(0);
    setQuizHistory([]);
    setIsPlaying(true);
    setIsGameOver(false);
    streakRepository.recordActivityToday();
  };

  const handleCardsAnswer = (knew: boolean) => {
    platform.haptics.light();
    setTotalCount((prev) => prev + 1);

    if (knew) {
      const nextStreak = comboStreak + 1;
      setComboStreak(nextStreak);
      setCorrectCount((prev) => prev + 1);

      // Combo multiplier: 5+ -> x2, 10+ -> x3, 15+ -> x4
      const multiplier = Math.min(5, Math.floor(nextStreak / 5) + 1);
      const points = 10 * multiplier;
      setScore((prev) => prev + points);
    } else {
      setComboStreak(0);
      setScore((prev) => Math.max(0, prev - 10)); // penalty
    }

    setIsCardFlipped(false);
    if (cardIndex < cardsQueue.length - 1) {
      setCardIndex((prev) => prev + 1);
    } else {
      // Loop with re-shuffle
      setCardsQueue((prev) => [...prev].sort(() => 0.5 - Math.random()));
      setCardIndex(0);
    }
  };

  const handleQuizAnswer = (selectedOpt: number) => {
    const q = quizQueue[quizIndex];
    platform.haptics.light();
    const isCorrect = (q.type === 'single' || q.type === 'code_fill') && selectedOpt === q.correctAnswer;

    setTotalCount((prev) => prev + 1);

    // Save answer to history for error review
    setQuizHistory((prev) => [
      ...prev,
      {
        question: q,
        selectedIndex: selectedOpt,
        isCorrect,
      },
    ]);

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      setScore((prev) => prev + 25);
    }

    if (quizIndex < quizQueue.length - 1) {
      setQuizIndex((prev) => prev + 1);
    } else {
      endGame(isCorrect ? score + 25 : score);
    }
  };

  const endGame = async (explicitFinalScore?: number) => {
    setIsGameOver(true);
    setIsPlaying(false);

    let finalScore = explicitFinalScore !== undefined ? explicitFinalScore : score;
    if (activeTab === 'quiz') {
      const speedBonus = Math.max(0, 300 - quizElapsedSec * 3);
      finalScore = finalScore + speedBonus;
      setScore(finalScore);
    }

    await speedrunRepository.saveRecord({
      mode: activeTab,
      score: finalScore,
      correctAnswers: correctCount,
      totalAnswered: totalCount,
    });

    await xpRepository.addXP(Math.floor(finalScore / 5), `Спидран (${activeTab})`);
    await streakRepository.recordActivityToday();

    if (finalScore >= 300) {
      await achievementRepository.unlock('speedrun_ace');
      fireCelebrationConfetti();
    }
    if (finalScore >= 500) {
      await achievementRepository.unlock('speedrun_500');
      fireCelebrationConfetti();
    }

    if (activeTab === 'cards' && finalScore > bestCardsScore) {
      setBestCardsScore(finalScore);
    } else if (activeTab === 'quiz' && finalScore > bestQuizScore) {
      setBestQuizScore(finalScore);
    }

    platform.haptics.success();
  };

  const currentMultiplier = Math.min(5, Math.floor(comboStreak / 5) + 1);
  const incorrectAnswers = quizHistory.filter((item) => !item.isCorrect);

  // Overview / Selection screen
  if (!isPlaying && !isGameOver) {
    return (
      <div className="max-w-xl mx-auto space-y-6 pb-28">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shadow-lg">
            <Zap className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t('speedrun.title')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            {t('speedrun.subtitle')}
          </p>
        </div>

        {/* Mode Selector - Solid Frosted Glass, No Gradients */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl aero-inset">
          <button
            onClick={() => setActiveTab('cards')}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'cards'
                ? 'bg-white/20 dark:bg-white/15 text-slate-900 dark:text-white shadow-sm border border-white/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{t('speedrun.mode_cards')}</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-white/20 dark:bg-white/15 text-slate-900 dark:text-white shadow-sm border border-white/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>{t('speedrun.mode_quiz')}</span>
          </button>
        </div>

        {/* Active Mode Card */}
        {activeTab === 'cards' ? (
          <GlassPanel className="p-6 space-y-5 text-center">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Карточки на скорость (60 секунд)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {t('speedrun.mode_cards_desc')}
              </p>
            </div>

            <div className="p-3.5 rounded-xl aero-inset flex items-center justify-between max-w-xs mx-auto">
              <span className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500" />
                Личный рекорд:
              </span>
              <span className="text-base font-bold text-amber-600 dark:text-amber-400 font-mono">
                {bestCardsScore} очков
              </span>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={startCardsSpeedrun}
              icon={<Play className="w-5 h-5 fill-current" />}
            >
              Начать спидран (60с)
            </Button>
          </GlassPanel>
        ) : (
          <GlassPanel className="p-6 space-y-5 text-center">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Блиц-тест по машинному обучению
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Проверьте свои знания на скорость с детальным разбором допущенных ошибок в конце.
              </p>
            </div>

            {/* Difficulty selector */}
            <div className="space-y-2">
              <span className="text-xs text-slate-600 dark:text-slate-400 block font-medium">
                {lang === 'en' ? 'Difficulty level:' : 'Сложность вопросов:'}
              </span>
              <div className="grid grid-cols-4 gap-1.5 max-w-sm mx-auto">
                {[
                  {
                    id: 'all',
                    label: lang === 'en' ? 'All' : 'Все',
                    icon: <Zap className="w-3.5 h-3.5 shrink-0" />,
                    color: 'text-sky-400',
                  },
                  {
                    id: 'easy',
                    label: lang === 'en' ? 'Easy' : 'Лёгкие',
                    icon: <ShieldCheck className="w-3.5 h-3.5 shrink-0" />,
                    color: 'text-emerald-400',
                  },
                  {
                    id: 'medium',
                    label: lang === 'en' ? 'Medium' : 'Средние',
                    icon: <Gauge className="w-3.5 h-3.5 shrink-0" />,
                    color: 'text-amber-400',
                  },
                  {
                    id: 'hard',
                    label: lang === 'en' ? 'Hard' : 'Сложные',
                    icon: <Flame className="w-3.5 h-3.5 shrink-0" />,
                    color: 'text-rose-400',
                  },
                ].map((diff) => {
                  const isSelected = quizDifficulty === diff.id;
                  return (
                    <button
                      key={diff.id}
                      onClick={() => setQuizDifficulty(diff.id as any)}
                      className={`py-2 px-1 rounded-xl text-[11px] sm:text-xs font-semibold transition border cursor-pointer text-center flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 ${
                        isSelected
                          ? 'bg-sky-500 text-white border-sky-400 shadow-sm'
                          : 'aero-inset text-slate-700 dark:text-slate-300 hover:border-white/30'
                      }`}
                    >
                      <span className={isSelected ? 'text-white' : diff.color}>{diff.icon}</span>
                      <span>{diff.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quiz question count selector */}
            <div className="space-y-2">
              <span className="text-xs text-slate-600 dark:text-slate-400 block font-medium">
                {lang === 'en' ? 'Number of questions:' : 'Количество вопросов:'}
              </span>
              <div className="grid grid-cols-4 gap-2 max-w-xs sm:max-w-sm mx-auto">
                {[10, 25, 50, 75].map((count) => (
                  <button
                    key={count}
                    onClick={() => setQuizQuestionCount(count)}
                    className={`py-2.5 px-2 rounded-xl text-sm sm:text-base font-bold font-mono transition border cursor-pointer text-center ${
                      quizQuestionCount === count
                        ? 'bg-sky-500 text-white border-sky-400 shadow-[0_0_12px_rgba(14,165,233,0.35)]'
                        : 'aero-inset text-slate-700 dark:text-slate-300 hover:border-white/30 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl aero-inset flex items-center justify-between max-w-xs mx-auto">
              <span className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                {lang === 'en' ? 'Personal best:' : 'Личный рекорд:'}
              </span>
              <span className="text-base font-bold text-amber-600 dark:text-amber-400 font-mono">
                {bestQuizScore} {lang === 'en' ? 'pts' : 'очков'}
              </span>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => startQuizSpeedrun(quizQuestionCount)}
              icon={<Play className="w-5 h-5 fill-current" />}
            >
              {lang === 'en'
                ? `Start Blitz Quiz (${quizQuestionCount} questions)`
                : `Начать блиц-тест (${quizQuestionCount} вопросов)`}
            </Button>
          </GlassPanel>
        )}
      </div>
    );
  }

  // Game Over / Results Screen with Mistake Review
  if (isGameOver) {
    return (
      <div className="max-w-xl mx-auto py-4 space-y-6 pb-36">
        <GlassPanel className="p-6 sm:p-8 space-y-5 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shadow-lg">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t('speedrun.game_over')}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Итоговый счет: <strong className="text-sky-600 dark:text-sky-400">{score} очков</strong>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300">
            <div className="p-3.5 rounded-xl aero-inset">
              <span className="text-slate-500 dark:text-slate-400 block mb-1">Точность ответов</span>
              <span className="text-lg font-bold text-sky-700 dark:text-sky-400 font-mono">
                {correctCount} / {totalCount} {totalCount > 0 && `(${Math.round((correctCount / totalCount) * 100)}%)`}
              </span>
            </div>
            <div className="p-3.5 rounded-xl aero-inset">
              <span className="text-slate-500 dark:text-slate-400 block mb-1">Заработано опыта</span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                +{Math.floor(score / 5)} XP
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() =>
                activeTab === 'cards' ? startCardsSpeedrun() : startQuizSpeedrun(quizQuestionCount)
              }
              icon={<RotateCcw className="w-5 h-5" />}
            >
              {t('speedrun.play_again')}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={() => {
                setIsGameOver(false);
                setIsPlaying(false);
              }}
            >
              К выбору режима
            </Button>
          </div>
        </GlassPanel>

        {/* Incorrect Answers Review Section */}
        {activeTab === 'quiz' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <span>Разбор ответов</span>
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {incorrectAnswers.length === 0
                  ? 'Все ответы верные'
                  : `Ошибок: ${incorrectAnswers.length} из ${quizHistory.length}`}
              </span>
            </div>

            {incorrectAnswers.length === 0 ? (
              <GlassPanel className="p-5 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  Идеальный результат!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Вы ответили на все вопросы без единой ошибки.
                </p>
              </GlassPanel>
            ) : (
              <div className="space-y-3">
                {incorrectAnswers.map((item, idx) => {
                  const q = item.question;
                  const userChoiceText =
                    (q.type === 'single' || q.type === 'code_fill')
                      ? getLocalized(q.options[item.selectedIndex], lang)
                      : '';
                  const correctChoiceText =
                    (q.type === 'single' || q.type === 'code_fill')
                      ? getLocalized(q.options[q.correctAnswer], lang)
                      : '';

                  return (
                    <div
                      key={idx}
                      className="p-4 sm:p-5 rounded-2xl aero-card space-y-3"
                    >
                      <div className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                        <MathText text={getLocalized(q.question, lang)} />
                      </div>

                      {q.type === 'code_fill' && (
                        <div className="rounded-xl border border-white/10 bg-[#141517] p-3 text-xs font-mono text-slate-200 whitespace-pre overflow-x-auto">
                          <code>{q.codeSnippet.replace('___', `[ ${correctChoiceText} ]`)}</code>
                        </div>
                      )}

                      <div className="space-y-2 text-xs">
                        {/* User answer (incorrect) */}
                        <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-900 dark:text-rose-300 flex items-start gap-2">
                          <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold block">
                              {lang === 'en' ? 'Your answer (incorrect):' : 'Ваш ответ (неверно):'}
                            </span>
                            <MathText text={userChoiceText || '—'} />
                          </div>
                        </div>

                        {/* Correct answer */}
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-900 dark:text-emerald-300 flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold block">
                              {lang === 'en' ? 'Correct answer:' : 'Правильный ответ:'}
                            </span>
                            <MathText text={correctChoiceText || ''} />
                          </div>
                        </div>

                        {/* Explanation */}
                        {q.explanation && (
                          <div className="p-2.5 rounded-xl aero-inset text-slate-700 dark:text-slate-300">
                            <span className="font-semibold text-slate-900 dark:text-white block mb-1">
                              {lang === 'en' ? 'Explanation:' : 'Пояснение:'}
                            </span>
                            <MathText text={getLocalized(q.explanation, lang)} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Active Cards Speedrun Screen
  if (activeTab === 'cards') {
    const currentCard = cardsQueue[cardIndex];

    const cardQuestionText =
      currentCard?.type === 'flip'
        ? getLocalized(currentCard.front, lang)
        : formatClozeQuestion(getLocalized(currentCard?.clozeText || '', lang));

    const cardRevealedText =
      currentCard?.type === 'flip'
        ? getLocalized(currentCard.back, lang)
        : formatClozeAnswer(getLocalized(currentCard?.clozeText || '', lang));

    return (
      <div className="max-w-xl mx-auto space-y-4 pb-36">
        {/* HUD: Timer, Score, Combo */}
        <div className="flex items-center justify-between p-3 rounded-2xl aero-glass">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full aero-inset text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
            <Clock className="w-4 h-4 shrink-0" />
            <span>{timeLeft}{lang === 'en' ? 's' : 'с'}</span>
          </div>

          <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900 dark:text-white">
            <span>{score} pts</span>
            {currentMultiplier > 1 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 animate-pulse font-semibold">
                x{currentMultiplier}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Flame className="w-4 h-4 fill-emerald-500 text-emerald-500 shrink-0" />
            <span>{comboStreak} {lang === 'en' ? 'streak' : 'подряд'}</span>
          </div>
        </div>

        {/* Card Screen - Scrollable container with safe height in portrait */}
        <div
          className="p-6 sm:p-8 min-h-[260px] max-h-[58vh] overflow-y-auto aero-card rounded-2xl flex flex-col justify-between cursor-pointer"
          onClick={() => setIsCardFlipped((prev) => !prev)}
        >
          <div className="text-center space-y-4 my-auto">
            {/* Question side */}
            <div className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
              <MathText text={cardQuestionText} />
            </div>

            {/* Answer side (revealed on flip) */}
            {isCardFlipped && (
              <div className="pt-4 border-t border-white/10 space-y-2 animate-fade-in text-left sm:text-center">
                <div className="text-sm sm:text-base text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  <MathText text={cardRevealedText} />
                </div>
                {currentCard?.type === 'cloze' && (
                  <div className="inline-block mt-2 px-3 py-1.5 rounded-xl bg-sky-500/15 border border-sky-400/30 text-sky-800 dark:text-sky-300 text-xs font-semibold">
                    {lang === 'en' ? 'Answer: ' : 'Ответ: '}{getLocalized(currentCard.answer, lang)}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="text-center text-[11px] text-slate-500 dark:text-slate-400 pt-3">
            {!isCardFlipped
              ? (lang === 'en' ? 'Tap card to reveal answer' : 'Нажмите на карточку, чтобы увидеть ответ')
              : (lang === 'en' ? 'Rate your answer:' : 'Оцените свой ответ:')}
          </div>
        </div>

        {/* Quick Answer Buttons */}
        {isCardFlipped ? (
          <div className="grid grid-cols-2 gap-3 animate-fade-in">
            <Button
              variant="danger"
              size="lg"
              fullWidth
              onClick={() => handleCardsAnswer(false)}
              icon={<X className="w-5 h-5" />}
            >
              {lang === 'en' ? 'Forgot (-10)' : 'Не знал (-10)'}
            </Button>
            <Button
              variant="success"
              size="lg"
              fullWidth
              onClick={() => handleCardsAnswer(true)}
              icon={<Check className="w-5 h-5" />}
            >
              {lang === 'en' ? `Knew (+${10 * currentMultiplier})` : `Знал (+${10 * currentMultiplier})`}
            </Button>
          </div>
        ) : (
          <Button
            variant="glass"
            size="lg"
            fullWidth
            onClick={() => setIsCardFlipped(true)}
          >
            {lang === 'en' ? 'Show answer' : 'Показать ответ'}
          </Button>
        )}
      </div>
    );
  }

  // Active Speed Quiz Screen
  const currentQuiz = quizQueue[quizIndex];

  return (
    <div className="max-w-xl mx-auto space-y-4 pb-36">
      {/* HUD: Stopwatch, Progress, Score */}
      <div className="flex items-center justify-between p-3 rounded-2xl aero-glass">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full aero-inset text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
          <Clock className="w-4 h-4 shrink-0" />
          <span>{quizElapsedSec}{lang === 'en' ? 's' : 'с'}</span>
        </div>

        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {lang === 'en'
            ? `Question ${quizIndex + 1} of ${quizQueue.length}`
            : `Вопрос ${quizIndex + 1} из ${quizQueue.length}`}
        </span>

        <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
          {score} pts
        </span>
      </div>

      <GlassPanel className="p-6 sm:p-7 space-y-5 max-h-[65vh] overflow-y-auto">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
          <MathText text={getLocalized(currentQuiz?.question || '', lang)} />
        </h3>

        {currentQuiz?.type === 'single' && (
          <div className="space-y-2.5 pt-1">
            {currentQuiz.options.map((opt, optIdx) => (
              <div
                key={optIdx}
                onClick={() => handleQuizAnswer(optIdx)}
                className="p-3.5 rounded-xl border border-white/10 hover:border-white/25 bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 text-xs sm:text-sm text-slate-800 dark:text-slate-200 cursor-pointer transition flex items-center justify-between active:scale-[0.99]"
              >
                <div className="flex items-center gap-2.5 flex-1">
                  <span className="w-5 h-5 rounded-lg aero-inset flex items-center justify-center text-[10px] font-mono text-slate-500 font-bold shrink-0">
                    {optIdx + 1}
                  </span>
                  <MathText text={getLocalized(opt, lang)} />
                </div>
              </div>
            ))}
          </div>
        )}

        {currentQuiz?.type === 'code_fill' && (
          <div className="space-y-3 pt-1">
            <div className="rounded-xl border border-white/10 bg-[#141517] p-3 text-xs font-mono text-slate-200 whitespace-pre overflow-x-auto">
              <code>{currentQuiz.codeSnippet.replace('___', '[ ? ]')}</code>
            </div>
            <div className="space-y-2">
              {currentQuiz.options.map((opt, optIdx) => (
                <div
                  key={optIdx}
                  onClick={() => handleQuizAnswer(optIdx)}
                  className="p-3 rounded-xl border border-white/10 hover:border-white/25 bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 text-xs font-mono text-slate-800 dark:text-slate-200 cursor-pointer transition flex items-center justify-between active:scale-[0.99]"
                >
                  <div className="flex items-center gap-2.5 flex-1">
                    <span className="w-5 h-5 rounded-lg aero-inset flex items-center justify-center text-[10px] font-mono text-slate-500 font-bold shrink-0">
                      {optIdx + 1}
                    </span>
                    <span>{getLocalized(opt, lang)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </GlassPanel>
    </div>
  );
};
