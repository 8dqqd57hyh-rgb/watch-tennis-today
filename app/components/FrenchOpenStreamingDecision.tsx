import Link from "next/link";
import { affiliateLinks } from "@/app/lib/affiliateLinks";

const quickChecks = [
  "Check the official broadcaster in your country first",
  "Confirm whether the match is day session, night session or replay",
  "Use a VPN only for privacy/travel access to your own legal subscription",
];

const popularCountries = [
  ["USA", "/watch-tennis-in/usa"],
  ["UK", "/watch-tennis-in/uk"],
  ["Poland", "/watch-tennis-in/poland"],
  ["France", "/watch-tennis-in/france"],
];

export default function FrenchOpenStreamingDecision({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <section
      data-track-area="french-open-streaming-decision"
      className="my-10 rounded-[2rem] border border-emerald-500/30 bg-gradient-to-br from-emerald-950/50 via-zinc-950 to-black p-6 text-white"
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
            Streaming decision
          </p>
          <h2 className="mb-4 text-3xl font-black md:text-4xl">
            Need the safest way to watch Roland Garros?
          </h2>
          <p className="max-w-3xl leading-8 text-zinc-300">
            Start with the official French Open broadcaster for your country.
            If you are traveling, compare safe VPN options before using public
            Wi‑Fi or trying to access your normal paid streaming account.
          </p>
        </div>

        <div className="rounded-3xl border border-emerald-500/20 bg-black/50 p-5">
          <p className="mb-3 text-sm font-black text-emerald-200">
            Quick pre-match checklist
          </p>
          <ul className="space-y-2 text-sm leading-6 text-zinc-300">
            {quickChecks.map((check) => (
              <li key={check}>✅ {check}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <Link
          href="/where-to-watch-french-open"
          data-track-category="money_internal"
          data-track-id="french_open_decision_country_guides"
          data-track-position="primary"
          className="rounded-2xl bg-emerald-400 px-5 py-4 text-center font-black text-black transition hover:bg-emerald-300"
        >
          Find my broadcaster →
        </Link>
        <Link
          href="/best-vpn-for-roland-garros"
          data-track-category="money_internal"
          data-track-id="french_open_decision_vpn_guide"
          data-track-position="secondary"
          className="rounded-2xl border border-emerald-500/30 bg-black px-5 py-4 text-center font-black text-white transition hover:border-emerald-300"
        >
          VPN guide for Roland Garros
        </Link>
        <a
          href={affiliateLinks.nordvpn}
          data-track-category="affiliate"
          data-track-id="french_open_decision_nordvpn"
          data-track-position="affiliate"
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          className="rounded-2xl border border-emerald-500/30 bg-black px-5 py-4 text-center font-black text-white transition hover:border-emerald-300"
        >
          View VPN deal
        </a>
      </div>

      {!compact ? (
        <div className="mt-6 rounded-3xl border border-zinc-800 bg-black/40 p-5">
          <p className="mb-3 text-sm font-black uppercase tracking-widest text-zinc-500">
            Popular country shortcuts
          </p>
          <div className="flex flex-wrap gap-3">
            {popularCountries.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-bold transition hover:border-emerald-300 hover:text-emerald-200"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      <p className="mt-4 text-xs leading-6 text-zinc-500">
        Affiliate disclosure: we may earn a commission from qualifying purchases. Watch Tennis Today does not host unauthorized streams or advise bypassing broadcaster terms.
      </p>
    </section>
  );
}
