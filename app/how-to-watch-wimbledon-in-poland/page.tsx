import WimbledonCountryLandingPage from "@/app/components/WimbledonCountryLandingPage";
import { buildWimbledonCountryMetadata } from "@/app/lib/wimbledonCountryGuides";

export const metadata = buildWimbledonCountryMetadata("poland");

export default function Page() {
  return <WimbledonCountryLandingPage countrySlug="poland" />;
}
