const {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  MessageFlags,
} = require('discord.js');
const { t } = require('./i18n');
const { getLanguage } = require('./userPrefs');
const { getLevelsTable } = require('./buildingData');
const { getItemLevelsTable } = require('./itemData');
const { validateInputs } = require('./levelValidation');
const { calculateUpgrade } = require('./calculator');
const { itemAddedSummaryPayload } = require('./views');
const { addBuildingToPlan } = require('./planState');

function buildLevelModal(lang, phase, buildingId) {
  const modal = new ModalBuilder()
    .setCustomId(`level_modal:${phase}:${buildingId}`)
    .setTitle(t(lang, 'modal_title'));

  const currentInput = new TextInputBuilder()
    .setCustomId('current_level')
    .setLabel(t(lang, 'modal_current_level_label'))
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const targetInput = new TextInputBuilder()
    .setCustomId('target_level')
    .setLabel(t(lang, 'modal_target_level_label'))
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const reductionInput = new TextInputBuilder()
    .setCustomId('reduction_percent')
    .setLabel(t(lang, 'modal_reduction_label'))
    .setStyle(TextInputStyle.Short)
    .setRequired(false);

  modal.addComponents(
    new ActionRowBuilder().addComponents(currentInput),
    new ActionRowBuilder().addComponents(targetInput),
    new ActionRowBuilder().addComponents(reductionInput),
  );

  return modal;
}

function buildCharmsModal(lang) {
  const modal = new ModalBuilder().setCustomId('item_modal:charms').setTitle(t(lang, 'modal_charms_title'));

  const currentInput = new TextInputBuilder()
    .setCustomId('current_level')
    .setLabel(t(lang, 'modal_current_level_label'))
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const targetInput = new TextInputBuilder()
    .setCustomId('target_level')
    .setLabel(t(lang, 'modal_target_level_label'))
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const quantityInput = new TextInputBuilder()
    .setCustomId('quantity')
    .setLabel(t(lang, 'modal_quantity_label'))
    .setStyle(TextInputStyle.Short)
    .setRequired(false);

  modal.addComponents(
    new ActionRowBuilder().addComponents(currentInput),
    new ActionRowBuilder().addComponents(targetInput),
    new ActionRowBuilder().addComponents(quantityInput),
  );

  return modal;
}

async function handleBuildModalSubmit(interaction, phase, buildingId) {
  const lang = getLanguage(interaction.user.id) || 'ar';

  const levelsTable = getLevelsTable(phase, buildingId);
  if (!levelsTable) return;

  const currentRaw = interaction.fields.getTextInputValue('current_level');
  const targetRaw = interaction.fields.getTextInputValue('target_level');
  const reductionRaw = interaction.fields.getTextInputValue('reduction_percent');

  const result = validateInputs(levelsTable, currentRaw, targetRaw, reductionRaw);

  if (!result.ok) {
    await interaction.reply({ content: t(lang, result.errorKey, result.vars), flags: MessageFlags.Ephemeral });
    return;
  }

  const currentLevel = levelsTable[result.currentIndex].level;
  const targetLevel = levelsTable[result.targetIndex].level;
  const calcResult = calculateUpgrade(levelsTable, result.currentIndex, result.targetIndex, result.reduction);

  addBuildingToPlan(interaction.user.id, {
    system: 'build',
    phase,
    buildingId,
    currentLevel,
    targetLevel,
    reduction: result.reduction,
    calcResult,
  });

  const itemName = t(lang, `building_${buildingId}`);

  await interaction.reply({
    ...itemAddedSummaryPayload(lang, itemName, currentLevel, targetLevel),
    flags: MessageFlags.Ephemeral,
  });
}

async function handleCharmsModalSubmit(interaction) {
  const lang = getLanguage(interaction.user.id) || 'ar';

  const levelsTable = getItemLevelsTable('charms');

  const currentRaw = interaction.fields.getTextInputValue('current_level');
  const targetRaw = interaction.fields.getTextInputValue('target_level');
  const quantityRaw = interaction.fields.getTextInputValue('quantity').trim();

  const result = validateInputs(levelsTable, currentRaw, targetRaw, '', { hasReduction: false });

  if (!result.ok) {
    await interaction.reply({ content: t(lang, result.errorKey, result.vars), flags: MessageFlags.Ephemeral });
    return;
  }

  const quantity = quantityRaw === '' ? 1 : Number(quantityRaw);
  if (!Number.isInteger(quantity) || quantity < 1) {
    await interaction.reply({ content: t(lang, 'error_invalid_quantity'), flags: MessageFlags.Ephemeral });
    return;
  }

  const currentLevel = levelsTable[result.currentIndex].level;
  const targetLevel = levelsTable[result.targetIndex].level;
  const baseCalcResult = calculateUpgrade(levelsTable, result.currentIndex, result.targetIndex, 0);

  const calcResult = {
    ...baseCalcResult,
    totalCost: Object.fromEntries(
      Object.entries(baseCalcResult.totalCost).map(([resource, amount]) => [resource, amount * quantity]),
    ),
    totalPower: baseCalcResult.totalPower * quantity,
  };

  addBuildingToPlan(interaction.user.id, {
    system: 'charms',
    currentLevel,
    targetLevel,
    reduction: 0,
    quantity,
    calcResult,
  });

  const itemName = t(lang, 'item_name_charms');

  await interaction.reply({
    ...itemAddedSummaryPayload(lang, itemName, currentLevel, targetLevel, quantity),
    content: calcResult.powerIncomplete ? t(lang, 'power_incomplete_note') : '',
    flags: MessageFlags.Ephemeral,
  });
}

async function handleModalSubmit(interaction) {
  const parts = interaction.customId.split(':');

  if (parts[0] === 'level_modal') {
    const [, phase, buildingId] = parts;
    await handleBuildModalSubmit(interaction, phase, buildingId);
    return;
  }

  if (parts[0] === 'item_modal' && parts[1] === 'charms') {
    await handleCharmsModalSubmit(interaction);
    return;
  }
}

module.exports = { buildLevelModal, buildCharmsModal, handleModalSubmit };
