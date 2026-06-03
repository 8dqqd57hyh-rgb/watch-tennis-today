# AdSense Guides Unique Content Fix

This update replaces the template-like guide article system with guide pages that have unique headings, page-specific body copy, FAQ blocks and related internal links.

## Changed

- Rebuilt `app/guides/articles.ts` with 24 unique tennis guide articles.
- Added the missing `/guides/tennis-scoring-for-beginners` article.
- Replaced generic section titles like `Quick answer` / `Point 2` with article-specific headings.
- Updated `app/guides/[slug]/page.tsx` to render:
  - article category
  - unique intro section
  - unique section headings
  - FAQ section
  - related guide links
  - Article schema
  - FAQ schema
- Kept the legal-streaming disclosure on every guide page.

## Why

The previous guide pages could look too repetitive for AdSense review. This version is designed to reduce the risk of low-value or template-generated content by making each guide visibly different and more helpful to readers.

## Manual checks

Open these pages locally:

- `/guides/tennis-scoring-for-beginners`
- `/guides/tennis-live-scores-guide`
- `/guides/atp-wta-challenger-itf-explained`
- `/guides/how-to-watch-tennis-online-legally`

They should all show different H1s, different section headings, different body text and FAQ blocks.
