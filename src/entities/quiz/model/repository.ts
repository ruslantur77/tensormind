import { db, QuizAttemptRecord } from '@/shared/lib/db';

export const quizRepository = {
  async saveQuizAttempt(params: {
    quizId: string;
    moduleId: string;
    answers: Record<string, any>;
    score: number;
    total: number;
    startedAt: string;
  }): Promise<QuizAttemptRecord> {
    const percentage = Math.round((params.score / Math.max(1, params.total)) * 100);
    const passed = percentage >= 80;
    const now = new Date().toISOString();

    const record: QuizAttemptRecord = {
      id: `quiz_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      quizId: params.quizId,
      moduleId: params.moduleId,
      answers: params.answers,
      score: params.score,
      total: params.total,
      percentage,
      passed,
      startedAt: params.startedAt,
      finishedAt: now,
      updatedAt: now,
    };

    await db.quizAttempts.put(record);
    return record;
  },

  async getAttemptsByQuizId(quizId: string): Promise<QuizAttemptRecord[]> {
    return await db.quizAttempts.where('quizId').equals(quizId).toArray();
  },

  async getAllAttempts(): Promise<QuizAttemptRecord[]> {
    return await db.quizAttempts.toArray();
  },
};
