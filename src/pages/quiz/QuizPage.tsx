import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
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
import { achievementRepository } from '@/entities/achievement/model/repository';
import { streakRepository } from '@/entities/streak/model/repository';
import { fireCelebrationConfetti } from '@/shared/ui/Confetti';
import { XP_REWARDS } from '@/shared/config';
import { platform } from '@/shared/lib/platform';

export const QuizPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === 'en' ? 'en' : 'ru') as 'ru' | 'en';

  const moduleId = searchParams.get('module');

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Form inputs for numeric & formula
  const [inputVal, setInputVal] = useState('');
  const [startedAt, setStartedAt] = useState('');

  useEffect(() => {
    let qList: QuizQuestion[] = [];
    if (moduleId) {
      qList = contentRegistry.getQuizQuestionsByModule(moduleId);
    } else {
      qList = contentRegistry.getAllQuizQuestions();
    }
    setQuestions(qList);
    setCurrentIndex(0);
    setUserAnswers({});
    setIsAnswerSubmitted(false);
    setIsFinished(qList.length === 0);
    setStartedAt(new Date().toISOString());
  }, [moduleId]);

  const currentQ = questions[currentIndex];

  const handleSubmitAnswer = () => {
    if (!currentQ) return;
    platform.haptics.light();
    setIsAnswerSubmitted(true);
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsAnswerSubmitted(false);
      setInputVal('');
    } else {
      await finishQuiz();
    }
  };

  const checkQuestionCorrect = (q: QuizQuestion, ans: any): boolean => {
    if (ans === undefined) return false;
    if (q.type === 'single' || q.type === 'code_fill') {
      return ans === q.correctAnswer;
    }
    if (q.type === 'multiple') {
      const arr = (ans as number[]) || [];
      if (arr.length !== q.correctAnswers.length) return false;
      const sortedUser = [...arr].sort();
      const sortedCorrect = [...q.correctAnswers].sort();
      return sortedUser.every((v, i) => v === sortedCorrect[i]);
    }
    if (q.type === 'numeric') {
      const num = parseFloat(String(ans).replace(',', '.'));
      return !isNaN(num) && Math.abs(num - q.numericAnswer) <= (q.tolerance || 0.01);
    }
    if (q.type === 'formula') {
      const normUser = String(ans).replace(/\s+/g, '').toLowerCase();
      const normCorrect = q.formulaAnswer.replace(/\s+/g, '').toLowerCase();
      return normUser === normCorrect;
    }
    return false;
  };

  const finishQuiz = async () => {
    let score = 0;
    for (const q of questions) {
      if (checkQuestionCorrect(q, userAnswers[q.id])) {
        score++;
      }
    }

    const total = questions.length;
    const percentage = Math.round((score / Math.max(1, total)) * 100);

    await quizRepository.saveQuizAttempt({
      quizId: moduleId || 'general_quiz',
      moduleId: moduleId || 'all',
      answers: userAnswers,
      score,
      total,
      startedAt,
    });

    // XP calculation
    const earnedXP = score * XP_REWARDS.QUIZ_CORRECT_ANSWER + (percentage === 100 ? XP_REWARDS.QUIZ_PERFECT_BONUS : 0);
    await xpRepository.addXP(earnedXP, `Тест: ${score}/${total}`);
    await streakRepository.recordActivityToday();

    if (percentage === 100) {
      await achievementRepository.unlock('perfect_quiz');
      fireCelebrationConfetti();
    }

    const allAttempts = await quizRepository.getAllAttempts();
    if (allAttempts.length >= 5) {
      await achievementRepository.unlock('quiz_veteran_5');
    }

    platform.haptics.success();
    setIsFinished(true);
  };

  if (isFinished || questions.length === 0) {
    let score = 0;
    const mistakes: QuizQuestion[] = [];
    for (const q of questions) {
      if (checkQuestionCorrect(q, userAnswers[q.id])) {
        score++;
      } else {
        mistakes.push(q);
      }
    }
    const percent = Math.round((score / Math.max(1, questions.length)) * 100);

    return (
      <div className="max-w-xl mx-auto py-8 space-y-6 pb-36">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shadow-lg mx-auto">
            <Trophy className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t('quiz.score_title')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t('quiz.score_desc', { score, total: questions.length, percent })}
          </p>
        </div>

        {/* Mistakes Review */}
        {mistakes.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
              {t('quiz.review_mistakes')} ({mistakes.length})
            </h3>
            <div className="space-y-3">
              {mistakes.map((mq) => (
                <Card key={mq.id} className="p-4 space-y-2 border-red-500/20 bg-red-500/5">
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
                    <MathText text={getLocalized(mq.question, lang)} />
                  </h4>
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-sky-700 dark:text-sky-400">{lang === 'en' ? 'Explanation: ' : 'Пояснение: '}</span>
                    <MathText text={getLocalized(mq.explanation, lang)} />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-2">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigate('/')}
            icon={<ArrowRight className="w-5 h-5" />}
          >
            На главную
          </Button>

          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={() => {
              setCurrentIndex(0);
              setUserAnswers({});
              setIsAnswerSubmitted(false);
              setIsFinished(false);
            }}
            icon={<RotateCcw className="w-4 h-4" />}
          >
            {t('quiz.retry')}
          </Button>
        </div>
      </div>
    );
  }

  const currentAnswer = userAnswers[currentQ.id];
  const isCorrect = isAnswerSubmitted ? checkQuestionCorrect(currentQ, currentAnswer) : false;
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5 text-sky-700 dark:text-sky-400">
            <HelpCircle className="w-4 h-4" />
            <span>{t('quiz.question_of', { current: currentIndex + 1, total: questions.length })}</span>
          </span>
          {currentQ.tag && (
            <Badge variant="neutral" size="sm">
              #{currentQ.tag}
            </Badge>
          )}
        </div>
        <ProgressBar value={progressPercent} height="sm" variant="gradient" />
      </div>

      {/* Question Card */}
      <GlassPanel className="p-6 sm:p-7 space-y-5">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
          <MathText text={getLocalized(currentQ.question, lang)} />
        </h3>

        {/* Question Types */}
        {currentQ.type === 'single' && (
          <div className="space-y-2.5">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = currentAnswer === optIdx;
              let style = 'border-slate-200 dark:border-white/10 hover:border-sky-400/50 bg-white/70 dark:bg-slate-900/60 text-slate-800 dark:text-slate-300';

              if (isAnswerSubmitted) {
                if (optIdx === currentQ.correctAnswer) {
                  style = 'border-emerald-500/60 bg-emerald-500/15 text-emerald-900 dark:text-emerald-300 font-medium';
                } else if (isSelected) {
                  style = 'border-red-500/60 bg-red-500/15 text-red-900 dark:text-red-300 font-medium';
                }
              } else if (isSelected) {
                style = 'border-sky-500 bg-sky-500/15 text-sky-950 dark:text-white font-medium ring-1 ring-sky-500/40';
              }

              return (
                <div
                  key={optIdx}
                  onClick={() => {
                    if (!isAnswerSubmitted) {
                      platform.haptics.light();
                      setUserAnswers(prev => ({ ...prev, [currentQ.id]: optIdx }));
                    }
                  }}
                  className={`p-3.5 rounded-xl border text-xs sm:text-sm cursor-pointer transition flex items-center justify-between ${style}`}
                >
                  <MathText text={getLocalized(opt, lang)} />
                  {isAnswerSubmitted && optIdx === currentQ.correctAnswer && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                  )}
                  {isAnswerSubmitted && isSelected && optIdx !== currentQ.correctAnswer && (
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 ml-2" />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {currentQ.type === 'multiple' && (
          <div className="space-y-2.5">
            <span className="text-xs text-slate-500 dark:text-slate-400">Выберите все подходящие варианты:</span>
            {currentQ.options.map((opt, optIdx) => {
              const currentArr = (currentAnswer as number[]) || [];
              const isSelected = currentArr.includes(optIdx);
              const isOptionCorrect = currentQ.correctAnswers.includes(optIdx);

              let style = 'border-slate-200 dark:border-white/10 hover:border-sky-400/50 bg-white/70 dark:bg-slate-900/60 text-slate-800 dark:text-slate-300';
              if (isAnswerSubmitted) {
                if (isOptionCorrect) {
                  style = 'border-emerald-500/60 bg-emerald-500/15 text-emerald-900 dark:text-emerald-300 font-medium';
                } else if (isSelected) {
                  style = 'border-red-500/60 bg-red-500/15 text-red-900 dark:text-red-300 font-medium';
                }
              } else if (isSelected) {
                style = 'border-sky-500 bg-sky-500/15 text-sky-950 dark:text-white font-medium ring-1 ring-sky-500/40';
              }

              return (
                <div
                  key={optIdx}
                  onClick={() => {
                    if (!isAnswerSubmitted) {
                      platform.haptics.light();
                      const nextArr = isSelected
                        ? currentArr.filter(i => i !== optIdx)
                        : [...currentArr, optIdx];
                    setUserAnswers(prev => ({ ...prev, [currentQ.id]: nextArr }));
                    }
                  }}
                  className={`p-3.5 rounded-xl border text-xs sm:text-sm cursor-pointer transition flex items-center justify-between ${style}`}
                >
                  <MathText text={getLocalized(opt, lang)} />
                  <input
                    type="checkbox"
                    checked={isSelected}
                    readOnly
                    className="w-4 h-4 rounded text-sky-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
              );
            })}
          </div>
        )}

        {(currentQ.type === 'numeric' || currentQ.type === 'formula') && (
          <div className="space-y-3">
            <input
              type="text"
              disabled={isAnswerSubmitted}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
              placeholder={currentQ.type === 'numeric' ? (lang === 'en' ? 'Enter a number (e.g., 0.5)' : 'Введите число (например, 0.5)') : (lang === 'en' ? 'Enter a formula (e.g., X^T y)' : 'Введите формулу (например, X^T y)')}
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
                setUserAnswers(prev => ({ ...prev, [currentQ.id]: e.target.value }));
              }}
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
              if (!isAnswerSubmitted) {
                setUserAnswers(prev => ({ ...prev, [currentQ.id]: optIdx }));
              }
            }}
            isSubmitted={isAnswerSubmitted}
            correctAnswer={currentQ.correctAnswer}
            language={currentQ.language}
          />
        )}

        {/* Explanation Banner */}
        {isAnswerSubmitted && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-1.5 animate-fade-in">
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <Badge variant="success" size="sm" icon={<CheckCircle2 className="w-3 h-3" />}>
                  {t('quiz.correct')}
                </Badge>
              ) : (
                <Badge variant="warning" size="sm" icon={<XCircle className="w-3 h-3" />}>
                  {t('quiz.incorrect')}
                </Badge>
              )}
            </div>
            <div className="text-xs text-slate-800 dark:text-slate-300 leading-relaxed pt-1">
              <span className="font-semibold text-sky-700 dark:text-sky-400">{t('quiz.explanation')} </span>
              <MathText text={getLocalized(currentQ.explanation, lang)} />
            </div>
          </div>
        )}
      </GlassPanel>

      {/* Action Button */}
      {!isAnswerSubmitted ? (
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={currentAnswer === undefined || currentAnswer === ''}
          onClick={handleSubmitAnswer}
        >
          {t('quiz.submit_answer')}
        </Button>
      ) : (
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleNext}
          icon={<ArrowRight className="w-5 h-5" />}
        >
          {currentIndex < questions.length - 1 ? t('quiz.next_question') : t('quiz.finish_quiz')}
        </Button>
      )}
    </div>
  );
};
