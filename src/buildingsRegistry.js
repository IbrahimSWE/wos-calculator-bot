const NORMAL_BUILDINGS = [
  { id: 'furnace', file: 'furnace.json' },
  { id: 'research_center', file: 'research_center.json' },
  { id: 'infantry_camp', file: 'military_camps.json', camp: 'infantry' },
  { id: 'lancer_camp', file: 'military_camps.json', camp: 'lancer' },
  { id: 'marksman_camp', file: 'military_camps.json', camp: 'marksman' },
  { id: 'barricade', file: 'barricade.json' },
  { id: 'storehouse', file: 'storehouse.json' },
  { id: 'embassy', file: 'embassy.json' },
  { id: 'command_center', file: 'command_center.json' },
  { id: 'infirmary', file: 'infirmary.json' },
];

const FIRE_CRYSTAL_BUILDINGS = [
  { id: 'fc_furnace', file: 'fire_crystal_furnace.json' },
  { id: 'fc_embassy', file: 'fire_crystal_embassy.json' },
  { id: 'fc_infantry_camp', file: 'fire_crystal_military_camps.json', camp: 'infantry' },
  { id: 'fc_lancer_camp', file: 'fire_crystal_military_camps.json', camp: 'lancer' },
  { id: 'fc_marksman_camp', file: 'fire_crystal_military_camps.json', camp: 'marksman' },
  { id: 'fc_command_center', file: 'fire_crystal_command_center.json' },
  { id: 'fc_infirmary', file: 'fire_crystal_infirmary.json' },
  { id: 'war_academy', file: 'war_academy.json' },
];

const PHASES = {
  normal: NORMAL_BUILDINGS,
  fire_crystal: FIRE_CRYSTAL_BUILDINGS,
};

function getBuildingsForPhase(phase) {
  return PHASES[phase] ?? [];
}

function getBuilding(phase, buildingId) {
  return getBuildingsForPhase(phase).find((b) => b.id === buildingId) ?? null;
}

module.exports = { PHASES, getBuildingsForPhase, getBuilding };
