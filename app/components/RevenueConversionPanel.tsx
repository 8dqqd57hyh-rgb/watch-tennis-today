type RevenueConversionPanelProps = {
  context?: "homepage" | "player" | "matchup" | "article" | "tomorrow-schedule" | "recap";
  playerName?: string;
  opponentName?: string;
  tournament?: string;
};

const contextCopy = {
  homepage: {
    eyebrow: "Best money pages",
    title: "Watching tennis while traveling? Start here",
    text:
      "Compare official tennis broadcasters, country restrictions and safe VPN options before a match starts.",
  },
  player: {
    eyebrow: "Player viewing guide",
    title: "Find the legal way to watch this player live",
    text:
      "Broadcasters change by tournament and country. Use these guides to check TV channels, official streams and travel viewing options.",
  },
  matchup: {
    eyebrow: "High-interest matchup guide",
    title: "Check where this matchup is available legally",
    text:
      "Big matches often move between Grand Slam broadcasters, ATP/WTA partners and country-specific TV rights.",
  },
  article: {
    eyebrow: "Streaming decision helper",
    title: "Choose the safest tennis streaming setup",
    text:
      "Use official broadcasters first, then compare travel-friendly VPN options when you are away from your normal region.",
  },
  "tomorrow-schedule": {
    eyebrow: "Plan tomorrow's tennis viewing",
    title: "Check the best legal way to watch tomorrow's matches",
    text:
      "Tomorrow schedules are useful for planning ahead, comparing official broadcasters and checking travel-friendly viewing options before match day.",
  },
  recap: {
    eyebrow: "After the recap",
    title: "Found the match you missed? Check the safest way to watch the next one",
    text:
      "Daily recaps are high-intent pages: fans catch up first, then need today's official broadcaster, travel viewing options and safe streaming guidance.",
  },
};

export default function RevenueConversionPanel({
  context = "article",
  playerName,
  opponentName,
  tournament,
}: RevenueConversionPanelProps) {
  const copy = contextCopy[context];
  const matchupLabel = playerName && opponentName ? `${playerName} vs ${opponentName}` : null;
  const guideLabel = matchupLabel || playerName || tournament || "tennis";

  return (
    <section
      data-track-area={`revenue-panel-${context}`}
      className="my-10 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/70 to-zinc-950 p-6 text-white shadow-2xl"
    >
      <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
        {copy.eyebrow}
      </p>

      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
        <div>
          <h2 className="mb-3 text-3xl font-black md:text-4xl">
            {copy.title}
          </h2>

          <p className="max-w-3xl text-zinc-300 leading-8">
            {copy.text} This is especially useful for {guideLabel} coverage when
            TV rights depend on your location.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-black/50 p-5">
          <p className="mb-3 text-sm font-bold text-emerald-200">
            Travel streaming checklist
          </p>

          <ul className="space-y-2 text-sm text-zinc-300">
            <li>✅ Check the official broadcaster in your country</li>
            <li>✅ Confirm whether the event is ATP/WTA or Grand Slam</li>
            <li>✅ Use your normal subscription securely while traveling</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <a
          href="/watch-tennis-abroad"
          data-track-category="money_internal"
          data-track-id="revenue_panel_watch_tennis_abroad"
          data-track-position="primary"
          className="rounded-2xl border border-emerald-500/40 bg-emerald-400 px-5 py-4 text-center font-black text-black hover:bg-emerald-300"
        >
          Watch Tennis Abroad →
        </a>

        <a
          href="/official-tennis-broadcasters-guide"
          data-track-category="internal_guide"
          data-track-id="revenue_panel_official_broadcasters"
          data-track-position="secondary"
          className="rounded-2xl border border-zinc-700 bg-black px-5 py-4 text-center font-black text-white hover:border-emerald-400"
        >
          Official Broadcasters
        </a>

        <a
          href="/guides/how-to-watch-tennis-online-legally"
          data-track-category="internal_guide"
          data-track-id="revenue_panel_legal_streaming"
          data-track-position="tertiary"
          className="rounded-2xl border border-zinc-700 bg-black px-5 py-4 text-center font-black text-white hover:border-emerald-400"
        >
          Legal Streaming Guide
        </a>
      </div>

      <p className="mt-4 text-xs text-zinc-500">
        Watch Tennis Today does not host streams, bypass broadcaster rules or replace official tournament and broadcaster information.
      </p>
    </section>
  );
}
