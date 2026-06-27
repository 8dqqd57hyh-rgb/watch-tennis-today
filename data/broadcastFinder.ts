export type BroadcastCountry = {
  slug: string;
  countryCode?: string;
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
  localContext: string;
  verificationAdvice: string;
  seoIntro?: string;
  localViewingTips?: string[];
  majorEventNotes?: string[];
};

export const broadcastCountries: BroadcastCountry[] = [
  {
    slug: "poland",
    countryCode: "PL",
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
    localContext: "In Poland, tennis fans often need to separate regular tour coverage from Grand Slam coverage. CANAL+ can be relevant for selected tour events, Eurosport is commonly checked for majors, and Tennis TV is useful for ATP events that are inside its rights package. WTA coverage can be more event-specific, so the safest workflow is to identify the tournament first, then confirm the local rightsholder.",
    verificationAdvice: "Before match time, compare the tournament order of play with CANAL+, Eurosport/Max, ATP and WTA listings. If the match is a Grand Slam, verify the tournament broadcaster page because those rights do not always match normal ATP or WTA coverage.",
  },
  {
    slug: "usa",
    countryCode: "US",
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
    localContext: "In the United States, tennis coverage is usually split across Tennis Channel, ESPN properties and tournament-specific partners. ESPN is especially important around several Grand Slam windows, while Tennis Channel and Tennis TV are more relevant for many tour-level weeks. Because rights can shift between main channels, streaming apps and overflow courts, do not assume one subscription covers every court.",
    verificationAdvice: "Check the tournament page, ESPN/Tennis Channel schedules and ATP or WTA directories on the day of play. For Grand Slam matches, confirm whether the match is on a main TV channel, an app feed or a separate tournament package.",
  },
  {
    slug: "uk",
    countryCode: "GB",
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
    localContext: "In the United Kingdom, Wimbledon has its own broadcast pattern and should be treated separately from regular ATP and WTA weeks. Sky Sports, TNT Sports, Eurosport/discovery+ and Tennis TV can each matter in different tournament windows. The important check is whether the match belongs to a tour event, a Grand Slam, Davis Cup/Billie Jean King Cup, or another competition with separate rights.",
    verificationAdvice: "Use the official Wimbledon, ATP and WTA directories first, then confirm against the broadcaster's live schedule. If the match is listed only as a score feed, video may still require a different rights package.",
  },
  {
    slug: "germany",
    countryCode: "DE",
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
    localContext: "In Germany, Grand Slam viewing can differ from weekly tour coverage, so Eurosport/discovery+ checks are often separate from Sky Deutschland or Tennis TV checks. ATP matches may be easier to trace through Tennis TV and ATP listings, while WTA and major-event coverage should be verified from official broadcaster directories before relying on a service.",
    verificationAdvice: "Confirm the event category first, then compare ATP, WTA, Eurosport/discovery+ and Sky Deutschland listings. Tournament pages are especially useful when a match moves courts or starts later than the original order of play.",
    seoIntro: "German tennis fans usually need to make two checks: whether the match is part of an ATP/WTA tour week or a Grand Slam, and whether the chosen provider includes the live court rather than only highlights or delayed coverage.",
    localViewingTips: [
      "For ATP weeks, compare Tennis TV and the ATP TV schedule with Sky Deutschland listings before assuming a court is included.",
      "For Grand Slams, check Eurosport/discovery+ and the tournament broadcaster page because those rights can sit outside normal ATP coverage.",
      "For German player matches, still verify the tournament owner first; player nationality does not guarantee one broadcaster covers every match.",
    ],
    majorEventNotes: [
      "Hamburg, Halle and Stuttgart can create extra local interest, but international rights still depend on the event contract.",
      "Wimbledon, Roland Garros, the Australian Open and US Open should each be checked as separate rights windows.",
    ],
  },
  {
    slug: "france",
    countryCode: "FR",
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
    localContext: "In France, Roland Garros has a special local profile and should be checked separately from normal tour coverage. France Televisions and Eurosport are frequent starting points for major-event checks, while Tennis TV applies to ATP events inside its package. WTA and smaller events may require a separate official directory check.",
    verificationAdvice: "For Roland Garros, start with the tournament broadcaster page and local channel listings. For other events, match the tournament category to ATP, WTA or Grand Slam directories before choosing a viewing option.",
    seoIntro: "France is one of the clearest examples of why tennis fans should not use one generic streaming answer. Roland Garros, weekly ATP events, WTA events and other Grand Slams can lead to different official viewing checks.",
    localViewingTips: [
      "For Roland Garros, start with the tournament broadcaster page and local France Televisions or Eurosport listings.",
      "For ATP matches outside the majors, compare Tennis TV availability with the ATP TV schedule and any local broadcaster listing.",
      "For WTA matches, use the WTA where-to-watch directory before relying on a general sports package.",
    ],
    majorEventNotes: [
      "Roland Garros is the priority local-rights check for French viewers and should be treated separately from other clay events.",
      "Paris indoor, Marseille, Montpellier and other French events can have local schedule nuances even when the tour category looks familiar.",
    ],
  },

  {
    slug: "spain",
    countryCode: "ES",
    country: "Spain",
    primaryBroadcasters: ["Movistar Plus+", "Eurosport", "Tennis TV"],
    grandSlamBroadcasters: ["Eurosport", "Movistar Plus+", "official tournament broadcaster lists"],
    atpOptions: ["Tennis TV", "Movistar Plus+", "ATP official TV schedule"],
    wtaOptions: ["WTA official where-to-watch directory", "selected Spanish sports packages"],
    officialDirectories: [
      { label: "ATP TV Schedule", url: "https://www.atptour.com/en/tournaments/tv-schedule" },
      { label: "WTA Where to Watch", url: "https://www.wtatennis.com/where-to-watch-tennis" },
      { label: "Roland-Garros Broadcasters", url: "https://www.rolandgarros.com/en-us/broadcasters" },
    ],
    notes: "Spanish tennis coverage can differ between ATP, WTA and Grand Slam tournaments. Check the tournament page before match time.",
    travelTip: "If you normally watch from Spain while traveling, verify whether your broadcaster account supports international streaming.",
    localContext: "In Spain, Movistar Plus+, Eurosport and Tennis TV may each be relevant depending on whether the match is a tour event, a Grand Slam or a combined tournament. Spanish players often receive prominent local coverage, but court-by-court availability can still depend on the rights package and app access.",
    verificationAdvice: "Check the ATP or WTA schedule, then verify the event on Movistar Plus+, Eurosport or the tournament's broadcaster page. For Grand Slams, avoid assuming Tennis TV coverage because majors use separate rights.",
    seoIntro: "Spain has high tennis demand because of major Spanish players and clay-season events, but the correct viewing route still starts with the tournament rights holder, not the player name alone.",
    localViewingTips: [
      "For ATP matches, check Tennis TV and the ATP TV schedule, then compare against Movistar Plus+ listings for Spain.",
      "For WTA matches, use the WTA official directory and the tournament schedule before choosing a package.",
      "For Grand Slams, check Eurosport, Movistar Plus+ and the official tournament broadcaster list because majors do not follow normal ATP or WTA rights.",
    ],
    majorEventNotes: [
      "Madrid and Barcelona can be especially important for Spanish fans, but court coverage can still differ between main feeds and app feeds.",
      "Alcaraz, Sorribes Tormo, Badosa and other Spanish player matches may get extra attention without changing the underlying rights owner.",
    ],
  },
  {
    slug: "italy",
    countryCode: "IT",
    country: "Italy",
    primaryBroadcasters: ["Sky Italia", "SuperTennis", "Tennis TV"],
    grandSlamBroadcasters: ["Eurosport", "Sky Italia", "official tournament broadcaster lists"],
    atpOptions: ["Tennis TV", "Sky Italia", "ATP official TV schedule"],
    wtaOptions: ["SuperTennis", "WTA official where-to-watch directory"],
    officialDirectories: [
      { label: "ATP TV Schedule", url: "https://www.atptour.com/en/tournaments/tv-schedule" },
      { label: "WTA Where to Watch", url: "https://www.wtatennis.com/where-to-watch-tennis" },
      { label: "Wimbledon TV Coverage", url: "https://www.wimbledon.com/en_GB/the_championships/tv_coverage" },
    ],
    notes: "Italian tennis coverage is split between local tennis channels, sports packages and official tour streaming options.",
    travelTip: "Italian viewers traveling abroad should confirm whether their normal broadcaster supports temporary access outside Italy.",
    localContext: "In Italy, Sky Italia, SuperTennis, Eurosport and Tennis TV can all appear in the tennis viewing path depending on event level. Italian player matches can draw extra local programming, but the rights still depend on the tournament rather than the player alone.",
    verificationAdvice: "Confirm the tournament category and court assignment, then check Sky Italia, SuperTennis, ATP/WTA directories and the relevant Grand Slam broadcaster list. Re-check close to start time if the match follows another match on the same court.",
  },
  {
    slug: "canada",
    countryCode: "CA",
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
    localContext: "In Canada, TSN, RDS, Sportsnet and Tennis TV can all be part of the tennis landscape, with English and French-language coverage sometimes handled differently. Grand Slam matches, Canadian player matches and tour events may not share the same streaming path.",
    verificationAdvice: "Check TSN/RDS and Sportsnet listings alongside ATP, WTA and tournament broadcaster pages. If a match is not on the main channel, look for app, bonus-court or language-specific availability before assuming it is unavailable.",
  },
  {
    slug: "australia",
    countryCode: "AU",
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
    localContext: "In Australia, the Australian Open has a distinct local broadcast profile, while overseas ATP and WTA events may sit with beIN Sports, Tennis TV or other official partners. Time zones also matter: many European and North American matches fall overnight or early morning for Australian viewers.",
    verificationAdvice: "For the Australian Open, start with official tournament and Nine/Stan Sport information. For overseas events, check ATP/WTA directories, beIN Sports and the tournament order of play, then convert the listed time carefully.",
  },
  {
    slug: "india",
    countryCode: "IN",
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
    localContext: "In India, tennis viewing often depends on tournament rights, sports-bundle availability and app coverage. Sony Sports Network, SonyLIV and Tennis TV can all be relevant, but Grand Slam and WTA access should be checked separately from standard ATP tour streaming.",
    verificationAdvice: "Verify the event through ATP, WTA or Grand Slam directories, then compare against Sony Sports/SonyLIV schedules and the tournament site. Late court changes can affect whether a match appears on a main feed or a secondary stream.",
  },
];

// AdSense quality: only these manually reviewed country guides are allowed to be indexable.
// If more countries are added later, keep them noindex until they have enough unique local editorial text.
export const ADSENSE_INDEXABLE_BROADCAST_COUNTRIES = new Set([
  "poland",
  "usa",
  "uk",
  "germany",
  "france",
  "spain",
  "italy",
]);

export function shouldIndexBroadcastCountry(slug: string) {
  return ADSENSE_INDEXABLE_BROADCAST_COUNTRIES.has(slug);
}

export function getBroadcastCountry(slug: string) {
  return broadcastCountries.find((country) => country.slug === slug);
}
