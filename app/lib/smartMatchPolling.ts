export type PollableMatch = {
  status?: string | null;
  matchStatus?: string | null;
  state?: string | null;
};

const LIVE_POLL_MS = 30_000;
const IDLE_POLL_MS = 5 * 60_000;

function normalizeStatus(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

export function isLiveLikeMatch(match: PollableMatch) {
  const status = normalizeStatus(match.status ?? match.matchStatus ?? match.state);

  if (!status) return false;

  if (
    status.includes("finished") ||
    status.includes("completed") ||
    status.includes("ended") ||
    status.includes("final") ||
    status.includes("retired") ||
    status.includes("walkover") ||
    status.includes("cancelled") ||
    status.includes("canceled") ||
    status.includes("postponed") ||
    status.includes("not started") ||
    status.includes("scheduled") ||
    status.includes("upcoming")
  ) {
    return false;
  }

  return (
    status.includes("live") ||
    status.includes("in progress") ||
    status.includes("progress") ||
    status.includes("playing") ||
    status.includes("set") ||
    status.includes("game")
  );
}

export function getSmartMatchesPollingDelay(matches: PollableMatch[]) {
  return matches.some(isLiveLikeMatch) ? LIVE_POLL_MS : IDLE_POLL_MS;
}

type SmartPollingOptions = {
  load: () => Promise<PollableMatch[]>;
  onError?: (error: unknown) => void;
};

export function startSmartMatchPolling({ load, onError }: SmartPollingOptions) {
  let active = true;
  let timeoutId: number | null = null;

  function clearTimer() {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
  }

  function schedule(matches: PollableMatch[] = []) {
    if (!active) return;

    clearTimer();

    if (document.hidden) return;

    timeoutId = window.setTimeout(run, getSmartMatchesPollingDelay(matches));
  }

  async function run() {
    if (!active || document.hidden) return;

    try {
      const matches = await load();
      schedule(matches);
    } catch (error) {
      onError?.(error);
      schedule([]);
    }
  }

  function handleVisibilityChange() {
    if (document.hidden) {
      clearTimer();
      return;
    }

    void run();
  }

  document.addEventListener("visibilitychange", handleVisibilityChange);
  void run();

  return () => {
    active = false;
    clearTimer();
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}
