#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const keywordsPath = path.join(root, 'scripts', 'keywords.txt')
const contentDir = path.join(root, 'content', 'blog')
const lastSlugPath = path.join(root, 'scripts', 'last_generated_blog_slug.txt')
const generatedSlugsPath = path.join(root, 'scripts', 'generated_blog_slugs.txt')

const countArg = process.argv.find((arg) => arg.startsWith('--count='))
const requestedCount = countArg ? Math.max(1, Number(countArg.split('=')[1]) || 1) : 1
const count = Math.min(requestedCount, Number(process.env.DAILY_POST_LIMIT || 4))
const model = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001'
const apiKey = process.env.ANTHROPIC_API_KEY
const maxOutputTokens = Math.min(Number(process.env.BLOG_MAX_OUTPUT_TOKENS || 1800), 2000)
const internalLinkLimit = Math.min(Number(process.env.BLOG_INTERNAL_LINK_LIMIT || 8), 12)

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
    .sort()
    .slice(-internalLinkLimit)
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
    return templatePost(keyword, slug, links)
  }

  const today = new Date().toISOString().slice(0, 10)
  const prompt = `Write one SEO article for Global Mercury Recovery & Water Security.

Primary keyword: ${keyword}
Slug: ${slug}
Date: ${today}
Author: Matt Dunn

Available internal links:
${links.map((post) => `- [${post.title}](/blog/${post.slug})`).join('\n')}

Return only Markdown with YAML frontmatter. Frontmatter fields must be title, date, description, tags, slug, author.

Rules:
- 900 to 1100 words.
- No em dashes and no double hyphens.
- Use a Quick answer blockquote first.
- Write for governments, funders, mining-affected communities, remediation partners, and impact investors.
- Be practical and specific. No hype.
- Include 1 to 3 internal links from the available list when they are relevant.
- Include a short "Why this matters" section.
- Include a short "What to measure" or "What to ask before funding" section.
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
      max_tokens: maxOutputTokens,
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

function titleize(keyword) {
  return keyword
    .split(/\s+/)
    .map((word) => {
      if (['ASGM', 'ESG'].includes(word.toUpperCase())) return word.toUpperCase()
      if (['for', 'and', 'or', 'the', 'to', 'in', 'of', 'near'].includes(word.toLowerCase())) {
        return word.toLowerCase()
      }
      return `${word.charAt(0).toUpperCase()}${word.slice(1)}`
    })
    .join(' ')
    .replace(/\bAsgm\b/g, 'ASGM')
    .replace(/\bEsg\b/g, 'ESG')
}

function inferTags(keyword) {
  const text = keyword.toLowerCase()
  const tags = ['mercury remediation']
  if (text.includes('water') || text.includes('aquifer')) tags.push('water security')
  if (text.includes('tailing') || text.includes('mine waste')) tags.push('mine tailings')
  if (text.includes('asgm') || text.includes('small scale')) tags.push('ASGM')
  if (text.includes('fund') || text.includes('grant')) tags.push('development finance')
  if (tags.length < 4) tags.push('environmental remediation')
  return [...new Set(tags)].slice(0, 4)
}

function templatePost(keyword, slug, links) {
  const today = new Date().toISOString().slice(0, 10)
  const title = titleize(keyword)
  const tags = inferTags(keyword)
  const relatedLinks = links
    .slice(0, 3)
    .map((post) => `- [${post.title}](/blog/${post.slug})`)
    .join('\n')

  return `---
title: "${title}"
date: "${today}"
description: "A practical field note on ${keyword} for remediation partners, funders, governments, and mining-affected communities."
tags: [${tags.map((tag) => `"${tag}"`).join(', ')}]
slug: "${slug}"
author: "Matt Dunn"
---

> **Quick answer:** ${title} is not only a technical issue. It is a field execution problem that depends on baseline testing, water protection, worker safety, community trust, verification, and a plan for what happens after the first cleanup event.

## Why this topic matters

The search phrase "${keyword}" points to a practical question that many mining-affected regions face: how to reduce contamination while building a durable pathway for cleaner water, safer land, and better local outcomes. Mercury remediation often fails when it is treated as a single equipment purchase instead of a complete operating plan.

For governments, funders, and remediation partners, the useful question is not whether a cleanup technology sounds promising. The useful question is whether the project can define the site, protect people, measure results, and leave the community with a better long-term condition.

## Start with baseline data

Any credible project should begin with baseline sampling. That may include tailings, soil, stream sediment, groundwater, surface water, and worker exposure conditions. The specific test plan depends on the site, but the principle is the same: no baseline means no reliable proof of improvement.

Baseline data also helps prevent the wrong remedy from being chosen. A site dominated by fine contaminated sediment needs a different plan than a site where recoverable mercury or residual mineral value can be separated safely.

## Protect water before moving material

Many mercury and mine waste problems become human health problems through water. Rainfall, flood events, shallow wells, and stream movement can carry contamination beyond the mine area. That is why water security should be part of the remediation design from the beginning.

Useful controls can include drainage planning, sediment capture, protected work areas, source water testing, and a clear plan for monitoring after the equipment leaves.

## Recovery is only one piece

Recovery can reduce risk and sometimes create value, but it should not be treated as the whole project. After recoverable material is removed, the remaining tailings or soil may still need stabilization, containment, soil rebuilding, or vegetation planning.

The strongest projects connect recovery to land regeneration. That means thinking about final grade, erosion, root zone development, future land use, and the practical ability of the site to remain stable over time.

## What funders should ask

Before funding a project related to ${keyword}, ask:

1. What baseline data will be collected?
2. How will water pathways be protected?
3. What forms of mercury or contamination can the method address?
4. How will recovered material be documented?
5. What lab or third-party verification will be used?
6. What happens to material that cannot be recovered?
7. How will the community benefit after cleanup?

## What to measure

Good measurement goes beyond tons moved or equipment hours. Useful metrics include contaminant levels before and after work, water quality, recovered material records, soil stability, downstream sediment movement, and whether safe water access improves for nearby communities.

For Global Mercury Recovery & Water Security, this is the core strategic frame: remediation, water infrastructure, subsurface intelligence, tailings recovery, and land regeneration should reinforce each other.

## Related reading

${relatedLinks || '- [Mercury Remediation in Artisanal Gold Mining](/blog/mercury-remediation-artisanal-gold-mining)'}
`
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
