import { Link, useLocation } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { legalContent } from '../legal'
import { PageMeta } from '../components/Layout'

const titles: Record<string, string> = { terms: 'Terms & Conditions', privacy: 'Privacy Policy', cookies: 'Cookies Policy' }

export default function Legal() {
  const { pathname } = useLocation()
  const type = pathname.replace(/^\/+|\/+$/g, '')
  const content = legalContent[type]
  if (!content) return null
  const lines = content.split('\n').filter((line) => line.trim())

  return (
    <section className="legal-page section-pad">
      <PageMeta title={titles[type]} description={`${titles[type]} for Hearts in Bloom wedding styling and luxury hire.`} />
      <Link to="/" className="text-link"><ArrowLeft size={15} /> Back to homepage</Link>
      <div className="legal-content">
        {lines.map((line, index) => {
          if (line === 'Legal' || line === titles[type]) return index === 1 ? <h1 key={index}>{line}</h1> : null
          if (line.startsWith('Last updated:')) return <p className="legal-updated" key={index}>{line}</p>
          if (/^\d+\.\s/.test(line)) return <h2 key={index}>{line}</h2>
          if (['Essential cookies', 'Performance cookies', 'Functionality cookies'].includes(line)) return <h3 key={index}>{line}</h3>
          return <p key={index}>{line}</p>
        })}
      </div>
    </section>
  )
}
