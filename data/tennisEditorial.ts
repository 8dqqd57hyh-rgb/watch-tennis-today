export type TournamentEditorialProfile = {
  level: string;
  surface: string;
  format: string;
  history: string;
  viewingContext: string;
  fanChecklist: string[];
};

const TOURNAMENT_PROFILES: Record<string, TournamentEditorialProfile> = {
  "roland-garros": {
    level: "Grand Slam",
    surface: "Outdoor clay",
    format: "Singles, doubles and qualifying draws with best-of-five men's singles matches in the main draw.",
    history: "Roland Garros, also known as the French Open, is the major clay-court event of the tennis season. It is known for long rallies, physical baseline exchanges and schedule changes caused by weather or extended matches on slower courts.",
    viewingContext: "French Open rights are separate from regular ATP or WTA streaming packages, so fans should always confirm the broadcaster for their country before match time.",
    fanChecklist: ["Official order of play", "Court assignment", "Local broadcaster", "Weather or roof updates", "Night-session timing"],
  },
  "wimbledon": {
    level: "Grand Slam",
    surface: "Outdoor grass",
    format: "Singles, doubles and qualifying draws, with traditions and court scheduling that differ from most tour events.",
    history: "Wimbledon is the oldest Grand Slam tournament and the centerpiece of the grass-court season. Fast courts, short reaction times and serve-return patterns make the event feel very different from clay or slow hard-court tournaments.",
    viewingContext: "Wimbledon coverage is usually handled by national broadcasters and official rights partners, so legal viewing options vary strongly by region.",
    fanChecklist: ["Centre Court schedule", "Court 1 schedule", "Rain or roof status", "Country broadcaster", "Grass-court form"],
  },
  "us-open": {
    level: "Grand Slam",
    surface: "Outdoor hard court",
    format: "Singles, doubles, qualifying and night sessions across a large hard-court complex.",
    history: "The US Open is known for loud night sessions, fast momentum swings and a packed two-week schedule. Matches can run late in New York, so international fans should double-check time-zone conversions.",
    viewingContext: "US Open streaming and TV access usually depends on official broadcasters in each territory, not on general tennis subscriptions alone.",
    fanChecklist: ["New York start time", "Night-session assignment", "Official broadcaster", "Court number", "Potential late finish"],
  },
  "australian-open": {
    level: "Grand Slam",
    surface: "Outdoor hard court",
    format: "Singles, doubles, qualifying and mixed doubles across Melbourne Park.",
    history: "The Australian Open opens the Grand Slam season and often creates difficult viewing windows for fans in Europe and the Americas. Heat, long matches and late-night finishes can affect the order of play.",
    viewingContext: "Because start times can fall overnight in many countries, fans should confirm both the local Melbourne time and their own local broadcaster schedule.",
    fanChecklist: ["Melbourne time", "Local converted time", "Heat delay notes", "Official broadcaster", "Court assignment"],
  },
};

export function slugifyEditorialName(value: string) {
  return value
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getTournamentEditorialProfile(slug: string, tournamentName: string): TournamentEditorialProfile {
  const normalizedSlug = slugifyEditorialName(slug || tournamentName);
  const normalizedName = slugifyEditorialName(tournamentName);

  const direct = TOURNAMENT_PROFILES[normalizedSlug] || TOURNAMENT_PROFILES[normalizedName];
  if (direct) return direct;

  const isSlam = /roland|french|wimbledon|us-open|australian/.test(`${normalizedSlug} ${normalizedName}`);
  const isClay = /clay|roland|french|rome|madrid|monte-carlo|barcelona|munich/.test(`${normalizedSlug} ${normalizedName}`);
  const isGrass = /grass|wimbledon|halle|queens|stuttgart|eastbourne|nottingham/.test(`${normalizedSlug} ${normalizedName}`);
  const isIndoor = /indoor|basel|vienna|paris|turin|rotterdam/.test(`${normalizedSlug} ${normalizedName}`);

  return {
    level: isSlam ? "Major tournament" : "Professional tennis event",
    surface: isClay ? "Clay-court context" : isGrass ? "Grass-court context" : isIndoor ? "Indoor hard-court context" : "Hard-court or event-specific context",
    format: `${tournamentName} may include singles, doubles, qualifying or multiple draw sections depending on the event week. Check the official draw for the exact format.`,
    history: `${tournamentName} is followed by fans because tournament context changes how a match should be read: surface speed, draw stage, player workload and court assignment can all affect the viewing experience.`,
    viewingContext: `Legal viewing options for ${tournamentName} depend on media rights in each country. A match can have live scores available while video coverage is limited to a specific broadcaster or platform.`,
    fanChecklist: ["Official order of play", "Court assignment", "Round and draw", "Local broadcaster", "Schedule changes"],
  };
}

export function buildMatchEditorialContext(input: {
  player1: string;
  player2: string;
  tournament: string;
  category?: string | null;
  status: string;
  startTime?: string | null;
}) {
  const tournamentSlug = slugifyEditorialName(input.tournament);
  const profile = getTournamentEditorialProfile(tournamentSlug, input.tournament);
  const category = input.category || "Tennis";
  const status = input.status.toUpperCase();

  return {
    title: `Why ${input.player1} vs ${input.player2} is worth checking carefully`,
    preview: `${input.player1} vs ${input.player2} is listed in ${input.tournament}, so the most important fan checks are the official order of play, court assignment, round context and legal broadcaster for your country. ${profile.viewingContext}`,
    scheduleNote: status === "LIVE"
      ? "Because this match is live, score and point information can move faster than editorial pages update. Use the live status as a guide, then confirm key details with the tournament or broadcaster."
      : status === "UPCOMING"
        ? "Because this match is upcoming, the start time can still move if earlier matches run long, weather interrupts play or the tournament changes court order."
        : "Because this match may be finished or outside the current live feed, use the page as match context rather than a guaranteed live-video source.",
    tournamentNote: `${input.tournament} is a ${profile.level.toLowerCase()} with ${profile.surface.toLowerCase()}. For ${category} matches, surface and scheduling context can be just as important as ranking or seed number.`,
  };
}
