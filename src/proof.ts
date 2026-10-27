// Real couples' words and real weddings go here. Both lists are empty on
// purpose: nothing is shown on the site until genuine entries are added, and
// nothing should be invented. Add an entry, push, and the Home page shows it.

export type Testimonial = {
  /** What the couple said, in their own words. */
  quote: string
  /** e.g. "Jess & Tom". Use first names only unless they agree to more. */
  name: string
  /** e.g. "Seaton Delaval Hall, June 2026". */
  detail?: string
}

export type RealWedding = {
  /** File in public/images, e.g. "/images/jess-and-tom.webp". */
  image: string
  alt: string
  venue: string
  /** The look used, e.g. "Classic Ivory heart arch with throne chairs". */
  look: string
}

export const testimonials: Testimonial[] = []

export const realWeddings: RealWedding[] = []
