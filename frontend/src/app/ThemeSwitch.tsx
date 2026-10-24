import { Icon, type IconName } from '@/shared/components/Icon'
import type { ThemeChoice } from './useTheme'

const OPTIONS: { id: ThemeChoice; label: string; icon: IconName }[] = [
  { id: 'system', label: 'System', icon: 'monitor' },
  { id: 'light', label: 'Light', icon: 'sun' },
  { id: 'dark', label: 'Dark', icon: 'moon' },
]

interface ThemeSwitchProps {
  value: ThemeChoice
  onChange: (value: ThemeChoice) => void
}

export function ThemeSwitch({ value, onChange }: ThemeSwitchProps) {
  return (
    <div role="radiogroup" aria-label="Theme" className="grid grid-cols-3 gap-0.5 rounded-[7px] bg-hover p-0.5">
      {OPTIONS.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          aria-label={`${o.label} theme`}
          title={o.label}
          onClick={() => onChange(o.id)}
          className={`grid h-[26px] cursor-pointer place-items-center rounded-[5px] border-0 ${
            value === o.id ? 'bg-panel text-ink shadow-[0_1px_2px_rgb(0_0_0/0.12)]' : 'bg-transparent text-muted'
          }`}
        >
          <Icon name={o.icon} size={15} />
        </button>
      ))}
    </div>
  )
}
