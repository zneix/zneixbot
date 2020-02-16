module.exports = (client, message, role, added) => {
    let embed = {
        color: (added?0x00ff00:0xff0000),
        timestamp: message.createdAt,
        footer: {
            text: message.author.tag,
            icon_url: message.author.avatarURL
        },
        author: {
            name: `Role ${added?'granted':'revoked'}!`
        },
        description: `${added?'Added':'Revoked'} role ${role} ${added?'to':'from'} ${message.author}.`
    }
    return [
        message.channel.send({embed:embed}),
        console.log(`(role-${added?'add':'rem'}) role: '${role.name}', user: ${message.author.tag}, guild: '${message.guild.name}'`)
    ];
}