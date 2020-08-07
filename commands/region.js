let regions = require('fs').readFileSync('./src/assets/voiceregions.txt').toString().split('\n');
exports.description = `Updates server\'s region. Must be one of following: ${regions.join(', ')}`;
exports.usage = '<region>';
exports.level = 0;
exports.perms = ['MANAGE_GUILD'];
exports.cooldown = 5000;
exports.dmable = false;

exports.run = async message => {
    if (!message.args.length) throw ['args', 1];
    if (!message.guild.me.hasPermission('MANAGE_GUILD')) throw ['botperm', 'Manage Server'];
    let region = message.args[0].toLowerCase();
    if (regions.some(x => region == x)){
        try {
            message.guild.setRegion(region);
            message.channel.send({embed:{
                color: message.member.displayColor,
                timestamp: message.createdAt,
                footer: {
                    text: message.author.tag,
                    icon_url: message.author.avatarURL({format: 'png', dynamic: true, size: 4096})
                },
                description: `Successfully set server region to \`${region.toLowerCase()}\``
            }});
        }
        catch (err){ throw ['normal', `An error occured while updating server region: ${err.toString()}`]; }
    }
    else throw ['normal', `Region must be one of following:\n${regions.join(', ')}`];
}