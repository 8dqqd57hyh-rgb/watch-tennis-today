import WimbledonCountryLandingPage from "@/app/components/WimbledonCountryLandingPage";
import { buildWimbledonCountryMetadata } from "@/app/lib/wimbledonCountryGuides";

export const metadata = buildWimbledonCountryMetadata("india");

export default function Page() {
  return <WimbledonCountryLandingPage countrySlug="india" />;
}
