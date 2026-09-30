import { ThemeToggle, useTheme } from '@blain-projects/ui'

export function BrandThemeToggle() {
  const { theme, setTheme } = useTheme()
  return <ThemeToggle theme={theme} onThemeChange={setTheme} />
}
