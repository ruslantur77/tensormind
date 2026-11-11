import React, { useMemo } from 'react';
import katex from 'katex';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';

export interface MathTextProps {
  text: string;
  className?: string;
  inlineOnly?: boolean;
}

export const MathText: React.FC<MathTextProps> = ({
  text,
  className = '',
  inlineOnly = false,
}) => {
  const { html, isBlock } = useMemo(() => {
    if (!text) return { html: '', isBlock: false };

    const blockMathMap: string[] = [];
    const inlineMathMap: string[] = [];
    const codeBlockMap: string[] = [];

    // Pre-processing: Clean up raw Cloze tokens if passed directly (e.g. {{c1::term}} -> term)
    let sanitized = text.replace(/\{\{c\d+::(.*?)(?:::.*?)?\}\}/g, '$1');

    // 0. Extract multiline fenced code blocks ```lang\n...``` BEFORE math extraction
    sanitized = sanitized.replace(/```([a-zA-Z0-9_-]*)[\t ]*\r?\n([\s\S]*?)```/g, (_, lang, code) => {
      const idx = codeBlockMap.length;
      const rawLang = (lang || '').trim().toLowerCase();
      const cleanLang = rawLang === 'py' ? 'python' : rawLang === 'sh' ? 'bash' : rawLang || 'python';
      
      const targetGrammar = Prism.languages[cleanLang] || Prism.languages.python;
      const targetGrammarName = Prism.languages[cleanLang] ? cleanLang : 'python';
      
      let highlightedCode = '';
      try {
        highlightedCode = Prism.highlight(code.trimEnd(), targetGrammar, targetGrammarName);
      } catch {
        highlightedCode = code
          .trimEnd()
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
      }

      const displayLang = cleanLang.toUpperCase();
      const dotColor =
        cleanLang === 'python' ? 'bg-[#3572A5]' :
        cleanLang === 'sql' ? 'bg-[#e38c00]' :
        cleanLang === 'bash' ? 'bg-[#4EAA25]' :
        cleanLang === 'json' ? 'bg-[#CBCB41]' : 'bg-sky-400';

      const langHeader = `
        <div class="flex items-center justify-between px-3.5 py-1.5 bg-[#181a1f] border-b border-white/10 text-[11px] font-mono font-bold select-none">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full ${dotColor}"></span>
            <span class="tracking-wider text-slate-300">${displayLang}</span>
          </div>
          <span class="text-[10px] text-slate-500 font-medium font-sans">code</span>
        </div>
      `;

      codeBlockMap.push(
        `<div class="my-4 rounded-xl overflow-hidden border border-slate-700/60 bg-[#121316] shadow-md">${langHeader}<pre class="p-3.5 text-xs sm:text-sm font-mono text-slate-100 overflow-x-auto leading-relaxed selectable-text !bg-transparent !m-0 !p-3.5"><code class="language-${targetGrammarName}">${highlightedCode}</code></pre></div>`
      );
      return `\n\n%%CODE_BLOCK_${idx}%%\n\n`;
    });

    // Helper to clean math expressions before KaTeX: add space between greek/macro and adjoining letter
    const cleanMath = (expr: string) => {
      let cleaned = expr.trim();
      cleaned = cleaned.replace(/\\(nabla|eta|alpha|beta|gamma|lambda|mu|theta|sigma|omega|phi|psi|epsilon|partial)([a-zA-Z])/g, '\\$1 $2');
      return cleaned;
    };

    // 1. Extract block math $$...$$
    sanitized = sanitized.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
      const idx = blockMathMap.length;
      try {
        const rendered = katex.renderToString(cleanMath(math), {
          displayMode: true,
          throwOnError: false,
        });
        blockMathMap.push(
          `<div class="my-3 overflow-x-auto py-1.5 text-center text-slate-900 dark:text-white">${rendered}</div>`
        );
      } catch (e) {
        blockMathMap.push(`<span class="text-amber-500 font-mono text-sm">${math}</span>`);
      }
      return `%%BLOCK_MATH_${idx}%%`;
    });

    // 2. Extract inline math $...$
    sanitized = sanitized.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
      const idx = inlineMathMap.length;
      try {
        const rendered = katex.renderToString(cleanMath(math), {
          displayMode: false,
          throwOnError: false,
        });
        inlineMathMap.push(
          `<span class="inline-block text-slate-900 dark:text-white font-medium">${rendered}</span>`
        );
      } catch (e) {
        inlineMathMap.push(`<span class="text-amber-500 font-mono text-sm">${math}</span>`);
      }
      return `%%INLINE_MATH_${idx}%%`;
    });

    // 3. Fallback for bare LaTeX macros outside of dollar signs
    sanitized = sanitized.replace(
      /(?:\\(?:epsilon|gamma|sigma|alpha|beta|lambda|mu|theta|nabla|pm|le|ge|approx|neq|cdot|times|in|infty|mathcal\{[A-Z]\}|frac\{[^{}]+\}\{[^{}]+\})|\\\|[a-zA-Z0-9_]+\\\|)/g,
      (match) => {
        const idx = inlineMathMap.length;
        try {
          const rendered = katex.renderToString(cleanMath(match), {
            displayMode: false,
            throwOnError: false,
          });
          inlineMathMap.push(
            `<span class="inline-block text-slate-900 dark:text-white font-medium">${rendered}</span>`
          );
          return `%%INLINE_MATH_${idx}%%`;
        } catch {
          return match;
        }
      }
    );

    // Helper to format inline markdown formatting (bold, italic, code)
    const formatInline = (str: string): string => {
      return str
        // Bold: **text**
        .replace(/\*\*([^*]+?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>')
        // Italic: *text* (avoid matching math or single asterisks)
        .replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em class="italic text-slate-800 dark:text-slate-200">$1</em>')
        // Inline code: `code`
        .replace(/`([^`]+?)`/g, '<code class="px-1.5 py-0.5 rounded-md text-xs font-mono bg-slate-100 dark:bg-slate-800/80 text-sky-700 dark:text-sky-300 border border-slate-200 dark:border-white/10">$1</code>');
    };

    // If pure inline mode requested or no newlines/headings/lists/tables
    const hasHeadings = /^#{1,6}\s/m.test(sanitized);
    const hasHr = /^---$/m.test(sanitized);
    const hasLists = /^[-*]\s/m.test(sanitized);
    const hasTable = /^\|.*\|$/m.test(sanitized);
    const hasBlockMath = blockMathMap.length > 0;
    const hasCodeBlock = codeBlockMap.length > 0;
    const hasMultipleLines = sanitized.includes('\n');

    const shouldRenderAsBlock =
      !inlineOnly && (hasHeadings || hasHr || hasLists || hasTable || hasBlockMath || hasCodeBlock || hasMultipleLines);

    let resultHtml = '';

    if (!shouldRenderAsBlock) {
      resultHtml = formatInline(sanitized);
    } else {
      const lines = sanitized.split('\n');
      const outputParts: string[] = [];
      let currentList: string[] = [];
      let inOrderedList = false;
      let currentParagraph: string[] = [];
      let currentTableLines: string[] = [];

      const flushParagraph = () => {
        if (currentParagraph.length > 0) {
          const content = formatInline(currentParagraph.join(' '));
          outputParts.push(
            `<p class="my-2.5 leading-relaxed text-slate-700 dark:text-slate-300 text-sm sm:text-base">${content}</p>`
          );
          currentParagraph = [];
        }
      };

      const flushList = () => {
        if (currentList.length > 0) {
          if (inOrderedList) {
            outputParts.push(
              `<ol class="my-3 space-y-2 pl-4 list-decimal text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">${currentList.join(
                ''
              )}</ol>`
            );
          } else {
            outputParts.push(
              `<ul class="my-3 space-y-2 pl-1 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">${currentList.join(
                ''
              )}</ul>`
            );
          }
          currentList = [];
          inOrderedList = false;
        }
      };

      const flushTable = () => {
        if (currentTableLines.length >= 2) {
          // Parse header and delimiter
          const parseRow = (rowStr: string) =>
            rowStr
              .replace(/^\|/, '')
              .replace(/\|$/, '')
              .split('|')
              .map((c) => c.trim());

          const headerCells = parseRow(currentTableLines[0]);
          const delimCells = parseRow(currentTableLines[1]);

          const aligns = delimCells.map((d) => {
            if (d.startsWith(':') && d.endsWith(':')) return 'text-center';
            if (d.endsWith(':')) return 'text-right';
            return 'text-left';
          });

          const theadHtml = `
            <thead class="bg-slate-100/90 dark:bg-slate-800/80 border-b border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold select-none">
              <tr>
                ${headerCells
                  .map(
                    (h, idx) =>
                      `<th class="py-2.5 px-3.5 ${aligns[idx] || 'text-left'} whitespace-nowrap font-bold">${formatInline(h)}</th>`
                  )
                  .join('')}
              </tr>
            </thead>
          `;

          const bodyRows = currentTableLines.slice(2).map((r) => parseRow(r));
          const tbodyHtml = `
            <tbody class="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
              ${bodyRows
                .map(
                  (row) => `
                <tr class="hover:bg-slate-500/[0.04] transition">
                  ${row
                    .map(
                      (c, idx) =>
                        `<td class="py-2.5 px-3.5 ${aligns[idx] || 'text-left'} align-top">${formatInline(c)}</td>`
                    )
                    .join('')}
                </tr>
              `
                )
                .join('')}
            </tbody>
          `;

          outputParts.push(`
            <div class="my-4 overflow-x-auto rounded-xl border border-slate-200/80 dark:border-white/10 shadow-sm bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm">
              <table class="w-full text-left text-xs sm:text-sm border-collapse font-sans">
                ${theadHtml}
                ${tbodyHtml}
              </table>
            </div>
          `);
        }
        currentTableLines = [];
      };

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (!line) {
          flushParagraph();
          flushList();
          flushTable();
          continue;
        }

        // Markdown Table detection: starts and ends with |, or contains concatenated rows with ||
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('|') && trimmedLine.includes('|', 1)) {
          // If multiple table rows got glued into one line with '||'
          if (trimmedLine.includes('||')) {
            const subRows = trimmedLine.split(/(?<=\|)\s*(?=\|)/).map((r) => r.trim()).filter(Boolean);
            flushParagraph();
            flushList();
            for (const subRow of subRows) {
              if (subRow.startsWith('|')) {
                currentTableLines.push(subRow.endsWith('|') ? subRow : subRow + '|');
              }
            }
            continue;
          } else {
            flushParagraph();
            flushList();
            currentTableLines.push(trimmedLine.endsWith('|') ? trimmedLine : trimmedLine + '|');
            continue;
          }
        } else if (currentTableLines.length > 0) {
          flushTable();
        }

        // Horizontal Rule
        if (line === '---' || line === '***') {
          flushParagraph();
          flushList();
          flushTable();
          outputParts.push(
            `<hr class="my-5 border-t border-slate-200 dark:border-white/10" />`
          );
          continue;
        }

        // Headings (checked in descending order of depth: 6, 5, 4, 3, 2, 1)
        const h6Match = line.match(/^######\s+(.*)$/);
        if (h6Match) {
          flushParagraph();
          flushList();
          flushTable();
          outputParts.push(
            `<h6 class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-3 mb-1">${formatInline(
              h6Match[1]
            )}</h6>`
          );
          continue;
        }

        const h5Match = line.match(/^#####\s+(.*)$/);
        if (h5Match) {
          flushParagraph();
          flushList();
          flushTable();
          outputParts.push(
            `<h5 class="text-xs sm:text-sm font-bold text-sky-700 dark:text-sky-300 mt-4 mb-1.5 flex items-center gap-1.5">${formatInline(
              h5Match[1]
            )}</h5>`
          );
          continue;
        }

        const h4Match = line.match(/^####\s+(.*)$/);
        if (h4Match) {
          flushParagraph();
          flushList();
          flushTable();
          outputParts.push(
            `<h4 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-4 mb-2 tracking-tight">${formatInline(
              h4Match[1]
            )}</h4>`
          );
          continue;
        }

        const h3Match = line.match(/^###\s+(.*)$/);
        if (h3Match) {
          flushParagraph();
          flushList();
          flushTable();
          outputParts.push(
            `<h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-6 mb-2.5 tracking-tight flex items-center gap-2">${formatInline(
              h3Match[1]
            )}</h3>`
          );
          continue;
        }

        const h2Match = line.match(/^##\s+(.*)$/);
        if (h2Match) {
          flushParagraph();
          flushList();
          flushTable();
          outputParts.push(
            `<h2 class="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-7 mb-3 tracking-tight">${formatInline(
              h2Match[1]
            )}</h2>`
          );
          continue;
        }

        const h1Match = line.match(/^#\s+(.*)$/);
        if (h1Match) {
          flushParagraph();
          flushList();
          flushTable();
          outputParts.push(
            `<h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-8 mb-4 tracking-tight">${formatInline(
              h1Match[1]
            )}</h1>`
          );
          continue;
        }

        // Unordered List (- item or * item)
        const ulMatch = line.match(/^[-*]\s+(.*)$/);
        if (ulMatch) {
          flushParagraph();
          if (inOrderedList) flushList();
          currentList.push(
            `<li class="flex items-start gap-2.5 my-1.5"><span class="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2 shrink-0"></span><div class="flex-1">${formatInline(
              ulMatch[1]
            )}</div></li>`
          );
          continue;
        }

        // Ordered List (1. item)
        const olMatch = line.match(/^(\d+)\.\s+(.*)$/);
        if (olMatch) {
          flushParagraph();
          if (!inOrderedList) flushList();
          inOrderedList = true;
          currentList.push(
            `<li class="my-1.5 pl-1">${formatInline(olMatch[2])}</li>`
          );
          continue;
        }

        // Standalone Block Math line: %%BLOCK_MATH_x%%
        if (/^%%BLOCK_MATH_\d+%%$/.test(line)) {
          flushParagraph();
          flushList();
          outputParts.push(line);
          continue;
        }

        // Standalone Code Block line: %%CODE_BLOCK_x%%
        if (/^%%CODE_BLOCK_\d+%%$/.test(line)) {
          flushParagraph();
          flushList();
          outputParts.push(line);
          continue;
        }

        // Regular text line
        flushList();
        currentParagraph.push(line);
      }

      flushParagraph();
      flushList();
      flushTable();

      resultHtml = outputParts.join('');
    }

    // 4. Restore code blocks & math tokens
    resultHtml = resultHtml.replace(/%%CODE_BLOCK_(\d+)%%/g, (_, id) => {
      return codeBlockMap[Number(id)] || '';
    });

    resultHtml = resultHtml.replace(/%%BLOCK_MATH_(\d+)%%/g, (_, id) => {
      return blockMathMap[Number(id)] || '';
    });

    resultHtml = resultHtml.replace(/%%INLINE_MATH_(\d+)%%/g, (_, id) => {
      return inlineMathMap[Number(id)] || '';
    });

    return { html: resultHtml, isBlock: shouldRenderAsBlock };
  }, [text, inlineOnly]);

  if (isBlock) {
    return (
      <div
        className={`selectable-text ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={`selectable-text leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
