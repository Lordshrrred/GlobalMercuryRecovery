import fs from 'node:fs'
import path from 'node:path'

export type BlogPost = {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
  author?: string
  body: string
  readingTime: string
}

const blogDir = path.join(process.cwd(), 'content', 'blog')

function parseArray(value: string) {
  return value
    .replace(/^\[/, '')
    .replace(/\]$/, '')
    .split(',')
    .map((item) => item.trim().replace(/^["']|["']$/g, ''))
    .filter(Boolean)
}

function parseFrontmatter(raw: string) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) {
    throw new Error('Blog post is missing frontmatter.')
  }

  const data: Record<string, string | string[]> = {}
  for (const line of match[1].split('\n')) {
    const [key, ...rest] = line.split(':')
    if (!key || rest.length === 0) continue
    const value = rest.join(':').trim()
    data[key.trim()] = value.startsWith('[')
      ? parseArray(value)
      : value.replace(/^["']|["']$/g, '')
  }

  return { data, body: match[2].trim() }
}

function estimateReadingTime(body: string) {
  const words = body.split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.ceil(words / 220))} min read`
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(blogDir)) return []

  return fs
    .readdirSync(blogDir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(blogDir, file), 'utf8')
      const { data, body } = parseFrontmatter(raw)
      const slug = String(data.slug || file.replace(/\.md$/, ''))

      return {
        slug,
        title: String(data.title || slug),
        date: String(data.date || ''),
        description: String(data.description || ''),
        tags: Array.isArray(data.tags) ? data.tags : [],
        author: data.author ? String(data.author) : undefined,
        body,
        readingTime: estimateReadingTime(body),
      }
    })
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
}

export function getPost(slug: string) {
  return getAllPosts().find((post) => post.slug === slug)
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function inlineMarkdown(value: string) {
  return escapeHtml(value)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
}

export function markdownToHtml(markdown: string) {
  const lines = markdown.split('\n')
  const html: string[] = []
  let listType: 'ul' | 'ol' | null = null

  const closeList = () => {
    if (listType) {
      html.push(`</${listType}>`)
      listType = null
    }
  }

  for (const line of lines) {
    const trimmed = line.trim()

    if (!trimmed) {
      closeList()
      continue
    }

    if (trimmed.startsWith('### ')) {
      closeList()
      html.push(`<h3>${inlineMarkdown(trimmed.slice(4))}</h3>`)
      continue
    }

    if (trimmed.startsWith('## ')) {
      closeList()
      html.push(`<h2>${inlineMarkdown(trimmed.slice(3))}</h2>`)
      continue
    }

    if (trimmed.startsWith('> ')) {
      closeList()
      html.push(`<blockquote>${inlineMarkdown(trimmed.slice(2))}</blockquote>`)
      continue
    }

    const ordered = trimmed.match(/^\d+\.\s+(.*)$/)
    if (ordered) {
      if (listType !== 'ol') {
        closeList()
        listType = 'ol'
        html.push('<ol>')
      }
      html.push(`<li>${inlineMarkdown(ordered[1])}</li>`)
      continue
    }

    if (trimmed.startsWith('- ')) {
      if (listType !== 'ul') {
        closeList()
        listType = 'ul'
        html.push('<ul>')
      }
      html.push(`<li>${inlineMarkdown(trimmed.slice(2))}</li>`)
      continue
    }

    closeList()
    html.push(`<p>${inlineMarkdown(trimmed)}</p>`)
  }

  closeList()
  return html.join('\n')
}

export function formatPostDate(date: string, long = false) {
  const [year, month, day] = date.split('-').map(Number)
  const localDate = new Date(year, (month || 1) - 1, day || 1)

  return localDate.toLocaleDateString('en-US', {
    month: long ? 'long' : 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
