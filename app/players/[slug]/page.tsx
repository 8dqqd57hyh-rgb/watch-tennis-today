import { notFound, permanentRedirect } from "next/navigation";
import { getCanonicalPlayerSlug } from "@/data/playerSlugs";

export const dynamic = "force-dynamic";

export default async function LegacyPluralPlayerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const canonicalSlug = getCanonicalPlayerSlug(slug);

  if (!canonicalSlug) {
    notFound();
  }

  permanentRedirect(`/player/${canonicalSlug}`);
}
