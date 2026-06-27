import type { Metadata } from "next";
import DailyTennisGuide from "@/app/components/DailyTennisGuide";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tennis Results Today: Scores, Live Updates & Follow-Up Guides | Watch Tennis Today",
  description:
    "Follow today's tennis results, completed match context, reliable score checks and follow-up guides for ATP, WTA and Grand Slam tennis.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: "https://watchtennistoday.com/tennis-results-today",
  },
};

export default function Page() {
  return (
    <DailyTennisGuide
      eyebrow="Daily results"
      title="Tennis Results Today: Scores, Live Updates & Follow-Up Guides"
      description="Follow today's tennis results, completed match context, reliable score checks and follow-up pages for ATP, WTA and Grand Slam tennis."
      intent="A results-focused hub for fans who want to move from match updates to player pages, tournament context and next-match planning."
      pagePath="/tennis-results-today"
      breadcrumbLabel="Tennis Results Today"
      mode="results"
      fallbackHeading="No confirmed tennis results are available right now"
      fallbackBody="The results feed is unavailable or has not returned completed matches yet. This page avoids placeholder scorelines, so use the result-checking guidance below and confirm final scores with the tournament or tour source."
      editorialSections={[
        {
          heading: "How to read today's tennis results",
          body: "A final score is only useful when it is tied to the correct tournament, round and match status. Retirements, walkovers and suspended matches can look like normal results in a raw feed, so this page treats status labels carefully.",
        },
        {
          heading: "When live scores are not final",
          body: "A live score can change point by point and may briefly lag behind the actual court. Use it as a progress signal, not as the final result until the match is marked finished by a reliable source.",
        },
        {
          heading: "What to check after a match ends",
          body: "After a match finishes, check the player's next match, tournament draw, ranking impact and replay availability. Those follow-up checks are often more useful than the score alone.",
        },
        {
          heading: "Why some results arrive late",
          body: "Lower-court matches, qualifying rounds and smaller events can update more slowly than stadium matches. The page leaves gaps visible rather than filling them with unverified outcomes.",
        },
      ]}
      faqItems={[
        {
          question: "Are these tennis results official?",
          answer:
            "They are based on the match feed when available, but final confirmation should come from the tournament, tour or official scoring provider.",
        },
        {
          question: "Why is a match missing from today's results?",
          answer:
            "Some tournaments publish scores later, and some feeds omit lower-court, qualifying or smaller-event matches. Missing data is not replaced with guessed scores.",
        },
        {
          question: "Where can I find the next match after a result?",
          answer:
            "Use the player page, tournament page or today schedule links to move from a completed result to upcoming match context.",
        },
      ]}
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
