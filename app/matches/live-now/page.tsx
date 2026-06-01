import LiveNowClient from "./LiveNowClient";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Live Tennis Matches Now",
  description: "Watch live tennis matches happening now with schedules and match updates.",
};

export default function Page() {
  return <LiveNowClient />;
}
