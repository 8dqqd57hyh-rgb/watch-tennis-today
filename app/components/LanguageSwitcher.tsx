"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getEquivalentPath, getLocaleFromPath } from "@/app/lib/i18n";

export default function LanguageSwitcher() {
  const pathname = usePathname() || "/";
  const locale = getLocaleFromPath(pathname);
  const englishHref = getEquivalentPath(pathname, "en");
  const polishHref = getEquivalentPath(pathname, "pl");

  return (
    <nav aria-label="Language switcher" className="language-switcher flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-950 p-1 text-xs font-black">
      <Link
        href={englishHref}
        hrefLang="en"
        aria-current={locale === "en" ? "page" : undefined}
        className={`rounded-full px-3 py-1.5 ${
          locale === "en" ? "bg-white text-black" : "text-zinc-300 hover:text-white"
        }`}
      >
        English
      </Link>
      <Link
        href={polishHref}
        hrefLang="pl"
        aria-current={locale === "pl" ? "page" : undefined}
        className={`rounded-full px-3 py-1.5 ${
          locale === "pl" ? "bg-white text-black" : "text-zinc-300 hover:text-white"
        }`}
      >
        Polski
      </Link>
    </nav>
  );
}
