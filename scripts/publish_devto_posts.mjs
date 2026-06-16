#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const contentDir = path.join(root, 'content', 'blog')
const generatedSlugsPath = path.join(root, 'scripts', 'generated_blog_slugs.txt')
const lastSlugPath = path.join(root, 'scripts', 'last_generated_blog_slug.txt')
const siteUrl = process.env.SITE_URL || 'https://globalmercuryrecovery.com'
const publishPosts = process.env.DEV_TO_PUBLISHED !== 'false'

const accounts = [
  {
    name: 'devto-1',
    apiKey: process.env.DEV_TO_API_KEY_1,
    maxPosts: Number(process.env.DEV_TO_ACCOUNT_1_DAILY_LIMIT || 2),
  },
  {
    name: 'devto-2',
    apiKey: process.env.DEV_TO_API_KEY_2,
    maxPosts: Number(process.env.DEV_TO_ACCOUNT_2_DAILY_LIMIT || 2),
  },
].filter((account) => account.apiKey)

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) throw new Error('Post is missing frontmatter.')

  const frontmatter = {}
  match[1].split('\n').forEach((line) => {
    const pair = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (!pair) return
    const key = pair[1]
    let value = pair[2].trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    frontmatter[key] = value
  })

  const tags = match[1].match(/^tags:\s*\[([^\]]*)\]/m)?.[1]
  if (tags) {
    frontmatter.tags = tags
      .split(',')
      .map((tag) => tag.trim().replace(/^["']|["']$/g, ''))
      .filter(Boolean)
  }

  return { frontmatter, body: match[2].trim() }
}

function sanitizeTags(tags) {
  const source = Array.isArray(tags) && tags.length > 0 ? tags : ['sustainability', 'water', 'mining']
  return source
    .map((tag) => tag.toLowerCase().replace(/[^a-z0-9]/g, ''))
    .filter((tag) => tag.length >= 2 && tag.length <= 30)
    .slice(0, 4)
}

function readSlugs() {
  const sourcePath = fs.existsSync(generatedSlugsPath) ? generatedSlugsPath : lastSlugPath
  if (!fs.existsSync(sourcePath)) return []

  return fs
    .readFileSync(sourcePath, 'utf8')
    .split('\n')
    .map((slug) => slug.trim())
    .filter(Boolean)
}

function accountForIndex(index) {
  const slots = accounts.flatMap((account) =>
    Array.from({ length: Math.max(0, account.maxPosts) }, () => account)
  )

  return slots[index] || null
}

async function publishToDevTo(slug, account, index) {
  const postPath = path.join(contentDir, `${slug}.md`)
  if (!fs.existsSync(postPath)) {
    throw new Error(`Cannot find post for slug: ${slug}`)
  }

  const { frontmatter, body } = parseFrontmatter(fs.readFileSync(postPath, 'utf8'))
  const canonicalUrl = `${siteUrl.replace(/\/$/, '')}/blog/${slug}`
  const bodyMarkdown = `${body}\n\n---\n\nOriginally published by Global Mercury Recovery & Water Security: ${canonicalUrl}\n`

  const response = await fetch('https://dev.to/api/articles', {
    method: 'POST',
    headers: {
      'api-key': account.apiKey,
      'content-type': 'application/json',
      'user-agent': 'global-mercury-recovery-blog-engine',
    },
    body: JSON.stringify({
      article: {
        title: frontmatter.title || slug.replace(/-/g, ' '),
        body_markdown: bodyMarkdown,
        published: publishPosts,
        tags: sanitizeTags(frontmatter.tags),
        canonical_url: canonicalUrl,
        description: frontmatter.description || undefined,
      },
    }),
  })

  if (!response.ok) {
    throw new Error(
      `Dev.to publish failed for ${slug} via ${account.name}: ${response.status} ${await response.text()}`
    )
  }

  const json = await response.json()
  console.log(`Published ${slug} to ${account.name}: ${json.url || `article #${json.id}`}`)

  if (index < 3) {
    await new Promise((resolve) => setTimeout(resolve, 9000))
  }
}

async function main() {
  const slugs = readSlugs()
  if (slugs.length === 0) {
    console.log('No generated slugs to publish to Dev.to.')
    return
  }

  if (accounts.length === 0) {
    throw new Error('At least one DEV_TO_API_KEY_* secret is required to publish to Dev.to.')
  }

  for (const [index, slug] of slugs.entries()) {
    const account = accountForIndex(index)
    if (!account) {
      console.log(`Skipped ${slug}; no Dev.to account slot is configured for index ${index + 1}.`)
      continue
    }

    await publishToDevTo(slug, account, index)
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
