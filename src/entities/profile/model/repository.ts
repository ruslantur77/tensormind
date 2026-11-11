import { db, ProfileRecord } from '@/shared/lib/db';
import { DEFAULT_DAILY_GOAL } from '@/shared/config';
import { dispatchStatsUpdated } from '@/shared/lib/events';

export const profileRepository = {
  async getProfile(): Promise<ProfileRecord | undefined> {
    return await db.profiles.get('current');
  },

  async createProfile(name: string, dailyGoalCards: number = DEFAULT_DAILY_GOAL.target): Promise<ProfileRecord> {
    const now = new Date().toISOString();
    const profile: ProfileRecord = {
      id: 'current',
      name: name.trim(),
      theme: 'dark',
      language: 'ru',
      dailyGoal: {
        type: 'cards',
        target: dailyGoalCards,
      },
      createdAt: now,
      updatedAt: now,
    };
    await db.profiles.put(profile);
    dispatchStatsUpdated();
    return profile;
  },

  async updateProfile(updates: Partial<Omit<ProfileRecord, 'id' | 'createdAt'>>): Promise<ProfileRecord | undefined> {
    const current = await db.profiles.get('current');
    if (!current) return undefined;
    const updated: ProfileRecord = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await db.profiles.put(updated);
    dispatchStatsUpdated();
    return updated;
  },
};
