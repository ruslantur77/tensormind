import Dexie, { type Table } from 'dexie';
import { SCHEMA_VERSION, CONTENT_VERSION } from '@/shared/config';
import type { CardStateData } from '@/shared/lib/srs/fsrs';

export interface ProfileRecord {
  id: string; // 'current'
  name: string;
  theme: 'dark' | 'light' | 'system';
  language: 'ru' | 'en';
  dailyGoal: {
    type: 'cards' | 'minutes';
    target: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ReviewLogRecord {
  id: string;
  cardId: string;
  rating: string;
  reviewedAt: string;
  elapsedMs: number;
  updatedAt: string;
}

export interface QuizAttemptRecord {
  id: string;
  quizId: string;
  moduleId: string;
  answers: Record<string, any>;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  startedAt: string;
  finishedAt: string;
  updatedAt: string;
}

export interface LessonProgressRecord {
  lessonId: string;
  moduleId: string;
  completedAt: string;
  score: number;
  updatedAt: string;
}

export interface XPEventRecord {
  id: string;
  amount: number;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface AchievementRecord {
  achievementId: string;
  unlockedAt: string;
  updatedAt: string;
}

export interface StreakStateRecord {
  id: string; // 'current'
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // 'YYYY-MM-DD'
  activeDates: string[]; // ['YYYY-MM-DD', ...]
  updatedAt: string;
}

export interface SpeedrunRecord {
  id: string;
  mode: 'cards' | 'quiz';
  score: number;
  correctAnswers: number;
  totalAnswered: number;
  achievedAt: string;
  updatedAt: string;
}

export interface SettingRecord {
  key: string;
  value: any;
  updatedAt: string;
}

export interface MetaRecord {
  key: string;
  value: any;
  updatedAt: string;
}

export class TensorMindDatabase extends Dexie {
  profiles!: Table<ProfileRecord, string>;
  cardStates!: Table<CardStateData, string>;
  reviewLogs!: Table<ReviewLogRecord, string>;
  quizAttempts!: Table<QuizAttemptRecord, string>;
  lessonProgress!: Table<LessonProgressRecord, string>;
  xpEvents!: Table<XPEventRecord, string>;
  achievements!: Table<AchievementRecord, string>;
  streakState!: Table<StreakStateRecord, string>;
  speedrunRecords!: Table<SpeedrunRecord, string>;
  settings!: Table<SettingRecord, string>;
  meta!: Table<MetaRecord, string>;

  constructor() {
    super('TensorMindDB');

    // Schema v1
    this.version(1).stores({
      profiles: 'id, updatedAt',
      cardStates: 'cardId, due, state, updatedAt',
      reviewLogs: 'id, cardId, reviewedAt, updatedAt',
      quizAttempts: 'id, quizId, moduleId, passed, finishedAt, updatedAt',
      lessonProgress: 'lessonId, moduleId, completedAt, updatedAt',
      xpEvents: 'id, createdAt, source, updatedAt',
      achievements: 'achievementId, unlockedAt, updatedAt',
      streakState: 'id, lastActiveDate, updatedAt',
      speedrunRecords: 'id, mode, score, achievedAt, updatedAt',
      settings: 'key, updatedAt',
      meta: 'key, updatedAt',
    });
  }
}

export const db = new TensorMindDatabase();

export async function initializeDatabase(): Promise<void> {
  const schemaMeta = await db.meta.get('schemaVersion');
  if (!schemaMeta) {
    const now = new Date().toISOString();
    await db.meta.put({
      key: 'schemaVersion',
      value: SCHEMA_VERSION,
      updatedAt: now,
    });
    await db.meta.put({
      key: 'contentVersion',
      value: CONTENT_VERSION,
      updatedAt: now,
    });
    await db.meta.put({
      key: 'lastBackupAt',
      value: now,
      updatedAt: now,
    });
  }

  // Ensure default streak record exists
  const streak = await db.streakState.get('current');
  if (!streak) {
    const now = new Date().toISOString();
    await db.streakState.put({
      id: 'current',
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: '',
      activeDates: [],
      updatedAt: now,
    });
  }
}
