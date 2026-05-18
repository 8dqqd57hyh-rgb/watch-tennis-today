import FrenchOpenCountryPage from "@/app/components/FrenchOpenCountryPage";

export const metadata = {
  title: "How to Watch French Open in Australia 2026 | TV & Live Stream",
  description:
    "How to watch the French Open in Australia. Find Roland Garros TV channels, Nine, 9Gem and Stan Sport streaming options.",
};

export default function Page() {
  return (
    <FrenchOpenCountryPage
      country="Australia"
      slug="australia"
      broadcasters={["Nine", "9Gem", "Stan Sport"]}
      streaming={["Stan Sport", "9Now"]}
      timezone="AEST / local Australian time"
      note="In Australia, Roland Garros coverage is available through Nine’s broadcast platforms and Stan Sport streaming."
    />
  );
}