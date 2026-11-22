import { useId } from 'react';

type Props = {
  className?: string;
  /** 0.08–0.12 per guidelines (p.15). */
  opacity?: number;
  /** Show the single lime slash. One per pattern, never more. */
  withLime?: boolean;
  color?: string;
};

/** Tallies on a loose grid — for wrap paper, tissue, walls and quiet backgrounds. */
export function TallyPattern({ className, opacity = 0.1, withLime = true, color = 'currentColor' }: Props) {
  const id = useId().replace(/:/g, '');
  return (
    <svg className={className} aria-hidden="true" width="100%" height="100%">
      <defs>
        <pattern id={`tp-${id}`} width="220" height="160" patternUnits="userSpaceOnUse">
          <g stroke={color} strokeWidth="5" strokeLinecap="round" fill="none">
            <g transform="translate(20 20)">
              <path d="M6 4v44M18 4v44M30 4v44M42 4v44M0 36l50-22" />
            </g>
            <g transform="translate(130 96)">
              <path d="M6 4v44M18 4v44M30 4v44M42 4v44M0 36l50-22" />
            </g>
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#tp-${id})`} opacity={opacity} />
      {withLime && (
        <g transform="translate(350 256)" opacity={Math.min(1, opacity * 7)}>
          <path d="M0 36l50-22" stroke="var(--color-lime)" strokeWidth="5" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}
