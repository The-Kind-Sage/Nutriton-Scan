import type { Metadata } from 'next'
import { ScanScreen } from '@/components/screens/scan-screen'

export const metadata: Metadata = {
  title: 'Scan a product',
  description: 'Point your camera at a barcode, an ingredient label or a meal. Works with camera access, and in demo mode without it.',
}

export default function ScanPage() {
  return <ScanScreen />
}
