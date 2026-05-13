import { headers } from "next/headers";

export const dynamic = "force-dynamic";

type Match = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category: string;
  status: string;
  score: string;
  startTime: string;
  watchProviders: {
    name: string;
    url: string;
  }[];
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\s+/g, "-");
}

async function getBaseUrl() {
  const headersList = await headers();
  const host = headersList.get("host");

  if (!host) {
    return "http://localhost:3000";
  }

  const protocol = host.includes("localhost")
    ? "http"
    : "https";

  return `${protocol}://${host}`;
}

async function getMatches(): Promise<Match[]> {
  const baseUrl = await getBaseUrl();

  const response = await fetch(`${baseUrl}/api/matches`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const decodedSlug = decodeURIComponent(slug);

const readableTitle = decodedSlug
  .split("-")
  .slice(1)
  .join(" ");

return {
  title: `${readableTitle || "Watch Tennis Match"} | Watch Tennis Today`,
  description:
    "Watch tennis match streams, TV channels, broadcasters and live schedules.",
};
}

export default async function MatchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const matches = await getMatches();

const decodedSlug = decodeURIComponent(slug);

const match = matches.find((item) =>
  decodedSlug.startsWith(item.id)
);

  if (!match) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        <a href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </a>

        <h1 className="text-4xl font-black mt-8">
          Match not found
        </h1>

        <p className="text-zinc-400 mt-3">
          This match may have finished or is no longer available in the current schedule.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <a href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </a>

        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8">
          <div className="flex items-center gap-3 mb-5">
            <span className="bg-green-500 text-black font-black px-4 py-2 rounded-full text-sm">
              {match.status}
            </span>

            <span className="text-zinc-400">
              {match.category}
            </span>
          </div>

          <h1 className="text-5xl font-black leading-tight mb-6">
            {match.player1}
            <br />
            vs
            <br />
            {match.player2}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div>
              <p className="text-zinc-500 text-sm mb-2">
                Tournament
              </p>
              <p className="text-2xl font-bold">
                {match.tournament}
              </p>
            </div>

            <div>
              <p className="text-zinc-500 text-sm mb-2">
                Score
              </p>
              <p className="text-2xl font-bold">
                {match.score}
              </p>
            </div>

            <div>
              <p className="text-zinc-500 text-sm mb-2">
                Start Time
              </p>
              <p className="text-xl font-semibold">
                {new Date(match.startTime).toLocaleString()}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-black mb-5">
              📺 Where to Watch
            </h2>

            {match.watchProviders.length > 0 ? (
              <div className="space-y-4">
                {match.watchProviders.map((provider) => (
                  <a
                    key={provider.name}
                    href={provider.url}
                    target="_blank"
                    className="block bg-green-500 text-black rounded-2xl px-5 py-4 font-black hover:bg-green-400 transition-all"
                  >
                    {provider.name}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-zinc-400">
                No trusted watch source found yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}