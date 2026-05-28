import type { Metadata } from "next";
import DailyTennisGuide from "@/app/components/DailyTennisGuide";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tennis on TV Today | Live Tennis Channels and Legal Streams",
  description:
    "Find tennis on TV today with live match discovery, broadcaster planning, official schedule checks and legal streaming routes.",
  alternates: { canonical: "https://watchtennistoday.com/tennis-on-tv-today" },
};

export default function TennisOnTvTodayPage() {
  return (
    <DailyTennisGuide
      eyebrow="Tennis on TV today"
      title="Tennis on TV Today: Live Tennis Channels and Legal Streams"
      description="A daily guide for finding tennis matches, checking TV coverage and choosing safe legal streams before play starts."
      intent="Use this page to connect today’s ATP, WTA and Grand Slam match data with official broadcaster checks, TV schedule pages and legal streaming options."
      mode="schedule"
      links={[
        { href: "/tv-schedule", label: "Full tennis TV schedule" },
        { href: "/watch-tennis-live-today", label: "Watch tennis live today" },
        { href: "/tennis-schedule-today", label: "Tennis schedule today" },
        { href: "/how-to-watch-tennis-without-cable", label: "Watch tennis without cable" },
        { href: "/best-vpn-for-tennis-streaming", label: "Best VPN for tennis streaming" },
        { href: "/where-to-watch-wimbledon", label: "Where to watch Wimbledon" },
      ]}
    />
  );
}
