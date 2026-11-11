/**
 * Types and Verdicts for Code Testing & Execution Engine
 * Conforms to standard Competitive Programming & Engineering Interview Verdicts:
 * - AC (Accepted): Program passed all test cases with matching output
 * - WA (Wrong Answer): Program terminated successfully, but output differed from expected
 * - TLE (Time Limit Exceeded): Program exceeded time limit (e.g. infinite loop > 2500ms)
 * - MLE (Memory Limit Exceeded): Output buffer or memory limit exceeded
 * - RE (Runtime Error): Program crashed during execution (ZeroDivisionError, IndexError, KeyError, TypeError, etc.)
 * - CE (Compilation Error): Syntax or parse error preventing execution (SyntaxError, IndentationError, etc.)
 */

export type TestVerdict = 'AC' | 'WA' | 'TLE' | 'MLE' | 'RE' | 'CE';

export interface TestCaseResult {
  testIndex: number;
  name: string;
  verdict: TestVerdict;
  passed: boolean;
  input?: string;
  expectedOutput?: string;
  actualOutput?: string;
  error?: string;
  executionTimeMs: number;
}

export interface RunResults {
  verdict: TestVerdict;
  totalTests: number;
  passedTests: number;
  testResults: TestCaseResult[];
  stdout: string;
  stderr?: string;
  executionTimeMs: number;
}

export interface VerdictInfo {
  code: TestVerdict;
  labelRu: string;
  labelEn: string;
  descriptionRu: string;
  descriptionEn: string;
  badgeVariant: 'success' | 'warning' | 'purple' | 'violet' | 'neutral' | 'cyan' | 'draft';
  colorClass: string;
  bgClass: string;
}

export const VERDICT_CONFIG: Record<TestVerdict, VerdictInfo> = {
  AC: {
    code: 'AC',
    labelRu: 'AC — Полное решение (Accepted)',
    labelEn: 'AC — Accepted',
    descriptionRu: 'Программа успешно отработала и выдала верный ответ на всех тестах.',
    descriptionEn: 'Solution passed all test cases with exact expected outputs.',
    badgeVariant: 'success',
    colorClass: 'text-emerald-400',
    bgClass: 'bg-emerald-500/10 border-emerald-500/30',
  },
  WA: {
    code: 'WA',
    labelRu: 'WA — Неверный ответ (Wrong Answer)',
    labelEn: 'WA — Wrong Answer',
    descriptionRu: 'Программа успешно завершилась, но вывод не совпал с эталоном.',
    descriptionEn: 'The program finished execution, but output differed from expected answer.',
    badgeVariant: 'warning',
    colorClass: 'text-rose-400',
    bgClass: 'bg-rose-500/10 border-rose-500/30',
  },
  TLE: {
    code: 'TLE',
    labelRu: 'TLE — Превышен лимит времени (Time Limit Exceeded)',
    labelEn: 'TLE — Time Limit Exceeded',
    descriptionRu: 'Программа выполнялась дольше 2.5 сек (вероятно, зацикливание while True).',
    descriptionEn: 'Execution timed out (>2.5s). Possible infinite loop or slow algorithm.',
    badgeVariant: 'warning',
    colorClass: 'text-amber-400',
    bgClass: 'bg-amber-500/10 border-amber-500/30',
  },
  MLE: {
    code: 'MLE',
    labelRu: 'MLE — Превышен лимит памяти (Memory Limit Exceeded)',
    labelEn: 'MLE — Memory Limit Exceeded',
    descriptionRu: 'Превышен лимит объема вывода или выделяемой памяти.',
    descriptionEn: 'Memory limit exceeded during array creation or output buffer.',
    badgeVariant: 'purple',
    colorClass: 'text-purple-400',
    bgClass: 'bg-purple-500/10 border-purple-500/30',
  },
  RE: {
    code: 'RE',
    labelRu: 'RE — Ошибка выполнения (Runtime Error)',
    labelEn: 'RE — Runtime Error',
    descriptionRu: 'Программа аварийно завершилась (ZeroDivisionError, IndexError, KeyError и т.д.).',
    descriptionEn: 'Runtime crash occurred (ZeroDivisionError, IndexError, KeyError, etc.).',
    badgeVariant: 'warning',
    colorClass: 'text-red-400',
    bgClass: 'bg-red-500/10 border-red-500/30',
  },
  CE: {
    code: 'CE',
    labelRu: 'CE — Ошибка компиляции (Compilation Error)',
    labelEn: 'CE — Compilation Error',
    descriptionRu: 'Синтаксическая ошибка (SyntaxError, IndentationError, незакрытая скобка).',
    descriptionEn: 'Syntax or parse error prevented compilation.',
    badgeVariant: 'warning',
    colorClass: 'text-orange-400',
    bgClass: 'bg-orange-500/10 border-orange-500/30',
  },
};
