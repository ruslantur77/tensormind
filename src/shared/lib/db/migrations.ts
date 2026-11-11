import { TensorMindDatabase } from './index';

export type MigrationFn = (db: TensorMindDatabase) => Promise<void>;

/**
 * Migrations registry. Each index corresponds to version migration:
 * migrations[0]: v1 -> v2, etc.
 */
export const migrations: MigrationFn[] = [];

export async function runMigrations(db: TensorMindDatabase): Promise<void> {
  const meta = await db.meta.get('schemaVersion');
  const currentVersion = (meta?.value as number) || 1;

  for (let i = currentVersion - 1; i < migrations.length; i++) {
    const migration = migrations[i];
    if (migration) {
      console.log(`Running migration from version ${i + 1} to ${i + 2}...`);
      await migration(db);
      await db.meta.put({
        key: 'schemaVersion',
        value: i + 2,
        updatedAt: new Date().toISOString(),
      });
    }
  }
}
