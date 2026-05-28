import type { Metadata } from "next";
import DailyTennisGuide from "@/app/components/DailyTennisGuide";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tennis Order of Play Today: Courts, Match Timing & Viewing Guide | Watch Tennis Today",
  description:
    "Use today’s real tennis match data to understand court timing, likely schedule changes and where to verify official order of play updates.",
};

export default function Page() {
  return (
    <DailyTennisGuide
      eyebrow="Order of play"
      title="Tennis Order of Play Today: Courts, Match Timing & Viewing Guide"
      description="Use today’s real tennis match data to understand likely timing, live status and where to verify official court assignments."
      intent="A practical order-of-play hub for fans following ATP, WTA and Grand Slam schedule changes throughout the day."
      mode="order-of-play"
      links={[
        { href: "/tennis-schedule-today", label: "Tennis schedule today" },
        { href: "/live-tennis", label: "Live tennis matches" },
        { href: "/watch-tennis-live-today", label: "Watch tennis live today" },
        { href: "/tv-schedule", label: "Tennis TV schedule" },
        { href: "/french-open-live", label: "French Open live" },
        { href: "/how-to-watch-tennis-without-cable", label: "Watch tennis without cable" },
      ]}
    />
  );
}
