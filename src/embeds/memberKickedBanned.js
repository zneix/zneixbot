module.exports = (message, member, reason, boolBanned) => {
    let embed = {
        color: boolBanned?0xdd3c12:0x443ca1,
        timestamp: new Date(),
        footer: {
            text: message.author.tag,
            icon_url: message.author.avatarURL
        },
        author: {
            name: "Successfully "+(boolBanned?"Banned":"Kicked")
        },
        description: `${member} ${reason==="No reason given."?" without a reason.":` with reason: ${reason}`}`
    }
    return message.channel.send({embed:embed});
}