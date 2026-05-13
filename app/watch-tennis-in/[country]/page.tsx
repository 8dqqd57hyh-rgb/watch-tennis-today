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
      note: "Selected tennis tournaments",
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

  const readable =
    readableCountry(country);

  return {
    title: `Where to Watch Tennis in ${readable} | Watch Tennis Today`,
    description: `Official tennis broadcasters, TV channels and streaming platforms available in ${readable}.`,
  };
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;

  const readable =
    readableCountry(country);

  const countryBroadcasters =
    broadcasters[country] || [];

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <a
          href="/"
          className="text-zinc-400 hover:text-white"
        >
          ← Back
        </a>

        <h1 className="text-5xl font-black mt-8 mb-4">
          🌍 Watch Tennis in {readable}
        </h1>

        <p className="text-zinc-400 text-lg mb-10">
          Official broadcasters, TV channels
          and streaming services for tennis in{" "}
          {readable}.
        </p>

        <div className="space-y-5">
          {countryBroadcasters.map(
            (broadcaster) => (
              <a
                key={broadcaster.name}
                href={broadcaster.url}
                target="_blank"
                className="block bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-green-500 transition-all"
              >
                <h2 className="text-2xl font-black mb-2">
                  {broadcaster.name}
                </h2>

                <p className="text-zinc-400">
                  {broadcaster.note}
                </p>
              </a>
            )
          )}
        </div>
      </div>
    </main>
  );
}