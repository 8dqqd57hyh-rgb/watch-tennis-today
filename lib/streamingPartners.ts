export type StreamingPartner = {
  name: string;
  officialUrl?: string;
  affiliateUrl?: string;
  countries: string[];
  tournaments: string[];
  notes: string;
};

export const streamingPartners: StreamingPartner[] = [
  {
    name: "Tennis TV",
    officialUrl: "https://www.tennistv.com/",
    countries: ["global", "usa", "uk", "canada", "australia"],
    tournaments: ["ATP Tour", "ATP Masters 1000", "ATP 500", "ATP 250"],
    notes: "Official ATP streaming service for many ATP Tour events. It does not carry Grand Slam matches.",
  },
  {
    name: "WTA TV",
    officialUrl: "https://www.wtatv.com/",
    countries: ["global", "uk", "canada", "australia"],
    tournaments: ["WTA Tour"],
    notes: "Official WTA streaming option in selected markets. Availability varies by country.",
  },
  {
    name: "Tennis Channel",
    officialUrl: "https://www.tennischannel.com/",
    countries: ["usa"],
    tournaments: ["ATP Tour", "WTA Tour", "selected Grand Slam coverage"],
    notes: "US tennis broadcaster. Exact tournament coverage depends on rights and package.",
  },
  {
    name: "ESPN / ESPN+",
    officialUrl: "https://www.espn.com/watch/",
    countries: ["usa"],
    tournaments: ["Wimbledon", "US Open", "Australian Open", "selected tennis coverage"],
    notes: "US rights can differ by event, platform and year. Confirm on ESPN before subscribing.",
  },
  {
    name: "BBC Sport / iPlayer",
    officialUrl: "https://www.bbc.co.uk/sport/tennis",
    countries: ["uk"],
    tournaments: ["Wimbledon"],
    notes: "UK Wimbledon coverage is traditionally centered on BBC services, subject to current rights.",
  },
  {
    name: "Stan Sport",
    officialUrl: "https://www.stan.com.au/sport",
    countries: ["australia"],
    tournaments: ["Grand Slam tennis", "selected tennis coverage"],
    notes: "Australian streaming option for selected tennis rights. Check current event availability.",
  },
  {
    name: "TSN / RDS",
    officialUrl: "https://www.tsn.ca/tennis",
    countries: ["canada"],
    tournaments: ["Grand Slam tennis", "selected tennis coverage"],
    notes: "Canadian tennis broadcaster for many major events. French-language coverage may be on RDS.",
  },
];

export function getStreamingPartners(country = "global") {
  const normalized = country.toLowerCase();
  return streamingPartners.filter((partner) =>
    partner.countries.includes(normalized) || partner.countries.includes("global")
  );
}
