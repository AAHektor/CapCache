const WIDTHS = ['72%', '58%', '84%', '66%', '78%', '52%']

export function SkeletonGrid() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading screenshots"
      className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-4 gap-y-6"
    >
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} className="flex flex-col gap-2.5">
          <div
            className="aspect-[16/10] rounded-lg bg-hover"
            style={{ animation: 'skeleton 1.4s ease-in-out infinite', animationDelay: `${(i % 6) * 0.08}s` }}
          />
          <div className="flex gap-[9px]">
            <div className="size-4 rounded bg-hover" />
            <div className="flex flex-1 flex-col gap-[7px] pt-[3px]">
              <div className="h-[9px] rounded-[5px] bg-hover" style={{ width: WIDTHS[i % WIDTHS.length] }} />
              <div className="h-2 w-[42%] rounded-[5px] bg-hover" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
