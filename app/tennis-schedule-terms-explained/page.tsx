import type { Metadata } from "next";
import HelpfulArticle from "@/app/components/HelpfulArticle";

export const metadata: Metadata = {
  title: 'Tennis Schedule Terms Explained: Not Before, Court, Walkover, Retired and Suspended',
  description: 'Understand common tennis schedule terms so live score pages, order-of-play pages and TV listings make more sense.',
  alternates: { canonical: "https://watchtennistoday.com/tennis-schedule-terms-explained" },
};

const sections = [
    { title: 'Order of play', body: ['The order of play is the daily schedule published by a tournament. It lists courts, match order and approximate start times. Tennis schedules are flexible because earlier matches can be short, very long, delayed by rain or interrupted by medical issues.', 'This is why tennis pages often use phrases such as not before or followed by instead of exact start times for every match.'] },
    { title: 'Not before', body: ['Not before means a match cannot start earlier than the listed time, but it can start later. For example, a match listed as not before 15:00 will not begin at 14:30, but it may begin at 16:10 if earlier matches run long.', 'Fans should treat not-before times as protection against an early start, not as a promise of the exact start.'] },
    { title: 'Court assignments', body: ['Court assignment tells you where a match is scheduled. Big matches often appear on the main stadium court, but exciting matches can happen on smaller courts with limited TV coverage.', 'Court changes can happen when weather, darkness or long matches disrupt the schedule. Official tournament pages remain the final source for late changes.'] },
    { title: 'Walkover and retirement', body: ['A walkover means a player did not start the match, usually because of illness, injury or another issue. A retirement means the match started but a player could not finish. Both results can affect the draw and schedule.', 'When a player retires, the score may look unusual because the match ended before a normal match point. Schedule pages should avoid overexplaining medical reasons unless official information is available.'] },
    { title: 'Suspended and delayed', body: ['Suspended means a match started but was stopped, often because of rain, darkness or court conditions. Delayed means the match has not started on time. Indoor tournaments usually have fewer weather interruptions, while clay and grass events can be more weather-sensitive.', 'A suspended match may resume later the same day or be moved to the next day. This can change the rest of the schedule.'] },
    { title: 'How Watch Tennis Today handles schedule data', body: ['The site uses schedule and fixture feeds to display live, upcoming and finished matches. Because tennis schedules move quickly, users should expect occasional delays and confirm final court changes with official tournament sources.'] }
  ];

export default function Page() {
  return (
    <HelpfulArticle
      eyebrow='Schedule help'
      title='Tennis Schedule Terms Explained: Not Before, Court, Walkover, Retired and Suspended'
      description='Understand common tennis schedule terms so live score pages, order-of-play pages and TV listings make more sense.'
      sections={sections}
      related={[
        { href: "/how-to-watch-tennis-legally", label: "How to watch tennis legally" },
        { href: "/tennis-streaming-rights-explained", label: "Streaming rights explained" },
        { href: "/best-tennis-matches-today", label: "Best matches today" },
      ]}
    />
  );
}
