import { Link } from 'react-router'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { EnquiryBand, PageMeta } from '../components/Layout'
import { asset } from '../lib/asset'

const guides = [
  { id: 'choosing-your-colours', category: 'Finding your palette', title: 'Choosing your colours', image: asset('/images/soft-blush-garden.webp') },
  { id: 'styling-a-heart-arch', category: 'Ceremony styling', title: 'How to style a heart arch', image: asset('/images/hero-heart-arch.webp') },
  { id: 'dark-romance-ideas', category: 'Alternative romance', title: 'Dark Romance wedding ideas', image: asset('/images/gothic-sweetheart-table.webp') },
]

export default function Inspiration() {
  return (
    <>
      <PageMeta title="Ideas & Inspiration" description="Gentle wedding styling guides from Hearts in Bloom: choosing your colours, styling a heart arch and creating a Dark Romance celebration." />
      <section className="page-hero inspiration-hero">
        <p className="eyebrow">Ideas &amp; inspiration</p>
        <h1>A little guidance.<br /><em>A lot of possibility.</em></h1>
        <p>Thoughtful notes to help you find your palette, frame your ceremony and make the details feel like your own.</p>
      </section>

      <nav className="guide-nav section-pad" aria-label="Inspiration guides">
        {guides.map((guide, index) => (
          <a href={`#${guide.id}`} key={guide.id}>
            <span>0{index + 1}</span><div><small>{guide.category}</small><strong>{guide.title}</strong></div><ArrowDown size={18} />
          </a>
        ))}
      </nav>

      <article className="guide-article section-pad" id="choosing-your-colours">
        <div className="guide-image mask-image"><img src={asset('/images/soft-blush-garden.webp')} alt="Blush pink floral arch colour inspiration" loading="lazy" /></div>
        <div className="guide-copy">
          <p className="eyebrow">Finding your palette</p>
          <h2>Choosing your colours</h2>
          <p className="guide-lead">Begin with the feeling you want, not a colour chart.</p>
          <p>Soft blush and ivory feel gentle and romantic; abundant greenery feels natural and relaxed; plum, navy and crimson bring atmosphere and drama. Your venue matters too — its light, walls, flooring and existing details will all influence how your flowers look.</p>
          <h3>Choose one lead and one supporting tone</h3>
          <p>A focused palette usually feels more intentional than lots of competing colours. Let one tone lead, use another to add depth, then allow foliage and neutral textures to give the design room to breathe.</p>
          <h3>Keep a little flexibility</h3>
          <p>With fresh flowers, seasonal variation is part of their beauty. With silk styling, a wider choice of consistent colours is possible. In either case, sharing your overall mood and a few reference images is more useful than worrying over an exact shade name.</p>
          <Link to="/collection" className="text-link">Explore colour-led collections <ArrowRight size={16} /></Link>
        </div>
      </article>

      <article className="guide-article guide-reverse section-pad" id="styling-a-heart-arch">
        <div className="guide-image mask-image"><img src={asset('/images/hero-heart-arch.webp')} alt="Couple framed by a floral heart arch" loading="lazy" /></div>
        <div className="guide-copy">
          <p className="eyebrow">Ceremony styling</p>
          <h2>How to style a heart arch</h2>
          <p className="guide-lead">Think beyond where it will stand. Think about the moments it will hold.</p>
          <p>A heart arch can frame your vows, create a portrait setting or bring focus to a sweetheart table. Start by choosing its main role, then consider whether one design can move with you through the day.</p>
          <h3>Let the coverage set the mood</h3>
          <p>Flowers concentrated across the top create an airy, modern silhouette. A fuller top feels abundant and romantic. Styling around the whole arch makes a stronger statement and works beautifully when the structure itself should almost disappear.</p>
          <h3>Complete the scene, not every surface</h3>
          <p>Throne chairs, candles or a few coordinating floral details can make the setting feel cohesive. You do not need decoration everywhere — a few related elements are usually more powerful.</p>
          <Link to="/pricing" className="text-link">Compare styling options <ArrowRight size={16} /></Link>
        </div>
      </article>

      <article className="guide-article section-pad" id="dark-romance-ideas">
        <div className="guide-image mask-image"><img src={asset('/images/gothic-sweetheart-table.webp')} alt="Candlelit Gothic sweetheart table with black throne chairs" loading="lazy" /></div>
        <div className="guide-copy">
          <p className="eyebrow">Alternative romance</p>
          <h2>Dark Romance wedding ideas</h2>
          <p className="guide-lead">Depth and drama can still feel intimate, soft and entirely romantic.</p>
          <p>Choose a rich anchor colour — midnight plum, deep navy, teal or crimson — and build atmosphere through foliage, texture and candlelight. Dark flowers photograph beautifully when there is enough contrast around them.</p>
          <h3>Balance shadow with light</h3>
          <p>Pair deep florals with pale linen, warm candlelight or a light venue wall. The contrast lets the colour read clearly and keeps the setting feeling romantic rather than heavy.</p>
          <h3>Carry the palette through small details</h3>
          <p>A dark arch makes a strong starting point. Echo one of its tones in stationery, ribbons or table details for a cohesive look without making every element equally dramatic.</p>
          <Link to="/dark-romance" className="text-link">Discover Dark Romance <ArrowRight size={16} /></Link>
        </div>
      </article>
      <EnquiryBand />
    </>
  )
}
