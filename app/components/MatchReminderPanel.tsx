import Link from "next/link";

type MatchReminderPanelProps = {
  matchTitle: string;
  tournament: string;
  status: string;
  startTime: string | null;
  matchUrl: string;
};

function isFinished(status: string) {
  return ["FINISHED", "CANCELLED", "RETIRED", "COMPLETED"].includes(status.toUpperCase());
}

function formatCalendarDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

export function getCalendarHref({
  matchTitle,
  tournament,
  startTime,
  matchUrl,
}: Omit<MatchReminderPanelProps, "status">) {
  if (!startTime) return null;

  const start = new Date(startTime);
  if (Number.isNaN(start.getTime())) return null;

  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Watch Tennis Today//Match Reminder//EN",
    "BEGIN:VEVENT",
    `UID:${matchTitle.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-${start.getTime()}@watchtennistoday.com`,
    `DTSTAMP:${formatCalendarDate(new Date())}`,
    `DTSTART:${formatCalendarDate(start)}`,
    `DTEND:${formatCalendarDate(end)}`,
    `SUMMARY:${matchTitle}`,
    `DESCRIPTION:${matchTitle} at ${tournament}. Check live score and legal viewing info: ${matchUrl}`,
    `LOCATION:${tournament}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT30M",
    "ACTION:DISPLAY",
    `DESCRIPTION:${matchTitle} starts soon`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(body)}`;
}

export default function MatchReminderPanel(props: MatchReminderPanelProps) {
  const { matchTitle, tournament, status, startTime, matchUrl } = props;
  const finished = isFinished(status);
  const calendarHref = finished ? null : getCalendarHref({ matchTitle, tournament, startTime, matchUrl });

  const headline = finished
    ? "This match is finished — follow the next tennis matches"
    : status.toUpperCase() === "LIVE"
      ? "Match is live — keep this page open"
      : "Set a real calendar reminder";

  const description = finished
    ? "Use the schedule and player links below to continue to today’s live and upcoming tennis coverage."
    : calendarHref
      ? "Download a calendar event with a 30-minute alert. The reminder is handled by your calendar app, so no email address is collected."
      : "The official start time is not confirmed yet. Return to the schedule before play to add a calendar reminder.";

  return (
    <section className="mb-12 rounded-[2rem] border border-green-500/30 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.18),_transparent_38%),#09090b] p-6">
      <div className="grid gap-5 lg:grid-cols-[1fr_360px] lg:items-center">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.24em] text-green-400">
            Match reminder
          </p>
          <h2 className="mb-3 text-3xl font-black">{headline}</h2>
          <p className="max-w-3xl leading-7 text-zinc-300">{description}</p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold text-zinc-400">
            <span className="rounded-full border border-zinc-800 bg-black px-4 py-2">{tournament}</span>
            <span className="rounded-full border border-zinc-800 bg-black px-4 py-2">{status}</span>
            {calendarHref ? (
              <span className="rounded-full border border-zinc-800 bg-black px-4 py-2">30-minute calendar alert</span>
            ) : null}
          </div>
        </div>

        <div className="grid gap-3 rounded-3xl border border-zinc-800 bg-black/70 p-4">
          {calendarHref ? (
            <a
              href={calendarHref}
              download={`${matchTitle.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-reminder.ics`}
              className="rounded-2xl bg-green-500 px-5 py-4 text-center font-black text-black transition hover:bg-green-400"
            >
              Add to calendar
            </a>
          ) : (
            <Link
              href="/today"
              className="rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-4 text-center font-black text-white transition hover:border-green-500"
            >
              Open today&apos;s schedule
            </Link>
          )}
          <p className="text-xs leading-5 text-zinc-500">
            Calendar alerts depend on your device and calendar notification settings.
          </p>
        </div>
      </div>
    </section>
  );
}
