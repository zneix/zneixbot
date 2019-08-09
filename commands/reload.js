exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Reloads command with latest code.`;
exports.usage = `**{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}** ***(command)***`
exports.perms = `owner`

exports.run = async (client, message) => {
    message.command(1, async () => {
        let cmd = message.args[0].toLowerCase();
        //throwing an error if command does not exist
        if (!client.commands.has(cmd)) {throw `Command \`${cmd}\` not found! Try **${client.config.prefix}load** instead.`}
        //removing command
        client.commands.delete(cmd);
        delete require.cache[require.resolve(`./${cmd}.js`)];
        //re-initialization of the command
        let props = require(`./${cmd}.js`);
        client.commands.set(cmd, props);
        require(`./../src/embeds/commandLoaded`)(client, message, true, cmd);
    });
}