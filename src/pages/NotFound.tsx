import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { PageMeta } from '../components/Layout'
import { HeartMark } from '../components/Logo'

export default function NotFound() {
  return (
    <section className="not-found">
      <PageMeta title="Page Not Found" description="Return to Hearts in Bloom wedding styling and luxury hire." />
      <HeartMark />
      <p className="eyebrow">404 · A petal out of place</p>
      <h1>This page isn’t<br /><em>in bloom.</em></h1>
      <p>The page you were looking for may have moved. Come back to the collection or start again from home.</p>
      <div><Link to="/" className="button button-primary">Return home <ArrowRight size={17} /></Link><Link to="/collection" className="text-link">View the collection</Link></div>
    </section>
  )
}
