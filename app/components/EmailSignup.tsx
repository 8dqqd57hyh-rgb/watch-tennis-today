type EmailSignupProps = {
  title?: string;
  description?: string;
  source?: string;
  buttonLabel?: string;
  compact?: boolean;
  dark?: boolean;
  context?: string;
};

export default function EmailSignup({
  title = "Get useful tennis alerts",
  description = "One optional email signup for match schedules, Grand Slam reminders and official viewing updates. No popups, no daily spam.",
  source = "email-signup",
  buttonLabel = "Notify me",
  compact = false,
  dark = true,
  context,
}: EmailSignupProps) {
  const wrapperClass = dark
    ? "border border-zinc-800 bg-zinc-950 text-white"
    : "border border-zinc-200 bg-white text-black";

  const inputClass = dark
    ? "border-zinc-700 bg-black text-white placeholder:text-zinc-500 focus:border-green-400"
    : "border-zinc-300 bg-white text-black placeholder:text-zinc-500 focus:border-green-500";

  return (
    <section className={`${wrapperClass} rounded-[2rem] p-5 md:p-6`}>
      {!compact && (
        <div className="mb-5">
          <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-green-400">
            Optional tennis alerts
          </p>
          <h2 className="mb-3 text-2xl font-black md:text-3xl">{title}</h2>
          <p className={dark ? "max-w-2xl leading-7 text-zinc-400" : "max-w-2xl leading-7 text-zinc-600"}>
            {description}
          </p>
        </div>
      )}

      {compact && (
        <div className="mb-4">
          <h2 className="mb-2 text-2xl font-black">{title}</h2>
          <p className={dark ? "leading-7 text-zinc-400" : "leading-7 text-zinc-600"}>
            {description}
          </p>
        </div>
      )}

      <form
        action="https://formspree.io/f/xeenwwbk"
        method="POST"
        className="grid gap-3 md:grid-cols-[1fr_auto]"
      >
        <input
          type="hidden"
          name="_redirect"
          value="https://watchtennistoday.com/newsletter-confirmation"
        />
        <input type="hidden" name="source" value={source} />
        {context ? <input type="hidden" name="context" value={context} /> : null}
        <input
          type="hidden"
          name="frequency"
          value="only-important-tennis-updates"
        />

        <input
          type="email"
          name="email"
          required
          placeholder="Your email"
          className={`${inputClass} rounded-2xl border px-5 py-4 outline-none`}
        />

        <button
          type="submit"
          className="rounded-2xl bg-green-500 px-6 py-4 font-black text-black transition-all hover:bg-green-400"
        >
          {buttonLabel}
        </button>
      </form>

      <p className={dark ? "mt-3 text-sm text-zinc-500" : "mt-3 text-sm text-zinc-500"}>
        No popups, no auto-subscribe, no illegal streams. Unsubscribe anytime.
      </p>
    </section>
  );
}
