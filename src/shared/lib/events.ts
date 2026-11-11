// Event bus for synchronizing reactive state across Header, Stats, and Learning modes
export const STATS_UPDATED_EVENT = 'tensormind:stats-updated';

export function dispatchStatsUpdated(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(STATS_UPDATED_EVENT));
  }
}
