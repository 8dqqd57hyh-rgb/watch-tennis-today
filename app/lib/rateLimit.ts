import { NextResponse } from "next/server";

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitEntry>();

function pruneExpiredBuckets(now: number) {
  if (buckets.size < 1000) return;

  for (const [key, entry] of buckets) {
    if (entry.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const firstForwardedIp = forwardedFor?.split(",")[0]?.trim();

  return (
    firstForwardedIp ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

export function checkRateLimit({ key, limit, windowMs }: RateLimitOptions) {
  const now = Date.now();
  pruneExpiredBuckets(now);

  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (existing.count >= limit) {
    return { limited: true, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { limited: false, remaining: limit - existing.count, resetAt: existing.resetAt };
}

export function rateLimitResponse(resetAt: number) {
  const retryAfterSeconds = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));

  return NextResponse.json(
    {
      ok: false,
      message: "Too many subscription attempts. Please try again later.",
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSeconds),
      },
    }
  );
}

export function checkSubscriptionRateLimit(request: Request, normalizedEmail?: string) {
  const ip = getClientIp(request);
  const ipLimit = checkRateLimit({
    key: `subscription:ip:${ip}`,
    limit: 20,
    windowMs: 60 * 60 * 1000,
  });

  if (ipLimit.limited) {
    return rateLimitResponse(ipLimit.resetAt);
  }

  if (normalizedEmail) {
    const emailLimit = checkRateLimit({
      key: `subscription:email:${normalizedEmail}`,
      limit: 5,
      windowMs: 60 * 60 * 1000,
    });

    if (emailLimit.limited) {
      return rateLimitResponse(emailLimit.resetAt);
    }
  }

  return null;
}
