import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import Collection from './pages/Collection'
import DarkRomance from './pages/DarkRomance'
import Pricing from './pages/Pricing'
import About from './pages/About'
import Inspiration from './pages/Inspiration'
import Enquire from './pages/Enquire'
import BookingGuide from './pages/BookingGuide'
import Legal from './pages/Legal'
import NotFound from './pages/NotFound'
import './App.css'

export default function App() {
  const { pathname } = useLocation()

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const elements = document.querySelectorAll<HTMLElement>('[data-reveal], .mask-image')
    if (reduced || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12 })
    const frame = requestAnimationFrame(() => elements.forEach((element) => observer.observe(element)))
    return () => { cancelAnimationFrame(frame); observer.disconnect() }
  }, [pathname])

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/dark-romance" element={<DarkRomance />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/philosophy" element={<About />} />
        <Route path="/inspiration" element={<Inspiration />} />
        <Route path="/enquire" element={<Enquire />} />
          <Route path="/booking-guide" element={<BookingGuide />} />
        <Route path="/terms" element={<Legal />} />
        <Route path="/privacy" element={<Legal />} />
        <Route path="/cookies" element={<Legal />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}
