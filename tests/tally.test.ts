import { describe, expect, it } from 'vitest';
import { applyVisit, tallyMessage } from '@/lib/tally';

describe('tally', () => {
  it('fills five strokes, then unlocks a free usual and restarts', () => {
    let t = { stamps: 0, rewardAvailable: false };
    for (let i = 0; i < 4; i++) t = applyVisit(t, false);
    expect(t).toEqual({ stamps: 4, rewardAvailable: false });
    t = applyVisit(t, false);
    expect(t).toEqual({ stamps: 0, rewardAvailable: true });
  });

  it('uses up the reward when redeemed', () => {
    expect(applyVisit({ stamps: 0, rewardAvailable: true }, true)).toEqual({ stamps: 1, rewardAvailable: false });
    expect(applyVisit({ stamps: 2, rewardAvailable: true }, false)).toEqual({ stamps: 3, rewardAvailable: true });
  });

  it('speaks like the brand', () => {
    expect(tallyMessage(3, false)).toBe('3 of 5 — two more for a free usual.');
    expect(tallyMessage(0, false)).toBe('No tally yet. Your first order starts it.');
    expect(tallyMessage(0, true)).toBe('Tally full. Your next usual is on us.');
  });
});
