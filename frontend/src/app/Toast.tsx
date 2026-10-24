export interface ToastState {
  message: string
  onUndo?: () => void
}

interface ToastProps {
  toast: ToastState
}

export function Toast({ toast }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-[272px] z-[70] flex min-h-10 items-center gap-3 rounded-[10px] bg-invert py-2 pr-2 pl-3.5 text-invert-ink shadow-pop"
    >
      <span>{toast.message}</span>
      {toast.onUndo && (
        <button
          type="button"
          onClick={toast.onUndo}
          className="flex h-[26px] cursor-pointer items-center gap-2 rounded-md border-0 bg-invert-ink/15 px-2.5 font-semibold text-inherit"
        >
          Undo
          <span className="font-mono text-[11px] font-normal opacity-75">Ctrl Z</span>
        </button>
      )}
    </div>
  )
}
