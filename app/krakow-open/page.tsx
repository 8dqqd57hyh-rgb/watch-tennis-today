import Link from "next/link";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import JsonLd from "@/app/components/JsonLd";
import RevenueConversionPanel from "@/app/components/RevenueConversionPanel";
import EmailSignup from "@/app/components/EmailSignup";
import AdSlot from "@/app/components/AdSlot";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Krakow Open: Courts, Venues & Where to Watch Tennis",
  description:
    "Krakow Open tennis tournament guide with court numbers, venue addresses, live matches, TV schedule and where to watch legally.",
  alternates: {
    canonical: "https://watchtennistoday.com/krakow-open",
  },
};

const venues = [
  {
    name: "Krakow Racket Club",
    address: "Modrzejoska Street, Krakow, Poland",
    coordinates: "50.0647° N, 19.9450° E",
    courts: [
      {
        number: 1,
        name: "Centre Court",
        surface: "Hard Court (Blue)",
        capacity: 2500,
        description: "Main show court with roof capability",
      },
      {
        number: 2,
        name: "Court 2",
        surface: "Hard Court (Blue)",
        capacity: 1200,
        description: "Secondary court with good seating",
      },
      {
        number: 3,
        name: "Court 3",
        surface: "Hard Court (Blue)",
        capacity: 800,
        description: "Practice and preliminary matches",
      },
      {
        number: 4,
        name: "Court 4",
        surface: "Hard Court (Blue)",
        capacity: 600,
        description: "Practice and preliminary matches",
      },
      {
        number: 5,
        name: "Court 5",
        surface: "Hard Court (Blue)",
        capacity: 400,
        description: "Practice court",
      },
    ],
  },
];

const resourceLinks = [
  ["Krakow Open live", "/krakow-open"],
  ["Tennis calendar", "/tennis-calendar"],
  ["Live scores", "/live-tennis"],
  ["TV schedule", "/tennis-on-tv-today"],
  ["Broadcast finder", "/tennis-tv-broadcast-finder"],
  ["How to watch Poland", "/watch-tennis-in/poland"],
  ["Best VPN for tennis", "/best-vpn-for-tennis-streaming"],
  ["Official broadcasters", "/official-tennis-broadcasters-guide"],
];

const faq = [
  {
    q: "What is the Krakow Open?",
    a: "The Krakow Open is a professional tennis tournament held annually in Krakow, Poland. It features ATP and WTA matches on hard courts and attracts top international players.",
  },
  {
    q: "Where is the Krakow Open held?",
    a: "The tournament is held at the Krakow Racket Club, located on Modrzejoska Street in Krakow. It features 5 courts with a center court capacity of 2,500 spectators.",
  },
  {
    q: "What are the court surfaces at Krakow Open?",
    a: "All courts at Krakow Open are hard courts (blue surface), which provide consistent playing conditions and good tournament scheduling throughout the event.",
  },
  {
    q: "When is the Krakow Open held?",
    a: "The Krakow Open is typically held in October as part of the late-season tennis calendar. Check the official tournament page and tennis calendar for exact dates.",
  },
  {
    q: "How can I watch the Krakow Open?",
    a: "You can watch on official broadcasters in your country, major streaming services, or verify with your local TV guide. Check our broadcast finder for country-specific options.",
  },
  {
    q: "Can I buy tickets to watch in person?",
    a: "Yes, tickets are usually available through the official Krakow Open website or authorized ticket vendors. Day passes and season tickets are typically offered.",
  },
];

export default function KrakowOpenPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "EventVenue",
      name: "Krakow Racket Club",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Modrzejoska Street",
        addressLocality: "Krakow",
        addressCountry: "PL",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 50.0647,
        longitude: 19.945,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "SportsEvent",
      name: "Krakow Open Tennis Tournament",
      description:
        "Professional tennis tournament held in Krakow, Poland featuring ATP and WTA matches",
      location: {
        "@type": "Place",
        name: "Krakow Racket Club",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Modrzejoska Street",
          addressLocality: "Krakow",
          addressCountry: "PL",
        },
      },
      url: "https://watchtennistoday.com/krakow-open",
    },
    {
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
    },
  ];

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white md:px-10">
      <JsonLd data={jsonLd} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://watchtennistoday.com" },
          { name: "Tennis tournaments", url: "https://watchtennistoday.com/tennis-tournaments" },
          { name: "Krakow Open", url: "https://watchtennistoday.com/krakow-open" },
        ]}
      />

      <div className="mx-auto max-w-7xl">
        {/* Hero Section */}
        <section className="mb-10 rounded-[2.5rem] border border-blue-500/50 bg-gradient-to-br from-blue-950/60 via-black to-black p-8">
          <div className="mb-5 inline-flex rounded-full bg-blue-500 px-4 py-2 text-sm font-black text-white">
            Poland tournament
          </div>

          <h1 className="mb-6 text-5xl font-black leading-tight md:text-7xl">
            Krakow Open:
            <br />
            Courts & Venues
          </h1>

          <p className="mb-8 max-w-3xl text-lg leading-8 text-zinc-300">
            Complete guide to the Krakow Open tennis tournament in Poland. Find court numbers,
            venue addresses, seating capacity and where to watch matches legally.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="/live-tennis"
              className="rounded-2xl bg-blue-500 px-6 py-4 text-lg font-black text-white transition hover:bg-blue-400"
            >
              See live matches →
            </a>
            <a
              href="/tennis-tv-broadcast-finder"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold transition hover:border-blue-500"
            >
              Find broadcasts
            </a>
            <a
              href="/watch-tennis-in/poland"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold transition hover:border-blue-500"
            >
              Watch in Poland
            </a>
          </div>
        </section>

        <AdSlot />

        {/* Venue & Courts Section */}
        <section className="mb-12 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
          <div className="mb-8">
            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-zinc-500">
              Tournament location
            </p>
            <h2 className="text-4xl font-black">Krakow Racket Club</h2>
          </div>

          {venues.map((venue) => (
            <div key={venue.name} className="space-y-8">
              {/* Venue Info */}
              <div className="rounded-2xl border border-zinc-800 bg-black p-6">
                <h3 className="mb-4 text-2xl font-black">{venue.name}</h3>

                <div className="mb-6 grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="mb-1 text-sm font-bold uppercase tracking-widest text-zinc-500">
                      Address
                    </p>
                    <p className="text-lg font-semibold">{venue.address}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-bold uppercase tracking-widest text-zinc-500">
                      Coordinates
                    </p>
                    <p className="font-mono text-lg">{venue.coordinates}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-bold uppercase tracking-widest text-zinc-500">
                      Total courts
                    </p>
                    <p className="text-lg font-semibold">{venue.courts.length} courts</p>
                  </div>
                </div>

                <p className="rounded-lg bg-blue-950/40 p-4 text-zinc-300">
                  📍 <strong>Getting there:</strong> The Krakow Racket Club is accessible by public
                  transport and has parking facilities. Krakow's John Paul II International Airport
                  is approximately 11 km from the venue.
                </p>
              </div>

              {/* Courts Grid */}
              <div>
                <p className="mb-4 text-sm font-bold uppercase tracking-widest text-zinc-500">
                  Courts at this venue
                </p>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {venue.courts.map((court) => (
                    <div
                      key={court.number}
                      className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-5"
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <h4 className="text-xl font-black text-blue-400">Court {court.number}</h4>
                          <p className="font-semibold text-zinc-200">{court.name}</p>
                        </div>
                      </div>

                      <div className="mb-3 space-y-2 border-t border-zinc-700 pt-3">
                        <div>
                          <p className="text-xs uppercase tracking-widest text-zinc-500">Surface</p>
                          <p className="font-bold text-zinc-100">{court.surface}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-widest text-zinc-500">
                            Seating capacity
                          </p>
                          <p className="font-bold text-zinc-100">
                            {court.capacity.toLocaleString()} spectators
                          </p>
                        </div>
                      </div>

                      <p className="text-sm leading-6 text-zinc-400">{court.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Key Info Section */}
        <section className="mb-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <h3 className="mb-4 text-2xl font-black">Tournament Format</h3>
            <ul className="space-y-3 text-zinc-300">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                <span>Professional tennis events for ATP and WTA players</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                <span>Hard court surfaces (blue) for consistent play</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                <span>Typically held in October each year</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                <span>Modern facilities with international standards</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <h3 className="mb-4 text-2xl font-black">Visiting Tips</h3>
            <ul className="space-y-3 text-zinc-300">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                <span>Book tickets in advance during peak matches</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                <span>Explore Krakow's historic Old Town nearby</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                <span>Check weather and bring weather-appropriate clothing</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                <span>Multiple dining and hospitality options available</span>
              </li>
            </ul>
          </div>
        </section>

        <RevenueConversionPanel context="article" tournament="Krakow Open" />

        {/* Quick Links Section */}
        <section className="mb-12 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
          <div className="mb-6">
            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-zinc-500">
              Quick links
            </p>
            <h2 className="text-3xl font-black">Tennis resources</h2>
            <p className="mt-3 max-w-3xl leading-8 text-zinc-400">
              Find more tennis information, live scores, TV schedules and how to watch
              matches legally around the world.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-4">
            {resourceLinks.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="rounded-2xl border border-zinc-800 bg-black px-4 py-4 font-bold transition hover:border-blue-400"
              >
                {label} →
              </a>
            ))}
          </div>
        </section>

        {/* Email Signup */}
        <div className="mb-12">
          <EmailSignup
            title="Get tennis tournament updates"
            description="Get tournament schedules, viewing guides and tennis news delivered to your inbox."
            source="krakow-open-hub"
            buttonLabel="Send me tennis updates"
            context="Krakow Open hub"
          />
        </div>

        {/* FAQ Section */}
        <section className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="mb-5 text-3xl font-black">Krakow Open FAQ</h2>
          <div className="space-y-4">
            {faq.map((item) => (
              <div key={item.q} className="rounded-2xl bg-zinc-900 p-5">
                <h3 className="mb-2 text-xl font-black">{item.q}</h3>
                <p className="leading-7 text-zinc-400">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
