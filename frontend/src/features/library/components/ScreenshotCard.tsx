import { Favicon } from '@/shared/components/Favicon'
import { ScreenshotImage } from '@/shared/components/ScreenshotImage'
import { relativeTime } from '@/shared/lib/format'
import type { Screenshot } from '@/shared/types'

interface ScreenshotCardProps {
  screenshot: Screenshot
  onOpen: (id: string) => void
}

export function ScreenshotCard({ screenshot, onOpen }: ScreenshotCardProps) {
  const { id, title, domain, createdAt, src } = screenshot
  return (
    <div className="min-w-0 [content-visibility:auto] [contain-intrinsic-size:auto_160px]">
      <button
        type="button"
        onClick={() => onOpen(id)}
        aria-label={`Open ${title}`}
        className="group block aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-[7px] border-0 bg-hover p-0 shadow-[0_0_0_1px_var(--color-line)] transition-shadow hover:shadow-[0_0_0_2px_var(--color-accent)]"
      >
        <ScreenshotImage src={src} alt={`Screenshot of ${title}`} />
      </button>
      <div className="mt-2 flex min-w-0 items-center gap-[7px]">
        {domain && <Favicon domain={domain} />}
        <span title={title} className="truncate text-[12.5px] font-medium">
          {title}
        </span>
      </div>
      <div className="mt-px flex min-w-0 gap-1.5 pl-[21px] text-xs text-muted">
        <span className="whitespace-nowrap font-mono text-[11.5px]">{relativeTime(createdAt)}</span>
        <span className="truncate">{domain}</span>
      </div>
    </div>
  )
}
