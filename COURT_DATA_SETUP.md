# Kraków Open 2026 - Court Data Setup Guide

## Overview

The tournament page now supports displaying court information for matches. Court data is stored in Supabase and can be populated from official ITF schedules or manually.

## Architecture

### 1. **Local Court Mappings** (`/data/krakowOpenCourts.ts`)
- Lightweight TypeScript file for quick lookups
- Works offline and during development
- Good for static tournament data
- Currently empty (awaiting ITF official schedule)

### 2. **Supabase Court Database** (`tournament_court_mappings` table)
- Production-ready storage for court assignments
- Supports querying and filtering
- Migration: `202608050002_create_tournament_court_mappings.sql`
- Table structure includes:
  - `tournament_slug` + `tournament_year` + `match_date` + `player1` + `player2` (unique key)
  - `court_number`, `court_name`, `surface`, `capacity`
  - `source` (e.g., 'itf_official', 'manual')
  - Timestamps for audit trail

### 3. **Utility Functions** (`/app/lib/supabaseCourtData.ts`)
- `fetchCourtForMatch()` - Get court for a specific match
- `fetchCourtsForDate()` - Get all courts scheduled for a date
- `fetchAllCourtsForTournament()` - Get all unique courts
- `addCourtMapping()` / `batchAddCourtMappings()` - Insert/update data
- `deleteCourtMapping()` - Remove mappings

### 4. **Tournament Page Integration** (`/app/tournaments/krakow-open/page.tsx`)
- Uses `findCourtForMatch()` from local data file
- Displays "Court X" label with optional court name
- Shows court filter buttons when multiple courts available
- Gracefully handles missing court data

## How to Populate Court Data

### Option 1: Manual Data Entry (Fast)
Use this for quick testing or small tournaments.

```typescript
// Example: Add sample court mapping
const mapping = {
  tournament_slug: "krakow-open",
  tournament_year: 2026,
  match_date: "2026-08-18",
  match_time: "10:00",
  player1: "Jannik Sinner",
  player2: "Matteo Berrettini",
  court_number: "1",
  court_name: "Centre Court",
  surface: "Clay",
  capacity: 500,
  round: "First Round",
  source: "manual"
};

// Insert via Supabase dashboard or API
```

### Option 2: Batch Import from ITF (Recommended)
Use this once you have the official ITF order of play.

1. **Extract ITF Schedule**
   - Go to: https://www.itftennis.com/tennis/tournaments/men's-world-tennis-tour/2026-krakow-open.html
   - Note court assignments from daily order of play
   - Save in format: [player1, player2, date, time, court_number, round]

2. **Create Import Script**
   ```typescript
   import { batchAddCourtMappings } from '@/app/lib/supabaseCourtData';
   
   const courtMappings = [
     {
       tournament_slug: "krakow-open",
       tournament_year: 2026,
       match_date: "2026-08-18",
       match_time: "10:00",
       player1: "Player Name",
       player2: "Player Name",
       court_number: "1",
       round: "First Round",
       source: "itf_official"
     },
     // ... more mappings
   ];
   
   await batchAddCourtMappings(courtMappings);
   ```

3. **Run Import**
   - Execute script in Node.js or Next.js API route
   - Verify data in Supabase dashboard

### Option 3: API Endpoint
Create an endpoint to accept court data from external sources.

```typescript
// Example: /api/tournaments/krakow-open/import-courts
export async function POST(req: Request) {
  const { mappings } = await req.json();
  const count = await batchAddCourtMappings(mappings);
  return Response.json({ imported: count });
}
```

## Adding Sample Data (for testing)

Here's sample Kraków Open court data to test the system:

```sql
-- Insert via Supabase SQL Editor or migration
INSERT INTO public.tournament_court_mappings (
  tournament_slug, tournament_year, match_date, match_time,
  player1, player2, court_number, court_name, surface, capacity,
  round, source
) VALUES
  ('krakow-open', 2026, '2026-08-18', '10:00:00',
   'Jannik Sinner', 'Matteo Berrettini', '1', 'Centre Court', 'Clay', 500, 'First Round', 'manual'),
  
  ('krakow-open', 2026, '2026-08-18', '11:00:00',
   'Daniel Altmaier', 'Hugo Gaston', '2', 'Court 2', 'Clay', 300, 'First Round', 'manual'),
  
  ('krakow-open', 2026, '2026-08-18', '14:30:00',
   'Mariano Navone', 'Gianluca Mager', '3', 'Court 3', 'Clay', 250, 'First Round', 'manual'),
  
  ('krakow-open', 2026, '2026-08-19', '10:00:00',
   'Jannik Sinner', 'Daniel Altmaier', '1', 'Centre Court', 'Clay', 500, 'Quarterfinal', 'manual');
```

## Lookup Priority

The tournament page uses this priority for court information:

1. **API Response** (if API-Tennis adds court field)
2. **Supabase Mapping** (most authoritative - from ITF or manual source)
3. **Local Data File** (fallback for development/testing)
4. **None** (gracefully handles missing court data)

## Venue Information

**KS Olsza Krakow** (Home of Kraków Open)
- Default Courts: 1-5 (Clay courts)
- Surface: Clay
- Location: ul. Siedleckiego 7, 31-538 Krakow, Poland
- Coordinates: 50.0516°N, 19.9372°E

## Monitoring & Verification

1. **Check Supabase**
   - Visit Supabase dashboard > Tables > tournament_court_mappings
   - Verify rows inserted correctly
   - Check `source` field to track data origin

2. **Test on Page**
   - Visit: `/tournaments/krakow-open`
   - Should see "Court X" labels on matches
   - Court filter should appear when multiple courts scheduled

3. **Debugging**
   - Check browser console for any fetch errors
   - Monitor `fetchCourtForMatch()` in server logs
   - Verify Supabase connection with test query

## Next Steps

1. **Obtain Official ITF Schedule**
   - Contact ITF or check tournament website
   - Extract order of play with court assignments
   - Save as structured data

2. **Populate Database**
   - Use batch import script (Option 2)
   - Verify data in Supabase
   - Test page display

3. **Enable Court Filtering** (future enhancement)
   - Add React state for selected courts
   - Filter matches by court selection
   - Store user preference in localStorage

## API Reference

### fetchCourtForMatch()
```typescript
const court = await fetchCourtForMatch(
  "krakow-open",
  2026,
  "Jannik Sinner",
  "Matteo Berrettini",
  "2026-08-18T10:00:00Z"
);
// Returns: { court_number: "1", court_name: "Centre Court", ... } or null
```

### fetchCourtsForDate()
```typescript
const courts = await fetchCourtsForDate(
  "krakow-open",
  2026,
  "2026-08-18"
);
// Returns: [ { court_number, player1, player2, ... }, ... ]
```

### batchAddCourtMappings()
```typescript
const count = await batchAddCourtMappings([
  { tournament_slug, tournament_year, match_date, ... },
  // ... more mappings
]);
// Returns: number of inserted rows
```

---

**Last Updated**: 2024
**Status**: Ready for ITF data integration
