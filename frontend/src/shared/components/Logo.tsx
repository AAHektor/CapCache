export function Logo({ size = 20 }: { size?: number }) {
  const square = Math.round(size * 0.7)
  return (
    <div aria-hidden="true" className="relative" style={{ width: size, height: size }}>
      <div
        className="absolute left-0 rounded-[4px] bg-accent opacity-40"
        style={{ top: size - square, width: square, height: square }}
      />
      <div
        className="absolute top-0 rounded-[4px] bg-accent"
        style={{ left: size - square, width: square, height: square }}
      />
    </div>
  )
}
