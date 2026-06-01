import TomorrowClient from "./TomorrowClient";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Tennis Matches Tomorrow: Schedule, Start Times & TV Guide",
  description:
    "See tomorrow's tennis matches, start times, tournaments and legal streaming options for ATP, WTA, Challenger and Grand Slam tennis.",
};

export default function Page() {
  return <TomorrowClient />;
}
