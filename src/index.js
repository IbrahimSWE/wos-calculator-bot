require('dotenv').config();
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { handleButton } = require('./buttons');
const { handleSelectMenu } = require('./selects');
const { handleModalSubmit } = require('./modals');
const { ensurePanelsExist } = require('./panelManager');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
}

client.once('clientReady', async () => {
  console.log(`✅ سجّل الدخول باسم ${client.user.tag}`);
  try {
    await ensurePanelsExist(client);
  } catch (error) {
    console.error('خطأ أثناء التحقق من لوحات التحكم:', error);
  }
});

client.on('error', (error) => {
  console.error('خطأ بعميل ديسكورد:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('رفض غير معالج:', error);
});

client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      await command.execute(interaction);
    } else if (interaction.isButton()) {
      await handleButton(interaction);
    } else if (interaction.isStringSelectMenu()) {
      await handleSelectMenu(interaction);
    } else if (interaction.isModalSubmit()) {
      await handleModalSubmit(interaction);
    }
  } catch (error) {
    console.error(error);
    try {
      const errorMessage = { content: 'صار خطأ أثناء تنفيذ الأمر.', flags: 64 };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorMessage);
      } else {
        await interaction.reply(errorMessage);
      }
    } catch (followUpError) {
      console.error('تعذر إرسال رسالة الخطأ:', followUpError);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
