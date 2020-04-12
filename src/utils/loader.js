const enmap = require('enmap');
const fs = require('fs');
let aliases = {
    "%": ["percent", "procent"],
    "8ball": ["ask"],
    "about": ["info", "botinfo"],
    "addemote": ["addemoji", "createemote", "createemoji"],
    "avatar": ["awatar", "pfp"],
    "coinflip": ["cf"],
    "color": ["kolor"],
    "config": ["cfg"],
    "currency": ["curr", "money"],
    "emote": ["emoji", "showemote"],
    "help": ["h", "commands", "pomoc", "komendy"],
    "isbanned": ["isban", "checkban"],
    "lenny": ["lennyface"],
    "leaderboard": ["levels", "lvls"],
    "math": ["calc", "calculate"],
    "ping": ["uptime"],
    "role": ["roles"],
    "rps": ["rockpaperscissors"],
    "server": ["serverinfo"],
    "snowflake": ["sf", "discordid"],
    "suggest": ["feedback", "msgdev"],
    "temperature": ["temp"],
    "user": ["userinfo", "lookup", "whois"],
    "kick": ["yeet"],
    "purge": ["clean", "clear", "prune"],
    "rank": ["level", "lvl"],
    "region": ["serverregion"],
    "resolve": ["dns"],
    "unban": ["pardon"],
    "echo": ["say"],
    "botnick": ["botname"],
    "eval": ["debug", "sudo"],
    "wednesday": ["wed"]
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
            client.cooldowns[name] = new Set; //initializing a set for each command
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
        console.log('!!! SIGINT DETECTED !!!');
        await client.db.SIGINT();
        process.exit();
    });
    process.on('exit', code => console.log(`[node] Exit code: ${code}`));
}