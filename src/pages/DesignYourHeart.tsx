import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ArrowLeft, ArrowRight, Ban, Check, Crown, Heart, RotateCcw, Save } from 'lucide-react'
import { collection, thrones, type CollectionItem } from '../data'
import ColourArch from '../components/ColourArch'
import { CUSTOM_LOOK_SLUG, MAX_FLOWER_COLOURS, coloursByName, defaultCustomColours, describeCustomColours, flowerColours, foliageOptions, isHexColour } from '../lib/colours'
import { PageMeta } from '../components/Layout'
import { asset } from '../lib/asset'
import { defaultPalette, lookPalettes, weddingMoments } from '../moments'
import {
  atmosphereFromParam,
  designEnquiryPath,
  emptyDesign,
  getDesignRecommendation,
  type Atmosphere,
  type DesignSelection,
  type Seating,
  type StylingLevel,
  type YesNo,
} from '../lib/design'

const steps = [
  { label: 'Feeling', title: 'What should it feel like?' },
  { label: 'Arch', title: 'Choose your arch.' },
  { label: 'Details', title: 'Make it yours.' },
  { label: 'Your design', title: 'Your design is ready.' },
]

const coverageOptions = [
  { value: 'Top half only', amount: 0.42, detail: 'Florals across the top' },
  { value: 'Fuller top', amount: 0.66, detail: 'Flowing further down' },
  { value: 'Full arch', amount: 1, detail: 'Flowers to the ground' },
]

const atmosphereCards: { value: Atmosphere; name: string; mood: string; copy: string; image: string }[] = [
  { value: 'romantic', name: 'Romantic', mood: 'Soft light · Abundant florals', copy: 'Ivory, blush and garden greenery.', image: '/images/arch-country-house-ivory.webp' },
  { value: 'dark', name: 'Dark Romance', mood: 'Moody tones · Candlelit drama', copy: 'Plum, crimson, teal and gothic details.', image: '/images/arch-crimson-noir.webp' },
]

/** A small heart-arch drawing showing how far the flowers reach. */
function CoverageHeart({ amount }: { amount: number }) {
  const halves = [
    'M50 32 C43 16 30 10 20 13 C8 17 5 32 10 45 C14 56 22 68 27 94',
    'M50 32 C57 16 70 10 80 13 C92 17 95 32 90 45 C86 56 78 68 73 94',
  ]
  return (
    <svg viewBox="0 0 100 100" className="dh-heart-svg" aria-hidden="true">
      {halves.map((d) => <path key={d} d={d} className="dh-heart-frame" pathLength={1} />)}
      {halves.map((d) => <path key={`f${d}`} d={d} className="dh-heart-flowers" pathLength={1} strokeDasharray={`${amount} 1`} />)}
    </svg>
  )
}

const stylingOptions: { value: StylingLevel; title: string; detail: string }[] = [
  { value: 'signature', title: 'Signature silk', detail: 'Our pre-dressed floral styling.' },
  { value: 'higher', title: 'Higher-end bespoke', detail: 'A fuller, more bespoke arrangement.' },
  { value: 'fresh', title: 'Fresh flowers', detail: 'Seasonal and individually quoted.' },
]

const momentOptions = ['Ceremony', 'Portraits', 'Sweetheart table', 'Across the day']
const STORAGE_KEY = 'hearts-in-bloom-moodboard-v1'

function completeSelection(selection: DesignSelection) {
  return Boolean(selection.atmosphere && selection.styleSlug && selection.styling && selection.coverage && selection.seating && selection.coordinating && selection.moment)
}

function readSavedDesign(): DesignSelection | null {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null') as Partial<DesignSelection> | null
    if (!parsed || typeof parsed !== 'object') return null
    const selection = { ...emptyDesign, ...parsed }
    if (selection.styleSlug === CUSTOM_LOOK_SLUG) {
      const valid = Array.isArray(selection.customColours) && selection.customColours.length > 0 && selection.customColours.every((colour) => colour && typeof colour.name === 'string' && isHexColour(colour.value))
      return valid && selection.atmosphere ? selection : null
    }
    const look = collection.find((item) => item.slug === selection.styleSlug)
    if (!look || look.category !== selection.atmosphere) return null
    return selection
  } catch {
    return null
  }
}

export default function DesignYourHeart() {
  const [params] = useSearchParams()
  const requestedStyle = collection.find((item) => item.slug === params.get('style'))
  const initialAtmosphere = requestedStyle?.category ?? atmosphereFromParam(params.get('atmosphere'))
  const requestedMoment = weddingMoments.find((item) => item.slug === params.get('moment'))?.designLabel ?? ''
  const hasDeepLink = Boolean(params.get('style') || params.get('atmosphere') || params.get('moment'))
  const [step, setStep] = useState(0)
  const [furthest, setFurthest] = useState(0)
  const stageRef = useRef<HTMLDivElement>(null)
  const initialStep = useRef(true)
  const [selection, setSelection] = useState<DesignSelection>({ ...emptyDesign, atmosphere: initialAtmosphere, styleSlug: requestedStyle?.slug ?? '', moment: requestedMoment })
  const [savedDesign, setSavedDesign] = useState<DesignSelection | null>(() => hasDeepLink ? null : readSavedDesign())
  const [saveNotice, setSaveNotice] = useState('')

  const looks = collection.filter((item) => item.category === selection.atmosphere && item.kind !== 'setting')
  const isCustom = selection.styleSlug === CUSTOM_LOOK_SLUG
  const foliageColour = foliageOptions.find((item) => item.name === selection.foliage)
  const customName = describeCustomColours(selection.customColours, selection.foliage)
  const customLook: CollectionItem | undefined = isCustom && selection.atmosphere ? {
    slug: CUSTOM_LOOK_SLUG,
    name: 'Your own colours',
    description: selection.customColours.length ? `${selection.customColours.map((colour) => colour.name).join(', ')}${foliageColour ? `, with ${foliageColour.name.toLowerCase()} foliage` : ''}.` : 'Choose your flower colours.',
    image: asset('/images/arch-bare.webp'),
    category: selection.atmosphere,
    source: 'Hearts in Bloom',
  } : undefined
  const selectedLook = customLook ?? collection.find((item) => item.slug === selection.styleSlug)
  const previewCoverage = selection.coverage || 'Fuller top'
  const completeDetails = Boolean(selection.styling && selection.coverage && selection.seating && selection.coordinating && selection.moment)
  const recommendation = useMemo(() => completeDetails ? getDesignRecommendation(selection) : null, [selection, completeDetails])
  const atmosphereCard = atmosphereCards.find((item) => item.value === selection.atmosphere)
  const previewImage = selectedLook?.image ?? (atmosphereCard ? asset(atmosphereCard.image) : '')
  const palette = isCustom ? [...selection.customColours, ...(foliageColour ? [foliageColour] : [])] : selectedLook ? lookPalettes[selectedLook.slug] ?? defaultPalette : defaultPalette
  const chosenThrone = selection.seating && selection.seating !== 'none' ? thrones.find((item) => item.name === selection.throneStyle) : undefined
  const seatingLabel = selection.seating === 'pair' ? 'Pair of thrones' : selection.seating === 'single' ? 'One throne' : selection.seating === 'none' ? 'No chairs' : ''
  const canContinue = step === 0 ? Boolean(selection.atmosphere) : step === 1 ? Boolean(selectedLook) && (!isCustom || selection.customColours.length > 0) : step === 2 ? completeDetails : true

  function update<K extends keyof DesignSelection>(key: K, value: DesignSelection[K]) {
    setSaveNotice('')
    setSelection((current) => ({ ...current, [key]: value }))
  }

  const [customPick, setCustomPick] = useState('#c98a9e')

  function chooseOwnColours() {
    setSaveNotice('')
    setSelection((current) => {
      const mood = current.atmosphere === 'dark' ? 'dark' : 'romantic'
      return {
        ...current,
        styleSlug: CUSTOM_LOOK_SLUG,
        customColours: current.customColours.length ? current.customColours : coloursByName(defaultCustomColours[mood]),
        foliage: current.foliage || (mood === 'dark' ? 'Black foliage' : 'Eucalyptus'),
      }
    })
  }

  function toggleColour(name: string, value: string) {
    setSaveNotice('')
    setSelection((current) => {
      const chosen = current.customColours.some((colour) => colour.value === value)
      if (chosen) return { ...current, customColours: current.customColours.filter((colour) => colour.value !== value) }
      if (current.customColours.length >= MAX_FLOWER_COLOURS) return current
      return { ...current, customColours: [...current.customColours, { name, value }] }
    })
  }

  function chooseAtmosphere(atmosphere: Atmosphere) {
    setSaveNotice('')
    setSelection((current) => ({ ...current, atmosphere, styleSlug: current.atmosphere === atmosphere ? current.styleSlug : '' }))
  }

  function chooseThrone(name: string) {
    setSaveNotice('')
    setSelection((current) => ({ ...current, throneStyle: name, seating: current.seating === 'single' ? 'single' : 'pair' }))
  }

  function chooseNoChairs() {
    setSaveNotice('')
    setSelection((current) => ({ ...current, seating: 'none', throneStyle: '' }))
  }

  function next() {
    if (!canContinue) return
    const destination = Math.min(step + 1, steps.length - 1)
    setStep(destination)
    setFurthest((current) => Math.max(current, destination))
  }

  function startAgain() {
    try { window.localStorage.removeItem(STORAGE_KEY) } catch { /* The design can still be restarted without storage. */ }
    setSavedDesign(null)
    setSaveNotice('')
    setSelection(emptyDesign)
    setStep(0)
    setFurthest(0)
  }

  function resumeSavedDesign() {
    if (!savedDesign) return
    setSelection(savedDesign)
    const destination = completeSelection(savedDesign) ? 3 : 0
    setStep(destination)
    setFurthest(destination)
    setSaveNotice('Your saved moodboard has been restored from this browser.')
  }

  function removeSavedDesign() {
    try { window.localStorage.removeItem(STORAGE_KEY) } catch { /* Nothing else is required if storage is unavailable. */ }
    setSavedDesign(null)
    setSaveNotice('')
  }

  function saveMoodboard() {
    if (!recommendation || !selectedLook) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selection))
      setSavedDesign(selection)
      setSaveNotice('Moodboard saved in this browser on this device. It will not sync to another device.')
    } catch {
      setSaveNotice('This browser could not save your moodboard. You can still send the complete design to Sarah.')
    }
  }

  const enquiryPath = recommendation && selectedLook ? designEnquiryPath(selection, isCustom ? customName : selectedLook.name, recommendation) : '/enquire'

  useEffect(() => {
    if (initialStep.current) {
      initialStep.current = false
      return
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    stageRef.current?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' })
  }, [step])

  const stylingTitle = stylingOptions.find((item) => item.value === selection.styling)?.title
  const boardRows = [
    ['Feeling', atmosphereCard?.name],
    ['Arch', selectedLook?.name],
    ['Flowers', stylingTitle],
    ['Coverage', selection.coverage],
    ['Thrones', selection.seating ? `${seatingLabel}${chosenThrone ? ` · ${chosenThrone.name}` : ''}` : ''],
    ['Moment', selection.moment],
  ]

  return (
    <>
      <PageMeta title="Design Your Heart" description="Create a visual Hearts in Bloom wedding moodboard. Choose your atmosphere, signature arch, flowers and throne chairs, save on your device or send your design to Sarah." />
      <section className="dh-intro">
        <div>
          <p className="eyebrow">Your styling moodboard</p>
          <h1>Design <em>your heart.</em></h1>
        </div>
        <div>
          <p>Pick a feeling, an arch and your finishing touches, and watch your moodboard come together. Then send it to Sarah for a personal proposal.</p>
          <small>Takes about two minutes · Nothing is booked until you speak to Sarah</small>
        </div>
      </section>

      <section className="dh-studio" aria-label="Design your heart configurator">
        <nav className="dh-stepper" aria-label="Design steps">
          <ol>
            {steps.map((item, index) => (
              <li key={item.label} className={index === step ? 'current' : index < step ? 'complete' : ''}>
                <button type="button" onClick={() => index <= furthest && setStep(index)} disabled={index > furthest} aria-current={index === step ? 'step' : undefined}>
                  <span className="dh-step-dot">{index < step ? <Check size={13} /> : index + 1}</span>
                  <span className="dh-step-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className="dh-workspace">
          <div className="dh-stage" key={step} ref={stageRef}>
            <p className="eyebrow">Step {step + 1} of {steps.length}</p>
            <h2>{steps[step].title}</h2>

            {step === 0 && (
              <>
                {savedDesign && (
                  <div className="dh-saved">
                    <Heart size={20} strokeWidth={1.5} aria-hidden="true" />
                    <div>
                      <strong>Your saved moodboard is here.</strong>
                      <p>{savedDesign.styleSlug === CUSTOM_LOOK_SLUG ? 'Your own colours' : collection.find((item) => item.slug === savedDesign.styleSlug)?.name} · saved in this browser on this device.</p>
                    </div>
                    <div className="dh-saved-actions">
                      <button type="button" className="button button-outline" onClick={resumeSavedDesign}>Resume</button>
                      <button type="button" className="dh-text-button" onClick={removeSavedDesign}>Remove</button>
                    </div>
                  </div>
                )}
                <div className="dh-atmos">
                  {atmosphereCards.map((card) => (
                    <button type="button" key={card.value} className={`dh-atmos-card ${selection.atmosphere === card.value ? 'selected' : ''}`} aria-pressed={selection.atmosphere === card.value} onClick={() => chooseAtmosphere(card.value)}>
                      <img src={asset(card.image)} alt="" />
                      <span className="dh-atmos-text"><small>{card.mood}</small><strong>{card.name}</strong><em>{card.copy}</em></span>
                      <span className="dh-tick" aria-hidden="true">{selection.atmosphere === card.value && <Check size={16} />}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 1 && (
              <div className="dh-looks">
                {looks.map((item) => (
                  <button type="button" key={item.slug} className={`dh-look ${selection.styleSlug === item.slug ? 'selected' : ''}`} aria-pressed={selection.styleSlug === item.slug} onClick={() => update('styleSlug', item.slug)}>
                    <span className="dh-look-image"><img src={item.image} alt="" loading="lazy" /><span className="dh-tick" aria-hidden="true">{selection.styleSlug === item.slug && <Check size={15} />}</span></span>
                    <strong>{item.name}</strong>
                    <small>{item.description}</small>
                  </button>
                ))}
                <button type="button" className={`dh-look dh-look-own ${isCustom ? 'selected' : ''}`} aria-pressed={isCustom} onClick={chooseOwnColours}>
                  <span className="dh-look-image">
                    <ColourArch colours={selection.customColours.length ? selection.customColours : coloursByName(defaultCustomColours[selection.atmosphere === 'dark' ? 'dark' : 'romantic'])} foliage={(foliageColour ?? foliageOptions[1]).name} coverage="Full arch" label="Your own colours preview" />
                    <span className="dh-look-badge">New</span>
                    <span className="dh-tick" aria-hidden="true">{isCustom && <Check size={15} />}</span>
                  </span>
                  <strong>Your own colours</strong>
                  <small>Pick your own flower and foliage colours and see them on the arch.</small>
                </button>
              </div>
            )}

            {step === 1 && isCustom && (
              <div className="dh-own">
                <ColourArch className="dh-own-preview" colours={selection.customColours} foliage={foliageColour?.name ?? ''} coverage={previewCoverage} />
                <div className="dh-own-controls">
                  <fieldset className="dh-group">
                    <legend>Flower colours <span>(up to {MAX_FLOWER_COLOURS}, main colour first)</span></legend>
                    <div className="dh-swatch-grid">
                      {flowerColours.map((colour) => {
                        const position = selection.customColours.findIndex((item) => item.value === colour.value)
                        const full = position === -1 && selection.customColours.length >= MAX_FLOWER_COLOURS
                        return (
                          <button type="button" key={colour.name} className={`dh-swatch ${position !== -1 ? 'selected' : ''}`} aria-pressed={position !== -1} disabled={full} onClick={() => toggleColour(colour.name, colour.value)} title={colour.name}>
                            <i style={{ backgroundColor: colour.value }} aria-hidden="true">{position !== -1 && <b>{position + 1}</b>}</i>
                            <span>{colour.name}</span>
                          </button>
                        )
                      })}
                    </div>
                    <div className="dh-own-custom">
                      <label>
                        <span>Your exact shade</span>
                        <input type="color" value={customPick} onChange={(event) => setCustomPick(event.target.value)} />
                      </label>
                      <button type="button" className="button button-outline" disabled={selection.customColours.length >= MAX_FLOWER_COLOURS || selection.customColours.some((colour) => colour.value === customPick)} onClick={() => toggleColour(`Your shade ${customPick.toUpperCase()}`, customPick)}>Add this colour</button>
                    </div>
                    {selection.customColours.length > 0 && (
                      <ul className="dh-own-chosen" aria-label="Your chosen colours">
                        {selection.customColours.map((colour) => (
                          <li key={colour.value}><i style={{ backgroundColor: colour.value }} aria-hidden="true" />{colour.name}<button type="button" onClick={() => toggleColour(colour.name, colour.value)} aria-label={`Remove ${colour.name}`}>×</button></li>
                        ))}
                      </ul>
                    )}
                  </fieldset>
                  <fieldset className="dh-group">
                    <legend>Foliage</legend>
                    <div className="dh-chips">
                      {foliageOptions.map((option) => (
                        <button type="button" key={option.name} className={`dh-chip dh-chip-swatch ${selection.foliage === option.name ? 'selected' : ''}`} aria-pressed={selection.foliage === option.name} onClick={() => update('foliage', option.name)}><i style={{ backgroundColor: option.value }} aria-hidden="true" />{option.name}</button>
                      ))}
                    </div>
                  </fieldset>
                  <p className="dh-own-note">A guide to colour and shape only. Sarah will match real flowers to your colours and confirm what’s possible.</p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="dh-details">
                <fieldset className="dh-group">
                  <legend>Flowers</legend>
                  <div className="dh-cards dh-cards-3">
                    {stylingOptions.map((option) => (
                      <button type="button" key={option.value} className={`dh-card ${selection.styling === option.value ? 'selected' : ''}`} aria-pressed={selection.styling === option.value} onClick={() => update('styling', option.value)}>
                        <strong>{option.title}</strong>
                        <small>{option.detail}</small>
                        <span className="dh-card-tick" aria-hidden="true">{selection.styling === option.value && <Check size={12} />}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="dh-group">
                  <legend>How far should the flowers reach?</legend>
                  <div className="dh-cards dh-cards-3">
                    {coverageOptions.map((option) => (
                      <button type="button" key={option.value} className={`dh-card dh-coverage ${selection.coverage === option.value ? 'selected' : ''}`} aria-pressed={selection.coverage === option.value} onClick={() => update('coverage', option.value)}>
                        <CoverageHeart amount={option.amount} />
                        <strong>{option.value}</strong>
                        <small>{option.detail}</small>
                        <span className="dh-card-tick" aria-hidden="true">{selection.coverage === option.value && <Check size={12} />}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="dh-group">
                  <legend>Throne chairs</legend>
                  <div className="dh-thrones">
                    <button type="button" className={`dh-throne dh-throne-none ${selection.seating === 'none' ? 'selected' : ''}`} aria-pressed={selection.seating === 'none'} onClick={chooseNoChairs}>
                      <span className="dh-throne-image"><Ban size={26} strokeWidth={1.3} aria-hidden="true" /><span className="dh-tick" aria-hidden="true">{selection.seating === 'none' && <Check size={13} />}</span></span>
                      <strong>No chairs</strong>
                    </button>
                    {thrones.map((throne) => {
                      const picked = Boolean(selection.seating) && selection.seating !== 'none' && selection.throneStyle === throne.name
                      return (
                        <button type="button" key={throne.name} className={`dh-throne ${picked ? 'selected' : ''}`} aria-pressed={picked} onClick={() => chooseThrone(throne.name)}>
                          <span className="dh-throne-image"><img src={asset(throne.image)} alt="" loading="lazy" /><span className="dh-tick" aria-hidden="true">{picked && <Check size={13} />}</span></span>
                          <strong>{throne.name}</strong>
                        </button>
                      )
                    })}
                  </div>
                  {selection.seating && selection.seating !== 'none' && (
                    <div className="dh-toggle" role="group" aria-label="How many throne chairs">
                      {([['single', 'One chair · £150'], ['pair', 'A pair · £300']] as [Seating, string][]).map(([value, label]) => (
                        <button type="button" key={value} className={selection.seating === value ? 'active' : ''} aria-pressed={selection.seating === value} onClick={() => update('seating', value)}>{label}</button>
                      ))}
                    </div>
                  )}
                </fieldset>

                <div className="dh-group-pair">
                  <fieldset className="dh-group">
                    <legend>Where will it frame your day?</legend>
                    <div className="dh-chips">
                      {momentOptions.map((option) => (
                        <button type="button" key={option} className={`dh-chip ${selection.moment === option ? 'selected' : ''}`} aria-pressed={selection.moment === option} onClick={() => update('moment', option)}>{option}</button>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset className="dh-group">
                    <legend>Finishing touches?</legend>
                    <div className="dh-chips">
                      {([['no', 'Not for now'], ['yes', 'Yes, candles & details']] as [YesNo, string][]).map(([value, label]) => (
                        <button type="button" key={value} className={`dh-chip ${selection.coordinating === value ? 'selected' : ''}`} aria-pressed={selection.coordinating === value} onClick={() => update('coordinating', value)}>{label}</button>
                      ))}
                    </div>
                  </fieldset>
                </div>
              </div>
            )}

            {step === 3 && recommendation && selectedLook && (
              <div className="dh-result">
                <div className="dh-recommend" aria-live="polite">
                  <span>Your suggested starting point</span>
                  <h3>{recommendation.name}</h3>
                  <strong>{recommendation.price}</strong>
                  <p>{recommendation.description}</p>
                </div>
                <p className="dh-note">Guide prices only. Nothing is booked yet: Sarah will personally confirm your design, availability and final quotation, which depends on your date, venue, travel and flowers.</p>
                <div className="dh-result-actions">
                  <Link to={enquiryPath} className="button button-primary">Send my design to Sarah <ArrowRight size={17} /></Link>
                  <button type="button" className="button button-outline" onClick={saveMoodboard}><Save size={16} />{saveNotice.startsWith('Moodboard saved') ? 'Saved' : 'Save on this device'}</button>
                </div>
                {saveNotice && <p className="dh-save-notice" role="status">{saveNotice}</p>}
              </div>
            )}

            <div className="dh-controls">
              {step > 0 ? <button type="button" className="dh-back" onClick={() => setStep((current) => current - 1)}><ArrowLeft size={16} /> Back</button> : <span />}
              {step < steps.length - 1 && <button type="button" className="button button-primary" disabled={!canContinue} onClick={next}>{step === 2 ? 'See my design' : 'Continue'} <ArrowRight size={17} /></button>}
              {step === steps.length - 1 && <button type="button" className="dh-back" onClick={startAgain}><RotateCcw size={15} /> Start again</button>}
            </div>
          </div>

          <aside className="dh-board" aria-label="Your moodboard">
            <div className="dh-board-head">
              <p className="eyebrow">Your moodboard</p>
              <h3>{selectedLook?.name ?? atmosphereCard?.name ?? 'Begin with a feeling'}</h3>
            </div>
            <div className="dh-collage">
              <div className="dh-tile dh-tile-main" key={isCustom ? 'own' : previewImage || 'empty'}>
                {isCustom ? <ColourArch colours={selection.customColours} foliage={foliageColour?.name ?? ''} coverage={previewCoverage} /> : previewImage ? <img src={previewImage} alt={selectedLook ? `${selectedLook.name} heart arch` : ''} /> : <span className="dh-tile-empty"><Heart size={26} strokeWidth={1.3} aria-hidden="true" />Your arch</span>}
              </div>
              <div className="dh-tile dh-tile-throne" key={chosenThrone?.name ?? 'none'}>
                {chosenThrone
                  ? <><img src={asset(chosenThrone.image)} alt={`${chosenThrone.name} throne chairs`} /><span className="dh-tile-label">{chosenThrone.name}</span></>
                  : <span className="dh-tile-empty">{selection.seating === 'none' ? <><Ban size={22} strokeWidth={1.3} aria-hidden="true" />No thrones</> : <><Crown size={22} strokeWidth={1.3} aria-hidden="true" />Thrones</>}</span>}
              </div>
              <div className="dh-tile dh-tile-palette">
                {selectedLook
                  ? <div className="dh-swatches">{palette.map((colour) => <span key={colour.name}><i style={{ backgroundColor: colour.value }} aria-hidden="true" /><small>{colour.name}</small></span>)}</div>
                  : <span className="dh-tile-empty"><span className="dh-swatch-dots" aria-hidden="true"><i /><i /><i /></span>Palette</span>}
              </div>
            </div>
            <dl className="dh-board-list">
              {boardRows.map(([label, value]) => (
                <div key={label} className={value ? '' : 'empty'}><dt>{label}</dt><dd>{value || '—'}</dd></div>
              ))}
            </dl>
            {recommendation && <div className="dh-board-price"><small>Suggested starting point</small><strong>{recommendation.name} · {recommendation.price}</strong></div>}
          </aside>
        </div>
      </section>

      <section className="dh-after">
        <h2>Can’t see exactly what you have in mind?</h2>
        <p>Choose the closest look and tell Sarah what you’d change. The moodboard is a starting point, never a limit.</p>
        <Link to="/enquire" className="text-link">Make a simple enquiry instead <ArrowRight size={16} /></Link>
      </section>
    </>
  )
}
