import { redirect } from "next/navigation";

export const metadata = {
  robots: { index: false, follow: true },
};

export default function RemovedLowDataPage() {
  // Draw tracker removed; use French Open schedule.
  redirect("/french-open-order-of-play");
}
