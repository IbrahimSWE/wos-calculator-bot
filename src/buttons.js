const { MessageFlags } = require('discord.js');
const { getLanguage, setLanguage } = require('./userPrefs');
const {
  languageSelectPayload,
  mainMenuPayload,
  typeSelectPayload,
  phaseSelectPayload,
  buildingSelectPayload,
  gearTierSelectPayload,
  gearStarSelectPayload,
  finalResultPayload,
} = require('./views');
const { buildCharmsModal } = require('./modals');
const { getPlanItems, clearPlan, getLastBuildPhase } = require('./planState');
const { panelLanguageSelectPayload } = require('./panelView');
const { t } = require('./i18n');

async function handleButton(interaction) {
  const { customId } = interaction;

  if (customId === 'select_language') {
    await interaction.reply({ ...panelLanguageSelectPayload(), flags: MessageFlags.Ephemeral });
    return;
  }

  if (customId === 'panel_lang_select_ar' || customId === 'panel_lang_select_en') {
    const lang = customId === 'panel_lang_select_ar' ? 'ar' : 'en';
    setLanguage(interaction.user.id, lang);
    await interaction.update({ content: t(lang, 'language_saved_confirmation'), embeds: [], components: [] });
    return;
  }

  if (customId === 'start_calculator') {
    const lang = getLanguage(interaction.user.id) || 'ar';
    await interaction.reply({ ...typeSelectPayload(lang), flags: MessageFlags.Ephemeral });
    return;
  }

  if (customId === 'lang_select_ar' || customId === 'lang_select_en') {
    const lang = customId === 'lang_select_ar' ? 'ar' : 'en';
    setLanguage(interaction.user.id, lang);
    await interaction.update(mainMenuPayload(lang));
    return;
  }

  if (customId === 'change_language') {
    const lang = getLanguage(interaction.user.id) || 'ar';
    await interaction.update(languageSelectPayload(lang));
    return;
  }

  if (customId === 'open_calculator') {
    const lang = getLanguage(interaction.user.id) || 'ar';
    await interaction.update(typeSelectPayload(lang));
    return;
  }

  if (customId === 'add_another_building') {
    const lang = getLanguage(interaction.user.id) || 'ar';
    const lastPhase = getLastBuildPhase(interaction.user.id);
    if (lastPhase) {
      await interaction.update(buildingSelectPayload(lang, lastPhase));
    } else {
      await interaction.update(typeSelectPayload(lang));
    }
    return;
  }

  if (customId === 'back_to_main_menu') {
    const lang = getLanguage(interaction.user.id) || 'ar';
    await interaction.update(mainMenuPayload(lang));
    return;
  }

  if (customId === 'back_to_type_select') {
    const lang = getLanguage(interaction.user.id) || 'ar';
    await interaction.update(typeSelectPayload(lang));
    return;
  }

  if (customId === 'back_to_phase_select') {
    const lang = getLanguage(interaction.user.id) || 'ar';
    await interaction.update(phaseSelectPayload(lang));
    return;
  }

  if (customId === 'select_type_build') {
    const lang = getLanguage(interaction.user.id) || 'ar';
    await interaction.update(phaseSelectPayload(lang));
    return;
  }

  if (customId === 'select_type_charms') {
    const lang = getLanguage(interaction.user.id) || 'ar';
    await interaction.showModal(buildCharmsModal(lang));
    return;
  }

  if (customId === 'select_type_gear' || customId === 'gear_current_tier') {
    const lang = getLanguage(interaction.user.id) || 'ar';
    await interaction.update(gearTierSelectPayload(lang, 'current'));
    return;
  }

  if (customId.startsWith('gear_current_star:')) {
    const lang = getLanguage(interaction.user.id) || 'ar';
    const tierKey = customId.split(':')[1];
    await interaction.update(gearStarSelectPayload(lang, 'current', tierKey));
    return;
  }

  if (customId.startsWith('gear_target_tier:')) {
    const lang = getLanguage(interaction.user.id) || 'ar';
    const currentAlias = customId.split(':')[1];
    await interaction.update(gearTierSelectPayload(lang, 'target', currentAlias));
    return;
  }

  if (customId === 'calculate_final') {
    const lang = getLanguage(interaction.user.id) || 'ar';
    const items = getPlanItems(interaction.user.id);

    if (items.length === 0) {
      await interaction.reply({ content: t(lang, 'empty_plan_error'), flags: MessageFlags.Ephemeral });
      return;
    }

    await interaction.update(finalResultPayload(lang, items));
    clearPlan(interaction.user.id);
    return;
  }
}

module.exports = { handleButton };
