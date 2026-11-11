import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, BookOpen, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GLOSSARY_TERMS, GLOSSARY_CATEGORIES } from '@/entities/glossary/model/glossaryData';
import { GlossaryCategory, GlossaryTerm } from '@/entities/glossary/model/types';
import { MathText } from '@/shared/lib/katex/MathText';
import { platform } from '@/shared/lib/platform';
import { getLocalized } from '@/shared/lib/schemas';

interface GlossarySpotlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export const GlossarySpotlightModal: React.FC<GlossarySpotlightModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
}) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const lang = (i18n.language === 'en' ? 'en' : 'ru') as 'ru' | 'en';
  const isEn = lang === 'en';

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<GlossaryCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, initialQuery]);

  // Filtered terms
  const filteredTerms = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GLOSSARY_TERMS.filter((term) => {
      const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!q) return true;

      const termRu = getLocalized(term.term, 'ru').toLowerCase();
      const termEn = getLocalized(term.term, 'en').toLowerCase();
      const inTermRu = termRu.includes(q);
      const inTermEn = termEn.includes(q);
      const inEn = term.englishName.toLowerCase().includes(q);
      const inDef = getLocalized(term.shortDefinition, lang).toLowerCase().includes(q);
      const inFormula = term.formulaLatex.toLowerCase().includes(q);
      const inTags = term.tags.some((t) => t.toLowerCase().includes(q));

      return inTermRu || inTermEn || inEn || inDef || inFormula || inTags;
    });
  }, [query, selectedCategory, lang]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredTerms.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        if (filteredTerms[selectedIndex]) {
          e.preventDefault();
          handleSelectTerm(filteredTerms[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredTerms, selectedIndex, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current && listRef.current.children[selectedIndex]) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  const handleSelectTerm = (term: GlossaryTerm) => {
    platform.haptics.light();
    onClose();
    navigate(`/glossary?term=${term.id}`);
  };

  const handleOpenFullGlossary = () => {
    platform.haptics.medium();
    onClose();
    navigate('/glossary');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-[#181a1d] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[82vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
          <Search className="w-5 h-5 text-sky-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={
              isEn
                ? 'Search formulas, terms (GIL, decorator, F1, L1, attention...)'
                : 'Поиск по формуле, термину (GIL, декоратор, F1, L1, attention...)'
            }
            className="flex-1 bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
              }}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-1.5 px-4 py-2 overflow-x-auto border-b border-slate-100 dark:border-white/5 scrollbar-none bg-slate-50/30 dark:bg-transparent">
          {GLOSSARY_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                platform.haptics.light();
                setSelectedCategory(cat.id);
                setSelectedIndex(0);
              }}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer select-none flex items-center gap-1 ${
                selectedCategory === cat.id
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{getLocalized(cat.label, lang)}</span>
            </button>
          ))}
        </div>

        {/* Results List */}
        <div ref={listRef} className="overflow-y-auto p-2 space-y-1 flex-1 divide-y divide-slate-100 dark:divide-white/5">
          {filteredTerms.length === 0 ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
              <Sparkles className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
              <span>{isEn ? `No results for "${query}"` : `Ничего не найдено по запросу «${query}»`}</span>
            </div>
          ) : (
            filteredTerms.map((term, idx) => {
              const isSelected = idx === selectedIndex;
              const termTitle = getLocalized(term.term, lang);
              const termDef = getLocalized(term.shortDefinition, lang);

              return (
                <div
                  key={term.id}
                  onClick={() => handleSelectTerm(term)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-xl transition cursor-pointer flex flex-col gap-1.5 select-none ${
                    isSelected
                      ? 'bg-sky-500/10 dark:bg-sky-500/15 border border-sky-500/30'
                      : 'hover:bg-slate-100/70 dark:hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {termTitle}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 font-sans">
                      {term.englishName}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {termDef}
                  </p>

                  {/* Compact formula snippet */}
                  <div className="text-[11px] text-sky-700 dark:text-sky-300 bg-sky-500/5 dark:bg-white/5 px-2.5 py-1 rounded-md font-mono overflow-x-auto text-center border border-sky-500/10 dark:border-white/5">
                    <MathText text={`$${term.formulaLatex}$`} inlineOnly={true} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-3 bg-slate-50/80 dark:bg-white/[0.02] border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 font-mono text-[10px]">↑↓</kbd>
              <span>{isEn ? 'navigate' : 'навигация'}</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 font-mono text-[10px]">↵</kbd>
              <span>{isEn ? 'open' : 'открыть'}</span>
            </span>
          </div>

          <button
            onClick={handleOpenFullGlossary}
            className="flex items-center gap-1 text-sky-600 dark:text-sky-400 font-semibold hover:underline cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isEn ? 'Full Glossary' : 'Весь глоссарий'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
