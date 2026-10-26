import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import * as Dialog from '@radix-ui/react-dialog'
import { ArrowRight, Facebook, Instagram, Menu, X } from 'lucide-react'
import Logo, { HeartMark } from './Logo'
import { email, socialLinks } from '../data'

const nav = [
  { to: '/collection', label: 'Collection' },
  { to: '/dark-romance', label: 'Dark Romance' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About' },
  { to: '/inspiration', label: 'Inspiration' },
]

export function PageMeta({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    document.title = `${title} | Hearts in Bloom`
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', description)
  }, [title, description])
  return null
}

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      window.setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 60)
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [pathname, hash])
  return null
}

function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="header-inner">
        <Logo />
        <nav className="desktop-nav" aria-label="Main navigation">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Link to="/enquire" className="header-cta">Check your date <ArrowRight size={15} /></Link>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button className="menu-button" aria-label="Open menu"><Menu size={23} /></button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="menu-overlay" />
            <Dialog.Content className="mobile-menu" aria-describedby={undefined}>
              <div className="mobile-menu-top">
                <Dialog.Title className="mobile-menu-title">Explore Hearts in Bloom</Dialog.Title>
                <Dialog.Close className="icon-button" aria-label="Close menu"><X size={23} /></Dialog.Close>
              </div>
              <nav className="mobile-nav" aria-label="Mobile navigation">
                <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
                {nav.map((item) => <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}>{item.label}</NavLink>)}
              </nav>
              <Link to="/enquire" className="button button-primary mobile-enquire" onClick={() => setOpen(false)}>Tell us about your day <ArrowRight size={17} /></Link>
              <div className="mobile-contact">
                <span>Newcastle upon Tyne</span>
                <a href={`mailto:${email}`}>{email}</a>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  )
}

export function EnquiryBand({ dark = false }: { dark?: boolean }) {
  return (
    <section className={`enquiry-band ${dark ? 'enquiry-band-dark' : ''}`}>
      <HeartMark className="enquiry-heart" />
      <p className="eyebrow">Your date, your venue, your vision</p>
      <h2>Let’s create the moment<br />your guests remember.</h2>
      <p>Tell Sarah what you have in mind. Every enquiry is answered personally, usually within 24–48 hours.</p>
      <Link to="/enquire" className={`button ${dark ? 'button-light' : 'button-primary'}`}>Begin your enquiry <ArrowRight size={17} /></Link>
    </section>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Logo light />
          <p>Romantic heart arches, statement seating and thoughtful styling for beautifully personal celebrations.</p>
          <div className="social-links">
            <a href={socialLinks.instagram} target="_blank" rel="noreferrer" aria-label="Hearts in Bloom on Instagram"><Instagram size={19} /></a>
            <a href={socialLinks.pinterest} target="_blank" rel="noreferrer" aria-label="Hearts in Bloom on Pinterest" className="pinterest-icon">P</a>
            <a href={socialLinks.facebook} target="_blank" rel="noreferrer" aria-label="Hearts in Bloom on Facebook"><Facebook size={19} /></a>
          </div>
        </div>
        <div className="footer-column">
          <h3>Explore</h3>
          <Link to="/collection">The collection</Link>
          <Link to="/dark-romance">Dark Romance</Link>
          <Link to="/pricing">Packages &amp; pricing</Link>
          <Link to="/inspiration">Ideas &amp; inspiration</Link>
          <Link to="/booking-guide">Practical booking guide</Link>
        </div>
        <div className="footer-column">
          <h3>Hearts in Bloom</h3>
          <Link to="/about">Meet Sarah</Link>
          <Link to="/enquire">Make an enquiry</Link>
          <a href={`mailto:${email}`}>{email}</a>
          <span>Newcastle upon Tyne, UK</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Hearts in Bloom</span>
        <div><Link to="/terms">Terms</Link><Link to="/privacy">Privacy</Link><Link to="/cookies">Cookies</Link></div>
        <span>Free local delivery within approx. 40 miles</span>
      </div>
    </footer>
  )
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollManager />
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  )
}
