import { db, LessonProgressRecord } from '@/shared/lib/db';

export const lessonRepository = {
  async getLessonProgress(lessonId: string): Promise<LessonProgressRecord | undefined> {
    return await db.lessonProgress.get(lessonId);
  },

  async getAllProgress(): Promise<LessonProgressRecord[]> {
    return await db.lessonProgress.toArray();
  },

  async markLessonCompleted(lessonId: string, moduleId: string, score: number = 100): Promise<LessonProgressRecord> {
    const record: LessonProgressRecord = {
      lessonId,
      moduleId,
      completedAt: new Date().toISOString(),
      score,
      updatedAt: new Date().toISOString(),
    };
    await db.lessonProgress.put(record);
    return record;
  },

  async isLessonCompleted(lessonId: string): Promise<boolean> {
    const record = await db.lessonProgress.get(lessonId);
    return !!record;
  },
};
