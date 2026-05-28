import type { Metadata } from "next";
import DailyTennisGuide from "@/app/components/DailyTennisGuide";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Who Plays Tennis Today? | ATP, WTA and Grand Slam Match Guide",
  description:
    "See who plays tennis today with live and upcoming match discovery, tournament context, order of play guidance and legal stream links.",
  alternates: { canonical: "https://watchtennistoday.com/who-plays-tennis-today" },
};

export default function WhoPlaysTennisTodayPage() {
  return (
    <DailyTennisGuide
      eyebrow="Who plays today"
      title="Who Plays Tennis Today? ATP, WTA and Grand Slam Match Guide"
      description="A simple daily tennis page for checking live and upcoming matches without invented fixtures or fake stream links."
      intent="Use this page when you want to know which players are scheduled today, which tournaments are active and where to continue with legal viewing checks."
      mode="schedule"
      links={[
        { href: "/live-tennis", label: "Live tennis now" },
        { href: "/tennis-order-of-play-today", label: "Order of play today" },
        { href: "/tennis-results-today", label: "Tennis results today" },
        { href: "/players", label: "Player index" },
        { href: "/watch-player-live", label: "Player live hubs" },
        { href: "/watch-tennis-live-today", label: "Legal tennis streams today" },
      ]}
    />
  );
}
