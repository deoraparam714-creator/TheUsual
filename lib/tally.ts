export const TALLY_SIZE = 5;

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five'];

/** "3 of 5 — two more for a free usual." (p.24) */
export function tallyMessage(stamps: number, rewardAvailable: boolean): string {
  if (rewardAvailable) return 'Tally full. Your next usual is on us.';
  if (stamps <= 0) return 'No tally yet. Your first order starts it.';
  const left = TALLY_SIZE - stamps;
  return `${stamps} of ${TALLY_SIZE} — ${WORDS[left]} more for a free usual.`;
}

/**
 * Apply one visit to a tally. Five strokes unlock a reward; the count restarts.
 * A redeemed reward is used up first.
 */
export function applyVisit(t: { stamps: number; rewardAvailable: boolean }, redeem: boolean) {
  let { stamps, rewardAvailable } = t;
  if (redeem && rewardAvailable) rewardAvailable = false;
  stamps += 1;
  if (stamps >= TALLY_SIZE) {
    stamps = 0;
    rewardAvailable = true;
  }
  return { stamps, rewardAvailable };
}
