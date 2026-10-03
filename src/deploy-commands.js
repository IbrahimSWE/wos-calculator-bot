require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const { CLIENT_ID, GUILD_ID, DISCORD_TOKEN } = process.env;
const targetGuildId = process.argv[2] || GUILD_ID;

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

const commands = commandFiles.map((file) => {
  const command = require(path.join(commandsPath, file));
  return command.data.toJSON();
});

const rest = new REST().setToken(DISCORD_TOKEN);

(async () => {
  try {
    console.log(`جاري تسجيل ${commands.length} أمر على السيرفر ${targetGuildId}...`);

    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, targetGuildId), {
      body: commands,
    });

    console.log('✅ تم تسجيل الأوامر بنجاح.');
  } catch (error) {
    console.error(error);
  }
})();
