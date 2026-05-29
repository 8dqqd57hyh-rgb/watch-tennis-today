import { redirect } from "next/navigation";

export const metadata = {
  title: "Privacy Policy | Watch Tennis Today",
  description: "Privacy Policy for Watch Tennis Today.",
  alternates: {
    canonical: "https://watchtennistoday.com/privacy",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function PrivacyPolicyRedirectPage() {
  redirect("/privacy");
}
