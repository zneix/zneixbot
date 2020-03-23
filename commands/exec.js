exports.description = `Executes shell command.`;
exports.usage = '<hackerman stuff>';
exports.level = 1000;
exports.perms = [];
exports.cooldown = 0;
exports.pipeable = false;

exports.run = async (client, message) => {
    if (!message.args.length) throw ['args', 1];
    function clean(text){
        if (typeof(text) === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else return text;
    }
    let shell = require('child_process');
    try {
        let cmd = message.args.join(' ');
        let output = shell.execSync(cmd).toString();

        if (typeof output !== "string") output = require('util').inspect(output);
        message.channel.send(clean(output).substr(0, 1990)  || 'No stdout', {code:"xl"}).then(msg => deletion(msg));
    }
    catch (err){
        message.channel.send(`\`\`\`xl\nERROR:\n${clean(err)}\n\`\`\``).then(msg => deletion(msg));
    }
    async function deletion(msg){
        await msg.react('❌');
        let perms = require('../src/utils/perms')(client);
        let filter = (reaction, user) => reaction.emoji.name === '❌' && perms.isGod(user.id);
        let collector = msg.createReactionCollector(filter, {time:10000});
        collector.on('collect', () => msg.delete());
        collector.on('end', () => !msg.deleted ? msg.reactions.cache.get('❌').remove() : null);
    }
}