import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

try { process.loadEnvFile?.(".env.local"); } catch { /* Environment may already be injected. */ }

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");

const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const timeoutMs = 15_000;

function fingerprint(html: string) {
  const stableText = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
  return createHash("sha256").update(stableText).digest("hex");
}

async function fetchFingerprint(sourceUrl: string) {
  const response = await fetch(sourceUrl, { signal: AbortSignal.timeout(timeoutMs), headers: { "user-agent": "WatchTennisToday verification bot/1.0" } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return fingerprint(await response.text());
}

async function main() {
  const { data, error } = await supabase.from("streaming_offers").select("*");
  if (error) throw error;

  for (const row of data ?? []) {
    const checkedAt = new Date().toISOString();
    const previous = (row.source_fingerprints ?? {}) as Record<string, string>;
    const next: Record<string, string> = {};
    const failures: Record<string, string> = {};

    for (const sourceUrl of Array.isArray(row.source_urls) ? row.source_urls : []) {
      try { next[sourceUrl] = await fetchFingerprint(sourceUrl); }
      catch (error) { failures[sourceUrl] = error instanceof Error ? error.message : "Unknown fetch error"; }
    }

    const changed = Object.fromEntries(Object.entries(next).filter(([sourceUrl, hash]) => previous[sourceUrl] && previous[sourceUrl] !== hash));
    const isManual = row.verification_method === "manual";
    const outcome = Object.keys(failures).length ? "fetch-failed" : Object.keys(changed).length ? "content-changed" : "unchanged";

    const { error: auditError } = await supabase.from("streaming_offer_audit_log").insert({
      offer_id: row.id, checked_at: checkedAt, outcome,
      changed_fields: changed, previous_values: Object.fromEntries(Object.keys(changed).map((sourceUrl) => [sourceUrl, previous[sourceUrl]])),
      details: Object.keys(failures).length ? JSON.stringify(failures) : isManual ? "Manual verified record preserved; review audit before changing it." : null,
    });
    if (auditError) throw auditError;

    if (!isManual) {
      const update = Object.keys(failures).length || Object.keys(changed).length
        ? { status: "needs-review", updated_at: checkedAt }
        : { source_fingerprints: next, last_checked_at: checkedAt, updated_at: checkedAt };
      const { error: updateError } = await supabase.from("streaming_offers").update(update).eq("id", row.id);
      if (updateError) throw updateError;
    }

    console.log(JSON.stringify({ offerId: row.id, outcome, manualRecordPreserved: isManual, changedSources: Object.keys(changed), failures }));
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
