type ContentQualityNoticeProps = {
  pageType?: string;
};

export default function ContentQualityNotice({
  pageType = "page",
}: ContentQualityNoticeProps) {
  return (
    <section className="my-8 rounded-3xl border border-sky-500/30 bg-sky-950/30 p-6 text-white">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-sky-300">
        Editorial note
      </p>

      <h2 className="mb-3 text-2xl font-black">
        Informational tennis guide, not a streaming service
      </h2>

      <div className="space-y-4 text-sm leading-7 text-zinc-300">
        <p>
          This {pageType} is written to help tennis fans understand schedules,
          official broadcasters, regional availability and legal viewing routes.
          Watch Tennis Today does not host, embed, restream or provide direct
          access to copyrighted tennis broadcasts.
        </p>

        <p>
          Match times, TV listings and streaming availability can change because
          tennis schedules depend on previous matches, weather, withdrawals and
          local rights agreements. Always confirm final availability with the
          official broadcaster, tournament website or streaming provider.
        </p>
      </div>
    </section>
  );
}
