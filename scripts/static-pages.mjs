// Runs after `vite build` (npm "postbuild"). GitHub Pages serves static files
// only, so a visitor opening or refreshing /collection would get a 404 unless a
// real file exists there. This copies the built app shell to every client-side
// route (so direct links return HTTP 200) and to 404.html for unknown addresses.
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const dist = resolve('dist')
const shell = resolve(dist, 'index.html')
if (!existsSync(shell)) {
  console.error('dist/index.html is missing; run "vite build" first.')
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

for (const route of routes) {
  const target = resolve(dist, route, 'index.html')
  mkdirSync(dirname(target), { recursive: true })
  copyFileSync(shell, target)
}
copyFileSync(shell, resolve(dist, '404.html'))
console.log(`Created ${routes.length} route pages and dist/404.html`)
