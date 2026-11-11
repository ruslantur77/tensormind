import { db } from '@/shared/lib/db';
import { SCHEMA_VERSION, CONTENT_VERSION } from '@/shared/config';
import { BackupSchema, BackupData } from '@/shared/lib/schemas';
import { platform } from '@/shared/lib/platform';
import { achievementRepository } from '@/entities/achievement/model/repository';

export interface ImportResult {
  success: boolean;
  mergedCount: number;
  replacedAll: boolean;
  error?: string;
  orphanedCount?: number;
}

export const backupManager = {
  async generateBackupData(): Promise<BackupData> {
    const profiles = await db.profiles.toArray();
    const cardStates = await db.cardStates.toArray();
    const reviewLogs = await db.reviewLogs.toArray();
    const quizAttempts = await db.quizAttempts.toArray();
    const lessonProgress = await db.lessonProgress.toArray();
    const xpEvents = await db.xpEvents.toArray();
    const achievements = await db.achievements.toArray();
    const streakState = await db.streakState.toArray();
    const speedrunRecords = await db.speedrunRecords.toArray();
    const settings = await db.settings.toArray();
    const meta = await db.meta.toArray();

    return {
      schemaVersion: SCHEMA_VERSION,
      contentVersion: CONTENT_VERSION,
      exportedAt: new Date().toISOString(),
      profiles,
      cardStates,
      reviewLogs,
      quizAttempts,
      lessonProgress,
      xpEvents,
      achievements,
      streakState,
      speedrunRecords,
      settings,
      meta,
    };
  },

  async exportBackup(): Promise<boolean> {
    const data = await this.generateBackupData();
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const filename = `tensormind-backup-${yyyy}${mm}${dd}-${hh}${min}.json`;

    const jsonString = JSON.stringify(data, null, 2);
    const exported = await platform.backup.exportJson(filename, jsonString);

    if (exported) {
      await db.meta.put({
        key: 'lastBackupAt',
        value: now.toISOString(),
        updatedAt: now.toISOString(),
      });
      await achievementRepository.unlock('backup_safe');
      platform.haptics.success();
    }

    return exported;
  },

  async importBackup(jsonString: string, replaceAll: boolean = false): Promise<ImportResult> {
    try {
      const parsed = JSON.parse(jsonString);
      const validation = BackupSchema.safeParse(parsed);

      if (!validation.success) {
        return {
          success: false,
          mergedCount: 0,
          replacedAll: false,
          error: `Файл не соответствует формату резервной копии: ${validation.error.issues[0]?.message}`,
        };
      }

      const backup = validation.data;
      let mergedCount = 0;

      if (replaceAll) {
        // Complete clean overwrite
        await db.transaction('rw', [
          db.profiles,
          db.cardStates,
          db.reviewLogs,
          db.quizAttempts,
          db.lessonProgress,
          db.xpEvents,
          db.achievements,
          db.streakState,
          db.speedrunRecords,
          db.settings,
          db.meta,
        ], async () => {
          await db.profiles.clear();
          await db.cardStates.clear();
          await db.reviewLogs.clear();
          await db.quizAttempts.clear();
          await db.lessonProgress.clear();
          await db.xpEvents.clear();
          await db.achievements.clear();
          await db.streakState.clear();
          await db.speedrunRecords.clear();
          await db.settings.clear();
          await db.meta.clear();

          if (backup.profiles.length) await db.profiles.bulkPut(backup.profiles);
          if (backup.cardStates.length) await db.cardStates.bulkPut(backup.cardStates);
          if (backup.reviewLogs.length) await db.reviewLogs.bulkPut(backup.reviewLogs);
          if (backup.quizAttempts.length) await db.quizAttempts.bulkPut(backup.quizAttempts);
          if (backup.lessonProgress.length) await db.lessonProgress.bulkPut(backup.lessonProgress);
          if (backup.xpEvents.length) await db.xpEvents.bulkPut(backup.xpEvents);
          if (backup.achievements.length) await db.achievements.bulkPut(backup.achievements);
          if (backup.streakState.length) await db.streakState.bulkPut(backup.streakState);
          if (backup.speedrunRecords.length) await db.speedrunRecords.bulkPut(backup.speedrunRecords);
          if (backup.settings.length) await db.settings.bulkPut(backup.settings);
          if (backup.meta.length) await db.meta.bulkPut(backup.meta);
        });

        return {
          success: true,
          mergedCount: backup.cardStates.length + backup.lessonProgress.length,
          replacedAll: true,
        };
      }

      // Smart merge by updatedAt
      await db.transaction('rw', [
        db.profiles,
        db.cardStates,
        db.reviewLogs,
        db.quizAttempts,
        db.lessonProgress,
        db.xpEvents,
        db.achievements,
        db.streakState,
        db.speedrunRecords,
        db.settings,
      ], async () => {
        // Merge profiles
        for (const item of backup.profiles) {
          const current = await db.profiles.get(item.id);
          if (!current || new Date(item.updatedAt || 0) > new Date(current.updatedAt || 0)) {
            await db.profiles.put(item);
            mergedCount++;
          }
        }

        // Merge cardStates
        for (const item of backup.cardStates) {
          const current = await db.cardStates.get(item.cardId);
          if (!current || new Date(item.updatedAt || 0) > new Date(current.updatedAt || 0)) {
            await db.cardStates.put(item);
            mergedCount++;
          }
        }

        // Union reviewLogs without duplicates
        for (const item of backup.reviewLogs) {
          const current = await db.reviewLogs.get(item.id);
          if (!current) {
            await db.reviewLogs.put(item);
            mergedCount++;
          }
        }

        // Union quizAttempts
        for (const item of backup.quizAttempts) {
          const current = await db.quizAttempts.get(item.id);
          if (!current) {
            await db.quizAttempts.put(item);
            mergedCount++;
          }
        }

        // Merge lessonProgress
        for (const item of backup.lessonProgress) {
          const current = await db.lessonProgress.get(item.lessonId);
          if (!current || new Date(item.updatedAt || 0) > new Date(current.updatedAt || 0)) {
            await db.lessonProgress.put(item);
            mergedCount++;
          }
        }

        // Union xpEvents
        for (const item of backup.xpEvents) {
          const current = await db.xpEvents.get(item.id);
          if (!current) {
            await db.xpEvents.put(item);
            mergedCount++;
          }
        }

        // Union achievements
        for (const item of backup.achievements) {
          const current = await db.achievements.get(item.achievementId);
          if (!current) {
            await db.achievements.put(item);
            mergedCount++;
          }
        }

        // Merge streakState
        for (const item of backup.streakState) {
          const current = await db.streakState.get(item.id);
          if (!current || new Date(item.updatedAt || 0) > new Date(current.updatedAt || 0)) {
            await db.streakState.put(item);
            mergedCount++;
          }
        }

        // Union speedrunRecords
        for (const item of backup.speedrunRecords) {
          const current = await db.speedrunRecords.get(item.id);
          if (!current) {
            await db.speedrunRecords.put(item);
            mergedCount++;
          }
        }
      });

      platform.haptics.success();
      return {
        success: true,
        mergedCount,
        replacedAll: false,
      };
    } catch (e: any) {
      console.error('Import error', e);
      return {
        success: false,
        mergedCount: 0,
        replacedAll: false,
        error: e?.message || 'Не удалось прочитать файл резервной копии',
      };
    }
  },

  async isBackupDue(daysThreshold = 7): Promise<boolean> {
    const meta = await db.meta.get('lastBackupAt');
    if (!meta || !meta.value) return true;
    const lastDate = new Date(meta.value).getTime();
    const now = Date.now();
    const diffDays = (now - lastDate) / (1000 * 60 * 60 * 24);
    return diffDays >= daysThreshold;
  },

  async getOrphanedItems(validCardIds: Set<string>, validLessonIds: Set<string>): Promise<{
    orphanedCards: string[];
    orphanedLessons: string[];
  }> {
    const cardStates = await db.cardStates.toArray();
    const lessonProgress = await db.lessonProgress.toArray();

    const orphanedCards = cardStates.map(c => c.cardId).filter(id => !validCardIds.has(id));
    const orphanedLessons = lessonProgress.map(l => l.lessonId).filter(id => !validLessonIds.has(id));

    return { orphanedCards, orphanedLessons };
  },

  async clearOrphanedItems(orphanedCardIds: string[], orphanedLessonIds: string[]): Promise<void> {
    await db.transaction('rw', [db.cardStates, db.lessonProgress], async () => {
      for (const id of orphanedCardIds) {
        await db.cardStates.delete(id);
      }
      for (const id of orphanedLessonIds) {
        await db.lessonProgress.delete(id);
      }
    });
  },
};
