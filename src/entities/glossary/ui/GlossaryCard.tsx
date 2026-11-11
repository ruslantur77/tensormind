import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Copy, Check, ArrowRight, Lightbulb, Target } from 'lucide-react';
import { GlossaryTerm } from '../model/types';
import { GLOSSARY_CATEGORIES } from '../model/glossaryData';
import { MathText } from '@/shared/lib/katex/MathText';
import { platform } from '@/shared/lib/platform';
import { getLocalized } from '@/shared/lib/schemas';

interface GlossaryCardProps {
  term: GlossaryTerm;
  searchQuery?: string;
  lang?: 'ru' | 'en';
  onSelectTag?: (tag: string) => void;
}

export const GlossaryCard: React.FC<GlossaryCardProps> = ({
  term,
  searchQuery = '',
  lang: propLang,
  onSelectTag,
}) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const lang = propLang || (i18n.language === 'en' ? 'en' : 'ru');
  const isEn = lang === 'en';

  const [copied, setCopied] = useState(false);

  const categoryMeta = GLOSSARY_CATEGORIES.find((c) => c.id === term.category) || {
    id: 'all',
    label: { ru: 'ML', en: 'ML' },
    icon: '⚡',
    color: 'from-sky-500 to-indigo-500',
  };

  const termTitle = getLocalized(term.term, lang);
  const shortDef = getLocalized(term.shortDefinition, lang);
  const formulaDesc = term.formulaDescription ? getLocalized(term.formulaDescription, lang) : '';
  const categoryLabel = getLocalized(categoryMeta.label, lang);

  const handleCopyFormula = (e: React.MouseEvent) => {
    e.stopPropagation();
    platform.haptics.light();
    navigator.clipboard.writeText(term.formulaLatex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGoToLesson = (e: React.MouseEvent) => {
    e.stopPropagation();
    platform.haptics.medium();
    if (term.lessonPath) {
      navigate(`/module/${term.lessonPath.moduleId}/lesson/${term.lessonPath.lessonId}`);
    }
  };

  const lessonTitle = term.lessonPath ? getLocalized(term.lessonPath.title, lang) : '';

  return (
    <div className="relative rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-[#181a1d]/80 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-200 p-5 sm:p-6 flex flex-col justify-between group overflow-hidden">
      {/* Top subtle category accent line */}
      <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${categoryMeta.color} opacity-70 group-hover:opacity-100 transition-opacity`} />

      <div>
        {/* Header: Title + Category */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
              {termTitle}
            </h3>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 font-sans block mt-0.5">
              {term.englishName}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-slate-700 dark:text-slate-300 shrink-0 select-none">
            <span>{categoryMeta.icon}</span>
            <span>{categoryLabel}</span>
          </span>
        </div>

        {/* Short definition */}
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          {shortDef}
        </p>

        {/* Formula Box */}
        <div className="my-3 rounded-xl border border-sky-500/20 dark:border-sky-500/25 bg-sky-50/50 dark:bg-sky-950/20 p-3 sm:p-4 relative group/formula overflow-hidden">
          <div className="flex items-center justify-between text-[11px] font-mono text-sky-700 dark:text-sky-300 font-bold mb-1 select-none">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
              {isEn ? 'FORMULA' : 'ФОРМУЛА'}
            </span>
            <button
              onClick={handleCopyFormula}
              title={isEn ? 'Copy LaTeX' : 'Скопировать LaTeX'}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-sky-300/60 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 text-[10px] font-sans font-medium transition cursor-pointer shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">{isEn ? 'Copied' : 'Скопировано'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-slate-500" />
                  <span>LaTeX</span>
                </>
              )}
            </button>
          </div>

          <div className="overflow-x-auto py-1 text-center">
            <MathText text={`$$${term.formulaLatex}$$`} inlineOnly={false} />
          </div>

          {formulaDesc && (
            <div className="mt-2 text-[11px] text-slate-600 dark:text-slate-400 border-t border-sky-200/50 dark:border-white/5 pt-1.5 leading-relaxed">
              <MathText text={formulaDesc} inlineOnly={true} />
            </div>
          )}
        </div>

        {/* When and Why to Use */}
        {term.whenToUse && term.whenToUse.length > 0 && (
          <div className="mt-3.5 mb-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{isEn ? 'When and Why to Use:' : 'Для чего и когда применять:'}</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pl-1">
              {term.whenToUse.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <MathText text={getLocalized(item, lang)} inlineOnly={true} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Interview Caveat */}
        {term.interviewCaveats && term.interviewCaveats.length > 0 && (
          <div className="mt-3 rounded-xl border border-amber-500/25 bg-amber-500/5 dark:bg-amber-500/10 p-3 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-300 mb-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{isEn ? 'Interview Nuances & Caveats:' : 'На собеседованиях:'}</span>
            </div>
            <div className="space-y-1.5 text-slate-700 dark:text-slate-300 leading-relaxed">
              {term.interviewCaveats.map((cav, idx) => (
                <div key={idx}>
                  <MathText text={getLocalized(cav, lang)} inlineOnly={true} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer: Tags + Lesson link */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap gap-1">
          {term.tags.slice(0, 4).map((tag) => (
            <button
              key={tag}
              onClick={() => onSelectTag?.(tag)}
              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition cursor-pointer"
            >
              #{tag}
            </button>
          ))}
        </div>

        {term.lessonPath && (
          <button
            onClick={handleGoToLesson}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/20 transition cursor-pointer ml-auto group/btn"
          >
            <span>
              {isEn ? 'Lesson: ' : 'В урок «'}
              {lessonTitle.length > 24 ? lessonTitle.slice(0, 24) + '...' : lessonTitle}
              {!isEn && '»'}
            </span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
};
