import { useCallback, useEffect, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Loader2, RefreshCw, Ship, XCircle } from 'lucide-react'
import {
  Badge,
  BlueprintBackground,
  Button,
  Card,
  CardBody,
  CardHeader,
  Display,
  Heading,
  MonoLabel,
  Text,
} from '@blain-projects/ui'
import { apiFetch } from './api'
import FlowGauge from './FlowGauge'
import { MAGOG_AVIS_URL, MAGOG_LOISIRS_RAMPE_URL } from './magogUrls'
import type { RampStatus, RampStatusResponse } from './types/ramp'
import './App.css'

type LoadState = 'loading' | 'ready' | 'error'

function formatFetchedAt(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return ''
  }
  return new Intl.DateTimeFormat('fr-CA', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

type BadgeTone = 'ok' | 'danger' | 'warn'

function statusTone(status: RampStatus): BadgeTone {
  if (status === 'open') return 'ok'
  if (status === 'closed') return 'danger'
  return 'warn'
}

function StatusIcon({ status }: { status: RampStatus }) {
  if (status === 'open') {
    return <CheckCircle2 className="status-icon" aria-hidden="true" />
  }
  if (status === 'closed') {
    return <XCircle className="status-icon" aria-hidden="true" />
  }
  return <AlertCircle className="status-icon" aria-hidden="true" />
}

function App() {
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [rampStatus, setRampStatus] = useState<RampStatusResponse | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isButtonDisabledTimer, setButtonDisabledTimer] = useState(false)
  const timerRef = useRef<any>(null)

  const loadStatus = useCallback(async () => {
    setLoadState('loading')
    setErrorMessage(null)

    try {
      const urlParams = new URLSearchParams(window.location.search)
      const mockFlow = urlParams.get('mock_flow')
      const endpoint = mockFlow
        ? `/api/ramp-status?mock_flow=${encodeURIComponent(mockFlow)}`
        : '/api/ramp-status'
      const response = await apiFetch(endpoint)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      const data = (await response.json()) as RampStatusResponse
      setRampStatus(data)
      setLoadState('ready')
    } catch {
      setRampStatus(null)
      setErrorMessage(
        'Impossible de charger le statut. Réessayez dans quelques instants.',
      )
      setLoadState('error')
    }
  }, [])

  const handleRefresh = useCallback(() => {
    if (isButtonDisabledTimer) return
    void loadStatus()
    setButtonDisabledTimer(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setButtonDisabledTimer(false)
    }, 10000)
  }, [loadStatus, isButtonDisabledTimer])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  useEffect(() => {
    void loadStatus()
  }, [loadStatus])

  const status = rampStatus?.status ?? 'unknown'
  const isRefreshing = loadState === 'loading' && rampStatus !== null

  return (
    <>
      <BlueprintBackground />
      <div className="mx-auto flex min-h-screen max-w-[720px] flex-col px-4 py-8">
        <header className="mb-8 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Ship className="h-10 w-10 flex-shrink-0 text-[var(--bui-blue-strong)]" aria-hidden="true" />
            <div>
              <Heading level={1}>Rampe de mise à l&apos;eau</Heading>
              <Text className="text-[var(--bui-muted)]">Rampe de la capitainerie — Magog</Text>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={loadState === 'loading' || isButtonDisabledTimer}
            aria-busy={loadState === 'loading'}
          >
            <RefreshCw className={isRefreshing ? 'spin' : undefined} aria-hidden="true" />
            Actualiser
          </Button>
        </header>

        <main className="flex flex-1 items-center justify-center">
          {loadState === 'loading' && rampStatus === null && (
            <Card corners className="w-full">
              <CardBody>
                <div className="flex flex-col items-center gap-4 text-center" aria-live="polite">
                  <Loader2 className="status-icon spin text-[var(--bui-muted)]" aria-hidden="true" />
                  <Text className="text-[var(--bui-muted)]">Chargement du statut…</Text>
                </div>
              </CardBody>
            </Card>
          )}

          {loadState === 'error' && (
            <Card corners className="w-full">
              <CardBody>
                <div className="flex flex-col items-center gap-4 text-center" role="alert">
                  <AlertCircle className="status-icon text-[var(--bui-danger)]" aria-hidden="true" />
                  <Text>{errorMessage}</Text>
                  <Button type="button" variant="ghost" size="sm" onClick={() => void loadStatus()}>
                    Réessayer
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          {rampStatus && loadState !== 'error' && (
            <Card
              corners
              className="w-full"
              aria-live="polite"
              aria-label={`Statut : ${rampStatus.label}`}
            >
              <CardHeader>
                <div className="flex items-center justify-center">
                  <Badge tone={statusTone(status)}>
                    {status === 'open' && 'EN DIRECT'}
                    {status === 'closed' && 'FERMÉE'}
                    {status === 'unknown' && 'INDÉTERMINÉ'}
                  </Badge>
                </div>
              </CardHeader>
              <CardBody>
                <div className="flex flex-col items-center text-center">
                  <StatusIcon status={status} />
                  <Display className="mt-4">{rampStatus.label}</Display>
                  <Text className="mt-3 text-[var(--bui-muted)]">
                    {status === 'open' && 'La rampe est accessible aux embarcations.'}
                    {status === 'closed' && 'La rampe est fermée pour le moment.'}
                    {status === 'unknown' &&
                      'Le statut n’a pas pu être déterminé clairement à partir des avis municipaux.'}
                  </Text>

                  {status === 'closed' && rampStatus.reopening_date_display && (
                    <div className="mt-6 w-full rounded-[var(--bui-r-md)] border border-[color-mix(in_srgb,var(--bui-danger)_30%,transparent)] bg-[color-mix(in_srgb,var(--bui-danger)_12%,var(--bui-surface))] px-6 py-4">
                      <MonoLabel className="block uppercase">Réouverture prévue</MonoLabel>
                      <span className="mt-2 block text-2xl font-bold text-[var(--bui-text)]">
                        {rampStatus.reopening_date_display.replace(/,\s*\d+\s*h.*$/, '')}
                        {rampStatus.reopening_time && ` à ${parseInt(rampStatus.reopening_time.split(':')[0])}h`}
                      </span>
                    </div>
                  )}

                  {rampStatus?.ramp_info && status !== 'open' && (
                    <Text className="mt-4 w-full rounded-[var(--bui-r-md)] border border-[color-mix(in_srgb,var(--bui-blue)_25%,transparent)] bg-[color-mix(in_srgb,var(--bui-blue)_8%,var(--bui-surface))] px-4 py-3">
                      {rampStatus.ramp_info}
                    </Text>
                  )}

                  {/* Flow gauge visual — always show, even without data */}
                  <div className="w-full">
                    <FlowGauge riverFlow={rampStatus?.river_flow ?? null} />
                  </div>

                  {status === 'closed' && !rampStatus.reopening_date_display && (
                    <Text className="mt-4 text-[var(--bui-muted)]">
                      Date de réouverture non précisée sur le site municipal.
                    </Text>
                  )}

                  <MonoLabel className="mt-6 mb-3 block">
                    Dernière mise à jour : {formatFetchedAt(rampStatus.fetched_at)}
                  </MonoLabel>
                  <div className="mt-2 flex flex-col items-center gap-3">
                    <Button asChild variant="mono" size="sm">
                      <a
                        href={rampStatus.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Voir l&apos;avis officiel
                      </a>
                    </Button>
                    <Button asChild variant="mono" size="sm">
                      <a
                        href={MAGOG_LOISIRS_RAMPE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Page municipale : débit et rampe
                      </a>
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </main>

        <footer className="mt-8 flex flex-col gap-1 text-center">
          <MonoLabel>
            Données : Ville de Magog —{' '}
            <a href={MAGOG_AVIS_URL} target="_blank" rel="noopener noreferrer">
              avis importants
            </a>
          </MonoLabel>
          <MonoLabel>etatrampemagog.blain-projects.ca</MonoLabel>
        </footer>
      </div>
    </>
  )
}

export default App
