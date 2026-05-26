"use client";

import CookieConsent from "react-cookie-consent";

export default function CookieBanner() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      declineButtonText="Decline"
      enableDeclineButton
      cookieName="watchtennistoday-cookie-consent"
      style={{ background: "#18181b", color: "#fff" }}
      buttonStyle={{
        background: "#22c55e",
        color: "#000",
        fontWeight: "bold",
        borderRadius: "12px",
      }}
      declineButtonStyle={{
        background: "#3f3f46",
        color: "#fff",
        borderRadius: "12px",
      }}
    >
      We use cookies and analytics to improve your experience on Watch Tennis Today.
    </CookieConsent>
  );
}