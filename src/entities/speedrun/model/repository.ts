import { db, SpeedrunRecord } from '@/shared/lib/db';

export const speedrunRepository = {
  async saveRecord(params: {
    mode: 'cards' | 'quiz';
    score: number;
    correctAnswers: number;
    totalAnswered: number;
  }): Promise<SpeedrunRecord> {
    const now = new Date().toISOString();
    const record: SpeedrunRecord = {
      id: `sr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      mode: params.mode,
      score: params.score,
      correctAnswers: params.correctAnswers,
      totalAnswered: params.totalAnswered,
      achievedAt: now,
      updatedAt: now,
    };
    await db.speedrunRecords.put(record);
    return record;
  },

  async getBestScore(mode: 'cards' | 'quiz'): Promise<number> {
    const records = await db.speedrunRecords.where('mode').equals(mode).toArray();
    if (records.length === 0) return 0;
    return Math.max(...records.map(r => r.score));
  },

  async getAllRecords(): Promise<SpeedrunRecord[]> {
    return await db.speedrunRecords.toArray();
  },
};
