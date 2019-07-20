module.exports = (client, message, desc, fds) => {
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
        description: desc,
        fields: fds
    }
    return message.channel.send({embed:embed}).then(msg => {if (client.config.delete.command) msg.delete(client.config.delete.time);});
}