const links = [
  {
    title: "Best VPN for Tennis Streaming",
    href: "/best-vpn-for-tennis-streaming",
  },
  {
    title: "Best Ways to Watch Tennis Online",
    href: "/best-ways-to-watch-tennis-online",
  },
  {
    title: "ATP Live Today",
    href: "/atp-live-today",
  },
  {
    title: "WTA Live Today",
    href: "/wta-live-today",
  },
  {
    title: "Grand Slam Live Streams",
    href: "/grand-slam-live",
  },
  {
    title: "Watch Tennis in USA",
    href: "/watch-tennis-in/usa",
  },
];

export default function StreamingLinksGrid() {
  return (
    <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8">
      <h2 className="text-3xl font-black mb-5">
        More Tennis Streaming Guides
      </h2>

      <p className="text-zinc-400 leading-8 mb-6">
        Explore more tennis live streams, TV schedules and official viewing
        guides for ATP, WTA and Grand Slam tournaments.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="bg-black border border-zinc-800 rounded-2xl p-5 hover:border-green-500 transition-all"
          >
            <h3 className="text-xl font-black">
              {link.title}
            </h3>
          </a>
        ))}
      </div>
    </section>
  );
}