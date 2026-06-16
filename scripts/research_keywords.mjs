#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const keywordsPath = path.join(root, 'scripts', 'keywords.txt')
const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6'
const apiKey = process.env.ANTHROPIC_API_KEY

function bareKeyword(line) {
  return line
    .replace(/^# DONE\s+/, '')
    .replace(/^\[\d+\]\s+/, '')
    .trim()
    .toLowerCase()
}

async function main() {
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is required for keyword research.')
  }

  const existingLines = fs.existsSync(keywordsPath)
    ? fs.readFileSync(keywordsPath, 'utf8').split('\n').filter(Boolean)
    : []
  const existing = new Set(existingLines.map(bareKeyword).filter(Boolean))

  const prompt = `Generate 40 new long-tail SEO keywords for globalmercuryrecovery.com.

Existing keywords to avoid:
${[...existing].slice(0, 120).join('\n')}

Score each keyword 1-10 based on:
1. Search demand likelihood
2. Strong environmental/remediation intent
3. Lower competition likelihood for a small specialist site
4. Business relevance for mercury remediation, water security, ASGM, tailings recovery, aquifer protection, Minamata Convention compliance, impact finance, government partnerships, and mining-affected communities

Return only JSON: [{"score": 9, "keyword": "example keyword"}]
No markdown. No em dashes.`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 1800,
      system: 'You are a practical SEO researcher for environmental remediation and water security.',
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    throw new Error(`Anthropic API error ${response.status}: ${await response.text()}`)
  }

  const json = await response.json()
  const raw = json.content?.[0]?.text?.trim().replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/, '') || '[]'
  const ideas = JSON.parse(raw)
  const unique = ideas
    .map((item) => ({
      score: Math.max(1, Math.min(10, Number(item.score) || 5)),
      keyword: String(item.keyword || '').trim().replaceAll('—', '-').replaceAll('--', '-'),
    }))
    .filter((item) => item.keyword && !existing.has(item.keyword.toLowerCase()))
    .sort((a, b) => b.score - a.score)

  if (!unique.length) {
    console.log('No unique keywords returned.')
    return
  }

  const append = unique.map((item) => `[${item.score}] ${item.keyword}`).join('\n')
  fs.appendFileSync(keywordsPath, `\n${append}\n`, 'utf8')
  console.log(`Appended ${unique.length} keywords.`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
