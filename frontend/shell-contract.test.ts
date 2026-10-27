import { readFileSync } from 'node:fs'
import { expect, test } from 'vitest'

// Read from disk: under Vitest a CSS `?raw` import is an empty string.
const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8')
const html = read('./index.html')
const brandCss = read('./src/brand-integration.css')

// @blain-projects/ui 2.1: the kit reserves the header band (offset + blur, 2.1.1)
// on .bui-main, and asks for the F4 webfonts and viewport-fit (2.1.0).
test('index.html declares the safe areas and the F4 webfonts', () => {
  expect(html).toMatch(/<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/)
  expect(html).toContain('family=Hanken+Grotesk')
  expect(html).toContain('family=JetBrains+Mono')
  expect(html).not.toMatch(/Space\+Grotesk|IBM\+Plex\+Mono|family=Inter/)
})

test('app CSS does not re-reserve the header band', () => {
  expect(brandCss).not.toMatch(/(padding|scroll-margin|scroll-padding)-top: var\(--bui-header-offset/)
})
