# Public market watchlist

28 fixed assets: 8 commodities, 10 US-listed ETFs and 10 crypto pairs. Definitions live in `watchlist.json`; timestamps refer to the catalog review, not market-price freshness.

The page embeds the official TradingView advanced chart with attribution, a daily interval and the exchange timezone. Provider data may be live, delayed or end-of-day. A daily interval is not a scheduled daily snapshot; the current bar can be incomplete. No chart data is scraped, copied into our API, converted, or cross-checked against a second source. Unsupported symbols have a source link and must not be assigned a substitute price. Commodity futures/CFD references and crypto exchange pairs are labeled explicitly.

Weekly and monthly research are unpublished, with null publication timestamps. This release does not implement a research scheduler or manufacture forecasts/accuracy scores. A sourced review can be added later with its actual publication date.

The legacy Twelve Data / Alpha Vantage cross-check code is preserved but its API is disabled by default. Enabling it requires the server variable `ENABLE_LICENSED_MARKET_API=true`, appropriate provider rights/subscriptions and a server-side `ADMIN_PASSWORD`; requests must carry that password as a Bearer token. Never put it in the public frontend. Enabling this API can incur OpenAI research costs unless `quoteOnly=true`. Existing secrets alone cannot trigger provider calls in public mode.

Official embed documentation: https://www.tradingview.com/widget-docs/widgets/charts/advanced-chart/demos/basic-area-chart/
