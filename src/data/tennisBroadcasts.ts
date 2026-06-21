export type TennisTournamentId =
  | "australian-open"
  | "roland-garros"
  | "wimbledon"
  | "us-open"
  | "atp-tour"
  | "wta-tour";

export type TennisBroadcastConfidence = "confirmed" | "needs_check" | "partial";

export type TennisBroadcastCountry = {
  countryName: string;
  countryCode: string;
};

export type TennisTournamentGroup = {
  tournamentId: TennisTournamentId;
  tournamentName: string;
};

export type TennisBroadcastEntry = TennisBroadcastCountry &
  TennisTournamentGroup & {
    broadcasterName: string;
    streamingServiceName: string;
    officialWebsiteUrl: string;
    officialSourceUrls: string[];
    priceNote: string;
    monthlyPrice?: number;
    currency?: string;
    isFree: boolean;
    requiresSubscription: boolean;
    replaysAvailable: boolean | "unknown";
    englishCommentary: boolean | "unknown";
    supportedDevices: string[];
    coverageNotes: string;
    lastVerified: string;
    confidenceLevel: TennisBroadcastConfidence;
  };

export type TennisServicePriceOption = {
  id: string;
  name: string;
  monthlyCost: number;
  currency: "USD" | "EUR" | "GBP";
  coverageNote: string;
  priceNote: string;
};

export const TENNIS_BROADCAST_LAST_VERIFIED = "2026-06-21";

export const tennisBroadcastCountries: TennisBroadcastCountry[] = [
  { countryName: "Poland", countryCode: "PL" },
  { countryName: "United Kingdom", countryCode: "GB" },
  { countryName: "United States", countryCode: "US" },
  { countryName: "France", countryCode: "FR" },
  { countryName: "Germany", countryCode: "DE" },
  { countryName: "Italy", countryCode: "IT" },
  { countryName: "Spain", countryCode: "ES" },
  { countryName: "Netherlands", countryCode: "NL" },
  { countryName: "Ireland", countryCode: "IE" },
];

export const tennisTournamentGroups: TennisTournamentGroup[] = [
  { tournamentId: "australian-open", tournamentName: "Australian Open" },
  { tournamentId: "roland-garros", tournamentName: "Roland Garros" },
  { tournamentId: "wimbledon", tournamentName: "Wimbledon" },
  { tournamentId: "us-open", tournamentName: "US Open" },
  { tournamentId: "atp-tour", tournamentName: "ATP Tour" },
  { tournamentId: "wta-tour", tournamentName: "WTA Tour" },
];

const officialSources = {
  australianOpen: "https://ausopen.com/broadcasters",
  rolandGarros: "https://www.rolandgarros.com/en-us/article/roland-garros-2026-tv-broadcasters-france-international",
  wimbledon: "https://www.wimbledon.com/en_GB/about/tv_coverage",
  usOpenInternational: "https://www.usopen.org/en_US/about/tv_intl.html",
  usOpenDomestic: "https://www.usopen.org/en_US/content/watch_listen_live_to_the_us_open.html",
  atpSchedule: "https://www.atptour.com/en/tournaments/tv-schedule",
  tennisTv: "https://www.tennistv.com/",
  tennisTvPrice: "https://support.tennistv.com/hc/en-us/articles/21872957780636-How-much-does-Tennis-TV-cost",
  wtaWhereToWatch: "https://www.wtatennis.com/where-to-watch-tennis",
  wtaUnlocked: "https://www.wtatennis.com/unlocked",
  skySportsTennis: "https://www.sky.com/tv/sports/tennis",
  skyGroupAtpWta: "https://www.skygroup.sky/article/sky-secures-new-partnerships-for-the-atp-and-wta-tours-which-will-see-year-round-tennis-for-fans-on-sky-sports",
  nowSports: "https://www.nowtv.com/gb/help/article/sports-membership",
  tennisChannel: "https://www.tennischannel.com/",
  tennisChannelPrice: "https://tennischannel.freshdesk.com/support/solutions/articles/153000236563-how-much-does-a-tennis-channel-subscription-cost-",
  maxNetherlands: "https://www.hbomax.com/nl/en",
  eurosportHelp: "https://help.eurosport.com/gb/Answer/Detail/000004690",
  primeRolandGarros: "https://www.primevideo.com/help?nodeId=G96EC9QCLFDC95J6",
};

const defaultDevices = ["Web browser", "Mobile app", "Smart TV or streaming device where provider supports it"];
const tennisTvDevices = ["Computer", "Tablet", "Mobile", "Apple TV", "Fire TV", "Roku", "Chromecast", "Xbox", "PlayStation", "Android TV"];
const nowDevices = ["Web browser", "Smart TVs", "Smartphones", "PC or Mac", "PS4/PS5", "Xbox"];

const slamBroadcasters: Record<
  TennisTournamentId,
  Record<string, Pick<TennisBroadcastEntry, "broadcasterName" | "streamingServiceName" | "officialWebsiteUrl" | "coverageNotes" | "confidenceLevel" | "isFree" | "requiresSubscription" | "replaysAvailable" | "englishCommentary" | "supportedDevices">>
> = {
  "australian-open": {
    PL: { broadcasterName: "Eurosport", streamingServiceName: "Max / Eurosport sports access", officialWebsiteUrl: officialSources.australianOpen, coverageNotes: "The AO official broadcaster directory should be used to confirm the current Polish listing and app package before paying.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: "unknown", supportedDevices: defaultDevices },
    GB: { broadcasterName: "Eurosport / TNT Sports", streamingServiceName: "discovery+ / Eurosport access", officialWebsiteUrl: officialSources.australianOpen, coverageNotes: "The AO directory is the source of truth for UK coverage; verify whether the selected app includes every court and replays.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: defaultDevices },
    US: { broadcasterName: "ESPN", streamingServiceName: "ESPN platforms", officialWebsiteUrl: officialSources.australianOpen, coverageNotes: "Use the AO broadcaster directory and ESPN schedule for domestic US session and replay details.", confidenceLevel: "partial", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: defaultDevices },
    FR: { broadcasterName: "Eurosport", streamingServiceName: "Max / Eurosport sports access", officialWebsiteUrl: officialSources.australianOpen, coverageNotes: "Confirm France in the AO official directory and then check the local Eurosport/Max package.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices },
    DE: { broadcasterName: "Eurosport", streamingServiceName: "discovery+ / Eurosport access", officialWebsiteUrl: officialSources.australianOpen, coverageNotes: "Confirm Germany in the AO official directory; Eurosport Premium routing differs by European market.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices },
    IT: { broadcasterName: "Eurosport", streamingServiceName: "discovery+ / Eurosport access", officialWebsiteUrl: officialSources.australianOpen, coverageNotes: "Confirm Italy in the AO official directory and verify the current discovery+ sports plan.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices },
    ES: { broadcasterName: "Eurosport", streamingServiceName: "Max / Eurosport sports access", officialWebsiteUrl: officialSources.australianOpen, coverageNotes: "Confirm Spain in the AO official directory and check whether the selected service carries Eurosport live feeds.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices },
    NL: { broadcasterName: "Eurosport", streamingServiceName: "HBO Max sports add-on / Eurosport access", officialWebsiteUrl: officialSources.australianOpen, coverageNotes: "HBO Max Netherlands lists a sports add-on; confirm AO availability in the official AO directory before subscribing.", confidenceLevel: "partial", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: "unknown", supportedDevices: defaultDevices },
    IE: { broadcasterName: "Eurosport / TNT Sports", streamingServiceName: "discovery+ / Eurosport access", officialWebsiteUrl: officialSources.australianOpen, coverageNotes: "Confirm Ireland in the AO official directory and check the local app package.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: defaultDevices },
  },
  "roland-garros": {
    PL: { broadcasterName: "Eurosport", streamingServiceName: "Max / Eurosport sports access", officialWebsiteUrl: officialSources.rolandGarros, coverageNotes: "Roland Garros publishes a yearly broadcaster article; confirm Poland and the current Max/Eurosport package.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: "unknown", supportedDevices: defaultDevices },
    GB: { broadcasterName: "TNT Sports", streamingServiceName: "discovery+ / TNT Sports access", officialWebsiteUrl: officialSources.rolandGarros, coverageNotes: "Verify UK coverage on the current Roland Garros broadcaster article and the TNT/discovery+ schedule.", confidenceLevel: "partial", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: defaultDevices },
    US: { broadcasterName: "TNT Sports", streamingServiceName: "Max / TNT Sports access", officialWebsiteUrl: officialSources.rolandGarros, coverageNotes: "The Roland Garros official broadcaster page should be checked with the US TNT/Max schedule for court and replay coverage.", confidenceLevel: "partial", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: defaultDevices },
    FR: { broadcasterName: "France Televisions and Prime Video", streamingServiceName: "france.tv and Prime Video", officialWebsiteUrl: officialSources.rolandGarros, coverageNotes: "Roland Garros confirms France Televisions and Prime Video for France; Prime Video help details selected night-session coverage.", confidenceLevel: "confirmed", isFree: true, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices },
    DE: { broadcasterName: "Eurosport", streamingServiceName: "discovery+ / Eurosport access", officialWebsiteUrl: officialSources.rolandGarros, coverageNotes: "Confirm Germany in the Roland Garros broadcaster article and local Eurosport/discovery+ plan.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices },
    IT: { broadcasterName: "Eurosport", streamingServiceName: "discovery+ / Eurosport access", officialWebsiteUrl: officialSources.rolandGarros, coverageNotes: "Confirm Italy on the official Roland Garros broadcaster article and local app package.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices },
    ES: { broadcasterName: "Eurosport", streamingServiceName: "Max / Eurosport sports access", officialWebsiteUrl: officialSources.rolandGarros, coverageNotes: "Confirm Spain on the official Roland Garros broadcaster article and local Max/Eurosport package.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices },
    NL: { broadcasterName: "Eurosport", streamingServiceName: "HBO Max sports add-on / Eurosport access", officialWebsiteUrl: officialSources.rolandGarros, coverageNotes: "Confirm Netherlands on the Roland Garros broadcaster article; HBO Max Netherlands lists a sports add-on but rights still need event verification.", confidenceLevel: "partial", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: "unknown", supportedDevices: defaultDevices },
    IE: { broadcasterName: "TNT Sports / Eurosport", streamingServiceName: "discovery+ / TNT Sports or Eurosport access", officialWebsiteUrl: officialSources.rolandGarros, coverageNotes: "Verify Ireland on the official Roland Garros broadcaster article because UK and Ireland rights can be packaged differently.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: defaultDevices },
  },
  wimbledon: {
    PL: { broadcasterName: "Polsat", streamingServiceName: "Polsat Box Go or current Polsat sports access", officialWebsiteUrl: officialSources.wimbledon, coverageNotes: "Wimbledon lists broadcasters by territory; verify Poland and the current Polsat streaming package.", confidenceLevel: "partial", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices },
    GB: { broadcasterName: "BBC", streamingServiceName: "BBC iPlayer", officialWebsiteUrl: officialSources.wimbledon, coverageNotes: "Wimbledon's official TV coverage page lists country broadcasters; UK viewers should still check BBC schedule and iPlayer availability.", confidenceLevel: "confirmed", isFree: true, requiresSubscription: false, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: defaultDevices },
    US: { broadcasterName: "ESPN", streamingServiceName: "ESPN platforms", officialWebsiteUrl: officialSources.wimbledon, coverageNotes: "Wimbledon lists country broadcasters; confirm the ESPN schedule and streaming access for the selected session.", confidenceLevel: "partial", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: defaultDevices },
    FR: { broadcasterName: "beIN Sports France", streamingServiceName: "beIN Sports Connect or TV-provider access", officialWebsiteUrl: officialSources.wimbledon, coverageNotes: "Wimbledon official TV coverage lists France as beIN Sports France.", confidenceLevel: "confirmed", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices },
    DE: { broadcasterName: "Prime Video", streamingServiceName: "Prime Video", officialWebsiteUrl: officialSources.wimbledon, coverageNotes: "Wimbledon official TV coverage lists Germany as Prime Video.", confidenceLevel: "confirmed", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices },
    IT: { broadcasterName: "Sky Sport", streamingServiceName: "NOW / Sky Go where available", officialWebsiteUrl: officialSources.wimbledon, coverageNotes: "Verify Italy on Wimbledon's official coverage page and the current Sky/NOW package before paying.", confidenceLevel: "partial", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices },
    ES: { broadcasterName: "Movistar Plus+", streamingServiceName: "Movistar Plus+", officialWebsiteUrl: officialSources.wimbledon, coverageNotes: "Verify Spain on Wimbledon's official coverage page and the current Movistar plan.", confidenceLevel: "partial", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices },
    NL: { broadcasterName: "Ziggo Sport", streamingServiceName: "Ziggo Sport / provider access", officialWebsiteUrl: officialSources.wimbledon, coverageNotes: "Verify Netherlands on Wimbledon's official coverage page and the current Ziggo Sport package.", confidenceLevel: "partial", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: "unknown", supportedDevices: defaultDevices },
    IE: { broadcasterName: "TNT Sports / discovery+", streamingServiceName: "discovery+ / TNT Sports access", officialWebsiteUrl: officialSources.wimbledon, coverageNotes: "Warner Bros. Discovery announced Wimbledon singles finals and highlights for UK and Ireland; verify full-match rights on the official Wimbledon page.", confidenceLevel: "partial", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: defaultDevices },
  },
  "us-open": {
    PL: { broadcasterName: "Eurosport", streamingServiceName: "Max / Eurosport sports access", officialWebsiteUrl: officialSources.usOpenInternational, coverageNotes: "Use the US Open international partners page to confirm Poland and then check the local Max/Eurosport package.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: "unknown", supportedDevices: defaultDevices },
    GB: { broadcasterName: "Sky Sports", streamingServiceName: "NOW / Sky Go", officialWebsiteUrl: officialSources.usOpenInternational, coverageNotes: "Sky states exclusive US Open coverage in the UK and Ireland; confirm session details on Sky/NOW before subscribing.", confidenceLevel: "confirmed", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: nowDevices },
    US: { broadcasterName: "ESPN", streamingServiceName: "ESPN platforms", officialWebsiteUrl: officialSources.usOpenDomestic, coverageNotes: "USOpen.org states ESPN is the domestic media partner; verify current ESPN plan access for the selected match.", confidenceLevel: "confirmed", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: defaultDevices },
    FR: { broadcasterName: "Eurosport", streamingServiceName: "Max / Eurosport sports access", officialWebsiteUrl: officialSources.usOpenInternational, coverageNotes: "Confirm France on the US Open international partners page and local Max/Eurosport package.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices },
    DE: { broadcasterName: "Sportdeutschland.TV", streamingServiceName: "Sportdeutschland.TV", officialWebsiteUrl: officialSources.usOpenInternational, coverageNotes: "The local German rights path has changed in recent seasons; verify the current US Open international partner listing before paying.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices },
    IT: { broadcasterName: "SuperTennis", streamingServiceName: "SuperTenniX / SuperTennis access", officialWebsiteUrl: officialSources.usOpenInternational, coverageNotes: "Confirm Italy on the official US Open international partners page and the SuperTennis streaming route.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices },
    ES: { broadcasterName: "Movistar Plus+", streamingServiceName: "Movistar Plus+", officialWebsiteUrl: officialSources.usOpenInternational, coverageNotes: "Confirm Spain on the US Open international partners page and the current Movistar plan.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices },
    NL: { broadcasterName: "Ziggo Sport", streamingServiceName: "Ziggo Sport / provider access", officialWebsiteUrl: officialSources.usOpenInternational, coverageNotes: "Confirm Netherlands on the US Open international partners page and the current Ziggo Sport package.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: "unknown", supportedDevices: defaultDevices },
    IE: { broadcasterName: "Sky Sports", streamingServiceName: "NOW / Sky Go", officialWebsiteUrl: officialSources.usOpenInternational, coverageNotes: "Sky states exclusive US Open coverage in the UK and Ireland; confirm the Ireland package and match schedule.", confidenceLevel: "confirmed", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: nowDevices },
  },
  "atp-tour": {},
  "wta-tour": {},
};

const tourCountryData: Record<string, { atp: string; wta: string; stream: string; confidence: TennisBroadcastConfidence; english: boolean | "unknown"; sources?: string[] }> = {
  PL: { atp: "Tennis TV / ATP official TV schedule", wta: "WTA official where-to-watch directory", stream: "Tennis TV for ATP; verify local WTA listing", confidence: "needs_check", english: "unknown" },
  GB: { atp: "Sky Sports", wta: "Sky Sports", stream: "NOW / Sky Go", confidence: "confirmed", english: true, sources: [officialSources.skyGroupAtpWta, officialSources.skySportsTennis, officialSources.nowSports] },
  US: { atp: "Tennis Channel / Tennis TV", wta: "Tennis Channel", stream: "Tennis Channel app / Tennis TV for ATP", confidence: "confirmed", english: true, sources: [officialSources.tennisChannel, officialSources.tennisChannelPrice] },
  FR: { atp: "Tennis TV / ATP official TV schedule", wta: "WTA official where-to-watch directory", stream: "Tennis TV for ATP; verify local WTA listing", confidence: "needs_check", english: false },
  DE: { atp: "Sky Deutschland", wta: "Sky Deutschland", stream: "Sky / WOW where available", confidence: "confirmed", english: false, sources: [officialSources.skyGroupAtpWta] },
  IT: { atp: "Sky Sport", wta: "Sky Sport / SuperTennis checks", stream: "Sky Go / NOW where available", confidence: "partial", english: false, sources: [officialSources.skyGroupAtpWta] },
  ES: { atp: "Tennis TV / ATP official TV schedule", wta: "WTA official where-to-watch directory", stream: "Verify local broadcaster listing", confidence: "needs_check", english: false },
  NL: { atp: "Tennis TV / ATP official TV schedule", wta: "WTA official where-to-watch directory", stream: "Verify local broadcaster listing", confidence: "needs_check", english: "unknown" },
  IE: { atp: "Sky Sports", wta: "Sky Sports", stream: "NOW / Sky Go", confidence: "confirmed", english: true, sources: [officialSources.skyGroupAtpWta, officialSources.skySportsTennis, officialSources.nowSports] },
};

function buildSlamEntries(tournamentId: Exclude<TennisTournamentId, "atp-tour" | "wta-tour">): TennisBroadcastEntry[] {
  const tournament = tennisTournamentGroups.find((item) => item.tournamentId === tournamentId)!;
  return tennisBroadcastCountries.map((country) => {
    const detail = slamBroadcasters[tournamentId][country.countryCode];
    const sourceUrls = [detail.officialWebsiteUrl];

    if (tournamentId === "roland-garros" && country.countryCode === "FR") {
      sourceUrls.push(officialSources.primeRolandGarros);
    }

    if (country.countryCode === "NL") {
      sourceUrls.push(officialSources.maxNetherlands);
    }

    if (detail.broadcasterName.includes("Eurosport")) {
      sourceUrls.push(officialSources.eurosportHelp);
    }

    return {
      ...country,
      ...tournament,
      ...detail,
      officialSourceUrls: Array.from(new Set(sourceUrls)),
      priceNote: "No stable official monthly tennis price stored. Check the broadcaster checkout page because sports add-ons and TV bundles change.",
      lastVerified: TENNIS_BROADCAST_LAST_VERIFIED,
    };
  });
}

function buildTourEntries(tournamentId: "atp-tour" | "wta-tour"): TennisBroadcastEntry[] {
  const tournament = tennisTournamentGroups.find((item) => item.tournamentId === tournamentId)!;
  return tennisBroadcastCountries.map((country) => {
    const detail = tourCountryData[country.countryCode];
    const isAtp = tournamentId === "atp-tour";
    const isUsTennisChannel = country.countryCode === "US" && !isAtp;
    const isSkyNow = ["GB", "IE"].includes(country.countryCode);
    const sourceUrls = [
      isAtp ? officialSources.atpSchedule : officialSources.wtaWhereToWatch,
      ...(isAtp ? [officialSources.tennisTv, officialSources.tennisTvPrice] : [officialSources.wtaUnlocked]),
      ...(detail.sources ?? []),
    ];

    return {
      ...country,
      ...tournament,
      broadcasterName: isAtp ? detail.atp : detail.wta,
      streamingServiceName: isAtp ? (country.countryCode === "US" ? "Tennis TV / Tennis Channel app" : detail.stream) : detail.stream,
      officialWebsiteUrl: isAtp ? officialSources.atpSchedule : officialSources.wtaWhereToWatch,
      officialSourceUrls: Array.from(new Set(sourceUrls)),
      priceNote: isUsTennisChannel
        ? "Tennis Channel official help lists USD 11.99/month in the United States, before taxes."
        : isSkyNow
          ? "NOW official help lists the Sports Month Membership at GBP 34.99/month in the UK; check Ireland availability and current offers."
          : isAtp
            ? "Tennis TV confirms monthly, six-month and annual plans, but pricing depends on country and currency."
            : "Use the WTA where-to-watch directory and the provider checkout page for the current local price.",
      monthlyPrice: isUsTennisChannel ? 11.99 : isSkyNow ? 34.99 : undefined,
      currency: isUsTennisChannel ? "USD" : isSkyNow ? "GBP" : undefined,
      isFree: false,
      requiresSubscription: true,
      replaysAvailable: isAtp || isUsTennisChannel ? true : "unknown",
      englishCommentary: detail.english,
      supportedDevices: isAtp ? tennisTvDevices : isSkyNow ? nowDevices : defaultDevices,
      coverageNotes: isAtp
        ? "ATP Tour rights are separate from Grand Slams and WTA. Tennis TV is the official ATP streaming service, but local TV rights and blackouts can still matter."
        : "WTA Tour rights are separate from Grand Slams and ATP. Use the WTA directory for your country and verify the exact tournament week.",
      lastVerified: TENNIS_BROADCAST_LAST_VERIFIED,
      confidenceLevel: detail.confidence,
    };
  });
}

export const tennisBroadcasts: TennisBroadcastEntry[] = [
  ...buildSlamEntries("australian-open"),
  ...buildSlamEntries("roland-garros"),
  ...buildSlamEntries("wimbledon"),
  ...buildSlamEntries("us-open"),
  ...buildTourEntries("atp-tour"),
  ...buildTourEntries("wta-tour"),
];

export function getTennisBroadcast(countryCode: string, tournamentId: TennisTournamentId) {
  return tennisBroadcasts.find(
    (entry) => entry.countryCode === countryCode && entry.tournamentId === tournamentId,
  );
}

export function getKnownBroadcastPriceOptions(): TennisServicePriceOption[] {
  const seen = new Set<string>();

  return tennisBroadcasts.reduce<TennisServicePriceOption[]>((options, entry) => {
    if (entry.monthlyPrice === undefined || !entry.currency || !["USD", "EUR", "GBP"].includes(entry.currency)) {
      return options;
    }

    const id = `${entry.countryCode.toLowerCase()}-${entry.streamingServiceName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

    if (seen.has(id)) {
      return options;
    }

    seen.add(id);
    options.push({
      id,
      name: `${entry.streamingServiceName} - ${entry.countryName}`,
      monthlyCost: entry.monthlyPrice,
      currency: entry.currency as "USD" | "EUR" | "GBP",
      coverageNote: `${entry.tournamentName}: ${entry.coverageNotes}`,
      priceNote: entry.priceNote,
    });

    return options;
  }, []);
}
