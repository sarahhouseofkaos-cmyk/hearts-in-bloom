import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, ArrowUpRight, Expand } from 'lucide-react'
import { collection, type CollectionItem } from '../data'
import { EnquiryBand, PageMeta } from '../components/Layout'
import Lightbox from '../components/Lightbox'
import { asset } from '../lib/asset'
import { lookMoments, weddingMoments, type WeddingMoment } from '../moments'

type Filter = 'all' | 'romantic' | 'dark'
type MomentFilter = 'all' | WeddingMoment

export default function Collection() {
  const [filter, setFilter] = useState<Filter>('all')
  const [moment, setMoment] = useState<MomentFilter>('all')
  const [selected, setSelected] = useState<CollectionItem | null>(null)
  const activeMoment = weddingMoments.find((item) => item.slug === moment)
  const visible = collection.filter((item) => {
    const atmosphereMatches = filter === 'all' || item.category === filter
    const momentMatches = moment === 'all' || lookMoments[item.slug]?.includes(moment)
    return atmosphereMatches && momentMatches
  })
  const groups = [
    { key: 'romantic', title: 'Romantic', copy: 'Ivory, blush, greenery and soft natural textures.' },
    { key: 'dark', title: 'Dark Romance', copy: 'Deep florals, jewel tones and gothic seating.' },
  ].map((group) => ({ ...group, items: visible.filter((item) => item.category === group.key) })).filter((group) => group.items.length > 0)

  return (
    <>
      <PageMeta title="The Collection" description="Explore heart arches and statement seating by wedding moment: ceremonies, portraits and sweetheart tables. Romantic and Dark Romance styling from Hearts in Bloom." />
      <section className="page-hero collection-hero lookbook-page-hero">
        <div className="lookbook-page-copy">
          <p className="eyebrow">The signature collection</p>
          <h1>Find the shape<br />of <em>your romance.</em></h1>
          <p>Begin with the moment you want to frame. From the promises to the portraits, discover a look that belongs in your day.</p>
          <a href="#collection-moments" className="text-link">Browse the looks <ArrowRight size={16} /></a>
        </div>
        <div className="collection-hero-art" aria-hidden="true">
          <div><img src={asset('/images/soft-blush-garden.webp')} alt="" /></div>
          <span>Romantic / Dark Romance / Yours</span>
        </div>
      </section>

      <section className="looks section-pad" id="collection-moments">
        <div className="looks-bar" role="group" aria-label="Filter the collection">
          <div className="looks-tabs" role="group" aria-label="Style">
            {(['all', 'romantic', 'dark'] as Filter[]).map((value) => (
              <button type="button" key={value} className={filter === value ? 'active' : ''} aria-pressed={filter === value} onClick={() => setFilter(value)}>
                {value === 'all' ? 'All styles' : value === 'romantic' ? 'Romantic' : 'Dark Romance'}
              </button>
            ))}
          </div>
          <div className="looks-moments" role="group" aria-label="Wedding moment">
            <span>Moment</span>
            <button type="button" className={moment === 'all' ? 'active' : ''} aria-pressed={moment === 'all'} onClick={() => setMoment('all')}>Any</button>
            {weddingMoments.map((item) => (
              <button type="button" key={item.slug} className={moment === item.slug ? 'active' : ''} aria-pressed={moment === item.slug} onClick={() => setMoment(item.slug)}>{item.designLabel}</button>
            ))}
          </div>
        </div>
        {activeMoment && <p className="looks-moment-note"><strong>{activeMoment.title}</strong> {activeMoment.copy}</p>}

        {groups.map((group) => (
          <div className="looks-group" key={group.key}>
            <div className="looks-group-heading">
              <h2>{group.title}</h2>
              <p>{group.copy}</p>
            </div>
            <div className="looks-grid">
              {group.items.map((item) => (
                <article className="look-card" key={item.slug}>
                  <button type="button" className="look-image" onClick={() => setSelected(item)} aria-label={`View ${item.name} larger`}>
                    <img src={item.image} alt={`${item.name} wedding styling`} loading="lazy" />
                    <span className={`look-badge ${item.source === 'Hearts in Bloom' ? 'own' : ''}`}>{item.source === 'Hearts in Bloom' ? 'Hearts in Bloom' : 'Inspiration'}</span>
                    <span className="look-expand" aria-hidden="true"><Expand size={16} /></span>
                  </button>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <Link to={`/design-your-heart?atmosphere=${item.category}&style=${item.slug}${moment === 'all' ? '' : `&moment=${moment}`}`} className="text-link">Design with this look <ArrowUpRight size={15} /></Link>
                </article>
              ))}
            </div>
          </div>
        ))}

        {visible.length === 0 && (
          <div className="collection-empty" role="status">
            <p>No look currently combines those two choices. Try another style or moment.</p>
            <button type="button" className="button button-outline" onClick={() => { setFilter('all'); setMoment('all') }}>Show the full collection</button>
          </div>
        )}
        <p className="looks-note">Photos labelled “Hearts in Bloom” show our own pieces; “Inspiration” photos show styling ideas. Every final design is tailored to you.</p>
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
      <EnquiryBand
        eyebrow="Your moment, your palette, your heart"
        title={<>Find the look that<br />feels like you.</>}
        copy="Bring your favourite looks into the visual moodboard and shape a personal starting point for Sarah."
        label="Design your heart"
        to="/design-your-heart"
      />
      <Lightbox item={selected} onClose={() => setSelected(null)} />
    </>
  )
}
