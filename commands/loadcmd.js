exports.description = 'Loads command from commands folder if it is unloaded, or newly installed.';
exports.usage = '<command>';
exports.level = 500;
exports.perms = [];
exports.cooldown = 0;
exports.dmable = false;

exports.run = async message => {
    let cmdName = message.args[0].toLowerCase();
    //checking if command already exists
    if (client.commands.has(cmdName)) throw ['normal', `Command \`${cmdName}\` is already loaded! Try **${message.prefix}reload ${cmdName}**`];
    if (!require('fs').existsSync(require.resolve(`./${cmdName}.js`))) throw ['normal', `File \`${cmdName}.js\` does not exist in command folder!`];
    try {
        //initializing command
        let props = require(`./${cmdName}.js`);
        props.name = cmdName; //asserting name of the command to it's object
        client.cooldowns[cmdName] = new Set; //setting a cooldown set for new command
        client.commands.set(cmdName, props);
        require('../src/embeds/commandReLoaded')(message, false, props);
    }
    catch (err){ throw ['normal', err.toString()]; }
}