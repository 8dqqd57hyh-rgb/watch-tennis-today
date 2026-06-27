import type { Metadata } from "next";
import DailyTennisGuide from "@/app/components/DailyTennisGuide";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tennis Schedule Tomorrow: ATP, WTA & Grand Slam Planning Guide",
  description:
    "Plan tomorrow's tennis schedule with start-time caveats, order-of-play checks, legal viewing guidance and links to current match pages.",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://watchtennistoday.com/tennis-schedule-tomorrow" },
};

export default function TennisScheduleTomorrowPage() {
  return (
    <DailyTennisGuide
      eyebrow="Tomorrow's tennis planner"
      title="Tennis Schedule Tomorrow: ATP, WTA & Grand Slam Planning Guide"
      description="A planning page for checking tomorrow's tennis schedule, understanding why start times can move and preparing legal viewing options before match day."
      intent="Use this page before tomorrow's order of play is final: identify tournaments to watch, learn which timing details can shift, and save the related pages that update closer to match time."
      pagePath="/tennis-schedule-tomorrow"
      breadcrumbLabel="Tennis Schedule Tomorrow"
      mode="schedule"
      fallbackHeading="Tomorrow's match feed is not confirmed yet"
      fallbackBody="Tomorrow's tennis schedules are often published or revised late in the previous day. This page does not invent future fixtures, so use the planning guide below and check back after tournaments publish the official order of play."
      editorialSections={[
        {
          heading: "Tomorrow's schedule is provisional",
          body: "Tennis tournaments usually release the next day's order of play after today's matches finish. Weather, withdrawals and court availability can still change the plan after publication.",
        },
        {
          heading: "Plan by tournament first",
          body: "Before exact match times are confirmed, start with the tournaments in progress. Grand Slams, ATP, WTA, Challenger and qualifying events can have very different publication schedules.",
        },
        {
          heading: "Check local time carefully",
          body: "A match listed tomorrow in one country can fall late tonight or early the next morning in another timezone. Always convert the tournament time before setting reminders.",
        },
        {
          heading: "Prepare viewing options early",
          body: "Broadcaster coverage can depend on court and session. If you want to watch one player, confirm the provider, court coverage and replay rules before the match begins.",
        },
      ]}
      faqItems={[
        {
          question: "When is tomorrow's tennis schedule usually available?",
          answer:
            "Many tournaments publish the next day's order of play after the current day's matches finish, but timing varies by event and weather conditions.",
        },
        {
          question: "Can tomorrow's tennis start times change?",
          answer:
            "Yes. Tennis start times can move because earlier matches run long, courts change, weather delays play or tournament organizers revise the session.",
        },
        {
          question: "Where should I confirm tomorrow's match before watching?",
          answer:
            "Use the official tournament order of play and your local broadcaster or streaming provider as the final confirmation source.",
        },
      ]}
      links={[
        { href: "/tomorrow", label: "Tomorrow match dashboard" },
        { href: "/tennis-schedule-today", label: "Tennis schedule today" },
        { href: "/tennis-order-of-play-today", label: "Order of play today" },
        { href: "/tennis-time-zone-converter", label: "Tennis time zone converter" },
        { href: "/watch-tennis-live-today", label: "Watch tennis live today" },
        { href: "/tennis-on-tv-today", label: "Tennis on TV today" },
      ]}
    />
  );
}
