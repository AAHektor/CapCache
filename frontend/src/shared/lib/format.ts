const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAY = 86_400_000

function startOfDay(ts: number): number {
  const d = new Date(ts)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export function relativeTime(ts: number, now = Date.now()): string {
  const minutes = Math.round((now - ts) / 60_000)
  if (minutes < 60) return minutes <= 1 ? 'just now' : `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  const days = Math.round((startOfDay(now) - startOfDay(ts)) / DAY)
  if (days === 0) return hours === 1 ? '1 hour ago' : `${hours} hours ago`
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  const d = new Date(ts)
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`
}

export function formatDateTime(ts: number): string {
  const d = new Date(ts)
  const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} · ${time}`
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
