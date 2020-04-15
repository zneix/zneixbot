exports.description = 'Pings a bot to check if it\'s online'; //brief desc of the commad
exports.usage = ''; //usage syntax
exports.level = 0; //required global level for running the command (used by high-level restricted commands)
exports.perms = []; //guild-based permissions
exports.cooldown = 3000; //cooldown for the command
exports.dmable = true; //whether the command is able to be piped to another command or not

exports.run = async message => {
    const formmatter = require('../src/utils/formatter');
    let m = await message.channel.send('Pinging...');
    let ping = {
        color: 0x00ff00,
        timestamp: message.createdAt,
        footer: {
            text: message.author.tag,
            icon_url: message.author.avatarURL({format:'png', 'dynamic':true})
        },
        fields: [
            {
                name: 'Ping',
                value: `​Latency: **${m.createdTimestamp - message.createdTimestamp}ms**\nAPI Ping: **${Math.round(client.ws.ping)}ms**`
            },
            {
                name: 'Uptime',
                value: `​**${formmatter.msToHuman(client.uptime, 3)}** since \`​${formmatter.dateFormat(client.readyAt)}, ${formmatter.hourFormat(client.readyAt)}\`​\nCommands used: ${client.cc}`
            }
        ]
    }
    m.edit({embed:ping});
}