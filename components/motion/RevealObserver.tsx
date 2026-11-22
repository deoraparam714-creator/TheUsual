'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const SELECTOR = '.reveal, .reveal-fade, .img-reveal, .line-mask, .tally-draw';

/**
 * One IntersectionObserver for the whole app. Adds `.is-in` to reveal elements
 * as they enter the viewport, so section components can stay server-rendered.
 */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.01 },
    );
    const watch = (el: Element) => {
      if (!el.classList.contains('is-in')) io.observe(el);
    };
    const scan = (root: ParentNode) => root.querySelectorAll(SELECTOR).forEach(watch);
    scan(document);
    const mo = new MutationObserver((muts) => {
      for (const m of muts)
        m.addedNodes.forEach((n) => {
          if (n instanceof Element) {
            if (n.matches(SELECTOR)) watch(n);
            scan(n);
          }
        });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);
  return null;
}
