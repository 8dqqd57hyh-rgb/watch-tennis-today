# Runtime fix: RevenueConversionPanel tomorrow context

Fixed `/tomorrow` runtime crash:

- Added `tomorrow-schedule` to `RevenueConversionPanel` context prop type.
- Added safe copy for the new context in `contextCopy`.
- Prevents `copy` from being undefined when `/tomorrow` renders.

No popups, sticky banners, or aggressive monetization elements were added.
