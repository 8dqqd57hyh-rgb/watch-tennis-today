export const metadata = {
  title: "Disclaimer | Watch Tennis Today",
  description:
    "Disclaimer for Watch Tennis Today — tennis schedules, broadcaster information and external links.",
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black mb-6">
          Disclaimer
        </h1>

        <div className="space-y-5 text-zinc-300 leading-relaxed">
          <p>
            Watch Tennis Today provides tennis schedules, match information,
            broadcaster references and links to official or external streaming
            sources.
          </p>

          <p>
            We do not host, embed or stream tennis matches directly. All
            streaming availability depends on official broadcasters, regional
            rights and third-party platforms.
          </p>

          <p>
            Match schedules, scores and broadcaster information may change. We
            try to keep information useful and current, but we cannot guarantee
            that every listing is complete or available in every country.
          </p>

          <p>
            External websites linked from Watch Tennis Today are operated by
            third parties. We are not responsible for their content, pricing,
            availability or terms of use.
          </p>

          <p>
            In the future, some links may be affiliate links. If you click or
            purchase through those links, we may earn a commission at no
            additional cost to you.
          </p>
        </div>
      </div>
    </main>
  );
}
