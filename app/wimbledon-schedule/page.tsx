import WimbledonGuidePage from "@/app/components/WimbledonGuidePage";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Wimbledon Schedule Today | Order of Play and TV Planning Guide",
  description:
    "Check how to use the Wimbledon schedule, order of play and court assignments to plan legal live tennis viewing.",
  alternates: { canonical: "https://watchtennistoday.com/wimbledon-schedule" },
};

export default function WimbledonSchedulePage() {
  return (
    <WimbledonGuidePage
      eyebrow="Wimbledon schedule"
      title="Wimbledon Schedule Today: Order of Play and TV Planning Guide"
      description="Use this page to understand Wimbledon session timing, order of play changes, court moves and how to match the schedule with legal broadcasters."
      focus="schedule"
    />
  );
}
