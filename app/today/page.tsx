import TodayClient from "./TodayClient";
import EmailCapture from "@/components/EmailCapture";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import RelatedPages from "@/app/components/RelatedPages";
import Link from "next/link";
import { getServerMatchesWindow } from "@/app/lib/serverMatches";

export const metadata = {
  title: "ATP & WTA Matches Today | Live Schedule and Results",
  description:
    "Follow today's ATP and WTA matches with live, upcoming and completed sections, sorted by current status and match importance.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://watchtennistoday.com/today",
    languages: {
      en: "https://watchtennistoday.com/today",
      pl: "https://watchtennistoday.com/pl/dzisiaj",
      "x-default": "https://watchtennistoday.com/today",
    },
  },
};

export default async function Page() {
  const initialMatches = await getServerMatchesWindow({
    revalidateSeconds: 60,
    includeFinished: true,
    daysBack: 0,
    daysForward: 1,
    timeoutMs: 8000,
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <nav className="mb-4 flex gap-2 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-emerald-700">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <span className="font-semibold text-slate-900">Tennis today</span>
      </nav>

      <header className="mb-5">
        <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">
          ATP &amp; WTA live schedule
        </p>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
          ATP &amp; WTA matches today
        </h1>
        <p className="mt-2 text-slate-600">
          Main-tour matches only: live first, then the most important upcoming fixtures and latest results.
        </p>
      </header>

      <TodayClient initialMatches={initialMatches} />

      <RelatedPages
        className="mt-10"
        variant="light"
        currentPath="/today"
        eyebrow="Useful next steps"
        title="More tennis coverage"
        description="Check live status, player context or official broadcaster routes."
        links={[
          {
            href: "/atp-live-today",
            label: "ATP matches today",
            eyebrow: "ATP Tour",
            description: "Open the dedicated ATP live schedule.",
          },
          {
            href: "/wta-live-today",
            label: "WTA matches today",
            eyebrow: "WTA Tour",
            description: "Open the dedicated WTA live schedule.",
          },
          {
            href: "/live-tennis",
            label: "Live tennis matches",
            eyebrow: "Live hub",
            description: "Follow all active and starting-soon matches.",
          },
          {
            href: "/tennis-tv-broadcast-finder",
            label: "Tennis broadcaster finder",
            eyebrow: "Country rights",
            description: "Verify legal broadcaster routes by country and event.",
          },
        ]}
      />

      <div className="mt-8">
        <EmailCapture
          title="Get useful tennis alerts"
          description="Low-noise updates for important matches and schedule changes."
          placeholder="Email for tennis alerts"
          buttonText="Get alerts"
          contextType="daily"
          contextValue="today-page"
        />
      </div>

      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://watchtennistoday.com" },
          { name: "Tennis Today", url: "https://watchtennistoday.com/today" },
        ]}
      />
    </main>
  );
}
