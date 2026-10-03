const { MessageFlags } = require('discord.js');
const { getLanguage } = require('./userPrefs');
const { buildingSelectPayload, gearTierSelectPayload, gearStarSelectPayload, itemAddedSummaryPayload } = require('./views');
const { buildLevelModal } = require('./modals');
const { getItemLevelsTable } = require('./itemData');
const { validateInputs } = require('./levelValidation');
const { calculateUpgrade } = require('./calculator');
const { aliasForLevel } = require('./gearAlias');
const { addBuildingToPlan } = require('./planState');
const { t } = require('./i18n');

async function handleSelectMenu(interaction) {
  const { customId } = interaction;
  const lang = getLanguage(interaction.user.id) || 'ar';

  if (customId === 'phase_select') {
    const phase = interaction.values[0];
    await interaction.update(buildingSelectPayload(lang, phase));
    return;
  }

  if (customId.startsWith('building_select:')) {
    const phase = customId.split(':')[1];
    const buildingId = interaction.values[0];
    await interaction.showModal(buildLevelModal(lang, phase, buildingId));
    return;
  }

  if (customId === 'gear_current_tier') {
    const tierKey = interaction.values[0];
    await interaction.update(gearStarSelectPayload(lang, 'current', tierKey));
    return;
  }

  if (customId.startsWith('gear_current_star:')) {
    const tierKey = customId.split(':')[1];
    const star = interaction.values[0];
    const currentAlias = `${tierKey}-${star}`;
    await interaction.update(gearTierSelectPayload(lang, 'target', currentAlias));
    return;
  }

  if (customId.startsWith('gear_target_tier:')) {
    const currentAlias = customId.split(':')[1];
    const targetTierKey = interaction.values[0];
    await interaction.update(gearStarSelectPayload(lang, 'target', targetTierKey, currentAlias));
    return;
  }

  if (customId.startsWith('gear_target_star:')) {
    const [, currentAlias, targetTierKey] = customId.split(':');
    const targetStar = interaction.values[0];
    const targetAlias = `${targetTierKey}-${targetStar}`;

    const levelsTable = getItemLevelsTable('gear');
    const result = validateInputs(levelsTable, currentAlias, targetAlias, '', {
      aliasFn: aliasForLevel,
      hasReduction: false,
    });

    if (!result.ok) {
      await interaction.reply({ content: t(lang, result.errorKey, result.vars), flags: MessageFlags.Ephemeral });
      return;
    }

    const currentLevel = levelsTable[result.currentIndex].level;
    const targetLevel = levelsTable[result.targetIndex].level;
    const calcResult = calculateUpgrade(levelsTable, result.currentIndex, result.targetIndex, 0, [
      'troops_deployment_capacity',
    ]);

    addBuildingToPlan(interaction.user.id, {
      system: 'gear',
      currentLevel,
      targetLevel,
      reduction: 0,
      calcResult,
    });

    const itemName = t(lang, 'item_name_gear');
    await interaction.update({
      ...itemAddedSummaryPayload(lang, itemName, currentLevel, targetLevel),
      content: calcResult.powerIncomplete ? t(lang, 'power_incomplete_note') : '',
    });
    return;
  }
}

module.exports = { handleSelectMenu };
