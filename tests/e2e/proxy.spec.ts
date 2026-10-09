import { expect, test } from "@playwright/test";
import { NextRequest } from "next/server";
import { proxy } from "../../proxy";

test.describe("proxy request handling", () => {
  for (const { path, canonical } of [
    { path: "/player/sinner-jannik", canonical: "/player/jannik-sinner" },
    { path: "/players/sinner-jannik", canonical: "/player/jannik-sinner" },
    { path: "/watch-player-live/sinner-jannik", canonical: "/watch-player-live/jannik-sinner" },
  ]) {
    test(`${path} redirects permanently and preserves query parameters`, () => {
      const response = proxy(new NextRequest(`http://localhost:3000${path}?source=proxy-test`));

      expect(response.status).toBe(308);
      expect(response.headers.get("location")).toBe(`http://localhost:3000${canonical}?source=proxy-test`);
    });
  }

  test("empty normalized watch-player slugs redirect to live players", () => {
    const response = proxy(new NextRequest("http://localhost:3000/watch-player-live/---"));

    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe("http://localhost:3000/players/live-now");
  });

  test("unrecognized watch-player slugs remain the page's responsibility", () => {
    const response = proxy(new NextRequest("http://localhost:3000/watch-player-live/qf3"));

    expect(response.headers.get("x-middleware-next")).toBe("1");
    expect(response.headers.get("location")).toBeNull();
  });

  test("forwards the real pathname and removes unsupported range headers", () => {
    const request = new NextRequest("http://localhost:3000/about?source=proxy-test", {
      headers: { "x-pathname": "/spoofed", "x-proxy-test": "preserved", range: "items=0-10" },
    });
    const response = proxy(request);

    expect(response.headers.get("x-middleware-next")).toBe("1");
    expect(response.headers.get("x-middleware-request-x-pathname")).toBe("/about");
    expect(response.headers.get("x-middleware-request-x-proxy-test")).toBe("preserved");
    expect(response.headers.get("x-middleware-request-range")).toBeNull();
    expect(request.headers.get("range")).toBe("items=0-10");
  });

  for (const range of ["bytes=0-10", "Bytes=10-"]) {
    test(`preserves byte range ${range}`, () => {
      const response = proxy(new NextRequest("http://localhost:3000/about", { headers: { range } }));

      expect(response.headers.get("x-middleware-request-range")).toBe(range);
    });
  }
});