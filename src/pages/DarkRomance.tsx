import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Check, Expand } from 'lucide-react'
import { collection, type CollectionItem } from '../data'
import { EnquiryBand, PageMeta } from '../components/Layout'
import Lightbox from '../components/Lightbox'
import { asset } from '../lib/asset'

export default function DarkRomance() {
  const [selected, setSelected] = useState<CollectionItem | null>(null)
  const items = collection.filter((item) => item.category === 'dark')

  return (
    <div className="dark-page">
      <PageMeta title="Dark Romance Collection" description="Moody heart arches, Gothic throne chairs and candlelit wedding styling by Hearts in Bloom, Newcastle upon Tyne." />
      <section className="dark-hero">
        <div className="dark-hero-copy">
          <p className="eyebrow">The Dark Romance Collection</p>
          <h1>For couples<br />who dream in<br /><em>deeper tones.</em></h1>
          <p>Rich florals, moody textures and a touch of theatre — created for gothic, alternative and darkly romantic celebrations.</p>
          <Link to="/enquire?style=dark-romance" className="button button-light">Enquire about Dark Romance <ArrowRight size={17} /></Link>
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
          <div><p className="eyebrow">Signature looks</p><h2>Choose your<br /><em>after-dark atmosphere.</em></h2></div>
          <p>Each look can be tailored to your venue and colour story. Select an image to view it larger.</p>
        </div>
        <div className="dark-grid">
          {items.map((item) => (
            <article key={item.slug} data-reveal>
              <button onClick={() => setSelected(item)} aria-label={`View ${item.name} larger`}>
                <img src={item.image} alt={`${item.name} Dark Romance styling`} loading="lazy" />
                <span><Expand size={18} /></span>
              </button>
              <p>{item.source}</p>
              <h3>{item.name}</h3>
              <span>{item.description}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="dark-details" data-reveal>
        <div>
          <p className="eyebrow">Everything taken care of</p>
          <h2>Drama in the details.<br />Calm in the process.</h2>
        </div>
        <ul>
          <li><Check size={17} /> Delivery, professional set-up and collection</li>
          <li><Check size={17} /> Styling in your chosen Dark Romance palette</li>
          <li><Check size={17} /> A personal consultation and tailored quotation</li>
          <li><Check size={17} /> Free local delivery within approximately 40 miles of Newcastle</li>
        </ul>
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
      <EnquiryBand dark />
      <Lightbox item={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
