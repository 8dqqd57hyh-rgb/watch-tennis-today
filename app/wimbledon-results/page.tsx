import WimbledonGuidePage from "@/app/components/WimbledonGuidePage";

export const metadata = {
  title: "Wimbledon Results Today | Match Updates and Draw Context",
  description:
    "Track Wimbledon results with draw context, next-match planning, TV implications and legal viewing links.",
  alternates: { canonical: "https://watchtennistoday.com/wimbledon-results" },
};

export default function WimbledonResultsPage() {
  return (
    <WimbledonGuidePage
      eyebrow="Wimbledon results"
      title="Wimbledon Results Today: Match Updates, Draw Context and Next TV Windows"
      description="A results-focused Wimbledon page designed to help readers understand completed matches, upcoming sessions and which matches may matter for the next broadcast window."
      focus="results"
    />
  );
}
