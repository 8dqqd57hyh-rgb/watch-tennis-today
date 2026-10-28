import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { isValidEmail, normalizeEmail } from "./emailValidation";
import { escapeHtml } from "./escapeHtml";
import { getBaseUrl } from "./baseUrl";

export type EmailSubscriptionKind = "general" | "player";

export type EmailUnsubscribeTarget = {
  email: string;
  kind: EmailSubscriptionKind;
};

function getEncryptionKey() {
  const secret = process.env.EMAIL_UNSUBSCRIBE_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret || Buffer.byteLength(secret) < 32) {
    throw new Error("Email unsubscribe secret is not configured.");
  }
  return createHash("sha256").update(`watch-tennis-today:unsubscribe:v1:${secret}`).digest();
}

export function createEmailUnsubscribeToken(email: string, kind: EmailSubscriptionKind) {
  const normalizedEmail = normalizeEmail(email);
  if (!isValidEmail(normalizedEmail) || !["general", "player"].includes(kind)) {
    throw new Error("Invalid unsubscribe target.");
  }

  const nonce = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getEncryptionKey(), nonce);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify({ email: normalizedEmail, kind }), "utf8"),
    cipher.final(),
  ]);
  return `v1.${Buffer.concat([nonce, cipher.getAuthTag(), encrypted]).toString("base64url")}`;
}

export function readEmailUnsubscribeToken(token: string): EmailUnsubscribeTarget | null {
  if (token.length > 2048 || !/^v1\.[A-Za-z0-9_-]+$/.test(token)) return null;

  try {
    const payload = Buffer.from(token.slice(3), "base64url");
    if (payload.length <= 28 || payload.toString("base64url") !== token.slice(3)) return null;
    const decipher = createDecipheriv("aes-256-gcm", getEncryptionKey(), payload.subarray(0, 12));
    decipher.setAuthTag(payload.subarray(12, 28));
    const decrypted = Buffer.concat([decipher.update(payload.subarray(28)), decipher.final()]);
    const target: unknown = JSON.parse(decrypted.toString("utf8"));
    if (!target || typeof target !== "object") return null;
    const { email, kind } = target as Record<string, unknown>;
    if (typeof email !== "string" || !isValidEmail(email) || normalizeEmail(email) !== email) return null;
    if (kind !== "general" && kind !== "player") return null;
    return { email, kind };
  } catch {
    return null;
  }
}

export function createEmailUnsubscribeMessage(email: string, kind: EmailSubscriptionKind) {
  const token = createEmailUnsubscribeToken(email, kind);
  const url = new URL("/unsubscribe", getBaseUrl());
  url.searchParams.set("token", token);
  const oneClickUrl = new URL("/api/unsubscribe", getBaseUrl());
  oneClickUrl.searchParams.set("token", token);
  const label = kind === "player" ? "Unsubscribe from all player alerts" : "Unsubscribe from tennis updates";
  return {
    url: url.href,
    headers: {
      "List-Unsubscribe": `<${oneClickUrl.href}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
    html: `<p style="margin-top:24px;font-size:14px;"><a href="${escapeHtml(url.href)}" style="color:#166534;">${label}</a></p>`,
  };
}