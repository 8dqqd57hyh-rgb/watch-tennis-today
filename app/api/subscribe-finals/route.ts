import { NextResponse } from "next/server";
import { Resend } from "resend";
import { normalizeEmail, isValidEmail } from "@/app/lib/emailValidation";
import { escapeHtml } from "@/app/lib/escapeHtml";
import { getUpcomingFinals } from "@/app/lib/finals";
import { checkSubscriptionRateLimit } from "@/app/lib/rateLimit";

type FinalsMatch = {
  player1?: string;
  player2?: string;
  tournament?: string;
  category?: string;
  startTime?: string | number | Date;
};

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  return new Resend(apiKey);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body.email);
    const rateLimitResult = checkSubscriptionRateLimit(request, email || undefined);

    if (rateLimitResult) {
      return rateLimitResult;
    }

    if (!isValidEmail(email)) {
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

    const resend = getResendClient();
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
              (match: FinalsMatch) => `
                <div style="margin-bottom:24px;padding:16px;border:1px solid #ddd;border-radius:12px;">
                  <h2>
                    ${escapeHtml(match.player1)} vs ${escapeHtml(match.player2)}
                  </h2>

                  <p>
                    <strong>Tournament:</strong>
                    ${escapeHtml(match.tournament)}
                  </p>

                  <p>
                    <strong>Category:</strong>
                    ${escapeHtml(match.category)}
                  </p>

                  <p>
                    <strong>Start:</strong>
                    ${escapeHtml(
                      match.startTime
                        ? new Date(match.startTime).toLocaleString()
                        : "Time to be confirmed"
                    )}
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
