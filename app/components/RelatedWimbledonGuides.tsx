import Link from "next/link";

export const WIMBLEDON_GUIDE_LINKS = [
  { href: "/wimbledon-schedule", label: "Wimbledon Schedule" },
  { href: "/wimbledon-order-of-play", label: "Wimbledon Order of Play" },
  { href: "/wimbledon-tv-schedule", label: "Wimbledon TV Schedule" },
  { href: "/where-to-watch-wimbledon", label: "Where to Watch Wimbledon" },
  { href: "/best-vpn-for-wimbledon", label: "Best VPN for Wimbledon" },
  { href: "/wimbledon-live", label: "Wimbledon Live" },
  { href: "/wimbledon-prize-money", label: "Wimbledon Prize Money" },
  { href: "/wimbledon-draw", label: "Wimbledon Draw" },
  { href: "/wimbledon-results", label: "Wimbledon Results" },
];

export const WIMBLEDON_COUNTRY_GUIDE_LINKS = [
  { href: "/how-to-watch-wimbledon-in-usa", label: "How to watch Wimbledon in the USA" },
  { href: "/how-to-watch-wimbledon-in-uk", label: "Wimbledon TV and streaming in the UK" },
  { href: "/how-to-watch-wimbledon-in-canada", label: "How to watch Wimbledon in Canada" },
  { href: "/how-to-watch-wimbledon-in-australia", label: "Wimbledon TV and streaming in Australia" },
  { href: "/how-to-watch-wimbledon-in-poland", label: "How to watch Wimbledon in Poland" },
  { href: "/how-to-watch-wimbledon-in-germany", label: "How to watch Wimbledon in Germany" },
  { href: "/how-to-watch-wimbledon-in-france", label: "Wimbledon TV and streaming in France" },
  { href: "/how-to-watch-wimbledon-in-spain", label: "How to watch Wimbledon in Spain" },
  { href: "/how-to-watch-wimbledon-in-italy", label: "Wimbledon TV and streaming in Italy" },
  { href: "/how-to-watch-wimbledon-in-india", label: "How to watch Wimbledon in India" },
];

type RelatedWimbledonGuidesProps = {
  currentPath: string;
  theme?: "light" | "dark";
};

function normalizePath(path: string) {
  const trimmed = path.trim();
  if (trimmed === "/") return "/";
  return trimmed.replace(/\/$/, "");
}

export default function RelatedWimbledonGuides({
  currentPath,
  theme = "light",
}: RelatedWimbledonGuidesProps) {
  const normalizedCurrentPath = normalizePath(currentPath);
  const guideLinks = WIMBLEDON_GUIDE_LINKS.filter(
    (link) => normalizePath(link.href) !== normalizedCurrentPath
  );
  const countryLinks = WIMBLEDON_COUNTRY_GUIDE_LINKS.filter(
    (link) => normalizePath(link.href) !== normalizedCurrentPath
  );
  const dark = theme === "dark";

  return (
    <section
      className={
        dark
          ? "rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-white"
          : "rounded-3xl border border-zinc-200 bg-white p-6 text-zinc-950 shadow-sm"
      }
    >
      <p
        className={
          dark
            ? "text-xs font-black uppercase tracking-[0.2em] text-green-400"
            : "text-xs font-black uppercase tracking-[0.2em] text-emerald-700"
        }
      >
        Wimbledon cluster
      </p>
      <h2 className="mt-2 text-2xl font-black">Related Wimbledon Guides</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {guideLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              dark
                ? "rounded-2xl border border-zinc-800 bg-black p-4 font-black text-zinc-100 hover:border-green-500"
                : "rounded-2xl border border-zinc-200 bg-zinc-50 p-4 font-black text-zinc-950 hover:border-emerald-400 hover:bg-white"
            }
          >
            {link.label}
          </Link>
        ))}
      </div>

      <h3 className="mt-6 text-lg font-black">How to watch Wimbledon by country</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {countryLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              dark
                ? "rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-sm font-bold text-zinc-200 hover:border-green-500"
                : "rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-bold text-zinc-800 hover:border-emerald-400 hover:bg-white"
            }
          >
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
