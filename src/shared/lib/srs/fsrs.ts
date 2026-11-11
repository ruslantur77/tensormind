import { fsrs, Rating, Card as FSRSCard, State, RecordLog } from 'ts-fsrs';

export type SRSRating = 'again' | 'hard' | 'good' | 'easy';

export interface CardStateData {
  cardId: string;
  due: string; // ISO date
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  reps: number;
  lapses: number;
  state: number; // 0: New, 1: Learning, 2: Review, 3: Relearning
  last_review?: string; // ISO date
  updatedAt: string;
}

const f = fsrs({
  request_retention: 0.9,
  maximum_interval: 36500,
  w: [0.4, 0.6, 2.4, 5.8, 4.93, 0.94, 0.86, 0.01, 1.49, 0.14, 0.94, 2.18, 0.05, 0.34, 1.26, 0.29, 2.61],
});

export function createNewCardState(cardId: string): CardStateData {
  const now = new Date().toISOString();
  return {
    cardId,
    due: now,
    stability: 0,
    difficulty: 0,
    elapsed_days: 0,
    scheduled_days: 0,
    reps: 0,
    lapses: 0,
    state: State.New,
    last_review: undefined,
    updatedAt: now,
  };
}

export function calculateNextReview(
  currentState: CardStateData,
  ratingName: SRSRating
): { nextState: CardStateData; log: { rating: number; elapsedDays: number } } {
  const ratingMap: Record<SRSRating, Rating> = {
    again: Rating.Again,
    hard: Rating.Hard,
    good: Rating.Good,
    easy: Rating.Easy,
  };

  const now = new Date();
  const fsrsRating = ratingMap[ratingName];

  try {
    const card: FSRSCard = {
      due: new Date(currentState.due),
      stability: currentState.stability,
      difficulty: currentState.difficulty,
      elapsed_days: currentState.elapsed_days,
      scheduled_days: currentState.scheduled_days,
      reps: currentState.reps,
      lapses: currentState.lapses,
      state: currentState.state as State,
      last_review: currentState.last_review ? new Date(currentState.last_review) : undefined,
      learning_steps: 0,
    };

    const record: RecordLog = f.repeat(card, now);
    const item = record[fsrsRating as Exclude<Rating, Rating.Manual>];
    const newCard = item.card;

    const nextState: CardStateData = {
      cardId: currentState.cardId,
      due: newCard.due.toISOString(),
      stability: Number(newCard.stability.toFixed(2)),
      difficulty: Number(newCard.difficulty.toFixed(2)),
      elapsed_days: newCard.elapsed_days,
      scheduled_days: newCard.scheduled_days,
      reps: newCard.reps,
      lapses: newCard.lapses,
      state: newCard.state,
      last_review: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    return {
      nextState,
      log: {
        rating: fsrsRating,
        elapsedDays: newCard.elapsed_days,
      },
    };
  } catch (err) {
    console.warn('FSRS execution fallback to SM-2', err);
    // Fallback SM-2
    return calculateSM2Fallback(currentState, ratingName);
  }
}

// Fallback SM-2 calculation
function calculateSM2Fallback(
  currentState: CardStateData,
  ratingName: SRSRating
): { nextState: CardStateData; log: { rating: number; elapsedDays: number } } {
  const now = new Date();
  let interval = 1;
  let reps = currentState.reps + 1;
  let lapses = currentState.lapses;

  if (ratingName === 'again') {
    interval = 1;
    reps = 0;
    lapses += 1;
  } else if (ratingName === 'hard') {
    interval = Math.max(1, Math.round((currentState.scheduled_days || 1) * 1.2));
  } else if (ratingName === 'good') {
    interval = Math.max(1, Math.round((currentState.scheduled_days || 1) * 2.2));
  } else if (ratingName === 'easy') {
    interval = Math.max(2, Math.round((currentState.scheduled_days || 1) * 3.5));
  }

  const nextDueDate = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);

  const nextState: CardStateData = {
    ...currentState,
    due: nextDueDate.toISOString(),
    scheduled_days: interval,
    reps,
    lapses,
    state: ratingName === 'again' ? 3 : 2,
    last_review: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  return {
    nextState,
    log: {
      rating: ratingName === 'again' ? 1 : ratingName === 'hard' ? 2 : ratingName === 'good' ? 3 : 4,
      elapsedDays: interval,
    },
  };
}
