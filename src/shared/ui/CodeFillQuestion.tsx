import React from 'react';
import { Terminal, CheckCircle2, XCircle } from 'lucide-react';
import { platform } from '@/shared/lib/platform';

interface CodeFillQuestionProps {
  question: string;
  codeSnippet: string;
  options: string[];
  selectedOption: number | null | undefined;
  onSelectOption: (index: number) => void;
  isSubmitted: boolean;
  correctAnswer: number;
  language?: string;
}

export const CodeFillQuestion: React.FC<CodeFillQuestionProps> = ({
  question,
  codeSnippet,
  options,
  selectedOption,
  onSelectOption,
  isSubmitted,
  correctAnswer,
  language = 'python',
}) => {
  // Split codeSnippet by the slot placeholder '___'
  const parts = codeSnippet.split('___');
  const beforeSlot = parts[0] || '';
  const afterSlot = parts.slice(1).join('___');

  const hasSelection = selectedOption !== null && selectedOption !== undefined;
  const isSelectedCorrect = hasSelection && selectedOption === correctAnswer;

  // Compute line numbers
  const fullText = beforeSlot + (hasSelection ? options[selectedOption] : '______') + afterSlot;
  const lineCount = fullText.split('\n').length;

  return (
    <div className="space-y-4">
      {/* Code Editor Window */}
      <div className="rounded-2xl border border-white/10 bg-[#141517] shadow-xl overflow-hidden">
        {/* Editor Top Bar */}
        <div className="flex items-center justify-between px-3.5 py-2 border-b border-white/10 bg-white/[0.03]">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
            <span className="ml-2 text-[11px] font-mono text-slate-400 flex items-center gap-1">
              <Terminal className="w-3 h-3 text-sky-400" />
              script.{language === 'python' ? 'py' : 'ts'}
            </span>
          </div>
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500">
            {language}
          </span>
        </div>

        {/* Code Content with Slot */}
        <div className="p-4 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto leading-relaxed">
          <pre className="whitespace-pre flex">
            {/* Line numbers */}
            <span className="select-none text-slate-600 text-right pr-4 font-mono text-xs">
              {Array.from({ length: lineCount }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </span>

            {/* Code Body */}
            <code className="text-slate-200">
              {beforeSlot}
              {/* The Interactive Blank Slot */}
              {hasSelection ? (
                <span
                  className={`inline-block px-2 py-0.5 mx-1 rounded font-bold transition-all shadow-sm ${
                    isSubmitted
                      ? isSelectedCorrect
                        ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/50'
                        : 'bg-red-500/25 text-red-300 border border-red-500/50 line-through'
                      : 'bg-sky-500/20 text-sky-300 border border-sky-500/50 ring-1 ring-sky-500/30'
                  }`}
                >
                  {options[selectedOption]}
                </span>
              ) : (
                <span className="inline-block px-2.5 py-0.5 mx-1 rounded border border-dashed border-sky-400 bg-sky-500/15 text-sky-300 font-bold animate-pulse">
                  [ ? ]
                </span>
              )}
              {afterSlot}
            </code>
          </pre>
        </div>
      </div>

      {/* Options Selection Grid */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center justify-between">
          <span>Выберите фрагмент для вставки:</span>
          {hasSelection && !isSubmitted && (
            <span className="text-sky-600 dark:text-sky-400 text-[11px]">Фрагмент выбран</span>
          )}
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {options.map((opt, idx) => {
            const isThisSelected = selectedOption === idx;
            const isThisCorrect = idx === correctAnswer;

            let cardStyle =
              'border-slate-200 dark:border-white/10 hover:border-sky-400/50 bg-white/70 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200';

            if (isSubmitted) {
              if (isThisCorrect) {
                cardStyle =
                  'border-emerald-500/60 bg-emerald-500/15 text-emerald-900 dark:text-emerald-300 font-bold';
              } else if (isThisSelected) {
                cardStyle =
                  'border-red-500/60 bg-red-500/15 text-red-900 dark:text-red-300 font-bold';
              }
            } else if (isThisSelected) {
              cardStyle =
                'border-sky-500 bg-sky-500/20 text-sky-950 dark:text-sky-200 font-bold ring-1 ring-sky-500/50 shadow-sm';
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isSubmitted}
                onClick={() => {
                  platform.haptics.light();
                  onSelectOption(idx);
                }}
                className={`p-3 rounded-xl border text-left font-mono text-xs sm:text-sm cursor-pointer transition flex items-center justify-between group ${cardStyle} ${
                  isSubmitted ? 'cursor-default' : ''
                }`}
              >
                <span className="break-all">{opt}</span>
                {isSubmitted && isThisCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                )}
                {isSubmitted && isThisSelected && !isThisCorrect && (
                  <XCircle className="w-4 h-4 text-red-500 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
