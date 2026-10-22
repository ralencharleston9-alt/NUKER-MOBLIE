
const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  Events
} = require("discord.js");

const TOKEN = process.env.DISCORD_TOKEN;

if (!TOKEN) {
  throw new Error("Set DISCORD_TOKEN in your host environment variables.");
}

const commands = [
  new SlashCommandBuilder()
    .setName("cook")
    .setDescription("Check whether SZYT is online"),

  new SlashCommandBuilder()
    .setName("testnuke")
    .setDescription("Run a safe channel and message simulation")
    .addIntegerOption(option =>
      option.setName("channels")
        .setDescription("Channels to simulate (max 900)")
        .setMinValue(1)
        .setMaxValue(900)
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("messages")
        .setDescription("Messages per simulated channel")
        .setMinValue(1)
        .setMaxValue(1000000)
        .setRequired(true)
    )
].map(command => command.toJSON());

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, async readyClient => {
  console.log(`SZYT online as ${readyClient.user.tag}`);

  try {
    const rest = new REST({ version: "10" }).setToken(TOKEN);

    await rest.put(
      Routes.applicationCommands(readyClient.user.id),
      { body: commands }
    );

    console.log("Global slash commands registered.");
  } catch (error) {
    console.error("Slash command registration failed:", error);
  }
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  try {
    if (interaction.commandName === "cook") {
      await interaction.reply({
        content: "🔥 SZYT is online!\n🛡️ Simulation mode enabled.",
        ephemeral: true
      });
    }

    if (interaction.commandName === "testnuke") {
      const channels = interaction.options.getInteger("channels", true);
      const messages = interaction.options.getInteger("messages", true);

      await interaction.reply({
        content: [
          "🧪 **SZYT SIMULATION REPORT**",
          "━━━━━━━━━━━━━━━━━━━━",
          `📁 Simulated channels: **${channels.toLocaleString()}**`,
          `💬 Messages per channel: **${messages.toLocaleString()}**`,
          `🧮 Simulated total: **${(channels * messages).toLocaleString()}**`,
          "━━━━━━━━━━━━━━━━━━━━",
          "✅ Actual channels created: **0**",
          "✅ Actual messages sent: **0**",
          "🛡️ Simulation only"
        ].join("\n"),
        ephemeral: true
      });
    }
  } catch (error) {
    console.error(error);

    const reply = {
      content: "⚠️ Command failed. Check the host logs.",
      ephemeral: true
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply).catch(() => {});
    } else {
      await interaction.reply(reply).catch(() => {});
    }
  }
});

client.login(TOKEN).catch(error => {
  console.error("Login failed:", error);
});
