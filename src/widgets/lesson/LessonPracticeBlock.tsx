import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Eye,
  Copy,
  Sparkles,
  Check,
  Code2,
  Clock,
  Layers,
  ExternalLink,
  Download,
  Target,
  ListChecks,
  Laptop,
  Bug,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Lesson, getLocalized } from '@/shared/lib/schemas';
import { getLessonPracticeTask } from '@/shared/content/practice/lessonPracticeRegistry';
import { practiceTaskRepository } from '@/entities/practice/model/practiceTaskRepository';
import { MathText } from '@/shared/lib/katex/MathText';
import { platform } from '@/shared/lib/platform';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import {
  executeCodeTask,
  RunResults,
  TestVerdict,
  VERDICT_CONFIG,
} from '@/shared/lib/code-runner';

interface LessonPracticeBlockProps {
  lesson: Lesson;
  lang: 'ru' | 'en';
  onTaskCompleted?: () => void;
}

export const LessonPracticeBlock: React.FC<LessonPracticeBlockProps> = ({
  lesson,
  lang,
  onTaskCompleted,
}) => {
  const practiceTask = getLessonPracticeTask(lesson, lang);
  const taskTitle = getLocalized(practiceTask.title, lang);
  const isLocalProject = practiceTask.taskMode === 'local_project';

  // If saved code was identical to the old full solution, reset to starter skeleton
  const [code, setCode] = useState<string>(() => {
    const saved = practiceTaskRepository.getUserCode(lesson.id);
    if (!saved || saved.trim() === practiceTask.solutionCode.trim()) {
      return practiceTask.starterCode;
    }
    return saved;
  });

  const [isCompleted, setIsCompleted] = useState<boolean>(() => {
    return practiceTaskRepository.isCompleted(lesson.id);
  });

  const [hasViewedSolution, setHasViewedSolution] = useState<boolean>(() => {
    return practiceTaskRepository.hasViewedSolution(lesson.id);
  });

  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [copiedSolution, setCopiedSolution] = useState(false);
  const [copiedColab, setCopiedColab] = useState(false);

  // Active testing tab: 'tests' | 'stdout'
  const [activeTab, setActiveTab] = useState<'tests' | 'stdout'>('tests');

  // Test Runner State
  const [isRunning, setIsRunning] = useState(false);
  const [runResults, setRunResults] = useState<RunResults | null>(() => {
    if (practiceTaskRepository.isCompleted(lesson.id) && !isLocalProject) {
      return {
        verdict: 'AC',
        totalTests: practiceTask.testCases?.length || 1,
        passedTests: practiceTask.testCases?.length || 1,
        testResults: (practiceTask.testCases || [{ name: { ru: 'Все тесты', en: 'All tests' } }]).map(
          (tc, idx) => ({
            testIndex: idx + 1,
            name: getLocalized(tc.name, lang),
            verdict: 'AC',
            passed: true,
            executionTimeMs: 12,
          })
        ),
        stdout: '✓ Решение проверено и успешно засчитано.',
        executionTimeMs: 12,
      };
    }
    return null;
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync state when lesson changes
  useEffect(() => {
    const saved = practiceTaskRepository.getUserCode(lesson.id);
    if (!saved || saved.trim() === practiceTask.solutionCode.trim()) {
      setCode(practiceTask.starterCode);
    } else {
      setCode(saved);
    }

    const completed = practiceTaskRepository.isCompleted(lesson.id);
    setIsCompleted(completed);
    setHasViewedSolution(practiceTaskRepository.hasViewedSolution(lesson.id));

    if (completed && !isLocalProject) {
      setRunResults({
        verdict: 'AC',
        totalTests: practiceTask.testCases?.length || 1,
        passedTests: practiceTask.testCases?.length || 1,
        testResults: (practiceTask.testCases || [{ name: { ru: 'Все тесты', en: 'All tests' } }]).map(
          (tc, idx) => ({
            testIndex: idx + 1,
            name: getLocalized(tc.name, lang),
            verdict: 'AC',
            passed: true,
            executionTimeMs: 12,
          })
        ),
        stdout: '✓ Задание ранее выполнено. Все тесты пройдены.',
        executionTimeMs: 12,
      });
    } else {
      setRunResults(null);
    }
    setShowSolution(false);
    setShowHints(false);
    setCopiedColab(false);
  }, [lesson.id, practiceTask.starterCode, isLocalProject]);

  // Tab key indent in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      practiceTaskRepository.saveUserCode(lesson.id, newCode);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setCode(val);
    practiceTaskRepository.saveUserCode(lesson.id, val);
  };

  const handleResetCode = () => {
    platform.haptics.light();
    setCode(practiceTask.starterCode);
    practiceTaskRepository.resetUserCode(lesson.id);
    setRunResults(null);
  };

  const handleCopySolutionToEditor = () => {
    platform.haptics.light();
    if (!isCompleted && !hasViewedSolution) {
      practiceTaskRepository.markSolutionViewed(lesson.id);
      setHasViewedSolution(true);
    }
    setCode(practiceTask.solutionCode);
    practiceTaskRepository.saveUserCode(lesson.id, practiceTask.solutionCode);
    setCopiedSolution(true);
    setTimeout(() => setCopiedSolution(false), 2000);
  };

  const handleToggleSolution = () => {
    platform.haptics.light();
    if (!showSolution) {
      if (!isCompleted && !hasViewedSolution) {
        practiceTaskRepository.markSolutionViewed(lesson.id);
        setHasViewedSolution(true);
      }
      setShowSolution(true);
    } else {
      setShowSolution(false);
    }
  };

  const handleCopyColabCode = () => {
    platform.haptics.light();
    const snippet = practiceTask.solutionCode || practiceTask.colabSnippet || '';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(snippet);
    }
    setCopiedColab(true);
    setTimeout(() => setCopiedColab(false), 2500);
  };

  // Run in-browser real test suite
  const handleRunTests = async () => {
    platform.haptics.light();
    setIsRunning(true);
    setActiveTab('tests');

    try {
      const results = await executeCodeTask(code, practiceTask, lang);
      setRunResults(results);

      if (results.verdict === 'AC') {
        platform.haptics.success();
        const res = await practiceTaskRepository.markCompleted(lesson.id, taskTitle);
        setIsCompleted(true);

        if (res.awarded) {
          try {
            confetti({
              particleCount: hasViewedSolution ? 35 : 55,
              spread: 65,
              origin: { y: 0.7 },
            });
          } catch {
            // Safe fallback
          }
          onTaskCompleted?.();
        }
      } else {
        platform.haptics.error();
      }
    } catch (err: any) {
      setRunResults({
        verdict: 'RE',
        totalTests: 1,
        passedTests: 0,
        testResults: [
          {
            testIndex: 1,
            name: lang === 'en' ? 'Runtime Execution' : 'Выполнение скрипта',
            verdict: 'RE',
            passed: false,
            error: String(err),
            executionTimeMs: 0,
          },
        ],
        stdout: '',
        executionTimeMs: 0,
      });
      platform.haptics.error();
    } finally {
      setIsRunning(false);
    }
  };

  // Handle manual completion of local projects
  const handleMarkProjectCompleted = async () => {
    platform.haptics.success();
    const res = await practiceTaskRepository.markCompleted(lesson.id, taskTitle);
    setIsCompleted(true);
    if (res.awarded) {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe fallback
      }
      onTaskCompleted?.();
    }
  };

  const lineCount = Math.max(code.split('\n').length, 8);
  const isSql = practiceTask.language === 'sql' || code.trim().toLowerCase().startsWith('select');

  // Verdict config helper
  const getVerdictBadge = (verdict: TestVerdict) => {
    const cfg = VERDICT_CONFIG[verdict] || VERDICT_CONFIG.WA;
    const label = lang === 'en' ? cfg.labelEn : cfg.labelRu;
    return {
      label,
      code: cfg.code,
      desc: lang === 'en' ? cfg.descriptionEn : cfg.descriptionRu,
      variant: cfg.badgeVariant,
      colorClass: cfg.colorClass,
      bgClass: cfg.bgClass,
    };
  };

  // =========================================================
  // RENDER MODE 1: LOCAL / COLAB PROJECT (PyTorch, GPU, MLOps)
  // =========================================================
  if (isLocalProject) {
    const isAgentTask =
      Boolean(practiceTask.id?.includes('aidev')) ||
      Boolean(practiceTask.id?.includes('agent')) ||
      lesson.moduleId.includes('ai-assisted') ||
      lesson.moduleId.includes('agent');
    const isMlopsTask = Boolean(practiceTask.id?.includes('mlops')) || lesson.moduleId.includes('mlops');

    const projectBadgeText = isAgentTask
      ? (lang === 'en' ? 'CLI Agent / Terminal' : 'Терминал & CLI-агент')
      : isMlopsTask
      ? (lang === 'en' ? 'MLOps / Infra' : 'MLOps & Инфраструктура')
      : (lang === 'en' ? 'PyTorch / GPU Case' : 'PyTorch / GPU Case');

    const projectSubtitle = isAgentTask
      ? (lang === 'en'
          ? 'Requires terminal / CLI tools. Run with OpenCode / Aider or in Python'
          : 'Реализуйте в локальном терминале (OpenCode / Aider) или Python-скриптом')
      : isMlopsTask
      ? (lang === 'en'
          ? 'Requires Docker / production runtime. Run locally or in cloud'
          : 'Требует Docker / FastAPI / MLOps стек. Реализуйте локально или на сервере')
      : (lang === 'en'
          ? 'Requires full C++/CUDA runtime. Train in local VS Code or Colab'
          : 'Требует полной среды PyTorch / CUDA. Реализуйте в локальном Jupyter или Colab');

    return (
      <div className="space-y-4 pt-2">
        <div className="p-4 sm:p-5 rounded-2xl aero-glass border border-indigo-500/30 dark:border-indigo-500/20 bg-indigo-500/[0.03] space-y-4 relative overflow-hidden">
          {/* Accent top gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0">
                <Laptop className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
                    {lang === 'en'
                      ? 'Hands-on Project (Local / Google Colab)'
                      : 'Практический проект: Локальный запуск / Google Colab'}
                  </h3>
                  <Badge variant="purple" size="sm">
                    {projectBadgeText}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {projectSubtitle}
                </p>
              </div>
            </div>

            {/* Reward badge / Status */}
            {isCompleted ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
                {lang === 'en' ? 'Project Completed (+25 XP)' : 'Проект выполнен (+25 XP)'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 shrink-0 animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                {lang === 'en' ? '+25 XP Project' : '+25 XP за проект'}
              </span>
            )}
          </div>

          {/* Project Specification */}
          <div className="p-4 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/5 space-y-2 text-xs sm:text-sm">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>{taskTitle}</span>
            </div>
            <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
              <MathText text={getLocalized(practiceTask.description, lang)} />
            </div>
          </div>

          {/* Dataset Info Box */}
          {practiceTask.datasetInfo && (
            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-indigo-500/20 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 font-bold text-indigo-400">
                <Download className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Dataset & Environment:' : 'Датасет и окружение:'}</span>
                <span className="text-slate-200">{practiceTask.datasetInfo.name}</span>
              </div>
              {practiceTask.datasetInfo.description && (
                <p className="text-slate-400 pl-5">
                  {getLocalized(practiceTask.datasetInfo.description, lang)}
                </p>
              )}
            </div>
          )}

          {/* Step-by-Step Implementation Checklist */}
          {practiceTask.steps && practiceTask.steps.length > 0 && (
            <div className="p-3.5 rounded-xl bg-slate-900/50 border border-white/10 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-200">
                <ListChecks className="w-4 h-4 text-sky-400" />
                <span>{lang === 'en' ? 'Implementation Plan:' : 'Пошаговый план реализации:'}</span>
              </div>
              <div className="space-y-1.5 pl-1">
                {practiceTask.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-300">
                    <span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{getLocalized(step, lang)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Target Benchmark Card */}
          {practiceTask.targetBenchmark && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-2.5 text-xs text-emerald-300 font-semibold">
              <Target className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{getLocalized(practiceTask.targetBenchmark, lang)}</span>
            </div>
          )}

          {/* Ready-to-Run Colab / Jupyter Code Section */}
          <div className="rounded-xl border border-slate-700/60 bg-[#121316] overflow-hidden text-xs">
            <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/10 bg-white/[0.03]">
              <span className="font-mono text-slate-400 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-sky-400" />
                <span>
                  {isAgentTask
                    ? lang === 'en'
                      ? 'CLI Automation Script & Verification'
                      : 'Скрипт автоматизации / Запуск в терминале'
                    : lang === 'en'
                    ? 'Colab / Jupyter Notebook Script'
                    : 'Готовый скрипт для Colab / Jupyter'}
                </span>
              </span>

              <button
                type="button"
                onClick={handleCopyColabCode}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-500/20"
              >
                {copiedColab ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>{lang === 'en' ? 'Copied to Clipboard!' : 'Скопировано в буфер!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>
                      {isAgentTask
                        ? lang === 'en'
                          ? 'Copy Script'
                          : 'Скопировать код'
                        : lang === 'en'
                        ? 'Copy Script to Colab'
                        : 'Скопировать код для Colab'}
                    </span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 bg-black/40 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed border-t border-white/5 max-h-[380px]">
              <code>{practiceTask.solutionCode}</code>
            </pre>
          </div>

          {/* Project Completion Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/10">
            <p className="text-xs text-slate-400 text-center sm:text-left">
              {isAgentTask
                ? lang === 'en'
                  ? 'Run the CLI agent setup locally in your terminal, verify the benchmark, then confirm completion.'
                  : 'Запустите агента или скрипт в терминале, выполните шаги и подтвердите завершение.'
                : lang === 'en'
                ? 'Run the code locally or in Google Colab, verify the benchmark, then confirm completion.'
                : 'Запустите проект локально или в Colab, достигните целевых метрик и подтвердите выполнение.'}
            </p>

            <Button
              variant="primary"
              size="md"
              onClick={handleMarkProjectCompleted}
              disabled={isCompleted}
              icon={isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Sparkles className="w-4 h-4" />}
              className={
                isCompleted
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/25'
              }
            >
              {isCompleted
                ? lang === 'en'
                  ? 'Completed (+25 XP)'
                  : 'Проект засчитан (+25 XP)'
                : lang === 'en'
                ? 'Mark Project Completed (+25 XP)'
                : 'Отметить проект как выполненный (+25 XP)'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // RENDER MODE 2: INTERACTIVE IN-BROWSER IDE (Python & SQL)
  // =========================================================
  return (
    <div className="space-y-4 pt-2">
      {/* Practice Header Card */}
      <div className="p-4 sm:p-5 rounded-2xl aero-glass border border-emerald-500/30 dark:border-emerald-500/20 bg-emerald-500/[0.03] space-y-3 relative overflow-hidden">
        {/* Accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Code2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  {lang === 'en' ? 'Interactive Practice & Real Test Runner' : 'Практика: Реальное исполнение и тестирование'}
                </h3>
                <Badge variant={isSql ? 'cyan' : 'violet'} size="sm">
                  {isSql ? 'SQL (AlaSQL)' : 'Python 3 (Skulpt)'}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'en'
                  ? 'Complete the code stub below and run verification against test cases'
                  : 'Допишите код в шаблоне ниже и запустите проверку на тестах (AC, WA, TLE, RE, CE)'}
              </p>
            </div>
          </div>

          {/* Reward badge */}
          {isCompleted ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
              {lang === 'en'
                ? hasViewedSolution
                  ? 'Accepted (+10 XP)'
                  : 'Accepted (+25 XP)'
                : hasViewedSolution
                ? 'Решено (+10 XP)'
                : 'Решено (+25 XP)'}
            </span>
          ) : hasViewedSolution ? (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 shrink-0"
              title={
                lang === 'en'
                  ? 'XP reward reduced from 25 to 10 XP because reference solution was viewed'
                  : 'Награда снижена с 25 до 10 XP из-за просмотра эталонного решения'
              }
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              {lang === 'en' ? '+10 XP (with solution)' : '+10 XP (с решением)'}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/15 border border-sky-500/30 text-sky-600 dark:text-sky-400 shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
              {lang === 'en' ? '+25 XP Challenge' : '+25 XP за решение'}
            </span>
          )}
        </div>

        {/* Task Specification */}
        <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/5 space-y-2 text-xs sm:text-sm">
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-sky-500 shrink-0" />
            <span>{taskTitle}</span>
          </div>
          <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
            <MathText text={getLocalized(practiceTask.description, lang)} />
          </div>
        </div>

        {/* Code Editor Window */}
        <div className="rounded-xl border border-slate-700/60 bg-[#121316] shadow-xl overflow-hidden text-xs sm:text-sm">
          {/* Window Topbar */}
          <div className="flex items-center justify-between px-3.5 py-2 border-b border-white/10 bg-white/[0.03]">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 ml-2">
                <span className="w-2 h-2 rounded-full bg-sky-400/80" />
                {isSql ? 'query.sql' : 'solution.py'}
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
              <button
                type="button"
                onClick={handleResetCode}
                className="hover:text-slate-200 transition flex items-center gap-1 cursor-pointer"
                title={lang === 'en' ? 'Reset to starter code stub' : 'Сбросить к исходному шаблону'}
              >
                <RotateCcw className="w-3 h-3" />
                <span>{lang === 'en' ? 'Reset' : 'Сброс'}</span>
              </button>
            </div>
          </div>

          {/* Editor Body */}
          <div className="flex font-mono text-xs sm:text-sm bg-[#121316] relative min-h-[220px]">
            {/* Gutter */}
            <div className="select-none py-3 pl-3 pr-2 text-right text-slate-600 font-mono text-xs border-r border-white/5 bg-black/20 w-10 shrink-0">
              {Array.from({ length: lineCount }).map((_, i) => (
                <div key={i} className="leading-6">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Editable Code */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={handleCodeChange}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              rows={Math.max(lineCount, 8)}
              className="w-full py-3 px-3.5 bg-transparent text-slate-200 font-mono text-xs sm:text-sm leading-6 resize-y outline-none focus:ring-0 focus:border-transparent selection:bg-sky-500/30"
              placeholder={
                isSql
                  ? '-- Напишите ваш SQL запрос здесь...'
                  : '# Напишите ваш Python код здесь...'
              }
            />
          </div>

          {/* Editor Bottom Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 border-t border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              {/* Hints */}
              {practiceTask.hints && practiceTask.hints.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowHints(!showHints)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>
                    {showHints
                      ? lang === 'en'
                        ? 'Hide Hints'
                        : 'Скрыть подсказки'
                      : lang === 'en'
                      ? 'Hints'
                      : 'Подсказка'}
                  </span>
                </button>
              )}

              {/* Reference Solution */}
              <button
                type="button"
                onClick={handleToggleSolution}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                  showSolution
                    ? 'bg-sky-500/20 text-sky-300'
                    : !isCompleted && !hasViewedSolution
                    ? 'text-amber-600 dark:text-amber-400 hover:bg-amber-500/10'
                    : 'text-sky-600 dark:text-sky-400 hover:bg-sky-500/10'
                }`}
                title={
                  !isCompleted && !hasViewedSolution
                    ? lang === 'en'
                      ? 'Viewing reference solution reduces reward from 25 XP to 10 XP'
                      : 'Просмотр эталонного решения снизит награду с 25 XP до 10 XP'
                    : undefined
                }
              >
                <Eye className="w-3.5 h-3.5" />
                <span>
                  {showSolution
                    ? lang === 'en'
                      ? 'Hide Solution'
                      : 'Скрыть решение'
                    : !isCompleted && !hasViewedSolution
                    ? lang === 'en'
                      ? 'Reference Solution (-15 XP)'
                      : 'Эталонное решение (-15 XP)'
                    : lang === 'en'
                    ? 'Reference Solution'
                    : 'Эталонное решение'}
                </span>
              </button>
            </div>

            {/* Run Button */}
            <Button
              variant="primary"
              size="sm"
              onClick={handleRunTests}
              disabled={isRunning}
              icon={<Play className="w-3.5 h-3.5 fill-current" />}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20"
            >
              {isRunning
                ? lang === 'en'
                  ? 'Testing...'
                  : 'Тестирование...'
                : lang === 'en'
                ? 'Run & Check (AC/WA)'
                : 'Запустить и проверить'}
            </Button>
          </div>
        </div>

        {/* Real Test Suite Results Panel */}
        {runResults && (
          <div className="rounded-xl border border-slate-700/60 bg-[#0d0f12] overflow-hidden text-xs animate-fade-in shadow-xl">
            {/* Verdict Header Banner */}
            {(() => {
              const vInfo = getVerdictBadge(runResults.verdict);
              const isAC = runResults.verdict === 'AC';
              return (
                <div
                  className={`p-3.5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${vInfo.bgClass}`}
                >
                  <div className="flex items-center gap-2.5">
                    {isAC ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : runResults.verdict === 'WA' ? (
                      <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    ) : runResults.verdict === 'TLE' ? (
                      <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                    ) : (
                      <Bug className="w-5 h-5 text-orange-400 shrink-0" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-black text-sm tracking-wide ${vInfo.colorClass}`}>
                          {vInfo.label}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded font-mono bg-black/40 text-slate-300 border border-white/10">
                          {runResults.passedTests} / {runResults.totalTests} тестов
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{vInfo.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 shrink-0">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {runResults.executionTimeMs} ms
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Test Navigation Tabs */}
            <div className="flex items-center gap-1 px-3 py-1.5 bg-black/30 border-b border-white/5 font-mono text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('tests')}
                className={`px-3 py-1 rounded-md transition cursor-pointer ${
                  activeTab === 'tests'
                    ? 'bg-white/10 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang === 'en' ? 'Test Cases' : 'Набор тестов'} ({runResults.testResults.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('stdout')}
                className={`px-3 py-1 rounded-md transition cursor-pointer ${
                  activeTab === 'stdout'
                    ? 'bg-white/10 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang === 'en' ? 'Console (Stdout)' : 'Консоль (Stdout)'}
              </button>
            </div>

            {/* Tab 1: Detailed Test Cases */}
            {activeTab === 'tests' && (
              <div className="p-3.5 space-y-3 font-mono">
                {runResults.testResults.map((tc, idx) => {
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border ${
                        tc.passed
                          ? 'border-emerald-500/20 bg-emerald-950/20'
                          : 'border-rose-500/30 bg-rose-950/20'
                      } space-y-2`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              tc.passed
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {tc.verdict}
                          </span>
                          <span className="font-bold text-slate-200 text-xs">
                            Тест #{tc.testIndex}: {tc.name}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500">{tc.executionTimeMs} ms</span>
                      </div>

                      {/* Input if present */}
                      {tc.input && (
                        <div className="space-y-1">
                          <span className="text-[11px] text-slate-400">Входные данные / вызов:</span>
                          <pre className="p-2 rounded bg-black/40 text-slate-300 text-[11px] overflow-x-auto border border-white/5">
                            <code>{tc.input}</code>
                          </pre>
                        </div>
                      )}

                      {/* Error or Diff */}
                      {tc.error ? (
                        <div className="space-y-1">
                          <span className="text-[11px] text-red-400 font-bold">
                            Трассировка ошибки ({tc.verdict}):
                          </span>
                          <pre className="p-2 rounded bg-red-950/50 text-red-300 text-[11px] overflow-x-auto border border-red-500/30 whitespace-pre-wrap">
                            <code>{tc.error}</code>
                          </pre>
                        </div>
                      ) : !tc.passed && tc.expectedOutput !== undefined ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          <div className="space-y-1">
                            <span className="text-[11px] text-emerald-400 font-bold">Ожидаемый вывод:</span>
                            <pre className="p-2 rounded bg-black/40 text-emerald-300 text-[11px] overflow-x-auto border border-emerald-500/20">
                              <code>{tc.expectedOutput}</code>
                            </pre>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[11px] text-rose-400 font-bold">Фактический вывод:</span>
                            <pre className="p-2 rounded bg-black/40 text-rose-300 text-[11px] overflow-x-auto border border-rose-500/20">
                              <code>{tc.actualOutput || '(пустой вывод)'}</code>
                            </pre>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tab 2: Console Stdout */}
            {activeTab === 'stdout' && (
              <div className="p-3.5 font-mono text-xs">
                <div className="text-[11px] text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-sky-400" />
                  <span>Стандартный поток вывода программы (stdout):</span>
                </div>
                <pre className="p-3 rounded-lg bg-black/60 text-slate-200 text-xs overflow-x-auto leading-relaxed border border-white/5 min-h-[80px] whitespace-pre-wrap">
                  <code>{runResults.stdout || '(программа не вывела данных в stdout)'}</code>
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Revealed Step-by-Step Hints */}
        {showHints && practiceTask.hints && practiceTask.hints.length > 0 && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-1.5 text-xs text-amber-900 dark:text-amber-200 animate-fade-in">
            <div className="font-bold flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
              <Lightbulb className="w-4 h-4" />
              <span>{lang === 'en' ? 'Step-by-step Hints:' : 'Подсказки по реализации:'}</span>
            </div>
            <ul className="list-disc list-inside space-y-1 pl-1">
              {practiceTask.hints.map((hint, hIdx) => (
                <li key={hIdx}>
                  <MathText text={getLocalized(hint, lang)} inlineOnly />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Revealed Reference Solution */}
        {showSolution && (
          <div className="p-4 rounded-xl bg-slate-900/95 border border-sky-500/30 space-y-3 animate-fade-in shadow-xl">
            {/* Penalty Warning or Completed Notice */}
            {!isCompleted ? (
              <div className="p-2.5 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-300">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">
                    {lang === 'en' ? 'XP Penalty Applied: ' : 'Награда за задачу снижена: '}
                  </span>
                  <span>
                    {lang === 'en'
                      ? 'Because the reference solution was viewed, solving this challenge now grants +10 XP instead of +25 XP.'
                      : 'Из-за просмотра эталонного решения за решение этой задачи будет начислено +10 XP вместо +25 XP.'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {lang === 'en'
                    ? 'This task has already been completed.'
                    : 'Эта задача уже была успешно зачтена.'}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-sky-400 flex items-center gap-1.5">
                <Code2 className="w-4 h-4" />
                {lang === 'en' ? 'Reference Solution:' : 'Эталонное решение задачи:'}
              </span>
              <button
                type="button"
                onClick={handleCopySolutionToEditor}
                className="px-2.5 py-1 rounded-md bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 text-[11px] font-semibold transition flex items-center gap-1 cursor-pointer"
              >
                {copiedSolution ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>{lang === 'en' ? 'Loaded into editor' : 'Скопировано в редактор'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>{lang === 'en' ? 'Load into editor' : 'Загрузить в редактор'}</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-3 rounded-lg bg-black/40 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed border border-white/5">
              <code>{practiceTask.solutionCode}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
