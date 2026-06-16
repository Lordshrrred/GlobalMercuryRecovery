#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const keywordsPath = path.join(root, 'scripts', 'keywords.txt')
const model = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001'
const apiKey = process.env.ANTHROPIC_API_KEY
const keywordCount = Math.min(Number(process.env.KEYWORD_RESEARCH_COUNT || 20), 40)
const existingKeywordLimit = Math.min(Number(process.env.KEYWORD_EXISTING_LIMIT || 60), 120)

const fallbackPatterns = [
  'mercury remediation field verification',
  'gold mine tailings water protection',
  'ASGM mercury cleanup pilot project',
  'mine tailings recovery and soil rebuilding',
  'mercury contaminated creek sediment cleanup',
  'water infrastructure for mining villages',
  'Minamata Convention remediation partner',
  'development finance mine cleanup water security',
  'aquifer protection near artisanal mining',
  'environmental remediation grant readiness mining',
  'mercury recovery chain of custody',
  'tailings stabilization for mercury contamination',
  'rural water systems for mining affected communities',
  'third party lab testing mercury cleanup',
  'mine waste to land regeneration project',
  'small scale gold mining mercury reduction plan',
  'mercury exposure reduction mining communities',
  'watershed monitoring after mine cleanup',
  'grant proposal mercury remediation water security',
  'post mining land restoration tailings',
]

function bareKeyword(line) {
  return line
    .replace(/^# DONE\s+/, '')
    .replace(/^\[\d+\]\s+/, '')
    .trim()
    .toLowerCase()
}

async function main() {
  const existingLines = fs.existsSync(keywordsPath)
    ? fs.readFileSync(keywordsPath, 'utf8').split('\n').filter(Boolean)
    : []
  const existing = new Set(existingLines.map(bareKeyword).filter(Boolean))

  if (!apiKey) {
    const uniqueFallbacks = fallbackPatterns
      .filter((keyword) => !existing.has(keyword.toLowerCase()))
      .map((keyword, index) => ({ score: Math.max(6, 10 - Math.floor(index / 3)), keyword }))

    if (!uniqueFallbacks.length) {
      console.log('No fallback keywords left to append.')
      return
    }

    fs.appendFileSync(
      keywordsPath,
      `\n${uniqueFallbacks.map((item) => `[${item.score}] ${item.keyword}`).join('\n')}\n`,
      'utf8'
    )
    console.log(`Appended ${uniqueFallbacks.length} fallback keywords.`)
    return
  }

  const prompt = `Generate ${keywordCount} new long-tail SEO keywords for globalmercuryrecovery.com.

Existing keywords to avoid:
${[...existing].slice(0, existingKeywordLimit).join('\n')}

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
      max_tokens: 900,
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
