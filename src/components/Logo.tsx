import { Link } from 'react-router'

export function HeartMark({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M24 40.5 8.2 25.4C-1.4 15.9 12.8 3.7 24 15.4 35.2 3.7 49.4 15.9 39.8 25.4L24 40.5Z" stroke="currentColor" strokeWidth="1.35" />
      <path d="M24 15.4c-1.8 5.4-1.4 11.7 0 17.2M17.2 11.2c3.5.2 6 2 6.8 4.2M30.8 11.2c-3.5.2-6 2-6.8 4.2" stroke="currentColor" strokeWidth="1.05" strokeLinecap="round" />
    </svg>
  )
}

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className={`brand ${light ? 'brand-light' : ''}`} aria-label="Hearts in Bloom home">
      <img className="brand-mark" src="/images/hearts-in-bloom-logo.webp" alt="" width="754" height="1069" />
      <span className="brand-type">
        <span>Hearts <em>in</em> Bloom</span>
        <small>Wedding styling &amp; luxury hire</small>
      </span>
    </Link>
  )
}
