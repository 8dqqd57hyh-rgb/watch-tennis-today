import Link from "next/link";

export const metadata = {
  title: "Unsubscribe | Watch Tennis Today",
  robots: { index: false, follow: false },
  referrer: "no-referrer" as const,
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; done?: string; error?: string }>;
}) {
  const params = await searchParams;
  const token = typeof params.token === "string" && params.token.length <= 2048 ? params.token : "";
  const done = params.done === "1";
  const invalid = !token || params.error === "400";

  return (
    <main className="mx-auto min-h-[60vh] max-w-3xl px-6 py-12 text-white">
      <h1 className="mb-5 text-3xl font-black">{done ? "You are unsubscribed" : "Unsubscribe"}</h1>
      {done ? (
        <p className="mb-6 text-zinc-300">This category of tennis emails has been turned off.</p>
      ) : invalid ? (
        <p className="mb-6 text-zinc-300">Invalid unsubscribe link.</p>
      ) : (
        <>
          <p className="mb-6 text-zinc-300">Stop receiving this category of tennis emails?</p>
          {params.error ? (
            <p role="alert" className="mb-6 text-red-300">Could not save your preference. Please try again.</p>
          ) : null}
          <form action="/api/unsubscribe" method="post" className="mb-6">
            <input type="hidden" name="token" value={token} />
            <button type="submit" className="rounded-lg bg-green-500 px-6 py-3 font-bold text-black hover:bg-green-400">
              Unsubscribe
            </button>
          </form>
        </>
      )}
      <Link href="/" className="font-bold text-green-400 hover:text-green-300">
        {done || invalid ? "Back to tennis" : "Keep subscription"}
      </Link>
    </main>
  );
}