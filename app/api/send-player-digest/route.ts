import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/app/lib/supabase";

export const dynamic = "force-dynamic";

type Subscription = {
  email: string;
  player_slug: string;
  player_name: string;
};

type Match = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category: string;
  status: string;
  score?: string | null;
  startTime?: string | null;
};

type PlayerDigest = {
  playerName: string;
  playerSlug: string;
  live: Match[];
  upcoming: Match[];
  results: Match[];
};

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured. Digest was not sent.");
  }

  return new Resend(apiKey);
}

function isBrowserProbe(request: Request) {
  const userAgent = request.headers.get("user-agent") || "";
  const accept = request.headers.get("accept") || "";

  return (
    accept.includes("text/html") ||
    /Chrome|Safari|Firefox|Edg|OPR/i.test(userAgent)
  );
}

function normalizeName(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matchIncludesPlayer(match: Match, playerName: string) {
  const targetParts = normalizeName(playerName).split(/\s+/).filter(Boolean);

  if (targetParts.length === 0) return false;

  return [match.player1, match.player2].some((sideName) => {
    const side = normalizeName(sideName || "");

    if (!side) return false;
    if (side === normalizeName(playerName)) return true;

    return targetParts.every((part) => side.includes(part));
  });
}

function getOpponent(playerName: string, match: Match) {
  const player1Matches = matchIncludesPlayer({ ...match, player2: "" }, playerName);
  const player2Matches = matchIncludesPlayer({ ...match, player1: "" }, playerName);

  if (player1Matches && match.player2) return match.player2;
  if (player2Matches && match.player1) return match.player1;

  return null;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatStartTime(startTime?: string | null) {
  if (!startTime) return "Time TBA";

  const date = new Date(startTime);
  if (Number.isNaN(date.getTime())) return "Time TBA";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Warsaw",
  }).format(date);
}

function getMatchTime(match: Match) {
  const time = new Date(match.startTime || "").getTime();
  return Number.isNaN(time) ? Number.MAX_SAFE_INTEGER : time;
}

function getDigestDateKey() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://watchtennistoday.com").replace(/\/$/, "");
}

async function fetchPlayerMatches(playerName: string): Promise<Match[]> {
  const response = await fetch(
    `${getSiteUrl()}/api/matches?playerName=${encodeURIComponent(playerName)}`,
    { cache: "no-store" }
  );

  if (!response.ok) return [];

  const data = await response.json();
  const matches = Array.isArray(data) ? data : [];

  return matches.filter((match) => matchIncludesPlayer(match, playerName));
}

function buildDigest(playerName: string, playerSlug: string, matches: Match[]): PlayerDigest {
  const sortedMatches = [...matches].sort((a, b) => getMatchTime(a) - getMatchTime(b));

  return {
    playerName,
    playerSlug,
    live: sortedMatches.filter((match) => match.status === "LIVE").slice(0, 3),
    upcoming: sortedMatches.filter((match) => match.status === "UPCOMING").slice(0, 3),
    results: sortedMatches.filter((match) => match.status === "FINISHED").slice(0, 2),
  };
}

function hasDigestContent(digest: PlayerDigest) {
  return digest.live.length + digest.upcoming.length + digest.results.length > 0;
}

function renderMatchRow(playerName: string, match: Match, label: string) {
  const opponent = getOpponent(playerName, match);
  const title = opponent
    ? `${escapeHtml(playerName)} vs ${escapeHtml(opponent)}`
    : `${escapeHtml(match.player1)} vs ${escapeHtml(match.player2)}`;
  const matchUrl = `${getSiteUrl()}/watch/${encodeURIComponent(match.id)}`;

  return `
    <tr>
      <td style="padding:12px 0;border-top:1px solid #eee;vertical-align:top;">
        <div style="font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#16803c;">${label}</div>
        <a href="${matchUrl}" style="font-size:16px;font-weight:800;color:#111;text-decoration:none;">${title}</a>
        <div style="margin-top:4px;color:#555;font-size:14px;">
          ${escapeHtml(match.tournament || "Tournament TBA")} · ${escapeHtml(formatStartTime(match.startTime))}
          ${match.score ? ` · ${escapeHtml(match.score)}` : ""}
        </div>
      </td>
    </tr>
  `;
}

function getDigestHtml(email: string, digests: PlayerDigest[]) {
  const dateLabel = new Intl.DateTimeFormat("en", {
    dateStyle: "full",
    timeZone: "Europe/Warsaw",
  }).format(new Date());

  const sections = digests
    .filter(hasDigestContent)
    .map((digest) => {
      const rows = [
        ...digest.live.map((match) => renderMatchRow(digest.playerName, match, "Live now")),
        ...digest.upcoming.map((match) => renderMatchRow(digest.playerName, match, "Next match")),
        ...digest.results.map((match) => renderMatchRow(digest.playerName, match, "Recent result")),
      ].join("");

      return `
        <section style="margin:24px 0;padding:18px;border:1px solid #e5e7eb;border-radius:16px;background:#fff;">
          <h2 style="margin:0 0 8px;font-size:22px;line-height:1.2;">${escapeHtml(digest.playerName)}</h2>
          <p style="margin:0 0 10px;color:#666;">
            <a href="${getSiteUrl()}/player/${encodeURIComponent(digest.playerSlug)}" style="color:#16803c;font-weight:700;">Open player hub →</a>
          </p>
          <table style="width:100%;border-collapse:collapse;">${rows}</table>
        </section>
      `;
    })
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;background:#f6f7f8;padding:24px;color:#111;">
      <div style="max-width:680px;margin:0 auto;">
        <p style="margin:0 0 8px;font-size:13px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:#16803c;">
          Watch Tennis Today
        </p>
        <h1 style="margin:0 0 8px;font-size:32px;line-height:1.15;">🎾 Your tennis day</h1>
        <p style="margin:0 0 18px;color:#555;font-size:16px;">${escapeHtml(dateLabel)} · Updates for the players you follow.</p>

        ${sections}

        <div style="margin-top:24px;padding:18px;border-radius:16px;background:#111;color:#fff;">
          <h2 style="margin:0 0 8px;font-size:20px;">Want more matches?</h2>
          <p style="margin:0 0 14px;color:#e5e7eb;">Add more players to My Players and tomorrow's digest becomes your personal tennis dashboard.</p>
          <a href="${getSiteUrl()}/my-players" style="display:inline-block;padding:12px 16px;border-radius:10px;background:#fff;color:#111;font-weight:800;text-decoration:none;">Open My Players</a>
        </div>

        <p style="margin-top:20px;color:#777;font-size:12px;line-height:1.5;">
          Sent to ${escapeHtml(email)} because this address follows players on Watch Tennis Today.
        </p>
      </div>
    </div>
  `;
}

async function alreadySentDigest(email: string, dateKey: string) {
  const { data, error } = await supabase
    .from("player_alert_logs")
    .select("email")
    .eq("email", email)
    .eq("player_slug", "daily-digest")
    .eq("match_id", dateKey)
    .eq("alert_type", "daily-digest")
    .maybeSingle();

  if (error) return false;

  return Boolean(data);
}

async function logDigestSent(email: string, dateKey: string) {
  const { error } = await supabase.from("player_alert_logs").insert({
    email,
    player_slug: "daily-digest",
    match_id: dateKey,
    alert_type: "daily-digest",
  });

  return !error;
}

export async function GET(request: Request) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = request.headers.get("authorization");

    if (!cronSecret) {
      return NextResponse.json(
        { ok: false, message: "CRON_SECRET is not configured. Digest was not sent." },
        { status: 500 }
      );
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      if (isBrowserProbe(request)) {
        return NextResponse.json({
          ok: true,
          endpoint: "send-player-digest",
          protected: true,
          sent: 0,
          skipped: 0,
          message: "This is a protected cron endpoint. No player digest was sent from this browser request.",
        });
      }

      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const resend = getResendClient();

    const { data: subscriptions, error } = await supabase
      .from("player_subscriptions")
      .select("email, player_slug, player_name")
      .eq("confirmed", true);

    if (error) {
      console.error(error);
      return NextResponse.json({ ok: false, message: "Database error" }, { status: 500 });
    }

    const byEmail = new Map<string, Subscription[]>();

    for (const subscription of (subscriptions || []) as Subscription[]) {
      const list = byEmail.get(subscription.email) || [];
      list.push(subscription);
      byEmail.set(subscription.email, list);
    }

    const dateKey = getDigestDateKey();
    let sent = 0;
    let skipped = 0;

    for (const [email, emailSubscriptions] of byEmail.entries()) {
      if (await alreadySentDigest(email, dateKey)) {
        skipped++;
        continue;
      }

      const uniquePlayers = Array.from(
        new Map(emailSubscriptions.map((subscription) => [subscription.player_slug, subscription])).values()
      ).slice(0, 12);

      const digests: PlayerDigest[] = [];

      for (const subscription of uniquePlayers) {
        const matches = await fetchPlayerMatches(subscription.player_name);
        const digest = buildDigest(subscription.player_name, subscription.player_slug, matches);

        if (hasDigestContent(digest)) {
          digests.push(digest);
        }
      }

      if (digests.length === 0) {
        skipped++;
        continue;
      }

      const recipientEmail =
        process.env.ALERT_TEST_MODE === "true"
          ? "8dqqd57hyh@privaterelay.appleid.com"
          : email;

      const resendResult = await resend.emails.send({
        from: "Watch Tennis Today <alerts@watchtennistoday.com>",
        to: recipientEmail,
        subject: "🎾 Your tennis day: followed players, live matches and results",
        html: getDigestHtml(email, digests),
      });

      if (resendResult.error) {
        console.error("RESEND DIGEST ERROR:", resendResult.error);
        skipped++;
        continue;
      }

      await logDigestSent(email, dateKey);
      sent++;
    }

    return NextResponse.json({
      ok: true,
      sent,
      skipped,
      subscriptions: subscriptions?.length || 0,
      recipients: byEmail.size,
      dateKey,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { ok: false, message: "Failed to send player digest" },
      { status: 500 }
    );
  }
}
