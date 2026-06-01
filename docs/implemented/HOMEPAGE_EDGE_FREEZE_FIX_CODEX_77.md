# Homepage Edge Freeze Fix

## Problem
The homepage could freeze the browser after loading match data because too many client-side homepage sections and match cards rendered at once.

## Fix
- Limited homepage match data to 60 matches.
- Limited the main match card grid to 24 cards.
- Added a 4.5s abort timeout for `/api/matches` on the homepage.
- Deferred heavy homepage sections until after the first render.
- Kept the most important hero, French Open hub and core navigation visible immediately.

## Files changed
- `app/page.tsx`
