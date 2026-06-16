import { getStreamingPartners } from "@/lib/streamingPartners";

type LegalStreamingOptionsProps = {
  country?: string;
  title?: string;
};

function readableCountry(country?: string) {
  if (!country || country === "global") return "your country";
  return country.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function LegalStreamingOptions({ country = "global", title = "Legal tennis streaming options" }: LegalStreamingOptionsProps) {
  const partners = getStreamingPartners(country);

  return (
    <section id="legal-streaming-options" className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-green-600">Legal viewing</p>
      <h2 className="text-2xl font-black text-zinc-950">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-zinc-600">
        Tennis rights change by tournament, country and season. Use this block as a safe starting point for {readableCountry(country)} and confirm the event on the provider or tournament website before paying.
      </p>
      <p className="mt-3 rounded-2xl bg-yellow-50 p-4 text-xs leading-6 text-yellow-900">
        Disclosure: Some links may be affiliate links if partnerships are
        active. Watch Tennis Today does not host or embed live streams. We help
        users find official and legal broadcasters and streaming options.
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {partners.map((partner) => {
          const href = partner.affiliateUrl || partner.officialUrl;
          return (
            <article key={partner.name} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <h3 className="font-black text-zinc-950">
                {href ? (
                  <a href={href} rel="sponsored nofollow noopener" target="_blank" className="hover:text-green-700">
                    {partner.name}
                  </a>
                ) : partner.name}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{partner.notes}</p>
              <p className="mt-3 text-xs font-bold uppercase tracking-wide text-zinc-500">
                Relevant for: {partner.tournaments.join(", ")}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
