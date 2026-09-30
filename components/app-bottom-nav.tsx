'use client'

import Link from 'next/link'
import { History, Home, ScanLine } from 'lucide-react'
import { usePathname } from 'next/navigation'

const items = [
  { href: '/app', label: 'Home', icon: Home },
  { href: '/app/scan', label: 'Scan', icon: ScanLine },
  { href: '/app/history', label: 'History', icon: History },
]

export function AppBottomNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="App navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-[#dce9e1] bg-white/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_30px_rgba(5,46,31,.08)] backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-3 gap-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === '/app' ? pathname === href : pathname.startsWith(href)
          return (
            <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-bold transition ${active ? 'bg-[#e5f7e9] text-[#039855]' : 'text-[#81918a] hover:bg-[#f6faf8] hover:text-[#052e1f]'}`}>
              <Icon className="size-5" aria-hidden="true" />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
