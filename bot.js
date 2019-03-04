const fs = require('fs');
const discord = require('discord.js');
const {prefix, botver, logsLogin, logsMsg} = require('./config.json');
// const {prefix, botver, logsLogin, logsMsg, token} = require('./config-beta.json');
const bot = new discord.Client();
bot.login(process.env.token);
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
	bot.orders.get(`login`).execute(bot, prefix, botver, botServers, logsLogin);});
bot.on('message', message => {
	const messAuthor = message.author.id;
	const serverIcon = message.guild.iconURL;
	bot.orders.get(`msglog`).execute(message, bot, logsLogin, messAuthor, logsMsg);
	const meslow = message.content.toLowerCase(); //shifting to lowercase
	if (!meslow.startsWith(prefix)) return; //exit early if message don't start with pref or it's from a bot
	if (message.author.bot) return; //exit early if message don't start with pref or it's from a bot
	const args = meslow.slice(prefix.length).split(/ +/); //spliting arguments into args[x]
	const command = args.shift(); //shifting arguments to lowercase
	const amountGuilds = bot.guilds.size;
	const amountUsers = bot.users.size;
	if(!bot.commands.has(command)) return;
	try {bot.commands.get(command).execute(message, amountGuilds, amountUsers, botver, args, bot, prefix, serverIcon, fs);}
	catch (error) {console.error(error);message.channel.send(`An error occured!`);}});
bot.on('guildMemberAdd', whojoined => {
	bot.channels.get(logsMsg).send(`${whojoined} joined the chat ;D`);
});
bot.on('guildMemberRemove', wholeft => {
	bot.channels.get(logsMsg).send(`${wholeft} fucking left D:`);
});
bot.on('guildMemberUpdate', whoupdated => {
	console.log(`${whoupdated.user.tag} got an update ;v`);
});
bot.on('guildBanAdd', whobanned => {
	bot.channels.get(logsMsg).send(`${whobanned} got a hit with banhammer :slight_smile:`);
});