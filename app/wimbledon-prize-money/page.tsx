import WimbledonGuidePage from "@/app/components/WimbledonGuidePage";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Wimbledon Prize Money Guide | Rounds, Results and Draw Context",
  description:
    "A practical Wimbledon prize money guide with round context, draw implications, results links and legal viewing resources.",
  alternates: { canonical: "https://watchtennistoday.com/wimbledon-prize-money" },
  openGraph: {
    title: "Wimbledon Prize Money Guide",
    description:
      "Round-by-round prize money context, draw implications and Wimbledon viewing links.",
    url: "https://watchtennistoday.com/wimbledon-prize-money",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wimbledon Prize Money Guide",
    description:
      "Round-by-round prize money context, draw implications and Wimbledon viewing links.",
  },
};

export default function WimbledonPrizeMoneyPage() {
  return (
    <WimbledonGuidePage
      eyebrow="Wimbledon prize money"
      title="Wimbledon Prize Money Guide: Rounds, Results and Draw Context"
      description="Use this page to connect Wimbledon prize money questions with draw progress, round-by-round results, match scheduling and legal ways to watch the Championships."
      focus="results"
      currentPath="/wimbledon-prize-money"
      currentPageName="Wimbledon Prize Money"
    />
  );
}
