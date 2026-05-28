import WimbledonGuidePage from "@/app/components/WimbledonGuidePage";

export const metadata = {
  title: "Wimbledon Live Stream Guide | Legal TV, Schedule and VPN Tips",
  description:
    "Follow Wimbledon live with legal broadcaster checks, daily schedule planning, TV options, travel viewing tips and safe VPN guidance.",
  alternates: { canonical: "https://watchtennistoday.com/wimbledon-live" },
};

export default function WimbledonLivePage() {
  return (
    <WimbledonGuidePage
      eyebrow="Wimbledon live hub"
      title="Wimbledon Live Stream Guide: Legal TV, Schedule and Safe Ways to Watch"
      description="A practical Wimbledon hub for finding legal viewing options, checking the order of play and preparing for Centre Court, No.1 Court and outside-court sessions."
      focus="live"
    />
  );
}
