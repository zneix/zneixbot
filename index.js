//npm libraries
const Discord = require('discord.js'); //discord core library
const enmap = require('enmap'); //enmap object for command handler
const RC = require('reaction-core'); //reaction core package for emote menus
const Promise = require('bluebird'); //module for error handler and rejections while using fs.writeFile
Promise.config({longStackTraces:true}); //enabling long stack trees
const fetch = require('node-fetch'); //package for url JSON fetching
fetch.Promise = Promise; //fixing custom Promises
require('npm-package-to-env').config(); //importing values from package.json to process.env

//JSON data
const auth = require(`./src/json/auth`); //token and module authentication
const config = require(`./src/json/config.json`); //global client settings
const perms = require(`./src/json/perms`)(); //permission database

//discord client extras
const client = new Discord.Client({disableEveryone:true}); //declaring new discord client
client.config = config; //global config
client.perms = perms; //global permissions sets
client.commands = new enmap(); //declaring new enmap object for command handler
client.RCHandler = new RC.Handler(); //global emote menu handler
client.fetch = fetch; //declaring global fetch function
client.version = process.env.npm_package_version; //global version
client.tr = new Object(); //global object with Talked Recently Sets for every guild

//utils load
client.save = require(`./utils/save`); //saving functions combined
client.logger = require('./utils/logger')(client); //logging in console and in logs channel
client.emoteHandler = require(`./utils/emoteHandler`)(client);
client.db = require('./utils/mongodb'); //database connection interface

//executing rest of code after establishing successful database connection
client.db.connect(async (err, mongoclient) => {
    if (err) return console.error(`[!mongodb:index.js] Error while connecting:\n${err}`);
    console.log('[mongodb:index.js] Connected to MongoDB!');
    require('./utils/errorHandler'); //executing commands and handling thrown errors
    require('./utils/eventCommandHandler').eventsCommandsLoad(client); //event (and command) handler load
    client.agenda = await require('./utils/agenda').createAgenda(mongoclient);
    require('./utils/agenda').defineJobs(client, client.agenda);

    //discord authentication - logging to WebSocket with specified Discord client token
    client.login(auth.token).catch(async err => {
        console.log(err);
        process.emit('SIGINT'); //closing database connection upon error on Discord WebSocket to save Mongo's bandwidth
    });
});