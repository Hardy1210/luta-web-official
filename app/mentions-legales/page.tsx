import type { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'TITRE_MENTIONS_LEGALES',
  description: 'DESCRIPTION_MENTIONS_LEGALES',
  slug: 'mentions-legales',
})

export default function MentionsLegalesPage() {
  return (
    <main>
      <h1>TITRE_MENTIONS_LEGALES</h1>
    </main>
  )
}
