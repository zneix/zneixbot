const fs = require('fs');
const discord = require('discord.js');
const bot = new discord.Client();
const config = require('./config.json');
bot.login(process.env.token);
// const config = require('./config-beta.json');
// bot.login(config.tokenBETA); // ======================================================== CHANGE THE TOKEN ========================================================
// bot.login(config.token);

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
	if(!bot.commands.has(command)) return;
	// try {bot.commands.get(command).execute(message, amountGuilds, amountUsers, config.botver, args, bot, config.prefix, serverIcon, fs);}
	if (command === `agis`) {try {bot.commands.get(command).execute(message, bot);} catch (error) {console.error(error);message.channel.send(`An error occured!`);}}
	// if (command === `badguy`) {try {bot.commands.get(command).execute(message, args, fs);} catch (error) {console.error(error);message.channel.send(`An error occured!`);}}
	if (command === `devtool`) {try {bot.commands.get(command).execute(message, args, bot, config);} catch (error) {console.error(error);message.channel.send(`An error occured!`);}}
	if (command === `fanfik`) {try {bot.commands.get(command).execute(message);} catch (error) {console.error(error);message.channel.send(`An error occured!`);}}
	if (command === `help`) {try {bot.commands.get(command).execute(message);} catch (error) {console.error(error);message.channel.send(`An error occured!`);}}
	if (command === `inaczej`) {try {bot.commands.get(command).execute(message);} catch (error) {console.error(error);message.channel.send(`An error occured!`);}}
	if (command === `leave`) {try {bot.commands.get(command).execute(message);} catch (error) {console.error(error);message.channel.send(`An error occured!`);}}
	if (command === `lenny`) {try {bot.commands.get(command).execute(message);} catch (error) {console.error(error);message.channel.send(`An error occured!`);}}
	if (command === `mpurge`) {try {bot.commands.get(command).execute(message, args, config);} catch (error) {console.error(error);message.channel.send(`An error occured!`);}}
	if (command === `nsfw`) {try {bot.commands.get(command).execute(message, args);} catch (error) {console.error(error);message.channel.send(`An error occured!`);}}
	if (command === `ping`) {try {bot.commands.get(command).execute(message, bot);} catch (error) {console.error(error);message.channel.send(`An error occured!`);}}
	if (command === `server`) {try {bot.commands.get(command).execute(message, bot, serverIcon);} catch (error) {console.error(error);message.channel.send(`An error occured!`);}}
	if (command === `stats`) {try {bot.commands.get(command).execute(message, amountGuilds, amountUsers, config);} catch (error) {console.error(error);message.channel.send(`An error occured!`);}}
	if (command === `summon`) {try {bot.commands.get(command).execute(message);} catch (error) {console.error(error);message.channel.send(`An error occured!`);}}
	if (command === `tagme`) {try {bot.commands.get(command).execute(message);} catch (error) {console.error(error);message.channel.send(`An error occured!`);}}
	if (command === `up`) {try {bot.commands.get(command).execute(message);} catch (error) {console.error(error);message.channel.send(`An error occured!`);}}
	if (command === `user`) {try {bot.commands.get(command).execute(message, args, bot);} catch (error) {console.error(error);message.channel.send(`An error occured!`);}}
	if (command === `vck`) {try {bot.commands.get(command).execute(message, bot);} catch (error) {console.error(error);message.channel.send(`An error occured!`);}}
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
	bot.channels.get(config.logsMsg).send(`'${whojoined}' joined the chat ;D`);
});
bot.on('guildMemberRemove', wholeft => {
	bot.channels.get(config.logsMsg).send(`${wholeft} fucking left D:`);
});
bot.on('guildMemberUpdate', whoupdated => {
	console.log(`'${whoupdated.user.tag}' got an update ;v`);
});
bot.on('guildBanAdd', (hisguild, wholeft) => {
	bot.channels.get(config.logsMsg).send(`${wholeft} got a hit with banhammer from '${hisguild}' :slight_smile:`);
});