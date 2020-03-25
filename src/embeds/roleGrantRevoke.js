module.exports = (message, role, boolAdded) => {
    message.channel.send({embed:{
        color: boolAdded ? 0x00ff00 : 0xff0000,
        timestamp: message.createdAt,
        footer: {
            text: message.author.tag,
            icon_url: message.author.avatarURL
        },
        author: {
            name: `Role ${boolAdded ? 'granted' : 'revoked'}!`
        },
        description: `${boolAdded ? 'Added' : 'Revoked'} role ${role} ${boolAdded ? 'to' : 'from'} ${message.author}.`
    }});
    console.log(`(role-${boolAdded?'add':'rem'}) role: '${role.name}', user: ${message.author.tag}, guild: '${message.guild.name}'`);
}