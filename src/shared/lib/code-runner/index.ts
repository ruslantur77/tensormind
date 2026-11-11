import { LessonPracticeTask } from '@/shared/lib/schemas';
import { runPythonTests } from './python-runner';
import { runSqlTests } from './sql-runner';
import { RunResults } from './types';

export * from './types';
export * from './python-runner';
export * from './sql-runner';

/**
 * Universal code testing entry point: routes to Python (Skulpt) or SQL (AlaSQL)
 */
export async function executeCodeTask(
  code: string,
  task: LessonPracticeTask,
  lang: 'ru' | 'en' = 'ru'
): Promise<RunResults> {
  const language = task.language || (task.starterCode.toLowerCase().includes('select ') ? 'sql' : 'python');

  if (language === 'sql') {
    return await runSqlTests(code, task, lang);
  }

  return await runPythonTests(code, task, lang);
}
