import { domainMeta } from '../lib/domainMeta'

interface FaviconProps {
  domain: string
  size?: number
}

export function Favicon({ domain, size = 14 }: FaviconProps) {
  const meta = domainMeta(domain)
  return (
    <span
      aria-hidden="true"
      className="grid shrink-0 place-items-center rounded-[3px] font-semibold shadow-[inset_0_0_0_1px_rgb(0_0_0/0.1)]"
      style={{
        width: size,
        height: size,
        background: meta.fav,
        color: meta.fg,
        fontSize: Math.round(size * 0.6),
      }}
    >
      {meta.letter}
    </span>
  )
}
