exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Loads command from commands folder if it is unloaded, or newly installed.`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} ***(command)***`
exports.perms = `owner`

exports.run = async (client, message) => {
    message.command(1, async () => {
        let cmd = message.args[0].toLowerCase();
        //checking if command already exists
        if (client.commands.has(cmd)) throw `Command \`${cmd}\` is already loaded! Try **${client.config.prefix}reload** instead.`
        if (!client.fs.existsSync(__dirname+`\\${cmd}.js`)) throw `File \`${cmd}.js\` does not exist in command folder!`
        //assigning command
        let props = require(`./${cmd}.js`);
        client.commands.set(cmd, props);
        //message to user
        let desc = `Command **${client.config.prefix}${cmd}** has been loaded! Description:
        ${client.commands.get(cmd).description.replace(/{PREFIX}/g, client.config.prefix)}`;
        let fds = [
            {
                name:`**${client.config.prefix}${cmd}**`,
                value:`${client.commands.get(cmd).usage.replace(/{PREFIX}/g, client.config.prefix)}`
            },
        ];
        require(`./../src/embeds/okayInfoEmbed`)(client, message, desc, fds)
    });
}