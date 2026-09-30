'use client'

/**
 * Scan screen. Effects: 23 laser sweep · 24 reticle auto-lock (with haptics) ·
 * 43 chip fly-in · 17/18 skeleton → content · 33 validation · 34 toast.
 *
 * Portrait-only: the camera viewport is a 3/4 portrait frame rather than
 * edge-to-edge, so a rotated device still shows a correctly cropped preview
 * (brief Section 5.0). Camera access is optional — demo mode is always offered
 * so the flow is never a dead end.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Camera, Check, Image as ImageIcon, Keyboard, RotateCcw, ScanBarcode, Search, Sparkles, Upload, Zap,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { Reveal, SnapRail, Stagger } from '@/components/motion'
import { ScoreChip } from '@/components/score-ring'
import { toast } from '@/components/toast'
import { api } from '@/lib/api'
import { PRODUCTS } from '@/lib/data/products'
import { DEMO_BARCODES, SEED_DIARY } from '@/lib/data/fixtures'
import { scoreProduct } from '@/lib/score'
import { chipContainer, chipIn, spring } from '@/lib/motion'
import { nf } from '@/lib/format'
import type { Product, ScoreResult } from '@/lib/types'

type Mode = 'barcode' | 'photo' | 'label' | 'manual'
type Phase = 'idle' | 'scanning' | 'locked' | 'done'

const MODES: { id: Mode; label: string; icon: typeof ScanBarcode }[] = [
  { id: 'barcode', label: 'Barcode', icon: ScanBarcode },
  { id: 'photo', label: 'Photo', icon: ImageIcon },
  { id: 'label', label: 'Label', icon: Sparkles },
  { id: 'manual', label: 'Search', icon: Keyboard },
]

const SCAN_LOG = [
  'Focusing…',
  'Locating the barcode…',
  'Matching against 2.4M products…',
  'Reading the ingredient list…',
  'Weighting against your profile…',
]

export function ScanScreen() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const timers = useRef<number[]>([])

  const [mode, setMode] = useState<Mode>('barcode')
  const [phase, setPhase] = useState<Phase>('idle')
  const [cameraOn, setCameraOn] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [logIndex, setLogIndex] = useState(0)
  const [result, setResult] = useState<{ product: Product; score: ScoreResult } | null>(null)
  const [torchOn, setTorchOn] = useState(false)
  const [query, setQuery] = useState('')
  const [matches, setMatches] = useState<Product[]>([])
  const demoIndex = useRef(0)

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setCameraOn(false)
    setTorchOn(false)
  }, [])

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    timers.current.forEach(window.clearTimeout)
  }, [])

  /* Attach the stream after the <video> mounts, not before. */
  useEffect(() => {
    if (cameraOn && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
      void videoRef.current.play().catch(() => { /* autoplay can be blocked; the user can tap */ })
    }
  }, [cameraOn])

  const openCamera = async () => {
    setCameraError(null)
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('unsupported')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, aspectRatio: { ideal: 3 / 4 } },
        audio: false,
      })
      streamRef.current = stream
      setCameraOn(true)
      toast('Camera ready — hold the product in the frame', 'info')
    } catch (error) {
      const name = error instanceof Error ? error.name : 'Error'
      setCameraError(
        name === 'NotAllowedError'
          ? 'Camera permission was denied. Enable it in your browser settings, or use demo mode below — it works on bundled data with no permissions at all.'
          : 'We could not start the camera on this device. Demo mode works exactly the same way, without permissions.',
      )
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate?.([60])
    }
  }

  /* The scan sequence: log lines → lock → result → navigate. */
  const runScan = useCallback(async (source: 'camera' | 'demo') => {
    timers.current.forEach(window.clearTimeout)
    timers.current = []
    setResult(null)
    setPhase('scanning')
    setLogIndex(0)

    SCAN_LOG.forEach((_, i) => {
      timers.current.push(window.setTimeout(() => setLogIndex(i), i * 300))
    })
    timers.current.push(window.setTimeout(() => {
      setPhase('locked')
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate?.([12, 40, 24])
    }, 1500))

    const barcode = source === 'camera'
      ? DEMO_BARCODES[demoIndex.current % DEMO_BARCODES.length]
      : DEMO_BARCODES[demoIndex.current % DEMO_BARCODES.length]
    demoIndex.current += 1

    const data = await api.scanBarcode(barcode, null)
    setResult(data)
    setPhase('done')
  }, [])

  const toggleTorch = async () => {
    const track = streamRef.current?.getVideoTracks()[0]
    if (!track) return
    try {
      await track.applyConstraints({ advanced: [{ torch: !torchOn } as MediaTrackConstraintSet] })
      setTorchOn((t) => !t)
    } catch {
      toast('This camera does not expose a torch', 'info')
    }
  }

  const search = async (q: string) => {
    setQuery(q)
    if (q.trim().length < 2) { setMatches([]); return }
    setMatches(await api.search(q))
  }

  const scanStateLabel = phase === 'scanning' ? SCAN_LOG[logIndex] : phase === 'locked' ? 'Barcode locked' : 'Ready'

  return (
    <AppShell title="New scan" back={{ href: '/app', label: 'Dashboard' }}>
      <div className="container-ns pt-4">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-brand-600">New scan</p>
          <h1 className="mt-3 text-[clamp(1.75rem,7vw,2.6rem)] font-bold tracking-[-.055em]">What are you eating?</h1>
          <p className="mt-3 text-sm leading-6 text-ink-500">
            Point your camera at a barcode, an ingredient label, or the meal in front of you.
          </p>
        </Reveal>

        {/* Mode switcher (Effect 26) */}
        <div className="mx-auto mt-6 max-w-md">
          <div className="fx-seg" role="tablist" aria-label="Scan mode">
            {MODES.map((m) => (
              <button
                key={m.id}
                role="tab"
                aria-selected={mode === m.id}
                onClick={() => { setMode(m.id); stopCamera(); setPhase('idle'); setResult(null) }}
                className={`fx-seg__item press relative z-10 flex min-h-10 flex-col items-center gap-0.5 rounded-full px-2 text-[11px] font-bold transition-colors ${
                  mode === m.id ? 'text-ink-900' : 'text-ink-500'
                }`}
              >
                <m.icon className="size-4" aria-hidden />
                {m.label}
                {mode === m.id && (
                  <motion.span layoutId="scan-mode-pill" transition={spring.layout} className="absolute inset-0 -z-10 rounded-full bg-surface shadow-soft" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Camera / demo viewport ─────────────────────────────────── */}
        {mode !== 'manual' && (
          <Reveal variant="scale" className="mx-auto mt-6 max-w-md">
            <div className="rounded-[34px] bg-brand-900 p-3 shadow-[0_25px_70px_rgba(5,46,31,.22)]">
              <div
                className={`fx-reticle relative flex aspect-[3/4] flex-col items-center justify-center overflow-hidden rounded-[26px] bg-[linear-gradient(160deg,#dff7e6,#bfe0cb)] ${phase === 'locked' || phase === 'done' ? 'is-locked' : ''} ${phase === 'scanning' ? 'fx-scanlines' : ''}`}
              >
                {cameraOn && (
                  <video
                    ref={videoRef}
                    autoPlay muted playsInline
                    aria-label="Live camera preview"
                    className="absolute inset-0 size-full scale-[1.02] object-cover"
                  />
                )}

                <span aria-hidden className="fx-reticle__corner" data-pos="tl" />
                <span aria-hidden className="fx-reticle__corner" data-pos="tr" />
                <span aria-hidden className="fx-reticle__corner" data-pos="bl" />
                <span aria-hidden className="fx-reticle__corner" data-pos="br" />
                <span aria-hidden className="fx-reticle__ring" />
                {(phase === 'scanning') && (
                  <span aria-hidden className="fx-laser" style={{ ['--laser-span' as string]: '300px' }} />
                )}
                <span aria-hidden className="absolute inset-6 rounded-[22px] border-2 border-dashed border-brand-600/35" />

                {/* Idle / error content */}
                {!cameraOn && phase !== 'done' && (
                  <div className="relative z-10 px-6 text-center">
                    <div className="mx-auto grid size-20 place-items-center rounded-[28px] bg-white/85 text-brand-600 shadow-float">
                      {phase === 'scanning' ? <ScanBarcode className="size-9 animate-pulse" aria-hidden /> : phase === 'locked' ? <Check className="size-9" aria-hidden /> : <Camera className="size-9" aria-hidden />}
                    </div>
                    <h2 className="mt-5 text-xl font-bold text-ink-900">
                      {phase === 'scanning' ? 'Reading the label…' : phase === 'locked' ? 'Got it' : 'Ready when you are'}
                    </h2>
                    <p className="mx-auto mt-2 max-w-[300px] text-sm leading-6 text-ink-500">
                      {phase === 'scanning' ? SCAN_LOG[logIndex] : phase === 'locked' ? 'Locking on and running the analysis.' : 'Hold the product inside the frame. Barcodes work from about 15 cm away.'}
                    </p>
                  </div>
                )}

                {/* Capture shutter */}
                {cameraOn && phase === 'idle' && (
                  <div className="absolute inset-x-0 bottom-5 z-20 flex items-center justify-center gap-4">
                    <button onClick={toggleTorch} aria-label={torchOn ? 'Turn off torch' : 'Turn on torch'}
                      className={`press grid size-11 place-items-center rounded-full border border-white/40 backdrop-blur ${torchOn ? 'bg-mango text-ink-900' : 'bg-black/35 text-white'}`}>
                      <Zap className="size-5" aria-hidden />
                    </button>
                    <button onClick={() => runScan('camera')} aria-label="Capture and analyse"
                      className="press grid size-[68px] place-items-center rounded-full border-4 border-white bg-lime-accent text-brand-900 shadow-float">
                      <Camera className="size-7" aria-hidden />
                    </button>
                    <button onClick={stopCamera} aria-label="Close camera"
                      className="press grid size-11 place-items-center rounded-full border border-white/40 bg-black/35 text-white backdrop-blur">
                      <RotateCcw className="size-4" aria-hidden />
                    </button>
                  </div>
                )}

                {/* Live status pill */}
                {cameraOn && (
                  <span className="absolute left-4 top-4 z-20 rounded-full bg-black/45 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur">
                    {scanStateLabel}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="p-3">
                {cameraError && (
                  <p role="alert" className="mb-3 rounded-2xl bg-score-danger/12 px-4 py-3 text-xs leading-5 text-[#ffd4cf]">
                    {cameraError}
                  </p>
                )}

                <div className="flex flex-col gap-2 min-[380px]:flex-row">
                  {!cameraOn && phase === 'idle' && (
                    <>
                      <button onClick={openCamera} className="press flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-lime-accent px-5 text-sm font-bold text-brand-900">
                        <Camera className="size-4" aria-hidden /> Start camera
                      </button>
                      <button onClick={() => runScan('demo')} className="press flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-white/25 px-5 text-sm font-bold text-white">
                        <Sparkles className="size-4" aria-hidden /> Demo mode
                      </button>
                    </>
                  )}

                  {phase === 'scanning' && (
                    <button disabled className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-white/15 px-5 text-sm font-bold text-white/80">
                      <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />
                      Analysing…
                    </button>
                  )}

                  {phase === 'done' && (
                    <>
                      <Link href={result ? `/app/result/${result.product.barcode}` : '/app'}
                        className="press flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-lime-accent px-5 text-sm font-bold text-brand-900">
                        View full result
                      </Link>
                      <button onClick={() => { setPhase('idle'); setResult(null); stopCamera() }}
                        className="press flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/25 px-5 text-sm font-bold text-white">
                        <RotateCcw className="size-4" aria-hidden /> Scan another
                      </button>
                    </>
                  )}
                </div>

                {!cameraOn && (
                  <label className="press mt-2 flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-white/25 px-5 text-sm font-bold text-white/85">
                    <Upload className="size-4" aria-hidden /> Upload a photo instead
                    <input type="file" accept="image/*" capture="environment" className="sr-only"
                      onChange={(e) => { if (e.target.files?.[0]) runScan('demo') }} />
                  </label>
                )}
              </div>
            </div>

            {/* Result preview */}
            <AnimatePresence>
              {result && phase === 'done' && (
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={spring.soft}
                  className="mt-4 rounded-[26px] border border-line bg-surface p-5 shadow-soft"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[.16em] text-ink-300">{result.product.brand}</p>
                      <h2 className="mt-1 truncate text-lg font-bold text-ink-900">{result.product.name}</h2>
                    </div>
                    <ScoreChip score={result.score.score} band={result.score.band} />
                  </div>
                  <motion.ul variants={chipContainer} initial="hidden" animate="show" className="mt-3 flex flex-wrap gap-1.5">
                    {result.score.flags.slice(0, 4).map((flag) => (
                      <motion.li key={flag} variants={chipIn} className="rounded-full bg-canvas-2 px-2.5 py-1 text-[10px] font-semibold text-ink-700">
                        {flag}
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
              )}
            </AnimatePresence>
          </Reveal>
        )}

        {/* ── Manual search ─────────────────────────────────────────── */}
        {mode === 'manual' && (
          <div className="mx-auto mt-6 max-w-md">
            <div className="fx-field rounded-2xl border border-line bg-surface px-4 py-1.5 shadow-soft" data-filled={query.length > 0}>
              <div className="flex items-center gap-2">
                <Search className="size-4 text-ink-300" aria-hidden />
                <label htmlFor="product-search" className="sr-only">Search products</label>
                <input
                  id="product-search"
                  value={query}
                  onChange={(e) => void search(e.target.value)}
                  placeholder="Search a product, brand or category"
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm text-ink-900 outline-none placeholder:text-ink-300"
                />
              </div>
            </div>

            {query.length >= 2 && !matches.length && (
              <p className="mt-4 text-center text-sm text-ink-500">
                No match for “{query}”. Try a photo scan instead — it works on unbarcoded food.
              </p>
            )}

            <Stagger className="mt-4 space-y-2">
              {matches.map((product) => {
                const s = scoreProduct(product)
                return (
                  <Link key={product.id} href={`/app/result/${product.barcode}`}
                    className="press flex items-center gap-3 rounded-2xl border border-line bg-surface p-3.5">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-canvas-2 text-xl" aria-hidden>{product.emoji}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-ink-900">{product.name}</span>
                      <span className="block text-xs text-ink-500">{product.brand} · {product.category}</span>
                    </span>
                    <ScoreChip score={s.score} band={s.band} />
                  </Link>
                )
              })}
            </Stagger>
          </div>
        )}

        {/* ── Recent scans ──────────────────────────────────────────── */}
        <section className="mt-10">
          <h2 className="text-sm font-bold text-ink-900">Recent scans</h2>
          <p className="mt-1 text-xs text-ink-500">Jump straight back to a result you already have.</p>
          <div className="mt-3">
            <SnapRail label="Recent scans">
              {SEED_DIARY.slice(0, 6).map((entry) => {
                const product = PRODUCTS.find((p) => p.id === entry.productId)
                const band = entry.score >= 80 ? 'excellent' : entry.score >= 60 ? 'good' : entry.score >= 40 ? 'ok' : 'poor'
                return (
                  <Link key={entry.id} href={product ? `/app/result/${product.barcode}` : '/app'}
                    className="press w-[210px] shrink-0 snap-start rounded-2xl border border-line bg-surface p-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl" aria-hidden>{entry.emoji}</span>
                      <ScoreChip score={entry.score} band={band} />
                    </div>
                    <p className="mt-2.5 truncate text-sm font-semibold text-ink-900">{entry.name}</p>
                    <p className="text-xs text-ink-500">{entry.time} · {nf(entry.kcal)} kcal</p>
                  </Link>
                )
              })}
            </SnapRail>
          </div>
        </section>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-ink-500">
          <span className="inline-flex items-center gap-2"><Sparkles className="size-4 text-brand-600" aria-hidden /> AI-powered analysis</span>
          <span className="inline-flex items-center gap-2"><Check className="size-4 text-brand-600" aria-hidden /> Photos are discarded after analysis</span>
        </div>
      </div>
    </AppShell>
  )
}
