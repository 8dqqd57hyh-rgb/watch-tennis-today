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
            email,
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
    <div className="rounded-2xl border p-6 mt-8">
      <h2 className="text-2xl font-bold mb-3">
        Get notified when {playerName} plays 🎾
      </h2>

      <p className="mb-4 text-gray-600">
        Match alerts, live updates, and results.
      </p>

      {success ? (
        <div>
          Subscription successful 🎉
        </div>
      ) : (
        <div className="flex gap-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="border rounded-lg px-4 py-2 w-full"
          />

          <button
            onClick={subscribe}
            disabled={loading}
            className="bg-black text-white px-5 rounded-lg"
          >
            {loading ? "..." : "Follow"}
          </button>
        </div>
      )}
    </div>
  );
}