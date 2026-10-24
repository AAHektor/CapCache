export function DropOverlay() {
  return (
    <div className="pointer-events-none fixed inset-3 z-[95] grid place-items-center rounded-[14px] border-2 border-dashed border-accent bg-accent/10">
      <div className="rounded-[10px] bg-panel px-[18px] py-3 font-medium shadow-pop">Drop images to add them</div>
    </div>
  )
}
