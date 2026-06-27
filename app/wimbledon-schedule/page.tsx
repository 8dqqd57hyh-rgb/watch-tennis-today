import WimbledonGuidePage from "@/app/components/WimbledonGuidePage";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Wimbledon Schedule Today | Order of Play and TV Planning Guide",
  description:
    "Check how to use the Wimbledon schedule, order of play and court assignments to plan legal live tennis viewing.",
  alternates: { canonical: "https://watchtennistoday.com/wimbledon-schedule" },
  openGraph: {
    title: "Wimbledon Schedule Today",
    description:
      "Order of play, court assignment and legal TV planning context for Wimbledon.",
    url: "https://watchtennistoday.com/wimbledon-schedule",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wimbledon Schedule Today",
    description:
      "Order of play, court assignment and legal TV planning context for Wimbledon.",
  },
};

export default function WimbledonSchedulePage() {
  return (
    <WimbledonGuidePage
      eyebrow="Wimbledon schedule"
      title="Wimbledon Schedule Today: Order of Play and TV Planning Guide"
      description="Use this page to understand Wimbledon session timing, order of play changes, court moves and how to match the schedule with legal broadcasters."
      focus="schedule"
      currentPath="/wimbledon-schedule"
      currentPageName="Wimbledon Schedule"
    />
  );
}
