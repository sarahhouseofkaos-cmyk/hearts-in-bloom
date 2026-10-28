import { Fragment, useState } from 'react'
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

const thrones = [
  { name: 'Gold', copy: 'Classic carved gold, warm and regal.', image: '/images/throne-chairs.webp', alt: 'A couple seated on gold throne chairs from Hearts in Bloom' },
  { name: 'Gothic black', copy: 'Ornate black thrones for Dark Romance settings.', image: '/images/throne-gothic-black.webp', alt: 'A pair of ornate gothic black throne chairs behind a candlelit sweetheart table' },
  { name: 'White', copy: 'Carved ivory-white thrones, light and elegant.', image: '/images/throne-white.webp', alt: 'A couple seated on carved white throne chairs outside a country house' },
  { name: 'The crown pair', copy: 'Our one-of-a-kind gilded pair with crown tops.', image: '/images/throne-crown.webp', alt: 'A couple seated on a unique pair of gilded crown-topped throne chairs' },
]

const heroPhotos = ['/images/arch-country-house-ivory.webp', '/images/arch-pink-hydrangea.webp', '/images/midnight-plum.webp', '/images/throne-gothic-black.webp']

export default function Collection() {
  const [selected, setSelected] = useState<CollectionItem | null>(null)
  const count = (key: 'romantic' | 'dark') => collection.filter((item) => item.category === key && item.kind !== 'setting').length

  return (
    <>
      <PageMeta title="The Collection" description="Sarah's signature heart arches and statement seating in two collections: Romantic and Dark Romance. Every look styled by hand and tailored to your wedding." />

      <section className="cl-hero">
        <p className="eyebrow">The collection</p>
        <h1>Find the look that<br /><em>feels like yours.</em></h1>
        <p className="cl-hero-intro">Every arch is styled by hand. Browse my signature looks, then we’ll shape your favourite around your colours, your venue and your day.</p>
        <div className="cl-hero-photos" aria-hidden="true">
          {heroPhotos.map((src) => <div key={src}><img src={asset(src)} alt="" /></div>)}
        </div>
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
        <Fragment key={section.key}>
        {section.key === 'dark' && (
          <aside className="cl-colours">
            <p><strong>Don’t see your colours?</strong> Every look can be restyled in your own palette, from sage green to burnt orange.</p>
            <Link to="/design-your-heart" className="text-link">Design your heart <ArrowUpRight size={14} /></Link>
          </aside>
        )}
        <section id={section.id} className={`cl-section cl-${section.key}`}>
          <div className="cl-section-inner">
            <div className="cl-section-head">
              <p className="eyebrow">{section.eyebrow}</p>
              <h2>{section.title}</h2>
              <div>
                <p>{section.copy}</p>
                <p className="cl-section-price">Arches from <strong>£250</strong> pre-dressed in silk, or from <strong>£350</strong> for fuller styling.{section.key === 'dark' ? <> Throne chairs from <strong>£150</strong>.</> : ' Fresh flowers quoted individually.'}</p>
              </div>
            </div>
            <div className="cl-grid">
              {collection.filter((item) => item.category === section.key && item.kind !== 'setting').map((item) => (
                <article className="cl-look" key={item.slug}>
                  <button type="button" className="cl-look-image" onClick={() => setSelected(item)} aria-label={`View ${item.name} larger`}>
                    <img src={item.image} alt={`${item.name} wedding styling by Hearts in Bloom`} loading="lazy" />
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
        </Fragment>
      ))}

      <section className="thrones section-pad" data-reveal>
        <div className="thrones-inner">
          <div className="thrones-head">
            <p className="eyebrow">Statement seating</p>
            <h2>A throne for<br /><em>every love story.</em></h2>
            <div>
              <p>Four styles of throne chair for your ceremony, sweetheart table and portraits, from classic gold to ornate gothic black. Beautiful on their own or alongside your heart arch.</p>
              <p className="thrones-price">Throne chairs from <strong>£150</strong> each, or <strong>£300</strong> a pair.</p>
            </div>
          </div>
          <ul className="thrones-grid">
            {thrones.map((throne) => (
              <li key={throne.name}>
                <div className="thrones-image"><img src={asset(throne.image)} alt={throne.alt} loading="lazy" /></div>
                <h3>{throne.name}</h3>
                <p>{throne.copy}</p>
              </li>
            ))}
          </ul>
          <Link to="/enquire" className="button button-primary">Check your date <ArrowRight size={16} /></Link>
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
