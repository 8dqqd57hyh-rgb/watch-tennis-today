import FrenchOpenCountryPage from "@/app/components/FrenchOpenCountryPage";

export const metadata = {
  title: "How to Watch French Open in USA 2026 | TV & Live Stream",
  description:
    "How to watch the French Open in the USA. Find Roland Garros TV channels, streaming options, TNT Sports coverage, truTV and HBO Max details.",
};

export default function Page() {
  return (
    <FrenchOpenCountryPage
      country="the USA"
      slug="usa"
      broadcasters={["TNT", "truTV", "TBS", "HBO Max"]}
      streaming={["HBO Max", "TNT Sports app", "Live TV streaming services with TNT/truTV"]}
      timezone="Eastern Time / Pacific Time"
      note="In the United States, French Open coverage is centered around Warner Bros. Discovery platforms, including TNT, truTV and HBO Max."
    />
  );
}