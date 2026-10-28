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

  return (
    <>
      <PageMeta title="The Collection" description="Explore heart arches and statement seating by wedding moment: ceremonies, portraits and sweetheart tables. Romantic and Dark Romance styling from Hearts in Bloom." />
      <section className="page-hero collection-hero lookbook-page-hero">
        <div className="lookbook-page-copy">
          <p className="eyebrow">The signature collection</p>
          <h1>Find the shape<br />of <em>your romance.</em></h1>
          <p>Begin with the moment you want to frame. From the promises to the portraits, discover a look that belongs in your day.</p>
          <a href="#collection-moments" className="text-link">Start with your moment <ArrowRight size={16} /></a>
        </div>
        <div className="collection-hero-art" aria-hidden="true">
          <div><img src={asset('/images/soft-blush-garden.webp')} alt="" /></div>
          <span>Romantic / Dark Romance / Yours</span>
        </div>
      </section>

      <section className="collection-section section-pad" id="collection-looks">
        <div className="moment-pathways" id="collection-moments">
          <div className="moment-pathways-heading">
            <p className="eyebrow">Where will your heart frame the day?</p>
            <h2>{activeMoment?.title ?? 'One heart. So many meaningful moments.'}</h2>
            <p>{activeMoment?.copy ?? 'Choose a moment for a more focused starting point. These are styling suggestions, not restrictions; Sarah will shape the final setting around your venue.'}</p>
          </div>
          <div className="moment-filter" role="group" aria-label="Browse collection by wedding moment">
            <button type="button" className={moment === 'all' ? 'active' : ''} aria-pressed={moment === 'all'} onClick={() => setMoment('all')}>Every moment</button>
            {weddingMoments.map((item) => (
              <button type="button" key={item.slug} className={moment === item.slug ? 'active' : ''} aria-pressed={moment === item.slug} onClick={() => setMoment(item.slug)}>{item.label}</button>
            ))}
          </div>
        </div>

        <div className="collection-toolbar">
          <div className="filter-group" role="group" aria-label="Filter collection by atmosphere">
            {(['all', 'romantic', 'dark'] as Filter[]).map((value) => (
              <button key={value} className={filter === value ? 'filter-button active' : 'filter-button'} onClick={() => setFilter(value)} aria-pressed={filter === value}>
                {value === 'all' ? 'All styles' : value === 'romantic' ? 'Romantic' : 'Dark Romance'}
              </button>
            ))}
          </div>
          <span aria-live="polite">{visible.length} {visible.length === 1 ? 'look' : 'looks'}</span>
        </div>
        <p className="collection-note">Images marked “Hearts in Bloom” show our own pieces; other photography provides styling inspiration. Your final design is tailored individually.</p>
        <div className="collection-grid lookbook-collection-grid">
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
                <small className="collection-card-moments">Beautiful for: {lookMoments[item.slug]?.map((value) => weddingMoments.find((entry) => entry.slug === value)?.label).join(' · ')}</small>
                <Link to={`/design-your-heart?atmosphere=${item.category}&style=${item.slug}${moment === 'all' ? '' : `&moment=${moment}`}`} className="text-link">Design with this look <ArrowUpRight size={15} /></Link>
              </div>
            </article>
          ))}
        </div>
        {visible.length === 0 && (
          <div className="collection-empty" role="status">
            <p>No look currently combines those two filters. Try another atmosphere or begin with every moment.</p>
            <button type="button" className="button button-outline" onClick={() => { setFilter('all'); setMoment('all') }}>Show the full collection</button>
          </div>
        )}
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
