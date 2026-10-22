
const {
  Client,
  GatewayIntentBits,
  Events
} = require("discord.js");

// ===================================
// SZYT NUKERS — SAFE TEST SIMULATOR
// ===================================

const CONFIG = {
  prefix: "!",
  messagesPerChannel: 1000,
  simulatedChannels: 900,
  testMessage: "GG",

  // Simulation only. Never sends bulk messages.
  simulationOnly: true
};

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

let simulationRuns = 0;

function makeSimulationReport() {
  const perChannel = CONFIG.messagesPerChannel;
  const channels = CONFIG.simulatedChannels;

  if (
    !Number.isSafeInteger(perChannel) ||
    perChannel < 0 ||
    !Number.isSafeInteger(channels) ||
    channels < 0
  ) {
    throw new Error("Counts must be non-negative integers.");
  }

  simulationRuns++;

  return [
    "🧪 **SZYT — SIMULATION REPORT**",
    "━━━━━━━━━━━━━━━━━━━━",
    `📁 Simulated channels: **${channels}**`,
    `💬 Messages per channel: **${perChannel}**`,
    `🧮 Simulated total: **${perChannel * channels}**`,
    `📝 Sample message: ${CONFIG.testMessage}`,
    `🔁 Simulation runs: **${simulationRuns}**`,
    "━━━━━━━━━━━━━━━━━━━━",
    "✅ Real messages sent: **0**",
    "✅ Real channels created: **0**",
    "🛡️ Mode: **SIMULATION ONLY**"
  ].join("\n");
}

client.once(Events.ClientReady, (readyClient) => {
  console.log(
    `⚡ ${readyClient.user.tag} is online!`
  );
  console.log("SZYT simulation mode enabled.");
});

client.on(Events.MessageCreate, async (message) => {
  // Ignore bots and messages outside servers.
  if (message.author.bot || !message.guild) return;

  // Only respond to the two configured commands.
  const command = message.content.trim().toLowerCase();

  if (command === `${CONFIG.prefix}cook`) {
    await message.reply(
      "🔥 **SZYT is online!**\n" +
      "Simulation mode: enabled\n" +
      "Commands: `!cook`, `!testnuke`"
    );
  }

  if (command === `${CONFIG.prefix}testnuke`) {
    try {
      await message.reply({
        content: makeSimulationReport(),
        allowedMentions: { parse: [] }
      });
    } catch (error) {
      console.error("Simulation error:", error);
      await message.reply("⚠️ Could not create the simulation report.");
    }
  }
});

client.on(Events.Error, (error) => {
  console.error("Discord client error:", error);
});

const token = process.env.DISCORD_TOKEN;

if (!token) {
  console.error(
    "Missing DISCORD_TOKEN environment variable."
  );
  process.exit(1);
}

client.login(token).catch((error) => {
  console.error("Failed to log in. Check your bot token.", error.message);
});
