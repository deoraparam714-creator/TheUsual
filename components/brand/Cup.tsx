import { Logo } from './Logo';
import { NameSticker } from './NameSticker';

/** The hot cup (p.17): milk single-wall cup, espresso lid, stacked logo, lime name sticker. */
export function Cup({ name, className, placeholder }: { name?: string; className?: string; placeholder?: string }) {
  return (
    <div className={['relative aspect-[2/3]', className].filter(Boolean).join(' ')}>
      <svg viewBox="0 0 200 300" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="cup-body" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#e9e2d6" />
            <stop offset="0.22" stopColor="#fbf8f3" />
            <stop offset="0.6" stopColor="#f8f4ed" />
            <stop offset="1" stopColor="#ddd5c8" />
          </linearGradient>
          <linearGradient id="cup-lid" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#151311" />
            <stop offset="0.35" stopColor="#2a2723" />
            <stop offset="1" stopColor="#141210" />
          </linearGradient>
        </defs>
        <ellipse cx="100" cy="292" rx="74" ry="6" fill="#1c1a17" opacity="0.14" />
        <path d="M20 42 L180 42 L165 286 Q100 291 35 286 Z" fill="url(#cup-body)" />
        <path d="M12 42 L16 28 Q18 22 32 21 Q62 10 100 10 Q138 10 168 21 Q182 22 184 28 L188 42 Z" fill="url(#cup-lid)" />
        <rect x="8" y="38" width="184" height="9" rx="3" fill="#1c1a17" />
        <ellipse cx="128" cy="16" rx="12" ry="2.6" fill="#3a3631" />
      </svg>
      <Logo variant="stacked" decorative className="absolute left-1/2 top-[27%] w-[42%] -translate-x-1/2 text-espresso" />
      <div className="absolute left-1/2 top-[52%] w-[46%] -translate-x-1/2">
        <NameSticker name={name} placeholder={placeholder} className="w-full shadow-[inset_0_-2px_6px_rgb(0_0_0_/_0.08)]" />
      </div>
    </div>
  );
}
