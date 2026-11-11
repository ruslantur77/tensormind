import alasql from 'alasql';
import { TestCaseResult, TestVerdict } from './types';
import { LessonPracticeTask, getLocalized } from '@/shared/lib/schemas';
import { compareOutputs, normalizeOutput } from './python-runner';

/**
 * Execute SQL test suite in isolated in-memory AlaSQL database
 */
export async function runSqlTests(
  userSql: string,
  task: LessonPracticeTask,
  lang: 'ru' | 'en' = 'ru'
): Promise<{
  verdict: TestVerdict;
  totalTests: number;
  passedTests: number;
  testResults: TestCaseResult[];
  stdout: string;
  executionTimeMs: number;
}> {
  const startTime = performance.now();
  const testResults: TestCaseResult[] = [];
  let capturedStdout = '';

  const rawTestCases = task.testCases || [];
  const total = Math.max(rawTestCases.length, 1);

  // Clean user SQL
  const trimmedSql = userSql.trim();
  if (!trimmedSql) {
    return {
      verdict: 'WA',
      totalTests: total,
      passedTests: 0,
      testResults: [
        {
          testIndex: 1,
          name: lang === 'en' ? 'SQL Query Execution' : 'Выполнение SQL запроса',
          verdict: 'WA',
          passed: false,
          error: lang === 'en' ? 'SQL query is empty.' : 'SQL-запрос пуст.',
          executionTimeMs: 0,
        },
      ],
      stdout: '',
      executionTimeMs: 0,
    };
  }

  // Helper to format table result
  const formatRows = (rows: any[]): string => {
    if (!Array.isArray(rows) || rows.length === 0) return '(0 rows returned)';
    if (typeof rows[0] !== 'object') return rows.map(String).join('\n');

    const headers = Object.keys(rows[0]);
    const headerLine = headers.join(' | ');
    const divider = headers.map((h) => '-'.repeat(Math.max(h.length, 4))).join('-+-');
    const dataLines = rows.map((r) => headers.map((h) => String(r[h] ?? 'NULL')).join(' | '));
    return [headerLine, divider, ...dataLines].join('\n');
  };

  try {
    // Reset alasql memory state
    alasql('CREATE DATABASE testdb_' + Math.floor(Math.random() * 100000));
    alasql('USE testdb_' + Math.floor(Math.random() * 100000));
  } catch {
    // ignore
  }

  // Iterate test cases
  if (rawTestCases.length > 0) {
    let overallVerdict: TestVerdict = 'AC';

    for (let i = 0; i < rawTestCases.length; i++) {
      const tc = rawTestCases[i];
      const tcName = getLocalized(tc.name, lang);
      const expected = tc.expectedOutput || task.expectedOutput || '';
      const testStart = performance.now();

      try {
        // Setup code if any
        if (tc.testCode) {
          alasql(tc.testCode);
        }

        // Execute user query
        const queryResult = alasql(trimmedSql);
        const formatted = Array.isArray(queryResult) ? formatRows(queryResult) : String(queryResult);
        capturedStdout += (capturedStdout ? '\n\n' : '') + `[Test ${i + 1} Output]:\n` + formatted;

        const isMatch = expected ? compareOutputs(formatted, expected) : true;
        const timeMs = Math.round(performance.now() - testStart);

        if (isMatch) {
          testResults.push({
            testIndex: i + 1,
            name: tcName,
            verdict: 'AC',
            passed: true,
            input: tc.input || trimmedSql,
            actualOutput: formatted,
            expectedOutput: expected,
            executionTimeMs: timeMs,
          });
        } else {
          testResults.push({
            testIndex: i + 1,
            name: tcName,
            verdict: 'WA',
            passed: false,
            input: tc.input || trimmedSql,
            actualOutput: formatted,
            expectedOutput: expected,
            executionTimeMs: timeMs,
          });
          overallVerdict = 'WA';
          break;
        }
      } catch (err: any) {
        const timeMs = Math.round(performance.now() - testStart);
        const errStr = String(err);
        const isSyntax = errStr.toLowerCase().includes('syntax') || errStr.toLowerCase().includes('parse');
        const verdict: TestVerdict = isSyntax ? 'CE' : 'RE';

        testResults.push({
          testIndex: i + 1,
          name: tcName,
          verdict,
          passed: false,
          input: tc.input || trimmedSql,
          error: errStr,
          expectedOutput: expected,
          executionTimeMs: timeMs,
        });
        overallVerdict = verdict;
        break;
      }
    }

    const passedCount = testResults.filter((t) => t.passed).length;
    return {
      verdict: overallVerdict,
      totalTests: rawTestCases.length,
      passedTests: passedCount,
      testResults,
      stdout: capturedStdout,
      executionTimeMs: Math.round(performance.now() - startTime),
    };
  }

  // Basic single execution
  try {
    const res = alasql(trimmedSql);
    const formatted = Array.isArray(res) ? formatRows(res) : String(res);
    capturedStdout = formatted;

    const expected = task.expectedOutput || '';
    const isMatch = expected ? compareOutputs(formatted, expected) : true;

    return {
      verdict: isMatch ? 'AC' : 'WA',
      totalTests: 1,
      passedTests: isMatch ? 1 : 0,
      testResults: [
        {
          testIndex: 1,
          name: lang === 'en' ? 'SQL Query Execution' : 'Выполнение SQL запроса',
          verdict: isMatch ? 'AC' : 'WA',
          passed: isMatch,
          actualOutput: formatted,
          expectedOutput: expected,
          executionTimeMs: Math.round(performance.now() - startTime),
        },
      ],
      stdout: capturedStdout,
      executionTimeMs: Math.round(performance.now() - startTime),
    };
  } catch (err: any) {
    const errStr = String(err);
    const isSyntax = errStr.toLowerCase().includes('syntax') || errStr.toLowerCase().includes('parse');
    const verdict: TestVerdict = isSyntax ? 'CE' : 'RE';

    return {
      verdict,
      totalTests: 1,
      passedTests: 0,
      testResults: [
        {
          testIndex: 1,
          name: lang === 'en' ? 'SQL Query Execution' : 'Выполнение SQL запроса',
          verdict,
          passed: false,
          error: errStr,
          executionTimeMs: Math.round(performance.now() - startTime),
        },
      ],
      stdout: '',
      executionTimeMs: Math.round(performance.now() - startTime),
    };
  }
}
