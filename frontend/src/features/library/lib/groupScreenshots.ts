import type { Screenshot } from '@/shared/types'

export type GroupBy = 'day' | 'week' | 'month'

const DAY = 86_400_000
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function startOfDay(ts: number): number {
  const d = new Date(ts)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

/** Monday of the week containing `ts`. */
function startOfWeek(ts: number): number {
  const d = new Date(startOfDay(ts))
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7))
  return d.getTime()
}

function isoWeek(ts: number): number {
  const d = new Date(startOfDay(ts))
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
  const week1 = new Date(d.getFullYear(), 0, 4)
  return 1 + Math.round(((d.getTime() - week1.getTime()) / DAY - 3 + ((week1.getDay() + 6) % 7)) / 7)
}

export function groupKey(ts: number, by: GroupBy): string {
  if (by === 'day') return `d-${startOfDay(ts)}`
  if (by === 'week') return `w-${startOfWeek(ts)}`
  const d = new Date(ts)
  return `m-${d.getFullYear()}-${d.getMonth()}`
}

export interface ScreenshotGroup {
  key: string
  label: string
  sub: string
  items: Screenshot[]
  /** Up to three most common domains. */
  domains: string[]
  domainsLabel: string
}

function describe(ts: number, by: GroupBy, now: number): { label: string; sub: string } {
  const d = new Date(ts)
  if (by === 'day') {
    const days = Math.round((startOfDay(now) - startOfDay(ts)) / DAY)
    const full = `${MONTHS[d.getMonth()]} ${d.getDate()}`
    const weekday = WEEKDAYS[d.getDay()]
    if (days === 0) return { label: 'Today', sub: `${weekday}, ${full}` }
    if (days === 1) return { label: 'Yesterday', sub: `${weekday}, ${full}` }
    if (days < 7) return { label: weekday, sub: full }
    return { label: `${weekday}, ${full}`, sub: '' }
  }
  if (by === 'week') {
    const start = startOfWeek(ts)
    const startDate = new Date(start)
    const endDate = new Date(start + 6 * DAY)
    const weeksAgo = Math.round((startOfWeek(now) - start) / (7 * DAY))
    const number = isoWeek(ts)
    const endMonth = endDate.getMonth() !== startDate.getMonth() ? `${MONTHS[endDate.getMonth()]} ` : ''
    return {
      label: weeksAgo === 0 ? 'This week' : weeksAgo === 1 ? 'Last week' : `Week ${number}`,
      sub: `Week ${number} · ${MONTHS[startDate.getMonth()]} ${startDate.getDate()} – ${endMonth}${endDate.getDate()}`,
    }
  }
  return { label: `${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`, sub: '' }
}

/** Groups newest-first screenshots, keeping their order. */
export function groupScreenshots(items: Screenshot[], by: GroupBy, now = Date.now()): ScreenshotGroup[] {
  const map = new Map<string, Screenshot[]>()
  for (const s of items) {
    const key = groupKey(s.createdAt, by)
    const list = map.get(key)
    if (list) list.push(s)
    else map.set(key, [s])
  }
  return [...map].map(([key, groupItems]) => {
    const counts = new Map<string, number>()
    for (const s of groupItems) if (s.domain) counts.set(s.domain, (counts.get(s.domain) ?? 0) + 1)
    const domains = [...counts].sort((a, b) => b[1] - a[1]).map(([domain]) => domain)
    return {
      key,
      ...describe(groupItems[0].createdAt, by, now),
      items: groupItems,
      domains: domains.slice(0, 3),
      domainsLabel: domains.slice(0, 2).join(', ') + (domains.length > 2 ? ` +${domains.length - 2}` : ''),
    }
  })
}
