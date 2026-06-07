import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Watch French Open in the UK | Watch Tennis Today",
  description:
    "Find legal French Open viewing options in the UK, including official broadcaster and streaming information.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: "https://watchtennistoday.com/where-to-watch-french-open",
  },
};

export default function WatchFrenchOpenInUkPage() {
  redirect("/where-to-watch-french-open#uk");
}
