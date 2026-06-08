import TennisTrendingNowClient from "./TennisTrendingNowClient";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Trending Tennis News & Matches",
  robots: { index: false, follow: true },
  // AdSense quality note: Trending discovery is currently generated from live signals and should not be indexed until it has stronger standalone editorial content.
  description: "Trending tennis players, matches and tournaments updated regularly.",
};

export default function Page() {
  return <TennisTrendingNowClient />;
}
