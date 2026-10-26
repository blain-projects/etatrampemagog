import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import App from './App'

beforeEach(() => {
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })))
  vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})))
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
})
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.restoreAllMocks() })

test('the page ends on the site footer with the repo, the version and the data source', () => {
  render(<App />)
  const footer = screen.getByRole('contentinfo')
  expect(footer.className).toContain('bui-site-footer')
  expect(within(footer).getByRole('link', { name: 'etatrampemagog' }).getAttribute('href'))
    .toBe('https://github.com/blain-projects/etatrampemagog')
  expect(within(footer).getByText(__APP_VERSION__)).toBeTruthy()
  expect(within(footer).getByRole('link', { name: /Ville de Magog/ })).toBeTruthy()
})

test('the public page runs the show-off currents', () => {
  const { container } = render(<App />)
  expect(container.querySelector('canvas.bui-bp--currents')).toBeTruthy()
})
