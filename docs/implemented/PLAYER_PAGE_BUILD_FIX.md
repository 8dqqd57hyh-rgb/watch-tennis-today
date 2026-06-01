# Player Page Build Fix

Fixed a Next.js type error in `app/player/[slug]/page.tsx`.

## Issue

The page component returned a metadata-like object for invalid player slugs:

```ts
return {
  title: "Player Not Found | Watch Tennis Today",
  robots: { index: false, follow: true },
};
```

Next.js page components must return React nodes, not metadata objects. This broke Vercel TypeScript validation.

## Fix

Invalid player slugs now call `notFound()` inside the page component.

This preserves the strict canonical player validation and allows invalid URLs such as `/player/cristian-potapova` to resolve as 404 instead of rendering fake player content.

## Verification

- `npx tsc --noEmit` passes.
- `npm run build` compiles and passes TypeScript; sandbox timed out during page-data collection, not during code/type validation.
