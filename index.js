//npm libraries
const Discord = require('discord.js'); //discord core library
const enmap = require('enmap'); //enmap object for command handler
require('npm-package-to-env').config(); //importing values from package.json to process.env
var Promise = require('bluebird'); //module for error handler and rejections while using fs.writeFile
Promise.config({longStackTraces:true}); //enabling long stack trees

//JSON data
const auth = require(`./src/json/auth`)(); //token and module authentication
const config = require(`./src/json/config.json`); //global client settings
const database = require(`./src/json/database.json`); //general database for local config data
const perms = require(`./src/json/perms`)(); //permission database

//discord client extras
const client = new Discord.Client(); //declaring new discord client
client.config = config; //global config
client.database = database; //global database
client.perms = perms; //global permissions sets
client.commands = new enmap(); //declaring new enmap object for command handler
client.version = process.env.npm_package_version; //global version

//utils load
client.save = require(`./utils/save`); //saving functions combined
client.logger = require('./utils/logger')(client); //logging in console and in logs channel
client.emoteHandler = require(`./utils/emoteHandler`)(client);
require(`./utils/errorHandler`); //executing commands and handling thrown errors
require(`./utils/loadEvents`)(client); //event handler
require(`./utils/loadCommands`)(client); //command handler

//discord authentication
client.login(auth.token); //logging to WebSocket with specified client token