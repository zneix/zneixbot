//libs and utils
const Discord = require('discord.js');
let mongo = require('./src/utils/mongodb');
let agenda = require('./src/utils/agenda');
let load = require('./src/utils/loader');

//client deps
let client = new Discord.Client({disableEveryone:true});
client.config = require('./src/json/config');
client.version = JSON.parse(require('fs').readFileSync('package.json').toString()).version;
client.commands = load.commands(client); //global command object
client.emoteHandler = require('./src/utils/emotes')(client); //utility for finding, sanitizing and detecting emotes in strings
client.perms = require('./src/utils/perms')(client); //utility for working with permission restrictions and levels

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
    load.events(client); //pre-loading events
    await client.login(require('./src/json/auth').token).catch(err => {console.error(err);process.emit('SIGINT');}); //logging in before initializing agenda
    client.agenda = await agenda.createAgenda(client.db); // .catch(err => {console.error(err);process.emit('SIGINT');});
    //SIGINT and process.exit defs for graceful shutdowns
    load.gracefulExits(client, agenda);
})();