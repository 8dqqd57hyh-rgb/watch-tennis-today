import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/app/lib/supabase";
import { getCanonicalPlayerSlug, players } from "@/data/playerSlugs";

const resend = new Resend(process.env.RESEND_API_KEY);

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

function getAlertType(match: Match) {
  if (match.status === "LIVE") return "live";
  if (match.status === "UPCOMING") return "next-match";
  if (match.status === "FINISHED") return "result";

  return null;
}

function getSubject(playerName: string, match: Match, alertType: string) {
  if (alertType === "live") {
    return `🎾 ${playerName} is LIVE now`;
  }

  if (alertType === "result") {
    return `✅ ${playerName} match result is available`;
  }

  return `🎾 ${playerName} has an upcoming match`;
}

function getEmailHtml(playerName: string, playerSlug: string, match: Match) {
  const matchUrl = `https://watchtennistoday.com/watch/${match.id}`;
  const playerUrl = `https://watchtennistoday.com/player/${playerSlug}`;

  return `
    <div style="font-family:Arial,sans-serif;padding:24px;line-height:1.5;color:#111;">
      <h1 style="margin:0 0 12px;">
        🎾 ${playerName} match update
      </h1>

      <p style="font-size:16px;margin:0 0 20px;">
        ${match.player1} vs ${match.player2}
      </p>

      <div style="border:1px solid #ddd;border-radius:12px;padding:16px;margin-bottom:20px;">
        <p><strong>Tournament:</strong> ${match.tournament}</p>
        <p><strong>Status:</strong> ${match.status}</p>
        <p><strong>Start time:</strong> ${match.startTime || "Date/time not confirmed yet"}</p>
        <p><strong>Score:</strong> ${match.score || "Not available yet"}</p>
      </div>

      <a
        href="${matchUrl}"
        style="display:inline-block;padding:12px 18px;background:#111;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;"
      >
        Open Match Page
      </a>

      <p style="margin-top:20px;">
        You can also visit the player page:
        <a href="${playerUrl}">${playerName}</a>
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

  return Array.isArray(data) ? data : [];
}

export async function GET(request: Request) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = request.headers.get("authorization");

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

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
      const canonicalPlayerSlug = getCanonicalPlayerSlug(subscription.player_slug || subscription.player_name);

      if (!canonicalPlayerSlug) {
        skipped++;
        continue;
      }

      const canonicalPlayerName = players[canonicalPlayerSlug].name;
      const matches = await fetchPlayerMatches(canonicalPlayerName);

      for (const match of matches.slice(0, 3)) {
        const alertType = getAlertType(match);

        if (!alertType) {
          skipped++;
          continue;
        }

        const { error: logError } = await supabase
          .from("player_alert_logs")
          .insert({
            email: subscription.email,
            player_slug: canonicalPlayerSlug,
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
  subject: getSubject(canonicalPlayerName, match, alertType),
  html: getEmailHtml(canonicalPlayerName, canonicalPlayerSlug, match),
});

console.log("RESEND RESULT:", resendResult);

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