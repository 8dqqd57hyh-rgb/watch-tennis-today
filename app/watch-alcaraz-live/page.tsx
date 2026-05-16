import WatchPlayerLivePage, {
  generateMetadata as generatePlayerMetadata,
} from "../watch-player-live/[slug]/page";

export async function generateMetadata() {
  return generatePlayerMetadata({
    params: Promise.resolve({
      slug: "carlos-alcaraz",
    }),
  });
}

export default function WatchAlcarazLivePage() {
  return WatchPlayerLivePage({
    params: Promise.resolve({
      slug: "carlos-alcaraz",
    }),
  });
}