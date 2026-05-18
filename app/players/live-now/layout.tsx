import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Tennis Players Now | ATP & WTA Players Live",
  description:
    "See which tennis players are live now in ATP, WTA, Challenger and Grand Slam matches with links to live matches and player pages.",
  alternates: {
    canonical: "https://watchtennistoday.com/players/live-now",
  },
};

export default function LivePlayersNowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}