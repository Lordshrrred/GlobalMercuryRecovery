# Global Mercury Recovery — Agent Handoff

> **Read this first — every session, every agent.** Claude, Codex, whoever you are: this file is the operating manual. Read order: **this file → `README.md`**. Update this file before ending any session if you changed behavior, discovered a constraint, or completed something the next agent needs to know.

---

## PRIME DIRECTIVE

**Matt never wants to do things manually that a computer can do.**

If you are about to say "you'll need to manually do X" — stop. Write the script or automation instead. If it requires a genuine one-time manual action (OAuth, a UI click), say so once clearly, then build the code so it never needs repeating.

---

## Project Identity

- **Site:** `globalmercuryrecovery.com`
- **Entity:** GeoNano R&D LLC (legal name). Public-facing brand is **Global Mercury Recovery & Water Security (GMRWS)**.
- **Stack:** Next.js 14 (App Router) · Tailwind CSS · Framer Motion · TypeScript · Static export via `npm run deploy`
- **Hosting:** Vercel (auto-deploys on push to main)
- **GitHub Pages:** Also present (used for the GMRWS Feeder — see below). Do not confuse the two.
- **Analytics:** GA4 measurement ID `G-P20LY8N480` — in env as `NEXT_PUBLIC_GA_MEASUREMENT_ID`

---

## Repo Map

```
app/                  Next.js App Router pages
components/           Shared UI components
content/blog/         Blog source posts (Markdown)
scripts/              Automation scripts (blog gen, Dev.to publishing, keyword research)
  generate_blog_post.mjs    Blog post generator (Claude Haiku)
  publish_to_devto.mjs      Dev.to cross-poster
  keywords.txt              Ranked keyword queue (scored [1-10])
  generated_blog_slugs.txt  Log of all slugs ever generated (dedup guard)
  last_generated_blog_slug.txt  Last generated slug
public/               Static assets
.github/workflows/
  daily-blog.yml            Automated: 4 posts/day at 09:00 UTC
  weekly-keyword-research.yml  Automated: expands keyword queue weekly
  publish-existing-devto.yml   Manual: cross-post specific slugs to Dev.to
```

---

## Blog Engine — How It Works

### Generation
- **Script:** `node scripts/generate_blog_post.mjs --count=N`
- **Cap:** `Math.min(N, DAILY_POST_LIMIT)` — `DAILY_POST_LIMIT` is hardcoded to `4` in the workflow. Running locally without this env var also defaults to 4.
- **Model:** `claude-haiku-4-5-20251001` (cheapest, fast, sufficient for SEO posts)
- **Keyword queue:** `scripts/keywords.txt` — scored `[1-10]`, highest scores consumed first. Already-generated keywords are marked `# DONE`.
- **Dedup guard:** `scripts/generated_blog_slugs.txt` — the generator skips any keyword whose slug already appears here.
- **Output:** Markdown frontmatter posts in `content/blog/*.md`

### Dev.to Cross-Post
- **Script:** `npm run publish:devto`
- **Accounts:** `DEV_TO_API_KEY_1` (posts 1–2 of each batch), `DEV_TO_API_KEY_2` (posts 3–4)
- **Canonical URL:** set to `https://globalmercuryrecovery.com/blog/[slug]` — prevents duplicate indexing
- **Limit per account per day:** 2 (do not exceed or Dev.to will throttle)

### GMRWS Feeder (`GMRWS_Feeder` repo)
- Separate GitHub repo: mirrors GMRWS blog summaries as a lightweight HTML feeder site
- Workflow `sync-main-blog.yml` runs at 10:30 UTC daily — pulls from `Lordshrrred/GlobalMercuryRecovery` and syncs `content/blog/` into feeder posts
- **Purpose:** SEO backlink from a separate domain. Do not host the feeder under `globalmercuryrecovery.com`.
- The feeder does **not** generate new posts — it syncs summaries only.

---

## Workflow Schedule (Automated)

| Workflow | Schedule | What It Does |
|----------|----------|--------------|
| `daily-blog.yml` | 09:00 UTC daily | Generate 4 posts → cross-post 2+2 to Dev.to → build static export → commit |
| `weekly-keyword-research.yml` | Weekly | Appends new long-tail keywords to `scripts/keywords.txt` |
| GMRWS Feeder `sync-main-blog.yml` | 10:30 UTC daily | Syncs blog summaries to the feeder site |

**Target cadence: 4 posts/day.** The daily workflow enforces this via `DAILY_POST_LIMIT=4`. **Do not run the generation script more than once per day** — the keyword dedup guard will consume queue slots even if you meant to test.

---

## ⚠️ 8-Post Incident (2026-06-16) — Understand Before Touching the Blog

**What happened:** 8 blog posts were generated today instead of 4.

**Root cause:** The generation script was run **twice** in the same session — once at ~13:16 local time and again at ~15:34 local time (verified via `ls -la content/blog/`). Each run generated 4 posts from the keyword queue. The script's dedup guard prevents re-generating the same slug, but it does not prevent a second run from consuming the next 4 keywords.

**How to avoid:** Only trigger the blog engine once per day. If you need to test locally, use `--count=1` and verify against `generated_blog_slugs.txt` before running a larger batch. The automated cron at 09:00 UTC is the canonical daily run — do not add manual runs on the same calendar day unless you intend to exceed the quota.

**Dev.to note:** All 8 posts were also cross-posted to Dev.to today via a manual `Publish Existing Posts to Dev.to` workflow run. Both Dev.to accounts are now at or near today's ceiling. Do not cross-post again today.

---

## Environment Variables

Set in Vercel and as GitHub Actions secrets:

| Variable | Purpose |
|----------|---------|
| `ANTHROPIC_API_KEY` | Blog generation (Haiku) + keyword research |
| `ANTHROPIC_MODEL` | Model override (default: `claude-haiku-4-5-20251001`) |
| `BLOG_MAX_OUTPUT_TOKENS` | Cap per post (default: 1200, hard max: 1600) |
| `BLOG_INTERNAL_LINK_LIMIT` | Max existing posts linked in prompts (default: 8) |
| `DAILY_POST_LIMIT` | Hard cap per generation run (default: 4) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 ID (`G-P20LY8N480`) |
| `DEV_TO_API_KEY_1` | Dev.to account 1 (posts 1-2 of each batch) |
| `DEV_TO_API_KEY_2` | Dev.to account 2 (posts 3-4 of each batch) |
| `DEV_TO_PUBLISHED` | Set to `true` to publish (not draft) |

---

## Cost Controls

- Haiku is the default and should stay the default for blog generation.
- Each post is capped at 1,200 output tokens.
- Keyword research asks for 20 ideas per weekly run.
- If `ANTHROPIC_API_KEY` is missing, the script generates deterministic fallback posts (no API spend).

---

## Pages

| Route | Notes |
|-------|-------|
| `/` | Home |
| `/technology` | Five Pillar Architecture |
| `/impact` | Environmental / Social / Economic Impact |
| `/blog` | Blog index |
| `/about` | Team & Company |
| `/funding` | Grants & Investor Inquiry |
| `/contact` | Contact (mailto handler — no backend) |

---

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `gold` | `#C9A84C` | Primary accent, CTAs |
| `teal` | `#00D4AA` | Secondary accent |
| `navy` | `#0A0F1E` | Background |
| `navy-mid` | `#0D1526` | Section alternates |
| `navy-card` | `#131C30` | Card backgrounds |

---

## Automation Safety

- **Publishing:** Vercel auto-deploys on push to main. No manual deploy step needed.
- **Blog generation:** Automated at 09:00 UTC via `daily-blog.yml`. Do not add parallel cron triggers.
- **Dev.to:** 2 posts per account per day. Cross-posting is automated in `daily-blog.yml`. Manual cross-posts via `publish-existing-devto.yml` eat into the same daily ceiling.
- **Keyword queue:** Consumed top-down by score. Weekly research replenishes it. Do not hand-edit `keywords.txt` during an active run.

---

## Related Repos (Matt's Ecosystem)

These repos are siblings — do not confuse their accounts, API keys, or publishing logic:

| Repo | Purpose |
|------|---------|
| `EarthStarCommand` | ESR creator dashboard, social analytics, orchestration, Publer integration |
| `VibrationofAwesome` | VOA blog + drip system (4 posts/day, Hugo + Node, 15+ platforms) |
| `VOA_Feeder` | Companion blog triggered per-VOA-post |
| `GMRWS_Feeder` | This repo's blog synced as a feeder site |
| `TWTF_Feeder` | Separate feeder — do not confuse with GMRWS |

**Key cross-repo rules:**
- ESR Publer account IDs start with `673d...` — do not use in GMR or VOA scripts.
- VOA Publer account IDs start with `6a0...` — do not use in GMR scripts.
- GMR has no Publer integration — it publishes to Dev.to only.
- VOA drip runs 4 cron slots/day × 1 post each = 4 VOA posts + 4 VOA Feeder posts = 8 total blog artifacts/day (this is intentional on the VOA side; GMR targets 4/day only).

---

## Human Operator Principle

Matt is the operator. Surface what matters, suppress engine-room noise.

**Default visible:** What was generated today · What's next in the queue · Any quota warnings.

**Not visible by default:** Internal link lists · Token counts · Full keyword queue.

---

## After Every Session

Before you end: update the **Active Task** section below with what you did, what's next, and any exact commands to run.

---

## Active Task

### Blog Engine Setup — ✅ DONE (2026-06-16)

- Blog engine wired: `daily-blog.yml` runs at 09:00 UTC, generates 4 posts, cross-posts 2+2 to Dev.to.
- 8 posts generated today (2 manual runs — see incident note above). Queue has ~12+ keywords remaining.
- Dev.to cross-posting also manually triggered today via `Publish Existing Posts to Dev.to` workflow.
- Weekly keyword research workflow manually triggered today (21:41 UTC) — queue expanded.
- GMRWS Feeder wired and syncing daily.

**Next:**
- Monitor tomorrow's 09:00 UTC cron run — should generate 4 posts cleanly.
- Blog is showing in navigation (commit `b88c918`).
- Verify Dev.to posts are live under both accounts after today's cross-post run.
- Consider adding a guard in `generate_blog_post.mjs` that checks today's date against `generated_blog_slugs.txt` and exits early if 4+ posts were already generated today.
