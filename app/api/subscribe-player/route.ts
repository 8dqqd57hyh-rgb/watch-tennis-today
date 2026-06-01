import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/app/lib/supabase";
import { getCanonicalPlayerSlug, players } from "@/data/playerSlugs";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = String(body.email || "")
      .trim()
      .toLowerCase();

    const requestedPlayer = String(body.playerSlug || body.playerName || "");
    const canonicalPlayerSlug = getCanonicalPlayerSlug(requestedPlayer);
    const playerSlug = canonicalPlayerSlug || "";
    const playerName = canonicalPlayerSlug ? players[canonicalPlayerSlug].name : "";
    const source = String(body.source || "player-page");

    if (!email.includes("@")) {
      return NextResponse.json(
        {
          ok: false,
          message: "Invalid email",
        },
        {
          status: 400,
        }
      );
    }

    if (!canonicalPlayerSlug) {
      return NextResponse.json(
        {
          ok: false,
          message: "Unknown player",
        },
        {
          status: 400,
        }
      );
    }

    const { error } = await supabase
      .from("player_subscriptions")
      .insert({
        email,
        player_slug: playerSlug,
        player_name: playerName,
        source,
      });

    if (error) {
      console.error(error);

      return NextResponse.json(
        {
          ok: false,
          message: "Database error",
        },
        {
          status: 500,
        }
      );
    }

    await resend.emails.send({
      from:
        "Watch Tennis Today <onboarding@resend.dev>",

      to: email,

      subject: `🎾 ${playerName} is in your tennis digest`,

      html: `
        <div style="font-family:Arial;padding:24px;">
          <h1>
            🎾 ${playerName} is now in your tennis digest
          </h1>

          <p>
            We will notify you when:
          </p>

          <ul>
            <li>Your daily player digest</li>
            <li>Next match updates</li>
            <li>Live status and results</li>
          </ul>

          <a
            href="https://watchtennistoday.com/player/${playerSlug}"
            style="display:inline-block;padding:12px 18px;background:#111;color:#fff;border-radius:8px;text-decoration:none;"
          >
            View Player Hub
          </a>
        </div>
      `,
    });

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
      },
      {
        status: 500,
      }
    );
  }
}