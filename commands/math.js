exports.description = 'Calculates your math expression. This command is rather poor, see mathjs documentation for better understanding.';
exports.usage = '<math expression>';
exports.level = 0;
exports.perms = [];
exports.cooldown = 5000;
exports.pipeable = false;

exports.run = async message => {
    const math = require('mathjs');
    let embed = {
        color: message.member.displayColor||null,
        timestamp: message.createdAt,
        footer: {
            text: message.author.tag,
            icon_url: message.author.avatarURL
        },
        author: {
            name: message.args.join(' ')+' ='
        },
        description: thonk().toString()
    }
    message.channel.send({embed:embed});
    function thonk(){
        try {
            return math.evaluate(message.args.join(' '));
        }
        catch (err){
            return err;
        }
    }
}
