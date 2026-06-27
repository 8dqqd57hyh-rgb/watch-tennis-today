import WimbledonCountryLandingPage from "@/app/components/WimbledonCountryLandingPage";
import { buildWimbledonCountryMetadata } from "@/app/lib/wimbledonCountryGuides";

export const metadata = buildWimbledonCountryMetadata("italy");

export default function Page() {
  return <WimbledonCountryLandingPage countrySlug="italy" />;
}
