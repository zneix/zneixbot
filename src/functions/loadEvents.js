const fs = require('fs');
module.exports = client => {
    loadEvents = function(){
        fs.readdir(`./events`, (err, files) => {
            if (err) return console.error(err);
            files.forEach(file => {
                let event = require(`../../events/${file}`);
                let name = file.split(".")[0];
                client.on(name, event.bind(null, client));
                delete require.cache[require.resolve(`../../events/${file}`)];
            });
        });
    }
    return loadEvents();
}