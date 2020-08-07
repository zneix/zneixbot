module.exports = (message, channel, lvl) => {
    let embed = {
        color: 0x8ed938,
        timestamp: message.createdAt,
        footer: {
            text: message.author.tag,
            icon_url: message.author.avatarURL({format: 'png', dynamic: true, size: 4096})
        },
        author: {
            name: 'Level up!'
        },
        description: `${message.author} just achieved level ${lvl}!`
    }
    channel.send({embed:embed});
    console.log(`{level-up} ${lvl} ${message.author.tag} ${message.guild.id}!`);
}