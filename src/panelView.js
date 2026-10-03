const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } = require('discord.js');
const path = require('node:path');
const fs = require('node:fs');
const { t } = require('./i18n');

const PANEL_COLOR = 0x1e3a8a;

const BANNER_FILENAME = 'Banner.webp';
const BANNER_PATH = path.join(__dirname, '..', 'data', BANNER_FILENAME);
const HAS_BANNER = fs.existsSync(BANNER_PATH);

function panelPayload() {
  const embed = new EmbedBuilder()
    .setTitle(t('ar', 'panel_title'))
    .setDescription(`${t('ar', 'panel_description')}\n\n${t('en', 'panel_description')}`)
    .setColor(PANEL_COLOR);

  const files = [];
  if (HAS_BANNER) {
    embed.setImage(`attachment://${BANNER_FILENAME}`);
    files.push(new AttachmentBuilder(BANNER_PATH, { name: BANNER_FILENAME }));
  }

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('select_language')
      .setLabel(t('ar', 'panel_button_language'))
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('start_calculator')
      .setLabel(t('ar', 'panel_button_start'))
      .setStyle(ButtonStyle.Primary),
  );

  return {
    embeds: [embed],
    components: [row],
    files,
  };
}

function panelLanguageSelectPayload() {
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('panel_lang_select_ar')
      .setLabel(t('ar', 'language_button_ar'))
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('panel_lang_select_en')
      .setLabel(t('ar', 'language_button_en'))
      .setStyle(ButtonStyle.Secondary),
  );

  return {
    content: t('ar', 'panel_language_prompt'),
    embeds: [],
    components: [row],
  };
}

module.exports = { panelPayload, panelLanguageSelectPayload };
