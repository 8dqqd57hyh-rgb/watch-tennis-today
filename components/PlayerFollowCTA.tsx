"use client";

import { FormEvent, useState } from "react";

type PlayerFollowCTAProps = {
  playerName?: string;
  playerSlug?: string;
  tournamentName?: string;
  source?: string;
};

export default function PlayerFollowCTA({ playerName, playerSlug, tournamentName, source = "revenue-cta" }: PlayerFollowCTAProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const canUsePlayerApi = Boolean(playerSlug || playerName);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(canUsePlayerApi ? "/api/subscribe-player" : "/api/subscribe-finals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, playerSlug, playerName, tournamentName, source }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.ok === false) throw new Error(data.message || "Subscription failed");
      setStatus("success");
      setMessage(canUsePlayerApi ? "You are subscribed to player match alerts." : "You are subscribed to tournament/finals alerts.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not subscribe right now.");
    }
  }

  return (
    <section className="rounded-3xl border border-green-200 bg-green-50 p-6 shadow-sm">
      <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-green-700">Match alerts</p>
      <h2 className="text-2xl font-black text-zinc-950">Get notified before this player’s next match</h2>
      <p className="mt-3 text-sm leading-7 text-zinc-700">
        {playerName
          ? `Follow ${playerName} and get an email when match information is available.`
          : `Follow ${tournamentName || "this tournament"} updates without relying on unsafe stream links.`}
      </p>
      <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor={`follow-email-${playerSlug || tournamentName || "tennis"}`}>Email address</label>
        <input
          id={`follow-email-${playerSlug || tournamentName || "tennis"}`}
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="min-h-12 flex-1 rounded-2xl border border-zinc-300 bg-white px-4 text-zinc-950 outline-none focus:border-green-600"
        />
        <button type="submit" disabled={status === "loading"} className="rounded-2xl bg-green-600 px-6 py-3 font-black text-white hover:bg-green-700 disabled:opacity-60">
          {status === "loading" ? "Subscribing…" : "Notify me"}
        </button>
      </form>
      <p className="mt-3 text-xs leading-6 text-zinc-500">No spam. We use your email only for tennis alerts and site updates you requested.</p>
      {message ? <p className={`mt-3 text-sm font-bold ${status === "error" ? "text-red-700" : "text-green-800"}`}>{message}</p> : null}
    </section>
  );
}
