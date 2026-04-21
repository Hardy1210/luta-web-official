import type { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'TITRE_A_PROPOS',
  description: 'DESCRIPTION_A_PROPOS',
  slug: 'a-propos',
})

export default function AProposPage() {
  return (
    <main>
      <h1>TITRE_A_PROPOS</h1>
    </main>
  )
}
