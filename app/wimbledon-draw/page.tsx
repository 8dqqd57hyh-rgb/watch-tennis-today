import WimbledonGuidePage from "@/app/components/WimbledonGuidePage";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Wimbledon Draw Guide | Bracket, Seeds and Match Planning",
  description:
    "Understand the Wimbledon draw with bracket context, seeded player paths, results links, order-of-play planning and legal viewing guidance.",
  alternates: { canonical: "https://watchtennistoday.com/wimbledon-draw" },
  openGraph: {
    title: "Wimbledon Draw Guide",
    description:
      "Bracket context, seeded player paths and viewing links for following the Wimbledon draw.",
    url: "https://watchtennistoday.com/wimbledon-draw",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wimbledon Draw Guide",
    description:
      "Bracket context, seeded player paths and viewing links for following the Wimbledon draw.",
  },
};

export default function WimbledonDrawPage() {
  return (
    <WimbledonGuidePage
      eyebrow="Wimbledon draw"
      title="Wimbledon Draw Guide: Bracket, Seeds and Match Planning"
      description="Use this page to follow Wimbledon draw context, understand how results change the bracket and move quickly to schedule, order-of-play, live and country viewing pages."
      focus="results"
      currentPath="/wimbledon-draw"
      currentPageName="Wimbledon Draw"
    />
  );
}
