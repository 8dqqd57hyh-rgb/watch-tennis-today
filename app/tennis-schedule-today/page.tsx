import type { Metadata } from "next";
import DailyTennisGuide from "@/app/components/DailyTennisGuide";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tennis Schedule Today: Live ATP, WTA & Grand Slam Matches | Watch Tennis Today",
  description:
    "Check today’s real tennis schedule, live ATP and WTA matches, tournament context and legal viewing routes before play starts.",
};

export default function Page() {
  return (
    <DailyTennisGuide
      eyebrow="Daily tennis schedule"
      title="Tennis Schedule Today: Live ATP, WTA & Grand Slam Matches"
      description="Check today’s real tennis schedule, live match discovery, tournament context and legal viewing routes before play starts."
      intent="A daily tennis dashboard for fans who want to see real live and upcoming matches before checking official tournament sites, score apps and TV guides."
      mode="schedule"
      links={[
        { href: "/live-tennis", label: "Live tennis matches" },
        { href: "/watch-tennis-live-today", label: "Watch tennis live today" },
        { href: "/tv-schedule", label: "Tennis TV schedule" },
        { href: "/tennis-order-of-play-today", label: "Order of play today" },
        { href: "/tennis-results-today", label: "Tennis results today" },
        { href: "/how-to-watch-tennis-without-cable", label: "Watch tennis without cable" },
      ]}
    />
  );
}
