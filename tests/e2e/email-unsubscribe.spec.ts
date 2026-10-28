import { expect, test } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { createEmailUnsubscribeToken, readEmailUnsubscribeToken } from "../../app/lib/emailUnsubscribe";

test.describe("email unsubscribe tokens", () => {
  let previousSecret: string | undefined;

  test.beforeEach(() => {
    previousSecret = process.env.EMAIL_UNSUBSCRIBE_SECRET;
    process.env.EMAIL_UNSUBSCRIBE_SECRET = "test-only-unsubscribe-secret-at-least-32-characters";
  });

  test.afterEach(() => {
    if (previousSecret === undefined) delete process.env.EMAIL_UNSUBSCRIBE_SECRET;
    else process.env.EMAIL_UNSUBSCRIBE_SECRET = previousSecret;
  });

  for (const kind of ["general", "player"] as const) {
    test(`${kind} tokens preserve the normalized target without exposing the address`, () => {
      const token = createEmailUnsubscribeToken("  FAN@Example.COM  ", kind);
      expect(readEmailUnsubscribeToken(token)).toEqual({ email: "fan@example.com", kind });
      expect(token).not.toContain("fan@example.com");
      expect(Buffer.from(token.slice(3), "base64url").toString("utf8")).not.toContain("fan@example.com");
    });
  }

  test("tokens are randomized and reject tampering", () => {
    const token = createEmailUnsubscribeToken("fan@example.com", "general");
    expect(createEmailUnsubscribeToken("fan@example.com", "general")).not.toBe(token);
    const payload = Buffer.from(token.slice(3), "base64url");
    payload[28] ^= 1;
    expect(readEmailUnsubscribeToken(`v1.${payload.toString("base64url")}`)).toBeNull();
  });

  test("tokens reject a different secret", () => {
    const token = createEmailUnsubscribeToken("fan@example.com", "player");
    process.env.EMAIL_UNSUBSCRIBE_SECRET = "another-test-only-secret-at-least-32-characters";
    expect(readEmailUnsubscribeToken(token)).toBeNull();
  });

  test("malformed and oversized tokens do not identify a subscriber", () => {
    for (const token of ["", "fan@example.com", "v2.invalid", "v1.A", "v1." + "A".repeat(2048)]) {
      expect(readEmailUnsubscribeToken(token)).toBeNull();
    }
    expect(() => createEmailUnsubscribeToken("not-an-email", "general")).toThrow();
  });
});

test("unsubscribe handlers update only the encrypted target and fail closed", () => {
  const script = String.raw`
    import assert from 'node:assert/strict';
    import { pathToFileURL } from 'node:url';
    import path from 'node:path';
    const rows = {
      email_subscriptions: [{ email: 'fan@example.com', status: 'active' }, { email: 'other@example.com', status: 'active' }],
      player_subscriptions: [
        { email: 'fan@example.com', confirmed: true, player_name: 'Jannik Sinner', player_slug: 'jannik-sinner' },
        { email: 'other@example.com', confirmed: true, player_name: 'Jannik Sinner', player_slug: 'jannik-sinner' }
      ]
    };
    let calls = 0;
    let failDatabase = false;
    const emails = [];
    globalThis.fetch = async (input, options) => {
      const url = new URL(input instanceof Request ? input.url : String(input));
      const method = options?.method || 'GET';
      if (url.hostname === 'api.resend.com' && url.pathname === '/emails' && method === 'POST') {
        emails.push(JSON.parse(options.body));
        return Response.json({ id: 'mock-email-' + emails.length });
      }
      if (url.hostname === 'site.example' && url.pathname === '/api/matches' && method === 'GET') {
        return Response.json([{ id: 'mock-match', player1: 'Jannik Sinner', player2: 'Carlos Alcaraz',
          tournament: 'Mock Open', category: 'ATP', status: 'UPCOMING', startTime: new Date(Date.now() + 3600000).toISOString() }]);
      }
      assert.equal(url.hostname, 'supabase.invalid', 'Unexpected external API');
      const table = url.pathname.split('/').at(-1);
      if (method === 'GET' && table === 'player_subscriptions') {
        assert.equal(url.searchParams.get('confirmed'), 'eq.true');
        return Response.json(rows.player_subscriptions.filter(row => row.confirmed));
      }
      if (table === 'player_alert_logs') return method === 'GET' ? Response.json(null) : new Response(null, { status: 201 });
      if (method === 'POST' && table in rows) {
        const row = JSON.parse(options.body);
        if (table === 'email_subscriptions') Object.assign(rows.email_subscriptions[0], row);
        else rows.player_subscriptions.push({ ...row, confirmed: true });
        return new Response(null, { status: 201 });
      }
      assert.equal(method, 'PATCH');
      calls++;
      if (failDatabase) return Response.json({ message: 'mock storage failure' }, { status: 503 });
      assert.ok(table in rows);
      assert.equal(url.searchParams.get('email'), 'eq.fan@example.com');
      const changes = JSON.parse(options.body);
      for (const row of rows[table]) if (row.email === 'fan@example.com') Object.assign(row, changes);
      return Response.json(null);
    };
    const load = async name => {
      const imported = await import(pathToFileURL(path.resolve(name)).href);
      return imported.POST || imported.createEmailUnsubscribeToken ? imported : imported.default;
    };
    const { createEmailUnsubscribeToken, readEmailUnsubscribeToken } = await load('app/lib/emailUnsubscribe.ts');
    const { POST, GET } = await load('app/api/unsubscribe/route.ts');
    const general = createEmailUnsubscribeToken('fan@example.com', 'general');
    const player = createEmailUnsubscribeToken('fan@example.com', 'player');
    const jsonRequest = token => new Request('https://site.example/api/unsubscribe', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token })
    });
    assert.equal(GET(new Request('https://site.example/api/unsubscribe?token=' + general)).status, 303);
    assert.equal(calls, 0);
    assert.equal((await POST(jsonRequest(general + 'x'))).status, 400);
    assert.equal(calls, 0);
    assert.equal((await POST(jsonRequest(general))).status, 200);
    assert.equal(rows.email_subscriptions[0].status, 'unsubscribed');
    assert.equal(rows.email_subscriptions[1].status, 'active');
    assert.equal(rows.player_subscriptions[0].confirmed, true);
    const oneClick = new Request('https://site.example/api/unsubscribe?token=' + player, {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'List-Unsubscribe=One-Click'
    });
    assert.equal((await POST(oneClick)).status, 200);
    assert.equal(rows.player_subscriptions[0].confirmed, false);
    assert.equal(rows.player_subscriptions[1].confirmed, true);
    assert.equal((await POST(jsonRequest(player))).status, 200);
    const { GET: sendAlerts } = await load('app/api/send-player-alerts/route.ts');
    const { GET: sendDigest } = await load('app/api/send-player-digest/route.ts');
    const cronRequest = route => new Request('https://site.example/api/' + route, {
      headers: { authorization: 'Bearer mock-cron-secret' }
    });
    assert.equal((await sendAlerts(cronRequest('send-player-alerts'))).status, 200);
    assert.equal((await sendDigest(cronRequest('send-player-digest'))).status, 200);
    assert.equal(emails.length, 2);
    for (const email of emails) {
      assert.equal(email.to, 'other@example.com');
      assert.ok(email.html.includes('Unsubscribe from all player alerts'));
      assert.equal(email.headers['List-Unsubscribe-Post'], 'List-Unsubscribe=One-Click');
      const url = new URL(email.headers['List-Unsubscribe'].slice(1, -1));
      assert.equal(url.pathname, '/api/unsubscribe');
      assert.deepEqual(readEmailUnsubscribeToken(url.searchParams.get('token')), { email: 'other@example.com', kind: 'player' });
    }
    const { POST: signupGeneral } = await load('app/api/subscribe-general/route.ts');
    const { POST: signupPlayer } = await load('app/api/subscribe-player/route.ts');
    const signup = (route, body) => new Request('https://site.example/api/' + route, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    });
    assert.equal((await signupGeneral(signup('subscribe-general', { email: 'fan@example.com', contextType: 'daily' }))).status, 200);
    assert.equal(rows.email_subscriptions[0].status, 'active');
    assert.equal((await signupPlayer(signup('subscribe-player', { email: 'new@example.com', playerSlug: 'jannik-sinner' }))).status, 200);
    assert.equal(emails.length, 4);
    for (const [index, target] of [[2, { email: 'fan@example.com', kind: 'general' }], [3, { email: 'new@example.com', kind: 'player' }]]) {
      const url = new URL(emails[index].headers['List-Unsubscribe'].slice(1, -1));
      assert.deepEqual(readEmailUnsubscribeToken(url.searchParams.get('token')), target);
      assert.ok(emails[index].html.includes('/unsubscribe?token='));
    }
    failDatabase = true;
    assert.equal((await POST(jsonRequest(general))).status, 500);
    const previousCalls = calls;
    delete process.env.SUPABASE_URL;
    assert.equal((await POST(jsonRequest(general))).status, 503);
    assert.equal(calls, previousCalls);
    console.log('MOCK_UNSUBSCRIBE_OK');
  `;
  const output = execFileSync(process.execPath, ["--conditions=react-server", "--import=tsx", "--input-type=module"], {
    input: script,
    encoding: "utf8",
    env: {
      ...process.env,
      SUPABASE_URL: "https://supabase.invalid",
      SUPABASE_SERVICE_ROLE_KEY: "test-only-supabase-service-key-at-least-32-characters",
      EMAIL_UNSUBSCRIBE_SECRET: "test-only-unsubscribe-secret-at-least-32-characters",
      RESEND_API_KEY: "test-only-resend-key",
      CRON_SECRET: "mock-cron-secret",
      ALERT_TEST_MODE: "false",
      NEXT_PUBLIC_SITE_URL: "https://site.example",
    },
  });
  expect(output).toContain("MOCK_UNSUBSCRIBE_OK");
});

test.describe("unsubscribe confirmation without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("opening and cancelling do not submit; confirmation submits once", async ({ page }) => {
    const token = "v1.browser-test-token";
    let submissions = 0;
    await page.route("**/api/unsubscribe", async (route) => {
      expect(route.request().method()).toBe("POST");
      expect(new URLSearchParams(route.request().postData() || "").get("token")).toBe(token);
      submissions += 1;
      await route.fulfill({ status: 303, headers: { location: "/unsubscribe?done=1" }, body: "" });
    });

    await page.goto(`/unsubscribe?token=${token}`);
    await expect(page.getByRole("button", { name: "Unsubscribe", exact: true })).toBeVisible();
    expect(submissions).toBe(0);
    await page.getByRole("link", { name: "Keep subscription" }).click();
    await expect(page).toHaveURL(/\/$/);
    expect(submissions).toBe(0);

    await page.goto(`/unsubscribe?token=${token}`);
    await page.getByRole("button", { name: "Unsubscribe", exact: true }).click();
    await expect(page.getByRole("heading", { name: "You are unsubscribed", exact: true })).toBeVisible();
    expect(submissions).toBe(1);
    await expect(page.getByRole("button", { name: "Unsubscribe", exact: true })).toHaveCount(0);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator('meta[name="referrer"]')).toHaveAttribute("content", "no-referrer");
  });

  test("storage errors allow retry and missing tokens cannot be submitted", async ({ page }) => {
    await page.goto("/unsubscribe");
    await expect(page.getByText("Invalid unsubscribe link.", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Unsubscribe", exact: true })).toHaveCount(0);

    let attempts = 0;
    await page.route("**/api/unsubscribe", async (route) => {
      attempts += 1;
      const location = attempts === 1 ? "/unsubscribe?token=v1.retry-token&error=500" : "/unsubscribe?done=1";
      await route.fulfill({ status: 303, headers: { location }, body: "" });
    });
    await page.goto("/unsubscribe?token=v1.retry-token");
    await page.getByRole("button", { name: "Unsubscribe", exact: true }).click();
    await expect(page.getByRole("alert")).toHaveText("Could not save your preference. Please try again.");
    await expect(page.getByRole("heading", { name: "You are unsubscribed", exact: true })).toHaveCount(0);
    await page.getByRole("button", { name: "Unsubscribe", exact: true }).click();
    await expect(page.getByRole("heading", { name: "You are unsubscribed", exact: true })).toBeVisible();
    expect(attempts).toBe(2);
  });
});