import Link from 'next/link'
import { ArrowLeft, ChevronRight, Leaf } from 'lucide-react'
import { AppBottomNav } from '@/components/app-bottom-nav'

const scans = [
  ['Hearth & Grain Granola', 'Today, 8:42 AM', '91', 'Breakfast'],
  ['Green Valley Greek Yogurt', 'Yesterday, 3:18 PM', '84', 'Snack'],
  ['Harvest Lentil Soup', 'Yesterday, 12:06 PM', '78', 'Lunch'],
  ['Simple Mills Crackers', 'Monday, 6:24 PM', '72', 'Dinner'],
]

export default function HistoryPage() {
  return <main className="min-h-screen bg-[#f6faf8] pb-24 text-[#07110d]"><header className="border-b border-[#e3ebe7] bg-white"><div className="mx-auto flex h-[70px] max-w-[900px] items-center justify-between px-4 sm:px-8"><Link href="/app" className="inline-flex items-center gap-2 text-sm font-bold text-[#5b6e67]"><ArrowLeft className="size-4" /> Dashboard</Link><h1 className="text-base font-bold">Scan history</h1><span className="w-20" /></div></header><div className="mx-auto max-w-[900px] px-4 py-10 sm:px-8 sm:py-14"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#039855]">Your diary</p><h2 className="mt-3 text-4xl font-bold tracking-[-.06em]">Every choice adds up.</h2><p className="mt-3 text-sm leading-6 text-[#5b6e67]">Review the foods you&apos;ve scanned and the patterns you&apos;re building.</p></div><div className="mt-8 grid gap-3">{scans.map(([name, date, score, meal]) => <Link href="/app/scan" key={name} className="flex items-center gap-4 rounded-2xl border border-[#dce9e1] bg-white p-4 transition hover:shadow-lg"><div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#dff7e6]"><Leaf className="size-5 text-[#039855]" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{name}</p><p className="mt-1 text-xs text-[#81918a]">{meal} · {date}</p></div><div className="text-right"><p className="text-xl font-bold text-[#039855]">{score}</p><p className="text-[10px] font-bold uppercase tracking-wider text-[#81918a]">score</p></div><ChevronRight className="size-4 text-[#9aa8a3]" /></Link>)}</div></div><AppBottomNav /></main>
}
