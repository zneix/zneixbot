module.exports = (message, boolReloaded, cmd) => {
    const {getAliases} = require('../utils/loader');
    let embed = {
        color: 0x99ff66,
        timestamp: message.createdAt,
        footer: {
            text: message.author.tag,
            icon_url: message.author.avatarURL({format: 'png', dynamic: true, size: 4096})
        },
        author: {
            name: `${boolReloaded ? 'reloaded' : 'loaded'} command ${cmd.name}!`
        },
        description: `Description: ${cmd.description.replace(/{PREFIX}/g, message.prefix)}`,
        fields: [
            {
                name: 'Usage',
                value: cmd.usage.split('\n').map(u => `${message.prefix}${cmd.name} ${u}`).join(`\n`)
            }
        ]
    }
    const aliases = getAliases(cmd.name);
    if (aliases) embed.fields.push({
        name: 'Aliases',
        value: aliases.join(' | ')
    });
    message.channel.send({embed:embed});
}