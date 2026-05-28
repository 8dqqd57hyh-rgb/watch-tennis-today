import TvScheduleClient from "./TvScheduleClient";

export const metadata = {
  title: "Tennis TV Schedule",
  description: "Daily tennis TV schedule with broadcasters and streaming information.",
};

export default function Page() {
  return <TvScheduleClient />;
}
