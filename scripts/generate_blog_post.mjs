#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const keywordsPath = path.join(root, 'scripts', 'keywords.txt')
const contentDir = path.join(root, 'content', 'blog')
const lastSlugPath = path.join(root, 'scripts', 'last_generated_blog_slug.txt')
const generatedSlugsPath = path.join(root, 'scripts', 'generated_blog_slugs.txt')

const countArg = process.argv.find((arg) => arg.startsWith('--count='))
const count = countArg ? Math.max(1, Number(countArg.split('=')[1]) || 1) : 1
const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6'
const apiKey = process.env.ANTHROPIC_API_KEY

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 86)
}

function readQueuedKeywords() {
  const lines = fs.readFileSync(keywordsPath, 'utf8').split('\n')
  const queued = []

  lines.forEach((line, index) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('# DONE')) return
    const match = trimmed.match(/^\[(\d+)\]\s+(.+)$/)
    queued.push({
      index,
      score: match ? Number(match[1]) : 5,
      keyword: match ? match[2].trim() : trimmed,
      original: line,
    })
  })

  return { lines, queued: queued.sort((a, b) => b.score - a.score) }
}

function existingPosts() {
  if (!fs.existsSync(contentDir)) return []
  return fs
    .readdirSync(contentDir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(contentDir, file), 'utf8')
      const title = raw.match(/^title:\s+"?(.+?)"?$/m)?.[1] || file.replace(/\.md$/, '')
      const slug = raw.match(/^slug:\s+"?(.+?)"?$/m)?.[1] || file.replace(/\.md$/, '')
      return { title, slug }
    })
}

function validatePost(markdown, slug) {
  if (!markdown.startsWith('---\n')) {
    throw new Error('Generated post is missing frontmatter.')
  }
  if (!markdown.includes(`slug: "${slug}"`) && !markdown.includes(`slug: ${slug}`)) {
    throw new Error(`Generated post did not use expected slug: ${slug}`)
  }
  if (markdown.includes('—') || markdown.includes('--')) {
    throw new Error('Generated post contains em dash style punctuation.')
  }
}

async function callClaude(keyword, slug, links) {
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is required to generate blog posts.')
  }

  const today = new Date().toISOString().slice(0, 10)
  const prompt = `Write one SEO article for Global Mercury Recovery & Water Security.

Primary keyword: ${keyword}
Slug: ${slug}
Date: ${today}

Available internal links:
${links.map((post) => `- [${post.title}](/blog/${post.slug})`).join('\n')}

Return only Markdown with YAML frontmatter. Frontmatter fields must be title, date, description, tags, slug.

Rules:
- 700 to 1100 words.
- No em dashes and no double hyphens.
- Use a Quick answer blockquote first.
- Write for governments, funders, mining-affected communities, remediation partners, and impact investors.
- Be practical and specific. No hype.
- Include 2 to 4 internal links from the available list when they are relevant.
- Include a short "Why this matters" section.
- Include a short "What to measure" or "What to ask before funding" section where appropriate.
- Do not invent proprietary performance data or claim certification.
- Mention Global Mercury Recovery & Water Security naturally once near the end.`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 2200,
      system:
        'You are an environmental remediation editor specializing in mercury pollution, ASGM, water security, mine tailings, and development finance. Return clean Markdown only.',
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    throw new Error(`Anthropic API error ${response.status}: ${await response.text()}`)
  }

  const json = await response.json()
  return json.content?.[0]?.text?.trim().replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/, '') || ''
}

async function main() {
  fs.mkdirSync(contentDir, { recursive: true })
  fs.writeFileSync(generatedSlugsPath, '', 'utf8')
  const { lines, queued } = readQueuedKeywords()
  if (queued.length === 0) {
    throw new Error('No queued keywords left in scripts/keywords.txt.')
  }

  const created = []
  for (const item of queued.slice(0, count)) {
    const slug = slugify(item.keyword)
    const outputPath = path.join(contentDir, `${slug}.md`)
    if (fs.existsSync(outputPath)) {
      lines[item.index] = `# DONE ${item.original}`
      continue
    }

    const markdown = await callClaude(item.keyword, slug, existingPosts())
    validatePost(markdown, slug)
    fs.writeFileSync(outputPath, `${markdown}\n`, 'utf8')
    lines[item.index] = `# DONE ${item.original}`
    fs.writeFileSync(keywordsPath, `${lines.join('\n').replace(/\n*$/, '')}\n`, 'utf8')
    fs.writeFileSync(lastSlugPath, `${slug}\n`, 'utf8')
    created.push(slug)
    fs.writeFileSync(generatedSlugsPath, `${created.join('\n')}\n`, 'utf8')
    console.log(`Generated ${slug}`)
  }

  if (created.length === 0) {
    console.log('No new posts generated. The selected keywords already had files.')
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
