let fs = require('fs');
exports.load = function(client){
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

// exports.substitute = function(name){}