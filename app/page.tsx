'use client'

import { useState } from 'react'
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  CircleHelp,
  Droplets,
  Leaf,
  Menu,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Utensils,
  X,
} from 'lucide-react'

const features = [
  { icon: ScanLine, title: 'AI barcode scan', copy: 'Know what is inside in two seconds.', tone: 'green', big: true },
  { icon: Sparkles, title: 'Image & label scan', copy: 'Even without a barcode, we have got you.', tone: 'purple', big: true },
  { icon: Target, title: 'One clear score', copy: 'A number that actually means something.', tone: 'orange' },
  { icon: ShieldCheck, title: 'Ingredient clarity', copy: 'Decode the label without the chemistry degree.', tone: 'blue' },
  { icon: TrendingUp, title: 'Personalized swaps', copy: 'Better options for your body and goals.', tone: 'lime' },
  { icon: Utensils, title: 'Small scans, big trends', copy: 'Build a picture of what works for you.', tone: 'green' },
]

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2.5" aria-label="Nutrition Scan home">
      <span className="relative grid size-9 place-items-center rounded-[13px] bg-[#052e1f] text-[#b6f09c] shadow-[0_5px_18px_rgba(5,46,31,.2)]">
        <Leaf className="size-5 -rotate-12" strokeWidth={2.4} />
        <span className="absolute bottom-1.5 left-2.5 h-2.5 w-px rotate-45 bg-[#b6f09c]" />
      </span>
      <span className="text-[17px] font-semibold tracking-[-.04em] text-[#07110d]">Nutrition<span className="font-bold text-[#039855]">Scan</span></span>
    </a>
  )
}

function ScoreRing({ score, small = false }: { score: number; small?: boolean }) {
  const size = small ? 110 : 176
  const radius = small ? 45 : 71
  const circumference = 2 * Math.PI * radius
  return (
    <div className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }}>
      <svg className="absolute inset-0 -rotate-90" viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e1eee7" strokeWidth={small ? 7 : 9} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#12b76a" strokeWidth={small ? 7 : 9} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - score / 100)} className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="text-center">
        <div className={`${small ? 'text-3xl' : 'text-5xl'} tabular font-bold tracking-[-.07em] text-[#07110d]`}>{score}</div>
        <div className="text-[10px] font-bold uppercase tracking-[.16em] text-[#039855]">Excellent</div>
      </div>
    </div>
  )
}

function PhoneDemo({ scanning }: { scanning: boolean }) {
  return (
    <div className="relative mx-auto w-[280px] sm:w-[310px]">
      <div className="absolute -left-14 top-24 hidden rounded-2xl border border-white/70 bg-white/90 px-3 py-2 shadow-xl backdrop-blur sm:block float-card">
        <div className="text-[10px] font-medium text-[#5b6e67]">Sugar</div><div className="font-mono text-sm font-bold text-[#039855]">−9g <span className="text-xs">better</span></div>
      </div>
      <div className="absolute -right-12 bottom-28 hidden rounded-2xl border border-white/70 bg-white/90 px-3 py-2 shadow-xl backdrop-blur sm:block float-card float-card-delay">
        <div className="flex items-center gap-1 text-[10px] font-medium text-[#5b6e67]"><Check className="size-3 text-[#12b76a]" /> Allergen free</div>
      </div>
      <div className="relative aspect-[.53] overflow-hidden rounded-[42px] border-[7px] border-[#18382c] bg-[#f6faf8] shadow-[0_30px_80px_rgba(5,46,31,.28)]">
        <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-[#18382c]" />
        <div className="flex items-center justify-between px-5 pb-3 pt-10 text-[10px] font-bold text-[#07110d]"><span>9:41</span><span className="flex gap-1">● ● ▰</span></div>
        <div className="px-4">
          <div className="mb-4 flex items-center justify-between"><span className="text-sm font-bold text-[#07110d]">Scan result</span><span className="grid size-7 place-items-center rounded-full bg-[#e3f8eb]"><CircleHelp className="size-3.5 text-[#039855]" /></span></div>
          <div className="relative mb-4 flex aspect-[.82] items-center justify-center overflow-hidden rounded-[22px] bg-[#d9e9dd]">
            <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at 28% 26%, #fff 0 5%, transparent 6%), radial-gradient(circle at 72% 66%, #fff 0 8%, transparent 9%), #b4ceb8' }} />
            {scanning && <div className="scan-line absolute inset-x-4 top-1/2 h-0.5 bg-[#12b76a] shadow-[0_0_15px_4px_rgba(18,183,106,.5)]" />}
            <div className="relative z-10 rounded-xl border border-white/80 bg-white/80 px-4 py-3 text-center shadow-lg backdrop-blur"><div className="text-[9px] uppercase tracking-[.16em] text-[#5b6e67]">{scanning ? 'Scanning label' : 'Organic granola'}</div><div className="mt-1 text-xs font-bold text-[#07110d]">{scanning ? 'Reading ingredients…' : 'Hearth & Grain'}</div></div>
          </div>
          <div className="rounded-[22px] bg-white p-4 shadow-[0_8px_24px_rgba(7,17,13,.06)]"><div className="flex items-center gap-3"><ScoreRing score={scanning ? 72 : 91} small /><div><div className="text-sm font-bold text-[#07110d]">{scanning ? 'Good choice' : 'A great choice'}</div><div className="mt-1 text-[10px] leading-relaxed text-[#5b6e67]">High in whole grains<br />Low added sugar</div></div></div><div className="mt-4 flex gap-1.5"><span className="rounded-full bg-[#ecfdf3] px-2 py-1 text-[9px] font-semibold text-[#027a48]">High fiber</span><span className="rounded-full bg-[#fff6e7] px-2 py-1 text-[9px] font-semibold text-[#b54708]">8g sugar</span></div></div>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  const [scanning, setScanning] = useState(false)
  const [scanDone, setScanDone] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const startScan = () => { setScanning(true); setScanDone(false); window.setTimeout(() => { setScanning(false); setScanDone(true) }, 2200) }

  return (
    <main id="top" className="overflow-hidden bg-[#f6faf8] text-[#07110d]">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/40 bg-[#f6faf8]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[70px] max-w-[1240px] items-center justify-between px-4 sm:px-8 lg:px-10"><Logo /><nav className="hidden items-center gap-8 text-sm font-medium text-[#5b6e67] md:flex"><a href="#how">How it works</a><a href="#features">Features</a><a href="#insights">Insights</a></nav><div className="flex items-center gap-2"><a href="/app" className="hidden rounded-full bg-[#052e1f] px-4 py-2.5 text-xs font-bold text-white transition-transform hover:scale-[1.03] sm:block">Open the app <ArrowRight className="ml-1 inline size-3.5" /></a><button onClick={() => setMenuOpen(!menuOpen)} className="grid size-10 place-items-center rounded-full bg-white text-[#052e1f] shadow-sm md:hidden" aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button></div></div>
        {menuOpen && <div className="border-t border-[#e3ebe7] bg-[#f6faf8] px-5 py-5 md:hidden"><nav className="flex flex-col gap-4 text-lg font-semibold"><a href="#how" onClick={() => setMenuOpen(false)}>How it works</a><a href="#features" onClick={() => setMenuOpen(false)}>Features</a><a href="/app" onClick={() => setMenuOpen(false)}>Open the app</a></nav></div>}
      </header>

      <section className="noise relative isolate px-4 pb-16 pt-32 sm:px-8 sm:pb-28 sm:pt-44 lg:px-10 lg:pt-48"><div className="hero-grid absolute inset-0 -z-10" /><div className="absolute -right-24 top-24 -z-10 size-72 rounded-full bg-[#b6f09c]/35 blur-3xl sm:size-[500px]" /><div className="mx-auto grid max-w-[1240px] items-center gap-14 lg:grid-cols-[1.04fr_.96fr] lg:gap-8"><div className="max-w-[650px]"><div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#b8e4c8] bg-white/70 px-3 py-1.5 text-[11px] font-semibold text-[#027a48] shadow-sm"><span className="size-1.5 rounded-full bg-[#12b76a]" /> Powered by AI vision <span className="text-[#9aa8a3]">·</span> 2.4M products scanned</div><h1 className="max-w-[680px] text-[clamp(3.2rem,8.3vw,6.7rem)] font-bold leading-[.93] tracking-[-.075em] text-[#07110d]">Know exactly what you&apos;re <span className="text-[#039855]">eating.</span></h1><p className="mt-7 max-w-[560px] text-base leading-7 text-[#5b6e67] sm:text-lg sm:leading-8">Scan any barcode or meal with your camera. Get an instant nutrition score, ingredient breakdown, and healthier swaps — personalized to your body and goals.</p><div className="mt-8 flex flex-col items-stretch gap-3 min-[420px]:flex-row min-[420px]:items-center"><button onClick={startScan} disabled={scanning} className="pulse-ring rounded-full bg-[#ff7a1a] px-5 py-3.5 text-sm font-bold text-white shadow-[0_12px_24px_rgba(255,122,26,.22)] transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-70">{scanning ? 'Scanning your label…' : scanDone ? 'Scan again' : 'Start scanning — free'} <ArrowRight className="ml-2 inline size-4" /></button><a href="#how" className="rounded-full border border-[#d4e2db] bg-white/60 px-5 py-3.5 text-sm font-bold text-[#2a3b35] transition hover:bg-white">See how it works <ChevronRight className="ml-1 inline size-4" /></a></div><div className="mt-8 flex items-center gap-3 text-xs text-[#5b6e67]"><div className="flex -space-x-2"><span className="grid size-7 place-items-center rounded-full border-2 border-[#f6faf8] bg-[#ffd6c1] text-[10px]">AL</span><span className="grid size-7 place-items-center rounded-full border-2 border-[#f6faf8] bg-[#c9e8d0] text-[10px]">JM</span><span className="grid size-7 place-items-center rounded-full border-2 border-[#f6faf8] bg-[#ddd1ff] text-[10px]">RS</span></div><span>Join 180,000 people eating with more clarity.</span></div></div><div className="relative lg:pr-12"><PhoneDemo scanning={scanning} /></div></div></section>

      <section className="border-y border-[#e3ebe7] bg-white/60 px-5 py-5 sm:px-8"><div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-center gap-x-10 gap-y-3 text-xs font-semibold tracking-wide text-[#81918a] sm:justify-between"><span>180K+ members</span><span>4.9 <span className="text-[#ffb020]">★★★★★</span></span><span>61M nutrients analyzed</span><span className="hidden sm:block">Built with nutrition science</span></div></section>

      <section id="how" className="px-5 py-24 sm:px-8 sm:py-32 lg:px-10"><div className="mx-auto max-w-[1240px]"><div className="max-w-[570px]"><p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-[#039855]">The simple version</p><h2 className="text-4xl font-bold leading-[1.02] tracking-[-.055em] sm:text-6xl">Point. Scan. <span className="text-[#039855]">Understand.</span></h2><p className="mt-5 text-base leading-7 text-[#5b6e67]">No spreadsheets. No guilt. Just a calm, clear read on the food in front of you.</p></div><div className="mt-14 grid gap-4 md:grid-cols-3"><div className="rounded-[28px] bg-[#052e1f] p-7 text-white sm:p-9"><div className="mb-16 text-5xl font-bold tracking-[-.07em] text-[#b6f09c]">01</div><ScanLine className="mb-5 size-7 text-[#b6f09c]" /><h3 className="text-2xl font-bold">Point your camera</h3><p className="mt-3 text-sm leading-6 text-[#b5cfc2]">Barcode, label, or plate. Nutrition Scan sees the whole picture.</p></div><div className="rounded-[28px] border border-[#dce9e1] bg-white p-7 shadow-[0_18px_45px_rgba(7,17,13,.05)] sm:p-9"><div className="mb-16 text-5xl font-bold tracking-[-.07em] text-[#b6d9c1]">02</div><Sparkles className="mb-5 size-7 text-[#7a5af8]" /><h3 className="text-2xl font-bold">AI reads the details</h3><p className="mt-3 text-sm leading-6 text-[#5b6e67]">Ingredients, nutrients, additives, and allergens — decoded in seconds.</p></div><div className="rounded-[28px] border border-[#dce9e1] bg-[#ecfdf3] p-7 sm:p-9"><div className="mb-16 text-5xl font-bold tracking-[-.07em] text-[#a1d9af]">03</div><Leaf className="mb-5 size-7 text-[#039855]" /><h3 className="text-2xl font-bold">Make a better choice</h3><p className="mt-3 text-sm leading-6 text-[#416052]">See the score, understand why, and find a swap that fits your life.</p></div></div></div></section>

      <section id="features" className="bg-[#052e1f] px-5 py-24 text-white sm:px-8 sm:py-32 lg:px-10"><div className="mx-auto max-w-[1240px]"><div className="flex flex-col justify-between gap-8 md:flex-row md:items-end"><div className="max-w-[600px]"><p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-[#6ce9a6]">Everything in one scan</p><h2 className="text-4xl font-bold leading-[1.02] tracking-[-.055em] sm:text-6xl">Clarity you can <span className="text-[#b6f09c]">feel.</span></h2></div><p className="max-w-[330px] text-sm leading-6 text-[#a9c2b5]">Designed for real life — from grocery aisles to kitchen counters to your 6am training session.</p></div><div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{features.map(({ icon: Icon, title, copy, tone, big }) => <div key={title} className={`${big ? 'min-h-[250px]' : 'min-h-[210px]'} group relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[.06] p-6 transition hover:-translate-y-1 hover:border-[#6ce9a6]/50 hover:bg-white/[.1]`}><div className={`mb-12 grid size-11 place-items-center rounded-2xl ${tone === 'purple' ? 'bg-[#e7e1ff] text-[#6447da]' : tone === 'orange' ? 'bg-[#ffe5d3] text-[#d95a0a]' : tone === 'blue' ? 'bg-[#dceeff] text-[#1774c8]' : 'bg-[#d9f8e4] text-[#078b4e]'}`}><Icon className="size-5" /></div><h3 className="text-xl font-bold">{title}</h3><p className="mt-2 max-w-[230px] text-sm leading-6 text-[#a9c2b5]">{copy}</p><ArrowRight className="absolute bottom-6 right-6 size-5 text-[#6ce9a6] opacity-0 transition group-hover:opacity-100" /></div>)}</div></div></section>

      <section id="app" className="px-5 py-24 sm:px-8 sm:py-32 lg:px-10"><div className="mx-auto grid max-w-[1240px] items-center gap-12 rounded-[34px] bg-[#dff7e6] p-7 sm:p-12 lg:grid-cols-[1fr_1fr] lg:p-16"><div><p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-[#039855]">Your everyday dashboard</p><h2 className="text-4xl font-bold leading-[1.03] tracking-[-.06em] sm:text-6xl">Small scans.<br /><span className="text-[#039855]">Big trends.</span></h2><p className="mt-5 max-w-[440px] text-base leading-7 text-[#416052]">Your diary turns quick decisions into a picture of what makes you feel your best. Start with today&apos;s scan and build from there.</p><a href="/app/scan" className="mt-8 inline-block rounded-full bg-[#052e1f] px-5 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 active:scale-95">Try the app <ArrowRight className="ml-2 inline size-4" /></a></div><div className="rounded-[26px] border border-white/70 bg-white/80 p-5 shadow-[0_20px_55px_rgba(5,46,31,.08)] backdrop-blur"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold text-[#5b6e67]">Tuesday, October 8</p><h3 className="mt-1 text-xl font-bold">Good morning, Maya</h3></div><div className="grid size-10 place-items-center rounded-full bg-[#ecfdf3] text-[#039855]"><Droplets className="size-5" /></div></div><div className="mt-7 flex items-center gap-5"><ScoreRing score={82} small /><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#5b6e67]">Today&apos;s score</p><p className="mt-2 text-sm leading-6 text-[#2a3b35]">You&apos;re making choices<br /><span className="font-bold text-[#039855]">that support your goals.</span></p></div></div><div className="mt-7 grid grid-cols-3 gap-2">{[['Protein','84g','green'],['Fiber','19g','purple'],['Water','1.4L','blue']].map(([label, value, tone]) => <div key={label} className="rounded-2xl bg-[#f6faf8] p-3"><div className="text-[10px] font-semibold text-[#81918a]">{label}</div><div className={`mt-1 font-mono text-sm font-bold ${tone === 'purple' ? 'text-[#7a5af8]' : tone === 'blue' ? 'text-[#2e90fa]' : 'text-[#039855]'}`}>{value}</div></div>)}</div><div className="mt-5 flex items-center justify-between border-t border-[#e3ebe7] pt-4 text-xs"><span className="font-semibold text-[#5b6e67]">Weekly consistency</span><span className="font-bold text-[#039855]">+18%</span><BarChart3 className="size-4 text-[#12b76a]" /></div></div></div></section>

      <footer id="insights" className="border-t border-[#dce9e1] px-5 py-10 sm:px-8 lg:px-10"><div className="mx-auto flex max-w-[1240px] flex-col gap-8 sm:flex-row sm:items-center sm:justify-between"><Logo /><div className="flex flex-wrap gap-5 text-xs font-semibold text-[#5b6e67]"><a href="#how">How it works</a><a href="#features">Features</a><a href="#app">Your dashboard</a><a href="mailto:hello@nutritionscan.app">Support</a></div><p className="text-xs text-[#81918a]">© 2026 Nutrition Scan. Educational, not medical advice.</p></div></footer>
    </main>
  )
}
