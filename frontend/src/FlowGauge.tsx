import { useId } from 'react'

const THRESHOLD = 70
const MAX_FLOW = 150
const GAUGE_WIDTH = 600
const GAUGE_HEIGHT = 208
const PADDING_X = 60
const PADDING_TOP = 22
const PADDING_BOTTOM = 42
const BAR_TOP = 48
const BAR_HEIGHT = GAUGE_HEIGHT - BAR_TOP - PADDING_BOTTOM
const TRACK_FILL = '#f0f9ff'
const WATER_FILL = '#38bdf8'

interface FlowGaugeProps {
  riverFlow: string | null
}

function parseFlow(flow: string): number {
  const match = flow.match(/(\d+)/)
  return match ? parseInt(match[1], 10) : 0
}

export default function FlowGauge({ riverFlow }: FlowGaugeProps) {
  const uid = useId().replace(/:/g, '')
  const flow = riverFlow ? parseFlow(riverFlow) : null
  const hasData = flow !== null && flow > 0
  const isDanger = hasData && flow! > THRESHOLD
  const clampedFlow = hasData ? Math.min(flow!, MAX_FLOW) : 0

  const waterAreaWidth = GAUGE_WIDTH - PADDING_X * 2
  const waterWidth = (clampedFlow / MAX_FLOW) * waterAreaWidth

  const thresholdX = PADDING_X + (THRESHOLD / MAX_FLOW) * waterAreaWidth
  const tickBaseY = GAUGE_HEIGHT - PADDING_BOTTOM + 6
  const tickLabelY = GAUGE_HEIGHT - 10

  const clipId = `waterClip-${uid}`

  return (
    <div
      className="flow-gauge"
      role="img"
      aria-label={
        hasData
          ? `Débit actuel : ${riverFlow}. Seuil de fermeture : ${THRESHOLD} m³/s`
          : `Seuil de fermeture : ${THRESHOLD} m³/s. Données de débit non disponibles.`
      }
    >
      <div className="flow-gauge-value">
        {hasData ? (
          <>
            <span className="flow-number">{flow}</span>
            <span className="flow-unit">m³/s</span>
          </>
        ) : (
          <span className="flow-no-data">Données de débit non disponibles</span>
        )}
      </div>

      <svg
        viewBox={`0 0 ${GAUGE_WIDTH} ${GAUGE_HEIGHT}`}
        className="flow-svg"
        aria-hidden="true"
      >
        <defs>
          <clipPath id={clipId}>
            <rect
              x={PADDING_X}
              y={BAR_TOP}
              width={Math.max(waterWidth, 0)}
              height={BAR_HEIGHT}
              rx={14}
            />
          </clipPath>
        </defs>

        <rect
          x={PADDING_X}
          y={BAR_TOP}
          width={waterAreaWidth}
          height={BAR_HEIGHT}
          rx={14}
          fill={TRACK_FILL}
          stroke="var(--color-border)"
          strokeWidth="1.5"
        />

        {hasData && waterWidth > 0 ? (
          <rect
            x={PADDING_X}
            y={BAR_TOP}
            width={waterWidth}
            height={BAR_HEIGHT}
            rx={14}
            fill={WATER_FILL}
            clipPath={`url(#${clipId})`}
          />
        ) : null}

        <line
          x1={thresholdX}
          y1={PADDING_TOP + 12}
          x2={thresholdX}
          y2={BAR_TOP + BAR_HEIGHT - 4}
          stroke="#1e40af"
          strokeWidth="2"
          strokeDasharray="5,4"
          strokeOpacity="0.75"
        />
        <rect
          x={thresholdX - 30}
          y={PADDING_TOP}
          width={60}
          height={22}
          rx={6}
          fill="#1e3a8a"
        />
        <text
          x={thresholdX}
          y={PADDING_TOP + 15}
          textAnchor="middle"
          fill="white"
          fontSize="11"
          fontWeight="700"
          fontFamily="var(--font-sans)"
        >
          {THRESHOLD} SEUIL
        </text>

        {[0, 20, 40, 70, 100, 130, 150].map((tick) => {
          const x = PADDING_X + (tick / MAX_FLOW) * waterAreaWidth
          return (
            <g key={tick}>
              <line
                x1={x}
                y1={tickBaseY}
                x2={x}
                y2={tickBaseY + 7}
                stroke="var(--color-text-muted)"
                strokeWidth="1"
              />
              <text
                x={x}
                y={tickLabelY}
                textAnchor="middle"
                fill="var(--color-text-muted)"
                fontSize="11"
                fontFamily="var(--font-sans)"
              >
                {tick}
              </text>
            </g>
          )
        })}
      </svg>

      <div className={`flow-status ${hasData ? (isDanger ? 'danger' : 'safe') : 'nodata'}`}>
        <span className="flow-status-dot" />
        {!hasData ? (
          <span>
            Seuil de fermeture : <strong>{THRESHOLD} m³/s</strong> — débit non disponible
            (voir la page municipale)
          </span>
        ) : isDanger ? (
          <span>
            Débit <strong>trop élevé</strong> — au-dessus du seuil de {THRESHOLD} m³/s
          </span>
        ) : (
          <span>
            Débit <strong>sécuritaire</strong> — sous le seuil de {THRESHOLD} m³/s
          </span>
        )}
      </div>
    </div>
  )
}
