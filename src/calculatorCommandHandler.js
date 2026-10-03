const { MessageFlags } = require('discord.js');
const { getLanguage } = require('./userPrefs');
const { languageSelectPayload, mainMenuPayload } = require('./views');

async function executeCalculatorCommand(interaction, defaultLang) {
  const lang = getLanguage(interaction.user.id);

  if (!lang) {
    await interaction.reply({ ...languageSelectPayload(defaultLang), flags: MessageFlags.Ephemeral });
    return;
  }

  await interaction.reply({ ...mainMenuPayload(lang), flags: MessageFlags.Ephemeral });
}

module.exports = { executeCalculatorCommand };
