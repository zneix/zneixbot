module.exports = (message, userid, reason, boolBanned) => {
    let embed = {
        color: boolBanned == 'banerror' ? 0xe7c607 : (boolBanned ? 0xdd3c12 : 0x443ca1), //already-banned (banned | kicked) colour
        timestamp: message.createdAt,
        footer: {
            text: message.author.tag,
            icon_url: message.author.avatarURL({format:'png', 'dynamic':true})
        },
        author: {
            name: boolBanned == 'banerror' ? `User is already banned in ${message.guild.name}!` : `Successfully ${boolBanned?"Banned":"Kicked"}`
        },
        description: `<@${userid}> ${reason == 'No reason given.' ? 'without a reason.' : `with reason: \`${reason}\``}`
    }
    message.channel.send({embed:embed});
}