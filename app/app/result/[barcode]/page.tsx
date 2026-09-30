import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { byBarcode } from '@/lib/data/products'
import { scoreProduct } from '@/lib/score'
import { FAMILY_PROFILE } from '@/lib/data/fixtures'
import { ResultScreen } from '@/components/screens/result-screen'

/**
 * Result screen — the money screen. Server-rendered so the product data, the
 * score and the JSON-LD are in the initial HTML, then hydrated for motion and
 * interactivity.
 */

export async function generateStaticParams() {
  const { PRODUCTS } = await import('@/lib/data/products')
  return PRODUCTS.map((p) => ({ barcode: p.barcode }))
}

export async function generateMetadata({ params }: { params: Promise<{ barcode: string }> }): Promise<Metadata> {
  const { barcode } = await params
  const product = byBarcode(barcode)
  if (!product) return { title: 'Product not found' }
  const score = scoreProduct(product, FAMILY_PROFILE)
  return {
    title: `${product.name} — score ${score.score}/100`,
    description: `${product.name} by ${product.brand}: nutrition score ${score.score}/100 (${score.grade}). ${score.verdict}`,
    alternates: { canonical: `/app/result/${product.barcode}` },
  }
}

export default async function ResultPage({ params }: { params: Promise<{ barcode: string }> }) {
  const { barcode } = await params
  const product = byBarcode(barcode)
  if (!product) notFound()

  const score = scoreProduct(product, FAMILY_PROFILE)

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    brand: { '@type': 'Brand', name: product.brand },
    gtin13: product.barcode,
    description: product.ingredients.map((i) => i.name).join(', '),
    nutrition: {
      '@type': 'NutritionInformation',
      servingSize: product.servingSize,
      calories: `${product.per100g.kcal} kcal`,
      proteinContent: `${product.per100g.protein} g`,
      carbohydrateContent: `${product.per100g.carbs} g`,
      sugarContent: `${product.per100g.sugar} g`,
      fatContent: `${product.per100g.fat} g`,
      fiberContent: `${product.per100g.fiber} g`,
      sodiumContent: `${product.per100g.sodium} mg`,
    },
  }

  return (
    <>
      <ResultScreen product={product} score={score} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
    </>
  )
}
