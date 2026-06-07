import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Tennis Schedule Tomorrow | Watch Tennis Today",
  description: "Redirects to the canonical tomorrow tennis schedule page.",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://watchtennistoday.com/tomorrow" },
};

export default function TennisScheduleTomorrowRedirectPage() {
  redirect("/tomorrow");
}
