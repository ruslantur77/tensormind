/**
 * TensorMind Configuration
 */

export const APP_NAME = 'TensorMind';
export const APP_VERSION = '1.0.0';
export const SCHEMA_VERSION = 1;
export const CONTENT_VERSION = '1.0.0';

export const BACKUP_REMINDER_DAYS = 7;
export const PASSING_EXAM_PERCENT = 80;

export const DEFAULT_DAILY_GOAL = {
  type: 'cards' as const, // 'cards' | 'minutes'
  target: 15,
};

export const XP_REWARDS = {
  LESSON_COMPLETE: 50,
  PRACTICE_TASK_COMPLETE: 25,
  PRACTICE_TASK_WITH_SOLUTION: 10,
  QUIZ_CORRECT_ANSWER: 10,
  QUIZ_PERFECT_BONUS: 30,
  SRS_CARD_REVIEW: 5,
  SPEEDRUN_SESSION_BASE: 25,
  EXAM_PASSED: 100,
};
