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

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured. Player alerts were not sent.");
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

function getAlertType(match: Match) {
  if (match.status === "LIVE") return "live";
  if (match.status === "UPCOMING") return "next-match";
  if (match.status === "FINISHED") return "result";

  return null;
}

function getSubject(playerName: string, match: Match, alertType: string) {
  const opponent = getOpponent(playerName, match);

  if (alertType === "live") {
    return opponent
      ? `🎾 ${playerName} vs ${opponent} is LIVE now`
      : `🎾 ${playerName} is LIVE now`;
  }

  if (alertType === "result") {
    return opponent
      ? `✅ ${playerName} vs ${opponent} result is available`
      : `✅ ${playerName} match result is available`;
  }

  return opponent
    ? `🎾 ${playerName} plays ${opponent} next`
    : `🎾 ${playerName} has an upcoming match`;
}

function getOpponent(playerName: string, match: Match) {
  const player1Matches = matchIncludesPlayer(
    { ...match, player2: "" },
    playerName
  );
  const player2Matches = matchIncludesPlayer(
    { ...match, player1: "" },
    playerName
  );

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
  if (!startTime) return "Date/time not confirmed yet";

  const date = new Date(startTime);

  if (Number.isNaN(date.getTime())) return startTime;

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Warsaw",
  }).format(date);
}

function getEmailHtml(playerName: string, playerSlug: string, match: Match) {
  const matchUrl = `https://watchtennistoday.com/watch/${encodeURIComponent(match.id)}`;
  const playerUrl = `https://watchtennistoday.com/player/${playerSlug}`;
  const opponent = getOpponent(playerName, match);
  const title = opponent
    ? `${escapeHtml(playerName)} vs ${escapeHtml(opponent)}`
    : `${escapeHtml(match.player1)} vs ${escapeHtml(match.player2)}`;

  return `
    <div style="font-family:Arial,sans-serif;padding:24px;line-height:1.5;color:#111;max-width:640px;margin:0 auto;">
      <p style="margin:0 0 8px;font-size:13px;font-weight:bold;letter-spacing:.12em;text-transform:uppercase;color:#16803c;">
        Watch Tennis Today alert
      </p>

      <h1 style="margin:0 0 12px;font-size:28px;line-height:1.2;">
        🎾 ${title}
      </h1>

      <p style="font-size:16px;margin:0 0 20px;color:#444;">
        This alert was sent because you follow <strong>${escapeHtml(playerName)}</strong>.
      </p>

      <div style="border:1px solid #ddd;border-radius:12px;padding:16px;margin-bottom:20px;background:#fafafa;">
        <p><strong>Tournament:</strong> ${escapeHtml(match.tournament || "Unknown tournament")}</p>
        <p><strong>Status:</strong> ${escapeHtml(match.status)}</p>
        <p><strong>Start time:</strong> ${escapeHtml(formatStartTime(match.startTime))}</p>
        <p><strong>Score:</strong> ${escapeHtml(match.score || "Not available yet")}</p>
      </div>

      <a
        href="${matchUrl}"
        style="display:inline-block;padding:12px 18px;background:#111;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;"
      >
        Open Match Page
      </a>

      <p style="margin-top:20px;color:#555;">
        Player page:
        <a href="${playerUrl}">${escapeHtml(playerName)}</a>
      </p>
    </div>
  `;
}

async function fetchPlayerMatches(playerName: string): Promise<Match[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://watchtennistoday.com";

  const response = await fetch(
    `${baseUrl}/api/matches?playerName=${encodeURIComponent(playerName)}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  const matches = Array.isArray(data) ? data : [];

  // Safety net: never send a player alert for a match that does not include
  // the subscribed player, even if an upstream data source returns a fallback.
  return matches.filter((match) => matchIncludesPlayer(match, playerName));
}

export async function GET(request: Request) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = request.headers.get("authorization");

    if (!cronSecret) {
      return NextResponse.json(
        {
          ok: false,
          message: "CRON_SECRET is not configured. Player alerts were not sent.",
        },
        { status: 500 }
      );
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      if (isBrowserProbe(request)) {
        return NextResponse.json({
          ok: true,
          endpoint: "send-player-alerts",
          protected: true,
          sent: 0,
          skipped: 0,
          message:
            "This is a protected cron endpoint. No player alerts were sent from this browser request.",
        });
      }

      return NextResponse.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 }
      );
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

    let sent = 0;
    let skipped = 0;

    for (const subscription of (subscriptions || []) as Subscription[]) {
      const matches = await fetchPlayerMatches(subscription.player_name);

      for (const match of matches.slice(0, 3)) {
        const alertType = getAlertType(match);

        if (!alertType || !matchIncludesPlayer(match, subscription.player_name)) {
          skipped++;
          continue;
        }

        const { error: logError } = await supabase
          .from("player_alert_logs")
          .insert({
            email: subscription.email,
            player_slug: subscription.player_slug,
            match_id: match.id,
            alert_type: alertType,
          });

        if (logError) {
          skipped++;
          continue;
        }

        const recipientEmail =
          process.env.ALERT_TEST_MODE === "true"
            ? "8dqqd57hyh@privaterelay.appleid.com"
            : subscription.email;

        const resendResult = await resend.emails.send({
          from: "Watch Tennis Today <alerts@watchtennistoday.com>",
          to: recipientEmail,
          subject: getSubject(subscription.player_name, match, alertType),
          html: getEmailHtml(subscription.player_name, subscription.player_slug, match),
        });

        if (resendResult.error) {
          console.error("RESEND ERROR:", resendResult.error);
          skipped++;
          continue;
        }

        sent++;
        console.log("RESEND RESULT:", resendResult);
      }
    }


    return NextResponse.json({
      ok: true,
      sent,
      skipped,
      subscriptions: subscriptions?.length || 0,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { ok: false, message: "Failed to send player alerts" },
      { status: 500 }
    );
  }
}
