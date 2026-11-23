'use client';

import { useEffect, useState } from 'react';
import { istTime, istWeekday } from '@/lib/format';
import { getLocation } from '@/lib/site';
import { planSlots } from '@/lib/slots';

/** "Open now · until 6pm" / "Closed · opens 8:00 am Monday". Client-only: depends on the current time. */
export function OpenStatus({ locationId, className }: { locationId: string; className?: string }) {
  const [label, setLabel] = useState<{ open: boolean; text: string } | null>(null);
  useEffect(() => {
    const loc = getLocation(locationId);
    if (!loc) return;
    if (loc.status === 'soon') {
      setLabel({ open: false, text: 'Opening soon' });
      return;
    }
    const update = () => {
      const plan = planSlots(loc);
      if (plan.openNow) {
        const [h, m] = loc.hours.close.split(':').map(Number);
        const close = `${h % 12 || 12}${m ? `:${String(m).padStart(2, '0')}` : ''} ${h >= 12 ? 'pm' : 'am'}`;
        setLabel({ open: true, text: `Open now · until ${close}` });
      } else if (plan.opensAt) {
        const sameDay = istWeekday(plan.opensAt) === istWeekday(new Date());
        setLabel({ open: false, text: `Closed · opens ${istTime(plan.opensAt)}${sameDay ? '' : ` ${istWeekday(plan.opensAt)}`}` });
      } else setLabel({ open: false, text: 'Closed' });
    };
    update();
    const t = setInterval(update, 60_000);
    return () => clearInterval(t);
  }, [locationId]);

  return (
    <p className={['inline-flex min-h-6 items-center gap-2 text-sm', className].filter(Boolean).join(' ')} aria-live="polite">
      {label && (
        <>
          <span aria-hidden className={['size-2 rounded-full', label.open ? 'pulse-dot bg-lime ring-2 ring-lime/30' : 'bg-grind/50'].join(' ')} />
          {label.text}
        </>
      )}
    </p>
  );
}
