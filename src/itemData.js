const fs = require('node:fs');
const path = require('node:path');

const dataCache = new Map();

function loadJson(file) {
  if (!dataCache.has(file)) {
    const filePath = path.join(__dirname, '..', 'data', file);
    dataCache.set(file, JSON.parse(fs.readFileSync(filePath, 'utf8')));
  }
  return dataCache.get(file);
}

const ITEM_FILES = {
  charms: 'chief_charms.json',
  gear: 'chief_gear.json',
};

function getItemLevelsTable(system) {
  const data = loadJson(ITEM_FILES[system]);
  return data.levels.map((lvl) => ({ ...lvl, level: String(lvl.level) }));
}

function getItemResourcesOrder(system) {
  return loadJson(ITEM_FILES[system]).resources_order ?? [];
}

module.exports = { getItemLevelsTable, getItemResourcesOrder };
