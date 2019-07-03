//npm libraries
const Discord = require('discord.js'); //discord core library
const enmap = require('enmap'); //enmap object for command handler
const fs = require('fs');
const schedule = require('node-schedule'); //yet useless
require('npm-package-to-env').config(); //importing version value from package.json
require(`./extensions/errorHandler`); //handling thrown errors

var Promise = require('bluebird'); //module for error handler and rejections while using fs.writeFile
Promise.config({longStackTraces:true}); //enabling long stack trees

//JSON data
const auth = require(`./src/json/auth.json`); //token and module authentication
const config = require(`./src/json/config.json`); //global client settings
const database = require(`./src/json/database.json`); //general database for local config data
const perms = require(`./src/json/perms.json`); //permission database

//discord client extras
const client = new Discord.Client(); //declaring new discord client
client.config = config; //global config
client.database = database; //global database
client.perms = perms; //global permissions sets
client.commands = new enmap(); //declaring new enmap object for command handler
client.version = process.env.npm_package_version; //global version
client.schedule = schedule; //yet useless
client.saveConfig = require(`./src/functions/saveConfig`); //function for saving src/json/config.json
client.saveDB = require(`./src/functions/saveDB`); //function for saving src/json/database.json
client.savePerms = require(`./src/functions/savePerms`); //function for saving src/json/perms.json

//handlers
require(`./src/functions/loadEvents`)(client); //event handler
require(`./src/functions/loadCommands`)(client); //command handler

//discord authentication
client.login(auth.token); //logging to WebSocket with specified client token