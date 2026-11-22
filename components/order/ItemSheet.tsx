'use client';

import { useMemo } from 'react';
import { create } from 'zustand';
import { ItemImage } from '@/components/menu/ItemImage';
import { Button } from '@/components/ui/Button';
import { inr } from '@/lib/format';
import type { MenuItem } from '@/lib/menu';
import { normalizeOptions, priceLine } from '@/lib/pricing';
import { useCart } from '@/store/cart';
import { Sheet } from './Sheet';
import { Stepper, useToast } from './bits';

export function ItemSheet({ item, onClose }: { item: MenuItem | null; onClose: () => void }) {
  return (
    <Sheet open={!!item} onClose={onClose} label={item ? item.name : 'Item'} footer={item ? <Footer key={item.id} item={item} onDone={onClose} /> : null}>
      {item && <Body key={item.id} item={item} />}
    </Sheet>
  );
}

// Body and footer share selection state through a tiny store keyed by item.
type Sel = { options: Record<string, string[]>; qty: number; note: string };
const useSel = create<{ byItem: Record<string, Sel>; set: (id: string, s: Partial<Sel>) => void }>((set) => ({
  byItem: {},
  set: (id, s) => set((st) => ({ byItem: { ...st.byItem, [id]: { ...(st.byItem[id] ?? { options: {}, qty: 1, note: '' }), ...s } } })),
}));

function useSelection(item: MenuItem) {
  const sel = useSel((s) => s.byItem[item.id]);
  const set = useSel((s) => s.set);
  const current: Sel = sel ?? { options: normalizeOptions(item, {}), qty: 1, note: '' };
  return [current, (s: Partial<Sel>) => set(item.id, { ...current, ...s })] as const;
}

function Body({ item }: { item: MenuItem }) {
  const [sel, setSel] = useSelection(item);

  const toggle = (groupId: string, choiceId: string, type: 'single' | 'multi') => {
    const cur = sel.options[groupId] ?? [];
    const next = type === 'single' ? [choiceId] : cur.includes(choiceId) ? cur.filter((c) => c !== choiceId) : [...cur, choiceId];
    setSel({ options: { ...sel.options, [groupId]: next } });
  };

  return (
    <div>
      <ItemImage item={item} sizes="(min-width: 768px) 560px, 100vw" className="aspect-[4/3] w-full md:aspect-[16/10]" preload />
      <div className="px-4 pb-6 pt-6 md:px-6">
        <div className="flex items-start justify-between gap-4">
          <h2 className="t-title">{item.name}</h2>
          <p className="pt-1 font-display text-xl font-semibold tabular-nums">{inr(item.price)}</p>
        </div>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-grind">{item.long}</p>

        {item.options.map((g) => (
          <fieldset key={g.id} className="mt-8">
            <legend className="flex w-full items-baseline justify-between">
              <span className="t-label text-espresso">{g.label}</span>
              <span className="text-xs text-grind">{g.type === 'single' ? 'Pick one' : 'Optional'}</span>
            </legend>
            <div className="mt-3 divide-y divide-line overflow-hidden rounded-[18px] bg-foam">
              {g.choices.map((c) => {
                const checked = (sel.options[g.id] ?? []).includes(c.id);
                return (
                  <label key={c.id} className="flex min-h-14 cursor-pointer items-center gap-3 px-4 transition-colors hover:bg-[#f6f1e8]">
                    <input
                      type={g.type === 'single' ? 'radio' : 'checkbox'}
                      name={`${item.id}-${g.id}`}
                      checked={checked}
                      onChange={() => toggle(g.id, c.id, g.type)}
                      className="peer sr-only"
                    />
                    <span
                      aria-hidden
                      className={[
                        'grid size-5 shrink-0 place-items-center border-[1.5px] transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-espresso',
                        g.type === 'single' ? 'rounded-full' : 'rounded-[6px]',
                        checked ? 'border-espresso bg-espresso' : 'border-line-strong bg-milk',
                      ].join(' ')}
                    >
                      {checked &&
                        (g.type === 'single' ? (
                          <span className="size-2 rounded-full bg-lime" />
                        ) : (
                          <svg viewBox="0 0 12 12" className="size-3 text-milk" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M2.5 6.2l2.3 2.3 4.7-5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ))}
                    </span>
                    <span className="flex-1 text-[0.9375rem]">{c.label}</span>
                    {c.price ? <span className="text-sm tabular-nums text-grind">+{inr(c.price)}</span> : null}
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}

        <div className="mt-8">
          <label htmlFor={`${item.id}-note`} className="t-label text-espresso">
            Anything we should know?
          </label>
          <input
            id={`${item.id}-note`}
            value={sel.note}
            onChange={(e) => setSel({ note: e.target.value.slice(0, 140) })}
            placeholder="No onions, extra crispy, it’s a birthday…"
            className="mt-3 min-h-12 w-full rounded-[10px] border border-line-strong bg-milk px-4 text-base placeholder:text-grind/60 focus:border-espresso focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}

function Footer({ item, onDone }: { item: MenuItem; onDone: () => void }) {
  const [sel, setSel] = useSelection(item);
  const add = useCart((s) => s.add);
  const toast = useToast((s) => s.show);
  const priced = useMemo(() => {
    try {
      return priceLine({ itemId: item.id, qty: sel.qty, options: sel.options, note: sel.note });
    } catch {
      return null;
    }
  }, [item.id, sel]);

  return (
    <div className="flex items-center gap-3">
      <Stepper value={sel.qty} onChange={(v) => setSel({ qty: Math.max(1, v) })} label="Quantity" />
      <Button
        variant="lime"
        size="lg"
        className="flex-1 justify-between"
        disabled={!priced}
        onClick={() => {
          if (!priced) return;
          add({ itemId: item.id, qty: sel.qty, options: normalizeOptions(item, sel.options), note: sel.note.trim() || undefined });
          useSel.setState((s) => {
            const rest = { ...s.byItem };
            delete rest[item.id];
            return { byItem: rest };
          });
          toast(`Added. ${sel.qty > 1 ? `${sel.qty} × ` : ''}${item.name}`);
          onDone();
        }}
      >
        <span>Add to order</span>
        <span className="tabular-nums">{priced ? inr(priced.lineTotal) : '—'}</span>
      </Button>
    </div>
  );
}
