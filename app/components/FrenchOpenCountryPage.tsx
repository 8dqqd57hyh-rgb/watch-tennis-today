import VpnPromo from "@/app/components/VpnPromo";

type CountryPageProps = {
  country: string;
  slug: string;
  broadcasters: string[];
  streaming: string[];
  timezone: string;
  note: string;
};

export default function FrenchOpenCountryPage({
  country,
  broadcasters,
  streaming,
  timezone,
  note,
}: CountryPageProps) {
  const faq = [
    {
      q: `Where can I watch the French Open in ${country}?`,
      a: `You can watch Roland Garros in ${country} through official broadcasters such as ${broadcasters.join(
        ", "
      )}.`,
    },
    {
      q: `Can I stream the French Open online in ${country}?`,
      a: `Yes. Online streaming options in ${country} include ${streaming.join(
        ", "
      )}, depending on your subscription and device.`,
    },
    {
      q: "Can I watch Roland Garros while traveling abroad?",
      a: "If you already pay for a streaming service at home, a VPN may help you access your usual account securely while traveling, depending on the service terms.",
    },
  ];

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white md:px-10">
      <div className="mx-auto max-w-5xl">
        <section className="mb-10 rounded-[2rem] border border-orange-500/40 bg-gradient-to-br from-orange-950/40 to-black p-8">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-orange-400">
            Roland Garros streaming guide
          </p>

          <h1 className="mb-5 text-4xl font-black leading-tight md:text-6xl">
            How to Watch the French Open in {country}
          </h1>

          <p className="max-w-3xl text-lg leading-8 text-zinc-300">
            Find the official French Open TV channels, streaming options and
            Roland Garros viewing tips for tennis fans in {country}.
          </p>
        </section>

        <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="mb-4 text-2xl font-black">
            Official French Open broadcasters in {country}
          </h2>

          <ul className="space-y-3 text-zinc-300">
            {broadcasters.map((item) => (
              <li key={item} className="rounded-2xl bg-zinc-900 p-4">
                <span className="font-bold text-white">{item}</span>
              </li>
            ))}
          </ul>

          <p className="mt-5 leading-7 text-zinc-400">{note}</p>
        </section>

        <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="mb-4 text-2xl font-black">
            Streaming options in {country}
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {streaming.map((item) => (
              <div key={item} className="rounded-2xl bg-zinc-900 p-5">
                <h3 className="mb-2 text-lg font-bold">{item}</h3>
                <p className="text-sm leading-6 text-zinc-400">
                  Check the official app or website for live Roland Garros
                  coverage, replay availability and device support.
                </p>
              </div>
            ))}
          </div>
        </section>

        <VpnPromo
          title={`Watching the French Open outside ${country}?`}
          text={`French Open coverage can be geo-restricted. If you are traveling, a VPN may help you securely access your usual tennis streaming account from abroad.`}
        />

        <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="mb-4 text-2xl font-black">
            French Open time zone for {country}
          </h2>

          <p className="leading-7 text-zinc-300">
            Roland Garros is played in Paris. For viewers in {country}, match
            times are usually listed in <strong>{timezone}</strong>. Always
            check the daily order of play before the session starts.
          </p>
        </section>

        <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="mb-5 text-2xl font-black">FAQ</h2>

          <div className="space-y-4">
            {faq.map((item) => (
              <div key={item.q} className="rounded-2xl bg-zinc-900 p-5">
                <h3 className="mb-2 font-bold text-white">{item.q}</h3>
                <p className="leading-7 text-zinc-400">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="mb-4 text-2xl font-black">More French Open guides</h2>

          <div className="flex flex-wrap gap-3">
            <a className="rounded-full bg-zinc-800 px-4 py-2 text-sm font-bold hover:bg-zinc-700" href="/french-open">
              French Open live
            </a>
            <a className="rounded-full bg-zinc-800 px-4 py-2 text-sm font-bold hover:bg-zinc-700" href="/where-to-watch-french-open">
              French Open TV schedule
            </a>
            <a className="rounded-full bg-zinc-800 px-4 py-2 text-sm font-bold hover:bg-zinc-700" href="/french-open">
              French Open today
            </a>
            <a className="rounded-full bg-zinc-800 px-4 py-2 text-sm font-bold hover:bg-zinc-700" href="/best-vpn-for-tennis-streaming">
              Best VPN for tennis
            </a>
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faq.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.a,
                },
              })),
            }),
          }}
        />
      </div>
    </main>
  );
}
