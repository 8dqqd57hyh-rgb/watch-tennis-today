"use client";

import { useState } from "react";

export default function PlayerSubscribeBox({
  playerName,
  playerSlug,
}: {
  playerName: string;
  playerSlug: string;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function subscribe() {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail.includes("@")) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/subscribe-player",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: normalizedEmail,
            playerName,
            playerSlug,
            source: "player-page",
          }),
        }
      );

      const data = await response.json();

      if (data.ok) {
        setSuccess(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6">
      <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-green-600">
        Optional player alerts
      </p>
      <h2 className="mb-3 text-2xl font-black">
        Follow {playerName} without inbox noise 🎾
      </h2>

      <p className="mb-4 leading-7 text-zinc-600">
        Get only useful updates: next match, live status or result. No popup, no auto-subscribe and no unrelated offers.
      </p>

      {success ? (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 font-bold text-green-800">
          Subscription successful 🎉 You will receive only relevant {playerName} updates.
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="w-full rounded-2xl border border-zinc-300 px-4 py-3 outline-none focus:border-green-500"
          />

          <button
            onClick={subscribe}
            disabled={loading}
            className="rounded-2xl bg-black px-5 py-3 font-black text-white disabled:opacity-60"
          >
            {loading ? "..." : "Follow"}
          </button>
        </div>
      )}

      <p className="mt-3 text-sm text-zinc-500">
        Optional signup. Unsubscribe anytime.
      </p>
    </div>
  );
}