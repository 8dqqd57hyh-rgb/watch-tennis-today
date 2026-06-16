import type { Metadata } from "next";
import DailyTennisGuide from "@/app/components/DailyTennisGuide";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tennis Schedule Today: Live ATP, WTA & Grand Slam Matches | Watch Tennis Today",
  description:
    "Check today's tennis schedule with live, upcoming and completed match context, tournament details and legal viewing routes.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <DailyTennisGuide
      eyebrow="Daily tennis schedule"
      title="Tennis Schedule Today: Live ATP, WTA & Grand Slam Matches"
      description="A complete schedule-focused page for checking today's real tennis matches before moving to official tournament and broadcaster sources."
      intent="Use this page as the broad daily dashboard: live matches, upcoming matches, tournament context and next-step links for legal viewing."
      mode="schedule"
      editorialSections={[
        {
          heading: "Complete daily overview",
          body: "This page has the broadest intent of the daily set: it is for users who want the whole tennis schedule today rather than a channel list, a player list or only an order-of-play explanation. Read it as the central overview before moving into more specific pages.",
        },
        {
          heading: "Why schedule rows move",
          body: "Tennis schedules are built around courts, not fixed broadcast slots. If a previous match lasts three hours or rain interrupts play, later matches can move. That is why today's schedule should be checked more than once during a busy tournament day.",
        },
        {
          heading: "What the status labels mean",
          body: "Live means play has started; upcoming means planned but still subject to change; suspended means the match has paused; finished means the result is known. These labels help you decide whether to watch now, set a reminder or look for a replay.",
        },
        {
          heading: "From schedule to legal coverage",
          body: "A schedule is not the same as a stream. After finding a match, confirm the tournament's official order of play and the licensed broadcaster for your country before paying for access or trusting a viewing link.",
        },
      ]}
      faqItems={[
        {
          question: "What is this schedule best for?",
          answer: "It is best for getting a broad picture of today's tennis before narrowing down to a player, court, result or legal viewing option.",
        },
        {
          question: "Are the times guaranteed?",
          answer: "No. They are useful planning signals, but tennis times can shift because the previous match controls the court schedule.",
        },
        {
          question: "Where should I check before watching?",
          answer: "Use the tournament order of play and your local rights holder as the final source for timing and coverage.",
        },
      ]}
      links={[
        { href: "/live-tennis", label: "Live tennis matches" },
        { href: "/watch-tennis-live-today", label: "Watch tennis live today" },
        { href: "/tennis-on-tv-today", label: "Tennis on TV today" },
        { href: "/tennis-order-of-play-today", label: "Order of play today" },
        { href: "/tennis-results-today", label: "Tennis results today" },
        { href: "/how-to-watch-tennis-without-cable", label: "Watch tennis without cable" },
      ]}
    />
  );
}
