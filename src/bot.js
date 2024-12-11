import { Client, GatewayIntentBits, WebhookClient } from "discord.js";
import { config } from "./config.js";
import { detectLanguage } from "./detectlanguage.js";
import { translateText } from "./translate.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent,
  ],
});

const germanWebhook = new WebhookClient({ url: config.germanWebhookUrl });
const englishWebhook = new WebhookClient({ url: config.englishWebhookUrl });

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const text = message.content;
  const channelId = message.channel.id;

  try {
    const member = await message.guild.members.fetch(message.author.id);
    const username = member.displayName || message.author.username; 
    const avatarURL = member.displayAvatarURL();

    const detectedLanguage = await detectLanguage(text);
    console.log(`Detected Language: ${detectedLanguage}`);

    let targetWebhook = null;
    let targetLang = null;

    if (channelId === config.englishChannelId && detectedLanguage === "en") {
      console.log("Translating from English to German");
      targetWebhook = germanWebhook;
      targetLang = "de";
    } else if (
      channelId === config.germanChannelId &&
      detectedLanguage === "de"
    ) {
      console.log("Translating from German to English");
      targetWebhook = englishWebhook;
      targetLang = "en";
    }

    if (targetWebhook && targetLang) {
      const translatedText = await translateText(text, targetLang);

      if (translatedText) {
        console.log(`Translated Text: ${translatedText}`);
        await targetWebhook.send({
          content: translatedText,
          username: username,
          avatarURL: avatarURL, 
        });
      } else {
        console.log("Translation failed");
      }
    } else {
      console.log("No translation needed");
    }
  } catch (error) {
    console.error("Error processing message:", error);
  }
});

client.login(config.botToken);
