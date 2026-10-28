import { NextResponse } from "next/server";
import { readEmailUnsubscribeToken } from "@/app/lib/emailUnsubscribe";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export const runtime = "nodejs";

const privateHeaders = {
  "Cache-Control": "no-store",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow",
};

function respond(request: Request, ok: boolean, status: number, token: string) {
  if (request.headers.get("accept")?.includes("text/html")) {
    const url = new URL("/unsubscribe", request.url);
    if (ok) url.searchParams.set("done", "1");
    else {
      url.searchParams.set("error", String(status));
      if (token.length <= 2048) url.searchParams.set("token", token);
    }
    const response = NextResponse.redirect(url, 303);
    for (const [name, value] of Object.entries(privateHeaders)) response.headers.set(name, value);
    return response;
  }
  return NextResponse.json({ ok }, { status, headers: privateHeaders });
}

export function GET(request: Request) {
  const url = new URL("/unsubscribe", request.url);
  const token = new URL(request.url).searchParams.get("token");
  if (token && token.length <= 2048) url.searchParams.set("token", token);
  const response = NextResponse.redirect(url, 303);
  for (const [name, value] of Object.entries(privateHeaders)) response.headers.set(name, value);
  return response;
}

export async function POST(request: Request) {
  let token = "";
  try {
    if (request.headers.get("content-type")?.includes("application/json")) {
      const body: unknown = await request.json();
      if (body && typeof body === "object" && "token" in body && typeof body.token === "string") {
        token = body.token;
      }
    } else {
      const body = await request.formData();
      const formToken = body.get("token");
      if (typeof formToken === "string") token = formToken;
      else if (body.get("List-Unsubscribe") === "One-Click") {
        token = new URL(request.url).searchParams.get("token") || "";
      }
    }
  } catch {
    return respond(request, false, 400, token);
  }

  const target = readEmailUnsubscribeToken(token);
  if (!target) return respond(request, false, 400, token);
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return respond(request, false, 503, token);
  }

  try {
    const table = target.kind === "general" ? "email_subscriptions" : "player_subscriptions";
    const changes = target.kind === "general"
      ? { status: "unsubscribed", updated_at: new Date().toISOString() }
      : { confirmed: false };
    const { error } = await supabaseAdmin.from(table).update(changes).eq("email", target.email);
    if (error) {
      console.error("Email unsubscribe database error:", error.message);
      return respond(request, false, 500, token);
    }
    return respond(request, true, 200, token);
  } catch {
    console.error("Email unsubscribe storage request failed.");
    return respond(request, false, 500, token);
  }
}