module.exports = (message, member, reason, boolBanned) => {
    let embed = {
        color: boolBanned?0xdd3c12:0x443ca1,
        timestamp: new Date(),
        footer: {
            text: message.author.tag,
            icon_url: message.author.avatarURL
        },
        author: {
            name: boolBanned==="banerror"?`User is already banned in ${message.guild.name}!`:"Successfully "+(boolBanned?"Banned":"Kicked")
        },
        description: boolBanned==="banerror"?`Reason of ${member}'s ban: \`${reason}\``:`${typeof member === "object"?member:`<@${member}>`} ${reason==="No reason given."?" without a reason.":` with reason: ${reason}`}`
    }
    return message.channel.send({embed:embed});
}