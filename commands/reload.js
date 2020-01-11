exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = 'Reloads command with latest code.';
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} <command>`;
exports.perms = ['admin', false];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(1, async () => {
        switch(message.args[0].toLowerCase()){
            case 'cmd':
            case 'command':
                return cmd();
            case 'ev':
            case 'event':
                break;
            case 'util':
                break;
            //bulk functions
            case 'cmds':
            case 'commands':
                break;
            case 'evs':
            case 'events':
                break;
            case 'utils':
                break;
            case 'all':
                break;
            //wromg selection
            default:
                break;
        }
        function cmd(){
            let cmd = require('../utils/eventCommandHandler').getCommand(client, message.args[1].toLowerCase());
            //emitting an error if command does not exist
            if (!cmd) return {code: '26', msg: `command \`${message.args[1]}\` not found! Try **${message.guild.prefix}load** instead`};
            let cmdname = cmd.name.replace(/{PREFIX}/, '');
            //removing command
            client.commands.delete(cmdname);
            delete require.cache[require.resolve(`./${cmdname}.js`)];
            //re-initialization of the command
            let props = require(`./${cmdname}.js`);
            client.commands.set(cmdname, props);
            require(`./../src/embeds/commandLoaded`)(client, message, true, cmdname);
        }
    });
}