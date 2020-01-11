let fs = require('fs');
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
    "dns": ["getip"],
    "emote": ["emoji", "showemote"],
    "feedback": ["devmsg"],
    "help": ["h", "commands", "pomoc", "komendy"],
    "isbanned": ["isban", "checkban"],
    "lenny": ["lennyface"],
    "leaderboard": ["levels", "lvls"],
    "math": ["calc", "calculate"],
    "ping": ["uptime"],
    "server": ["serverinfo"],
    "snowflake": ["sf", "discordid"],
    "temperature": ["temp"],
    "user": ["userinfo", "lookup", "whois"],
    "kick": ["yeet"],
    "purge": ["clean", "clear", "prune"],
    "rank": ["level", "lvl"],
    "region": ["serverregion"],
    "unban": ["pardon"],
    "echo": ["say"],
    "botnick": ["botname"],
    "eval": ["debug", "evaluate", "sudo", "superuserdo", "averycoolcommandthatonlybotownercanuse"],
    "wednesday": ["wed"]
}
function getCommand(client, command){
    let cmd = client.commands.get(command);
    if (!cmd){
        Object.keys(aliases).forEach(x => {
            if (aliases[x].includes(command)) cmd = client.commands.get(x);
        });
    }
    return cmd;
}
function getAliases(command){
    return aliases[commad];
}
exports.aliases = aliases;
exports.getCommand = getCommand;
exports.getAliases = getAliases;
function loadEvent(client, file){
    let event = require(`../events/${file}`);
    let name = file.split(".")[0];
    client.on(name, event.bind(null, client));
    delete require.cache[require.resolve(`../events/${file}`)];
}
function loadCommand(client, file){
    if (!file.endsWith(".js")) return;
    let props = require(`../commands/${file}`);
    let name = file.split(".")[0];
    client.commands.set(name, props);
}
function loadEvents(client){
    fs.readdir(`./events`, (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => loadEvent(client, file));
    });    
}
function loadCommands(client){
    fs.readdir(`./commands`, (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => loadCommand(client, file));
    });
}
exports.loadEvents = loadEvents;
exports.loadCommands = loadCommands;
exports.loadAll = function(client){
    loadEvents(client);
    loadCommands(client);
}