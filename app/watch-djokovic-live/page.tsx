import WatchPlayerLivePage, {
  generateMetadata as generatePlayerMetadata,
} from "../watch-player-live/[slug]/page";

export async function generateMetadata() {
  return generatePlayerMetadata({
    params: Promise.resolve({
      slug: "novak-djokovic",
    }),
  });
}

export default function WatchDjokovicLivePage() {
  return WatchPlayerLivePage({
    params: Promise.resolve({
      slug: "novak-djokovic",
    }),
  });
}
