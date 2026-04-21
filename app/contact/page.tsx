import type { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'TITRE_CONTACT',
  description: 'DESCRIPTION_CONTACT',
  slug: 'contact',
})

export default function ContactPage() {
  return (
    <main>
      <h1>TITRE_CONTACT</h1>
    </main>
  )
}
