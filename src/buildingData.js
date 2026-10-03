const fs = require('node:fs');
const path = require('node:path');
const { getBuilding } = require('./buildingsRegistry');

const GLOBAL_RESOURCE_ORDER = ['wood', 'coal', 'iron', 'food', 'fire_crystal', 'refined_fire_crystal'];

const dataCache = new Map();

function loadJson(file) {
  if (!dataCache.has(file)) {
    const filePath = path.join(__dirname, '..', 'data', file);
    dataCache.set(file, JSON.parse(fs.readFileSync(filePath, 'utf8')));
  }
  return dataCache.get(file);
}

function getLevelsTable(phase, buildingId) {
  const building = getBuilding(phase, buildingId);
  if (!building) return null;

  const data = loadJson(building.file);

  if (building.file === 'military_camps.json') {
    const camp = data.camps[building.camp];
    const [sharedLevel1, ...restLevels] = data.shared_levels;

    const level1 = {
      level: String(sharedLevel1.level),
      requirements: [],
      cost: camp.level1_cost,
      time_seconds: sharedLevel1.time_seconds,
      power: sharedLevel1.power,
    };

    return [level1, ...restLevels.map((lvl) => ({ ...lvl, level: String(lvl.level) }))];
  }

  return data.levels.map((lvl) => ({ ...lvl, level: String(lvl.level) }));
}

function getResourcesOrder(phase, buildingId) {
  const building = getBuilding(phase, buildingId);
  if (!building) return [];
  return loadJson(building.file).resources_order ?? [];
}

module.exports = { getLevelsTable, getResourcesOrder, GLOBAL_RESOURCE_ORDER };
