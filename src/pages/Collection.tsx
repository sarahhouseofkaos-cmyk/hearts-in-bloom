import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowDown, ArrowRight, ArrowUpRight, Expand } from 'lucide-react'
import { collection, type CollectionItem } from '../data'
import { EnquiryBand, PageMeta } from '../components/Layout'
import Lightbox from '../components/Lightbox'
import { asset } from '../lib/asset'

const sections = [
  {
    key: 'romantic' as const,
    id: 'romantic',
    eyebrow: 'The Romantic collection',
    title: <>Soft, light<br /><em>&amp; timeless.</em></>,
    copy: 'Ivory roses, blush tones and cascading greenery, for ceremonies that feel gentle, classic and full of light.',
  },
  {
    key: 'dark' as const,
    id: 'dark-romance',
    eyebrow: 'The Dark Romance collection',
    title: <>Deep, moody<br /><em>&amp; dramatic.</em></>,
    copy: 'Jewel tones, dark florals and gothic seating, for alternative celebrations and couples who love a little drama.',
  },
]

export default function Collection() {
  const [selected, setSelected] = useState<CollectionItem | null>(null)
  const count = (key: 'romantic' | 'dark') => collection.filter((item) => item.category === key).length

  return (
    <>
      <PageMeta title="The Collection" description="Sarah's signature heart arches and statement seating in two collections: Romantic and Dark Romance. Every look styled by hand and tailored to your wedding." />

      <section className="cl-hero">
        <p className="eyebrow">The collection</p>
        <h1>Find the look that<br /><em>feels like yours.</em></h1>
        <p className="cl-hero-intro">Every arch is styled by hand. Browse my signature looks, then we’ll shape your favourite around your colours, your venue and your day.</p>
        <nav className="cl-jump" aria-label="Jump to a collection">
          {sections.map((section) => (
            <a key={section.key} href={`#${section.id}`} className={`cl-jump-${section.key}`}>
              <span className="cl-jump-name">{section.key === 'romantic' ? 'Romantic' : 'Dark Romance'}</span>
              <span className="cl-jump-count">{count(section.key)} looks <ArrowDown size={14} /></span>
            </a>
          ))}
        </nav>
      </section>

      {sections.map((section) => (
        <section key={section.key} id={section.id} className={`cl-section cl-${section.key}`}>
          <div className="cl-section-inner">
            <div className="cl-section-head">
              <p className="eyebrow">{section.eyebrow}</p>
              <h2>{section.title}</h2>
              <p>{section.copy}</p>
            </div>
            <div className="cl-grid">
              {collection.filter((item) => item.category === section.key).map((item) => (
                <article className="cl-look" key={item.slug}>
                  <button type="button" className="cl-look-image" onClick={() => setSelected(item)} aria-label={`View ${item.name} larger`}>
                    <img src={item.image} alt={`${item.name} heart arch styling by Hearts in Bloom`} loading="lazy" />
                    <span className="cl-look-expand" aria-hidden="true"><Expand size={16} /></span>
                  </button>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <div className="cl-look-actions">
                    <Link to={`/design-your-heart?atmosphere=${item.category}&style=${item.slug}`} className="text-link">Design with this look <ArrowUpRight size={14} /></Link>
                    <Link to={`/enquire?style=${item.slug}`} className="cl-look-enquire">Enquire</Link>
                  </div>
                </article>
              ))}
            </div>
            {section.key === 'dark' && (
              <Link to="/dark-romance" className="text-link cl-section-more">Explore the Dark Romance collection <ArrowRight size={16} /></Link>
            )}
          </div>
        </section>
      ))}

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
        eyebrow="Your look, your palette, your day"
        title={<>Found a look<br />you love?</>}
        copy="Shape it in the visual moodboard, or tell Sarah about your date and venue and she’ll prepare a personal proposal."
        label="Design your heart"
        to="/design-your-heart"
      />
      <Lightbox item={selected} onClose={() => setSelected(null)} />
    </>
  )
}
