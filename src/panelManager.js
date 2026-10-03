const { panelPayload } = require('./panelView');
const { setPanel, getAllPanels } = require('./panelState');

async function sendPanel(channel) {
  const message = await channel.send(panelPayload());
  setPanel(channel.guildId, { channelId: channel.id, messageId: message.id });
  return message;
}

async function ensurePanelsExist(client) {
  const panels = getAllPanels();

  for (const [guildId, { channelId, messageId }] of Object.entries(panels)) {
    let channel;
    try {
      channel = await client.channels.fetch(channelId);
    } catch {
      console.error(`تعذر الوصول لقناة لوحة السيرفر ${guildId} (${channelId}) — القناة غير موجودة.`);
      continue;
    }

    try {
      await channel.messages.fetch(messageId);
    } catch {
      try {
        await sendPanel(channel);
        console.log(`أعدت إرسال لوحة التحكم للسيرفر ${guildId}`);
      } catch (err) {
        console.error(`تعذر إعادة إرسال لوحة السيرفر ${guildId}:`, err.message);
      }
    }
  }
}

module.exports = { sendPanel, ensurePanelsExist };
