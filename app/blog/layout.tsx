import type { Metadata } from 'next'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Environmental Remediation Insights',
  description:
    'Research notes and field guides on mercury remediation, water security, artisanal gold mining, tailings recovery, and land regeneration.',
  path: '/blog',
})

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
