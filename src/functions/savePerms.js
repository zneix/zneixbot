module.exports = (client, Promise) => {
    savePerms = async function(){
        return new Promise((resolve, reject) => {
            client.fs.writeFile(`../json/perms.json`, JSON.stringify(client.perms, null, 4), function(err){
                resolve("Saved perms.json!");
                if (err) reject(err);
            });
        });
    }
    return savePerms();
}