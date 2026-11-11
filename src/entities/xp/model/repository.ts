import { db, XPEventRecord } from '@/shared/lib/db';
import { dispatchStatsUpdated } from '@/shared/lib/events';

export const xpRepository = {
  async addXP(amount: number, source: string): Promise<{ totalXP: number; level: number; gained: number }> {
    const now = new Date().toISOString();
    const event: XPEventRecord = {
      id: `xp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      amount,
      source,
      createdAt: now,
      updatedAt: now,
    };
    await db.xpEvents.put(event);

    const totalXP = await this.getTotalXP();
    const level = this.calculateLevel(totalXP);

    dispatchStatsUpdated();

    return { totalXP, level, gained: amount };
  },

  async getTotalXP(): Promise<number> {
    const all = await db.xpEvents.toArray();
    return all.reduce((sum, item) => sum + item.amount, 0);
  },

  async getRecentXPEvents(limit = 20): Promise<XPEventRecord[]> {
    return await db.xpEvents.orderBy('createdAt').reverse().limit(limit).toArray();
  },

  calculateLevel(totalXP: number): number {
    return Math.floor(Math.sqrt(totalXP / 100)) + 1;
  },

  getXPForNextLevel(currentLevel: number): { currentLevelXP: number; nextLevelXP: number } {
    const currentLevelXP = Math.pow(currentLevel - 1, 2) * 100;
    const nextLevelXP = Math.pow(currentLevel, 2) * 100;
    return { currentLevelXP, nextLevelXP };
  },
};
