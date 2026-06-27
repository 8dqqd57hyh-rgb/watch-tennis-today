import type { Metadata } from "next";
import DailyTennisGuide from "@/app/components/DailyTennisGuide";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tennis on TV Today | Live Tennis Channels and Legal Streams",
  description:
    "Find tennis on TV today with channel discovery, broadcaster checks, official schedules and legal streaming routes.",
  alternates: { canonical: "https://watchtennistoday.com/tennis-on-tv-today" },
};

export default function TennisOnTvTodayPage() {
  return (
    <DailyTennisGuide
      eyebrow="Tennis on TV today"
      title="Tennis on TV Today: Channels, Broadcast Windows and Legal Streams"
      description="A broadcast-focused daily guide for checking whether today's tennis is on TV, streaming-only, replay-only or unavailable in your country."
      intent="Use this page to connect today's match list with official broadcaster checks, channel schedules and legal streaming options before play starts."
      pagePath="/tennis-on-tv-today"
      breadcrumbLabel="Tennis on TV Today"
      mode="schedule"
      editorialSections={[
        {
          heading: "Broadcast discovery first",
          body: "This page is specifically for fans asking where tennis is shown on TV today. Start with the event name and then check the local broadcaster, because rights are sold by tournament and territory. A match can be live on cable in one country, streaming-only in another and limited to highlights elsewhere.",
        },
        {
          heading: "Channel listings can lag",
          body: "TV grids are not always updated as quickly as tennis schedules. Long matches, rain delays and court changes may move a broadcast window after the first listing appears. Use this page to identify likely matches, then confirm the exact channel or app close to first ball.",
        },
        {
          heading: "Why court coverage matters",
          body: "Some broadcasters buy a tournament package but show only selected courts or sessions. If you care about one match, check whether the provider lists that court, not just the tournament name. That prevents paying for a service that covers the event but not the match you wanted.",
        },
        {
          heading: "Safe next step",
          body: "Watch Tennis Today does not host broadcasts. If a TV option is not listed by a recognized broadcaster, tournament site or tour source, treat it carefully. Official live scores, highlights and replays are safer fallbacks than unknown stream pages.",
        },
      ]}
      faqItems={[
        {
          question: "Is every tennis match on TV today?",
          answer: "No. Main courts and bigger matches are more likely to be televised, while smaller courts may have scores only or limited streaming.",
        },
        {
          question: "Why is tennis on a different channel in another country?",
          answer: "Broadcast rights are local, so the same tournament can be split between different TV networks and streaming services around the world.",
        },
        {
          question: "Does this page show live TV?",
          answer: "No. It helps you find and verify legal TV or streaming routes, but the actual video must come from a licensed broadcaster.",
        },
      ]}
      links={[
        { href: "/tennis-tv-schedule-today", label: "Today's match-first TV schedule" },
        { href: "/coverage-graph", label: "Coverage Graph engine" },
        { href: "/watch-tennis-live-today", label: "Legal tennis streams today" },
        { href: "/tennis-schedule-today", label: "Complete tennis schedule today" },
        { href: "/tennis-order-of-play-today", label: "Order of play today" },
        { href: "/how-to-watch-tennis-without-cable", label: "Watch tennis without cable" },
        { href: "/official-tennis-broadcasters-guide", label: "Official broadcasters guide" },
        { href: "/where-to-watch-wimbledon", label: "Where to watch Wimbledon" },
      ]}
    />
  );
}
