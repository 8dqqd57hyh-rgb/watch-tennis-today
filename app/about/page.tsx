export const metadata = {
  title: "About | Watch Tennis Today",
  description:
    "About Watch Tennis Today — tennis live streams, TV schedules and broadcaster information.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black mb-6">
          About Watch Tennis Today
        </h1>

        <div className="space-y-5 text-zinc-300 leading-relaxed">
          <p>
            Watch Tennis Today helps tennis fans find live matches,
            TV schedules and official broadcaster information for ATP,
            WTA, Challenger and Grand Slam tennis.
          </p>

          <p>
            The goal is simple: make it easier to check what tennis
            is on today and where it may be available to watch legally.
          </p>

          <p>
            We do not host or stream matches directly. We link to
            official broadcasters, tournament pages and trusted tennis
            sources whenever possible.
          </p>

          <p>
            Broadcasting rights may vary by country, tournament and
            platform, so viewers should always confirm availability
            with the official provider.
          </p>
        </div>
      </div>
    </main>
  );
}