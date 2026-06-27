import WimbledonCountryLandingPage from "@/app/components/WimbledonCountryLandingPage";
import { buildWimbledonCountryMetadata } from "@/app/lib/wimbledonCountryGuides";

export const metadata = buildWimbledonCountryMetadata("spain");

export default function Page() {
  return <WimbledonCountryLandingPage countrySlug="spain" />;
}
