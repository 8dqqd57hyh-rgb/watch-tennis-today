function normalizeSearchName(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function isInitialToken(value: string) {
  return /^[a-z]$/.test(value.replace(/\./g, ""));
}

export function normalizePlayerIdentity(value?: string | null) {
  return normalizeSearchName(String(value || ""));
}

export function playerNamesMatch(targetName: string, candidateName: string) {
  const targetParts = normalizeSearchName(targetName).split(/\s+/).filter(Boolean);
  const candidateParts = normalizeSearchName(candidateName).split(/\s+/).filter(Boolean);
  const targetFirst = targetParts[0] || "";
  const targetLast = targetParts.at(-1) || "";
  const candidateFirst = candidateParts[0] || "";
  const candidateLast = candidateParts.at(-1) || "";

  if (!targetLast || !candidateParts.length) return false;
  if (targetParts.join(" ") === candidateParts.join(" ")) return true;

  if (targetLast === candidateLast) {
    return !targetFirst || !candidateFirst || targetFirst[0] === candidateFirst[0];
  }

  // Provider records may reverse the order: "Rublev A." or "Rublev Andrey".
  if (candidateFirst === targetLast && candidateLast && targetFirst) {
    return candidateLast === targetFirst ||
      (isInitialToken(candidateLast) && candidateLast[0] === targetFirst[0]);
  }

  return false;
}

export function playerIdentityMatches(targetName: string, candidateName: string) {
  if (/[\/&+]/.test(candidateName)) {
    return candidateName
      .split(/[\/&+]/)
      .some((side) => playerNamesMatch(targetName, side));
  }

  return playerNamesMatch(targetName, candidateName);
}