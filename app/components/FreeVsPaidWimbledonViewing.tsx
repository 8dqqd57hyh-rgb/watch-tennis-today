import Link from "next/link";

type FreeVsPaidWimbledonViewingProps = {
  variant: "where" | "live" | "tv";
};

const variantCopy = {
  where: {
    eyebrow: "Free vs paid Wimbledon viewing",
    heading: "How to decide whether Wimbledon is free or paid in your country",
    intro:
      "Wimbledon viewing options depend on where you are watching and which broadcaster holds the current rights. Treat this as a decision framework: confirm the country, match session and court before assuming a free stream or paid package will include it.",
    nextStep:
      "Start with your country guide, then compare the schedule and order of play so you know exactly which session you need.",
  },
  live: {
    eyebrow: "Live stream planning",
    heading: "Free and paid ways to watch Wimbledon live",
    intro:
      "For live Wimbledon matches, availability can change by country, round, court and current broadcast agreement. Use the official schedule first, then check whether your local route is free-to-air, included with a TV login or locked behind a paid sports package.",
    nextStep:
      "Before match time, check the daily schedule, confirm the order of play and then open the right country-specific viewing route.",
  },
  tv: {
    eyebrow: "TV and app access",
    heading: "Free TV, paid channels and streaming apps for Wimbledon",
    intro:
      "A Wimbledon TV schedule only helps if it is matched to the rights in your location. Some viewers may get free official coverage, while others need a sports channel, a standalone streaming plan or the login from an existing TV subscription.",
    nextStep:
      "Use the TV window as a starting point, then verify the court assignment and country guide before choosing a viewing option.",
  },
} satisfies Record<
  FreeVsPaidWimbledonViewingProps["variant"],
  {
    eyebrow: string;
    heading: string;
    intro: string;
    nextStep: string;
  }
>;

const viewingOptions = [
  {
    title: "Free-to-air or free official streaming",
    body:
      "Some countries may offer Wimbledon on public TV, free-to-air channels or official broadcaster apps at no extra cost. Availability is territory-specific and can differ by court, round or live-versus-replay coverage.",
  },
  {
    title: "Paid sports channels",
    body:
      "In many markets, Wimbledon sits inside a paid sports TV package. Check whether the channel includes the session you want, and whether extra courts require an app or separate add-on.",
  },
  {
    title: "Paid streaming services",
    body:
      "A standalone streaming service can be the cleanest option when it has current Wimbledon rights in your country. Confirm live access, replay access, device limits and cancellation terms before subscribing.",
  },
  {
    title: "Existing TV subscription login",
    body:
      "If your TV provider already includes the licensed Wimbledon broadcaster, you may be able to sign in to the broadcaster app with that provider account. This is not the same as a new free stream; it depends on your active subscription.",
  },
];

const nextStepLinks = [
  { href: "/wimbledon-schedule", label: "Check the Wimbledon schedule" },
  { href: "/wimbledon-order-of-play", label: "Check the order of play" },
  { href: "/where-to-watch-wimbledon", label: "Find where to watch by country" },
  { href: "/best-vpn-for-wimbledon", label: "Read safe VPN guidance" },
];

export default function FreeVsPaidWimbledonViewing({
  variant,
}: FreeVsPaidWimbledonViewingProps) {
  const copy = variantCopy[variant];

  return (
    <section className="mb-8 rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm">
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-700">
        {copy.eyebrow}
      </p>
      <h2 className="mb-3 text-2xl font-bold text-neutral-950">
        {copy.heading}
      </h2>
      <p className="max-w-4xl text-base leading-7 text-neutral-700">
        {copy.intro}
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {viewingOptions.map((option) => (
          <article key={option.title} className="rounded-2xl bg-neutral-50 p-4">
            <h3 className="font-bold text-neutral-950">{option.title}</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-700">
              {option.body}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-2xl border border-neutral-200 p-4">
          <h3 className="font-bold text-neutral-950">
            Does Tennis TV show Wimbledon?
          </h3>
          <p className="mt-2 text-sm leading-6 text-neutral-700">
            Usually no. Tennis TV is built around regular ATP Tour coverage,
            while Wimbledon and the other Grand Slams sell live broadcast rights
            separately. Always check the Grand Slam broadcaster for your country
            instead of assuming a normal tour subscription applies.
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 p-4">
          <h3 className="font-bold text-neutral-950">Travel and VPN note</h3>
          <p className="mt-2 text-sm leading-6 text-neutral-700">
            VPNs may help with privacy and with accessing your usual paid
            subscriptions while abroad, where the service allows it. Follow
            local laws and each streaming service&apos;s terms, and avoid any
            setup that is framed as bypassing rights restrictions.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <h3 className="font-bold text-neutral-950">Best next step</h3>
        <p className="mt-2 text-sm leading-6 text-neutral-700">
          {copy.nextStep}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {nextStepLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-bold text-neutral-950 hover:border-emerald-400 hover:bg-emerald-50"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
