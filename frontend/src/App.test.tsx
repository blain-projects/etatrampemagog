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

function rampPayload(status: 'open' | 'closed' | 'unknown') {
  return {
    status,
    label: status === 'closed' ? 'Fermée' : status === 'open' ? 'Ouverte' : 'Statut inconnu',
    reopening_date: null,
    reopening_time: null,
    reopening_date_display: null,
    river_flow: '42 m³/s',
    ramp_info: null,
    source_url: 'https://www.ville.magog.qc.ca/avis',
    fetched_at: '2026-11-03T12:00:00.000Z',
    excerpt: null,
  }
}

test('status badges and the gauge threshold are sentence case, and the gauge does not loop', async () => {
  const { default: FlowGauge } = await import('./FlowGauge')
  const gauge = render(<FlowGauge riverFlow="42 m³/s" />)
  expect(gauge.container.textContent).toContain('Seuil')
  expect(gauge.container.textContent).not.toMatch(/SEUIL/)
  const looping = [...gauge.container.querySelectorAll('[style]')].filter((el) =>
    (el.getAttribute('style') ?? '').includes('infinite'),
  )
  expect(looping).toHaveLength(0)
  gauge.unmount()

  for (const [status, badge] of [
    ['open', 'En direct'],
    ['closed', 'Fermée'],
    ['unknown', 'Indéterminé'],
  ] as const) {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: true, json: async () => rampPayload(status) })),
    )
    const view = render(<App />)
    const badgeEl = await screen.findByText(badge, { selector: '.bui-badge > span' })
    expect(badgeEl.textContent).toBe(badge)
    expect(view.container.textContent).not.toContain(badge.toLocaleUpperCase('fr-CA'))
    view.unmount()
  }
})
