export const MAX_BULK_PLAYER_NAMES = 40;

export function normalizeBulkPlayerNames(values: string[]) {
  return Array.from(
    new Set(
      values
        .map((name) => name.trim())
        .filter(Boolean)
    )
  ).slice(0, MAX_BULK_PLAYER_NAMES);
}

export function parseBulkPlayerNames(value: string | null) {
  return normalizeBulkPlayerNames(value ? value.split(",") : []);
}

type BulkPlayerParameterInput = {
  hasPlayerNamesParameter: boolean;
  playerName: string | null;
  playerNames: string | null;
};

export function getBulkPlayerParameterState(input: BulkPlayerParameterInput) {
  const names = parseBulkPlayerNames(input.playerNames);

  if (input.hasPlayerNamesParameter && names.length === 0) {
    return { kind: "empty" as const, names };
  }

  if (input.playerName && names.length > 0) {
    return { kind: "invalid" as const, names };
  }

  return {
    kind: names.length > 0 ? ("bulk" as const) : ("normal" as const),
    names,
  };
}

type MatchesRequestPlanInput = {
  playerNames: string | null;
  playerName: string | null;
  playerKey: string | null;
  matchId: string | null;
  formHistory: boolean;
  includeFinished: boolean;
  daysBack: number;
  daysForward: number;
};

export function getMatchesRequestPlan(input: MatchesRequestPlanInput) {
  const bulkPlayerNames = parseBulkPlayerNames(input.playerNames);
  const hasBulkPlayers = bulkPlayerNames.length > 0;
  const isPlayerScopedRequest = Boolean(
    input.playerName || input.playerKey || input.formHistory || hasBulkPlayers
  );
  const maxDaysBack = input.matchId ? 7 : isPlayerScopedRequest ? 30 : 3;
  const maxDaysForward = input.matchId ? 7 : isPlayerScopedRequest ? 30 : 3;
  const defaultDaysBack = input.matchId ? 1 : 3;
  const defaultDaysForward = input.matchId ? 7 : isPlayerScopedRequest ? 30 : 3;
  const safeDaysBack = Number.isFinite(input.daysBack)
    ? Math.min(Math.max(input.daysBack, 0), maxDaysBack)
    : defaultDaysBack;
  const safeDaysForward = Number.isFinite(input.daysForward)
    ? Math.min(Math.max(input.daysForward, 1), maxDaysForward)
    : defaultDaysForward;
  const fixtureWindowDays = input.formHistory && input.playerKey
    ? 30
    : input.formHistory
      ? 21
      : 28;
  const fixtureWindowCount = Math.ceil(
    (safeDaysBack + safeDaysForward + 1) / fixtureWindowDays
  );

  return {
    bulkPlayerNames,
    hasBulkPlayers,
    isPlayerScopedRequest,
    safeDaysBack,
    safeDaysForward,
    fixtureWindowDays,
    fixtureWindowCount,
    getPlayersCallCount: input.playerName ? 2 : 0,
    liveScoreCallCount: 1,
    archiveSelectCount: input.includeFinished && hasBulkPlayers ? 1 : 0,
    archiveUpsertCount: safeDaysBack <= 7 ? 1 : 0,
    usesGlobalArchiveFallback: !input.playerName && !input.playerKey && !hasBulkPlayers,
  };
}
