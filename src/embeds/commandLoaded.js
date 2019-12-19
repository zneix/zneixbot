module.exports = (client, message, wascmd, cmd) => {
    let {aliases} = require('../../utils/eventCommandHandler');
    let embed = {
        color: 0x99ff66,
        timestamp: new Date(),
        footer: {
            text: message.author.tag,
            icon_url: message.author.avatarURL
        },
        author: {
            name: `${wascmd?"reloaded":"loaded"} ${message.guild.prefix}${cmd}!`
        },
        description: `Description: ${client.commands.get(cmd).description.replace(/{PREFIX}/g, message.guild.prefix)}`,
        fields: [
            {
                name: "Usage",
                value:`${client.commands.get(cmd).usage.replace(/{PREFIX}/g, message.guild.prefix)}`
            },
        ]
    }
    if (aliases[cmd]) embed.fields.push({
        name: "**Aliases**",
        value: aliases[cmd].join('\n')
    });
    return message.channel.send({embed:embed});
}