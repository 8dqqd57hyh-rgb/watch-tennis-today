import type { Locator, Page } from "@playwright/test";

export class CanIWatchPage {
  readonly finderHeading: Locator;
  readonly countrySelect: Locator;
  readonly searchInput: Locator;
  readonly seoPageLink: Locator;
  readonly broadcastersSection: Locator;
  readonly freeRoutes: Locator;
  readonly paidRoutes: Locator;
  readonly lastVerified: Locator;
  readonly streamingRoute: Locator;
  readonly broadcasterProfileLink: Locator;
  readonly coverageResult: Locator;

  constructor(readonly page: Page) {
    this.finderHeading = page.getByRole("heading", { name: /Can I watch this tennis match\?/i });
    this.countrySelect = page.getByLabel(/Country/i);
    this.searchInput = page.getByLabel(/Player or tournament/i);
    this.seoPageLink = page.getByRole("link", { name: /Open SEO page/i });
    this.broadcastersSection = page.getByText("Broadcasters").first();
    this.freeRoutes = page.getByText("Free routes").first();
    this.paidRoutes = page.getByText("Paid routes").first();
    this.lastVerified = page.getByText("Last verified").first();
    this.streamingRoute = page.getByText(/Streaming route:/i).first();
    this.broadcasterProfileLink = page.getByRole("link", { name: /Broadcaster profile/i }).first();
    this.coverageResult = page.getByText(/Broadcasters|No verified route/i).first();
  }

  async goto() {
    return this.page.goto("/can-i-watch", { waitUntil: "domcontentloaded" });
  }

  async selectCountry(country: string) {
    await this.countrySelect.selectOption(country);
  }

  async searchFor(value: string) {
    await this.searchInput.fill(value);
  }
}
