exports.description = 'Reloads command with latest code.';
exports.usage = '<command>';
exports.level = 500;
exports.perms = [];
exports.cooldown = 0;
exports.dmable = false;

exports.run = async message => {
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
            message.reply('Use cmd <command> for now');
            break;
    }
    function cmd(){
        let cmd = require('../src/utils/loader').getCommand(message.args[1].toLowerCase());
        //throwing an error if command does not exist
        if (!cmd) throw ['normal', `command \`${message.args[1]}\` not found! Try **${message.prefix}load ${message.args[1]}** instead`];
        //removing command
        client.commands.delete(cmd.name);
        delete require.cache[require.resolve(`./${cmd.name}.js`)];

        try {
            //re-initializing command
            let props = require(`./${cmd.name}.js`);
            props.name = cmd.name; //asserting name of the command to it's object
            client.cooldowns[cmd.name] = new Set; //resetting a cooldown set for new command
            client.commands.set(cmd.name, props);
            require(`./../src/embeds/commandReLoaded`)(message, true, cmd);
        }
        catch (err){ throw ['normal', err.toString()]; }
    }
}