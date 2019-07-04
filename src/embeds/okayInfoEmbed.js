module.exports = (client, message, desc, fds) => {
    var embed = {
        color: 0x99ff66,
        author: {
            name:`Success!`
        },
        timestamp: new Date(),
        footer: {
            text: mesasge.author.tag+" @ ",
            icon_url: message.author.avatarURL
        },
        description: desc,
        fields: fds
    }
    return message.channel.send({embed:embed}).then(msg => {if (client.config.delete.command) msg.delete(client.config.delete.time);});
}