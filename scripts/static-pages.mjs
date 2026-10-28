// Runs after `npm run build` (npm "postbuild"). GitHub Pages serves static
// files only, so this writes a real HTML file for every page of the site.
//
// Each file is pre-rendered: it already contains the page's text, title,
// description and link-preview details, so search engines, Facebook, WhatsApp
// and other link previews see the real page without running JavaScript. In the
// browser the app then takes over as normal.
//
// The pre-rendering uses the server build in dist-ssr/ (created by
// `vite build --ssr src/entry-server.tsx`).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const SITE_URL = 'https://heartsinbloom.co.uk'
const dist = resolve('dist')
const shellPath = resolve(dist, 'index.html')
const serverEntry = resolve('dist-ssr', 'entry-server.js')

if (!existsSync(shellPath)) {
  console.error('dist/index.html is missing; run "vite build" first.')
  process.exit(1)
}
if (!existsSync(serverEntry)) {
  console.error('dist-ssr/entry-server.js is missing; run "npm run build" (it builds both).')
  process.exit(1)
}

// Keep in step with the <Route path="..."> entries in src/App.tsx.
export const routes = [
  'collection',
  'dark-romance',
  'pricing',
  'about',
  'philosophy',
  'inspiration',
  'enquire',
  'booking-guide',
  'areas',
  'planners',
  'terms',
  'privacy',
  'cookies',
]

const shell = readFileSync(shellPath, 'utf8')
const { render } = await import(pathToFileURL(serverEntry).href)

const escapeAttr = (value) =>
  value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
const escapeText = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

function setMeta(html, attr, key, content) {
  const pattern = new RegExp(`<meta ${attr}="${key}" content="[^"]*"\\s*/?>`)
  const tag = `<meta ${attr}="${key}" content="${escapeAttr(content)}" />`
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `    ${tag}\n  </head>`)
}

function buildPage(path, { canonical = true } = {}) {
  const { html: body, head } = render(path)
  let page = shell.replace('<div id="root"></div>', `<div id="root">${body}</div>`)
  if (head.title) {
    page = page.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeText(head.title)}</title>`)
    page = setMeta(page, 'property', 'og:title', head.title)
  }
  if (head.description) {
    page = setMeta(page, 'name', 'description', head.description)
    page = setMeta(page, 'property', 'og:description', head.description)
  }
  if (canonical) {
    // /philosophy shows the About page, so search engines are pointed at /about.
    const url = SITE_URL + (path === '/' ? '/' : path === '/philosophy' ? '/about' : path)
    page = setMeta(page, 'property', 'og:url', url)
    page = page.replace('</head>', `    <link rel="canonical" href="${url}" />\n  </head>`)
  } else {
    page = page.replace('</head>', '    <meta name="robots" content="noindex" />\n  </head>')
  }
  for (const { id, data } of head.jsonLd) {
    // "<" is escaped so the data can never close the script tag early.
    const json = JSON.stringify(data).replaceAll('<', '\\u003c')
    page = page.replace('</head>', `    <script type="application/ld+json" id="${id}">${json}</script>\n  </head>`)
  }
  return page
}

function write(file, contents) {
  const target = resolve(dist, file)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, contents)
}

write('index.html', buildPage('/'))
for (const route of routes) write(`${route}/index.html`, buildPage(`/${route}`))
write('404.html', buildPage('/page-not-found', { canonical: false }))

console.log(`Pre-rendered the home page, ${routes.length} route pages and dist/404.html`)
