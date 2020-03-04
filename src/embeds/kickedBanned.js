module.exports = (message, userid, reason, boolBanned) => {
    let embed = {
        color: boolBanned ? 0xdd3c12 : 0x443ca1, //banned | kicked colour
        timestamp: message.createdAt,
        footer: {
            text: message.author.tag,
            icon_url: message.author.avatarURL({format:'png', 'dynamic':true})
        },
        author: {
            name: boolBanned == 'banerror' ? `User is already banned in ${message.guild.name}!` : `Successfully ${boolBanned?"Banned":"Kicked"}`
        },
        description: `<@${userid}> ${reason == 'No reason given.' ? 'without a reason.' : `with reason: **${reason}**`}`
    }
    if (boolBanned == 'banerror') embed.color = 0xe7c607;
    message.channel.send({embed:embed});
}