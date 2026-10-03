const { getItemLevelsTable } = require('./itemData');

function parseTierAndNum(tier) {
  const colorWord = tier.split(' ')[0].toLowerCase();
  const match = tier.match(/T(\d)/);
  const tierNum = match ? match[1] : '';
  return { colorWord, tierNum };
}

function aliasForLevel(lvl) {
  const { colorWord, tierNum } = parseTierAndNum(lvl.tier);
  return `${colorWord}${tierNum}-${lvl.star}`;
}

let cachedTierIndex = null;

function getTierIndex() {
  if (cachedTierIndex) return cachedTierIndex;

  const levels = getItemLevelsTable('gear');
  const order = [];
  const meta = {};

  for (const lvl of levels) {
    const { colorWord, tierNum } = parseTierAndNum(lvl.tier);
    const tierKey = `${colorWord}${tierNum}`;
    if (!(tierKey in meta)) {
      meta[tierKey] = { maxStar: lvl.star };
      order.push(tierKey);
    } else {
      meta[tierKey].maxStar = Math.max(meta[tierKey].maxStar, lvl.star);
    }
  }

  cachedTierIndex = { order, meta };
  return cachedTierIndex;
}

module.exports = { aliasForLevel, getTierIndex };
