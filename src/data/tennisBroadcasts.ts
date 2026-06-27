export type TennisTournamentId =
  | "australian-open"
  | "roland-garros"
  | "wimbledon"
  | "us-open"
  | "atp-tour"
  | "wta-tour";

export type TennisBroadcastConfidence = "confirmed" | "needs_check" | "partial";
export type TennisPriceStatus = "known" | "free" | "check_official_site";

export type TennisBroadcastCountry = {
  countryName: string;
  countryCode: string;
};

export type TennisBroadcastCountryOption = TennisBroadcastCountry & {
  slug: string;
  country: string;
};

export type TennisTournamentGroup = {
  tournamentId: TennisTournamentId;
  tournamentName: string;
  eventType: "grand_slam" | "tour";
};

export type TennisOfficialLink = {
  label: string;
  url: string;
};

export type TennisServicePrice = {
  status: TennisPriceStatus;
  label: string;
  monthlyPrice?: number;
  currency?: "USD" | "EUR" | "GBP";
};

export type TennisBroadcastService = {
  broadcasterName: string;
  streamingServiceName: string;
  officialWebsiteUrl: string;
  officialLinks: TennisOfficialLink[];
  price: TennisServicePrice;
  isFree: boolean;
  requiresSubscription: boolean;
  replaysAvailable: boolean | "unknown";
  englishCommentary: boolean | "unknown";
  supportedDevices: string[];
  coverageNotes: string;
  lastVerified: string;
  confidenceLevel: TennisBroadcastConfidence;
};

export type TennisCountryCoverageGroup = TennisTournamentGroup & {
  services: TennisBroadcastService[];
};

export type TennisCountryBroadcastDatabase = TennisBroadcastCountry & {
  groups: TennisCountryCoverageGroup[];
};

export type TennisBroadcastEntry = TennisBroadcastCountry &
  TennisTournamentGroup &
  TennisBroadcastService & {
    countrySlug: string;
    tournamentSlug: TennisTournamentId;
    officialUrl: string;
    streamingService: string;
    free: boolean;
    subscriptionRequired: boolean;
    confidence: TennisBroadcastConfidence;
    notes?: string;
    officialSourceUrls: string[];
    priceNote: string;
    monthlyPrice?: number;
    currency?: "USD" | "EUR" | "GBP";
  };

export type TennisServicePriceOption = {
  id: string;
  countryCode: string;
  countryName: string;
  serviceName: string;
  name: string;
  monthlyCost: number;
  currency: "USD" | "EUR" | "GBP";
  coverageNote: string;
  priceNote: string;
  officialLinks: TennisOfficialLink[];
  tournamentIds: TennisTournamentId[];
};

export type TennisCountryServiceOption = {
  id: string;
  serviceName: string;
  broadcasterNames: string[];
  knownMonthlyPrice?: number;
  currency?: "USD" | "EUR" | "GBP";
  priceLabel: string;
  priceStatus: TennisPriceStatus;
  sourceSummary: string;
  lastVerified: string;
  officialLinks: TennisOfficialLink[];
  tournamentIds: TennisTournamentId[];
  tournamentNames: string[];
};

export const TENNIS_BROADCAST_LAST_VERIFIED = "2026-06-21";

const VALID_TENNIS_TOURNAMENT_IDS: TennisTournamentId[] = [
  "australian-open",
  "roland-garros",
  "wimbledon",
  "us-open",
  "atp-tour",
  "wta-tour",
];

const VALID_TENNIS_BROADCAST_CONFIDENCE: TennisBroadcastConfidence[] = ["confirmed", "needs_check", "partial"];

export const tennisTournamentGroups: TennisTournamentGroup[] = [
  { tournamentId: "australian-open", tournamentName: "Australian Open", eventType: "grand_slam" },
  { tournamentId: "roland-garros", tournamentName: "Roland Garros / French Open", eventType: "grand_slam" },
  { tournamentId: "wimbledon", tournamentName: "Wimbledon", eventType: "grand_slam" },
  { tournamentId: "us-open", tournamentName: "US Open", eventType: "grand_slam" },
  { tournamentId: "atp-tour", tournamentName: "ATP Tour", eventType: "tour" },
  { tournamentId: "wta-tour", tournamentName: "WTA Tour", eventType: "tour" },
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
  nowGbSports: "https://www.nowtv.com/gb/help/article/sports-membership",
  nowIeSports: "https://www.nowtv.com/ie/help/article/sports-membership-ie",
  tennisChannel: "https://www.tennischannel.com/",
  tennisChannelPrice: "https://tennischannel.freshdesk.com/support/solutions/articles/153000250411-price-increase",
  eurosportHelp: "https://help.eurosport.com/gb/Answer/Detail/000004690",
  maxNetherlands: "https://www.hbomax.com/nl/en",
  primeRolandGarros: "https://www.primevideo.com/help?nodeId=G96EC9QCLFDC95J6",
};

const defaultDevices = ["Web browser", "Mobile app", "Smart TV or streaming device where provider supports it"];
const tennisTvDevices = ["Computer", "Tablet", "Mobile", "Apple TV", "Fire TV", "Roku", "Chromecast", "Xbox", "PlayStation", "Android TV"];
const nowDevices = ["Web browser", "Smart TVs", "Smartphones", "PC or Mac", "PS4/PS5", "Xbox"];

const checkPrice = (label = "Check official site"): TennisServicePrice => ({
  status: "check_official_site",
  label,
});

const knownPrice = (
  monthlyPrice: number,
  currency: "USD" | "EUR" | "GBP",
  label: string,
): TennisServicePrice => ({
  status: monthlyPrice === 0 ? "free" : "known",
  monthlyPrice,
  currency,
  label,
});

const tournament = (tournamentId: TennisTournamentId) => {
  const group = tennisTournamentGroups.find((item) => item.tournamentId === tournamentId);
  if (!group) throw new Error(`Unknown tournament group: ${tournamentId}`);
  return group;
};

function links(...items: TennisOfficialLink[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
}

function service(input: Omit<TennisBroadcastService, "lastVerified">): TennisBroadcastService {
  return { ...input, lastVerified: TENNIS_BROADCAST_LAST_VERIFIED };
}

function slamService(
  tournamentId: Exclude<TennisTournamentId, "atp-tour" | "wta-tour">,
  input: Omit<TennisBroadcastService, "lastVerified" | "officialWebsiteUrl" | "officialLinks" | "price"> & {
    price?: TennisServicePrice;
    extraLinks?: TennisOfficialLink[];
  },
) {
  const sourceByTournament: Record<Exclude<TennisTournamentId, "atp-tour" | "wta-tour">, TennisOfficialLink> = {
    "australian-open": { label: "Australian Open broadcaster directory", url: officialSources.australianOpen },
    "roland-garros": { label: "Roland Garros broadcaster article", url: officialSources.rolandGarros },
    wimbledon: { label: "Wimbledon TV coverage", url: officialSources.wimbledon },
    "us-open": { label: "US Open broadcast partners", url: officialSources.usOpenInternational },
  };
  const primary = sourceByTournament[tournamentId];

  return {
    ...tournament(tournamentId),
    services: [
      service({
        ...input,
        officialWebsiteUrl: primary.url,
        officialLinks: links(primary, ...(input.extraLinks ?? [])),
        price: input.price ?? checkPrice(),
      }),
    ],
  };
}

function atpService(input: Omit<TennisBroadcastService, "lastVerified" | "officialWebsiteUrl" | "officialLinks" | "price"> & { price?: TennisServicePrice; extraLinks?: TennisOfficialLink[] }) {
  return {
    ...tournament("atp-tour"),
    services: [
      service({
        ...input,
        officialWebsiteUrl: officialSources.atpSchedule,
        officialLinks: links(
          { label: "ATP TV schedule", url: officialSources.atpSchedule },
          { label: "Tennis TV", url: officialSources.tennisTv },
          { label: "Tennis TV pricing help", url: officialSources.tennisTvPrice },
          ...(input.extraLinks ?? []),
        ),
        price: input.price ?? checkPrice("Tennis TV pricing depends on country and checkout currency"),
      }),
    ],
  };
}

function wtaService(input: Omit<TennisBroadcastService, "lastVerified" | "officialWebsiteUrl" | "officialLinks" | "price"> & { price?: TennisServicePrice; extraLinks?: TennisOfficialLink[] }) {
  return {
    ...tournament("wta-tour"),
    services: [
      service({
        ...input,
        officialWebsiteUrl: officialSources.wtaWhereToWatch,
        officialLinks: links(
          { label: "WTA where to watch", url: officialSources.wtaWhereToWatch },
          { label: "WTA Unlocked", url: officialSources.wtaUnlocked },
          ...(input.extraLinks ?? []),
        ),
        price: input.price ?? checkPrice("Check the WTA directory and provider checkout page"),
      }),
    ],
  };
}

function country(countryName: string, countryCode: string, groups: TennisCountryCoverageGroup[]): TennisCountryBroadcastDatabase {
  return { countryName, countryCode, groups };
}

const eurosportLink = { label: "Eurosport help", url: officialSources.eurosportHelp };
const maxNlLink = { label: "HBO Max Netherlands", url: officialSources.maxNetherlands };
const skyAtpWtaLink = { label: "Sky ATP and WTA announcement", url: officialSources.skyGroupAtpWta };
const nowGbLink = { label: "NOW UK Sports membership price", url: officialSources.nowGbSports };
const nowIeLink = { label: "NOW Ireland Sports membership price", url: officialSources.nowIeSports };
const tennisChannelLink = { label: "Tennis Channel", url: officialSources.tennisChannel };
const tennisChannelPriceLink = { label: "Tennis Channel subscription price", url: officialSources.tennisChannelPrice };

const countrySlugOverrides: Record<string, string> = {
  GB: "uk",
  US: "usa",
};

export const tennisBroadcastDatabase: TennisCountryBroadcastDatabase[] = [
  country("Poland", "PL", [
    slamService("australian-open", { broadcasterName: "Eurosport", streamingServiceName: "Max / Eurosport sports access", extraLinks: [eurosportLink], coverageNotes: "Confirm Poland in the Australian Open directory, then check the local Max or Eurosport sports package.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: "unknown", supportedDevices: defaultDevices }),
    slamService("roland-garros", { broadcasterName: "Eurosport", streamingServiceName: "Max / Eurosport sports access", extraLinks: [eurosportLink], coverageNotes: "Roland Garros publishes yearly broadcaster information; verify Poland and the current Max or Eurosport package.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: "unknown", supportedDevices: defaultDevices }),
    slamService("wimbledon", { broadcasterName: "Polsat", streamingServiceName: "Polsat Box Go or current Polsat sports access", coverageNotes: "Use Wimbledon's official TV coverage list to confirm Poland and the current Polsat streaming route.", confidenceLevel: "partial", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices }),
    slamService("us-open", { broadcasterName: "Eurosport", streamingServiceName: "Max / Eurosport sports access", extraLinks: [eurosportLink], coverageNotes: "Use the US Open international partners page for Poland, then verify the Max or Eurosport sports access package.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: "unknown", supportedDevices: defaultDevices }),
    atpService({ broadcasterName: "Polsat / ATP official TV schedule", streamingServiceName: "Polsat Box Go or current Polsat sports access", coverageNotes: "The ATP TV schedule lists Polsat for Poland. ATP Tour rights are separate from Grand Slams and WTA, so verify the selected tournament and court feed.", confidenceLevel: "partial", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices }),
    wtaService({ broadcasterName: "WTA official where-to-watch directory", streamingServiceName: "Check local WTA provider listing", coverageNotes: "WTA Tour rights are separate from ATP and Grand Slams. Use the WTA directory for the tournament week in Poland.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: "unknown", supportedDevices: defaultDevices }),
  ]),
  country("United Kingdom", "GB", [
    slamService("australian-open", { broadcasterName: "Eurosport / TNT Sports", streamingServiceName: "discovery+ / Eurosport access", extraLinks: [eurosportLink], coverageNotes: "Check the AO directory for the UK and confirm whether the selected app includes every court and replays.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: defaultDevices }),
    slamService("roland-garros", { broadcasterName: "TNT Sports", streamingServiceName: "discovery+ / TNT Sports access", coverageNotes: "Verify UK coverage on the current Roland Garros broadcaster article and the TNT or discovery+ schedule.", confidenceLevel: "partial", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: defaultDevices }),
    slamService("wimbledon", { broadcasterName: "BBC", streamingServiceName: "BBC iPlayer", price: knownPrice(0, "GBP", "No streaming subscription fee listed; UK TV Licence rules may apply"), coverageNotes: "Wimbledon lists UK coverage through the BBC. Check BBC schedule and iPlayer for live courts and replays.", confidenceLevel: "confirmed", isFree: true, requiresSubscription: false, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: defaultDevices }),
    slamService("us-open", { broadcasterName: "Sky Sports", streamingServiceName: "NOW / Sky Go", price: knownPrice(34.99, "GBP", "NOW Sports Month Membership: GBP 34.99/month"), extraLinks: [nowGbLink], coverageNotes: "Sky states UK US Open coverage; confirm match sessions on Sky Sports or NOW before subscribing.", confidenceLevel: "confirmed", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: nowDevices }),
    atpService({ broadcasterName: "Sky Sports", streamingServiceName: "NOW / Sky Go", price: knownPrice(34.99, "GBP", "NOW Sports Month Membership: GBP 34.99/month"), extraLinks: [skyAtpWtaLink, nowGbLink], coverageNotes: "Sky holds ATP and WTA tour partnerships in the UK. Tennis TV can still matter for ATP, but blackouts and Sky coverage should be checked.", confidenceLevel: "confirmed", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: nowDevices }),
    wtaService({ broadcasterName: "Sky Sports", streamingServiceName: "NOW / Sky Go", price: knownPrice(34.99, "GBP", "NOW Sports Month Membership: GBP 34.99/month"), extraLinks: [skyAtpWtaLink, nowGbLink], coverageNotes: "Sky is the main WTA tour route in the UK; verify the weekly tournament schedule before paying.", confidenceLevel: "confirmed", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: nowDevices }),
  ]),
  country("United States", "US", [
    slamService("australian-open", { broadcasterName: "ESPN", streamingServiceName: "ESPN platforms", coverageNotes: "Use the AO broadcaster directory and ESPN schedule for domestic US session and replay details.", confidenceLevel: "partial", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: defaultDevices }),
    slamService("roland-garros", { broadcasterName: "TNT Sports", streamingServiceName: "Max / TNT Sports access", coverageNotes: "Check the Roland Garros broadcaster article with the US TNT or Max schedule for court and replay coverage.", confidenceLevel: "partial", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: defaultDevices }),
    slamService("wimbledon", { broadcasterName: "ESPN", streamingServiceName: "ESPN platforms", coverageNotes: "Wimbledon lists US broadcasters; confirm the ESPN schedule and streaming access for the selected session.", confidenceLevel: "partial", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: defaultDevices }),
    { ...tournament("us-open"), services: [service({ broadcasterName: "ESPN", streamingServiceName: "ESPN platforms", officialWebsiteUrl: officialSources.usOpenDomestic, officialLinks: links({ label: "US Open domestic watch page", url: officialSources.usOpenDomestic }), price: checkPrice("Check ESPN or TV-provider checkout page"), coverageNotes: "USOpen.org lists ESPN as the domestic media partner; verify current ESPN plan access for the selected match.", confidenceLevel: "confirmed", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: defaultDevices })] },
    atpService({ broadcasterName: "Tennis Channel / Tennis TV", streamingServiceName: "Tennis TV / Tennis Channel app", coverageNotes: "ATP Tour rights are separate from Grand Slams and WTA. Tennis TV is official for ATP, while Tennis Channel can also matter in the US.", confidenceLevel: "confirmed", isFree: false, requiresSubscription: true, replaysAvailable: true, englishCommentary: true, supportedDevices: tennisTvDevices, extraLinks: [tennisChannelLink, tennisChannelPriceLink] }),
    wtaService({ broadcasterName: "Tennis Channel", streamingServiceName: "Tennis Channel app", price: knownPrice(11.99, "USD", "Tennis Channel monthly subscription: USD 11.99/month before taxes and fees"), extraLinks: [tennisChannelLink, tennisChannelPriceLink], coverageNotes: "Tennis Channel is the main US WTA route in this database. Confirm the exact tournament week and any TV-provider requirements.", confidenceLevel: "confirmed", isFree: false, requiresSubscription: true, replaysAvailable: true, englishCommentary: true, supportedDevices: defaultDevices }),
  ]),
  country("France", "FR", [
    slamService("australian-open", { broadcasterName: "Eurosport", streamingServiceName: "Max / Eurosport sports access", extraLinks: [eurosportLink], coverageNotes: "Confirm France in the AO directory and then check the local Eurosport or Max package.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices }),
    slamService("roland-garros", { broadcasterName: "France Televisions and Prime Video", streamingServiceName: "france.tv and Prime Video", extraLinks: [{ label: "Prime Video Roland Garros help", url: officialSources.primeRolandGarros }], coverageNotes: "Roland Garros confirms France Televisions and Prime Video for France; selected sessions may require Prime Video checks.", confidenceLevel: "confirmed", isFree: true, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices }),
    slamService("wimbledon", { broadcasterName: "beIN Sports France", streamingServiceName: "beIN Sports Connect or TV-provider access", coverageNotes: "Wimbledon's official TV coverage lists France as beIN Sports France.", confidenceLevel: "confirmed", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices }),
    slamService("us-open", { broadcasterName: "Eurosport", streamingServiceName: "Max / Eurosport sports access", extraLinks: [eurosportLink], coverageNotes: "Confirm France on the US Open international partners page and local Max or Eurosport package.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices }),
    atpService({ broadcasterName: "Tennis TV / ATP official TV schedule", streamingServiceName: "Tennis TV for ATP; verify local blackouts", coverageNotes: "ATP Tour coverage should be checked separately from Roland Garros and other Slams.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: true, englishCommentary: false, supportedDevices: tennisTvDevices }),
    wtaService({ broadcasterName: "WTA official where-to-watch directory", streamingServiceName: "Check local WTA provider listing", coverageNotes: "Use the WTA directory for France and verify the provider schedule for the tournament week.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices }),
  ]),
  country("Germany", "DE", [
    slamService("australian-open", { broadcasterName: "Eurosport", streamingServiceName: "discovery+ / Eurosport access", extraLinks: [eurosportLink], coverageNotes: "Confirm Germany in the AO directory; Eurosport Premium routing differs by European market.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices }),
    slamService("roland-garros", { broadcasterName: "Eurosport", streamingServiceName: "discovery+ / Eurosport access", extraLinks: [eurosportLink], coverageNotes: "Confirm Germany in the Roland Garros broadcaster article and local Eurosport or discovery+ plan.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices }),
    slamService("wimbledon", { broadcasterName: "Prime Video", streamingServiceName: "Prime Video", coverageNotes: "Wimbledon official TV coverage lists Germany as Prime Video. Check Prime Video availability and subscription terms before paying.", confidenceLevel: "confirmed", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices }),
    slamService("us-open", { broadcasterName: "Sportdeutschland.TV", streamingServiceName: "Sportdeutschland.TV", coverageNotes: "The German US Open rights path has changed in recent seasons; verify the current US Open international partner listing before paying.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices }),
    atpService({ broadcasterName: "Sky Deutschland", streamingServiceName: "Sky / WOW where available", extraLinks: [skyAtpWtaLink], coverageNotes: "Sky's ATP and WTA partnership covers Germany in this database, but weekly tournament schedules should still be checked.", confidenceLevel: "confirmed", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices }),
    wtaService({ broadcasterName: "Sky Deutschland", streamingServiceName: "Sky / WOW where available", extraLinks: [skyAtpWtaLink], coverageNotes: "Sky is the WTA tour route stored for Germany. Verify the exact tournament week.", confidenceLevel: "confirmed", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices }),
  ]),
  country("Italy", "IT", [
    slamService("australian-open", { broadcasterName: "Eurosport", streamingServiceName: "discovery+ / Eurosport access", extraLinks: [eurosportLink], coverageNotes: "Confirm Italy in the AO official directory and verify the current discovery+ sports plan.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices }),
    slamService("roland-garros", { broadcasterName: "Eurosport", streamingServiceName: "discovery+ / Eurosport access", extraLinks: [eurosportLink], coverageNotes: "Confirm Italy on the official Roland Garros broadcaster article and local app package.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices }),
    slamService("wimbledon", { broadcasterName: "Sky Sport", streamingServiceName: "NOW / Sky Go where available", coverageNotes: "Verify Italy on Wimbledon's official coverage page and the current Sky or NOW package before paying.", confidenceLevel: "partial", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices }),
    slamService("us-open", { broadcasterName: "SuperTennis", streamingServiceName: "SuperTenniX / SuperTennis access", coverageNotes: "Confirm Italy on the official US Open international partners page and the SuperTennis streaming route.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices }),
    atpService({ broadcasterName: "Sky Sport", streamingServiceName: "Sky Go / NOW where available", extraLinks: [skyAtpWtaLink], coverageNotes: "Sky Sport is stored as the ATP tour route for Italy; verify event-week availability.", confidenceLevel: "partial", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices }),
    wtaService({ broadcasterName: "Sky Sport / SuperTennis checks", streamingServiceName: "Sky Go / NOW where available", extraLinks: [skyAtpWtaLink], coverageNotes: "Italian WTA coverage should be checked against Sky, SuperTennis and the WTA directory for the tournament week.", confidenceLevel: "partial", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices }),
  ]),
  country("Spain", "ES", [
    slamService("australian-open", { broadcasterName: "Eurosport", streamingServiceName: "Max / Eurosport sports access", extraLinks: [eurosportLink], coverageNotes: "Confirm Spain in the AO official directory and check whether the selected service carries Eurosport live feeds.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices }),
    slamService("roland-garros", { broadcasterName: "Eurosport", streamingServiceName: "Max / Eurosport sports access", extraLinks: [eurosportLink], coverageNotes: "Confirm Spain on the official Roland Garros broadcaster article and local Max or Eurosport package.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices }),
    slamService("wimbledon", { broadcasterName: "Movistar Plus+", streamingServiceName: "Movistar Plus+", coverageNotes: "Verify Spain on Wimbledon's official coverage page and the current Movistar plan.", confidenceLevel: "partial", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices }),
    slamService("us-open", { broadcasterName: "Movistar Plus+", streamingServiceName: "Movistar Plus+", coverageNotes: "Confirm Spain on the US Open international partners page and the current Movistar plan.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices }),
    atpService({ broadcasterName: "Tennis TV / ATP official TV schedule", streamingServiceName: "Tennis TV for ATP; verify local broadcaster listing", coverageNotes: "ATP rights are separate from Slams and WTA; use Tennis TV plus the ATP schedule for Spain.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: true, englishCommentary: false, supportedDevices: tennisTvDevices }),
    wtaService({ broadcasterName: "WTA official where-to-watch directory", streamingServiceName: "Verify local broadcaster listing", coverageNotes: "Use the WTA directory for Spain and verify the provider schedule for the tournament week.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: false, supportedDevices: defaultDevices }),
  ]),
  country("Netherlands", "NL", [
    slamService("australian-open", { broadcasterName: "Eurosport", streamingServiceName: "HBO Max sports add-on / Eurosport access", extraLinks: [maxNlLink, eurosportLink], coverageNotes: "HBO Max Netherlands lists sports access, but AO availability should still be confirmed in the official AO directory.", confidenceLevel: "partial", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: "unknown", supportedDevices: defaultDevices }),
    slamService("roland-garros", { broadcasterName: "Eurosport", streamingServiceName: "HBO Max sports add-on / Eurosport access", extraLinks: [maxNlLink, eurosportLink], coverageNotes: "Confirm Netherlands on the Roland Garros broadcaster article; local HBO Max sports access should be checked at checkout.", confidenceLevel: "partial", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: "unknown", supportedDevices: defaultDevices }),
    slamService("wimbledon", { broadcasterName: "Ziggo Sport", streamingServiceName: "Ziggo Sport / provider access", coverageNotes: "Verify Netherlands on Wimbledon's official coverage page and the current Ziggo Sport package.", confidenceLevel: "partial", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: "unknown", supportedDevices: defaultDevices }),
    slamService("us-open", { broadcasterName: "Ziggo Sport", streamingServiceName: "Ziggo Sport / provider access", coverageNotes: "Confirm Netherlands on the US Open international partners page and the current Ziggo Sport package.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: "unknown", supportedDevices: defaultDevices }),
    atpService({ broadcasterName: "Tennis TV / ATP official TV schedule", streamingServiceName: "Tennis TV for ATP; verify local broadcaster listing", coverageNotes: "Use Tennis TV and the ATP schedule for Netherlands checks; local blackouts can still apply.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: true, englishCommentary: "unknown", supportedDevices: tennisTvDevices }),
    wtaService({ broadcasterName: "WTA official where-to-watch directory", streamingServiceName: "Verify local broadcaster listing", coverageNotes: "Use the WTA directory for Netherlands and verify the provider schedule for the tournament week.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: "unknown", supportedDevices: defaultDevices }),
  ]),
  country("Ireland", "IE", [
    slamService("australian-open", { broadcasterName: "Eurosport / TNT Sports", streamingServiceName: "discovery+ / Eurosport access", extraLinks: [eurosportLink], coverageNotes: "Confirm Ireland in the AO official directory and check the local app package.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: defaultDevices }),
    slamService("roland-garros", { broadcasterName: "TNT Sports / Eurosport", streamingServiceName: "discovery+ / TNT Sports or Eurosport access", coverageNotes: "Verify Ireland on the official Roland Garros broadcaster article because UK and Ireland rights can be packaged differently.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: defaultDevices }),
    slamService("wimbledon", { broadcasterName: "TNT Sports / discovery+", streamingServiceName: "discovery+ / TNT Sports access", coverageNotes: "Verify full-match Ireland rights on the official Wimbledon page before subscribing.", confidenceLevel: "partial", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: defaultDevices }),
    slamService("us-open", { broadcasterName: "Sky Sports", streamingServiceName: "NOW / Sky Go", price: knownPrice(38.99, "EUR", "NOW Ireland Sports Membership: EUR 38.99/month"), extraLinks: [nowIeLink], coverageNotes: "Sky states US Open coverage for the UK and Ireland; confirm the Ireland package and match schedule.", confidenceLevel: "confirmed", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: nowDevices }),
    atpService({ broadcasterName: "Sky Sports", streamingServiceName: "NOW / Sky Go", price: knownPrice(38.99, "EUR", "NOW Ireland Sports Membership: EUR 38.99/month"), extraLinks: [skyAtpWtaLink, nowIeLink], coverageNotes: "Sky Sports is stored as the ATP route for Ireland; Tennis TV can still matter for ATP, subject to blackouts.", confidenceLevel: "confirmed", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: nowDevices }),
    wtaService({ broadcasterName: "Sky Sports", streamingServiceName: "NOW / Sky Go", price: knownPrice(38.99, "EUR", "NOW Ireland Sports Membership: EUR 38.99/month"), extraLinks: [skyAtpWtaLink, nowIeLink], coverageNotes: "Sky Sports is stored as the WTA route for Ireland. Verify tournament-week listings.", confidenceLevel: "confirmed", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: nowDevices }),
  ]),
  country("Canada", "CA", [
    slamService("australian-open", { broadcasterName: "TSN / RDS checks", streamingServiceName: "TSN, RDS or current official partner", coverageNotes: "Use the AO broadcaster directory for Canada and then verify English or French-language app access.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: defaultDevices }),
    slamService("roland-garros", { broadcasterName: "TSN / RDS checks", streamingServiceName: "TSN, RDS or current official partner", coverageNotes: "Confirm Canada in the Roland Garros broadcaster article and check the correct language package.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: defaultDevices }),
    slamService("wimbledon", { broadcasterName: "TSN / RDS checks", streamingServiceName: "TSN, RDS or current official partner", coverageNotes: "Use Wimbledon's official TV coverage page for Canada and verify app access with the local provider.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: defaultDevices }),
    slamService("us-open", { broadcasterName: "TSN / RDS checks", streamingServiceName: "TSN, RDS or current official partner", coverageNotes: "Use the US Open international partners page for Canada and verify English or French-language access.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: defaultDevices }),
    atpService({ broadcasterName: "Tennis TV / ATP official TV schedule", streamingServiceName: "Tennis TV; verify TSN or Sportsnet packages", coverageNotes: "ATP Tour coverage in Canada should be checked against Tennis TV, ATP listings and local sports packages.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: true, englishCommentary: true, supportedDevices: tennisTvDevices }),
    wtaService({ broadcasterName: "WTA official where-to-watch directory", streamingServiceName: "Verify TSN, RDS, Sportsnet or current provider", coverageNotes: "Use the WTA directory for Canada and verify the provider schedule for the tournament week.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: defaultDevices }),
  ]),
  country("Australia", "AU", [
    slamService("australian-open", { broadcasterName: "Nine / Stan Sport checks", streamingServiceName: "9Now, Stan Sport or current official partner", coverageNotes: "Australian Open local coverage should be verified with the tournament and local broadcaster before match week.", confidenceLevel: "needs_check", isFree: true, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: defaultDevices }),
    slamService("roland-garros", { broadcasterName: "Official Roland Garros partner checks", streamingServiceName: "Check current Australian broadcaster", coverageNotes: "Confirm Australia in the Roland Garros broadcaster article and then verify app access.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: defaultDevices }),
    slamService("wimbledon", { broadcasterName: "Official Wimbledon partner checks", streamingServiceName: "Check current Australian broadcaster", coverageNotes: "Use Wimbledon's official TV coverage page for Australia and verify the local app package.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: defaultDevices }),
    slamService("us-open", { broadcasterName: "Official US Open partner checks", streamingServiceName: "Check current Australian broadcaster", coverageNotes: "Use the US Open international partners page for Australia and verify the local app package.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: defaultDevices }),
    atpService({ broadcasterName: "Tennis TV / ATP official TV schedule", streamingServiceName: "Tennis TV; verify beIN Sports packages", coverageNotes: "ATP Tour coverage in Australia should be checked against Tennis TV, ATP listings and local sports packages.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: true, englishCommentary: true, supportedDevices: tennisTvDevices }),
    wtaService({ broadcasterName: "WTA official where-to-watch directory", streamingServiceName: "Verify beIN Sports or current provider", coverageNotes: "Use the WTA directory for Australia and verify the provider schedule for the tournament week.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: defaultDevices }),
  ]),
  country("India", "IN", [
    slamService("australian-open", { broadcasterName: "Sony Sports / SonyLIV checks", streamingServiceName: "SonyLIV or current official partner", coverageNotes: "Use the Australian Open broadcaster directory for India and verify the current SonyLIV or local package.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: defaultDevices }),
    slamService("roland-garros", { broadcasterName: "Sony Sports / SonyLIV checks", streamingServiceName: "SonyLIV or current official partner", coverageNotes: "Confirm India in the Roland Garros broadcaster article and verify app access before paying.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: defaultDevices }),
    slamService("wimbledon", { broadcasterName: "Sony Sports / SonyLIV checks", streamingServiceName: "SonyLIV or current official partner", coverageNotes: "Use Wimbledon's official TV coverage page for India and verify SonyLIV or current package availability.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: defaultDevices }),
    slamService("us-open", { broadcasterName: "Sony Sports / SonyLIV checks", streamingServiceName: "SonyLIV or current official partner", coverageNotes: "Use the US Open international partners page for India and verify current app access.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: defaultDevices }),
    atpService({ broadcasterName: "Tennis TV / ATP official TV schedule", streamingServiceName: "Tennis TV; verify Sony Sports packages", coverageNotes: "ATP Tour coverage in India should be checked against Tennis TV, ATP listings and local sports packages.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: true, englishCommentary: true, supportedDevices: tennisTvDevices }),
    wtaService({ broadcasterName: "WTA official where-to-watch directory", streamingServiceName: "Verify Sony Sports, SonyLIV or current provider", coverageNotes: "Use the WTA directory for India and verify the provider schedule for the tournament week.", confidenceLevel: "needs_check", isFree: false, requiresSubscription: true, replaysAvailable: "unknown", englishCommentary: true, supportedDevices: defaultDevices }),
  ]),
];

export const tennisBroadcastCountries: TennisBroadcastCountry[] = tennisBroadcastDatabase.map(({ countryName, countryCode }) => ({
  countryName,
  countryCode,
}));

function countrySlugFor(country: TennisBroadcastCountry) {
  return countrySlugOverrides[country.countryCode] ?? normalizeCoverageQuery(country.countryName);
}

export const tennisBroadcasts: TennisBroadcastEntry[] = tennisBroadcastDatabase.flatMap((countryItem) =>
  countryItem.groups.flatMap((group) =>
    group.services.map((serviceItem) => ({
      countryName: countryItem.countryName,
      countryCode: countryItem.countryCode,
      countrySlug: countrySlugFor(countryItem),
      tournamentId: group.tournamentId,
      tournamentSlug: group.tournamentId,
      tournamentName: group.tournamentName,
      eventType: group.eventType,
      ...serviceItem,
      officialUrl: serviceItem.officialWebsiteUrl,
      streamingService: serviceItem.streamingServiceName,
      free: serviceItem.isFree,
      subscriptionRequired: serviceItem.requiresSubscription,
      confidence: serviceItem.confidenceLevel,
      notes: serviceItem.coverageNotes,
      officialSourceUrls: serviceItem.officialLinks.map((link) => link.url),
      priceNote: serviceItem.price.label,
      monthlyPrice: serviceItem.price.monthlyPrice,
      currency: serviceItem.price.currency,
    })),
  ),
);

export type NormalizedBroadcastRecord = {
  id: string;
  countryCode: string;
  countryName: string;
  countrySlug: string;
  tournamentSlug: TennisTournamentId;
  tournamentName: string;
  broadcasterName: string;
  officialUrl: string;
  streamingService: string;
  free: boolean;
  subscriptionRequired: boolean;
  confidence: TennisBroadcastConfidence;
  lastVerified: string;
  notes?: string;
};

export type BroadcastValidationErrorCode =
  | "duplicate_country"
  | "duplicate_id"
  | "duplicate_mapping"
  | "invalid_boolean"
  | "invalid_confidence"
  | "invalid_country_code"
  | "invalid_slug"
  | "invalid_tournament_slug"
  | "invalid_url"
  | "missing_required_field";

export type BroadcastValidationError = {
  code: BroadcastValidationErrorCode;
  path: string;
  message: string;
  value?: unknown;
};

export type BroadcastValidationResult = {
  isValid: boolean;
  errors: BroadcastValidationError[];
  warnings: BroadcastValidationError[];
  recordCount: number;
};

function normalizedRecordId(record: Omit<NormalizedBroadcastRecord, "id">) {
  return [
    record.countrySlug,
    record.tournamentSlug,
    getBroadcasterSlug(record.broadcasterName),
    getBroadcasterSlug(record.streamingService),
  ].join(":");
}

export function getNormalizedBroadcastRecords(database: TennisCountryBroadcastDatabase[] = tennisBroadcastDatabase): NormalizedBroadcastRecord[] {
  return database.flatMap((countryItem) =>
    countryItem.groups.flatMap((group) =>
      group.services.map((serviceItem) => {
        const record = {
          countryCode: countryItem.countryCode,
          countryName: countryItem.countryName,
          countrySlug: countrySlugFor(countryItem),
          tournamentSlug: group.tournamentId,
          tournamentName: group.tournamentName,
          broadcasterName: serviceItem.broadcasterName,
          officialUrl: serviceItem.officialWebsiteUrl,
          streamingService: serviceItem.streamingServiceName,
          free: serviceItem.isFree,
          subscriptionRequired: serviceItem.requiresSubscription,
          confidence: serviceItem.confidenceLevel,
          lastVerified: serviceItem.lastVerified,
          notes: serviceItem.coverageNotes || undefined,
        };

        return { id: normalizedRecordId(record), ...record };
      }),
    ),
  );
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function pushValidationError(errors: BroadcastValidationError[], code: BroadcastValidationErrorCode, path: string, message: string, value?: unknown) {
  errors.push({ code, path, message, value });
}

export function validateBroadcastDatabase(database: TennisCountryBroadcastDatabase[] = tennisBroadcastDatabase): BroadcastValidationResult {
  const errors: BroadcastValidationError[] = [];
  const warnings: BroadcastValidationError[] = [];
  const countryKeys = new Set<string>();
  const ids = new Set<string>();
  const mappings = new Set<string>();
  let recordCount = 0;

  database.forEach((countryItem, countryIndex) => {
    const countryPath = `countries[${countryIndex}]`;
    const countrySlug = countrySlugFor(countryItem);
    const countryKey = `${countryItem.countryCode}:${countrySlug}`;

    if (!countryItem.countryCode) pushValidationError(errors, "missing_required_field", `${countryPath}.countryCode`, "Country code is required.");
    if (!countryItem.countryName) pushValidationError(errors, "missing_required_field", `${countryPath}.countryName`, "Country name is required.");
    if (countryItem.countryCode && !/^[A-Z]{2}$/.test(countryItem.countryCode)) {
      pushValidationError(errors, "invalid_country_code", `${countryPath}.countryCode`, "Country code must be a two-letter uppercase ISO-style code.", countryItem.countryCode);
    }
    if (countrySlug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(countrySlug)) {
      pushValidationError(errors, "invalid_slug", `${countryPath}.countrySlug`, "Country slug must be lowercase kebab case.", countrySlug);
    }
    if (countryKeys.has(countryKey)) {
      pushValidationError(errors, "duplicate_country", countryPath, "Duplicate country code and slug combination.", countryKey);
    }
    countryKeys.add(countryKey);

    countryItem.groups.forEach((group, groupIndex) => {
      const groupPath = `${countryPath}.groups[${groupIndex}]`;

      if (!VALID_TENNIS_TOURNAMENT_IDS.includes(group.tournamentId)) {
        pushValidationError(errors, "invalid_tournament_slug", `${groupPath}.tournamentId`, "Tournament slug is not supported.", group.tournamentId);
      }
      if (!group.tournamentName) pushValidationError(errors, "missing_required_field", `${groupPath}.tournamentName`, "Tournament name is required.");

      group.services.forEach((serviceItem, serviceIndex) => {
        const servicePath = `${groupPath}.services[${serviceIndex}]`;
        const record = {
          countryCode: countryItem.countryCode,
          countryName: countryItem.countryName,
          countrySlug,
          tournamentSlug: group.tournamentId,
          tournamentName: group.tournamentName,
          broadcasterName: serviceItem.broadcasterName,
          officialUrl: serviceItem.officialWebsiteUrl,
          streamingService: serviceItem.streamingServiceName,
          free: serviceItem.isFree,
          subscriptionRequired: serviceItem.requiresSubscription,
          confidence: serviceItem.confidenceLevel,
          lastVerified: serviceItem.lastVerified,
          notes: serviceItem.coverageNotes || undefined,
        };
        const id = normalizedRecordId(record);
        const mapping = `${countrySlug}:${group.tournamentId}:${getBroadcasterSlug(serviceItem.broadcasterName)}:${getBroadcasterSlug(serviceItem.streamingServiceName)}`;
        recordCount += 1;

        if (ids.has(id)) pushValidationError(errors, "duplicate_id", servicePath, "Duplicate normalized broadcast record ID.", id);
        ids.add(id);
        if (mappings.has(mapping)) pushValidationError(errors, "duplicate_mapping", servicePath, "Duplicate country/tournament/broadcaster/streaming mapping.", mapping);
        mappings.add(mapping);

        if (!record.countryCode) pushValidationError(errors, "missing_required_field", `${servicePath}.countryCode`, "Normalized countryCode is required.");
        if (!record.countryName) pushValidationError(errors, "missing_required_field", `${servicePath}.countryName`, "Normalized countryName is required.");
        if (!record.countrySlug) pushValidationError(errors, "missing_required_field", `${servicePath}.countrySlug`, "Normalized countrySlug is required.");
        if (!record.tournamentSlug) pushValidationError(errors, "missing_required_field", `${servicePath}.tournamentSlug`, "Normalized tournamentSlug is required.");
        if (!record.tournamentName) pushValidationError(errors, "missing_required_field", `${servicePath}.tournamentName`, "Normalized tournamentName is required.");
        if (!record.broadcasterName) pushValidationError(errors, "missing_required_field", `${servicePath}.broadcasterName`, "Broadcaster name is required.");
        if (!record.officialUrl) pushValidationError(errors, "missing_required_field", `${servicePath}.officialUrl`, "Official URL is required.");
        if (!record.streamingService) pushValidationError(errors, "missing_required_field", `${servicePath}.streamingService`, "Streaming service is required.");
        if (!record.confidence) pushValidationError(errors, "missing_required_field", `${servicePath}.confidence`, "Confidence is required.");
        if (!record.lastVerified) pushValidationError(errors, "missing_required_field", `${servicePath}.lastVerified`, "Last verified date is required.");

        if (record.officialUrl && !isValidUrl(record.officialUrl)) {
          pushValidationError(errors, "invalid_url", `${servicePath}.officialUrl`, "Official URL must be a valid HTTP or HTTPS URL.", record.officialUrl);
        }
        const officialLinks = Array.isArray(serviceItem.officialLinks) ? serviceItem.officialLinks : [];
        if (!officialLinks.length) {
          pushValidationError(errors, "missing_required_field", `${servicePath}.officialLinks`, "At least one official link is required.");
        }
        officialLinks.forEach((link, linkIndex) => {
          if (!link.url || !isValidUrl(link.url)) {
            pushValidationError(errors, "invalid_url", `${servicePath}.officialLinks[${linkIndex}].url`, "Official link URL must be valid.", link.url);
          }
        });
        if (!VALID_TENNIS_BROADCAST_CONFIDENCE.includes(record.confidence)) {
          pushValidationError(errors, "invalid_confidence", `${servicePath}.confidence`, "Confidence is not supported.", record.confidence);
        }
        if (typeof record.free !== "boolean") {
          pushValidationError(errors, "invalid_boolean", `${servicePath}.free`, "Free flag must be boolean.", record.free);
        }
        if (typeof record.subscriptionRequired !== "boolean") {
          pushValidationError(errors, "invalid_boolean", `${servicePath}.subscriptionRequired`, "Subscription-required flag must be boolean.", record.subscriptionRequired);
        }
      });
    });
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    recordCount,
  };
}

export function getCountryBroadcastData(countryCode: string) {
  return tennisBroadcastDatabase.find((countryItem) => countryItem.countryCode === countryCode);
}

export function getCountryBroadcastEntries(countryCode: string, tournamentIds?: TennisTournamentId[]) {
  return tennisBroadcasts.filter(
    (entry) => entry.countryCode === countryCode && (!tournamentIds || tournamentIds.includes(entry.tournamentId)),
  );
}

export function getTennisBroadcast(countryCode: string, tournamentId: TennisTournamentId) {
  return tennisBroadcasts.find(
    (entry) => entry.countryCode === countryCode && entry.tournamentId === tournamentId,
  );
}

export function formatBroadcastPrice(price: TennisServicePrice) {
  if (price.status === "check_official_site") return "Check official site";
  if (price.monthlyPrice === undefined || !price.currency) return price.label;

  const amount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    maximumFractionDigits: price.monthlyPrice % 1 === 0 ? 0 : 2,
  }).format(price.monthlyPrice);

  return `${amount}/month`;
}

export function getCountryServiceOptions(countryCode: string): TennisCountryServiceOption[] {
  const entries = getCountryBroadcastEntries(countryCode);
  const services = new Map<string, TennisCountryServiceOption>();

  for (const entry of entries) {
    const id = entry.streamingServiceName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const existing = services.get(id);

    if (existing) {
      existing.broadcasterNames = Array.from(new Set([...existing.broadcasterNames, entry.broadcasterName]));
      existing.officialLinks = links(...existing.officialLinks, ...entry.officialLinks);
      existing.tournamentIds = Array.from(new Set([...existing.tournamentIds, entry.tournamentId]));
      existing.tournamentNames = Array.from(new Set([...existing.tournamentNames, entry.tournamentName]));
      existing.sourceSummary = Array.from(
        new Set([existing.sourceSummary, `${entry.tournamentName}: ${entry.coverageNotes}`]),
      ).join(" ");
      existing.lastVerified = entry.lastVerified > existing.lastVerified ? entry.lastVerified : existing.lastVerified;
      if (existing.priceStatus !== "known" && entry.price.status === "known" && entry.monthlyPrice !== undefined && entry.currency) {
        existing.knownMonthlyPrice = entry.monthlyPrice;
        existing.currency = entry.currency;
        existing.priceLabel = entry.price.label;
        existing.priceStatus = entry.price.status;
      }
      continue;
    }

    services.set(id, {
      id,
      serviceName: entry.streamingServiceName,
      broadcasterNames: [entry.broadcasterName],
      knownMonthlyPrice: entry.monthlyPrice,
      currency: entry.currency,
      priceLabel: entry.price.label,
      priceStatus: entry.price.status,
      sourceSummary: `${entry.tournamentName}: ${entry.coverageNotes}`,
      lastVerified: entry.lastVerified,
      officialLinks: entry.officialLinks,
      tournamentIds: [entry.tournamentId],
      tournamentNames: [entry.tournamentName],
    });
  }

  return Array.from(services.values());
}

export function calculateKnownMonthlyTotal(serviceOptions: TennisCountryServiceOption[], selectedServiceIds: string[]) {
  return serviceOptions.reduce(
    (result, serviceOption) => {
      if (!selectedServiceIds.includes(serviceOption.id)) return result;

      if (serviceOption.knownMonthlyPrice !== undefined && serviceOption.currency) {
        result.knownServices.push(serviceOption);
        result.total += serviceOption.knownMonthlyPrice;
        result.currency = result.currency ?? serviceOption.currency;
        if (result.currency !== serviceOption.currency) result.hasMixedCurrencies = true;
      } else {
        result.unknownServices.push(serviceOption);
      }

      return result;
    },
    {
      total: 0,
      currency: undefined as "USD" | "EUR" | "GBP" | undefined,
      hasMixedCurrencies: false,
      knownServices: [] as TennisCountryServiceOption[],
      unknownServices: [] as TennisCountryServiceOption[],
    },
  );
}

export function recommendMinimumServices(countryCode: string, tournamentIds: TennisTournamentId[]) {
  const entries = getCountryBroadcastEntries(countryCode, tournamentIds);
  const coveredTournamentIds = new Set<TennisTournamentId>();
  const byService = new Map<string, TennisCountryServiceOption>();

  for (const entry of entries) {
    const existingOptions = getCountryServiceOptions(countryCode);
    const option = existingOptions.find((item) => item.tournamentIds.includes(entry.tournamentId));
    if (!option) continue;

    coveredTournamentIds.add(entry.tournamentId);
    byService.set(option.id, option);
  }

  return {
    services: Array.from(byService.values()),
    uncoveredTournamentIds: tournamentIds.filter((tournamentId) => !coveredTournamentIds.has(tournamentId)),
  };
}

export function getKnownBroadcastPriceOptions(): TennisServicePriceOption[] {
  const seen = new Set<string>();

  return tennisBroadcasts.reduce<TennisServicePriceOption[]>((options, entry) => {
    if (entry.monthlyPrice === undefined || !entry.currency || entry.price.status === "check_official_site") {
      return options;
    }

    const id = `${entry.countryCode.toLowerCase()}-${entry.streamingServiceName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

    if (seen.has(id)) return options;
    seen.add(id);

    options.push({
      id,
      countryCode: entry.countryCode,
      countryName: entry.countryName,
      serviceName: entry.streamingServiceName,
      name: `${entry.streamingServiceName} - ${entry.countryName}`,
      monthlyCost: entry.monthlyPrice,
      currency: entry.currency,
      coverageNote: `${entry.tournamentName}: ${entry.coverageNotes}`,
      priceNote: entry.priceNote,
      officialLinks: entry.officialLinks,
      tournamentIds: [entry.tournamentId],
    });

    return options;
  }, []);
}


export type TennisBroadcasterSummary = {
  name: string;
  slug: string;
  countryCodes: string[];
  countryNames: string[];
  tournamentIds: TennisTournamentId[];
  tournamentNames: string[];
  entries: TennisBroadcastEntry[];
  isFree: boolean;
  requiresSubscription: boolean;
  priceStatuses: TennisPriceStatus[];
  priceSummary: string;
  officialLinks: TennisOfficialLink[];
  lastVerified: string;
  confidenceLevels: TennisBroadcastConfidence[];
};

function uniqueSorted(items: string[]) {
  return Array.from(new Set(items)).sort((a, b) => a.localeCompare(b));
}

export function getBroadcasterSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\+/g, "plus")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function broadcasterNameMatches(entry: TennisBroadcastEntry, slug: string) {
  const names = [entry.broadcasterName, entry.streamingServiceName];

  return names.some((name) => getBroadcasterSlug(name) === slug);
}

function buildBroadcasterSummary(name: string, entries: TennisBroadcastEntry[]): TennisBroadcasterSummary {
  const priceStatuses = Array.from(new Set(entries.map((entry) => entry.price.status)));
  const hasFree = entries.some((entry) => entry.isFree || entry.price.status === "free");
  const requiresSubscription = entries.some((entry) => entry.requiresSubscription);
  const knownPrices = entries
    .filter((entry) => entry.monthlyPrice !== undefined && entry.currency)
    .map((entry) => formatBroadcastPrice(entry.price));

  const priceSummary = hasFree && requiresSubscription
    ? "Free and paid routes vary by event or territory"
    : hasFree
      ? "Free route listed for at least one territory"
      : knownPrices.length
        ? `Known price examples: ${uniqueSorted(knownPrices).join(", ")}`
        : "Check official site before paying";

  return {
    name,
    slug: getBroadcasterSlug(name),
    countryCodes: uniqueSorted(entries.map((entry) => entry.countryCode)),
    countryNames: uniqueSorted(entries.map((entry) => entry.countryName)),
    tournamentIds: Array.from(new Set(entries.map((entry) => entry.tournamentId))),
    tournamentNames: uniqueSorted(entries.map((entry) => entry.tournamentName)),
    entries,
    isFree: hasFree,
    requiresSubscription,
    priceStatuses,
    priceSummary,
    officialLinks: links(...entries.flatMap((entry) => entry.officialLinks)),
    lastVerified: entries.reduce((latest, entry) => entry.lastVerified > latest ? entry.lastVerified : latest, entries[0]?.lastVerified ?? TENNIS_BROADCAST_LAST_VERIFIED),
    confidenceLevels: Array.from(new Set(entries.map((entry) => entry.confidenceLevel))),
  };
}

export function getUniqueBroadcasters(): TennisBroadcasterSummary[] {
  const grouped = new Map<string, { name: string; entries: TennisBroadcastEntry[] }>();

  for (const entry of tennisBroadcasts) {
    const names = [entry.broadcasterName, entry.streamingServiceName];

    for (const name of names) {
      const slug = getBroadcasterSlug(name);
      if (!slug) continue;

      const group = grouped.get(slug);
      if (group) {
        group.entries.push(entry);
      } else {
        grouped.set(slug, { name, entries: [entry] });
      }
    }
  }

  return Array.from(grouped.values())
    .map(({ name, entries }) => buildBroadcasterSummary(name, entries))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getBroadcasterBySlug(slug: string) {
  return getUniqueBroadcasters().find((broadcaster) => broadcaster.slug === slug);
}

export function getBroadcastsByBroadcasterSlug(slug: string) {
  return tennisBroadcasts.filter((entry) => broadcasterNameMatches(entry, slug));
}

export function getCountriesForBroadcaster(slug: string) {
  return uniqueSorted(getBroadcastsByBroadcasterSlug(slug).map((entry) => entry.countryName));
}

export function getTournamentGroupsForBroadcaster(slug: string) {
  return uniqueSorted(getBroadcastsByBroadcasterSlug(slug).map((entry) => entry.tournamentName));
}

export type CanIWatchResultType = "tournament" | "player" | "general";

export type CanIWatchCoverageSummary = {
  countryName?: string;
  countryCode?: string;
  query: string;
  resultType: CanIWatchResultType;
  entries: TennisBroadcastEntry[];
  broadcasterCount: number;
  freeRouteCount: number;
  subscriptionRouteCount: number;
  confidenceLevels: TennisBroadcastConfidence[];
  lastVerified?: string;
  warning?: string;
};

const countryAliases: Record<string, string> = {
  uk: "uk",
  "united-kingdom": "uk",
  britain: "uk",
  "great-britain": "uk",
  gb: "uk",
  usa: "usa",
  us: "usa",
  "u-s-a": "usa",
  "united-states": "usa",
  "united-states-of-america": "usa",
  america: "usa",
  czechia: "czechia",
  "czech-republic": "czechia",
};

const popularPlayerTourMap: Record<string, TennisTournamentId[]> = {
  "alcaraz": ["atp-tour"],
  "carlos-alcaraz": ["atp-tour"],
  "sinner": ["atp-tour"],
  "jannik-sinner": ["atp-tour"],
  "djokovic": ["atp-tour"],
  "novak-djokovic": ["atp-tour"],
  "medvedev": ["atp-tour"],
  "daniil-medvedev": ["atp-tour"],
  "zverev": ["atp-tour"],
  "alexander-zverev": ["atp-tour"],
  "rune": ["atp-tour"],
  "holger-rune": ["atp-tour"],
  "swiatek": ["wta-tour"],
  "iga-swiatek": ["wta-tour"],
  "sabalenka": ["wta-tour"],
  "aryna-sabalenka": ["wta-tour"],
  "gauff": ["wta-tour"],
  "coco-gauff": ["wta-tour"],
  "pegula": ["wta-tour"],
  "jessica-pegula": ["wta-tour"],
  "rybakina": ["wta-tour"],
  "elena-rybakina": ["wta-tour"],
};

function normalizeCoverageQuery(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/,/g, "")
    .replace(/\./g, "")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function normalizeCountry(value: string) {
  const normalized = normalizeCoverageQuery(value);
  const codeMatch = tennisBroadcastDatabase.find((countryItem) => countryItem.countryCode.toLowerCase() === value.toLowerCase());
  if (codeMatch) return countrySlugOverrides[codeMatch.countryCode] ?? normalizeCoverageQuery(codeMatch.countryName);

  const alias = countryAliases[normalized];
  if (alias) return alias;

  const nameMatch = tennisBroadcastDatabase.find((countryItem) => normalizeCoverageQuery(countryItem.countryName) === normalized);
  if (nameMatch) return countrySlugOverrides[nameMatch.countryCode] ?? normalizeCoverageQuery(nameMatch.countryName);

  return normalized;
}

export function normalizeTournament(value: string): TennisTournamentId | undefined {
  const normalized = normalizeCoverageQuery(value);
  const aliases: Record<string, TennisTournamentId> = {
    ao: "australian-open",
    "australian-open": "australian-open",
    "french-open": "roland-garros",
    rg: "roland-garros",
    "roland-garros": "roland-garros",
    "roland-garros-french-open": "roland-garros",
    wimbledon: "wimbledon",
    "wimbledon-championships": "wimbledon",
    "us-open": "us-open",
    "u-s-open": "us-open",
    atp: "atp-tour",
    "atp-tour": "atp-tour",
    "atp-finals": "atp-tour",
    "nitto-finals": "atp-tour",
    "nitto-atp-finals": "atp-tour",
    wta: "wta-tour",
    "wta-tour": "wta-tour",
    "wta-finals": "wta-tour",
  };

  return aliases[normalized] ?? tennisTournamentGroups.find((group) => normalizeCoverageQuery(group.tournamentName) === normalized)?.tournamentId;
}

export function normalizePlayerName(value: string) {
  const normalized = normalizeCoverageQuery(value);
  return popularPlayerTourMap[normalized] ? normalized : normalized;
}

export function getBroadcastCountryOptions(): TennisBroadcastCountryOption[] {
  return tennisBroadcastDatabase.map(({ countryName, countryCode }) => ({
    countryName,
    countryCode,
    country: countryName,
    slug: countrySlugOverrides[countryCode] ?? normalizeCoverageQuery(countryName),
  }));
}

export function getBroadcastCountryBySlug(slug: string) {
  const normalized = normalizeCountry(slug);

  return getBroadcastCountryOptions().find((country) => country.slug === normalized);
}

function countryMatches(entry: TennisBroadcastEntry, country: string) {
  const normalized = normalizeCountry(country);

  return (
    entry.countryCode.toLowerCase() === country.toLowerCase() ||
    normalizeCountry(entry.countryName) === normalized
  );
}

function tournamentMatchesQuery(entry: TennisBroadcastEntry, query: string) {
  const normalized = normalizeTournament(query);
  const tournamentSlug = normalizeCoverageQuery(entry.tournamentName);

  if (normalized) return entry.tournamentId === normalized;

  return (
    tournamentSlug.includes(normalizeCoverageQuery(query)) ||
    normalizeCoverageQuery(query).includes(tournamentSlug)
  );
}

function playerTourIds(query: string) {
  return popularPlayerTourMap[normalizePlayerName(query)] ?? [];
}

export function findBroadcasts(country: string, query: string) {
  const playerTours = playerTourIds(query);

  return tennisBroadcasts.filter((entry) => {
    if (!countryMatches(entry, country)) return false;
    if (tournamentMatchesQuery(entry, query)) return true;

    return playerTours.includes(entry.tournamentId);
  });
}

export function findBroadcastsForPlayer(country: string, player: string) {
  const playerTours = playerTourIds(player);

  return tennisBroadcasts.filter((entry) => countryMatches(entry, country) && playerTours.includes(entry.tournamentId));
}

export function getCoverageSummary(country: string, query: string): CanIWatchCoverageSummary {
  const entries = findBroadcasts(country, query);
  const firstEntry = entries[0];
  const confidenceLevels = Array.from(new Set(entries.map((entry) => entry.confidenceLevel)));
  const resultType: CanIWatchResultType = playerTourIds(query).length > 0 ? "player" : entries.some((entry) => tournamentMatchesQuery(entry, query)) ? "tournament" : "general";

  return {
    countryName: firstEntry?.countryName,
    countryCode: firstEntry?.countryCode,
    query,
    resultType,
    entries,
    broadcasterCount: new Set(entries.map((entry) => entry.broadcasterName)).size,
    freeRouteCount: entries.filter((entry) => entry.isFree || entry.price.status === "free").length,
    subscriptionRouteCount: entries.filter((entry) => entry.requiresSubscription).length,
    confidenceLevels,
    lastVerified: entries.reduce<string | undefined>((latest, entry) => {
      if (!latest) return entry.lastVerified;
      return entry.lastVerified > latest ? entry.lastVerified : latest;
    }, undefined),
    warning: entries.some((entry) => entry.confidenceLevel === "needs_check" || entry.confidenceLevel === "partial")
      ? "Some coverage rows are partial or need match-week verification. Check official broadcaster and tournament pages before paying."
      : undefined,
  };
}

export function getCanIWatchQueryOptions() {
  const tournamentOptions = tennisTournamentGroups.map((group) => ({
    label: group.tournamentName,
    slug: group.tournamentId,
    type: "tournament" as const,
  }));

  const playerOptions = [
    "Carlos Alcaraz",
    "Iga Swiatek",
    "Jannik Sinner",
    "Novak Djokovic",
    "Coco Gauff",
    "Aryna Sabalenka",
    "Daniil Medvedev",
    "Alexander Zverev",
    "Holger Rune",
    "Jessica Pegula",
  ].map((label) => ({
    label,
    slug: normalizeCoverageQuery(label),
    type: "player" as const,
  }));

  return [...tournamentOptions, ...playerOptions];
}

if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
  const validation = validateBroadcastDatabase();

  if (!validation.isValid || validation.warnings.length > 0) {
    const issues = [...validation.errors, ...validation.warnings]
      .map((issue) => `${issue.code} at ${issue.path}: ${issue.message}`)
      .join("\n");

    console.warn(`[tennisBroadcasts] Broadcast database validation found ${validation.errors.length} error(s) and ${validation.warnings.length} warning(s).\n${issues}`);
  }
}
