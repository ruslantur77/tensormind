const ruPluralRules = new Intl.PluralRules('ru');

/**
 * Russian pluralization for countable nouns.
 * Example: pluralizeRu(22, 'раздел', 'раздела', 'разделов') -> 'раздела'.
 */
export function pluralizeRu(count: number, one: string, few: string, many: string): string {
  switch (ruPluralRules.select(count)) {
    case 'one':
      return one;
    case 'few':
      return few;
    default:
      return many;
  }
}
