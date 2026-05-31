import Link from "next/link";

export const frenchOpenCountries = [
  {
    id: "usa",
    country: "United States",
    channels: "TNT Sports, truTV, Max",
    guideHref: "/watch-tennis-in/usa",
    broadcasterHref: "https://www.max.com/",
    timeNote: "Morning and afternoon Paris sessions usually land early in the U.S.",
  },
  {
    id: "uk",
    country: "United Kingdom",
    channels: "TNT Sports, discovery+",
    guideHref: "/watch-tennis-in/uk",
    broadcasterHref: "https://www.discoveryplus.com/",
    timeNote: "Paris is one hour ahead of the UK during Roland Garros.",
  },
  {
    id: "poland",
    country: "Poland",
    channels: "Eurosport, Max",
    guideHref: "/watch-tennis-in/poland",
    broadcasterHref: "https://www.eurosport.pl/",
    timeNote: "Poland uses the same time zone as Paris for French Open sessions.",
  },
  {
    id: "france",
    country: "France",
    channels: "France TV, Prime Video",
    guideHref: "/watch-tennis-in/france",
    broadcasterHref: "https://www.france.tv/",
    timeNote: "Local match times are shown in Paris time.",
  },
  {
    id: "germany",
    country: "Germany",
    channels: "Eurosport, discovery+",
    guideHref: "/watch-tennis-in/germany",
    broadcasterHref: "https://www.eurosport.de/",
    timeNote: "Germany uses the same time zone as Paris during the tournament.",
  },
  {
    id: "spain",
    country: "Spain",
    channels: "Eurosport, RTVE",
    guideHref: "/watch-tennis-in/spain",
    broadcasterHref: "https://www.rtve.es/deportes/",
    timeNote: "Mainland Spain uses the same time zone as Paris.",
  },
  {
    id: "italy",
    country: "Italy",
    channels: "Eurosport, Sky Sport",
    guideHref: "/watch-tennis-in/italy",
    broadcasterHref: "https://sport.sky.it/",
    timeNote: "Italy uses the same time zone as Paris.",
  },
  {
    id: "canada",
    country: "Canada",
    channels: "TSN, RDS",
    guideHref: "/watch-tennis-in/canada",
    broadcasterHref: "https://www.tsn.ca/",
    timeNote: "Check your province time zone because Paris sessions can start early.",
  },
  {
    id: "australia",
    country: "Australia",
    channels: "9Now, Stan Sport",
    guideHref: "/watch-tennis-in/australia",
    broadcasterHref: "https://www.stan.com.au/",
    timeNote: "Evening Paris matches often run overnight in Australia.",
  },
  {
    id: "india",
    country: "India",
    channels: "Sony Sports Network, Sony LIV",
    guideHref: "/watch-tennis-in/india",
    broadcasterHref: "https://www.sonyliv.com/",
    timeNote: "Paris day sessions usually start in the afternoon or evening in India.",
  },
];

type Props = {
  compact?: boolean;
  title?: string;
  description?: string;
};

export default function FrenchOpenCountryGuides({
  compact = false,
  title = "Where to watch the French Open by country",
  description = "Pick your country to find official Roland Garros broadcasters, streaming options and safe viewing notes.",
}: Props) {
  const visibleCountries = compact ? frenchOpenCountries.slice(0, 6) : frenchOpenCountries;

  return (
    <section id="countries" className="mb-12 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
      <div className="mb-6">
        <p className="mb-2 text-sm font-black uppercase tracking-widest text-orange-400">
          Country guides
        </p>
        <h2 className="text-3xl font-black md:text-4xl">{title}</h2>
        <p className="mt-3 max-w-3xl leading-8 text-zinc-400">{description}</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visibleCountries.map((item) => (
          <article
            id={item.id}
            key={item.id}
            className="rounded-3xl border border-orange-500/25 bg-black p-6 transition hover:border-orange-400"
          >
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-orange-300">
              {item.country}
            </p>
            <h3 className="mb-3 text-2xl font-black leading-tight">{item.channels}</h3>
            <p className="mb-5 text-sm leading-6 text-zinc-400">{item.timeNote}</p>

            <div className="flex flex-wrap gap-3">
              <Link
                href={item.guideHref}
                className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-black text-black transition hover:bg-orange-400"
              >
                View country guide →
              </Link>
              <a
                href={item.broadcasterHref}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-bold text-white transition hover:border-orange-400"
              >
                Official site
              </a>
            </div>
          </article>
        ))}
      </div>

      {compact ? (
        <div className="mt-6">
          <Link
            href="/where-to-watch-french-open#countries"
            className="inline-flex rounded-2xl border border-zinc-700 px-5 py-3 font-black transition hover:border-orange-400 hover:text-orange-300"
          >
            See all French Open country guides →
          </Link>
        </div>
      ) : null}
    </section>
  );
}
