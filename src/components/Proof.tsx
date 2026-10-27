import { realWeddings, testimonials } from '../proof'
import { asset } from '../lib/asset'

/** Couples' own words. Renders nothing until src/proof.ts has entries. */
export function Testimonials() {
  if (testimonials.length === 0) return null
  return (
    <section className="proof-section section-pad" data-reveal>
      <p className="eyebrow">Kind words</p>
      <h2>From couples we have styled.</h2>
      <div className="proof-grid">
        {testimonials.map((item) => (
          <figure key={item.name + item.quote.slice(0, 12)}>
            <blockquote>“{item.quote}”</blockquote>
            <figcaption><strong>{item.name}</strong>{item.detail ? <span>{item.detail}</span> : null}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

/** Real weddings, with the venue. Renders nothing until src/proof.ts has entries. */
export function RealWeddings() {
  if (realWeddings.length === 0) return null
  return (
    <section className="proof-section section-pad" data-reveal>
      <p className="eyebrow">Real weddings</p>
      <h2>Seen in venues across the North East.</h2>
      <div className="real-grid">
        {realWeddings.map((item) => (
          <figure key={item.image}>
            <img src={asset(item.image)} alt={item.alt} loading="lazy" />
            <figcaption><strong>{item.venue}</strong><span>{item.look}</span></figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
