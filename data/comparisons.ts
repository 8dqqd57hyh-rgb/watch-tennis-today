export type StreamingComparison = {
  slug: string;
  title: string;
  description: string;
  left: string;
  right: string;
  bestForLeft: string;
  bestForRight: string;
  verdict: string;
  audience: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
};

export const comparisons: StreamingComparison[] = [
  {
    slug: "tennis-tv-vs-espn",
    title: "Tennis TV vs ESPN+",
    description:
      "Compare Tennis TV and ESPN+ for ATP, WTA and Grand Slam coverage.",
    left: "Tennis TV",
    right: "ESPN+",
    bestForLeft: "Best for ATP Tour fans who mainly want regular tour matches, replays and ATP-focused coverage.",
    bestForRight: "Best for US viewers who want selected Grand Slam coverage and broader sports content in one subscription ecosystem.",
    verdict:
      "Tennis TV is usually better for regular ATP Tour coverage, while ESPN+ can be better for US viewers who also want broader sports content and selected Grand Slam access.",
    audience: "US viewers comparing ATP tour coverage with wider sports streaming bundles.",
    primaryCta: {
      label: "Check US tennis viewing guide",
      href: "/watch-tennis-in/usa",
    },
    secondaryCta: {
      label: "See Tennis TV schedule",
      href: "/tennis-on-tv-today",
    },
  },
  {
    slug: "tennis-tv-vs-eurosport",
    title: "Tennis TV vs Eurosport",
    description:
      "Compare Tennis TV and Eurosport for tennis streaming and TV coverage.",
    left: "Tennis TV",
    right: "Eurosport",
    bestForLeft: "Best for ATP-focused streaming, match replays and fans who follow the tour week by week.",
    bestForRight: "Best for Grand Slam and European TV coverage where Eurosport owns local rights.",
    verdict:
      "Tennis TV is stronger for ATP Tour matches, while Eurosport is often better for Grand Slam coverage in many European markets.",
    audience: "European tennis fans deciding between tour-level ATP coverage and Grand Slam broadcaster access.",
    primaryCta: {
      label: "Find broadcasters by country",
      href: "/tennis-tv-broadcast-finder",
    },
    secondaryCta: {
      label: "Watch tennis abroad guide",
      href: "/watch-tennis-abroad",
    },
  },
  {
    slug: "tennis-tv-vs-sky-sports",
    title: "Tennis TV vs Sky Sports",
    description:
      "Compare Tennis TV and Sky Sports for tennis fans in markets where Sky carries ATP or WTA coverage.",
    left: "Tennis TV",
    right: "Sky Sports",
    bestForLeft: "Best for ATP fans who want a tennis-specific streaming product and do not need a wider TV bundle.",
    bestForRight: "Best for viewers who already have Sky Sports or want tennis alongside football, F1 and other sports.",
    verdict:
      "Tennis TV is the cleaner ATP-focused option, while Sky Sports can be better if your country package includes the tennis events you care about.",
    audience: "UK and European viewers comparing a specialist tennis service with a broader sports TV package.",
    primaryCta: {
      label: "Check UK tennis viewing guide",
      href: "/watch-tennis-in/uk",
    },
    secondaryCta: {
      label: "See today's TV schedule",
      href: "/tv-schedule",
    },
  },
  {
    slug: "tennis-tv-vs-dazn",
    title: "Tennis TV vs DAZN",
    description:
      "Compare Tennis TV and DAZN for tennis streaming, country availability and sports bundle value.",
    left: "Tennis TV",
    right: "DAZN",
    bestForLeft: "Best for ATP-focused tennis fans who want predictable tour coverage in supported regions.",
    bestForRight: "Best in countries where DAZN carries tennis rights as part of a wider sports package.",
    verdict:
      "Tennis TV is easier to evaluate for ATP coverage, while DAZN depends heavily on your country and current rights package.",
    audience: "Users checking whether a broad sports subscription is better than a tennis-specific service.",
    primaryCta: {
      label: "Check your country guide",
      href: "/tennis-tv-broadcast-finder",
    },
    secondaryCta: {
      label: "Compare streaming services",
      href: "/tennis-streaming-services",
    },
  },
  {
    slug: "espn-vs-tennis-channel",
    title: "ESPN+ vs Tennis Channel",
    description:
      "Compare ESPN+ and Tennis Channel for ATP, WTA and Grand Slam streaming.",
    left: "ESPN+",
    right: "Tennis Channel",
    bestForLeft: "Best for viewers already using ESPN's sports ecosystem and looking for selected major event coverage.",
    bestForRight: "Best for dedicated tennis coverage in the USA, including more tennis-specific programming.",
    verdict:
      "Tennis Channel is usually stronger for regular tennis coverage, while ESPN+ can be useful for viewers already using ESPN's sports ecosystem.",
    audience: "US tennis fans comparing two common paid sports options.",
    primaryCta: {
      label: "Open USA tennis guide",
      href: "/watch-tennis-in/usa",
    },
    secondaryCta: {
      label: "Today’s tennis on TV",
      href: "/tennis-on-tv-today",
    },
  },
  {
    slug: "eurosport-vs-discovery-plus",
    title: "Eurosport vs discovery+ for Tennis",
    description:
      "Compare Eurosport and discovery+ for tennis fans who want Grand Slam and European tennis coverage.",
    left: "Eurosport",
    right: "discovery+",
    bestForLeft: "Best for users who still access Eurosport through TV packages or local broadcaster bundles.",
    bestForRight: "Best where discovery+ carries Eurosport tennis streams and on-demand coverage in your region.",
    verdict:
      "The better option depends on how Eurosport is packaged in your country. Check the local broadcaster page before subscribing.",
    audience: "European Grand Slam viewers comparing TV channel access with streaming app access.",
    primaryCta: {
      label: "Find country broadcaster",
      href: "/tennis-tv-broadcast-finder",
    },
    secondaryCta: {
      label: "French Open streaming countries",
      href: "/where-to-watch-french-open",
    },
  },
  {
    slug: "tennis-channel-vs-tennis-tv",
    title: "Tennis Channel vs Tennis TV",
    description:
      "Compare Tennis Channel and Tennis TV for tennis-only viewing, ATP coverage and US availability.",
    left: "Tennis Channel",
    right: "Tennis TV",
    bestForLeft: "Best for US viewers who want a dedicated tennis broadcaster with broader tennis programming.",
    bestForRight: "Best for ATP fans who mainly care about official ATP Tour live matches and replays.",
    verdict:
      "Tennis Channel is a stronger US broadcaster route, while Tennis TV is the more focused ATP streaming product.",
    audience: "Dedicated tennis fans deciding between a broadcaster and an ATP-specific service.",
    primaryCta: {
      label: "Compare tennis streaming services",
      href: "/tennis-streaming-services",
    },
    secondaryCta: {
      label: "Watch tennis in the USA",
      href: "/watch-tennis-in/usa",
    },
  },
  {
    slug: "nordvpn-vs-surfshark-for-tennis",
    title: "NordVPN vs Surfshark for Tennis",
    description:
      "Compare VPNs for tennis streaming, travel privacy and secure public Wi-Fi use.",
    left: "NordVPN",
    right: "Surfshark",
    bestForLeft: "Best for users who prioritize speed, reliability and a premium travel VPN experience.",
    bestForRight: "Best for users who want a lower-cost VPN option for travel and general privacy.",
    verdict:
      "NordVPN is a stronger premium option for reliability, while Surfshark is attractive if you want a cheaper VPN for travel and streaming.",
    audience: "Traveling tennis fans who want to use their usual legal subscriptions more securely abroad.",
    primaryCta: {
      label: "Read tennis VPN guide",
      href: "/best-vpn-for-tennis-streaming",
    },
    secondaryCta: {
      label: "Watch tennis abroad safely",
      href: "/watch-tennis-abroad",
    },
  },
];
