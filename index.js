//libs and utils
const Discord = require('discord.js');
let mongo = require('./src/utils/mongodb');
let load = require('./src/utils/loader');

//client deps
global.client = new Discord.Client({disableEveryone:true}); //appending client namespace to global object
client.config = require('./src/json/config');
client.version = require('./package.json').version;
client.commands = load.commands(client); //global command object
client.emoteHandler = require('./src/utils/emotes'); //utility for finding, sanitizing and detecting emotes in strings
client.perms = require('./src/utils/perms'); //utility for working with permission restrictions and levels
client.cron = require('./src/utils/cron');
client.logger = require('./src/utils/logger');

client.go = new Object;
/* property above is GuildsObject - it's supposed to have few props:
config - guild's config fetched from database)
tr (TalkedRecently, Set) - cooldown Set used by leveling system
fetchedMemebers (boolean) - whenever fetching members has been made for this guild since bot has started
*/
client.cc = 0; //CommandCount - number of commands used since last reboot

(async function(){
    client.db = await mongo.client.connect().catch(err => {console.error(err);process.emit('SIGINT');});
    client.levels = await client.db.utils.permlevels(); //getting levels of priviledged users from database
    load.events(); //pre-loading events
    //SIGINT and process.exit defs for graceful shutdowns
    load.gracefulExits();
    await client.login(require('./src/json/auth').token).catch(err => {console.error(err);process.emit('SIGINT');}); //logging in before initializing agenda
})();