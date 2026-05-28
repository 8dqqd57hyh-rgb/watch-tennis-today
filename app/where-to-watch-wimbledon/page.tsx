import WimbledonGuidePage from "@/app/components/WimbledonGuidePage";

export const metadata = {
  title: "Where to Watch Wimbledon | Official Broadcasters and Safe Streams",
  description:
    "Find where to watch Wimbledon legally with official broadcaster starting points, streaming safety checks and VPN guidance for travelers.",
  alternates: { canonical: "https://watchtennistoday.com/where-to-watch-wimbledon" },
};

export default function WhereToWatchWimbledonPage() {
  return (
    <WimbledonGuidePage
      eyebrow="Where to watch Wimbledon"
      title="Where to Watch Wimbledon: Official Broadcasters and Safe Streaming Guide"
      description="A country-aware Wimbledon viewing guide that keeps readers focused on official broadcasters, recognized streaming services and safe travel viewing."
      focus="where"
    />
  );
}
