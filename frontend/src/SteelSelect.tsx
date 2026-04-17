import { useEffect, useId, useRef, useState } from 'react'

export type SteelSelectOption = {
  value: string
  label: string
}

type SteelSelectProps = {
  id: string
  options: SteelSelectOption[]
  value: string
  onChange: (value: string) => void
}

export function SteelSelect({ id, options, value, onChange }: SteelSelectProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  const selected = options.find((o) => o.value === value)
  const label = selected?.label ?? ''

  useEffect(() => {
    if (!open) return
    const onDocMouseDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocMouseDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="steel-select" ref={rootRef}>
      <button
        id={id}
        type="button"
        className="steel-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="steel-select-value">{label}</span>
        <span className="steel-select-chevron" aria-hidden="true" />
      </button>
      {open && (
        <ul id={listId} className="steel-select-menu" role="listbox" tabIndex={-1}>
          {options.map((opt) => (
            <li
              key={opt.value}
              role="option"
              className="steel-select-option"
              aria-selected={value === opt.value}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
