import { affiliateLinks } from "@/app/lib/affiliateLinks";

type VpnPromoProps = {
  title?: string;
  text?: string;
};

export default function VpnPromo({
  title = "Watching tennis while traveling?",
  text = "Some tennis streams may be geo-blocked depending on your location. A VPN can help you access your usual streaming services safely when abroad.",
}: VpnPromoProps) {
  return (
    <section className="my-8 rounded-3xl border border-emerald-500/30 bg-emerald-950/30 p-6">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-emerald-300">
        Streaming tip
      </p>

      <h2 className="mb-3 text-2xl font-bold text-white">
        {title}
      </h2>

      <p className="mb-5 text-zinc-300">
        {text}
      </p>

      <a
        href={affiliateLinks.nordvpn}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        className="inline-flex rounded-full bg-emerald-400 px-5 py-3 text-sm font-bold text-black hover:bg-emerald-300"
      >
        Try NordVPN for tennis streaming
      </a>

      <p className="mt-3 text-xs text-zinc-500">
        Affiliate disclosure: we may earn a commission if you buy through this link.
      </p>
    </section>
  );
}