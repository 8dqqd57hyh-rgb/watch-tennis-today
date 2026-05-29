# Live points display fix

## What changed

- The `/api/matches` merge order now prefers `get_livescore` data over `get_fixtures` data when both endpoints return the same `event_key`.
- This is important because `get_livescore` is the endpoint that carries the freshest `pointbypoint` payload, while fixtures can overwrite it with older/limited data.
- The current-game point extraction now uses the latest `pointbypoint[].points[].score` value whenever the match is live.
- The UI polling remains enabled and continues refreshing the match without a page reload.

## Why the previous version did not show points

The API response was being merged as:

```ts
[...liveMatches, ...fixtureMatches]
```

Then a `Map` was used by `event_key`. When the same match existed in both lists, the fixture version overwrote the live version. That could remove or stale the live point-by-point data before the page received it.

Now it merges as:

```ts
[...fixtureMatches, ...liveMatches]
```

So the live version wins.
