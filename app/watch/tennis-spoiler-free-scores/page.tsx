import { redirect } from "next/navigation";

export const metadata = {
  title: "Spoiler-Free Tennis Scores | Watch Tennis Today",
  description: "Redirects to the canonical spoiler-free tennis scores guide.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: "https://watchtennistoday.com/tennis-spoiler-free-scores",
  },
};

export default function SpoilerFreeScoresAliasPage() {
  redirect("/tennis-spoiler-free-scores");
}
