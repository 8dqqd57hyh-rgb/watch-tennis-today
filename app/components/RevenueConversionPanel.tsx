import { affiliateLinks } from "@/app/lib/affiliateLinks";

type RevenueConversionPanelProps = {
  context?: "homepage" | "player" | "matchup" | "article";
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
    <section className="my-10 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/70 to-zinc-950 p-6 text-white shadow-2xl">
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
          className="rounded-2xl border border-emerald-500/40 bg-emerald-400 px-5 py-4 text-center font-black text-black hover:bg-emerald-300"
        >
          Watch Tennis Abroad →
        </a>

        <a
          href="/best-vpn-for-tennis-streaming"
          className="rounded-2xl border border-zinc-700 bg-black px-5 py-4 text-center font-black text-white hover:border-emerald-400"
        >
          Best VPN for Tennis
        </a>

        <a
          href={affiliateLinks.nordvpn}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          className="rounded-2xl border border-zinc-700 bg-black px-5 py-4 text-center font-black text-white hover:border-emerald-400"
        >
          View VPN Deal
        </a>
      </div>

      <p className="mt-4 text-xs text-zinc-500">
        Affiliate disclosure: we may earn a commission from qualifying purchases. We do not stream matches or bypass broadcaster rules.
      </p>
    </section>
  );
}
