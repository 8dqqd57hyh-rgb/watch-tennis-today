import { NextResponse } from "next/server";
import { Resend } from "resend";
import { normalizeEmail, isValidEmail } from "@/app/lib/emailValidation";
import { escapeHtml } from "@/app/lib/escapeHtml";
import { checkSubscriptionRateLimit } from "@/app/lib/rateLimit";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

const ALLOWED_CONTEXT_TYPES = new Set([
  "daily",
  "streaming",
  "watch",
  "guide",
  "tournament",
  "general",
]);

function sanitizeText(value: unknown, fallback = "") {
  return String(value || fallback)
    .trim()
    .slice(0, 180);
}

function getBaseUrl() {
  const fallback = "https://watchtennistoday.com";
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || fallback;

  try {
    const url = new URL(configuredUrl);

    if (url.protocol === "https:" || url.protocol === "http:") {
      return url.origin;
    }
  } catch {
    return fallback;
  }

  return fallback;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body.email);
    const rateLimitResult = checkSubscriptionRateLimit(request, email || undefined);

    if (rateLimitResult) {
      return rateLimitResult;
    }

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

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Email subscription storage is not configured.");
      return NextResponse.json(
        { ok: false, persisted: false, message: "Subscription storage is unavailable" },
        { status: 503 }
      );
    }

    const { error: databaseError } = await supabaseAdmin
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
      console.error("Email subscription database error:", databaseError.message);
      return NextResponse.json(
        { ok: false, persisted: false, message: "Could not save subscription" },
        { status: 500 }
      );
    }

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const baseUrl = getBaseUrl();
      await resend.emails.send({
        from: "Watch Tennis Today <onboarding@resend.dev>",
        to: email,
        subject: "🎾 You are signed up for useful tennis updates",
        html: `
          <div style="font-family:Arial,sans-serif;padding:24px;line-height:1.6;color:#111;">
            <h1 style="margin:0 0 16px;">You are signed up</h1>
            <p>Thanks for subscribing to Watch Tennis Today updates.</p>
            <p><strong>Signup type:</strong> ${escapeHtml(contextType)}</p>
            <p><strong>Related page:</strong> ${escapeHtml(contextValue)}</p>
            <p>We focus on legal viewing guidance, match schedules and useful tennis reminders. We do not send links to unofficial streams.</p>
            <p><a href="${baseUrl}/newsletter-confirmation" style="display:inline-block;padding:12px 18px;background:#111;color:#fff;border-radius:8px;text-decoration:none;">View subscription details</a></p>
          </div>
        `,
      });
    }

    return NextResponse.json({
      ok: true,
      persisted: true,
    });
  } catch (error) {
    console.error("General subscription error:", error);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}
