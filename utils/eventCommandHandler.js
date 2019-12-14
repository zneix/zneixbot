let fs = require('fs');
let clones = {
    "8ball": ["ask"],
    "about": ["info", "botinfo"],
    "addemote": ["addemoji", "createemote", "createemoji"],
    "avatar": ["awatar", "pfp"],
    "coinflip": ["cf"],
    "currency": ["curr", "money"],
    "emote": ["emoji", "showemote"],
    "feedback": ["devmsg"],
    "help": ["h", "commands", "pomoc", "komendy"],
    "isbanned": ["isban", "checkban"],
    "lenny": ["lennyface"],
    "math": ["calc", "calculate"],
    "server": ["serverinfo"],
    "temperature": ["temp"],
    "user": ["userinfo", "lookup", "whois"],
    "kick": ["yeet"],
    "purge": ["clean", "clear", "prune"],
    "unban": ["pardon"],
    "echo": ["say"],
    "botnick": ["botname"],
    "eval": ["sudo"]
}
exports.clones = clones;
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
            props.cloned = false;
            let name = file.split(".")[0];
            client.commands.set(name, props);
        });
        //loading clones
        let cloneArray = Object.keys(clones);
        for (i=0;i < cloneArray.length;i++) {
            let cmd = client.commands.get(cloneArray[i]);
            if (cmd){
                //actual cloning
                for (y=0;y < clones[cloneArray[i]].length;y++) {
                    cmd.cloned = cloneArray[i];
                    client.commands.set(clones[cloneArray[i]][y], cmd);
                }
            }
            else console.log("There was an error while cloning "+cloneArray[i]);
        }
    });
}