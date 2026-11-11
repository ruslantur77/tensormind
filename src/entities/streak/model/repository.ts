import { db, StreakStateRecord } from '@/shared/lib/db';
import { dispatchStatsUpdated } from '@/shared/lib/events';
import { achievementRepository } from '@/entities/achievement/model/repository';

/**
 * Returns today's date formatted as YYYY-MM-DD in local time.
 */
export function getTodayDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Adds or subtracts days from a YYYY-MM-DD string, returning the new YYYY-MM-DD string.
 */
export function getOffsetDateString(dateStr: string, offsetDays: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculates calendar days difference between two YYYY-MM-DD strings (dateStr2 - dateStr1).
 */
export function getDaysDifference(dateStr1: string, dateStr2: string): number {
  if (!dateStr1 || !dateStr2) return Infinity;
  const [y1, m1, d1] = dateStr1.split('-').map(Number);
  const [y2, m2, d2] = dateStr2.split('-').map(Number);
  if (!y1 || !m1 || !d1 || !y2 || !m2 || !d2) return Infinity;
  const utc1 = Date.UTC(y1, m1 - 1, d1);
  const utc2 = Date.UTC(y2, m2 - 1, d2);
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((utc2 - utc1) / msPerDay);
}

/**
 * Calculates current streak accurately based on active dates history and today's date.
 * - If active today: counts consecutive days backwards starting today.
 * - If NOT active today, but active yesterday: counts consecutive days backwards starting yesterday (streak is pending continuation today).
 * - If neither active today nor yesterday: streak is broken, returns 0.
 */
export function calculateCurrentStreak(activeDates: string[], todayStr: string = getTodayDateString()): number {
  if (!activeDates || activeDates.length === 0) return 0;
  const datesSet = new Set(activeDates);

  // Check if active today (check both local date and UTC ISO date)
  const isoToday = new Date().toISOString().slice(0, 10);
  const isTodayActive = datesSet.has(todayStr) || datesSet.has(isoToday);

  if (isTodayActive) {
    let streak = 1;
    let prev = getOffsetDateString(todayStr, -1);
    while (datesSet.has(prev)) {
      streak += 1;
      prev = getOffsetDateString(prev, -1);
    }
    return streak;
  }

  // Not active today yet. Check if active yesterday.
  const yesterdayStr = getOffsetDateString(todayStr, -1);
  const isoYesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const isYesterdayActive = datesSet.has(yesterdayStr) || datesSet.has(isoYesterday);

  if (isYesterdayActive) {
    let streak = 1;
    let prev = getOffsetDateString(yesterdayStr, -1);
    while (datesSet.has(prev)) {
      streak += 1;
      prev = getOffsetDateString(prev, -1);
    }
    return streak;
  }

  // Neither today nor yesterday had any activity -> streak is broken (0)
  return 0;
}

/**
 * Computes longest consecutive active days streak in history.
 */
export function calculateLongestStreak(activeDates: string[]): number {
  if (!activeDates || activeDates.length === 0) return 0;
  const uniqueSorted = Array.from(new Set(activeDates)).sort();
  let maxStreak = 0;
  let curr = 0;
  let prevDate = '';

  for (const dateStr of uniqueSorted) {
    if (!prevDate) {
      curr = 1;
    } else {
      const diff = getDaysDifference(prevDate, dateStr);
      if (diff === 1) {
        curr += 1;
      } else if (diff > 1) {
        curr = 1;
      }
    }
    prevDate = dateStr;
    if (curr > maxStreak) {
      maxStreak = curr;
    }
  }
  return maxStreak;
}

export const streakRepository = {
  async getStreak(): Promise<StreakStateRecord> {
    const existing = await db.streakState.get('current');
    const today = getTodayDateString();
    const now = new Date().toISOString();

    if (!existing) {
      const initial: StreakStateRecord = {
        id: 'current',
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: '',
        activeDates: [],
        updatedAt: now,
      };
      await db.streakState.put(initial);
      return initial;
    }

    const activeDates = existing.activeDates ? [...existing.activeDates] : [];
    if (existing.lastActiveDate && !activeDates.includes(existing.lastActiveDate)) {
      activeDates.push(existing.lastActiveDate);
    }

    const computedCurrentStreak = calculateCurrentStreak(activeDates, today);
    const computedLongestStreak = Math.max(
      existing.longestStreak || 0,
      calculateLongestStreak(activeDates),
      computedCurrentStreak
    );

    // Auto-heal / update database if the streak state has expired
    if (
      existing.currentStreak !== computedCurrentStreak ||
      existing.longestStreak !== computedLongestStreak ||
      activeDates.length > (existing.activeDates?.length || 0)
    ) {
      existing.currentStreak = computedCurrentStreak;
      existing.longestStreak = computedLongestStreak;
      existing.activeDates = activeDates;
      existing.updatedAt = now;
      await db.streakState.put(existing);
    }

    return existing;
  },

  async recordActivityToday(): Promise<StreakStateRecord> {
    const current = await this.getStreak();
    const today = getTodayDateString();
    const now = new Date().toISOString();

    const activeDates = Array.from(new Set([...(current.activeDates || []), today])).sort();
    const currentStreak = calculateCurrentStreak(activeDates, today);
    const longestStreak = Math.max(
      current.longestStreak || 0,
      calculateLongestStreak(activeDates),
      currentStreak
    );

    const updated: StreakStateRecord = {
      id: 'current',
      currentStreak,
      longestStreak,
      lastActiveDate: today,
      activeDates,
      updatedAt: now,
    };

    await db.streakState.put(updated);

    // Check streak achievements
    if (currentStreak >= 3) {
      await achievementRepository.unlock('streak_3');
    }
    if (currentStreak >= 7) {
      await achievementRepository.unlock('streak_7');
    }
    if (currentStreak >= 14) {
      await achievementRepository.unlock('streak_14');
    }
    if (currentStreak >= 30) {
      await achievementRepository.unlock('streak_30');
    }
    if (currentStreak >= 100) {
      await achievementRepository.unlock('streak_100');
    }

    dispatchStatsUpdated();
    return updated;
  },
};
