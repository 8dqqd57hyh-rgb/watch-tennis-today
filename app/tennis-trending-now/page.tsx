import TennisTrendingNowClient from "./TennisTrendingNowClient";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Trending Tennis News & Matches",
  description: "Trending tennis players, matches and tournaments updated regularly.",
};

export default function Page() {
  return <TennisTrendingNowClient />;
}
