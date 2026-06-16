import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'
import { siteUrl } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/technology', '/impact', '/about', '/funding', '/contact', '/blog'].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }))

  const blogRoutes = getAllPosts().map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }))

  return [...staticRoutes, ...blogRoutes]
}
