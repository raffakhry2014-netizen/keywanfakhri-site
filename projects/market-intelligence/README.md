# KeyOne Market Intelligence — Prototype Setup

This branch is intentionally isolated from production.

## Current architecture

- Frontend: `/projects/market-intelligence/`
- Backend: `/api/market-intelligence`
- Hosting target: existing Cloudflare Pages project
- Cache/database: existing D1 binding `DB`
- Market data: Twelve Data
- AI research: OpenAI Responses API + Web Search
- Default model: `gpt-5.6-sol`

## Cloudflare Pages secrets

Add these in the existing Cloudflare Pages project settings for Preview first:

- `TWELVE_DATA_API_KEY` — required for market quotes and EUR conversion
- `OPENAI_API_KEY` — required for web research and structured extraction
- `OPENAI_MODEL` — optional; defaults to `gpt-5.6-sol`

Never put API keys in HTML or JavaScript sent to the browser.

## What happens when Analyze is clicked

1. Resolve the asset or symbol.
2. Fetch current market price.
3. Convert to EUR.
4. Read cached research from D1 when fresh.
5. If cache is missing/stale, use OpenAI Web Search to find timestamped analyst forecasts and sources.
6. Reject historical observations whose URLs are not present in the actual web-search evidence set.
7. Keep analysts with at least 5 verified annual observations.
8. Compute Weighted MAPE with year weights 35/25/18/13/9.
9. Compute Direction Accuracy, Consistency, Coverage and Source Quality.
10. Rank Top 10 by the deterministic Accuracy Score.
11. Build accuracy-weighted 3M and next-year consensus.
12. Build Bearish / Base / Bullish / Major Shock ranges.
13. Return source URLs to the frontend.

## Accuracy score

`55% × (100 − Weighted MAPE) + 20% × Direction Accuracy + 10% × Consistency + 5% × Coverage + 10% × Source Quality`

The AI does not calculate this score.

## Prototype safeguards

- Minimum 5 verified annual observations for ranking.
- Forecasts without usable numeric evidence are omitted.
- Missing 3M or next-year forecasts stay N/A.
- URLs must be present in the Web Search evidence returned by the API before historical observations can affect scoring.
- Research is cached in D1 for 24 hours to reduce cost and avoid inconsistent repeated searches.
- Gold has a demo fallback while secrets are not configured.

## Before merging to main

1. Add secrets to Cloudflare Preview environment.
2. Open the branch preview.
3. Test: Gold, Bitcoin, ASML, Copper.
4. Check at least 3 displayed analyst sources manually.
5. Confirm EUR conversion and current price against an independent market source.
6. Confirm analysts with <5 verified observations are excluded.
7. Test mobile layout.
8. Only then merge the PR.
