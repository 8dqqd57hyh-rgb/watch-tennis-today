import TvScheduleClient from "./TvScheduleClient";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Tennis TV Schedule",
  robots: { index: false, follow: true },
  // AdSense quality note: TV schedule is currently dynamic/client-led and should not be indexed until it has a full static country/provider guide.
  description: "Daily tennis TV schedule with broadcasters and streaming information.",
};

export default function Page() {
  return <TvScheduleClient />;
}
