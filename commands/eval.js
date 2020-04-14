exports.description = 'Evaluates JavaScript code.';
exports.usage = '[hackerman stuff]';
exports.level = 1000;
exports.perms = [];
exports.cooldown = 0;
exports.dmable = false;

exports.run = async message => {
    function clean(text){
        if (typeof(text) === 'string') return text.replace(/[`@]/g, `$1${String.fromCharCode(8203)}`);
        else return text;
    }
    try {
        let code = message.args.join(' ');
        let evaled = await eval(code);

        if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
        message.channel.send(clean(evaled).substr(0, 1990), {code:"xl"}).then(msg => deletion(msg));
    }
    catch (err){
        message.channel.send(`\`\`\`xl\nERROR:\n${clean(err)}\n\`\`\``).then(msg => deletion(msg));
    }
    async function deletion(msg){
        await msg.react('❌');
        let filter = (reaction, user) => reaction.emoji.name == '❌' && client.perms.isGod(user.id);
        let collector = msg.createReactionCollector(filter, {time:10000});
        collector.on('collect', () => msg.delete());
        collector.on('end', () => !msg.deleted ? msg.reactions.cache.get('❌').users.remove() : null);
    }
}