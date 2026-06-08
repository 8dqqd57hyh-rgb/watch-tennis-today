import type { Metadata } from "next";
import DailyTennisGuide from "@/app/components/DailyTennisGuide";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tennis Order of Play Today: Courts, Match Timing & Viewing Guide | Watch Tennis Today",
  description:
    "Understand today's tennis order of play, court sequence, match timing changes and legal viewing checks.",
};

export default function Page() {
  return (
    <DailyTennisGuide
      eyebrow="Order of play"
      title="Tennis Order of Play Today: Courts, Match Timing & Viewing Guide"
      description="A court-sequence guide for understanding how today's matches are placed, delayed and verified before viewing."
      intent="Use this page when you care about match order, court movement and why a listed time can change after the day begins."
      mode="order-of-play"
      editorialSections={[
        {
          heading: "Court sequence matters",
          body: "Order of play is not just another name for a schedule. It explains which matches are assigned to each court and in what sequence. If your match is third on a court, the first two matches decide the real start window.",
        },
        {
          heading: "Not before does not mean exactly at",
          body: "A 'not before' time protects fans from expecting an earlier start, but it does not guarantee the match will begin at that minute. The court may still be occupied, weather may interrupt play or the tournament may adjust the session.",
        },
        {
          heading: "Court changes and coverage",
          body: "When a match moves courts, viewing availability can change too. A broadcaster may show a stadium court but not an outside court, so court reassignment is both a timing issue and a coverage issue.",
        },
        {
          heading: "Final verification routine",
          body: "Before you settle in, compare this page with the tournament order of play, the match page and your broadcaster's schedule. That routine is safer than trusting one static start time from earlier in the day.",
        },
      ]}
      faqItems={[
        {
          question: "What does order of play mean?",
          answer: "It is the tournament's planned court sequence for the day, showing which matches are scheduled on each court and in what order.",
        },
        {
          question: "Why did my match move courts?",
          answer: "Court moves can happen because of weather, long matches, ticketed session planning, withdrawals or tournament scheduling decisions.",
        },
        {
          question: "Can a court change affect streaming?",
          answer: "Yes. Some providers cover only selected courts, so a court move can change whether legal video is available.",
        },
      ]}
      links={[
        { href: "/tennis-schedule-today", label: "Tennis schedule today" },
        { href: "/live-tennis", label: "Live tennis matches" },
        { href: "/watch-tennis-live-today", label: "Watch tennis live today" },
        { href: "/tennis-on-tv-today", label: "Tennis on TV today" },
        { href: "/french-open-live", label: "French Open live" },
        { href: "/how-to-watch-tennis-without-cable", label: "Watch tennis without cable" },
      ]}
    />
  );
}
