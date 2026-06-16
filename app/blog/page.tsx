import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import { formatPostDate, getAllPosts } from '@/lib/blog'
import { createWebPageJsonLd } from '@/lib/seo'

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <>
      <JsonLd
        data={createWebPageJsonLd({
          title: 'Environmental Remediation Insights',
          description:
            'Research notes and field guides on mercury remediation, water security, artisanal gold mining, tailings recovery, and land regeneration.',
          path: '/blog',
        })}
      />
      <section className="pt-44 pb-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-20%,rgba(0,212,170,0.07),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="section-label">Research Library</p>
            <h1 className="section-heading mb-6">Environmental Remediation Insights</h1>
            <div className="gold-line" />
            <p className="text-gray-400 text-lg leading-relaxed">
              Practical articles on mercury recovery, water security, land regeneration, mining-affected
              communities, and the standards shaping responsible remediation work.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-navy-mid border-t border-navy-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="card group border border-navy-border transition-all duration-300 hover:border-gold/40 hover:shadow-[0_0_24px_rgba(201,168,76,0.06)]"
              >
                <p className="mb-4 text-xs uppercase tracking-[0.18em] text-gray-500">
                  {formatPostDate(post.date)}{' '}
                  <span className="text-gray-700">|</span> {post.readingTime}
                </p>
                <h2 className="mb-4 text-2xl font-display font-bold leading-tight text-white transition-colors group-hover:text-gold">
                  {post.title}
                </h2>
                <p className="mb-5 text-sm leading-relaxed text-gray-400">{post.description}</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-sm border border-teal/20 bg-teal/10 px-2 py-1 text-[0.65rem] font-medium uppercase tracking-wider text-teal"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
