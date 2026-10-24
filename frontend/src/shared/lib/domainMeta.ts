export interface DomainMeta {
  /** Favicon background. */
  fav: string
  /** Favicon letter color. */
  fg: string
  letter: string
  /** Page background / browser chrome / accent, used for placeholder thumbnails. */
  bg: string
  chrome: string
  accent: string
}

const KNOWN: Record<string, Partial<DomainMeta> & Pick<DomainMeta, 'fav' | 'bg' | 'chrome' | 'accent'>> = {
  'github.com': { fav: '#1f2328', letter: 'G', bg: '#0d1117', chrome: '#010409', accent: '#2f81f7' },
  'developer.mozilla.org': { fav: '#1b1b1b', letter: 'M', bg: '#ffffff', chrome: '#1b1b1b', accent: '#0069c2' },
  'app.datadoghq.eu': { fav: '#632ca6', letter: 'D', bg: '#f5f5f8', chrome: '#2d1a4f', accent: '#7c4dff' },
  'figma.com': { fav: '#0d99ff', letter: 'F', bg: '#e5e5e5', chrome: '#2c2c2c', accent: '#0d99ff' },
  'react.dev': { fav: '#087ea4', letter: 'R', bg: '#ffffff', chrome: '#23272f', accent: '#087ea4' },
  'arxiv.org': { fav: '#b31b1b', letter: 'a', bg: '#ffffff', chrome: '#b31b1b', accent: '#b31b1b' },
  'vercel.com': { fav: '#000000', letter: '▲', bg: '#fafafa', chrome: '#ffffff', accent: '#171717' },
  'stackoverflow.com': { fav: '#f48024', letter: 'S', bg: '#ffffff', chrome: '#f8f9f9', accent: '#f48024' },
  'tailwindcss.com': { fav: '#0ea5e9', letter: 'T', bg: '#0b1120', chrome: '#0b1120', accent: '#38bdf8' },
  'supabase.com': { fav: '#3ecf8e', fg: '#111', letter: 'S', bg: '#1c1c1c', chrome: '#161616', accent: '#3ecf8e' },
  'web.dev': { fav: '#1a73e8', letter: 'W', bg: '#ffffff', chrome: '#ffffff', accent: '#1a73e8' },
  'stripe.com': { fav: '#635bff', letter: 'S', bg: '#ffffff', chrome: '#ffffff', accent: '#635bff' },
  'are.na': { fav: '#222222', letter: '✱', bg: '#ffffff', chrome: '#ffffff', accent: '#222222' },
  'grafana.capcache.dev': { fav: '#f46800', letter: 'G', bg: '#111217', chrome: '#181b1f', accent: '#73bf69' },
  'developer.chrome.com': { fav: '#1a73e8', letter: 'C', bg: '#ffffff', chrome: '#ffffff', accent: '#1a73e8' },
}

const FALLBACK: DomainMeta = {
  fav: '#6b7280',
  fg: '#fff',
  letter: '?',
  bg: '#ffffff',
  chrome: '#f3f4f6',
  accent: '#6b7280',
}

export function domainMeta(host: string): DomainMeta {
  const known = KNOWN[host]
  if (known) return { ...FALLBACK, ...known }
  return { ...FALLBACK, letter: (host[0] ?? '?').toUpperCase() }
}
