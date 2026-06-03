import { redirect } from "next/navigation";

export const metadata = {
  robots: { index: false, follow: true },
};

export default function RemovedLowDataPage() {
  // Roland Garros pulse removed; use the French Open hub.
  redirect("/french-open");
}
