import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Tennis Matches Now | ATP & WTA Live Scores",
  description:
    "Follow live tennis matches now with ATP, WTA, Challenger and Grand Slam live scores, match links and streaming information.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: "https://watchtennistoday.com/matches/live-now",
  },
};

export default function LiveMatchesNowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
