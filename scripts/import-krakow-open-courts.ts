import { batchAddCourtMappings } from "../app/lib/supabaseCourtData";
import { krakowOpenOfficialSchedule } from "../data/krakowOpenOfficialSchedule";

async function main() {
  const rows = krakowOpenOfficialSchedule.map((row) => ({
    tournament_slug: row.tournamentSlug,
    tournament_year: row.year,
    match_date: row.date,
    match_time: row.time,
    player1: row.player1,
    player2: row.player2,
    court_number: row.courtNumber,
    court_name: row.courtName ?? null,
    surface: row.surface ?? null,
    capacity: row.capacity ?? null,
    round: row.round ?? null,
    source: row.source,
    notes: "Imported from official ITF order of play",
  }));

  const count = await batchAddCourtMappings(rows as any);
  console.log(`Imported ${count} Kraków Open court mapping rows`);
}

main().catch((error) => {
  console.error("Failed to import Kraków Open court mappings:", error);
  process.exit(1);
});
