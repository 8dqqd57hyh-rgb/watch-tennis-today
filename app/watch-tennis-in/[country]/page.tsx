export const dynamic = "force-dynamic";

function readableCountry(country: string) {
  return country
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

const broadcasters: Record<
  string,
  {
    name: string;
    url: string;
    note: string;
  }[]
> = {
  poland: [
    {
      name: "Eurosport",
      url: "https://www.eurosport.com/tennis/",
      note: "Major ATP, WTA and Grand Slam coverage",
    },
    {
      name: "Canal+",
      url: "https://www.canalplus.com/",
      note: "Selected tennis tournaments and sports packages",
    },
  ],

  uk: [
    {
      name: "Sky Sports",
      url: "https://www.skysports.com/tennis",
      note: "ATP and WTA coverage",
    },
    {
      name: "BBC",
      url: "https://www.bbc.co.uk/sport/tennis",
      note: "Wimbledon coverage",
    },
  ],

  usa: [
    {
      name: "Tennis Channel",
      url: "https://www.tennischannel.com/",
      note: "Major ATP and WTA broadcaster",
    },
    {
      name: "ESPN",
      url: "https://www.espn.com/tennis/",
      note: "Grand Slam coverage",
    },
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const readable = readableCountry(country);

  return {
    title: `Where to Watch Tennis in ${readable} | TV Channels & Live Streams`,
    description: `Find official tennis broadcasters, live streams, TV channels and ATP/WTA coverage available in ${readable}.`,
    alternates: {
      canonical: `https://watchtennistoday.com/watch-tennis-in/${country}`,
    },
  };
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const readable = readableCountry(country);
  const countryBroadcasters = broadcasters[country] || [];

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <a href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </a>

        <section className="mt-8 mb-10">
          <h1 className="text-5xl font-black mb-4">
            🌍 Where to Watch Tennis in {readable}
          </h1>

          <p className="text-zinc-400 text-lg leading-relaxed">
            Find official tennis broadcasters, TV channels and streaming
            services available in {readable}. This guide helps you check where
            to watch ATP, WTA, Challenger and Grand Slam tennis matches legally.
          </p>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8">
          <h2 className="text-3xl font-black mb-4">
            📺 Tennis Broadcasters in {readable}
          </h2>

          {countryBroadcasters.length > 0 ? (
            <div className="space-y-5">
              {countryBroadcasters.map((broadcaster) => (
                <a
                  key={broadcaster.name}
                  href={broadcaster.url}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  className="block bg-black border border-zinc-800 rounded-3xl p-6 hover:border-green-500 transition-all"
                >
                  <h3 className="text-2xl font-black mb-2">
                    {broadcaster.name}
                  </h3>

                  <p className="text-zinc-400">{broadcaster.note}</p>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-zinc-400">
              Broadcaster information for {readable} is not available yet.
              Check the live schedule for current tennis matches.
            </p>
          )}
        </section>

        <section className="bg-gradient-to-br from-green-500 to-lime-400 text-black rounded-3xl p-6 mb-8">
          <h2 className="text-3xl font-black mb-3">
            🎾 Live Tennis Matches Today
          </h2>

          <p className="font-semibold mb-5">
            Check today&apos;s tennis schedule and official streaming sources
            before the match starts.
          </p>

          <a
            href="/live-tennis"
            className="inline-block bg-black text-white px-5 py-3 rounded-2xl font-black"
          >
            View Live Tennis
          </a>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8">
          <h2 className="text-3xl font-black mb-4">
            🔒 Streaming availability
          </h2>

          <p className="text-zinc-400 leading-relaxed">
            Tennis broadcasting rights depend on your country, tournament and
            platform subscription. Some matches may be available only through
            regional broadcasters or official tournament streaming services.
          </p>

          <div className="mt-5 bg-black rounded-2xl p-5 border border-zinc-800">
            <p className="font-bold mb-2">
              Future affiliate block
            </p>
            <p className="text-zinc-500 text-sm">
              Later you can add VPN, sports streaming or betting affiliate links
              here after joining partner programs.
            </p>
          </div>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <h2 className="text-3xl font-black mb-4">
            FAQ
          </h2>

          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-bold mb-2">
                Where can I watch tennis in {readable}?
              </h3>
              <p className="text-zinc-400">
                Tennis is usually shown by official sports broadcasters,
                tournament partners and dedicated tennis streaming platforms.
                Availability depends on the tournament and local rights.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2">
                Can I watch ATP and WTA matches online?
              </h3>
              <p className="text-zinc-400">
                Yes, many ATP and WTA matches are available through official
                broadcasters, regional streaming platforms or tournament
                partners.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2">
                Are Grand Slam matches available in {readable}?
              </h3>
              <p className="text-zinc-400">
                Grand Slam coverage depends on local TV rights. Wimbledon,
                Roland Garros, US Open and Australian Open may have different
                broadcasters in each country.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}