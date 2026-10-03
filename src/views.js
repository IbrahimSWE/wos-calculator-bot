const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
} = require('discord.js');
const { t } = require('./i18n');
const { getBuildingsForPhase } = require('./buildingsRegistry');
const { GLOBAL_RESOURCE_ORDER } = require('./buildingData');
const { getItemResourcesOrder } = require('./itemData');
const { formatNumber, formatDuration, formatResourceLine } = require('./formatting');
const { getTierIndex } = require('./gearAlias');

function languageSelectPayload(lang = 'ar') {
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('lang_select_ar')
      .setLabel(t(lang, 'language_button_ar'))
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('lang_select_en')
      .setLabel(t(lang, 'language_button_en'))
      .setStyle(ButtonStyle.Secondary),
  );

  return {
    content: t(lang, 'language_prompt'),
    embeds: [],
    components: [row],
  };
}

function mainMenuPayload(lang) {
  const embed = new EmbedBuilder()
    .setTitle(t(lang, 'main_menu_title'))
    .setDescription(t(lang, 'main_menu_description'))
    .setColor(0x2b6cb0);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('open_calculator')
      .setLabel(t(lang, 'calculator_button'))
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('change_language')
      .setLabel(t(lang, 'change_language_button'))
      .setStyle(ButtonStyle.Secondary),
  );

  return {
    content: '',
    embeds: [embed],
    components: [row],
  };
}

function typeSelectPayload(lang) {
  const embed = new EmbedBuilder()
    .setTitle(t(lang, 'type_select_title'))
    .setDescription(t(lang, 'type_select_description'))
    .setColor(0x2b6cb0);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('select_type_build').setLabel(t(lang, 'type_build_button')).setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('select_type_charms').setLabel(t(lang, 'type_charms_button')).setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('select_type_gear').setLabel(t(lang, 'type_gear_button')).setStyle(ButtonStyle.Primary),
  );

  const backRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('back_to_main_menu').setLabel(t(lang, 'back_button')).setStyle(ButtonStyle.Secondary),
  );

  return {
    content: '',
    embeds: [embed],
    components: [row, backRow],
  };
}

function phaseSelectPayload(lang) {
  const embed = new EmbedBuilder()
    .setTitle(t(lang, 'phase_select_title'))
    .setDescription(t(lang, 'phase_select_description'))
    .setColor(0x2b6cb0);

  const selectRow = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('phase_select')
      .setPlaceholder(t(lang, 'phase_select_placeholder'))
      .addOptions(
        { label: t(lang, 'phase_normal'), value: 'normal' },
        { label: t(lang, 'phase_fire_crystal'), value: 'fire_crystal' },
      ),
  );

  const backRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('back_to_type_select').setLabel(t(lang, 'back_button')).setStyle(ButtonStyle.Secondary),
  );

  return {
    content: '',
    embeds: [embed],
    components: [selectRow, backRow],
  };
}

function buildingSelectPayload(lang, phase) {
  const embed = new EmbedBuilder()
    .setTitle(t(lang, 'building_select_title'))
    .setDescription(t(lang, 'building_select_description'))
    .setColor(0x2b6cb0);

  const buildings = getBuildingsForPhase(phase);

  const selectRow = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(`building_select:${phase}`)
      .setPlaceholder(t(lang, 'building_select_placeholder'))
      .addOptions(buildings.map((b) => ({ label: t(lang, `building_${b.id}`), value: b.id }))),
  );

  const backRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('back_to_phase_select').setLabel(t(lang, 'back_button')).setStyle(ButtonStyle.Secondary),
  );

  return {
    content: '',
    embeds: [embed],
    components: [selectRow, backRow],
  };
}

function gearTierSelectPayload(lang, mode, currentAlias = null) {
  const { order, meta } = getTierIndex();
  const isTarget = mode === 'target';

  let tierKeys = order;
  if (isTarget) {
    const [currentTierKey, currentStarStr] = currentAlias.split('-');
    const currentStar = Number(currentStarStr);
    const fromIndex = order.indexOf(currentTierKey);
    tierKeys = order
      .slice(fromIndex)
      .filter((key) => key !== currentTierKey || currentStar < meta[key].maxStar);
  }

  if (isTarget && tierKeys.length === 0) {
    const maxRankEmbed = new EmbedBuilder()
      .setTitle(t(lang, 'gear_target_tier_title'))
      .setDescription(t(lang, 'gear_already_max_rank'))
      .setColor(0xd69e2e);

    const backRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('back_to_type_select').setLabel(t(lang, 'back_button')).setStyle(ButtonStyle.Secondary),
    );

    return {
      content: '',
      embeds: [maxRankEmbed],
      components: [backRow],
    };
  }

  const embed = new EmbedBuilder()
    .setTitle(t(lang, isTarget ? 'gear_target_tier_title' : 'gear_current_tier_title'))
    .setDescription(t(lang, isTarget ? 'gear_target_tier_description' : 'gear_current_tier_description'))
    .setColor(0x2b6cb0);

  const customId = isTarget ? `gear_target_tier:${currentAlias}` : 'gear_current_tier';
  const backCustomId = isTarget ? `gear_current_star:${currentAlias.split('-')[0]}` : 'back_to_type_select';

  const selectRow = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(customId)
      .setPlaceholder(t(lang, 'gear_tier_select_placeholder'))
      .addOptions(tierKeys.map((key) => ({ label: t(lang, `gear_tier_${key}`), value: key }))),
  );

  const backRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(backCustomId).setLabel(t(lang, 'back_button')).setStyle(ButtonStyle.Secondary),
  );

  return {
    content: '',
    embeds: [embed],
    components: [selectRow, backRow],
  };
}

function gearStarSelectPayload(lang, mode, tierKey, currentAlias = null) {
  const { meta } = getTierIndex();
  const isTarget = mode === 'target';

  let stars = Array.from({ length: meta[tierKey].maxStar + 1 }, (_, i) => i);
  if (isTarget) {
    const [currentTierKey, currentStarStr] = currentAlias.split('-');
    if (tierKey === currentTierKey) {
      stars = stars.filter((s) => s > Number(currentStarStr));
    }
  }

  const embed = new EmbedBuilder()
    .setTitle(t(lang, isTarget ? 'gear_target_star_title' : 'gear_current_star_title'))
    .setDescription(t(lang, isTarget ? 'gear_target_star_description' : 'gear_current_star_description'))
    .setColor(0x2b6cb0);

  const customId = isTarget ? `gear_target_star:${currentAlias}:${tierKey}` : `gear_current_star:${tierKey}`;
  const backCustomId = isTarget ? `gear_target_tier:${currentAlias}` : 'gear_current_tier';

  const selectRow = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(customId)
      .setPlaceholder(t(lang, 'gear_star_select_placeholder'))
      .addOptions(stars.map((s) => ({ label: `★${s}`, value: String(s) }))),
  );

  const backRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(backCustomId).setLabel(t(lang, 'back_button')).setStyle(ButtonStyle.Secondary),
  );

  return {
    content: '',
    embeds: [embed],
    components: [selectRow, backRow],
  };
}

function itemAddedSummaryPayload(lang, itemName, currentLevel, targetLevel, quantity = 1) {
  const description =
    quantity > 1
      ? t(lang, 'item_added_description_with_quantity', {
          item: itemName,
          quantity,
          current: currentLevel,
          target: targetLevel,
        })
      : t(lang, 'item_added_description', {
          item: itemName,
          current: currentLevel,
          target: targetLevel,
        });

  const embed = new EmbedBuilder().setTitle(t(lang, 'item_added_title')).setDescription(description).setColor(0x38a169);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('add_another_building')
      .setLabel(t(lang, 'add_another_button'))
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('calculate_final')
      .setLabel(t(lang, 'calculate_final_button'))
      .setStyle(ButtonStyle.Primary),
  );

  return {
    content: '',
    embeds: [embed],
    components: [row],
  };
}

function itemDisplayName(lang, item) {
  if (item.system === 'build') return t(lang, `building_${item.buildingId}`);
  return t(lang, `item_name_${item.system}`);
}

function finalResultPayload(lang, items) {
  const buildCost = {};
  const charmsCost = {};
  const gearCost = {};
  let totalBaseTime = 0;
  let totalReducedTime = 0;
  let totalPower = 0;
  let totalTroopsCapacity = 0;
  let hasReduction = false;
  let hasBuildItems = false;

  for (const item of items) {
    const bucket = item.system === 'build' ? buildCost : item.system === 'charms' ? charmsCost : gearCost;
    for (const [resource, amount] of Object.entries(item.calcResult.totalCost)) {
      bucket[resource] = (bucket[resource] ?? 0) + amount;
    }

    if (item.system === 'build') {
      hasBuildItems = true;
      totalBaseTime += item.calcResult.totalTimeSeconds;
      totalReducedTime += item.calcResult.reducedTimeSeconds;
      if (item.reduction > 0) hasReduction = true;
    }

    totalPower += item.calcResult.totalPower;
    totalTroopsCapacity += item.calcResult.extraTotals?.troops_deployment_capacity ?? 0;
  }

  const itemLines = items.map((item) =>
    item.quantity > 1
      ? t(lang, 'final_result_item_line_with_quantity', {
          item: itemDisplayName(lang, item),
          quantity: item.quantity,
          type: t(lang, `type_tag_${item.system}`),
          current: item.currentLevel,
          target: item.targetLevel,
        })
      : t(lang, 'final_result_item_line', {
          item: itemDisplayName(lang, item),
          type: t(lang, `type_tag_${item.system}`),
          current: item.currentLevel,
          target: item.targetLevel,
        }),
  );

  const embed = new EmbedBuilder()
    .setTitle(t(lang, 'final_result_title'))
    .setColor(0x38a169)
    .addFields({ name: t(lang, 'final_result_items_field'), value: itemLines.join('\n') });

  const buildLines = GLOBAL_RESOURCE_ORDER.filter((r) => buildCost[r] > 0).map((r) => formatResourceLine(lang, r, buildCost[r]));
  if (buildLines.length > 0) {
    embed.addFields({ name: t(lang, 'final_result_build_resources_field'), value: buildLines.join('\n') });
  }

  const charmsOrder = getItemResourcesOrder('charms');
  const charmsLines = charmsOrder.filter((r) => charmsCost[r] > 0).map((r) => formatResourceLine(lang, r, charmsCost[r]));
  if (charmsLines.length > 0) {
    embed.addFields({ name: t(lang, 'final_result_charms_resources_field'), value: charmsLines.join('\n') });
  }

  const gearOrder = getItemResourcesOrder('gear');
  const gearLines = gearOrder.filter((r) => gearCost[r] > 0).map((r) => formatResourceLine(lang, r, gearCost[r]));
  if (totalTroopsCapacity > 0) {
    gearLines.push(`${t(lang, 'result_troops_capacity_field')}: **+${formatNumber(totalTroopsCapacity)}**`);
  }
  if (gearLines.length > 0) {
    embed.addFields({ name: t(lang, 'final_result_gear_resources_field'), value: gearLines.join('\n') });
  }

  embed.addFields({ name: t(lang, 'final_result_power_field'), value: `+${formatNumber(totalPower)}`, inline: true });

  if (hasBuildItems) {
    embed.addFields({ name: t(lang, 'final_result_base_time_field'), value: formatDuration(lang, totalBaseTime), inline: true });
    if (hasReduction) {
      embed.addFields({
        name: t(lang, 'final_result_reduced_time_field'),
        value: formatDuration(lang, totalReducedTime),
        inline: true,
      });
    }
  }

  return {
    content: '',
    embeds: [embed],
    components: [],
  };
}

module.exports = {
  languageSelectPayload,
  mainMenuPayload,
  typeSelectPayload,
  phaseSelectPayload,
  buildingSelectPayload,
  gearTierSelectPayload,
  gearStarSelectPayload,
  itemAddedSummaryPayload,
  finalResultPayload,
};
