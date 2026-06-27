import type { Metadata } from "next";
import DailyTennisGuide from "@/app/components/DailyTennisGuide";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Who Plays Tennis Today? | ATP, WTA and Grand Slam Match Guide",
  description:
    "See who plays tennis today with player-focused match discovery, tournament context, order-of-play checks and legal viewing links.",
  alternates: { canonical: "https://watchtennistoday.com/who-plays-tennis-today" },
};

export default function WhoPlaysTennisTodayPage() {
  return (
    <DailyTennisGuide
      eyebrow="Who plays today"
      title="Who Plays Tennis Today? ATP, WTA and Grand Slam Match Guide"
      description="A player-focused daily page for checking which names are on court today and which matches are worth following."
      intent="Use this page when your first question is about the players: who is scheduled, which tournament they are playing and where to continue with legal viewing checks."
      pagePath="/who-plays-tennis-today"
      breadcrumbLabel="Who Plays Tennis Today"
      mode="schedule"
      editorialSections={[
        {
          heading: "Player-first schedule reading",
          body: "This page is different from a full schedule because it starts with the people on court. Fans often want to know whether a favorite player, returning champion or rising qualifier plays today before they care about the full draw. Use the player names as the entry point, then check tournament, round and status.",
        },
        {
          heading: "Names can change late",
          body: "Tennis lineups can shift after withdrawals, lucky-loser replacements, walkovers or doubles substitutions. If a player appears in a listing, confirm the match close to start time with the official order of play before making travel, subscription or watch-party plans.",
        },
        {
          heading: "Singles, doubles and tour level",
          body: "A player may appear in singles, doubles or mixed doubles, and the viewing options may differ for each match. ATP, WTA, Challenger and ITF events also have different levels of coverage. The match context is more reliable than the player name alone.",
        },
        {
          heading: "Following legally",
          body: "When you find a player you want to follow, move from this page to the tournament and broadcaster check. Watch Tennis Today helps with discovery but does not provide unauthorized video, so legal viewing still depends on your country and provider.",
        },
      ]}
      faqItems={[
        {
          question: "Can I use this page to follow one player?",
          answer: "Yes. Start with the player name, then open the match page or official tournament schedule for timing and court context.",
        },
        {
          question: "Why might a player disappear from today's list?",
          answer: "Withdrawals, schedule corrections, completed matches and feed updates can change the visible player list during the day.",
        },
        {
          question: "Does a listed player guarantee a stream?",
          answer: "No. A player can be scheduled on a court that has no live video in your territory, so verify coverage separately.",
        },
      ]}
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
