# KeyOne Market Intelligence — Prototype Setup

This branch is intentionally isolated from production.

## Current architecture

- Frontend: `/projects/market-intelligence/`
- Backend: `/api/market-intelligence`
- Hosting target: existing Cloudflare Pages project
- Cache/database: existing D1 binding `DB`
- Market data: Twelve Data
- Secondary price: Alpha Vantage (server only)
- AI research: OpenAI Responses API + Web Search
- Default model: `gpt-5.6-sol`

## Cloudflare Pages secrets

Add these in the existing Cloudflare Pages project settings for Preview first:

- `TWELVE_DATA_API_KEY` — required for market quotes and EUR conversion
- `ALPHA_VANTAGE_API_KEY` — required for the secondary price check; missing key returns a warning
- `OPENAI_API_KEY` — required for web research and structured extraction
- `OPENAI_MODEL` — optional; defaults to `gpt-5.6-sol`

Never put API keys in HTML or JavaScript sent to the browser.

## Price verification

The main EUR price remains Twelve Data. The check compares original quotes in
the same currency, instrument and unit: `abs(A - B) / A * 100`.
Gold uses XAU/USD for the check and converts the displayed price to EUR.
Bitcoin compares BTC/EUR. Bare ASML explicitly means NASDAQ USD ADR.
Other stock/ETF listings currently support the same US USD ticker only;
unsupported listings return a warning rather than guessing another listing.

Preview environment variables (not secrets) can override defaults:

- `PRICE_CHECK_THRESHOLD_PCT`: 1 (stocks, ETFs, crypto)
- `PRICE_CHECK_COMMODITY_THRESHOLD_PCT`: 1.5
- `PRICE_CHECK_MAX_AGE_MINUTES`: 30 (spot)
- `PRICE_CHECK_MAX_SKEW_MINUTES`: 15 (spot)
- `PRICE_CHECK_CLOSE_MAX_AGE_HOURS`: 96 (weekends/holidays)

Both source timestamps must exist and align. Daily-close quotes must be for
the same trading date; spot vs daily-close always warns. Missing/quota-limited
or stale data never verifies. Retrieval time is separate from source time.
Alpha Vantage COPPER is a monthly USD/metric-ton benchmark, while HG1 is a
USD/lb futures instrument. Copper therefore returns `warning`, with no
comparable percentage (N/A). A matching futures feed is needed to verify it.

`market.price_check` returns provider A/B quotes, `status`, `data_warning`,
`difference_pct`, `threshold_pct`, and reason codes. UI shows this even if
research is unavailable. Demo data is always marked unverified.
Use POST `{ "asset": "Gold", "quoteOnly": true }` for a quote-only preview
check without AI research. Run `node --test tests/price-check.test.mjs` locally.

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
