# UI + Player Cleanup Codex 69

## What changed

- Fixed the global header contrast regression with explicit dark header styles and CSS guardrails.
- Added resilient `.site-header`, `.site-brand`, and `.site-nav` CSS rules so navigation stays readable even if theme utility classes regress.
- Improved mobile header layout so the navigation wraps/scrolls cleanly instead of disappearing off-screen.
- Added `displayPlayerName()` to show verified full player names in UI when feeds provide abbreviated names.
- Updated the homepage featured match hero to display canonical names such as `Joao Fonseca` and `Novak Djokovic` instead of `J. Fonseca` and `N. Djokovic` when verified aliases exist.
- Fixed canonical lookup so verified aliases like `j-fonseca` can resolve to canonical players before strict initial-name filtering is applied.
- Checked for byte-identical TSX component duplicates after cleanup; none were found.

## Notes

- Unknown possible real players should no longer be misleadingly redirected to `/players`.
- Clearly invalid/unverified player URLs should be handled by the player page as 404/noindex rather than permanent redirects.
- Full local TypeScript/build verification was not possible in this sandbox because dependency installation was incomplete; changes are small and isolated to header styling plus player alias/display helpers.
