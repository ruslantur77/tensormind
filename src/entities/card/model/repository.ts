import { db, ReviewLogRecord } from '@/shared/lib/db';
import {
  CardStateData,
  createNewCardState,
  calculateNextReview,
  SRSRating,
} from '@/shared/lib/srs/fsrs';

export const cardRepository = {
  async getCardState(cardId: string): Promise<CardStateData> {
    const existing = await db.cardStates.get(cardId);
    if (existing) return existing;
    return createNewCardState(cardId);
  },

  async getAllCardStates(): Promise<CardStateData[]> {
    return await db.cardStates.toArray();
  },

  async getDueCards(allContentCardIds: string[]): Promise<string[]> {
    const now = new Date();
    const states = await db.cardStates.toArray();
    const stateMap = new Map<string, CardStateData>();
    states.forEach(s => stateMap.set(s.cardId, s));

    const dueList: string[] = [];

    for (const cardId of allContentCardIds) {
      const st = stateMap.get(cardId);
      if (!st) {
        // Never reviewed card is due immediately
        dueList.push(cardId);
      } else {
        const dueDate = new Date(st.due);
        if (dueDate <= now) {
          dueList.push(cardId);
        }
      }
    }

    return dueList;
  },

  async recordReview(
    cardId: string,
    rating: SRSRating,
    elapsedMs: number = 0
  ): Promise<CardStateData> {
    const currentState = await this.getCardState(cardId);
    const { nextState } = calculateNextReview(currentState, rating);

    await db.cardStates.put(nextState);

    const log: ReviewLogRecord = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      cardId,
      rating,
      reviewedAt: new Date().toISOString(),
      elapsedMs,
      updatedAt: new Date().toISOString(),
    };
    await db.reviewLogs.put(log);

    return nextState;
  },

  async getReviewLogsCountToday(): Promise<number> {
    const todayStr = new Date().toISOString().slice(0, 10);
    const all = await db.reviewLogs.toArray();
    return all.filter(l => l.reviewedAt.startsWith(todayStr)).length;
  },
};
