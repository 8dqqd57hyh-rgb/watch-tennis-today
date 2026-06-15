export const siteUrl = "https://watchtennistoday.com";

export const authorProfile = {
  name: "Angelika Sokolova",
  slug: "watch-tennis-today",
  role: "Founder and editor of Watch Tennis Today",
  url: `${siteUrl}/authors/watch-tennis-today`,
  image: `${siteUrl}/author-angelika-sokolova.jpg`,
  imagePath: "/author-angelika-sokolova.jpg",
  shortBio:
    "Angelika Sokolova is the founder of Watch Tennis Today, a tennis enthusiast and amateur player who follows the ATP and WTA tours and researches legal ways to watch tennis around the world.",
  bio:
    "Angelika Sokolova is the founder of Watch Tennis Today. She is a tennis enthusiast and amateur player who follows the ATP and WTA tours, with a particular interest in how tournament schedules, time zones and broadcast rights affect everyday fans. She created Watch Tennis Today to help people find legal ways to watch tennis worldwide without relying on unsafe stream lists or vague schedule pages.",
  researchNote:
    "For Watch Tennis Today, Angelika regularly researches tournament calendars, official broadcaster pages, ATP and WTA schedule information, Grand Slam coverage notes, local TV listings and streaming availability by country. The site is written for practical fan decisions, so claims about match access are kept cautious and readers are directed toward official providers for final confirmation.",
  expertise: [
    "ATP and WTA tour schedule research",
    "Grand Slam and tournament viewing guides",
    "Legal tennis streaming and broadcaster verification",
    "Country-by-country tennis TV availability",
    "Tennis rules, scoring and fan education",
  ],
  sameAs: [] as string[],
};

export const organizationProfile = {
  name: "Watch Tennis Today",
  url: siteUrl,
  logo: `${siteUrl}/icon.png`,
  description:
    "Watch Tennis Today helps tennis fans follow schedules, match context, official broadcasters and legal viewing options for ATP, WTA and Grand Slam tennis.",
};

export function buildAuthorPersonSchema() {
  return {
    "@type": "Person",
    "@id": `${authorProfile.url}#person`,
    name: authorProfile.name,
    url: authorProfile.url,
    image: authorProfile.image,
    jobTitle: authorProfile.role,
    description: authorProfile.shortBio,
    affiliation: {
      "@id": `${siteUrl}/#organization`,
    },
    founderOf: {
      "@id": `${siteUrl}/#organization`,
    },
    knowsAbout: authorProfile.expertise,
    sameAs: authorProfile.sameAs,
  };
}

export function buildOrganizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: organizationProfile.name,
    url: organizationProfile.url,
    logo: {
      "@type": "ImageObject",
      url: organizationProfile.logo,
    },
    founder: {
      "@id": `${authorProfile.url}#person`,
    },
    description: organizationProfile.description,
    sameAs: [] as string[],
  };
}

export function buildArticleAuthorSchema() {
  return {
    "@type": "Person",
    "@id": `${authorProfile.url}#person`,
    name: authorProfile.name,
    url: authorProfile.url,
    image: authorProfile.image,
  };
}
