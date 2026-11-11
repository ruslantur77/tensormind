import { xpRepository } from '@/entities/xp/model/repository';
import { XP_REWARDS } from '@/shared/config';
import { platform } from '@/shared/lib/platform';

const PRACTICE_COMPLETED_KEY = 'tensormind:practice_completed_tasks';
const PRACTICE_VIEWED_SOLUTION_KEY = 'tensormind:practice_viewed_solutions';

export const practiceTaskRepository = {
  getCompletedTaskIds(): Set<string> {
    try {
      const raw = localStorage.getItem(PRACTICE_COMPLETED_KEY);
      if (!raw) return new Set();
      const arr = JSON.parse(raw);
      return new Set(Array.isArray(arr) ? arr : []);
    } catch {
      return new Set();
    }
  },

  isCompleted(lessonId: string): boolean {
    return this.getCompletedTaskIds().has(lessonId);
  },

  getViewedSolutionTaskIds(): Set<string> {
    try {
      const raw = localStorage.getItem(PRACTICE_VIEWED_SOLUTION_KEY);
      if (!raw) return new Set();
      const arr = JSON.parse(raw);
      return new Set(Array.isArray(arr) ? arr : []);
    } catch {
      return new Set();
    }
  },

  hasViewedSolution(lessonId: string): boolean {
    return this.getViewedSolutionTaskIds().has(lessonId);
  },

  markSolutionViewed(lessonId: string): void {
    const set = this.getViewedSolutionTaskIds();
    if (!set.has(lessonId)) {
      set.add(lessonId);
      try {
        localStorage.setItem(PRACTICE_VIEWED_SOLUTION_KEY, JSON.stringify(Array.from(set)));
      } catch (e) {
        console.warn('Could not save practice solution viewed state:', e);
      }
    }
  },

  async markCompleted(
    lessonId: string,
    taskTitle: string,
    customXP?: number
  ): Promise<{ awarded: boolean; xpEarned: number }> {
    const set = this.getCompletedTaskIds();
    const alreadyDone = set.has(lessonId);
    let xpEarned = 0;

    if (!alreadyDone) {
      set.add(lessonId);
      try {
        localStorage.setItem(PRACTICE_COMPLETED_KEY, JSON.stringify(Array.from(set)));
      } catch (e) {
        console.warn('Could not save practice task completion:', e);
      }

      const viewed = this.hasViewedSolution(lessonId);
      xpEarned = customXP !== undefined
        ? customXP
        : (viewed ? XP_REWARDS.PRACTICE_TASK_WITH_SOLUTION : XP_REWARDS.PRACTICE_TASK_COMPLETE);

      const penaltyTag = viewed ? ' (с подсказкой эталона)' : '';
      await xpRepository.addXP(xpEarned, `Практика: ${taskTitle}${penaltyTag}`);
    }
    platform.haptics.success();
    return { awarded: !alreadyDone, xpEarned };
  },

  getUserCode(lessonId: string): string | null {
    try {
      return localStorage.getItem(`tensormind:practice_code:${lessonId}`);
    } catch {
      return null;
    }
  },

  saveUserCode(lessonId: string, code: string): void {
    try {
      localStorage.setItem(`tensormind:practice_code:${lessonId}`, code);
    } catch (e) {
      console.warn('Could not save user practice code:', e);
    }
  },

  resetUserCode(lessonId: string): void {
    try {
      localStorage.removeItem(`tensormind:practice_code:${lessonId}`);
    } catch (e) {
      console.warn('Could not reset user practice code:', e);
    }
  },
};
