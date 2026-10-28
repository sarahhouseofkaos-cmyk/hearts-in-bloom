// Build-time entry point used to pre-render every page to static HTML
// (see scripts/static-pages.mjs). It is never loaded in the browser.
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './App'
import { HeadCollector, HeadContext } from './head'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

/** Renders the page at `path` (for example "/pricing"), without the base path. */
export function render(path: string) {
  const head = new HeadCollector()
  const html = renderToString(
    <StrictMode>
      <HeadContext.Provider value={head}>
        <StaticRouter location={basename + path} basename={basename || undefined}>
          <App />
        </StaticRouter>
      </HeadContext.Provider>
    </StrictMode>,
  )
  return { html, head }
}
