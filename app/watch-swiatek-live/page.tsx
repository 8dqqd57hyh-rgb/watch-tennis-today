import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Watch Iga Swiatek Live | Watch Tennis Today",
  description:
    "Find Iga Swiatek live matches, schedules and legal tennis streaming information.",
  alternates: {
    canonical: "https://watchtennistoday.com/watch-player-live/iga-swiatek",
  },
};

export default function WatchSwiatekLivePage() {
  redirect("/watch-player-live/iga-swiatek");
}
