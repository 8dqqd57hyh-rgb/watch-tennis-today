import { redirect } from "next/navigation";

export const metadata = {
  robots: { index: false, follow: true },
};

export default function RemovedLowDataPage() {
  // Roland Garros predictions removed; use the live French Open today hub.
  redirect("/french-open");
}
