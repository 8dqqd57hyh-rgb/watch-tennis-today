import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getUpcomingFinals } from "@/app/lib/finals";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  return new Resend(apiKey);
}

export async function POST(request: Request) {
  try {
    const resend = getResendClient();
    const body = await request.json();

    const email = String(body.email || "")
      .trim()
      .toLowerCase();

    if (!email || !email.includes("@")) {
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

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    const matchesResponse = await fetch(
      `${baseUrl}/api/matches`,
      {
        cache: "no-store",
      }
    );

    const matchesData = await matchesResponse.json();

    const matches = Array.isArray(matchesData)
      ? matchesData
      : Array.isArray(matchesData.matches)
        ? matchesData.matches
        : [];

    const finals = getUpcomingFinals(matches);

    const finalsHtml =
      finals.length > 0
        ? finals
            .map(
              (match: any) => `
                <div style="margin-bottom:24px;padding:16px;border:1px solid #ddd;border-radius:12px;">
                  <h2>
                    ${match.player1} vs ${match.player2}
                  </h2>

                  <p>
                    <strong>Tournament:</strong>
                    ${match.tournament}
                  </p>

                  <p>
                    <strong>Category:</strong>
                    ${match.category}
                  </p>

                  <p>
                    <strong>Start:</strong>
                    ${new Date(
                      match.startTime
                    ).toLocaleString()}
                  </p>
                </div>
              `
            )
            .join("")
        : `
          <p>
            No ATP/WTA finals are currently listed,
            but we will notify you when new finals appear.
          </p>
        `;

    await resend.emails.send({
      from:
        "Watch Tennis Today <onboarding@resend.dev>",

      to: email,

      subject:
        finals.length > 0
          ? "🏆 ATP/WTA Finals Alerts"
          : "🎾 Tennis Finals Alerts",

      html: `
        <div style="font-family:Arial,sans-serif;padding:24px;">
          <h1>
            🎾 You are subscribed to ATP/WTA Finals Alerts
          </h1>

          <p>
            We will notify you when new ATP or WTA finals appear.
          </p>

          ${finalsHtml}
        </div>
      `,
    });
const emailResult = await resend.emails.send({
  from: "Watch Tennis Today <onboarding@resend.dev>",
  to: email,
  subject:
    finals.length > 0
      ? "🏆 ATP/WTA Finals Alerts"
      : "🎾 Tennis Finals Alerts",
  html: `
    <div style="font-family:Arial,sans-serif;padding:24px;">
      <h1>🎾 You are subscribed to ATP/WTA Finals Alerts</h1>
      <p>We will notify you when new ATP or WTA finals appear.</p>
      ${finalsHtml}
    </div>
  `,
});

console.log("RESEND RESULT:", emailResult);
    return NextResponse.json({
      ok: true,
      message: "Subscribed successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        message: "Server error",
      },
      {
        status: 500,
      }
    );
  }
}