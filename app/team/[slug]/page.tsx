import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { team, getTeamMember } from '@/lib/team'
import { createPageMetadata, createWebPageJsonLd } from '@/lib/seo'
import TeamMemberView from './TeamMemberView'

export function generateStaticParams() {
  return team.map((m) => ({ slug: m.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const member = getTeamMember(params.slug)
  if (!member) {
    return createPageMetadata({
      title: 'Leadership Profile',
      description: 'Leadership update for Global Mercury Recovery & Water Security.',
      path: `/team/${params.slug}`,
    })
  }

  const metadata = createPageMetadata({
    title: 'Leadership Profile Under Review',
    description:
      'Global Mercury Recovery & Water Security is currently undergoing a leadership restructuring. Updated team information will be published after the operating structure is finalized.',
    path: `/team/${member.slug}`,
  })

  return {
    ...metadata,
    robots: {
      index: false,
      follow: true,
    },
  }
}

export default function TeamMemberPage({ params }: { params: { slug: string } }) {
  const member = getTeamMember(params.slug)
  if (!member) notFound()

  const seo = {
    title: 'Leadership Profile Under Review',
    description:
      'Global Mercury Recovery & Water Security is currently undergoing a leadership restructuring. Updated team information will be published after the operating structure is finalized.',
    path: `/team/${member.slug}`,
  }

  return (
    <>
      <JsonLd data={createWebPageJsonLd(seo)} />
      <TeamMemberView />
    </>
  )
}
