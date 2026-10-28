import { expect, test } from "@playwright/test";
import { NextRequest } from "next/server";
import { config, proxy } from "../../proxy";

test.describe("proxy request handling", () => {
  for (const { path, canonical } of [
    { path: "/player/sinner-jannik", canonical: "/player/jannik-sinner" },
    { path: "/players/sinner-jannik", canonical: "/player/jannik-sinner" },
  ]) {
    test(`${path} redirects permanently and preserves query parameters`, () => {
      const response = proxy(new NextRequest(`http://localhost:3000${path}?source=proxy-test`));

      expect(response.status).toBe(308);
      expect(response.headers.get("location")).toBe(`http://localhost:3000${canonical}?source=proxy-test`);
    });
  }

  test("canonical player slugs pass through", () => {
    const response = proxy(new NextRequest("http://localhost:3000/player/jannik-sinner"));

    expect(response.headers.get("x-middleware-next")).toBe("1");
    expect(response.headers.get("location")).toBeNull();
  });

  test("only runs on player URLs so static pages skip the proxy", () => {
    expect(config.matcher).toEqual(["/player/:path+", "/players/:path+"]);
  });
});
