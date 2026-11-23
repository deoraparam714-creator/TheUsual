import type { CSSProperties, ElementType, ReactNode } from 'react';

type Variant = 'up' | 'fade' | 'left' | 'right' | 'tilt' | 'zoom';

const CLASS: Record<Variant, string> = {
  up: 'reveal',
  fade: 'reveal-fade',
  left: 'reveal-left',
  right: 'reveal-right',
  tilt: 'reveal-tilt',
  zoom: 'reveal-zoom',
};

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  /** @deprecated use variant="fade" */
  fade?: boolean;
  variant?: Variant;
  style?: CSSProperties;
};

/** Scroll reveal. Server component; the global observer toggles `.is-in`. */
export function Reveal({ as: Tag = 'div', children, className, delay = 0, fade = false, variant, style }: Props) {
  const v: Variant = variant ?? (fade ? 'fade' : 'up');
  return (
    <Tag className={[CLASS[v], className].filter(Boolean).join(' ')} style={{ ...style, ['--delay' as string]: `${delay}ms` }}>
      {children}
    </Tag>
  );
}
