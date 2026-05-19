export default function AuthorBox() {
  return (
    <section className="mt-12 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
      <p className="text-sm font-bold text-green-400 mb-2">
        Editorial information
      </p>

      <p className="text-zinc-300 leading-7">
        Written and updated by{" "}
        <a
          href="/authors/watch-tennis-today"
          className="font-bold text-white hover:text-green-400"
        >
          Watch Tennis Today Editorial Team
        </a>
        . We help tennis fans find live match schedules, official streaming
        options and TV coverage.
      </p>
    </section>
  );
}
