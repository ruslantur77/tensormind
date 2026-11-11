import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, X, BookOpen, Sparkles } from 'lucide-react';
import { GLOSSARY_TERMS, GLOSSARY_CATEGORIES } from '@/entities/glossary/model/glossaryData';
import { GlossaryCategory, GlossaryTerm } from '@/entities/glossary/model/types';
import { GlossaryCard } from '@/entities/glossary/ui/GlossaryCard';
import { platform } from '@/shared/lib/platform';
import { getLocalized } from '@/shared/lib/schemas';
export const GlossaryPage: React.FC = () => {
  const { i18n } = useTranslation();
  const lang = (i18n.language === 'en' ? 'en' : 'ru') as 'ru' | 'en';
  const isEn = lang === 'en';

  const [searchParams, setSearchParams] = useSearchParams();
  const urlTerm = searchParams.get('term') || '';
  const urlCategory = (searchParams.get('category') as GlossaryCategory) || 'all';

  const [query, setQuery] = useState(urlTerm);
  const [selectedCategory, setSelectedCategory] = useState<GlossaryCategory>(urlCategory);
  const [sortBy, setSortBy] = useState<'default' | 'alpha'>('default');

  // If query changed via URL
  useEffect(() => {
    if (urlTerm) {
      setQuery(urlTerm);
    }
  }, [urlTerm]);

  // Counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: GLOSSARY_TERMS.length };
    for (const term of GLOSSARY_TERMS) {
      counts[term.category] = (counts[term.category] || 0) + 1;
    }
    return counts;
  }, []);

  // Filtered and sorted terms
  const filteredTerms = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = GLOSSARY_TERMS.filter((term) => {
      const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!q) return true;

      const termRu = getLocalized(term.term, 'ru').toLowerCase();
      const termEn = getLocalized(term.term, 'en').toLowerCase();
      const inId = term.id.toLowerCase().includes(q);
      const inTermRu = termRu.includes(q);
      const inTermEn = termEn.includes(q);
      const inEn = term.englishName.toLowerCase().includes(q);
      const inDefRu = getLocalized(term.shortDefinition, 'ru').toLowerCase().includes(q);
      const inDefEn = getLocalized(term.shortDefinition, 'en').toLowerCase().includes(q);
      const inFormula = term.formulaLatex.toLowerCase().includes(q);
      const inTags = term.tags.some((t) => t.toLowerCase().includes(q));

      return inId || inTermRu || inTermEn || inEn || inDefRu || inDefEn || inFormula || inTags;
    });

    if (sortBy === 'alpha') {
      list = [...list].sort((a, b) => {
        const titleA = getLocalized(a.term, lang);
        const titleB = getLocalized(b.term, lang);
        return titleA.localeCompare(titleB, lang);
      });
    }

    return list;
  }, [query, selectedCategory, sortBy, lang]);

  const handleSelectTag = (tag: string) => {
    platform.haptics.light();
    setQuery(tag);
  };

  const handleResetFilters = () => {
    platform.haptics.light();
    setQuery('');
    setSelectedCategory('all');
    setSearchParams({});
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-white/10 bg-gradient-to-br from-sky-500/10 via-indigo-500/5 to-purple-500/10 p-6 sm:p-8 backdrop-blur-xl">
        <div className="max-w-2xl space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/15 border border-sky-500/30 text-sky-700 dark:text-sky-300">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isEn ? 'Formula & Concept Cheat Sheet' : 'Справочник формул & терминов'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isEn ? 'Machine Learning Glossary' : 'Глоссарий машинного обучения'}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {isEn
              ? 'Instant lookup for ML/DL definitions, mathematical formulas, production use cases, and technical interview gotchas (ML, DL, CV, NLP, RL, Stats).'
              : 'Мгновенный поиск определений, математических формул, сценариев применения и каверзных нюансов для технического собеседования (ML, DL, CV, NLP, RL, Stats).'}
          </p>
        </div>
      </div>

      {/* Controls: Search input + Sort */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                isEn
                  ? 'Search by term or formula: GIL, decorator, F1, L1, ROC-AUC, attention, PPO, LoRA...'
                  : 'Быстрый поиск: GIL, декоратор, F1, L1, ROC-AUC, attention, PPO, LoRA...'
              }
              className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white dark:bg-[#181a1d] border border-slate-200/80 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 shadow-xs"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <div className="relative inline-flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-full py-3 px-3.5 rounded-2xl bg-white dark:bg-[#181a1d] border border-slate-200/80 dark:border-white/10 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/40 shadow-xs cursor-pointer"
              >
                <option value="default">{isEn ? 'By relevance' : 'По релевантности'}</option>
                <option value="alpha">{isEn ? 'Alphabetical (A-Z)' : 'По алфавиту (А-Я)'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {GLOSSARY_CATEGORIES.map((cat) => {
            const count = categoryCounts[cat.id] || 0;
            const isSelected = selectedCategory === cat.id;
            const catLabel = getLocalized(cat.label, lang);

            return (
              <button
                key={cat.id}
                onClick={() => {
                  platform.haptics.light();
                  setSelectedCategory(cat.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer select-none flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-sky-500 text-white shadow-xs scale-102'
                    : 'bg-white/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-50'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{catLabel}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected
                      ? 'bg-white/25 text-white'
                      : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results header */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>
          {isEn ? 'Terms found: ' : 'Найдено терминов: '}
          <strong className="text-slate-900 dark:text-white font-bold">{filteredTerms.length}</strong>
        </span>

        {(query || selectedCategory !== 'all') && (
          <button
            onClick={handleResetFilters}
            className="text-sky-600 dark:text-sky-400 font-semibold hover:underline cursor-pointer"
          >
            {isEn ? 'Reset filters' : 'Сбросить фильтры'}
          </button>
        )}
      </div>

      {/* Terms Grid */}
      {filteredTerms.length === 0 ? (
        <div className="py-16 text-center rounded-3xl border border-dashed border-slate-300 dark:border-white/10 bg-white/40 dark:bg-white/[0.02]">
          <Sparkles className="w-10 h-10 text-slate-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            {isEn ? 'No terms found' : 'Ничего не найдено'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
            {isEn
              ? 'Try modifying your search query or selecting a different category.'
              : 'Попробуйте изменить поисковый запрос или переключить категорию.'}
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-sky-500 text-white shadow-xs hover:bg-sky-600 transition cursor-pointer"
          >
            {isEn ? 'Show all terms' : 'Показать все термины'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTerms.map((term) => (
            <GlossaryCard
              key={term.id}
              term={term}
              lang={lang}
              searchQuery={query}
              onSelectTag={handleSelectTag}
            />
          ))}
        </div>
      )}
    </div>
  );
};
