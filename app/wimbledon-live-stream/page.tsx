import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Wimbledon Live Stream | Watch Tennis Today",
  description: "Redirects to the canonical Wimbledon live guide.",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://watchtennistoday.com/wimbledon-live" },
};

export default function WimbledonLiveStreamRedirectPage() {
  redirect("/wimbledon-live");
}
