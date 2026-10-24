export function fullUrl(url: string): string {
  const u = url.trim()
  if (!u) return ''
  return /^[a-z]+:\/\//i.test(u) ? u : `https://${u}`
}

export function hostOf(url: string): string {
  const u = fullUrl(url)
  if (!u) return ''
  try {
    return new URL(u).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}
