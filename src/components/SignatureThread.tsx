import { useEffect, useRef } from 'react'

/** A quiet, scroll-drawn heart line. Decorative only and fully visible with reduced motion. */
export default function SignatureThread() {
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const draw = () => {
      frame = 0
      const available = document.documentElement.scrollHeight - window.innerHeight
      const progress = available > 0 ? Math.min(1, Math.max(0, window.scrollY / available)) : 1
      if (pathRef.current) pathRef.current.style.strokeDashoffset = reduced.matches ? '0' : String(1 - progress)
    }
    const requestDraw = () => {
      if (!frame) frame = requestAnimationFrame(draw)
    }

    draw()
    window.addEventListener('scroll', requestDraw, { passive: true })
    window.addEventListener('resize', requestDraw)
    reduced.addEventListener('change', requestDraw)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', requestDraw)
      window.removeEventListener('resize', requestDraw)
      reduced.removeEventListener('change', requestDraw)
    }
  }, [])

  return (
    <div className="signature-thread" aria-hidden="true">
      <svg viewBox="0 0 44 420" fill="none">
        <path
          ref={pathRef}
          pathLength="1"
          d="M22 0V164C22 148 4 148 4 164C4 180 22 194 22 194C22 194 40 180 40 164C40 148 22 148 22 164V420"
        />
      </svg>
    </div>
  )
}
