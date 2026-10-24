interface HighlightProps {
  text: string
  /** Lower-cased search term. */
  query: string
}

export function Highlight({ text, query }: HighlightProps) {
  if (!query) return <>{text}</>
  const lower = text.toLowerCase()
  const parts: { t: string; hit: boolean }[] = []
  let i = 0
  for (;;) {
    const j = lower.indexOf(query, i)
    if (j < 0) {
      if (i < text.length) parts.push({ t: text.slice(i), hit: false })
      break
    }
    if (j > i) parts.push({ t: text.slice(i, j), hit: false })
    parts.push({ t: text.slice(j, j + query.length), hit: true })
    i = j + query.length
  }
  return (
    <>
      {parts.map((p, n) =>
        p.hit ? (
          <mark key={n} className="rounded-[2px] bg-hl text-hl-ink">
            {p.t}
          </mark>
        ) : (
          <span key={n}>{p.t}</span>
        ),
      )}
    </>
  )
}
