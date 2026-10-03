const IDLE_TIMEOUT_MS = 5 * 60 * 1000;

const plans = new Map();

function getEntry(userId) {
  const entry = plans.get(userId);
  if (!entry) return null;

  if (Date.now() - entry.lastActivity > IDLE_TIMEOUT_MS) {
    plans.delete(userId);
    return null;
  }

  return entry;
}

function getPlanItems(userId) {
  return getEntry(userId)?.items ?? [];
}

function addBuildingToPlan(userId, item) {
  const entry = getEntry(userId) ?? { items: [], lastBuildPhase: null };
  entry.items.push(item);
  entry.lastActivity = Date.now();
  if (item.system === 'build') {
    entry.lastBuildPhase = item.phase;
  }
  plans.set(userId, entry);
}

function getLastBuildPhase(userId) {
  return getEntry(userId)?.lastBuildPhase ?? null;
}

function clearPlan(userId) {
  plans.delete(userId);
}

module.exports = { getPlanItems, addBuildingToPlan, clearPlan, getLastBuildPhase };
