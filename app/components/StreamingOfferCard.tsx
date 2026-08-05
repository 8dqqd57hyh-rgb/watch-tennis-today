import { getStreamingOffers } from "@/app/lib/streamingOffers";
import { formatStreamingPrice, isOfferStale, type StreamingOffer } from "@/src/data/streamingOffers";

const localeByCountry: Record<string, string> = { PL: "pl-PL", GB: "en-GB", US: "en-US" };

function Price({ offer, amount }: { offer: StreamingOffer; amount: number | undefined }) {
  if (amount === undefined) return <span>Price unavailable</span>;
  return <span>{formatStreamingPrice(amount, offer.currency, localeByCountry[offer.countryCode] ?? "en") ?? "Price unavailable"}</span>;
}

export default async function StreamingOfferCard({ tournamentSlug, countryCode }: { tournamentSlug: string; countryCode: string }) {
  const result = await getStreamingOffers({ tournamentSlug, countryCode });

  if (!result.offers.length) {
    return (
      <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6" aria-labelledby="streaming-offers-title">
        <h2 id="streaming-offers-title" className="text-2xl font-black">Subscription and streaming details</h2>
        <p className="mt-3 text-zinc-300">No confirmed broadcaster offer is available for this tournament and country yet. Check the tournament broadcaster directory before paying.</p>
      </section>
    );
  }

  return (
    <section className="mt-8" aria-labelledby="streaming-offers-title">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">Verified viewing data</p><h2 id="streaming-offers-title" className="mt-2 text-3xl font-black">Subscription and streaming details</h2></div>
        {result.meta.isFallback ? <p className="text-sm text-amber-200">Showing the latest saved data while the live database is unavailable.</p> : null}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {result.offers.map((offer) => {
          const stale = isOfferStale(offer);
          const formattedTotal = offer.totalMonthlyPrice === undefined
            ? null
            : formatStreamingPrice(offer.totalMonthlyPrice, offer.currency, localeByCountry[offer.countryCode] ?? "en");
          return (
            <article key={offer.id} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><h3 className="text-2xl font-black">{offer.providerName}</h3><p className="mt-1 text-zinc-400">Broadcaster: {offer.broadcasterName ?? "Details need verification"}</p></div>
                <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ${offer.status === "verified" ? "bg-emerald-400/15 text-emerald-300" : "bg-amber-400/15 text-amber-200"}`}>{offer.status === "verified" ? "Verified offer" : "Needs verification"}</span>
              </div>
              <div className="mt-5 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">What you need</p>
                <p className="mt-2 leading-7 text-zinc-100">
                  {offer.basePlan ? <>Choose <strong>{offer.basePlan.name}</strong></> : <>The required base plan is not confirmed</>}
                  {offer.sportsAddon ? <> and add <strong>{offer.sportsAddon.name}</strong></> : null}.
                  {formattedTotal ? <> Your calculated monthly cost is <strong>{formattedTotal}</strong>.</> : <> The current price is not confirmed.</>}
                </p>
                {offer.coverage?.allCourts === true ? <p className="mt-2 text-sm font-bold text-emerald-200">Every court is available to stream according to the reviewed coverage source.</p> : null}
              </div>
              <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <div><dt className="font-bold text-zinc-500">Base plan</dt><dd className="mt-1">{offer.basePlan?.name ?? "Not specified"}{offer.basePlan ? <> · <Price offer={offer} amount={offer.basePlan.price} /></> : null}</dd></div>
                <div><dt className="font-bold text-zinc-500">Sports add-on</dt><dd className="mt-1">{offer.sportsAddon?.name ?? "No add-on confirmed"}{offer.sportsAddon ? <> · <Price offer={offer} amount={offer.sportsAddon.price} /></> : null}</dd></div>
                <div><dt className="font-bold text-zinc-500">Monthly total</dt><dd className="mt-1 text-lg font-black"><Price offer={offer} amount={offer.totalMonthlyPrice} /></dd></div>
                <div><dt className="font-bold text-zinc-500">Channels</dt><dd className="mt-1">{offer.channels?.join(", ") || "Channel details need verification"}</dd></div>
                <div><dt className="font-bold text-zinc-500">Coverage</dt><dd className="mt-1">{offer.coverage ? [offer.coverage.live && "Live", offer.coverage.replay && "Replays", offer.coverage.allCourts === true && "All courts"].filter(Boolean).join(" · ") || "Details need verification" : "Details need verification"}</dd></div>
                <div><dt className="font-bold text-zinc-500">Last checked</dt><dd className="mt-1"><time dateTime={offer.lastCheckedAt}>{new Intl.DateTimeFormat(localeByCountry[offer.countryCode] ?? "en", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(offer.lastCheckedAt))}</time></dd></div>
              </dl>
              {stale ? <p className="mt-4 rounded-xl border border-amber-400/30 bg-amber-950/20 p-3 text-sm text-amber-100">Subscription details may have changed. Verify the current offer on the provider&apos;s website.</p> : null}
              {offer.notes ? <p className="mt-4 text-sm leading-6 text-zinc-400">{offer.notes}</p> : null}
              <div className="mt-5 flex flex-wrap gap-3">
                <a href={offer.officialUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-black text-black hover:bg-emerald-300">Check provider offer</a>
                <details className="rounded-xl border border-zinc-700 px-4 py-2 text-sm"><summary className="cursor-pointer font-bold">Sources</summary><ul className="mt-2 space-y-2">{offer.sourceUrls.map((url) => <li key={url}><a href={url} target="_blank" rel="noopener noreferrer" className="break-all text-emerald-300 underline">{new URL(url).hostname}</a></li>)}</ul></details>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
