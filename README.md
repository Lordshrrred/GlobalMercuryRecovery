# Global Mercury Recovery ~ Website

Marketing and platform site for **Global Mercury Recovery & Water Security (GMRWS)**, built on Next.js 14 with Tailwind CSS and Framer Motion.

Legal entity: **GeoNano R&D LLC**

---

## Tech Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** with custom design tokens
- **Framer Motion** for scroll animations
- **TypeScript**
- No backend ~ contact forms use `mailto:` handlers

---

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Pages

| Route | Page |
|-------|------|
| `/` | Home |
| `/technology` | Five Pillar Architecture |
| `/impact` | Environmental / Social / Economic Impact |
| `/blog` | Environmental remediation insights |
| `/about` | Team & Company Overview |
| `/funding` | Grants & Investor Inquiry |
| `/contact` | Contact Form |

---

## Deploy to Vercel

### Option 1 ~ Vercel CLI (recommended)

```bash
npm i -g vercel
vercel
```

Follow the prompts. Vercel auto-detects Next.js and configures the build correctly.

### Option 2 ~ Vercel Dashboard

1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
3. Import the GitHub repository.
4. Leave all build settings at defaults (Vercel detects Next.js automatically).
5. Click **Deploy**.

### Build Settings (if prompted)

| Setting | Value |
|---------|-------|
| Framework | Next.js |
| Build Command | `npm run build` |
| Output Directory | `.next` |
| Install Command | `npm install` |

---

## Blog Engine

The site includes a static blog engine:

- Source posts live in `content/blog/*.md`
- Keyword queue lives in `scripts/keywords.txt`
- Generate one queued post locally with `npm run generate:blog`
- Generate more than one with `node scripts/generate_blog_post.mjs --count=4`
- Expand the keyword queue with `npm run research:keywords`

GitHub Actions are included:

- `.github/workflows/daily-blog.yml` publishes 4 posts/day on a UTC schedule.
- `.github/workflows/weekly-keyword-research.yml` adds new long-tail keyword targets weekly.

## Environment Variables

For local static builds, no environment variables are required unless you want analytics or automated content generation.

```
CONTACT_EMAIL=your@email.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
ANTHROPIC_API_KEY=your_anthropic_api_key
ANTHROPIC_MODEL=claude-sonnet-4-6
```

For GitHub Actions, add these repository secrets:

- `ANTHROPIC_API_KEY` for blog generation and keyword research.
- `ANTHROPIC_MODEL` optional model override.
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` for Google Analytics.

For Google Analytics, create a GA4 web data stream for `https://globalmercuryrecovery.com`, copy the measurement ID that starts with `G-`, and set it as `NEXT_PUBLIC_GA_MEASUREMENT_ID` before building/deploying.

---

## Customization Checklist

Before going live:

- [ ] Replace all `// TODO: replace with real data` stat values
- [ ] Replace `[Team Member]` placeholders with real names and bios
- [ ] Replace `[Advisory Member]` placeholders
- [ ] Update `mailto:info@globalmercuryrecovery.com` with real contact email
- [ ] Add real logo/favicon to `/public/`
- [ ] Add Open Graph images to `/public/` and update `metadata` in `app/layout.tsx`
- [ ] Replace the interactive map placeholder in `/impact` with a real map component
- [ ] Update partner logos if available

---

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `gold` | `#C9A84C` | Primary accent, CTAs |
| `teal` | `#00D4AA` | Secondary accent, data |
| `navy` | `#0A0F1E` | Primary background |
| `navy-mid` | `#0D1526` | Section alternates |
| `navy-card` | `#131C30` | Card backgrounds |

---

*Built for Global Mercury Recovery & Water Security. GeoNano R&D LLC.*
