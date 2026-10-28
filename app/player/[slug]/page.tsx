import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { players, type PlayerSlug } from "@/data/players";
import { getCanonicalPlayerSlug } from "@/data/playerSlugs";
import { ADSENSE_INDEXABLE_PLAYER_SLUGS } from "@/app/lib/adsenseIndexing";
import { canonicalUrl, robotsFor } from "@/app/lib/technicalSeo";

type PlayerProfile = {
  name: string;
  tour: string;
  tournaments: readonly string[];
  bio?: string;
  playStyle?: string;
  surfaceStrength?: string;
  watchReasons?: readonly string[];
};

type PageProps = { params: Promise<{ slug: string }> };

function getPlayer(slug: string): { slug: PlayerSlug; player: PlayerProfile } | null {
  const canonical = getCanonicalPlayerSlug(slug);
  if (!canonical) return null;
  return { slug: canonical, player: players[canonical] as PlayerProfile };
}

export function generateStaticParams() {
  return Object.keys(players).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const found = getPlayer(slug);

  if (!found) return { title: "Player not found | Watch Tennis Today", robots: robotsFor({ index: false }) };

  const { player } = found;
  const title = `Where to Watch ${player.name} | ${player.tour} Broadcasters`;
  const description = `Find official broadcasters and streaming services that show ${player.name}'s ${player.tour} and Grand Slam matches in your country.`;

  return {
    title,
    description,
    robots: robotsFor({ index: ADSENSE_INDEXABLE_PLAYER_SLUGS.has(found.slug) || Boolean(player.bio) }),
    alternates: { canonical: canonicalUrl(`/player/${found.slug}`) },
    openGraph: { title, description, url: canonicalUrl(`/player/${found.slug}`), type: "profile" },
  };
}

export default async function PlayerPage({ params }: PageProps) {
  const { slug } = await params;
  const found = getPlayer(slug);
  if (!found) notFound();

  const { player, slug: playerSlug } = found;
  const tourSlug = player.tour === "WTA" ? "wta-tour" : "atp-tour";

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white md:px-10">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-green-400">{player.tour} player</p>
        <h1 className="mt-2 text-4xl font-black md:text-6xl">{player.name}</h1>
        {player.bio ? <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-300">{player.bio}</p> : null}

        <section className="mt-8 rounded-3xl border border-green-500/30 bg-zinc-950 p-6">
          <h2 className="text-2xl font-black">Where to watch {player.name}</h2>
          <p className="mt-3 leading-7 text-zinc-300">
            {player.name}&apos;s matches are shown by the broadcaster that holds the rights for the tournament in your country.
            Tour events use {player.tour} Tour broadcasters; Grand Slams have their own rights holders.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={`/can-i-watch/${playerSlug}/poland`} className="rounded-xl bg-green-500 px-4 py-3 font-black text-black hover:bg-green-400">
              Find broadcasters for {player.name}
            </Link>
            <Link href={`/can-i-watch/${tourSlug}/usa`} className="rounded-xl border border-zinc-700 px-4 py-3 font-bold hover:border-green-500">
              {player.tour} Tour broadcasters
            </Link>
            <Link href="/watch-tennis-in" className="rounded-xl border border-zinc-700 px-4 py-3 font-bold hover:border-green-500">
              Choose your country
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-xl font-black">Usually plays</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-zinc-300">
              {player.tournaments.map((tournament) => <li key={tournament}>{tournament}</li>)}
            </ul>
          </div>
          {player.playStyle || player.surfaceStrength ? (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
              <h2 className="text-xl font-black">Playing style</h2>
              {player.playStyle ? <p className="mt-3 leading-7 text-zinc-300">{player.playStyle}</p> : null}
              {player.surfaceStrength ? <p className="mt-3 text-zinc-400">Best surfaces: {player.surfaceStrength}</p> : null}
            </div>
          ) : null}
        </section>

        {player.watchReasons?.length ? (
          <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-xl font-black">Why watch {player.name}</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-zinc-300">
              {player.watchReasons.map((reason) => <li key={reason}>{reason}</li>)}
            </ul>
          </section>
        ) : null}

        <p className="mt-8 text-sm text-zinc-500">
          <Link href="/players" className="underline hover:text-white">All players</Link>
        </p>
      </div>
    </main>
  );
}
