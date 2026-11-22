type Props = {
  /** 0–5. Five shows the lime slash: five visits, one regular. */
  count?: number;
  className?: string;
  /** Show unfilled strokes faintly so progress reads as "3 of 5". */
  ghost?: boolean;
  /** Draw strokes in when scrolled into view (uses the global reveal observer). */
  draw?: boolean;
  delay?: number;
  slashColor?: string;
  label?: string;
};

const STROKES = [20, 46, 72, 98];

export function Tally({ count = 5, className, ghost = false, draw = false, delay = 0, slashColor = 'var(--color-lime)', label }: Props) {
  const c = Math.max(0, Math.min(5, count));
  return (
    <svg
      viewBox="0 0 120 120"
      className={[draw ? 'tally-draw' : '', className].filter(Boolean).join(' ')}
      style={{ ['--delay' as string]: `${delay}ms` }}
      fill="none"
      strokeLinecap="round"
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    >
      {STROKES.map((x, i) => {
        const filled = i < c;
        if (!filled && !ghost) return null;
        return (
          <line
            key={x}
            x1={x}
            y1={14}
            x2={x}
            y2={106}
            stroke="currentColor"
            strokeOpacity={filled ? 1 : 0.14}
            strokeWidth={11}
            pathLength={1}
            className={filled ? 'tally-stroke' : undefined}
            style={{ ['--i' as string]: i }}
          />
        );
      })}
      {(c >= 5 || ghost) && (
        <line
          x1={6}
          y1={84}
          x2={114}
          y2={36}
          stroke={c >= 5 ? slashColor : 'currentColor'}
          strokeOpacity={c >= 5 ? 1 : 0.14}
          strokeWidth={11}
          pathLength={1}
          className={c >= 5 ? 'tally-stroke' : undefined}
          style={{ ['--i' as string]: 4.6 }}
        />
      )}
    </svg>
  );
}
