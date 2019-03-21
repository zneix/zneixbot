const fs = require('fs');
const discord = require('discord.js');
const bot = new discord.Client();
// bot.login(process.env.token);
// const config = require('./config.json');
const config = require('./config-beta.json');
bot.login(config.tokenBETA); // ======================================================== CHANGE THE TOKEN ========================================================
// bot.login(config.token);

const database = require(config.dbpath);
bot.commands = new discord.Collection();
bot.orders = new discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(cfile => cfile.endsWith('.js'));
for (const cfile of commandFiles) {
	const command = require(`./commands/${cfile}`);
	bot.commands.set(command.name, command);}
const orderFiles = fs.readdirSync('./orders').filter(ofile => ofile.endsWith('.js'));
for (const ofile of orderFiles) { //orders handler
	const order = require(`./orders/${ofile}`);
	bot.orders.set(order.name, order);}

bot.once('ready', () => { //one-time console logger
	const botServers = bot.guilds;
	try {bot.orders.get(`login`).execute(bot, config, botServers);}
	catch (error) {console.error(error);bot.users.get(config.devid).send(`zneixbot failed to log a client logon\`\`\`\n${error}\n\`\`\``);}
});
bot.on('message', message => {
	if (message.channel.type === "dm") return null;
	const messAuthorID = message.author.id;
	try {bot.orders.get(`msglog`).execute(message, bot, config, messAuthorID);}
	catch (error) {console.error(error);bot.users.get(config.devid).send(`zneixbot failed to log a message\`\`\`\n${error}\n\`\`\``);}
	message.content.toLowerCase();
	if (!message.content.startsWith(config.prefix)) return; //exit early if message don't start with pref or it's from a bot
	if (message.author.bot) return; //exit early if message don't start with pref or it's from a bot
	const args = message.content.slice(config.prefix.length).split(/ +/); //spliting arguments into args[x]
	const command = args.shift(); //shifting arguments to lowercase
	const amountGuilds = bot.guilds.size;
	const amountUsers = bot.users.size;
	const serverIcon = message.guild.iconURL;
	// if(!bot.commands.has(command)) return;
	// try {bot.commands.get(command).execute(message, amountGuilds, amountUsers, config.botver, args, bot, config.prefix, serverIcon, fs);}
	if (command === `agis`) {try {bot.commands.get(command).execute(message, bot);} catch (error) {console.error(error);message.channel.send(config.errmess);}}
	// if (command === `badguy`) {try {bot.commands.get(command).execute(message, args, fs);} catch (error) {console.error(error);message.channel.send(config.errmess);}}
	if (command === `devtool`) {try {bot.commands.get(command).execute(message, args, bot, config);} catch (error) {console.error(error);message.channel.send(config.errmess);}}
	if (command === `fanfik`) {try {bot.commands.get(command).execute(message);} catch (error) {console.error(error);message.channel.send(config.errmess);}}
	if (command === `help`) {try {bot.commands.get(command).execute(message, config);} catch (error) {console.error(error);message.channel.send(config.errmess);}}
	if (command === `inaczej`) {try {bot.commands.get(command).execute(message);} catch (error) {console.error(error);message.channel.send(config.errmess);}}
	if (command === `init`) {try {bot.commands.get(command).execute(message, database, config, fs);} catch (error) {console.error(error);message.channel.send(config.errmess);} 
	if (command === `leave`) {try {bot.commands.get(command).execute(message);} catch (error) {console.error(error);message.channel.send(config.errmess);}}
	if (command === `lenny`) {try {bot.commands.get(command).execute(message);} catch (error) {console.error(error);message.channel.send(config.errmess);}}
	if (command === `mpurge`) {try {bot.commands.get(command).execute(message, args, config);} catch (error) {console.error(error);message.channel.send(config.errmess);}}
	if (command === `nsfw`) {try {bot.commands.get(command).execute(message, args);} catch (error) {console.error(error);message.channel.send(config.errmess);}}
	if (command === `ping`) {try {bot.commands.get(command).execute(message, bot);} catch (error) {console.error(error);message.channel.send(config.errmess);}}
	if (command === `server`) {try {bot.commands.get(command).execute(message, bot, serverIcon);} catch (error) {console.error(error);message.channel.send(config.errmess);}}
	if (command === `stats`) {try {bot.commands.get(command).execute(message, amountGuilds, amountUsers, config);} catch (error) {console.error(error);message.channel.send(config.errmess);}}
	if (command === `summon`) {try {bot.commands.get(command).execute(message);} catch (error) {console.error(error);message.channel.send(config.errmess);}}
	if (command === `tagme`) {try {bot.commands.get(command).execute(message);} catch (error) {console.error(error);message.channel.send(config.errmess);}}
	if (command === `up`) {try {bot.commands.get(command).execute(message);} catch (error) {console.error(error);message.channel.send(config.errmess);}}
	if (command === `user`) {try {bot.commands.get(command).execute(message, args, bot);} catch (error) {console.error(error);message.channel.send(config.errmess);}}
	if (command === `vck`) {try {bot.commands.get(command).execute(message, bot);} catch (error) {console.error(error);message.channel.send(config.errmess);}}
		// fs.readFileSync('./media/database.json', (err, data) => {});
		// database.guilds[message.guild.id] = {};
		// database.guilds[message.guild.id].papiez = "false";
		// database.guilds[message.guild.id].crefix = config.prefix;
		// fs.writeFile('./media/database.json', JSON.stringify(database, null, 4), () => {console.log("DID IT BAJ!");});
	}
	// if (command === `devtool`) {
	// if (message.author.id != config.devid) return message.channel.send(`This is a developer tool, you're not allowed to use it!`);
    //     if (!args.length) return message.reply(`You're epic!`);
    //     else if (args[0] === `66`) {
    //         bot.guilds.get(smark).members.get(config.devid).addRole(bdayboi);
    //         message.react('👌');
    //         return null;
    //     } else if (args[0] === `99`) {
    //         bot.guilds.get(smark).members.get(config.devid).addRole(bdayboi);
    //         message.react('🥚');
    //         return null;
    //     } else message.reply(`yes, sir!`);
	// 	return null;
	// }
});
bot.on('guildMemberAdd', whojoined => {
	bot.channels.get(config.logsMsg).send(`'${whojoined}' joined the chat (${whojoined.guild.name}) ;D`);
	console.log(`'${whojoined}' joined the chat (${whojoined.guild.name}) ;D`);
});
bot.on('guildMemberRemove', wholeft => {
	bot.channels.get(config.logsMsg).send(`${wholeft} fucking left from '${wholeft.guild.name}' D;`);
	console.log(`${wholeft} fucking left from '${wholeft.guild.name}' D;`);
});
bot.on('guildMemberUpdate', whoupdated => {
	bot.channels.get(config.logsMsg).send(`'${whoupdated.user.tag}' got an update in '${whoupdated.guild.name}' ;v`);
	console.log(`'${whoupdated.user.tag}' got an update in '${whoupdated.guild.name}' ;v`);
});
bot.on('guildBanAdd', (hisguild, wholeft) => {
	bot.channels.get(config.logsMsg).send(`${wholeft} got a hit with banhammer from '${hisguild.name}' :slight_smile:`);
	console.log(`${wholeft} got a hit with banhammer from '${hisguild.name}' :slight_smile:`);
});
// bot.on('guildCreate', guildo => {
// 	guildo.owner.user.send(`Hewwo ${guildo.owner.user.username}, I just joined your server!\nI'm ${bot.user.username} - discord bot coded by zneix (<@!${config.devid}>)\nIf you have any questions, you can always type \`${config.prefix}help\` in your server of DM my creator ;D`);
// });