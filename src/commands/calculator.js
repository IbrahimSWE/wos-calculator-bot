const { SlashCommandBuilder } = require('discord.js');
const { executeCalculatorCommand } = require('../calculatorCommandHandler');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('calculator')
    .setDescription('Build/Charms/Gear upgrade calculator for Whiteout Survival'),

  async execute(interaction) {
    await executeCalculatorCommand(interaction, 'en');
  },
};
