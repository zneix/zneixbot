module.exports = (message, role, added) => {
    message.channel.send({embed:{
        color: added ? 0x00ff00 : 0xff0000,
        timestamp: message.createdAt,
        footer: {
            text: message.author.tag,
            icon_url: message.author.avatarURL({format: 'png', dynamic: true, size: 4096})
        },
        author: {
            name: `Role ${added ? 'granted' : 'revoked'}!`
        },
        description: `${added ? 'Added' : 'Revoked'} role ${role} ${added ? 'to' : 'from'} ${message.author}.`
    }});
    console.log(`(role-${added ? 'add' : 'rem'}) role: '${role.name}', user: ${message.author.tag}, guild: '${message.guild.name}'`);
}