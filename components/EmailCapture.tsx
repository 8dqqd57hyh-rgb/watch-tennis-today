"use client";

import { useState } from "react";

type EmailCaptureContextType =
  | "player"
  | "tournament"
  | "daily"
  | "streaming"
  | "watch"
  | "guide"
  | "general";

type EmailCaptureProps = {
  title: string;
  description: string;
  placeholder?: string;
  buttonText?: string;
  contextType: EmailCaptureContextType;
  contextValue: string;
  variant?: "player" | "tournament" | "daily" | "streaming" | "watch" | "guide";
  dark?: boolean;
  compact?: boolean;
};

function getSource(contextType: EmailCaptureContextType) {
  switch (contextType) {
    case "player":
      return "player-alerts";
    case "tournament":
      return "tournament-alerts";
    case "daily":
      return "daily-tennis-alerts";
    case "streaming":
      return "streaming-guide-alerts";
    case "watch":
      return "watch-page-alerts";
    case "guide":
      return "guide-page-alerts";
    default:
      return "general-alerts";
  }
}

export default function EmailCapture({
  title,
  description,
  placeholder = "Your email",
  buttonText = "Notify me",
  contextType,
  contextValue,
  dark = false,
  compact = false,
}: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function subscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (contextType === "player") {
        const response = await fetch("/api/subscribe-player", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: normalizedEmail,
            playerName: contextValue,
            playerSlug: contextValue.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
            source: getSource(contextType),
          }),
        });

        const data = await response.json();
        if (!data.ok) throw new Error("Subscription failed");
        setSuccess(true);
        return;
      }

      const formData = new FormData();
      formData.append("email", normalizedEmail);
      formData.append("source", getSource(contextType));
      formData.append("contextType", contextType);
      formData.append("contextValue", contextValue);
      formData.append("frequency", "only-useful-tennis-updates");

      const response = await fetch("https://formspree.io/f/xeenwwbk", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Subscription failed");
      setSuccess(true);
    } catch (subscriptionError) {
      console.error(subscriptionError);
      setError("Could not save this signup right now. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  const wrapperClass = dark
    ? "border border-zinc-800 bg-zinc-950 text-white"
    : "border border-zinc-200 bg-white text-zinc-950";
  const textClass = dark ? "text-zinc-300" : "text-zinc-600";
  const inputClass = dark
    ? "border-zinc-700 bg-black text-white placeholder:text-zinc-500 focus:border-green-400"
    : "border-zinc-300 bg-white text-zinc-950 placeholder:text-zinc-500 focus:border-green-500";

  return (
    <section className={`${wrapperClass} rounded-[2rem] p-5 shadow-sm md:p-6`}>
      <div className={compact ? "mb-4" : "mb-5"}>
        <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-green-500">
          Optional tennis alerts
        </p>
        <h2 className={compact ? "text-2xl font-black" : "text-2xl font-black md:text-3xl"}>
          {title}
        </h2>
        <p className={`mt-3 max-w-3xl text-sm leading-7 ${textClass}`}>{description}</p>
      </div>

      {success ? (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-800">
          You are signed up for useful tennis updates. No illegal streams, no noisy inbox. 🎾
        </div>
      ) : (
        <form onSubmit={subscribe} className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            required
            placeholder={placeholder}
            className={`${inputClass} rounded-2xl border px-5 py-4 outline-none`}
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-green-500 px-6 py-4 font-black text-black transition-all hover:bg-green-400 disabled:opacity-60"
          >
            {loading ? "Saving..." : buttonText}
          </button>
        </form>
      )}

      {error ? <p className="mt-3 text-sm font-bold text-red-500">{error}</p> : null}
      <p className={`mt-3 text-xs leading-6 ${dark ? "text-zinc-500" : "text-zinc-500"}`}>
        Privacy-friendly signup. Unsubscribe anytime. Watch Tennis Today does not send links to unofficial streams.
      </p>
    </section>
  );
}
