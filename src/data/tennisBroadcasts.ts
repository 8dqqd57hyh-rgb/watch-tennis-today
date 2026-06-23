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

export const tennisBroadcasts: TennisBroadcastEntry[] = tennisBroadcastDatabase.flatMap((countryItem) =>
  countryItem.groups.flatMap((group) =>
    group.services.map((serviceItem) => ({
      countryName: countryItem.countryName,
      countryCode: countryItem.countryCode,
      tournamentId: group.tournamentId,
      tournamentName: group.tournamentName,
      eventType: group.eventType,
      ...serviceItem,
      officialSourceUrls: serviceItem.officialLinks.map((link) => link.url),
      priceNote: serviceItem.price.label,
      monthlyPrice: serviceItem.price.monthlyPrice,
      currency: serviceItem.price.currency,
    })),
  ),
);

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
