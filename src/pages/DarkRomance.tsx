import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Expand } from 'lucide-react'
import { collection, packages, type CollectionItem } from '../data'
import { EnquiryBand, PageMeta } from '../components/Layout'
import Lightbox from '../components/Lightbox'
import { asset } from '../lib/asset'

export default function DarkRomance() {
  const [selected, setSelected] = useState<CollectionItem | null>(null)
  const items = collection.filter((item) => item.category === 'dark' && item.kind !== 'setting')
  const darkPackages = packages.filter((item) => ['The Ceremony', 'The Statement', 'The Full Look'].includes(item.name))

  return (
    <div className="dark-page">
      <PageMeta title="Dark Romance Collection" description="Moody heart arches, Gothic throne chairs and candlelit wedding styling by Hearts in Bloom, Newcastle upon Tyne. Design a darkly romantic setting with Sarah." />
      <section className="dark-hero">
        <div className="dark-hero-copy">
          <p className="eyebrow">The Dark Romance Collection</p>
          <h1>For couples<br />who dream in<br /><em>deeper tones.</em></h1>
          <p>Rich florals, moody textures and a touch of theatre—created for gothic, alternative and darkly romantic celebrations.</p>
          <div className="dark-hero-actions">
            <Link to="/design-your-heart?atmosphere=dark" className="button button-light">Design your Dark Romance <ArrowRight size={17} /></Link>
            <Link to="/enquire?style=dark-romance" className="text-link">Make a simple enquiry <ArrowRight size={15} /></Link>
          </div>
        </div>
        <div className="dark-hero-image"><img src={asset('/images/gothic-sweetheart-table.webp')} alt="Couple seated at a candlelit Gothic sweetheart table by Hearts in Bloom" /></div>
      </section>

      <section className="dark-manifesto section-pad" data-reveal>
        <span className="large-quote">“</span>
        <p>Not less romance.<br /><em>A different kind of it.</em></p>
        <span>Atmospheric palettes, expressive florals and the same personal care.</span>
      </section>

      <section className="dark-collection section-pad">
        <div className="section-heading horizontal-heading">
          <div><p className="eyebrow">Six signature arches</p><h2>Choose your<br /><em>after-dark atmosphere.</em></h2></div>
          <p>Each look can be tailored to your venue and colour story. Select an image to view it larger, or use it as your starting point in Design your heart.</p>
        </div>
        <div className="dark-grid">
          {items.map((item) => (
            <article key={item.slug} data-reveal>
              <button onClick={() => setSelected(item)} aria-label={`View ${item.name} larger`}>
                <img src={item.image} alt={`${item.name} Dark Romance styling`} loading="lazy" />
                <span><Expand size={18} /></span>
              </button>
              <h3>{item.name}</h3>
              <span>{item.description}</span>
              <div className="dark-look-actions">
                <Link to={`/design-your-heart?atmosphere=dark&style=${item.slug}`} className="text-link">Design with this look <ArrowRight size={14} /></Link>
                <Link to={`/enquire?style=${item.slug}`} className="dark-look-enquire">Enquire</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="dark-thrones" data-reveal>
        <div className="dark-thrones-image"><img src={asset('/images/throne-gothic-black.webp')} alt="A pair of ornate gothic black throne chairs behind a candlelit sweetheart table with dark florals" loading="lazy" /></div>
        <div className="dark-thrones-copy">
          <p className="eyebrow">Gothic black thrones</p>
          <h2>A seat fit for<br /><em>the after-dark.</em></h2>
          <p>Ornate carved black thrones for your sweetheart table, ceremony or portraits. Pair them with a dark arch and candlelight for the full Dark Romance setting.</p>
          <div className="throne-price"><span>Single chair</span><strong>£150</strong></div>
          <div className="throne-price"><span>Pair of chairs</span><strong>£300</strong></div>
          <Link to="/collection#thrones" className="text-link">See all four throne styles <ArrowRight size={16} /></Link>
        </div>
      </section>

      <section className="dark-packages section-pad" data-reveal>
        <div className="section-heading horizontal-heading">
          <div><p className="eyebrow">Dark Romance packages</p><h2>A dramatic setting.<br /><em>A clear starting price.</em></h2></div>
          <p>Your palette can be dark and romantic within our existing packages. Choose how much styling you would like around the heart of the setting.</p>
        </div>
        <div className="dark-package-list">
          {darkPackages.map((item) => (
            <article key={item.name}>
              <div><span>{item.price}</span><h3>{item.name}</h3></div>
              <p>{item.description}</p>
              <small>{item.detail}</small>
              <Link to={`/enquire?package=${item.slug}&style=dark-romance`} className="text-link">Enquire about {item.name} <ArrowRight size={14} /></Link>
            </article>
          ))}
        </div>
        <p className="dark-package-note">Prefer chairs on their own? A single throne chair is £150 and a pair is £300. Bespoke fresh flowers are quoted individually.</p>
      </section>

      <section className="dark-styling-guide" data-reveal>
        <div className="dark-styling-image"><img src={asset('/images/gothic-throne-portrait.webp')} alt="Gothic throne chairs and dark floral styling by Hearts in Bloom" loading="lazy" /></div>
        <div className="dark-styling-copy">
          <p className="eyebrow">Styling notes from Sarah</p>
          <h2>Let deep colours<br /><em>hold the light.</em></h2>
          <p>Dark florals are most effective when the whole setting is considered—not simply the flowers.</p>
          <ol>
            <li><span>01</span><div><h3>Give the palette contrast</h3><p>Pale linen, a lighter venue wall or warm candlelight can help plum, navy and teal read clearly in photographs.</p></div></li>
            <li><span>02</span><div><h3>Repeat one colour, gently</h3><p>Echo a lead tone in stationery, ribbons or a small coordinating detail rather than decorating every surface.</p></div></li>
            <li><span>03</span><div><h3>Plan for the venue’s light</h3><p>Share photographs of the space and its lighting with Sarah. Follow your venue’s rules for candles and keep open flames away from hired pieces.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="dark-details nocturnal-section" data-reveal>
        <div>
          <p className="eyebrow">The Nocturnal Wedding Collection</p>
          <h2>Want the whole venue<br /><em>transformed?</em></h2>
        </div>
        <div>
          <p>For a fully immersive gothic wedding, Hearts in Bloom works alongside House of Kaos, Sarah&rsquo;s gothic immersive events company. Together we dress your entire venue with props and set styling, and can add costumed cast and performers to bring the world to life.</p>
          <p>You choose the venue and caterer; we build the atmosphere around your own idea.</p>
          <a href="http://houseofkaos.co.uk" target="_blank" rel="noreferrer" className="text-link">Visit House of Kaos <ArrowRight size={16} /></a>
          <Link to="/enquire?style=dark-romance" className="text-link">Ask about a Nocturnal wedding <ArrowRight size={16} /></Link>
        </div>
      </section>

      <EnquiryBand
        dark
        eyebrow="Your after-dark atmosphere begins here"
        title={<>Design your<br />Dark Romance.</>}
        copy="Choose a signature look, deep floral palette and finishing details in your visual moodboard, then send the complete direction to Sarah."
        label="Design your Dark Romance"
        to="/design-your-heart?atmosphere=dark"
      />
      <Lightbox item={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
