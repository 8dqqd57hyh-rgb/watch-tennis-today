import type { Metadata } from "next";
import Link from "next/link";
import {
  TENNIS_BROADCAST_LAST_VERIFIED,
  getCountryBroadcastEntries,
  type TennisTournamentId,
} from "@/src/data/tennisBroadcasts";

const SITE_URL = "https://watchtennistoday.com";
const POLAND_CODE = "PL";
const tournamentIds: TennisTournamentId[] = [
  "australian-open",
  "roland-garros",
  "wimbledon",
  "us-open",
  "atp-tour",
  "wta-tour",
];

export const metadata: Metadata = {
  title: "Gdzie oglądać tenis w Polsce? | Transmisje TV i online",
  description:
    "Sprawdź, gdzie oglądać tenis w Polsce, w tym mecze ATP, WTA, Wielkiego Szlema oraz spotkania Igi Świątek.",
  alternates: {
    canonical: `${SITE_URL}/pl/gdzie-ogladac-tenis-w-polsce`,
    languages: {
      en: `${SITE_URL}/watch-tennis-in/poland`,
      pl: `${SITE_URL}/pl/gdzie-ogladac-tenis-w-polsce`,
      "x-default": `${SITE_URL}/watch-tennis-in/poland`,
    },
  },
  robots: { index: true, follow: true },
};

function sourceList(links: { label: string; url: string }[]) {
  if (!links.length) return null;

  return (
    <details className="mt-4">
      <summary className="cursor-pointer text-sm font-black text-emerald-300">Źródła i linki referencyjne</summary>
      <div className="mt-3 flex flex-wrap gap-2">
        {links.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="rounded-full border border-zinc-700 px-3 py-2 text-xs font-black text-zinc-300 hover:border-emerald-400 hover:text-emerald-300"
          >
            {link.label}
          </a>
        ))}
      </div>
    </details>
  );
}

export default function PolishWhereToWatchTennisInPolandPage() {
  const entries = getCountryBroadcastEntries(POLAND_CODE, tournamentIds);

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white md:px-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/pl/dzisiaj" className="text-sm font-bold text-zinc-400 hover:text-white">
          ← Tenis dzisiaj
        </Link>

        <section className="mt-8 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8 md:p-10">
          <p className="mb-4 inline-flex rounded-full bg-emerald-400/15 px-4 py-2 text-sm font-black uppercase tracking-[0.22em] text-emerald-300">
            Polska
          </p>
          <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            Gdzie oglądać tenis w Polsce?
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">
            Sprawdź legalne drogi oglądania meczów ATP, WTA i turniejów Wielkiego Szlema w Polsce. Prawa transmisyjne różnią się w zależności od turnieju, więc przed płatnością zawsze potwierdź konkretny mecz u oficjalnego nadawcy.
          </p>
          <p className="mt-4 text-sm font-bold text-zinc-500">
            Ostatnia weryfikacja rekordów nadawców: {TENNIS_BROADCAST_LAST_VERIFIED}.
          </p>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Szybka odpowiedź</p>
            <h2 className="mt-2 text-xl font-black">Najpierw sprawdź turniej</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Wielkie Szlemy, ATP Tour i WTA Tour mogą mieć oddzielne prawa, dlatego nazwa zawodnika nie wystarcza do wyboru transmisji.
            </p>
          </article>
          <article className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Transmisja na żywo</p>
            <h2 className="mt-2 text-xl font-black">Potwierdź kort i sesję</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Nie każdy kort ma pełne wideo. Sprawdź, czy nadawca pokazuje wybrany mecz, a nie tylko turniej lub skróty.
            </p>
          </article>
          <article className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Iga Świątek</p>
            <h2 className="mt-2 text-xl font-black">Sprawdzaj mecz, nie tylko nazwisko</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Mecze Igi Świątek są często szeroko promowane, ale dostępność nadal zależy od turnieju, rundy i aktualnych praw.
            </p>
          </article>
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">Nadawcy i opcje oglądania</h2>
          <p className="mt-3 max-w-3xl leading-7 text-zinc-400">
            Poniższe wiersze pochodzą z istniejącej bazy Watch Tennis Today. Traktuj je jako punkt startowy i przed meczem otwórz oficjalny harmonogram nadawcy.
          </p>

          <div className="mt-6 grid gap-4">
            {entries.length ? (
              entries.map((entry) => (
                <article key={`${entry.tournamentId}-${entry.broadcasterName}`} className="rounded-2xl border border-zinc-800 bg-black p-5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                    {entry.tournamentName}
                  </p>
                  <h3 className="mt-2 text-2xl font-black">{entry.broadcasterName}</h3>
                  <dl className="mt-4 grid gap-3 text-sm text-zinc-300 md:grid-cols-2">
                    <div>
                      <dt className="font-black text-zinc-500">Transmisja online</dt>
                      <dd className="mt-1">{entry.streamingServiceName}</dd>
                    </div>
                    <div>
                      <dt className="font-black text-zinc-500">Subskrypcja</dt>
                      <dd className="mt-1">{entry.requiresSubscription ? "Zwykle wymagana" : "Zwykle niewymagana"}</dd>
                    </div>
                    <div>
                      <dt className="font-black text-zinc-500">Powtórki</dt>
                      <dd className="mt-1">{entry.replaysAvailable ? "Wskazane jako dostępne" : "Do potwierdzenia u nadawcy"}</dd>
                    </div>
                    <div>
                      <dt className="font-black text-zinc-500">Pewność danych</dt>
                      <dd className="mt-1">{entry.confidenceLevel}</dd>
                    </div>
                  </dl>
                  <p className="mt-4 leading-7 text-zinc-400">{entry.coverageNotes}</p>
                  {sourceList(entry.officialLinks)}
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-amber-400/40 bg-amber-950/20 p-5">
                <h3 className="text-xl font-black text-amber-100">Brak pełnych rekordów dla Polski</h3>
                <p className="mt-2 leading-7 text-zinc-300">
                  Nie dodajemy fikcyjnych nadawców. Użyj oficjalnych stron ATP, WTA i turniejów, aby potwierdzić dostępność transmisji.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">Jak sprawdzić dostępność przed meczem</h2>
          <ol className="mt-5 space-y-4 text-zinc-300">
            <li><strong className="text-white">1.</strong> Ustal, czy mecz należy do Wielkiego Szlema, ATP, WTA, kwalifikacji lub rozgrywek drużynowych.</li>
            <li><strong className="text-white">2.</strong> Sprawdź oficjalny plan gier i kort.</li>
            <li><strong className="text-white">3.</strong> Otwórz aplikację lub stronę nadawcy i potwierdź, że pokazuje konkretny mecz.</li>
            <li><strong className="text-white">4.</strong> Wróć do planu tuż przed startem, bo godziny i korty mogą się zmienić.</li>
          </ol>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/pl/dzisiaj" className="rounded-2xl bg-emerald-400 px-5 py-3 font-black text-black">Tenis dzisiaj</Link>
            <Link href="/pl/tenis-na-zywo" className="rounded-2xl border border-zinc-700 px-5 py-3 font-black text-white hover:border-emerald-400">Tenis na żywo</Link>
            <Link href="/watch-tennis-in/poland" className="rounded-2xl border border-zinc-700 px-5 py-3 font-black text-white hover:border-emerald-400">English Poland guide</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
