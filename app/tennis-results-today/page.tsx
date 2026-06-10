import type { Metadata } from "next";
import DailyTennisGuide from "@/app/components/DailyTennisGuide";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tennis Results Today: Scores, Live Updates & Follow-Up Guides | Watch Tennis Today",
  description:
    "Follow today’s tennis match updates, live scores and follow-up pages for ATP, WTA and Grand Slam tennis.",
};

export default function Page() {
  return (
    <DailyTennisGuide
      eyebrow="Daily results"
      title="Tennis Results Today: Scores, Live Updates & Follow-Up Guides"
      description="Follow today’s tennis match updates, live scores and follow-up pages for ATP, WTA and Grand Slam tennis."
      intent="A results-focused hub for fans who want to move from match updates to player pages, tournament context and next-match planning."
      mode="results"
      links={[
        { href: "/tennis-schedule-today", label: "Tennis schedule today" },
        { href: "/live-tennis", label: "Live tennis matches" },
        { href: "/watch-tennis-live-today", label: "Watch tennis live today" },
        { href: "/tv-schedule", label: "Tennis TV schedule" },
        { href: "/french-open", label: "French Open live" },
        { href: "/best-ways-to-watch-tennis-online", label: "Best ways to watch tennis online" },
      ]}
    />
  );
}
