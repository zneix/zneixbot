let fs = require('fs');
let Promise = require('bluebird');
Promise.config({longStackTraces:true});

exports.config = async function(client){
    return new Promise((resolve, reject) => {
        fs.writeFile(`../json/config.json`, JSON.stringify(client.config, null, 4), function(err){
            resolve("Saved config.json!");
            if (err) reject(err);
        });
    });
}

exports.db = async function(client){
    return new Promise((resolve, reject) => {
        fs.writeFile(`../json/database.json`, JSON.stringify(client.config, null, 4), function(err){
            resolve("Saved database.json!");
            if (err) reject(err);
        });
    });
}

exports.perms = async function(client){
    return new Promise((resolve, reject) => {
        fs.writeFile(`../json/perms.json`, JSON.stringify(client.perms, null, 4), function(err){
            resolve("Saved perms.json!");
            if (err) reject(err);
        });
    });
}