let fs = require('fs');
let aliases = {
    "%": ["percent", "procent"],
    "8ball": ["ask"],
    "about": ["info", "botinfo"],
    "addemote": ["addemoji", "createemote", "createemoji"],
    "avatar": ["awatar", "pfp"],
    "ban": ["banish"],
    "coinflip": ["cf"],
    "color": ["kolor"],
    "config": ["cf", "cfg"],
    "currency": ["curr", "money"],
    "dns": ["getip"],
    "emote": ["emoji", "showemote"],
    "feedback": ["devmsg"],
    "help": ["h", "commands", "pomoc", "komendy"],
    "isbanned": ["isban", "checkban"],
    "lenny": ["lennyface"],
    "leaderboard": ["levels", "lvls"],
    "math": ["calc", "calculate"],
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
exports.eventsCommandsLoad = function(client){
    fs.readdir(`./events`, (err, files) => {
        if (err) return console.error(err);
        files.forEach(async file => {
            let event = require(`../events/${file}`);
            let name = file.split(".")[0];
            await client.on(name, event.bind(null, client));
            delete require.cache[require.resolve(`../events/${file}`)];
        });
    });
    fs.readdir(`./commands`, (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
            if (!file.endsWith(".js")) return;
            let props = require(`../commands/${file}`);
            let name = file.split(".")[0];
            client.commands.set(name, props);
        });
    });
}