interface ScreenshotImageProps {
  src: string
  alt: string
  className?: string
}

export function ScreenshotImage({ src, alt, className = '' }: ScreenshotImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      draggable={false}
      className={`h-full w-full bg-hover object-cover object-top ${className}`}
    />
  )
}
