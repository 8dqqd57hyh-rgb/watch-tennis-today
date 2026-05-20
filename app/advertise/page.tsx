export const metadata = {
  title: "Advertise With Watch Tennis Today",
  description:
    "Advertising information for brands, tennis services and partners interested in reaching tennis fans through Watch Tennis Today.",
  alternates: {
    canonical: "https://watchtennistoday.com/advertise",
  },
};

export default function AdvertisePage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <a href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </a>

        <h1 className="text-4xl md:text-5xl font-black mt-8">
          Advertise With Watch Tennis Today
        </h1>

        <p className="text-zinc-300 mt-4 text-lg leading-relaxed">
          Watch Tennis Today is a tennis information website focused on live
          match discovery, tournament schedules, legal streaming guides and
          broadcaster information for tennis fans.
        </p>

        <section className="mt-10 space-y-6 text-zinc-300 leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Who this site reaches
            </h2>
            <p>
              The audience includes tennis fans looking for live matches,
              tournament coverage, TV schedules, streaming options and
              country-specific broadcaster guides.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Suitable advertising categories
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Sports media and streaming services</li>
              <li>Tennis equipment and apparel</li>
              <li>Travel or tournament-related services</li>
              <li>Sports technology and fan tools</li>
              <li>Relevant affiliate or sponsorship partnerships</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Advertising principles
            </h2>
            <p>
              Advertising must be clearly distinguishable from editorial
              content. Watch Tennis Today does not promote illegal streams,
              misleading downloads, unsafe redirects or deceptive offers.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Contact
            </h2>
            <p>
              For advertising, sponsorship or partnership requests, please use
              the contact page and include a short description of the brand,
              campaign and target region.
            </p>

            <a
              href="/contact"
              className="inline-block mt-4 rounded-xl bg-white text-black px-5 py-3 font-semibold hover:bg-zinc-200"
            >
              Contact Watch Tennis Today
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}