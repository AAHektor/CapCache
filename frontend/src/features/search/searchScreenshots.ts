import type { Screenshot } from '@/shared/types'

export type SearchScope = 'all' | 'title' | 'url'

export function matchesQuery(s: Screenshot, query: string, scope: SearchScope = 'all'): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const inTitle = s.title.toLowerCase().includes(q)
  const inUrl = s.url.toLowerCase().includes(q)
  if (scope === 'title') return inTitle
  if (scope === 'url') return inUrl
  return inTitle || inUrl
}
