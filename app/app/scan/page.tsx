'use client'

import Link from 'next/link'
import { ArrowLeft, Camera, Check, Leaf, RotateCcw, ScanLine, Sparkles, Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { AppBottomNav } from '@/components/app-bottom-nav'

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [done, setDone] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)

  useEffect(() => {
    return () => streamRef.current?.getTracks().forEach((track) => track.stop())
  }, [])

  useEffect(() => {
    if (cameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
    }
  }, [cameraOpen])

  const openCamera = async () => {
    setCameraError(null)
    setDone(false)
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera access is not available in this browser.')
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false })
      streamRef.current = stream
      setCameraOpen(true)
    } catch {
      setCameraError('Camera access was blocked. Allow camera permissions, then try again.')
    }
  }

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setCameraOpen(false)
  }

  const captureImage = () => {
    const video = videoRef.current
    if (!video || video.readyState < 2) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height)
    setCapturedImage(canvas.toDataURL('image/jpeg', 0.88))
    closeCamera()
    setScanning(true)
    window.setTimeout(() => { setScanning(false); setDone(true) }, 1800)
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setCapturedImage(String(reader.result))
      setScanning(true)
      window.setTimeout(() => { setScanning(false); setDone(true) }, 1800)
    }
    reader.readAsDataURL(file)
  }

  const resetScan = () => { setCapturedImage(null); setDone(false); setScanning(false) }

  return (
    <main className="min-h-screen bg-[#f6faf8] pb-24 text-[#07110d]">
      <header className="border-b border-[#e3ebe7] bg-white/80">
        <div className="mx-auto flex h-[70px] max-w-[900px] items-center justify-between px-4 sm:px-8">
          <Link href="/app" className="inline-flex items-center gap-2 text-sm font-bold text-[#5b6e67]"><ArrowLeft className="size-4" /> Dashboard</Link>
          <div className="flex items-center gap-2 text-sm font-bold"><span className="grid size-8 place-items-center rounded-xl bg-[#052e1f] text-[#b6f09c]"><Leaf className="size-4" /></span> NutritionScan</div>
        </div>
      </header>
      <div className="mx-auto max-w-[900px] px-4 py-10 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-xl text-center"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#039855]">New scan</p><h1 className="mt-4 text-4xl font-bold tracking-[-.06em] sm:text-6xl">What are you eating?</h1><p className="mt-4 text-base leading-7 text-[#5b6e67]">Point your camera at a barcode, ingredient label, or meal. We&apos;ll make the details easy to understand.</p></div>
        <div className="mx-auto mt-10 max-w-md rounded-[34px] bg-[#052e1f] p-3 shadow-[0_25px_70px_rgba(5,46,31,.2)]">
          <div className="relative flex aspect-[.8] flex-col items-center justify-center overflow-hidden rounded-[26px] bg-[#dff7e6] p-6 text-center">
            {cameraOpen ? <video ref={videoRef} autoPlay muted playsInline className="absolute inset-0 size-full object-cover" aria-label="Live camera preview" /> : capturedImage ? <img src={capturedImage} alt="Captured food label" className="absolute inset-0 size-full object-cover" /> : null}
            <div className="absolute inset-5 rounded-[24px] border-2 border-dashed border-[#039855]/50" />
            {!cameraOpen && <><div className="relative grid size-20 place-items-center rounded-[28px] bg-white/80 text-[#039855] shadow-xl">{scanning ? <ScanLine className="size-9 animate-pulse" /> : done ? <Check className="size-9" /> : <Camera className="size-9" />}</div><h2 className="relative mt-6 text-xl font-bold">{scanning ? 'Reading your label…' : done ? 'Scan complete' : capturedImage ? 'Captured image' : 'Ready when you are'}</h2><p className="relative mt-2 max-w-xs text-sm leading-6 text-[#416052]">{scanning ? 'Checking ingredients, nutrients, and allergens.' : done ? 'We found a high-fiber choice with low added sugar.' : capturedImage ? 'Your photo is ready for analysis.' : 'Hold the product inside the frame for the clearest result.'}</p></>}
            {cameraOpen && <div className="absolute bottom-6 left-0 right-0 flex justify-center"><button type="button" onClick={captureImage} className="grid size-16 place-items-center rounded-full border-4 border-white bg-[#b6f09c] text-[#052e1f] shadow-xl" aria-label="Capture image"><Camera className="size-7" /></button></div>}
          </div>
          {cameraError && <p role="alert" className="px-3 pt-3 text-center text-sm text-[#ffb4a8]">{cameraError}</p>}
          <div className="flex flex-col gap-3 p-3 sm:flex-row">
            {!cameraOpen && !capturedImage && <button type="button" onClick={openCamera} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#b6f09c] px-5 text-sm font-bold text-[#052e1f] transition hover:bg-[#d4ffbf]"><Camera className="size-4" /> Start camera scan</button>}
            {!cameraOpen && !capturedImage && <label className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-white/20 px-5 text-sm font-bold text-white"><Upload className="size-4" /> Use a photo<input type="file" accept="image/*" capture="environment" onChange={handlePhotoUpload} className="sr-only" /></label>}
            {cameraOpen && <button type="button" onClick={closeCamera} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-white/20 px-5 text-sm font-bold text-white">Cancel camera</button>}
            {capturedImage && !scanning && <button type="button" onClick={resetScan} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#b6f09c] px-5 text-sm font-bold text-[#052e1f]"><RotateCcw className="size-4" /> Scan another</button>}
          </div>
        </div>
        <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-6 text-xs font-semibold text-[#6b8178]"><span className="inline-flex items-center gap-2"><Sparkles className="size-4 text-[#039855]" /> AI-powered analysis</span><span className="inline-flex items-center gap-2"><Upload className="size-4 text-[#039855]" /> Photo stays private</span></div>
      </div>
      <AppBottomNav />
    </main>
  )
}
