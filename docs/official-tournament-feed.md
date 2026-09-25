# Official Tournament Feed

The player resolver can use a permitted official tournament feed before attempting public ATP index pages.

Configure one of these server-only environment variables:

```env
ATP_OFFICIAL_TOURNAMENT_FEED_URL=https://approved-feed.example/tournaments
```

The resolver appends `playerName` and `dateStart` query parameters. The endpoint may return:

- HTML for one tournament page
- JSON with `{ "html": "..." }`
- JSON with `{ "pages": [{ "url": "...", "html": "..." }] }`

The response must contain the player entry and tournament date metadata. No player, tournament, ID, or date values are stored in the application source.
