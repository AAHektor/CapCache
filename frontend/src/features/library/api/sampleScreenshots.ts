import { domainMeta } from '@/shared/lib/domainMeta'
import type { Screenshot } from '@/shared/types'

// Example data for the frontend-only stage. Replaced by real API calls later.

function placeholderImage(host: string, title: string, seed: number): string {
  const m = domainMeta(host)
  const dark = m.bg === '#0d1117' || m.bg === '#0b1120' || m.bg === '#1c1c1c' || m.bg === '#111217'
  const ink = dark ? '#e6edf3' : '#1f2328'
  const soft = dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'
  const bars = Array.from({ length: 5 }, (_, i) => {
    const w = 120 + ((seed * (i + 3) * 37) % 260)
    return `<rect x="40" y="${150 + i * 34}" width="${w}" height="12" rx="6" fill="${soft}"/>`
  }).join('')
  const cards = Array.from({ length: 3 }, (_, i) => {
    const h = 90 + ((seed * (i + 2) * 53) % 90)
    return `<rect x="${470 + i * 100}" y="150" width="84" height="${h}" rx="8" fill="${m.accent}" opacity="${0.25 + i * 0.15}"/>`
  }).join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
<rect width="800" height="500" fill="${m.bg}"/>
<rect width="800" height="44" fill="${m.chrome}"/>
<circle cx="22" cy="22" r="6" fill="#ff5f57"/><circle cx="42" cy="22" r="6" fill="#febc2e"/><circle cx="62" cy="22" r="6" fill="#28c840"/>
<rect x="100" y="12" width="320" height="20" rx="10" fill="rgba(128,128,128,0.25)"/>
<rect x="40" y="76" width="${180 + (seed % 5) * 40}" height="22" rx="6" fill="${ink}" opacity="0.85"/>
<rect x="40" y="108" width="260" height="10" rx="5" fill="${m.accent}"/>
${bars}${cards}
<text x="40" y="470" font-family="sans-serif" font-size="14" fill="${ink}" opacity="0.5">${title.replace(/[<>&"]/g, '').slice(0, 60)}</text>
</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

type Row = [domain: string, title: string, path: string, collectionId: string | null]

const ROWS: Row[] = [
  ['github.com', 'Fix: virtualized grid jumps on resize · Pull Request #482', '/capcache/web/pull/482', 'c2'],
  ['developer.mozilla.org', 'IntersectionObserver - Web APIs | MDN', '/en-US/docs/Web/API/IntersectionObserver', 'c3'],
  ['app.datadoghq.eu', 'API latency — p95 by endpoint', '/dashboard/abc-123/api-latency', 'c2'],
  ['figma.com', 'Capcache — Library v3', '/design/Kx82/Capcache?node-id=412-2201', 'c1'],
  ['react.dev', 'useDeferredValue – React', '/reference/react/useDeferredValue', 'c3'],
  ['arxiv.org', '[2304.08485] Visual Instruction Tuning', '/abs/2304.08485', 'c4'],
  ['vercel.com', 'Deployments – capcache-web – Vercel', '/capcache/capcache-web/deployments', null],
  ['stackoverflow.com', 'How do I virtualize a masonry layout in React?', '/questions/78112043/virtualize-masonry', 'c3'],
  ['tailwindcss.com', 'Dark mode - Core concepts - Tailwind CSS', '/docs/dark-mode', 'c3'],
  ['supabase.com', 'Table editor | capcache-prod | Supabase', '/dashboard/project/capcache-prod/editor', null],
  ['web.dev', 'Serve images in modern formats', '/articles/serve-images-webp', 'c3'],
  ['github.com', 'TanStack/virtual: Headless UI for virtualizing scrollable elements', '/TanStack/virtual', 'c3'],
  ['stripe.com', 'Receive Stripe events in your webhook endpoint', '/docs/webhooks', 'c3'],
  ['are.na', 'Calm interfaces — Are.na', '/capcache/calm-interfaces', 'c1'],
  ['grafana.capcache.dev', 'Upload pipeline — WebP encode time', '/d/upload-pipeline', 'c2'],
  ['github.com', 'capcache/extension: src/capture/fullPage.ts', '/capcache/extension/blob/main/src/capture/fullPage.ts', 'c2'],
  ['developer.chrome.com', 'chrome.tabs.captureVisibleTab() | Chrome for Developers', '/docs/extensions/reference/api/tabs', 'c3'],
  ['figma.com', 'Extension popup — states', '/design/Kx82/Capcache?node-id=880-114', 'c1'],
  ['are.na', 'Empty states — Are.na', '/capcache/empty-states', 'c1'],
  ['github.com', 'Issues · capcache/web', '/capcache/web/issues', null],
  ['vercel.com', 'Analytics – capcache-web – Vercel', '/capcache/capcache-web/analytics', null],
  ['arxiv.org', '[2104.08663] BEIR: A Heterogeneous Benchmark for Zero-shot Evaluation', '/abs/2104.08663', 'c4'],
]

const NOW = Date.now()
const HOUR = 3_600_000

export const sampleScreenshots: Screenshot[] = ROWS.map(([domain, title, path, collectionId], i) => ({
  id: `s${i + 1}`,
  title,
  url: `https://${domain}${path}`,
  domain,
  createdAt: NOW - i * 7 * HOUR - i * i * 600_000,
  sizeBytes: 90_000 + ((i * 7919) % 90_000),
  width: 1440,
  height: 900,
  collectionId,
  src: placeholderImage(domain, title, i + 1),
}))
