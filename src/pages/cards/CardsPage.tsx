import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  RotateCcw,
  Check,
  ArrowRight,
  Layers,
  Keyboard,
} from 'lucide-react';
import { GlassPanel } from '@/shared/ui/GlassPanel';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { ProgressBar } from '@/shared/ui/ProgressBar';
import { MathText } from '@/shared/lib/katex/MathText';
import { formatClozeQuestion, formatClozeAnswer } from '@/shared/lib/cloze';
import { contentRegistry } from '@/shared/content';
import { Card, getLocalized } from '@/shared/lib/schemas';
import { cardRepository } from '@/entities/card/model/repository';
import { xpRepository } from '@/entities/xp/model/repository';
import { streakRepository } from '@/entities/streak/model/repository';
import { achievementRepository } from '@/entities/achievement/model/repository';
import { fireCelebrationConfetti } from '@/shared/ui/Confetti';
import { SRSRating } from '@/shared/lib/srs/fsrs';
import { XP_REWARDS } from '@/shared/config';
import { platform } from '@/shared/lib/platform';

export const CardsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === 'en' ? 'en' : 'ru') as 'ru' | 'en';

  const moduleId = searchParams.get('module');

  const [queue, setQueue] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [clozeInput, setClozeInput] = useState('');
  const [clozeChecked, setClozeChecked] = useState(false);
  const [isClozeCorrect, setIsClozeCorrect] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [earnedXP, setEarnedXP] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    async function loadCards() {
      let cardsToReview: Card[] = [];

      if (moduleId) {
        // Module specific review
        cardsToReview = contentRegistry.getCardsByModule(moduleId);
      } else {
        // Global review: due cards prioritized
        const allCards = contentRegistry.getAllCards();
        const dueIds = await cardRepository.getDueCards(allCards.map(c => c.id));
        const dueSet = new Set(dueIds);

        const dueCards = allCards.filter(c => dueSet.has(c.id));
        const remainingCards = allCards.filter(c => !dueSet.has(c.id));

        // If no due cards, let user practice available cards
        cardsToReview = dueCards.length > 0 ? dueCards : remainingCards;
      }

      setQueue(cardsToReview);
      setCurrentIndex(0);
      setIsFlipped(false);
      setIsFinished(cardsToReview.length === 0);
    }

    loadCards();
  }, [moduleId]);

  const currentCard = queue[currentIndex];

  const handleFlip = () => {
    platform.haptics.light();
    setIsFlipped(prev => !prev);
  };

  const handleRating = async (rating: SRSRating) => {
    if (!currentCard) return;

    platform.haptics.light();
    await cardRepository.recordReview(currentCard.id, rating);
    await xpRepository.addXP(XP_REWARDS.SRS_CARD_REVIEW, 'SRS Review');
    await streakRepository.recordActivityToday();

    const newReviewedCount = reviewedCount + 1;
    setReviewedCount(newReviewedCount);
    setEarnedXP(prev => prev + XP_REWARDS.SRS_CARD_REVIEW);

    // Check card achievements
    if (newReviewedCount >= 25) {
      await achievementRepository.unlock('cards_master_25');
    }
    if (newReviewedCount >= 100) {
      await achievementRepository.unlock('cards_master_100');
    }
    if (newReviewedCount >= 250) {
      await achievementRepository.unlock('cards_master_250');
    }

    // Reset card state
    setIsFlipped(false);
    setClozeInput('');
    setClozeChecked(false);

    if (currentIndex < queue.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
      platform.haptics.success();
      fireCelebrationConfetti();
    }
  };

  const handleCheckCloze = () => {
    if (!currentCard || currentCard.type !== 'cloze') return;

    platform.haptics.light();
    const normalizedInput = clozeInput.trim().toLowerCase();
    const rawAnswer = getLocalized(currentCard.answer, lang);
    const normalizedAnswer = rawAnswer.trim().toLowerCase();
    const correct = normalizedInput === normalizedAnswer || normalizedAnswer.includes(normalizedInput);

    setIsClozeCorrect(correct);
    setClozeChecked(true);
    setIsFlipped(true);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFinished || !currentCard) return;

      if (e.key === ' ' || e.key === 'Enter') {
        if (currentCard.type === 'cloze' && !clozeChecked) {
          handleCheckCloze();
        } else if (!isFlipped) {
          handleFlip();
        }
      } else if (isFlipped) {
        if (e.key === '1') handleRating('again');
        else if (e.key === '2') handleRating('hard');
        else if (e.key === '3') handleRating('good');
        else if (e.key === '4') handleRating('easy');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFinished, isFlipped, clozeChecked, currentCard]);

  // Session Completed State
  if (isFinished || queue.length === 0) {
    return (
      <div className="max-w-md mx-auto py-8 text-center space-y-6 pb-36">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-lg mx-auto">
          <Check className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t('cards.session_complete')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t('cards.session_complete_sub')}
          </p>
        </div>

        <GlassPanel className="p-6 grid grid-cols-2 gap-4">
          <div className="text-center space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400">Повторено</span>
            <p className="text-2xl font-bold text-sky-700 dark:text-sky-400">{reviewedCount}</p>
          </div>
          <div className="text-center space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400">Заработано XP</span>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">+{earnedXP}</p>
          </div>
        </GlassPanel>

        <div className="flex flex-col gap-3">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigate('/')}
            icon={<ArrowRight className="w-5 h-5" />}
          >
            {t('cards.back_home')}
          </Button>

          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={() => {
              setCurrentIndex(0);
              setIsFinished(false);
              setReviewedCount(0);
              setEarnedXP(0);
            }}
          >
            {t('cards.repeat_more')}
          </Button>
        </div>
      </div>
    );
  }

  const progressPercent = ((currentIndex + 1) / queue.length) * 100;

  return (
    <div className="max-w-xl mx-auto space-y-5 pb-36">
      {/* Top Session Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5 text-sky-700 dark:text-sky-400">
            <Layers className="w-4 h-4" />
            <span>Карточка {currentIndex + 1} из {queue.length}</span>
          </span>
          <span className="text-sky-700 dark:text-sky-400 font-bold">+{earnedXP} XP</span>
        </div>
        <ProgressBar value={progressPercent} height="sm" variant="cyan" />
      </div>

      {/* Main Flashcard Container with Flip Animation */}
      <div className="perspective-1000 min-h-[320px]">
        <GlassPanel
          glow={isFlipped}
          className="p-6 sm:p-8 min-h-[320px] max-h-[60vh] overflow-y-auto flex flex-col justify-between transition-all duration-300 relative cursor-pointer"
          onClick={() => {
            if (currentCard.type !== 'cloze' || clozeChecked) {
              handleFlip();
            }
          }}
        >
          {/* Top metadata tags */}
          <div className="flex items-center justify-between">
            <Badge variant="cyan" size="sm">
              {currentCard.type === 'cloze' ? 'Cloze-тест' : 'Вопрос — Ответ'}
            </Badge>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Keyboard className="w-3 h-3" />
              Пробел — перевернуть
            </span>
          </div>

          {/* Card Content Area */}
          <div className="py-6 space-y-4 text-center my-auto">
            {currentCard.type === 'flip' ? (
              <>
                <div className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                  <MathText text={getLocalized(currentCard.front, lang)} />
                </div>

                {isFlipped && (
                  <div className="pt-4 border-t border-slate-200 dark:border-white/10 text-sm sm:text-base text-sky-800 dark:text-sky-300 font-medium leading-relaxed animate-fade-in">
                    <MathText text={getLocalized(currentCard.back, lang)} />
                  </div>
                )}
              </>
            ) : (
              // Cloze Card
              <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
                <div className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                  <MathText
                    text={
                      clozeChecked
                        ? formatClozeAnswer(getLocalized(currentCard.clozeText, lang))
                        : formatClozeQuestion(getLocalized(currentCard.clozeText, lang))
                    }
                  />
                </div>

                {!clozeChecked ? (
                  <div className="space-y-3 max-w-sm mx-auto">
                    <input
                      type="text"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-center text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
                      placeholder={t('cards.type_cloze_placeholder')}
                      value={clozeInput}
                      onChange={(e) => setClozeInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCheckCloze()}
                      autoFocus
                    />
                    <Button fullWidth size="md" variant="primary" onClick={handleCheckCloze}>
                      {t('cards.check_cloze')}
                    </Button>
                  </div>
                ) : (
                  <div
                    className={`p-3 rounded-xl border text-sm font-semibold ${
                      isClozeCorrect
                        ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-900 dark:text-emerald-300'
                        : 'border-amber-500/40 bg-amber-500/15 text-amber-900 dark:text-amber-300'
                    }`}
                  >
                    {lang === 'en' ? 'Correct answer: ' : 'Правильный ответ: '}{getLocalized(currentCard.answer, lang)}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hint / Instruction */}
          <div className="text-center text-[11px] text-slate-500 dark:text-slate-400">
            {!isFlipped && currentCard.type === 'flip' && (
              <span>{t('cards.tap_to_flip')}</span>
            )}
          </div>
        </GlassPanel>
      </div>

      {/* SRS Rating Action Buttons (Active when flipped) */}
      {isFlipped ? (
        <div className="space-y-2 pt-2 animate-fade-in">
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => handleRating('again')}
              className="p-3 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-800 dark:text-red-300 flex flex-col items-center justify-center cursor-pointer transition active:scale-95"
            >
              <span className="text-xs font-bold">{t('cards.again')}</span>
              <span className="text-[10px] text-red-600 dark:text-red-400 font-mono mt-0.5">&lt;10 мин [1]</span>
            </button>

            <button
              onClick={() => handleRating('hard')}
              className="p-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-800 dark:text-amber-300 flex flex-col items-center justify-center cursor-pointer transition active:scale-95"
            >
              <span className="text-xs font-bold">{t('cards.hard')}</span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono mt-0.5">1-2 дн [2]</span>
            </button>

            <button
              onClick={() => handleRating('good')}
              className="p-3 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-800 dark:text-sky-300 flex flex-col items-center justify-center cursor-pointer transition active:scale-95"
            >
              <span className="text-xs font-bold">{t('cards.good')}</span>
              <span className="text-[10px] text-sky-600 dark:text-sky-400 font-mono mt-0.5">3-5 дн [3]</span>
            </button>

            <button
              onClick={() => handleRating('easy')}
              className="p-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex flex-col items-center justify-center cursor-pointer transition active:scale-95"
            >
              <span className="text-xs font-bold">{t('cards.easy')}</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">7+ дн [4]</span>
            </button>
          </div>
        </div>
      ) : (
        <Button
          variant="glass"
          size="lg"
          fullWidth
          onClick={handleFlip}
          icon={<RotateCcw className="w-5 h-5" />}
        >
          {t('cards.show_answer')}
        </Button>
      )}
    </div>
  );
};
