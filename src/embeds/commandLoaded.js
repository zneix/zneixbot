module.exports = (client, message, wascmd, cmd) => {
    var embed = {
        color: 0x99ff66,
        timestamp: new Date(),
        footer: {
            text: message.author.tag,
            icon_url: message.author.avatarURL
        },
        author: {
            name:`Success!`
        },
        description: `Command **${client.config.prefix}${cmd}** has been ${wascmd?"reloaded":"loaded"}! Description:
        ${client.commands.get(cmd).description.replace(/{PREFIX}/g, client.config.prefix)}`,
        fields: [
            {
                name:`**${client.config.prefix}${cmd}**${wascmd?" usage:":""}`,
                value:`${client.commands.get(cmd).usage.replace(/{PREFIX}/g, client.config.prefix)}`
            },
        ]
    }
    return message.channel.send({embed:embed}).then(msg => {if (client.config.delete.command) msg.delete(client.config.delete.time);});
}