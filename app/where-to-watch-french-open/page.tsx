export const metadata = {
  title: "French Open Streaming Countries 2026 | Watch Roland Garros Worldwide",
  description:
    "French Open streaming countries guide for Roland Garros 2026. Find where to watch French Open tennis online by country, TV channel and streaming service.",
};

const countries = [
  ["United States", "usa"],
  ["United Kingdom", "uk"],
  ["Poland", "poland"],
  ["Germany", "germany"],
  ["France", "france"],
  ["Spain", "spain"],
  ["Italy", "italy"],
  ["Canada", "canada"],
  ["Australia", "australia"],
  ["India", "india"],
];

export default function FrenchOpenStreamingCountriesPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <section className="mb-12 rounded-[2.5rem] border border-orange-500 bg-gradient-to-br from-orange-950/40 to-black p-8">
          <div className="mb-5 inline-flex rounded-full bg-orange-500 px-4 py-2 text-sm font-black text-black">
            🌍 COUNTRIES
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            French Open Streaming
            <br />
            Countries
          </h1>

          <p className="max-w-3xl text-lg leading-8 text-zinc-300 mb-8">
            Find where to watch French Open online by country, including Roland
            Garros TV channels, streaming platforms and tennis viewing guides.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="/where-to-watch-french-open"
              className="rounded-2xl bg-orange-500 px-6 py-4 text-lg font-black text-black hover:bg-orange-400 transition-all"
            >
              Where to Watch →
            </a>

            <a
              href="/french-open-live-stream"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold hover:border-orange-500 transition-all"
            >
              Live Stream Guide
            </a>
          </div>
        </section>

        <section className="mb-12">
  <h2 className="text-4xl font-black mb-6">
    🌍 Where to Watch French Open by Country
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
    {[
      {
    country: "United States",
    channels: "TNT Sports, truTV, Max",
    link: "https://www.max.com/",
  },
  {
    country: "United Kingdom",
    channels: "TNT Sports, discovery+",
    link: "https://www.discoveryplus.com/",
  },
  {
    country: "France",
    channels: "France TV, Prime Video",
    link: "https://www.france.tv/",
  },
  {
    country: "Poland",
    channels: "Eurosport, Max",
    link: "https://www.eurosport.pl/",
  },
  {
    country: "Germany",
    channels: "Eurosport, discovery+",
    link: "https://www.eurosport.de/",
  },
  {
    country: "Spain",
    channels: "Eurosport, RTVE",
    link: "https://www.rtve.es/deportes/",
  },
  {
    country: "Italy",
    channels: "Eurosport, Sky Sport",
    link: "https://sport.sky.it/",
  },
  {
    country: "Canada",
    channels: "TSN, RDS",
    link: "https://www.tsn.ca/",
  },
  {
    country: "Australia",
    channels: "9Now, Stan Sport",
    link: "https://www.stan.com.au/",
  },
  {
    country: "India",
    channels: "Sony Sports Network, Sony LIV",
    link: "https://www.sonyliv.com/",
  },
  {
    country: "Japan",
    channels: "WOWOW",
    link: "https://www.wowow.co.jp/",
  },
  {
    country: "Brazil",
    channels: "ESPN",
    link: "https://www.espn.com.br/",
  },
    ].map((item) => (
      <div
        key={item.country}
        className="rounded-3xl border border-orange-500/30 bg-zinc-900 p-6 hover:border-orange-500 transition-all"
      >
        <p className="mb-3 text-xs uppercase tracking-widest text-orange-400">
          {item.country}
        </p>

        <h3 className="text-2xl font-black leading-tight mb-4">
          {item.channels}
        </h3>

       <a
  href={item.link}
  target="_blank"
  rel="noopener noreferrer nofollow"
  className="inline-flex rounded-2xl bg-orange-500 px-5 py-3 text-sm font-black text-black hover:bg-orange-400 transition-all"
>
  Visit broadcaster →
</a>
      </div>
    ))}
  </div>

  <p className="mt-6 max-w-3xl text-sm leading-7 text-zinc-500">
    Broadcast rights and streaming availability may vary by region and platform.
    Check your local broadcaster for the latest French Open coverage information.
  </p>
</section>

        <section className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            ["French Open Live", "/french-open-live"],
            ["Watch Online", "/watch-french-open-online"],
            ["TV Schedule", "/french-open-tv-schedule"],
            ["French Open Today", "/french-open-today"],
            ["Order of Play", "/french-open-order-of-play"],
            ["Results", "/french-open-results"],
          ].map(([title, href]) => (
            <a
              key={href}
              href={href}
              className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 hover:border-orange-500 transition-all"
            >
              <h3 className="text-xl font-black mb-3">
                {title}
              </h3>

              <p className="text-sm text-zinc-400">
                Roland Garros schedules, streams and match updates.
              </p>
            </a>
          ))}
        </section>

        <section className="rounded-[2rem] border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black p-8">
          <h2 className="text-3xl font-black mb-5">
            About French Open streaming by country
          </h2>

          <div className="space-y-5 text-zinc-300 leading-8 max-w-4xl">
            <p>
              French Open streaming availability depends on official broadcast
              rights in each country. Tennis fans should check local TV channels
              and licensed streaming services for Roland Garros coverage.
            </p>

            <p>
              Watch Tennis Today helps fans find French Open live match pages,
              TV schedule links, streaming country guides and Roland Garros
              viewing information.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}