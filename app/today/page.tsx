import TodayClient from "./TodayClient";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Today's Tennis Matches & Schedule",
  description: "Live tennis matches, schedules, TV listings and streaming availability for today.",
};

export default function Page() {
  return <TodayClient />;
}
