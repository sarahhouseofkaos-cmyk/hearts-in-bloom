import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { packages } from '../data'

const rows = [
  { label: 'Starting price', value: (item: typeof packages[number]) => item.price },
  { label: 'Heart arch styling', value: (item: typeof packages[number]) => item.arch },
  { label: 'Throne chairs', value: (item: typeof packages[number]) => item.chairs },
  { label: 'Coordinating styling', value: (item: typeof packages[number]) => item.coordinating },
  { label: 'Best suited to', value: (item: typeof packages[number]) => item.bestFor },
]

export default function PackageComparison() {
  return (
    <section className="package-comparison section-pad" data-reveal>
      <div className="section-heading horizontal-heading">
        <div><p className="eyebrow">Compare the packages</p><h2>See what’s included.<br /><em>Choose with confidence.</em></h2></div>
        <div><p>Every package starts with the same personal service. Compare the styling and finishing details, then enquire about the option that feels closest.</p><Link to="/design-your-heart" className="text-link">Let Design your heart guide you <ArrowRight size={16} /></Link></div>
      </div>

      <div className="comparison-table-wrap">
        <table className="comparison-table">
          <caption>Comparison of Hearts in Bloom wedding styling packages</caption>
          <thead><tr><th scope="col">What’s included</th>{packages.map((item) => <th scope="col" key={item.name}>{item.name}</th>)}</tr></thead>
          <tbody>
            {rows.map((row) => <tr key={row.label}><th scope="row">{row.label}</th>{packages.map((item) => <td key={item.name} className={row.label === 'Starting price' ? 'comparison-price' : ''}>{row.value(item)}</td>)}</tr>)}
            <tr className="comparison-actions"><th scope="row">Enquire</th>{packages.map((item) => <td key={item.name}><Link to={`/enquire?package=${item.slug}`} aria-label={`Enquire about ${item.name}`}>Choose {item.name.replace('The ', '')} <ArrowRight size={14} /></Link></td>)}</tr>
          </tbody>
        </table>
      </div>

      <div className="comparison-mobile">
        {packages.map((item) => (
          <article key={item.name}>
            <div className="comparison-mobile-heading"><div><h3>{item.name}</h3><strong>{item.price}</strong></div></div>
            <dl>{rows.slice(1).map((row) => <div key={row.label}><dt>{row.label}</dt><dd>{row.value(item)}</dd></div>)}</dl>
            <Link to={`/enquire?package=${item.slug}`} className="text-link">Enquire about {item.name} <ArrowRight size={15} /></Link>
          </article>
        ))}
      </div>
      <p className="comparison-note">Delivery, set-up and collection are included within approximately 40 miles of Newcastle upon Tyne. Further travel and bespoke fresh flowers are quoted individually.</p>
    </section>
  )
}
