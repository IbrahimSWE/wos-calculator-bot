const { SlashCommandBuilder } = require('discord.js');
const { executeCalculatorCommand } = require('../calculatorCommandHandler');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('حاسبة')
    .setDescription('حاسبة بناء مباني Whiteout Survival'),

  async execute(interaction) {
    await executeCalculatorCommand(interaction, 'ar');
  },
};
