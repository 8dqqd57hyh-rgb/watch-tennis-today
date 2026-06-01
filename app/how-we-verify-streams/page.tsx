export const metadata = {
  title: "How We Verify Tennis Streaming Information | Watch Tennis Today",
  description:
    "Learn how Watch Tennis Today checks tennis streaming information, broadcaster links, tournament schedules and affiliate recommendations.",
  alternates: {
    canonical: "https://watchtennistoday.com/how-we-verify-streams",
  },
};

export const dynamic = "force-dynamic";
export default function HowWeVerifyStreamsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-700">
        Verification policy
      </p>
      <h1 className="mb-5 text-4xl font-bold tracking-tight text-neutral-950">
        How We Verify Tennis Streaming Information
      </h1>
      <div className="space-y-6 text-lg leading-8 text-neutral-800">
        <p>
          Watch Tennis Today is an informational tennis guide. We do not host,
          embed, retransmit or sell access to live tennis video. Our goal is to help
          fans find official schedules, broadcaster information and safer legal viewing routes.
        </p>
        <section className="rounded-3xl border bg-neutral-50 p-6">
          <h2 className="mb-3 text-2xl font-bold text-neutral-950">What we prioritize</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Official tournament websites and order-of-play pages.</li>
            <li>Recognized broadcasters and streaming platforms.</li>
            <li>Country-specific rights information where available.</li>
            <li>Clear labelling for affiliate or sponsored links.</li>
          </ul>
        </section>
        <section className="rounded-3xl border bg-white p-6">
          <h2 className="mb-3 text-2xl font-bold text-neutral-950">What we avoid</h2>
          <p>
            We avoid linking to pirated stream pages, hidden video embeds, misleading download
            pages, illegal IPTV offers and pages that pretend to be official broadcasters.
          </p>
        </section>
        <section className="rounded-3xl border bg-white p-6">
          <h2 className="mb-3 text-2xl font-bold text-neutral-950">Why information can change</h2>
          <p>
            Tennis schedules can change because of rain, long matches, walkovers, withdrawals,
            night-session decisions and broadcast rights. Users should always confirm final
            availability with the official broadcaster or tournament source before purchasing access.
          </p>
        </section>
      </div>
    </main>
  );
}
