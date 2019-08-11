module.exports = (client, message, wascmd, cmd) => {
    var embed = {
        color: 0x99ff66,
        timestamp: new Date(),
        footer: {
            text: message.author.tag,
            icon_url: message.author.avatarURL
        },
        author: {
            name: `${wascmd?"reloaded":"loaded"} ${client.config.prefix}${cmd}!`
        },
        description: `Description: ${client.commands.get(cmd).description.replace(/{PREFIX}/g, client.config.prefix)}`,
        fields: [
            {
                name: "Usage",
                value:`${client.commands.get(cmd).usage.replace(/{PREFIX}/g, client.config.prefix)}`
            },
        ]
    }
    return message.channel.send({embed:embed}).then(msg => {if (client.config.delete.command) msg.delete(client.config.delete.time);});
}