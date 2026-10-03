const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { getLanguage } = require('../userPrefs');
const { getPanel } = require('../panelState');
const { sendPanel } = require('../panelManager');
const { t } = require('../i18n');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-panel')
    .setDescription('Send the persistent calculator control panel in this channel (admin only)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const lang = getLanguage(interaction.user.id) || 'ar';
    const existing = getPanel(interaction.guildId);

    if (existing) {
      try {
        const channel = await interaction.client.channels.fetch(existing.channelId);
        await channel.messages.fetch(existing.messageId);
        await interaction.reply({
          content: t(lang, 'setup_panel_already_exists', { channelId: existing.channelId }),
          flags: MessageFlags.Ephemeral,
        });
        return;
      } catch {
        // Stored message/channel no longer exists — fall through and create a new one.
      }
    }

    await sendPanel(interaction.channel);
    await interaction.reply({ content: t(lang, 'setup_panel_success'), flags: MessageFlags.Ephemeral });
  },
};
