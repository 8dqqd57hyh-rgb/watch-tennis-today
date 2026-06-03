import type { Metadata } from "next";
import HelpfulArticle from "@/app/components/HelpfulArticle";

export const metadata: Metadata = {
  title: 'Tennis Scoring Explained: Games, Sets, Tiebreaks and Match Formats',
  description: 'A beginner-friendly guide to tennis scoring, including love, deuce, advantage, sets, tiebreaks and why formats differ between tours and tournaments.',
  alternates: { canonical: "https://watchtennistoday.com/tennis-scoring-explained" },
};

const sections = [
    { title: 'How tennis points work', body: ['Tennis scoring can look strange at first because points are not counted as 1, 2, 3 and 4. A normal game moves from love to 15, 30 and 40. Love means zero. If a player wins the next point after 40 while the opponent has fewer than 40, that player wins the game.', "The unusual scoring language is part of the sport's history, but the practical rule is simple: a player needs four points to win a normal game, and they must usually win by two points if both players reach 40."] },
    { title: 'What deuce and advantage mean', body: ['When both players reach 40, the score is called deuce. From deuce, one player must win two points in a row to take the game. The first point after deuce gives advantage to that player. If the same player wins the next point, the game is over. If the opponent wins the next point, the score returns to deuce.', "This is why one tennis game can last thirty seconds or more than ten minutes. On important points, players often choose safer serves, higher-margin shots or patterns that target the opponent's weaker side."] },
    { title: 'How sets are won', body: ['A set is usually won by the first player to six games, but the player must normally lead by two games. Common set scores are 6-3, 6-4 or 7-5. If the score reaches 6-6, most tournaments use a tiebreak to decide the set.', 'Some events have final-set variations, so it is always worth checking the tournament rules. Grand Slam tournaments, ATP events, WTA events, doubles matches and team competitions can use slightly different deciding-set formats.'] },
    { title: 'What a tiebreak is', body: ['A standard tiebreak is normally played to seven points, with a two-point margin required. Players serve in a rotating pattern: one point by the first server, then two points by the other player, then two points each until the tiebreak ends.', 'Tiebreaks reward aggressive but controlled tennis. A single mini-break on return can decide the set, so serve quality, first-strike forehands and mental stability matter a lot.'] },
    { title: 'Why some matches are best-of-three and others best-of-five', body: ["Most professional tennis matches are best-of-three sets: the first player to win two sets wins the match. Men's singles at Grand Slam tournaments have traditionally used best-of-five sets, where a player must win three sets.", 'Best-of-five rewards physical endurance, tactical adjustment and emotional control. Best-of-three creates more daily scheduling flexibility and can produce faster momentum swings.'] },
    { title: 'How to use this when watching live tennis', body: ['When following a match, focus first on the set score, then the game score, then whether a player is serving. A player serving at 4-5 is often under more pressure than a player serving at 2-1 because losing that service game may end the set.', 'Watch Tennis Today uses live score and schedule data to help fans see which matches are live, upcoming or finished. Scores can update with short delays, so official tournament pages and licensed broadcasters remain the final source during disputes or interruptions.'] }
  ];

export default function Page() {
  return (
    <HelpfulArticle
      eyebrow='Tennis basics'
      title='Tennis Scoring Explained: Games, Sets, Tiebreaks and Match Formats'
      description='A beginner-friendly guide to tennis scoring, including love, deuce, advantage, sets, tiebreaks and why formats differ between tours and tournaments.'
      sections={sections}
      related={[
        { href: "/how-to-watch-tennis-legally", label: "How to watch tennis legally" },
        { href: "/tennis-streaming-rights-explained", label: "Streaming rights explained" },
        { href: "/best-tennis-matches-today", label: "Best matches today" },
      ]}
    />
  );
}
