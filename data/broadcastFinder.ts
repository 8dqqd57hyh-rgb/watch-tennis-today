export type BroadcastCountry = {
  slug: string;
  country: string;
  primaryBroadcasters: string[];
  grandSlamBroadcasters: string[];
  atpOptions: string[];
  wtaOptions: string[];
  officialDirectories: {
    label: string;
    url: string;
  }[];
  notes: string;
  travelTip: string;
};

export const broadcastCountries: BroadcastCountry[] = [
  {
    slug: "poland",
    country: "Poland",
    primaryBroadcasters: ["CANAL+", "Eurosport", "Tennis TV"],
    grandSlamBroadcasters: ["Eurosport", "Max / Eurosport packages", "official tournament broadcaster lists"],
    atpOptions: ["Tennis TV", "ATP official TV schedule", "selected local sports packages"],
    wtaOptions: ["CANAL+", "WTA official where-to-watch directory"],
    officialDirectories: [
      { label: "ATP TV Schedule", url: "https://www.atptour.com/en/tournaments/tv-schedule" },
      { label: "WTA Where to Watch", url: "https://www.wtatennis.com/where-to-watch-tennis" },
      { label: "Roland-Garros Broadcasters", url: "https://www.rolandgarros.com/en-us/broadcasters" },
    ],
    notes: "Polish coverage can vary between ATP, WTA and Grand Slam events. Always check the tournament page before match time.",
    travelTip: "If you normally watch from Poland while traveling, check your broadcaster account terms before using it abroad.",
  },
  {
    slug: "usa",
    country: "United States",
    primaryBroadcasters: ["Tennis Channel", "ESPN / ESPN+", "Tennis TV"],
    grandSlamBroadcasters: ["ESPN / ESPN+", "Tennis Channel", "official tournament broadcaster lists"],
    atpOptions: ["Tennis TV", "Tennis Channel", "ATP official TV schedule"],
    wtaOptions: ["Tennis Channel", "WTA official where-to-watch directory"],
    officialDirectories: [
      { label: "ATP TV Schedule", url: "https://www.atptour.com/en/tournaments/tv-schedule" },
      { label: "WTA Where to Watch", url: "https://www.wtatennis.com/where-to-watch-tennis" },
      { label: "Wimbledon TV Coverage", url: "https://www.wimbledon.com/en_GB/the_championships/tv_coverage" },
    ],
    notes: "US tennis coverage is split between dedicated tennis platforms and larger sports packages, especially during Grand Slams.",
    travelTip: "US viewers abroad should check whether their streaming subscription allows temporary international access.",
  },
  {
    slug: "uk",
    country: "United Kingdom",
    primaryBroadcasters: ["Sky Sports", "TNT Sports", "BBC", "Tennis TV"],
    grandSlamBroadcasters: ["BBC", "TNT Sports", "Eurosport / discovery+", "official tournament broadcaster lists"],
    atpOptions: ["Tennis TV", "Sky Sports", "ATP official TV schedule"],
    wtaOptions: ["Sky Sports", "WTA official where-to-watch directory"],
    officialDirectories: [
      { label: "ATP TV Schedule", url: "https://www.atptour.com/en/tournaments/tv-schedule" },
      { label: "WTA Where to Watch", url: "https://www.wtatennis.com/where-to-watch-tennis" },
      { label: "Wimbledon TV Coverage", url: "https://www.wimbledon.com/en_GB/the_championships/tv_coverage" },
    ],
    notes: "UK rights are tournament-specific. Wimbledon information should be checked separately from ATP/WTA tour coverage.",
    travelTip: "Traveling UK fans should confirm whether their normal app works outside the UK before relying on it on match day.",
  },
  {
    slug: "germany",
    country: "Germany",
    primaryBroadcasters: ["Sky Deutschland", "Eurosport", "Tennis TV"],
    grandSlamBroadcasters: ["Eurosport", "discovery+", "official tournament broadcaster lists"],
    atpOptions: ["Tennis TV", "Sky Deutschland", "ATP official TV schedule"],
    wtaOptions: ["WTA official where-to-watch directory", "selected regional sports packages"],
    officialDirectories: [
      { label: "ATP TV Schedule", url: "https://www.atptour.com/en/tournaments/tv-schedule" },
      { label: "WTA Where to Watch", url: "https://www.wtatennis.com/where-to-watch-tennis" },
      { label: "Roland-Garros Broadcasters", url: "https://www.rolandgarros.com/en-us/broadcasters" },
    ],
    notes: "Grand Slam rights in Germany often differ from regular ATP tour coverage.",
    travelTip: "If you travel outside Germany, verify roaming and streaming restrictions for your existing subscription.",
  },
  {
    slug: "france",
    country: "France",
    primaryBroadcasters: ["France Télévisions", "Eurosport", "Tennis TV"],
    grandSlamBroadcasters: ["France Télévisions", "Eurosport", "official tournament broadcaster lists"],
    atpOptions: ["Tennis TV", "ATP official TV schedule"],
    wtaOptions: ["WTA official where-to-watch directory", "selected French sports packages"],
    officialDirectories: [
      { label: "Roland-Garros Broadcasters", url: "https://www.rolandgarros.com/en-us/broadcasters" },
      { label: "ATP TV Schedule", url: "https://www.atptour.com/en/tournaments/tv-schedule" },
      { label: "WTA Where to Watch", url: "https://www.wtatennis.com/where-to-watch-tennis" },
    ],
    notes: "French Open coverage has special local rights and should be checked separately from tour-level coverage.",
    travelTip: "French residents traveling abroad should confirm whether their normal broadcaster supports access outside France.",
  },
  {
    slug: "canada",
    country: "Canada",
    primaryBroadcasters: ["TSN", "Sportsnet", "Tennis TV"],
    grandSlamBroadcasters: ["TSN", "RDS", "official tournament broadcaster lists"],
    atpOptions: ["Tennis TV", "ATP official TV schedule", "TSN / Sportsnet packages"],
    wtaOptions: ["WTA official where-to-watch directory", "TSN / Sportsnet packages"],
    officialDirectories: [
      { label: "ATP TV Schedule", url: "https://www.atptour.com/en/tournaments/tv-schedule" },
      { label: "WTA Where to Watch", url: "https://www.wtatennis.com/where-to-watch-tennis" },
      { label: "Wimbledon TV Coverage", url: "https://www.wimbledon.com/en_GB/the_championships/tv_coverage" },
    ],
    notes: "Canadian coverage can differ between English and French-language packages.",
    travelTip: "If you are outside Canada temporarily, check whether your normal broadcaster allows streaming abroad.",
  },
  {
    slug: "australia",
    country: "Australia",
    primaryBroadcasters: ["Nine", "Stan Sport", "beIN Sports", "Tennis TV"],
    grandSlamBroadcasters: ["Nine", "Stan Sport", "official tournament broadcaster lists"],
    atpOptions: ["Tennis TV", "beIN Sports", "ATP official TV schedule"],
    wtaOptions: ["beIN Sports", "WTA official where-to-watch directory"],
    officialDirectories: [
      { label: "ATP TV Schedule", url: "https://www.atptour.com/en/tournaments/tv-schedule" },
      { label: "WTA Where to Watch", url: "https://www.wtatennis.com/where-to-watch-tennis" },
      { label: "Australian Open", url: "https://ausopen.com/" },
    ],
    notes: "Australian coverage is strongest around the Australian Open and can differ for overseas tour events.",
    travelTip: "Australian viewers abroad should check broadcaster travel rules before match day.",
  },
  {
    slug: "india",
    country: "India",
    primaryBroadcasters: ["Sony Sports Network", "SonyLIV", "Tennis TV"],
    grandSlamBroadcasters: ["Sony Sports Network", "SonyLIV", "official tournament broadcaster lists"],
    atpOptions: ["Tennis TV", "ATP official TV schedule", "Sony Sports packages"],
    wtaOptions: ["WTA official where-to-watch directory", "selected sports packages"],
    officialDirectories: [
      { label: "ATP TV Schedule", url: "https://www.atptour.com/en/tournaments/tv-schedule" },
      { label: "WTA Where to Watch", url: "https://www.wtatennis.com/where-to-watch-tennis" },
      { label: "Roland-Garros Broadcasters", url: "https://www.rolandgarros.com/en-us/broadcasters" },
    ],
    notes: "India tennis coverage often depends on tournament rights and platform-specific sports bundles.",
    travelTip: "If you are traveling, check whether your Indian streaming plan supports viewing outside India.",
  },
];

export function getBroadcastCountry(slug: string) {
  return broadcastCountries.find((country) => country.slug === slug);
}
