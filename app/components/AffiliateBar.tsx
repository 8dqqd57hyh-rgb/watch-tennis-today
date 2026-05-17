import { affiliateLinks } from "@/app/lib/affiliateLinks";

export default function StickyAffiliateBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-emerald-500/30 bg-black/95 p-3 md:hidden">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-emerald-300">
            Streaming tip
          </p>
          <p className="text-xs text-zinc-400">
            Watching tennis while traveling?
          </p>
        </div>

        <a
          href={affiliateLinks.nordvpn}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          className="shrink-0 rounded-full bg-emerald-400 px-4 py-2 text-xs font-black text-black hover:bg-emerald-300"
        >
          Try NordVPN
        </a>
      </div>
    </div>
  );
}