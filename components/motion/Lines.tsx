import type { ElementType, ReactNode } from 'react';

type Props = {
  as?: ElementType;
  lines: ReactNode[];
  className?: string;
  /** ms before the first line; each next line adds `stagger`. */
  delay?: number;
  stagger?: number;
  id?: string;
};

/** Headline that rises line by line from behind a mask. Server component. */
export function Lines({ as: Tag = 'h2', lines, className, delay = 0, stagger = 90, id }: Props) {
  return (
    <Tag className={className} id={id}>
      {lines.map((line, i) => (
        <span key={i} className="line-mask" style={{ ['--delay' as string]: `${delay + i * stagger}ms` }}>
          <span className="line-inner">{line}</span>
        </span>
      ))}
    </Tag>
  );
}
