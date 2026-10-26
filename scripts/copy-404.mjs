import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const output = resolve('dist/public/404.html')
mkdirSync(dirname(output), { recursive: true })
copyFileSync(resolve('dist/public/index.html'), output)
console.log('Created SPA fallback: dist/public/404.html')
