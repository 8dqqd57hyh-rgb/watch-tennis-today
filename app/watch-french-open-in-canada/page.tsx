import FrenchOpenCountryPage from "@/app/components/FrenchOpenCountryPage";

export const metadata = {
  title: "How to Watch French Open in Canada 2026 | TV & Live Stream",
  description:
    "How to watch the French Open in Canada. Find Roland Garros TV channels, TSN, RDS and streaming options.",
};

export default function Page() {
  return (
    <FrenchOpenCountryPage
      country="Canada"
      slug="canada"
      broadcasters={["TSN", "RDS"]}
      streaming={["TSN+", "TSN app", "RDS app"]}
      timezone="Eastern Time / local Canadian time"
      note="In Canada, French Open coverage is generally available through TSN in English and RDS in French."
    />
  );
}