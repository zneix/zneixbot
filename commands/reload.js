exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Reloads command with latest code.`;
exports.usage = `**{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} (command)**`;
exports.perms = ['admin', false];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(1, async () => {
        let cmd = require('../utils/eventCommandHandler').getCommand(client, message.args[0].toLowerCase());
        let cmdname = cmd.name.replace(/{PREFIX}/, '');
        //throwing an error if command does not exist
        if (!client.commands.has(cmdname)) throw `Command \`${cmdname}\` not found! Try **${message.guild.prefix}load** instead.`;
        //removing command
        client.commands.delete(cmdname);
        delete require.cache[require.resolve(`./${cmdname}.js`)];
        //re-initialization of the command
        let props = require(`./${cmdname}.js`);
        client.commands.set(cmdname, props);
        require(`./../src/embeds/commandLoaded`)(client, message, true, cmdname);
    });
}