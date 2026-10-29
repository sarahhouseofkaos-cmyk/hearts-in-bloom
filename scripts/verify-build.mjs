// Checks the production build in dist/ before it is published.
// Usage: VITE_BASE=/hearts-in-bloom/ node scripts/verify-build.mjs
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'

const dist = resolve('dist')
const base = (process.env.VITE_BASE || '/').replace(/\/?$/, '/')
const failures = []
const fail = (message) => failures.push(message)

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name)
    return statSync(full).isDirectory() ? walk(full) : [full]
  })
}

const routes = ['collection', 'dark-romance', 'design-your-heart', 'pricing', 'about', 'philosophy', 'inspiration', 'enquire', 'booking-guide', 'areas', 'planners', 'terms', 'privacy', 'cookies']
for (const page of ['index.html', '404.html', ...routes.map((r) => `${r}/index.html`)]) {
  if (!existsSync(join(dist, page))) fail(`Missing ${page}`)
}

const html = existsSync(join(dist, 'index.html')) ? readFileSync(join(dist, 'index.html'), 'utf8') : ''
if (!html.includes('<div id="root">')) fail('index.html has no app root')

// Every asset the HTML references must exist and must sit under the base path.
for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  const url = match[1]
  if (/^(https?:|mailto:|#|data:)/.test(url)) continue
  if (!url.startsWith(base)) {
    fail(`index.html references ${url}, which is outside the base path ${base}`)
    continue
  }
  const file = join(dist, url.slice(base.length))
  if (!existsSync(file)) fail(`index.html references ${url}, which is not in dist/`)
}

// Every image the code refers to must exist, and none may be hard-coded without the base.
const files = walk(dist)
const text = files.filter((f) => /\.(js|css|html)$/.test(f))
for (const file of text) {
  const body = readFileSync(file, 'utf8')
  for (const m of body.matchAll(/images\/[a-z0-9-]+\.webp/g)) {
    if (!existsSync(join(dist, m[0]))) fail(`${file.slice(dist.length + 1)} refers to missing ${m[0]}`)
  }
}
const js = files.filter((f) => f.endsWith('.js'))
// The app prefixes every image with the base path at run time (src/lib/asset.ts),
// so the base must have been compiled into the bundle.
if (base !== '/' && !js.some((file) => readFileSync(file, 'utf8').includes(JSON.stringify(base)))) {
  fail(`The base path ${base} was not compiled into the JavaScript bundle`)
}

// A static site must not contain backend calls or secrets.
const forbidden = [/api\/trpc/, /\/api\/log/, /MAILERLITE_API/i, /Authorization/, /Bearer\s/, /DATABASE_URL/, /kimi/i, /mysql/i]
for (const file of text) {
  const body = readFileSync(file, 'utf8')
  for (const pattern of forbidden) {
    if (pattern.test(body)) fail(`${file.slice(dist.length + 1)} matches forbidden pattern ${pattern}`)
  }
}

// The only third-party endpoint the site may post to is MailerLite's public form endpoint.
const endpoints = new Set()
for (const file of js) {
  for (const m of readFileSync(file, 'utf8').matchAll(/https:\/\/assets\.mailerlite\.com[^"'`\s]*/g)) endpoints.add(m[0])
}
if (endpoints.size === 0) fail('The MailerLite form endpoint is missing from the build')

if (!existsSync(join(dist, 'images', 'hero-heart-arch.webp'))) fail('Images were not copied into dist/')

// Every page must be pre-rendered: its text and its own title must be in the
// HTML file itself, not only added later by JavaScript.
const prerendered = {
  'index.html': ['A beautiful setting', 'Wedding Styling &amp; Luxury Hire in Newcastle upon Tyne | Hearts in Bloom'],
  'pricing/index.html': ['Four ways to', 'Packages &amp; Pricing | Hearts in Bloom', 'FAQPage'],
  'dark-romance/index.html': ['deeper tones.', 'Nocturnal Wedding Collection', 'Dark Romance Collection | Hearts in Bloom'],
  'about/index.html': ['My story', 'About Sarah | Hearts in Bloom'],
  'enquire/index.html': ['Tell us about'],
  'design-your-heart/index.html': ['your heart.', 'Design Your Heart | Hearts in Bloom'],
}
for (const [page, needles] of Object.entries(prerendered)) {
  const file = join(dist, page)
  if (!existsSync(file)) continue
  const body = readFileSync(file, 'utf8')
  for (const needle of needles) {
    if (!body.includes(needle)) fail(`${page} is not pre-rendered: "${needle}" is missing from the HTML`)
  }
  if ((body.match(/<title>/g) || []).length !== 1) fail(`${page} should have exactly one <title>`)
}
const notFound = existsSync(join(dist, '404.html')) ? readFileSync(join(dist, '404.html'), 'utf8') : ''
if (!notFound.includes('noindex')) fail('404.html should tell search engines not to index it')

if (failures.length) {
  console.error(`Build verification failed (${failures.length}):`)
  for (const f of failures) console.error(` - ${f}`)
  process.exit(1)
}
console.log(`Build verified: base ${base}, ${routes.length + 2} pages, ${files.length} files.`)
