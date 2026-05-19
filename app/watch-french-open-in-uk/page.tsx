import FrenchOpenCountryPage from "@/app/components/FrenchOpenCountryPage";

export const metadata = {
  title: "How to Watch French Open in UK 2026 | TV & Live Stream",
  description:
    "How to watch the French Open in the UK. Find Roland Garros TV channels, TNT Sports, discovery+ and HBO Max streaming options.",
};

export default function Page() {
  return (
    <FrenchOpenCountryPage
      country="the UK"
      slug="uk"
      broadcasters={["TNT Sports", "Eurosport coverage via TNT Sports", "HBO Max"]}
      streaming={["discovery+", "HBO Max", "TNT Sports app"]}
      timezone="UK time"
      note="In the UK, Roland Garros coverage is available through TNT Sports and associated streaming platforms."
    />
  );
}
