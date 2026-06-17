import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import { formatPostDate, getAllPosts, getPost, markdownToHtml } from '@/lib/blog'
import { createPageMetadata, createWebPageJsonLd, siteName, siteUrl } from '@/lib/seo'

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug)
  if (!post) {
    return createPageMetadata({
      title: 'Environmental Remediation Insight',
      description: 'Environmental remediation article from Global Mercury Recovery & Water Security.',
      path: `/blog/${params.slug}`,
    })
  }

  return createPageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
  })
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug)
  if (!post) notFound()

  const url = `${siteUrl}/blog/${post.slug}`

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          dateModified: post.date,
          author: {
            '@type': 'Person',
            name: post.author || 'Matt Dunn',
            jobTitle: 'Chief Technical Officer',
            worksFor: { '@type': 'Organization', name: siteName, url: siteUrl },
          },
          publisher: { '@type': 'Organization', name: siteName, url: siteUrl },
          mainEntityOfPage: url,
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Insights', item: `${siteUrl}/blog` },
            { '@type': 'ListItem', position: 3, name: post.title, item: url },
          ],
        }}
      />
      <JsonLd
        data={createWebPageJsonLd({
          title: post.title,
          description: post.description,
          path: `/blog/${post.slug}`,
        })}
      />
      <article className="bg-navy">
        <header className="pt-44 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-20%,rgba(201,168,76,0.06),transparent)]" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/blog"
              className="mb-10 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 transition-colors hover:text-gold"
            >
              <span>←</span>
              Insights
            </Link>
            <p className="section-label">Environmental Remediation</p>
            <h1 className="text-3xl font-display font-bold leading-tight text-white sm:text-5xl">
              {post.title}
            </h1>
            <div className="gold-line" />
            <p className="max-w-3xl text-lg leading-relaxed text-gray-400">{post.description}</p>
            <p className="mt-6 text-xs uppercase tracking-[0.18em] text-gray-600">
              {formatPostDate(post.date, true)}{' '}
              | {post.readingTime}
              {post.author && ` | By ${post.author}, Chief Technical Officer`}
            </p>
          </div>
        </header>

        <section className="border-t border-navy-border bg-navy-mid py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="blog-body"
              dangerouslySetInnerHTML={{ __html: markdownToHtml(post.body) }}
            />
          </div>
        </section>
      </article>
    </>
  )
}
