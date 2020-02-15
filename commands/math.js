exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = 'Calculates your expression (really poor, under developement). See math.js documentation for better understanding.';
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} <math expression>`;
exports.perms = [false, false];
const math = require('mathjs');

exports.run = (client, message) => {
    message.cmd = this;
    message.command(1, async () => {
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
    });
}
