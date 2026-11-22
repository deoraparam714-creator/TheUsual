import type { CSSProperties, ElementType, ReactNode } from 'react';

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  fade?: boolean;
  style?: CSSProperties;
};

/** Fade-and-rise on scroll. Server component; the global observer toggles `.is-in`. */
export function Reveal({ as: Tag = 'div', children, className, delay = 0, fade = false, style }: Props) {
  return (
    <Tag className={[fade ? 'reveal-fade' : 'reveal', className].filter(Boolean).join(' ')} style={{ ...style, ['--delay' as string]: `${delay}ms` }}>
      {children}
    </Tag>
  );
}
