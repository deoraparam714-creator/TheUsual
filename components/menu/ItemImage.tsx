import Image from 'next/image';
import { TallyPattern } from '@/components/brand/TallyPattern';
import type { MenuItem } from '@/lib/menu';

type Props = {
  item: MenuItem;
  sizes: string;
  className?: string;
  imgClassName?: string;
  preload?: boolean;
  /** Small thumbnails get a compact typographic fallback. */
  compact?: boolean;
};

/**
 * Product photo, or — for items without a shoot yet — a type-only tile in the
 * spirit of the text-only Australian café menu board.
 */
export function ItemImage({ item, sizes, className, imgClassName, preload, compact }: Props) {
  if (item.image) {
    return (
      <div className={['relative overflow-hidden bg-toast', className].filter(Boolean).join(' ')}>
        <Image
          src={item.image}
          alt={item.imageAlt ?? item.name}
          fill
          sizes={sizes}
          preload={preload}
          className={['object-cover', imgClassName].filter(Boolean).join(' ')}
          style={item.imagePosition ? { objectPosition: item.imagePosition } : undefined}
        />
      </div>
    );
  }
  return (
    <div className={['relative overflow-hidden bg-toast text-espresso', className].filter(Boolean).join(' ')} role="img" aria-label={item.name}>
      <TallyPattern className="absolute inset-0" opacity={0.09} withLime={false} />
      <div className={['absolute inset-0 flex flex-col justify-end', compact ? 'p-2' : 'p-6'].join(' ')}>
        {compact ? (
          <span className="font-display text-sm font-extrabold leading-none tracking-[-0.02em]">
            {item.name.split(' ')[0]}
            <span className="dot" aria-hidden />
          </span>
        ) : (
          <>
            <span className="t-label text-espresso/60">New on the menu</span>
            <span className="mt-2 font-display text-4xl font-extrabold leading-[0.95] tracking-[-0.03em]">
              {item.name}
              <span className="dot" aria-hidden />
            </span>
          </>
        )}
      </div>
    </div>
  );
}
