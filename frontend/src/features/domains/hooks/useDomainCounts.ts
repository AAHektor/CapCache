import { useMemo } from 'react'
import type { Screenshot } from '@/shared/types'
import type { DomainCount } from '../components/DomainsSection'

/** Domains derived from screenshot URLs, most screenshots first. */
export function useDomainCounts(items: Screenshot[]): DomainCount[] {
  return useMemo(() => {
    const counts = new Map<string, number>()
    for (const s of items) {
      if (s.domain) counts.set(s.domain, (counts.get(s.domain) ?? 0) + 1)
    }
    return [...counts]
      .map(([domain, count]) => ({ domain, count }))
      .sort((a, b) => b.count - a.count || a.domain.localeCompare(b.domain))
  }, [items])
}
