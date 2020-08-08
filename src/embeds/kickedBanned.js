module.exports = (message, userid, reason, boolBanned) => {
    let embed = {
        color: boolBanned == 'banerror' ? 0xe7c607 : (boolBanned ? 0xdd3c12 : 0x443ca1), //already-banned (banned | kicked) colour
        timestamp: message.createdAt,
        footer: {
            text: message.author.tag,
            icon_url: message.author.avatarURL({format: 'png', dynamic: true, size: 4096})
        },
        author: {
            name: boolBanned == 'banerror' ? `User is already banned in ${message.guild.name}!` : `Successfully ${boolBanned ? 'Banned' : 'Kicked'}`
        },
        description: `<@${userid}> ${reason ? `with reason: \`${reason}\`` : 'without a reason.'}`
    }
    if (typeof boolBanned == 'object'){
        //tempban was executed
        const {msToHuman} = require('../utils/formatter');
        embed.description += `\nTemporarily banned for ${msToHuman(boolBanned.time * 1000, 4)}, ID: ${boolBanned.id}`;
    }
    message.channel.send({embed:embed});
}