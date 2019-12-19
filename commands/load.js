exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Loads command from commands folder if it is unloaded, or newly installed.`;
exports.usage = `**{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} (command)**`;
exports.perms = ['admin', false];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(1, async () => {
        let cmd = message.args[0].toLowerCase();
        //checking if command already exists
        if (client.commands.has(cmd)) throw `Command \`${cmd}\` is already loaded! Try **${message.guild.prefix}reload** instead.`;
        if (!require('fs').existsSync(__dirname+`\\${cmd}.js`)) throw `File \`${cmd}.js\` does not exist in command folder!`;
        //assigning command
        let props = require(`./${cmd}.js`);
        await client.commands.set(cmd, props);
        require(`./../src/embeds/commandLoaded`)(client, message, false, cmd);
    });
}