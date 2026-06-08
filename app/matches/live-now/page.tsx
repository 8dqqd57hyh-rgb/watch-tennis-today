import LiveNowClient from "./LiveNowClient";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Live Tennis Matches Now",
  robots: { index: false, follow: true },
  // AdSense quality note: Live-now listings are volatile API pages and should not be indexed as evergreen AdSense landing pages.
  description: "Watch live tennis matches happening now with schedules and match updates.",
};

export default function Page() {
  return <LiveNowClient />;
}
