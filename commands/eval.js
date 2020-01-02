exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = 'Executes provided Javascript code.';
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} <hackerman stuff>`;
exports.perms = ['owner', false];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(false, async () => {
        function clean(text){
            if (typeof(text) === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else return text;
        }
        try {
            let code = message.args.join(' ');
            let evaled = await eval(code);

            if (typeof evaled !== "string") evaled = require('util').inspect(evaled);
            message.channel.send(clean(evaled).substr(0, 1990), {code:"xl"}).then(msg => deletion(msg));
        }
        catch (err){
            message.channel.send(`\`\`\`xl\nERROR:\n${clean(err)}\n\`\`\``).then(msg => deletion(msg));
        }
        async function deletion(msg){
            await msg.react('❌');
            let filter = (reaction, user) => reaction.emoji.name === '❌' && client.perms.owner.includes(user.id)
            let collector = msg.createReactionCollector(filter, {time:10000});
            collector.on('collect', () => msg.delete());
            collector.on('end', () => msg.reactions.get('❌').remove());
        }
    });
}