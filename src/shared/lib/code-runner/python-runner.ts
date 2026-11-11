import 'skulpt/dist/skulpt.min.js';
import 'skulpt/dist/skulpt-stdlib.js';
import { TestCaseResult, TestVerdict } from './types';
import { LessonPracticeTask, getLocalized } from '@/shared/lib/schemas';

const TIMEOUT_MS = 2500;
const MAX_STDOUT_LENGTH = 200000; // 200 KB output limit before MLE

// Helper to obtain global Sk
function getSk(): any {
  if (typeof window !== 'undefined' && (window as any).Sk) {
    return (window as any).Sk;
  }
  if (typeof globalThis !== 'undefined' && (globalThis as any).Sk) {
    return (globalThis as any).Sk;
  }
  return null;
}

// Builtin file reader for standard library
function builtinRead(fileName: string) {
  const Sk = getSk();
  if (
    Sk &&
    Sk.builtinFiles !== undefined &&
    Sk.builtinFiles['files'] !== undefined &&
    Sk.builtinFiles['files'][fileName] !== undefined
  ) {
    return Sk.builtinFiles['files'][fileName];
  }
  throw new Error(`File not found: '${fileName}'`);
}

/**
 * Categorize errors into CE, RE, TLE, MLE
 */
function classifyError(errorStr: string): { verdict: TestVerdict; message: string } {
  const lower = errorStr.toLowerCase();

  if (
    lower.includes('syntaxerror') ||
    lower.includes('indentationerror') ||
    lower.includes('taberror') ||
    lower.includes('parse error') ||
    lower.includes('bad input') ||
    lower.includes('token error')
  ) {
    return { verdict: 'CE', message: errorStr };
  }

  if (lower.includes('timeout') || lower.includes('time limit exceeded')) {
    return { verdict: 'TLE', message: 'Превышен лимит времени выполнения (>2.5 сек). Проверьте код на бесконечный цикл (while True).' };
  }

  if (lower.includes('memory limit exceeded') || lower.includes('maximum call stack size exceeded')) {
    return { verdict: 'MLE', message: 'Превышен лимит памяти или глубина рекурсии (Memory Limit Exceeded).' };
  }

  return { verdict: 'RE', message: errorStr };
}

/**
 * Normalize and compare output strings
 */
export function normalizeOutput(str: string): string {
  return str
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim();
}

export function compareOutputs(actual: string, expected: string): boolean {
  const normActual = normalizeOutput(actual);
  const normExpected = normalizeOutput(expected);

  if (normActual === normExpected) return true;

  // Compare as floats if single numeric line
  const numActual = parseFloat(normActual);
  const numExpected = parseFloat(normExpected);
  if (!isNaN(numActual) && !isNaN(numExpected) && normActual.length < 20 && normExpected.length < 20) {
    return Math.abs(numActual - numExpected) < 1e-4;
  }

  // Compare lines ignoring blank lines
  const linesActual = normActual.split('\n').filter(Boolean);
  const linesExpected = normExpected.split('\n').filter(Boolean);

  if (linesExpected.length === 0) {
    return linesActual.length === 0;
  }

  // Exact number of lines match
  if (linesActual.length === linesExpected.length && linesActual.length > 0) {
    const allMatch = linesActual.every((line, idx) => {
      const exp = linesExpected[idx];
      if (line === exp) return true;
      const nA = parseFloat(line);
      const nE = parseFloat(exp);
      if (!isNaN(nA) && !isNaN(nE)) {
        return Math.abs(nA - nE) < 1e-4;
      }
      return false;
    });
    if (allMatch) return true;
  }

  // If actual stdout has previous lines (e.g. from user print() or sample print in code)
  // verify whether the trailing lines match the test case expected output
  if (linesActual.length > linesExpected.length) {
    const trailingActual = linesActual.slice(linesActual.length - linesExpected.length);
    const trailingMatch = trailingActual.every((line, idx) => {
      const exp = linesExpected[idx];
      if (line === exp) return true;
      const nA = parseFloat(line);
      const nE = parseFloat(exp);
      if (!isNaN(nA) && !isNaN(nE)) {
        return Math.abs(nA - nE) < 1e-4;
      }
      return false;
    });
    if (trailingMatch) return true;
  }

  return false;
}

/**
 * Execute a single Python string in isolated Skulpt environment with timeout
 */
async function executePythonCodeSnippet(
  code: string,
  timeoutMs: number = TIMEOUT_MS
): Promise<{ stdout: string; error?: string; verdict?: TestVerdict; executionTimeMs: number }> {
  const Sk = getSk();
  if (!Sk) {
    return {
      stdout: '',
      error: 'Python среда исполнения (Skulpt) не инициализирована.',
      verdict: 'RE',
      executionTimeMs: 0,
    };
  }

  let capturedOutput = '';
  const startTime = performance.now();

  Sk.configure({
    output: (text: string) => {
      if (capturedOutput.length > MAX_STDOUT_LENGTH) {
        throw new Error('Memory limit exceeded: Output buffer exceeded 200KB');
      }
      capturedOutput += text;
    },
    read: builtinRead,
    __future__: Sk.python3,
    yieldLimit: 1000,
    execLimit: timeoutMs,
  });

  const execPromise = new Promise<{ stdout: string }>((resolve, reject) => {
    try {
      const promise = Sk.misceval.asyncToPromise(() =>
        Sk.importMainWithBody('<stdin>', false, code, true)
      );

      promise
        .then(() => resolve({ stdout: capturedOutput }))
        .catch((err: any) => reject(err));
    } catch (err) {
      reject(err);
    }
  });

  const timeoutPromise = new Promise<{ stdout: string }>((_, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Time Limit Exceeded: Execution took longer than 2500ms'));
    }, timeoutMs);
    execPromise.finally(() => clearTimeout(timer));
  });

  try {
    const res = await Promise.race([execPromise, timeoutPromise]);
    const executionTimeMs = Math.round(performance.now() - startTime);
    return {
      stdout: res.stdout,
      executionTimeMs,
    };
  } catch (err: any) {
    const executionTimeMs = Math.round(performance.now() - startTime);
    const errString = err && (err.toString ? err.toString() : String(err));
    const { verdict, message } = classifyError(errString);
    return {
      stdout: capturedOutput,
      error: message,
      verdict,
      executionTimeMs,
    };
  }
}

/**
 * Test Python code against all test cases defined in practice task
 */
export async function runPythonTests(
  userCode: string,
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
  let combinedStdout = '';

  // 1. Initial Syntax & Basic Run Check
  const baseRun = await executePythonCodeSnippet(userCode);
  combinedStdout = baseRun.stdout;

  if (baseRun.error && baseRun.verdict) {
    // Immediate compilation error or runtime crash during basic execution
    return {
      verdict: baseRun.verdict,
      totalTests: 1,
      passedTests: 0,
      testResults: [
        {
          testIndex: 1,
          name: lang === 'en' ? 'Base execution & syntax verification' : 'Базовое выполнение и синтаксис',
          verdict: baseRun.verdict,
          passed: false,
          actualOutput: baseRun.stdout,
          error: baseRun.error,
          executionTimeMs: baseRun.executionTimeMs,
        },
      ],
      stdout: baseRun.stdout,
      executionTimeMs: Math.round(performance.now() - startTime),
    };
  }

  // 2. Determine Test Cases
  const rawTestCases = task.testCases || [];

  // Case A: Task has explicit test cases with testCode or expectedOutput
  if (rawTestCases.length > 0) {
    let overallVerdict: TestVerdict = 'AC';

    for (let i = 0; i < rawTestCases.length; i++) {
      const tc = rawTestCases[i];
      const tcName = getLocalized(tc.name, lang);
      const testCode = tc.testCode || tc.codeSnippet;
      const expected = tc.expectedOutput || task.expectedOutput;

      // If test code snippet exists, execute userCode + testCode
      if (testCode) {
        const fullSnippet = `${userCode}\n\n# --- Test Case ${i + 1} ---\n${testCode}\n`;
        const tcExec = await executePythonCodeSnippet(fullSnippet);

        if (tcExec.error && tcExec.verdict) {
          testResults.push({
            testIndex: i + 1,
            name: tcName,
            verdict: tcExec.verdict,
            passed: false,
            input: tc.input || testCode.trim(),
            actualOutput: tcExec.stdout,
            expectedOutput: expected,
            error: tcExec.error,
            executionTimeMs: tcExec.executionTimeMs,
          });
          overallVerdict = tcExec.verdict;
          break; // Stop on first error
        }

        const isMatch = expected ? compareOutputs(tcExec.stdout, expected) : true;
        if (isMatch) {
          testResults.push({
            testIndex: i + 1,
            name: tcName,
            verdict: 'AC',
            passed: true,
            input: tc.input || testCode.trim(),
            actualOutput: tcExec.stdout,
            expectedOutput: expected,
            executionTimeMs: tcExec.executionTimeMs,
          });
        } else {
          testResults.push({
            testIndex: i + 1,
            name: tcName,
            verdict: 'WA',
            passed: false,
            input: tc.input || testCode.trim(),
            actualOutput: tcExec.stdout,
            expectedOutput: expected,
            executionTimeMs: tcExec.executionTimeMs,
          });
          overallVerdict = 'WA';
          break; // Stop on first WA
        }
      } else if (expected) {
        // Compare base execution output against expectedOutput
        const isMatch = compareOutputs(baseRun.stdout, expected);
        if (isMatch) {
          testResults.push({
            testIndex: i + 1,
            name: tcName,
            verdict: 'AC',
            passed: true,
            input: tc.input || 'Стандартный запуск решения',
            actualOutput: baseRun.stdout,
            expectedOutput: expected,
            executionTimeMs: baseRun.executionTimeMs,
          });
        } else {
          testResults.push({
            testIndex: i + 1,
            name: tcName,
            verdict: 'WA',
            passed: false,
            input: tc.input || 'Стандартный запуск решения',
            actualOutput: baseRun.stdout,
            expectedOutput: expected,
            executionTimeMs: baseRun.executionTimeMs,
          });
          overallVerdict = 'WA';
          break;
        }
      } else {
        // Assertion or generic test
        testResults.push({
          testIndex: i + 1,
          name: tcName,
          verdict: 'AC',
          passed: true,
          actualOutput: baseRun.stdout,
          executionTimeMs: baseRun.executionTimeMs,
        });
      }
    }

    const passedCount = testResults.filter((t) => t.passed).length;
    return {
      verdict: overallVerdict,
      totalTests: rawTestCases.length,
      passedTests: passedCount,
      testResults,
      stdout: combinedStdout,
      executionTimeMs: Math.round(performance.now() - startTime),
    };
  }

  // Case B: Single expectedOutput verification
  if (task.expectedOutput) {
    const isMatch = compareOutputs(baseRun.stdout, task.expectedOutput);
    const tcResult: TestCaseResult = {
      testIndex: 1,
      name: lang === 'en' ? 'Standard Output Verification' : 'Проверка стандартного вывода (stdout)',
      verdict: isMatch ? 'AC' : 'WA',
      passed: isMatch,
      input: 'Запуск программы',
      expectedOutput: task.expectedOutput,
      actualOutput: baseRun.stdout,
      executionTimeMs: baseRun.executionTimeMs,
    };
    return {
      verdict: isMatch ? 'AC' : 'WA',
      totalTests: 1,
      passedTests: isMatch ? 1 : 0,
      testResults: [tcResult],
      stdout: baseRun.stdout,
      executionTimeMs: Math.round(performance.now() - startTime),
    };
  }

  // Default fallback if no specific expected output or tests:
  // Non-empty output and successful execution gives AC
  const passed = baseRun.stdout.trim().length > 0;
  return {
    verdict: passed ? 'AC' : 'WA',
    totalTests: 1,
    passedTests: passed ? 1 : 0,
    testResults: [
      {
        testIndex: 1,
        name: lang === 'en' ? 'Execution & Output Check' : 'Проверка выполнения и вывода',
        verdict: passed ? 'AC' : 'WA',
        passed,
        actualOutput: baseRun.stdout,
        expectedOutput: lang === 'en' ? '(Non-empty program output)' : '(Непустой вывод программы)',
        executionTimeMs: baseRun.executionTimeMs,
      },
    ],
    stdout: baseRun.stdout,
    executionTimeMs: Math.round(performance.now() - startTime),
  };
}
