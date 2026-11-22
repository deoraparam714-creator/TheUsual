import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

type Variant = 'lime' | 'espresso' | 'outline' | 'milk' | 'ghost-light';
type Size = 'md' | 'lg' | 'sm';

const base =
  'group/btn relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-sans font-semibold transition-[background-color,color,box-shadow,transform] duration-300 ease-[var(--ease-out-expo)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40';

const variants: Record<Variant, string> = {
  // The signal. One primary action per screen (p.24).
  lime: 'bg-lime text-espresso hover:shadow-[0_0_0_4px_rgb(197_220_0_/_0.28)]',
  espresso: 'bg-espresso text-milk hover:bg-[#2e2b27]',
  outline: 'border border-espresso text-espresso hover:bg-espresso hover:text-milk',
  milk: 'bg-milk text-espresso hover:bg-foam',
  'ghost-light': 'border border-milk/40 text-milk hover:border-milk hover:bg-milk hover:text-espresso',
};

const sizes: Record<Size, string> = {
  sm: 'min-h-11 px-4 text-[0.875rem]',
  md: 'min-h-12 px-6 text-[0.9375rem]',
  lg: 'min-h-14 px-7 text-base',
};

export function buttonClass(variant: Variant = 'espresso', size: Size = 'md', extra?: string) {
  return [base, variants[variant], sizes[size], extra].filter(Boolean).join(' ');
}

function Arrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type LinkProps = Omit<ComponentProps<typeof Link>, 'className'> & {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
};

export function ButtonLink({ variant = 'espresso', size = 'md', arrow = false, className, children, ...rest }: LinkProps) {
  return (
    <Link className={buttonClass(variant, size, className)} {...rest}>
      {children}
      {arrow && <Arrow />}
    </Link>
  );
}

type BtnProps = ComponentProps<'button'> & { variant?: Variant; size?: Size; arrow?: boolean };

export function Button({ variant = 'espresso', size = 'md', arrow = false, className, children, type = 'button', ...rest }: BtnProps) {
  return (
    <button type={type} className={buttonClass(variant, size, className)} {...rest}>
      {children}
      {arrow && <Arrow />}
    </button>
  );
}
