let fs = require('fs');
let clones = {
    "help": ["h", "commands"],
    "8ball": ["ask"]
}
exports.clones = clones;
exports.load = function(client){
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
        let cloneArray = Object.getOwnPropertyNames(clones);
        for (i=0;i < cloneArray.length;i++) {
            let cmd = client.commands.get(cloneArray[i]);
            if (!cmd) console.log("There was an error while cloning "+cloneArray[i]);
            else {
                //actual cloning
                for (y=0;y < clones[cloneArray[i]].length;y++) {
                    cmd.cloned = cloneArray[i];
                    client.commands.set(clones[cloneArray[i]][y], cmd);
                    // console.log(`cloned ${cloneArray[i]} into ${clones[cloneArray[i]][y]}!`);
                }
            }
        }   
    });
}