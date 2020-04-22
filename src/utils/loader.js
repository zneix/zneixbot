const enmap = require('enmap');
const fs = require('fs');
let aliases = {
    'config': ['cfg'],
    'echo': ['say'],
    'eval': ['debug', 'sudo'],
    'exec': ['shell', 'sh'],
    'help': ['h', 'commands'],
    'leaderboard': ['levels', 'lvls'],
    'ping': ['uptime'],
    'suggest': ['feedback', 'msgdev'],
    'rank': ['level', 'lvl']
}
exports.getCommand = function(name){
    let cmd = client.commands.get(name);
    if (cmd) return cmd;
    Object.keys(aliases).forEach(alias => {
        if (aliases[alias].includes(name)) cmd = client.commands.get(alias);
    });
    return cmd;
}
exports.getAliases = function(cmdname){
    return aliases[cmdname] ? aliases[cmdname] : null;
}
exports.getGuildConfig = async function(guild){
    if (!guild.available) return console.log(`{util-guilds-unavailable} ${guild.id || 'unknown'}`);
    if (client.go[guild.id]) return; //guild config is already there
    client.go[guild.id] = new Object;
    // client.go[guild.id].tr = new Set; // that's being set implemented for guilds with leveling enabled in leveling module manager
    let config = (await client.db.utils.find('guilds', {guildid: guild.id}))[0];
    if (!config) config = await client.db.utils.newGuildConfig(guild.id);
    client.go[guild.id].config = config;
}
exports.commands = function(){
    let commands = new enmap();
    client.cooldowns = new Object; //object, that's going to store all the cooldowns for now
    fs.readdir('./commands', (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
            if (!file.endsWith('.js')) return;
            let props = require(`../../commands/${file}`);
            let name = file.split('.')[0];
            props.name = name; //asserting name of the command to it's object
            client.cooldowns[name] = new Set; //initializing a cooldown set for each command
            commands.set(name, props);
        });
    });
    return commands;
}
exports.events = function(){
    fs.readdir('./events', (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
            if (!file.endsWith('.js')) return;
            let event = require(`../../events/${file}`);
            let name = file.split('.')[0];
            client.on(name, event);
            delete require.cache[require.resolve(`../../events/${file}`)];
        });
    });
}
exports.gracefulExits = async function(agenda){
    process.on('SIGINT', async code => {
        console.log('!!! SIGINT !!!');
        await client.db.SIGINT();
        process.exit();
    });
    process.on('exit', code => console.log(`[node] Exit code: ${code}`));
}