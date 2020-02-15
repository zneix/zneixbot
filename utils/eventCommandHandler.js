let fs = require('fs');
exports.aliases = {
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
    "role": ["roles"],
    "rps": ["rockpaperscissors"],
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
exports.getCommand = function(client, command){
    let cmd = client.commands.get(command);
    if (!cmd){
        Object.keys(exports.aliases).forEach(x => {
            if (exports.aliases[x].includes(command)) cmd = client.commands.get(x);
        });
    }
    return cmd;
}
exports.getAliases = function(command){
    if (!exports.aliases[command]) return null;
    return exports.aliases[command];
}
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
exports.loadEvents = function(client){
    fs.readdir(`./events`, (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => loadEvent(client, file));
    });    
}
exports.loadCommands = function(client){
    fs.readdir(`./commands`, (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => loadCommand(client, file));
    });
}
exports.loadAll = function(client){
    exports.loadEvents(client);
    exports.loadCommands(client);
}