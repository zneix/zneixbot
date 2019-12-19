exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Reloads command with latest code.`;
exports.usage = `**{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} (command)**`;
exports.perms = ['admin', false];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(1, async () => {
        let cmd = message.args[0].toLowerCase();
        //throwing an error if command does not exist
        if (!client.commands.has(cmd)) throw `Command \`${cmd}\` not found! Try **${message.guild.prefix}load** instead.`;
        //correction when using cloned command
        if (client.commands.get(cmd).cloned) cmd = client.commands.get(cmd).cloned;
        //removing command
        client.commands.delete(cmd);
        delete require.cache[require.resolve(`./${cmd}.js`)];
        //re-initialization of the command
        let props = require(`./${cmd}.js`);
        props.cloned = false;
        client.commands.set(cmd, props);
        //cloning those again
        let clones = require('../utils/eventCommandHandler').clones;
        if (clones[cmd]){
            for (i=0;i < clones[cmd].length;i++){
                //deletion
                client.commands.delete(clones[cmd][i]);
                // delete require.cache[require.resolve(`./${clones[cmd][i]}.js`)];
                //re-requiring
                let props = require(`./${cmd}.js`);
                props.cloned = cmd;
                client.commands.set(clones[cmd][i], props);
            }
        }
        require(`./../src/embeds/commandLoaded`)(client, message, true, cmd);
    });
}