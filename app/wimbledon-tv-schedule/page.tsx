import WimbledonGuidePage from "@/app/components/WimbledonGuidePage";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Wimbledon TV Schedule | Channels, Sessions and Legal Streams",
  description:
    "Plan Wimbledon viewing with TV schedule guidance, country broadcaster checks, streaming app notes and travel viewing safety tips.",
  alternates: { canonical: "https://watchtennistoday.com/where-to-watch-wimbledon" },
};

export default function WimbledonTvSchedulePage() {
  return (
    <WimbledonGuidePage
      eyebrow="Wimbledon TV schedule"
      title="Wimbledon TV Schedule: Channels, Sessions and Legal Streaming Options"
      description="Use this Wimbledon TV guide to connect daily sessions, courts, start times and broadcaster availability before choosing a legal stream."
      focus="tv"
    />
  );
}
