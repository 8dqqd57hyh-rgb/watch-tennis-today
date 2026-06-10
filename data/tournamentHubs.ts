export type StableTournamentHub = {
  slug: string;
  name: string;
  level: string;
  surface: string;
  seasonWindow: string;
  location: string;
  summary: string;
  whyItMatters: string;
  watchNote: string;
  relatedLinks: { label: string; href: string }[];
};

export const stableTournamentHubs: StableTournamentHub[] = [
  {
    slug: "australian-open",
    name: "Australian Open",
    level: "Grand Slam",
    surface: "Outdoor hard court",
    seasonWindow: "January",
    location: "Melbourne, Australia",
    summary:
      "The Australian Open opens the Grand Slam season and often creates difficult viewing windows for fans outside Australia. It is a strong hub for schedule, time-zone and legal-broadcast guidance.",
    whyItMatters:
      "The tournament can reshape early-season confidence quickly because players arrive after short off-seasons, warm-up events and long travel blocks. Heat policies, late sessions and Melbourne time conversion matter for fans.",
    watchNote:
      "Check the official order of play, your local broadcaster and Melbourne-to-local time conversion before relying on any listed start time.",
    relatedLinks: [
      { label: "Australian Open hub", href: "/australian-open" },
      { label: "Grand Slam live", href: "/grand-slam-live" },
      { label: "Time zone converter", href: "/tennis-time-zone-converter" },
    ],
  },
  {
    slug: "roland-garros",
    name: "Roland Garros / French Open",
    level: "Grand Slam",
    surface: "Outdoor clay",
    seasonWindow: "May–June",
    location: "Paris, France",
    summary:
      "Roland Garros is the central clay-court major and one of the best tournaments for evergreen tennis education because surface, stamina and court scheduling matter so much.",
    whyItMatters:
      "Clay changes rally length, movement, serve effectiveness and upset risk. A match can look routine on paper but become complicated when weather, court speed and physical load enter the picture.",
    watchNote:
      "French Open rights are separate from many regular tour subscriptions, so verify your country’s official rights holder before match time.",
    relatedLinks: [
      { label: "French Open live", href: "/french-open-live" },
      { label: "French Open TV schedule", href: "/french-open-tv-schedule" },
      { label: "Where to watch French Open", href: "/where-to-watch-french-open" },
    ],
  },
  {
    slug: "wimbledon",
    name: "Wimbledon",
    level: "Grand Slam",
    surface: "Outdoor grass",
    seasonWindow: "June–July",
    location: "London, United Kingdom",
    summary:
      "Wimbledon is the grass-court major and one of the most searched tennis events of the year. It deserves stable internal links beyond temporary live-score pages.",
    whyItMatters:
      "Grass rewards first-strike tennis, quick reactions and confident movement. The event also has distinctive scheduling traditions, rest-day patterns and high-value broadcaster demand.",
    watchNote:
      "Confirm the official Wimbledon broadcaster in your country and watch for court reassignment or roof updates when weather changes the schedule.",
    relatedLinks: [
      { label: "Wimbledon hub", href: "/wimbledon" },
      { label: "Wimbledon schedule", href: "/wimbledon-schedule" },
      { label: "Where to watch Wimbledon", href: "/where-to-watch-wimbledon" },
    ],
  },
  {
    slug: "us-open",
    name: "US Open",
    level: "Grand Slam",
    surface: "Outdoor hard court",
    seasonWindow: "August–September",
    location: "New York, United States",
    summary:
      "The US Open is the final Grand Slam of the season and a strong evergreen hub for night sessions, time-zone conversion and official coverage checks.",
    whyItMatters:
      "New York night sessions can run late and create unusual viewing windows for international fans. The event often decides season narratives after the summer hard-court swing.",
    watchNote:
      "Check session type, court assignment and local broadcaster rights because day and night coverage can be packaged differently.",
    relatedLinks: [
      { label: "US Open hub", href: "/us-open" },
      { label: "Grand Slam TV rights", href: "/grand-slam-tv-rights-explained" },
      { label: "Tennis on TV today", href: "/tennis-on-tv-today" },
    ],
  },
  {
    slug: "indian-wells",
    name: "Indian Wells",
    level: "ATP/WTA 1000",
    surface: "Outdoor hard court",
    seasonWindow: "March",
    location: "Indian Wells, United States",
    summary:
      "Indian Wells is one of the biggest non-Grand Slam events and a useful bridge between player pages, rankings guides and broadcast pages.",
    whyItMatters:
      "The large draw, desert conditions and combined ATP/WTA field make it feel close to a mini-major. Results can strongly affect ranking races before the spring clay season.",
    watchNote:
      "Use official ATP, WTA and tournament pages for final order-of-play details, then confirm the rights holder for your country.",
    relatedLinks: [
      { label: "Tournament levels guide", href: "/tennis-tournament-levels-guide" },
      { label: "Rankings explained", href: "/atp-wta-rankings-explained" },
      { label: "Official broadcasters guide", href: "/official-tennis-broadcasters-guide" },
    ],
  },
  {
    slug: "miami",
    name: "Miami Open",
    level: "ATP/WTA 1000",
    surface: "Outdoor hard court",
    seasonWindow: "March–April",
    location: "Miami, United States",
    summary:
      "Miami is a major combined hard-court event and pairs naturally with Indian Wells for fans following the early-season Sunshine Double.",
    whyItMatters:
      "Back-to-back 1000 events create fatigue, rematch and ranking-pressure stories. Miami can confirm whether an Indian Wells run was a one-week spike or a real trend.",
    watchNote:
      "Confirm official tournament schedule pages because start times and court assignments can shift across long combined-event days.",
    relatedLinks: [
      { label: "Tennis calendar", href: "/tennis-calendar" },
      { label: "Tennis schedule terms", href: "/tennis-schedule-terms-explained" },
      { label: "Live tennis", href: "/live-tennis" },
    ],
  },
  {
    slug: "madrid",
    name: "Madrid Open",
    level: "ATP/WTA 1000",
    surface: "Outdoor clay",
    seasonWindow: "April–May",
    location: "Madrid, Spain",
    summary:
      "Madrid is a high-altitude clay event, which gives it a different tactical profile from many other clay tournaments.",
    whyItMatters:
      "The altitude can make the ball travel faster, so Madrid is useful for explaining why all clay tournaments do not play the same way.",
    watchNote:
      "Use local broadcaster listings and official order of play because combined-event schedules can be dense.",
    relatedLinks: [
      { label: "Tennis surfaces explained", href: "/guides/tennis-surfaces-explained" },
      { label: "Tournament levels guide", href: "/tennis-tournament-levels-guide" },
      { label: "Broadcast finder", href: "/tennis-tv-broadcast-finder" },
    ],
  },
  {
    slug: "rome",
    name: "Italian Open / Rome",
    level: "ATP/WTA 1000",
    surface: "Outdoor clay",
    seasonWindow: "May",
    location: "Rome, Italy",
    summary:
      "Rome is one of the most important clay-court events before Roland Garros and often gives fans the best preview of Paris form.",
    whyItMatters:
      "The event is close enough to Roland Garros that tactical patterns, fitness and confidence can be more informative than earlier spring results.",
    watchNote:
      "Check official daily schedule pages because late clay matches and weather can move projected start times.",
    relatedLinks: [
      { label: "French Open live", href: "/french-open-live" },
      { label: "Tennis calendar", href: "/tennis-calendar" },
      { label: "Live scores explained", href: "/tennis-live-scores-explained" },
    ],
  },
  {
    slug: "cincinnati",
    name: "Cincinnati Open",
    level: "ATP/WTA 1000",
    surface: "Outdoor hard court",
    seasonWindow: "August",
    location: "Cincinnati, United States",
    summary:
      "Cincinnati is a key US Open preparation event and a good hub for summer hard-court form.",
    whyItMatters:
      "The fast turnaround before New York makes Cincinnati results useful for evaluating confidence, match fitness and hard-court patterns.",
    watchNote:
      "Confirm local broadcaster and session times, especially if following players from Europe or Asia.",
    relatedLinks: [
      { label: "US Open hub", href: "/us-open" },
      { label: "Time zone converter", href: "/tennis-time-zone-converter" },
      { label: "Best matches today", href: "/best-tennis-matches-today" },
    ],
  },
  {
    slug: "atp-finals",
    name: "ATP Finals",
    level: "Season finals",
    surface: "Indoor hard court",
    seasonWindow: "November",
    location: "Tour host city",
    summary:
      "The ATP Finals are built around the season’s top men’s singles players and doubles teams, with a format that differs from normal knockout draws.",
    whyItMatters:
      "Round-robin standings, qualification scenarios and indoor conditions create a different fan experience from standard tournaments.",
    watchNote:
      "Check group standings and official broadcaster listings because qualification scenarios can affect match importance.",
    relatedLinks: [
      { label: "Rankings explained", href: "/atp-wta-rankings-explained" },
      { label: "Tournament levels guide", href: "/tennis-tournament-levels-guide" },
      { label: "Newsletter", href: "/newsletter" },
    ],
  },
  {
    slug: "wta-finals",
    name: "WTA Finals",
    level: "Season finals",
    surface: "Indoor or event-specific hard court",
    seasonWindow: "October–November",
    location: "Tour host city",
    summary:
      "The WTA Finals bring together the leading women’s players and create strong search interest around qualification, groups and official viewing options.",
    whyItMatters:
      "The format makes every round-robin match meaningful, even before semifinals. Fans need context on standings, sets won and qualification paths.",
    watchNote:
      "Verify host-city time, group schedule and licensed WTA broadcast partner for your country.",
    relatedLinks: [
      { label: "WTA live today", href: "/wta-live-today" },
      { label: "Rankings explained", href: "/atp-wta-rankings-explained" },
      { label: "Tennis guides", href: "/tennis-guides" },
    ],
  },
];

export const stableTournamentHubSlugs = stableTournamentHubs.map((hub) => hub.slug);

export function getStableTournamentHub(slug: string) {
  const normalized = slug === "french-open" ? "roland-garros" : slug;
  return stableTournamentHubs.find((hub) => hub.slug === normalized) || null;
}
