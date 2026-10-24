import { useCallback, useEffect, useRef, useState } from 'react'
import type { ToastState } from './Toast'

const DURATION_MS = 6000

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null)
  const timer = useRef<number>(undefined)

  const dismiss = useCallback(() => {
    window.clearTimeout(timer.current)
    setToast(null)
  }, [])

  const show = useCallback((message: string, onUndo?: () => void) => {
    window.clearTimeout(timer.current)
    setToast({
      message,
      onUndo: onUndo && (() => {
        onUndo()
        dismiss()
      }),
    })
    timer.current = window.setTimeout(() => setToast(null), DURATION_MS)
  }, [dismiss])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return { toast, show, dismiss }
}
