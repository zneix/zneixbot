const fs = require('fs');
module.exports = (client, Promise) => {
    saveConfig = async function(){
        return new Promise((resolve, reject) => {
            fs.writeFile(`../json/config.json`, JSON.stringify(client.config, null, 4), function(err){
                resolve("Saved config.json!");
                if (err) reject(err);
            });
        });
    }
    return saveConfig();
}