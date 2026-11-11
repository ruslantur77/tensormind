/**
 * Helper utilities for Anki-style Cloze deletion syntax:
 * {{c1::hidden_text}} or {{c1::hidden_text::hint}}
 */

/**
 * Transforms cloze text into question view, replacing blanks with [ ... ] or [ hint ]
 */
export function formatClozeQuestion(clozeText: string): string {
  if (!clozeText) return '';
  return clozeText.replace(/\{\{c\d+::(.*?)(?:::([^}]+))?\}\}/g, (_, _answer, hint) => {
    return hint ? `[ ${hint} ]` : `[ ... ]`;
  });
}

/**
 * Transforms cloze text into revealed answer view with bold/highlighted answers
 */
export function formatClozeAnswer(clozeText: string): string {
  if (!clozeText) return '';
  return clozeText.replace(/\{\{c\d+::(.*?)(?:::.*?)?\}\}/g, '**$1**');
}

/**
 * Extracts all primary cloze answers
 */
export function extractClozeAnswers(clozeText: string): string[] {
  if (!clozeText) return [];
  const matches: string[] = [];
  const regex = /\{\{c\d+::(.*?)(?:::.*?)?\}\}/g;
  let match;
  while ((match = regex.exec(clozeText)) !== null) {
    matches.push(match[1]);
  }
  return matches;
}
