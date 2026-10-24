import { Favicon } from '@/shared/components/Favicon'
import { SidebarItem } from '@/shared/components/SidebarItem'

export interface DomainCount {
  domain: string
  count: number
}

interface DomainsSectionProps {
  domains: DomainCount[]
  activeDomain: string | null
  onSelect: (domain: string) => void
}

export function DomainsSection({ domains, activeDomain, onSelect }: DomainsSectionProps) {
  return (
    <div className="flex flex-col gap-px">
      <div className="flex h-7 items-center px-2.5 text-xs font-medium text-muted">Domains</div>
      {domains.map((d) => (
        <SidebarItem
          key={d.domain}
          active={activeDomain === d.domain}
          onClick={() => onSelect(d.domain)}
          leading={<Favicon domain={d.domain} />}
          label={d.domain}
          count={d.count}
        />
      ))}
    </div>
  )
}
