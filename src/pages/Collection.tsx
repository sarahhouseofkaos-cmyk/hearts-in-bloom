import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Expand } from 'lucide-react'
import { collection, type CollectionItem } from '../data'
import { EnquiryBand, PageMeta } from '../components/Layout'
import Lightbox from '../components/Lightbox'
import { asset } from '../lib/asset'

type Filter = 'all' | 'romantic' | 'dark'

export default function Collection() {
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<CollectionItem | null>(null)
  const visible = filter === 'all' ? collection : collection.filter((item) => item.category === filter)

  return (
    <>
      <PageMeta title="The Collection" description="Explore romantic heart arches, throne chairs and Dark Romance styling from Hearts in Bloom. Tailored to your wedding colours, venue and vision." />
      <section className="page-hero collection-hero">
        <p className="eyebrow">The signature collection</p>
        <h1>Find the shape<br />of <em>your romance.</em></h1>
        <p>From soft ivory to midnight plum, every heart arch is a canvas for your colours, your venue and your story.</p>
      </section>

      <section className="collection-section section-pad">
        <div className="collection-toolbar">
          <div className="filter-group" role="group" aria-label="Filter collection">
            {(['all', 'romantic', 'dark'] as Filter[]).map((value) => (
              <button key={value} className={filter === value ? 'filter-button active' : 'filter-button'} onClick={() => setFilter(value)} aria-pressed={filter === value}>
                {value === 'all' ? 'All styles' : value === 'romantic' ? 'Romantic' : 'Dark Romance'}
              </button>
            ))}
          </div>
          <span>{visible.length} looks</span>
        </div>
        <p className="collection-note">Images marked “Hearts in Bloom” show our own pieces; other photography provides styling inspiration. Your final design is tailored individually.</p>
        <div className="collection-grid">
          {visible.map((item, index) => (
            <article className={`collection-card collection-card-${index % 4}`} key={item.slug} data-reveal>
              <button className="collection-image" onClick={() => setSelected(item)} aria-label={`View ${item.name} larger`}>
                <img src={item.image} alt={`${item.name} wedding styling`} loading="lazy" />
                <span className="expand-icon"><Expand size={18} /></span>
              </button>
              <div className="collection-card-copy">
                <span>{item.source}</span>
                <h2>{item.name}</h2>
                <p>{item.description}</p>
                <Link to={`/enquire?style=${item.slug}`} className="text-link">Enquire about this look <ArrowRight size={15} /></Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="throne-feature" data-reveal>
        <img src={asset('/images/throne-chairs.webp')} alt="Hearts in Bloom luxury throne chairs" loading="lazy" />
        <div>
          <p className="eyebrow">Also available</p>
          <h2>A seat worthy<br />of the moment.</h2>
          <p>Elegant throne chairs for ceremonies, sweetheart tables and statement portraits. Available individually or as a pair, and beautiful alongside your heart arch.</p>
          <div className="throne-price"><span>Single chair</span><strong>£150</strong></div>
          <div className="throne-price"><span>Pair of chairs</span><strong>£300</strong></div>
          <Link to="/pricing" className="text-link">See packages &amp; pricing <ArrowRight size={16} /></Link>
        </div>
      </section>
      <EnquiryBand />
      <Lightbox item={selected} onClose={() => setSelected(null)} />
    </>
  )
}
