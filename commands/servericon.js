exports.description = 'Links icon of current server in fancy embed.';
exports.usage = '';
exports.level = 0;
exports.perms = [];
exports.cooldown = 5000;
exports.dmable = false;

exports.run = async message => {
    if (!message.guild.iconURL()) throw ['normal', 'This server doesn\'t have an icon'];
    let dynamicIcon = message.guild.iconURL({format: 'png', dynamic: true, size: 4096});
    message.channel.send(`<${dynamicIcon}>${/^a_/.test(message.guild.icon) ? `\nNon-animated: <${message.guild.iconURL({format: 'png', dynamic: false, size: 4096})}>` : ''}`, {embed:{
        color: 0x9c6bcc,
        timestamp: message.createdAt,
        footer: {
            text: `${message.guild.name}'s icon`,
            icon_url: dynamicIcon
        },
        author: {
            name: `Icon of ${message.guild.name}`,
            url: dynamicIcon
        },
        image: {
            url: dynamicIcon
        }
    }});
}