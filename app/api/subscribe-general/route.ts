import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/app/lib/supabase";

const ALLOWED_CONTEXT_TYPES = new Set([
  "daily",
  "streaming",
  "watch",
  "guide",
  "tournament",
  "general",
]);

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitizeText(value: unknown, fallback = "") {
  return String(value || fallback)
    .trim()
    .slice(0, 180);
}

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://watchtennistoday.com";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = sanitizeText(body.email).toLowerCase();
    const contextType = sanitizeText(body.contextType, "general");
    const contextValue = sanitizeText(body.contextValue, "site");
    const source = sanitizeText(body.source, "email-capture");

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, message: "Invalid email" },
        { status: 400 }
      );
    }

    if (!ALLOWED_CONTEXT_TYPES.has(contextType)) {
      return NextResponse.json(
        { ok: false, message: "Invalid signup context" },
        { status: 400 }
      );
    }

    // Best-effort persistence. If the optional table has not been created yet,
    // do not break the user-facing signup flow; report the warning in logs so it
    // can be wired during production setup.
    const { error: databaseError } = await supabase
      .from("email_subscriptions")
      .upsert(
        {
          email,
          context_type: contextType,
          context_value: contextValue,
          source,
          status: "active",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "email,context_type,context_value" }
      );

    if (databaseError) {
      console.warn("Email subscription database warning:", databaseError.message);
    }

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "Watch Tennis Today <onboarding@resend.dev>",
        to: email,
        subject: "🎾 You are signed up for useful tennis updates",
        html: `
          <div style="font-family:Arial,sans-serif;padding:24px;line-height:1.6;color:#111;">
            <h1 style="margin:0 0 16px;">You are signed up</h1>
            <p>Thanks for subscribing to Watch Tennis Today updates.</p>
            <p><strong>Signup type:</strong> ${contextType}</p>
            <p><strong>Related page:</strong> ${contextValue}</p>
            <p>We focus on legal viewing guidance, match schedules and useful tennis reminders. We do not send links to unofficial streams.</p>
            <p><a href="${getBaseUrl()}/newsletter-confirmation" style="display:inline-block;padding:12px 18px;background:#111;color:#fff;border-radius:8px;text-decoration:none;">View subscription details</a></p>
          </div>
        `,
      });
    }

    return NextResponse.json({
      ok: true,
      persisted: !databaseError,
    });
  } catch (error) {
    console.error("General subscription error:", error);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}
