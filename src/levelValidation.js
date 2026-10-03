function normalize(value) {
  return String(value).trim().toLowerCase();
}

function findLevelIndex(levelsTable, input, aliasFn) {
  const normalized = normalize(input);
  return levelsTable.findIndex((lvl) => {
    if (normalize(lvl.level) === normalized) return true;
    if (aliasFn) {
      const alias = aliasFn(lvl);
      if (alias && normalize(alias) === normalized) return true;
    }
    return false;
  });
}

function validateInputs(levelsTable, currentRaw, targetRaw, reductionRaw, options = {}) {
  const { aliasFn = null, hasReduction = true } = options;
  const availableList = levelsTable.map((lvl) => (aliasFn ? aliasFn(lvl) : lvl.level)).join(', ');

  const currentIndex = findLevelIndex(levelsTable, currentRaw, aliasFn);
  if (currentIndex === -1) {
    return {
      ok: false,
      errorKey: 'error_invalid_current_level',
      vars: { value: currentRaw.trim(), available: availableList },
    };
  }

  const targetIndex = findLevelIndex(levelsTable, targetRaw, aliasFn);
  if (targetIndex === -1) {
    return {
      ok: false,
      errorKey: 'error_invalid_target_level',
      vars: { value: targetRaw.trim(), available: availableList },
    };
  }

  if (targetIndex <= currentIndex) {
    return { ok: false, errorKey: 'error_target_not_greater', vars: {} };
  }

  if (!hasReduction) {
    return { ok: true, currentIndex, targetIndex, reduction: 0 };
  }

  const reductionTrimmed = reductionRaw.trim();
  const reduction = reductionTrimmed === '' ? 0 : Number(reductionTrimmed);
  if (Number.isNaN(reduction) || reduction < 0) {
    return { ok: false, errorKey: 'error_negative_reduction', vars: {} };
  }

  return { ok: true, currentIndex, targetIndex, reduction };
}

module.exports = { findLevelIndex, validateInputs };
