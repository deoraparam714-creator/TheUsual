import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'the usual — Order ahead',
    short_name: 'the usual',
    description: 'Order your usual ahead. Coffee, rolls & bowls in Bengaluru.',
    start_url: '/order',
    scope: '/',
    display: 'standalone',
    background_color: '#F5F1EA',
    theme_color: '#F5F1EA',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
