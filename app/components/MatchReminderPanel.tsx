"use client";

import { useMemo, useState } from "react";

type MatchReminderPanelProps = {
  matchTitle: string;
  tournament: string;
  status: string;
  startTime: string | null;
  matchUrl: string;
};

function normalizeStatus(status: string) {
  return status.toUpperCase();
}

function isFinished(status: string) {
  return ["FINISHED", "CANCELLED", "RETIRED", "COMPLETED"].includes(normalizeStatus(status));
}

function formatCalendarDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function getCalendarStart(startTime: string | null) {
  if (!startTime) return null;

  const date = new Date(startTime);
  if (Number.isNaN(date.getTime())) return null;

  return date;
}

export default function MatchReminderPanel({
  matchTitle,
  tournament,
  status,
  startTime,
  matchUrl,
}: MatchReminderPanelProps) {
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);
  const calendarStart = getCalendarStart(startTime);
  const normalizedStatus = normalizeStatus(status);
  const finished = isFinished(status);

  const calendarHref = useMemo(() => {
    if (!calendarStart || finished) return null;

    const end = new Date(calendarStart.getTime() + 2 * 60 * 60 * 1000);
    const body = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Watch Tennis Today//Match Reminder//EN",
      "BEGIN:VEVENT",
      `UID:${matchTitle.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-${calendarStart.getTime()}@watchtennistoday.com`,
      `DTSTAMP:${formatCalendarDate(new Date())}`,
      `DTSTART:${formatCalendarDate(calendarStart)}`,
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
  }, [calendarStart, finished, matchTitle, matchUrl, tournament]);

  function saveLocalReminder() {
    if (!email.trim()) return;

    const reminders = JSON.parse(localStorage.getItem("wtt-match-reminders") || "[]") as unknown[];
    localStorage.setItem(
      "wtt-match-reminders",
      JSON.stringify([
        {
          email: email.trim(),
          matchTitle,
          tournament,
          status,
          startTime,
          matchUrl,
          savedAt: new Date().toISOString(),
        },
        ...reminders,
      ].slice(0, 20))
    );
    setSaved(true);
  }

  const headline = finished
    ? "This match is finished — follow the next tennis matches"
    : normalizedStatus === "LIVE"
      ? "Match is live — keep this page open"
      : "Remind me before this match starts";

  const description = finished
    ? "Use the schedule and player links below to continue to today’s live and upcoming tennis coverage."
    : "Save this match, add it to your calendar, or leave your email for useful tennis alerts without popups or unofficial stream links.";

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
            {calendarStart ? (
              <span className="rounded-full border border-zinc-800 bg-black px-4 py-2">
                Reminder 30 min before
              </span>
            ) : null}
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-black/70 p-4">
          <div className="grid gap-3">
            {calendarHref ? (
              <a
                href={calendarHref}
                download={`${matchTitle.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-reminder.ics`}
                className="rounded-2xl bg-green-500 px-5 py-4 text-center font-black text-black transition hover:bg-green-400"
              >
                Add to calendar
              </a>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-[1fr_auto] lg:grid-cols-1">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Your email"
                className="rounded-2xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-green-400"
              />
              <button
                type="button"
                onClick={saveLocalReminder}
                className="rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-3 font-black text-white transition hover:border-green-500"
              >
                Remind me before this match starts
              </button>
            </div>

            {saved ? (
              <p className="text-sm font-bold text-green-400">
                Saved locally. Connect this CTA to your email provider when you are ready to send real reminders.
              </p>
            ) : (
              <p className="text-xs leading-5 text-zinc-500">
                This is a conversion-ready reminder CTA. It avoids fake notifications and keeps users on match pages longer.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
