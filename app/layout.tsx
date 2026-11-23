import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Caveat, Instrument_Serif, Inter } from 'next/font/google';
import { RevealObserver } from '@/components/motion/RevealObserver';
import { site } from '@/lib/site';
import './globals.css';

const bricolage = Bricolage_Grotesque({ subsets: ['latin'], axes: ['opsz'], variable: '--font-bricolage', display: 'swap' });
const instrument = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['italic', 'normal'], variable: '--font-instrument', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const caveat = Caveat({ subsets: ['latin'], variable: '--font-caveat', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'the usual — Coffee & 35g+ protein rolls at Mesa, Bengaluru',
    template: '%s — the usual',
  },
  description: site.description,
  applicationName: 'the usual',
  keywords: ['the usual', 'the usual café', 'the usual Mesa', 'the usual Bengaluru', 'high protein rolls', 'paneer rolls', 'protein paneer roll', 'Mesa School of Business café', 'RJ Twin Building', 'coffee Bengaluru', 'vegetarian café Bengaluru'],
  authors: [{ name: 'the usual' }],
  creator: 'the usual',
  category: 'food',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  openGraph: {
    type: 'website',
    siteName: 'the usual',
    locale: 'en_IN',
    url: '/',
    title: 'the usual — Everyone has a usual.',
    description: site.description,
  },
  twitter: { card: 'summary_large_image', title: 'the usual — Everyone has a usual.', description: site.description },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#F5F1EA',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${bricolage.variable} ${instrument.variable} ${inter.variable} ${caveat.variable}`} suppressHydrationWarning>
      <head>
        {/* Mark JS as available before paint so reveal animations never hide content without it. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-dvh bg-milk text-espresso antialiased">
        <a href="#main" className="sr-only z-[100] rounded-full bg-espresso px-4 py-2 text-milk focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Skip to content
        </a>
        {children}
        <RevealObserver />
      </body>
    </html>
  );
}
