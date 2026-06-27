import WimbledonCountryLandingPage from "@/app/components/WimbledonCountryLandingPage";
import { buildWimbledonCountryMetadata } from "@/app/lib/wimbledonCountryGuides";

export const metadata = buildWimbledonCountryMetadata("australia");

export default function Page() {
  return <WimbledonCountryLandingPage countrySlug="australia" />;
}
