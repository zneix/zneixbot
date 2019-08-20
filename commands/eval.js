exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Executes provided code.`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} [code]`;
exports.perms = 'owner';

exports.run = async (client, message) => {
    message.cmd = this;
    message.command(false, async () => {
        function clean(text) {
            if (typeof(text) === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else return text;
          }
        try {
            let code = message.args.join(' ');
            let evaled = await eval(code);

            if (typeof evaled !== "string") evaled = require('util').inspect(evaled);
            message.channel.send(clean(evaled).substr(0, 1990), {code:"xl"});
        }
        catch (err) {
            message.channel.send(`\`\`\`xl\nERROR:\n${clean(err)}\n\`\`\``);
        }
    });
}