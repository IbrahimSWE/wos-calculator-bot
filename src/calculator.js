function calculateUpgrade(levelsTable, currentIndex, targetIndex, reductionPercent = 0, extraFields = []) {
  const rangeLevels = levelsTable.slice(currentIndex + 1, targetIndex + 1);

  const totalCost = {};
  let totalTimeSeconds = 0;
  let totalPower = 0;
  let powerIncomplete = false;
  const extraTotals = {};
  for (const field of extraFields) extraTotals[field] = 0;

  for (const lvl of rangeLevels) {
    for (const [resource, amount] of Object.entries(lvl.cost ?? {})) {
      totalCost[resource] = (totalCost[resource] ?? 0) + amount;
    }
    totalTimeSeconds += lvl.time_seconds ?? 0;
    if (lvl.power === null || lvl.power === undefined) {
      powerIncomplete = true;
    } else {
      totalPower += lvl.power;
    }
    for (const field of extraFields) {
      extraTotals[field] += lvl[field] ?? 0;
    }
  }

  const reducedTimeSeconds = totalTimeSeconds / (1 + reductionPercent / 100);

  return { totalCost, totalTimeSeconds, reducedTimeSeconds, totalPower, powerIncomplete, extraTotals };
}

module.exports = { calculateUpgrade };
