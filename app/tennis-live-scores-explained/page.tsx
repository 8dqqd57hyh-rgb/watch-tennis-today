import type { Metadata } from "next";
import HelpfulArticle from "@/app/components/HelpfulArticle";

export const metadata: Metadata = {
  title: 'Tennis Live Scores Explained: Why Scores Change, Freeze or Look Delayed',
  description: 'A transparent explanation of live tennis score data, delays, retired matches, suspended matches and why official sources can differ.',
  alternates: { canonical: "https://watchtennistoday.com/tennis-live-scores-explained" },
};

const sections = [
    { title: 'Why live scores can differ', body: ['Live tennis scores come from data feeds, official scorers, broadcasters and tournament systems. Small delays can happen when a feed updates slowly, a match is suspended or a court has limited coverage.', 'A scoreboard should be treated as a helpful live indicator, not as a legal or official result until the tournament confirms the final score.'] },
    { title: 'Common live score states', body: ['Upcoming means the match has not started. Live means the match is currently in progress. Finished means the match has ended. Suspended, delayed, retired and walkover are special states that explain why a match may not follow the normal scoring path.', 'The same match can move between states during rain delays or scheduling changes.'] },
    { title: 'Why point-by-point data is difficult', body: ['Point-by-point data is more fragile than set scores. A feed may show the game score accurately but not provide every 15, 30 or 40 update. Some courts have richer data than others.', 'Responsible sites should avoid inventing point scores. If the feed is uncertain, it is better to show only reliable set and game information.'] },
    { title: 'How delays affect fans', body: ['A score delay of thirty seconds may not matter for casual following, but it can be confusing during tiebreaks, match points or rain interruptions. Fans watching TV may see a point before a web scoreboard updates.', 'For critical moments, the official tournament scoreboard or the licensed broadcast should be treated as the primary source.'] },
    { title: 'Why match pages may remain useful after a match', body: ['After a match ends, the page can still help users understand the tournament, players, broadcaster context and related matches. However, stale live pages should not pretend to be breaking news.', 'Good sports pages should clearly separate live data, archived results and evergreen viewing information.'] },
    { title: "Watch Tennis Today's approach", body: ['Watch Tennis Today uses live and schedule data to organize tennis information, while avoiding claims that it is the official scoreboard. The site does not host video and does not ask users to click ads to reveal streams or scores.'] }
  ];

export default function Page() {
  return (
    <HelpfulArticle
      eyebrow='Live score transparency'
      title='Tennis Live Scores Explained: Why Scores Change, Freeze or Look Delayed'
      description='A transparent explanation of live tennis score data, delays, retired matches, suspended matches and why official sources can differ.'
      sections={sections}
      related={[
        { href: "/how-to-watch-tennis-legally", label: "How to watch tennis legally" },
        { href: "/tennis-streaming-rights-explained", label: "Streaming rights explained" },
        { href: "/best-tennis-matches-today", label: "Best matches today" },
      ]}
    />
  );
}
