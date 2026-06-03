import { redirect } from "next/navigation";

export const metadata = {
  robots: { index: false, follow: true },
};

export default function RemovedLowDataPage() {
  // Upset tracker removed; use verified French Open results.
  redirect("/french-open-results");
}
