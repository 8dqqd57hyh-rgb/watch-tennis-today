export type MatchLifecycleState = "scheduled" | "live" | "finished" | "cancelled" | "unknown";

export type MatchLifecycleInput = {
  status?: string | null;
  startTime?: string | null;
  score?: string | null;
};

export type MatchLifecycle = {
  state: MatchLifecycleState;
  statusText: string;
  countdownText: string | null;
  hasReliableStartTime: boolean;
  hasReliableScore: boolean;
  scoreText: string | null;
};

function normalizeStatus(status?: string | null) {
  return String(status || "").trim().toUpperCase();
}

function parseStartTime(startTime?: string | null) {
  if (!startTime) return null;

  const date = new Date(startTime);
  if (Number.isNaN(date.getTime())) return null;

  return date;
}

function isScheduledStatus(status: string) {
  return ["UPCOMING", "SCHEDULED", "NOTSTARTED", "NOT_STARTED", "NOT STARTED"].includes(status);
}

function isFinishedStatus(status: string) {
  return ["FINISHED", "COMPLETED", "RETIRED", "WALKOVER"].includes(status);
}

function isCancelledStatus(status: string) {
  return ["CANCELLED", "CANCELED", "POSTPONED"].includes(status);
}

export function hasReliableMatchScore(score?: string | null) {
  const value = String(score || "").trim();
  const normalized = value.toLowerCase();

  return Boolean(
    value &&
      value !== "-" &&
      value !== "0-0" &&
      normalized !== "score unavailable" &&
      normalized !== "final score unavailable" &&
      normalized !== "not started" &&
      normalized !== "live score pending"
  );
}

export function getMatchCountdownText(startTime?: string | null, now = new Date()) {
  const start = parseStartTime(startTime);
  if (!start) return null;

  const diffMs = start.getTime() - now.getTime();
  if (diffMs <= 0) return null;

  const minutes = Math.ceil(diffMs / 60000);
  if (minutes < 60) return `Starts in ${minutes} minute${minutes === 1 ? "" : "s"}`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours < 24) {
    return remainingMinutes > 0
      ? `Starts in ${hours} hour${hours === 1 ? "" : "s"} ${remainingMinutes} minute${remainingMinutes === 1 ? "" : "s"}`
      : `Starts in ${hours} hour${hours === 1 ? "" : "s"}`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return remainingHours > 0
    ? `Starts in ${days} day${days === 1 ? "" : "s"} ${remainingHours} hour${remainingHours === 1 ? "" : "s"}`
    : `Starts in ${days} day${days === 1 ? "" : "s"}`;
}

export function getMatchLifecycle(input: MatchLifecycleInput, now = new Date()): MatchLifecycle {
  const status = normalizeStatus(input.status);
  const start = parseStartTime(input.startTime);
  const scoreText = hasReliableMatchScore(input.score) ? String(input.score).trim() : null;

  if (status === "LIVE") {
    return {
      state: "live",
      statusText: "Live now",
      countdownText: null,
      hasReliableStartTime: Boolean(start),
      hasReliableScore: Boolean(scoreText),
      scoreText,
    };
  }

  if (isCancelledStatus(status)) {
    return {
      state: "cancelled",
      statusText: "Match cancelled",
      countdownText: null,
      hasReliableStartTime: Boolean(start),
      hasReliableScore: Boolean(scoreText),
      scoreText,
    };
  }

  if (isFinishedStatus(status)) {
    return {
      state: "finished",
      statusText: "Match finished",
      countdownText: null,
      hasReliableStartTime: Boolean(start),
      hasReliableScore: Boolean(scoreText),
      scoreText,
    };
  }

  if (isScheduledStatus(status) || (start && start.getTime() > now.getTime())) {
    return {
      state: "scheduled",
      statusText: "Scheduled",
      countdownText: getMatchCountdownText(input.startTime, now),
      hasReliableStartTime: Boolean(start),
      hasReliableScore: Boolean(scoreText),
      scoreText,
    };
  }

  return {
    state: "unknown",
    statusText: "Status unknown",
    countdownText: null,
    hasReliableStartTime: Boolean(start),
    hasReliableScore: Boolean(scoreText),
    scoreText,
  };
}
