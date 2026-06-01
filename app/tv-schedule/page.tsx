import TvScheduleClient from "./TvScheduleClient";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Tennis TV Schedule",
  description: "Daily tennis TV schedule with broadcasters and streaming information.",
};

export default function Page() {
  return <TvScheduleClient />;
}
