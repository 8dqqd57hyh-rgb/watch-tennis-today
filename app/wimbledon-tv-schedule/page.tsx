import WimbledonGuidePage from "@/app/components/WimbledonGuidePage";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Wimbledon TV Schedule | Channels, Sessions and Legal Streams",
  description:
    "Plan Wimbledon viewing with TV schedule guidance, country broadcaster checks, streaming app notes and travel viewing safety tips.",
  alternates: { canonical: "https://watchtennistoday.com/wimbledon-tv-schedule" },
  openGraph: {
    title: "Wimbledon TV Schedule",
    description:
      "TV schedule guidance, country broadcaster checks and streaming app notes for Wimbledon.",
    url: "https://watchtennistoday.com/wimbledon-tv-schedule",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wimbledon TV Schedule",
    description:
      "TV schedule guidance, country broadcaster checks and streaming app notes for Wimbledon.",
  },
};

export default function WimbledonTvSchedulePage() {
  return (
    <WimbledonGuidePage
      eyebrow="Wimbledon TV schedule"
      title="Wimbledon TV Schedule: Channels, Sessions and Legal Streaming Options"
      description="Use this Wimbledon TV guide to connect daily sessions, courts, start times and broadcaster availability before choosing a legal stream."
      focus="tv"
      currentPath="/wimbledon-tv-schedule"
      currentPageName="Wimbledon TV Schedule"
    />
  );
}
