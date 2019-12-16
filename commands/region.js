let regions = [
    'europe',
    'singapore',
    'eu-central',
    'us-south',
    'india',
    'us-central',
    'london',
    'japan',
    'eu-west',
    'brazil',
    'dubai',
    'us-west',
    'hongkong',
    'amsterdam',
    'southafrica',
    'us-east',
    'sydney',
    'frankfurt',
    'russia'
];
exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Sets a new region of the current server.`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} (region)\n\n**Region must be one of the following:** ${regions.join(', ')}`;
exports.perms = [false, false, 'MANAGE_GUILD'];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(1, async () => {
        if (!message.guild.me.hasPermission('MANAGE_GUILD')) throw "I don't have **MANAGE_GUILD** permission here, contact moderators!";
        let region = message.args[0].toLowerCase();
        if (regions.some(x => region === x)) {
            try {
                message.guild.setRegion(region);
                let embed = {
                    color: message.member.displayColor,
                    timestamp: new Date(),
                    footer: {
                        text: message.author.tag,
                        icon_url: message.author.avatarURL
                    },
                    description: `Successfully set server region to \`${region}\``
                }
                message.channel.send({embed:embed});
            }
            catch (err) {
                throw err.toString();
            }
        }
        else throw "Wrong region, must be one of following:\n"+regions.join(', ');
    });
}