const fs = require('fs');
const discord = require('discord.js');
const {prefix, botver, logsLogin, logsMsg} = require('./config.json');
// const {prefix, botver, logsLogin, logsMsg, token} = require('./config-beta.json');
const bot = new discord.Client();
bot.login(token);

bot.commands = new discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

//one-time console logger
bot.once('ready', () => {
	let serverList = [];
	const botServers = bot.guilds;
	botServers.forEach(guild => { serverList.push(`\n${guild.name} #${guild.id}`) });
	console.log(
		`Connected, logged as ${bot.user.tag}`
		+`\nClient servers (${serverList.length}):${serverList}`
		+`\n==================================`);
			//logsLogin channel embed
			var currentdate = new Date(); 
			var datetime = "" + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
				+ currentdate.getSeconds();
				const loginEmbed = {
					color: 0x11ff11,
					author: {
						name: `Client logged in`
					},
					title: `Logged in as: ${bot.user.tag}`,
					description: `info message`,
					// thumbnail: {none},
					fields: [
						{
							name: `Time logged in`,
							value: `${datetime}`,
							inline: true
						},
						{
							name: `User count`,
							value: bot.users.size,
							inline: true
						},
						{
							name: `Channel count`,
							value: bot.channels.size,
							inline: true
						},
						{
							name: `Client servers (${serverList.length})`,
							value: `${serverList}`,
							inline: false
						}
					],
					timestamp: new Date(),
					footer: {
						icon_url: bot.user.avatarURL,
						text: `zneixbot by zneix#4433`
					}
				}
			bot.channels.get(logsLogin).send({embed:loginEmbed});
	bot.user.setPresence({ status: 'dnd', game: { name: `${prefix}help, ver: ${botver}`, url: 'https://www.twitch.tv/agis', type: 1 } });
});

//command handler
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	bot.commands.set(command.name, command);
}

bot.on('message', async message => {
	//zb server statements
	const serverIcon = message.guild.iconURL;
	const amountGuilds = bot.guilds.size;
	const amountUsers = bot.users.size;
	const GuildUsers = [];

	//listening 'n logging all messages
	const messType = message.type;
	// if (messType === '')
	if (message.channel.id !== logsLogin && message.channel.id !== logsMsg) {
		console.log(`[${message.author.username}||${message.channel.name}(${message.channel.id})]`+message.content
		);}
	//sending logs to 'logsMsg' channel
	if (message.content.startsWith(prefix)) {
		const msgCommandEmbed = {

		}; bot.channels.get(logsMsg).send(msgCommandEmbed);
	}
	if (message.channel.id !== logsLogin && message.channel.id !== logsMsg) {
		const msgDefaultEmbed = {
			color: 0x6441A4,
			author: {name: `${message.author.username} sent a message`},
			thumbnail: {url: message.author.avatarURL},
			fields: [
				{
					name: `Location`,
					value: `Server:\`${message.guild.name}\`\nChannel:\`${message.channel.name}\``,
					inline: true
				},
				{
					name: `Type`,
					value: message.type,
					inline: true
				},
				{
					name: `Sent At`,
					value: message.createdAt,
					inline: true
				},
				{
					name: `Timestamp`,
					value: message.createdTimestamp,
					inline: true
				},
				{
					name: `TTS'ed?`,
					value: message.tts,
					inline: true
				},
				{
					name: `URL to the message`,
					value: message.url,
					inline: true
				},
				{
					name: `ID`,
					value: message.id,
					inline: true					
				},
				{
					name: `Message content`,
					value: message.content,
					inline: false
				}
			],
			timestamp: new Date(),
			footer: {
				icon_url: bot.user.avatarURL,
				text: `zneixbot by zneix#4433`
			}
		}; bot.channels.get(logsMsg).send({embed:msgDefaultEmbed});
		// bot.channels.get(logsMsg).send(
		// `${message.author.username}||${message.guild.name}`
		// +`\n${message.content}`
		// );
	}
	
	const meslow = message.content.toLowerCase(); //shifting to lowercase
	if (!meslow.startsWith(prefix)) return; //exit early if message don't start with pref or it's from a bot
	if (message.author.bot) return; //exit early if message don't start with pref or it's from a bot
	const args = meslow.slice(prefix.length).split(/ +/); //spliting arguments into args[x]
	const command = args.shift(); //shifting arguments to lowercase
	//content
	if (command === `agis`) {bot.commands.get('agis').execute(message, args);}
	else if (command === `help`) {bot.commands.get(`help`).execute(message, args);}
	else if (command === `inaczej`) {bot.commands.get(`inaczej`).execute(message, args);}
	else if (command === `leave`) {bot.commands.get(`leave`).execute(message, args);}
	else if (command === `lenny`) {bot.commands.get(`lenny`).execute(message, args);}
	else if (command === `nsfw`) {bot.commands.get(`nsfw`).execute(message, args);}
	else if (command === `ping`) {bot.commands.get(`ping`).execute(message, args);}
	else if (command === `server`) {bot.commands.get(`server`).execute(message, bot, serverIcon, GuildUsers);}
	else if (command === `summon`) {bot.commands.get(`summon`).execute(message, args);}
	else if (command === `tagme`) {bot.commands.get('tagme').execute(message, args);}
	else if (command === `user`) {bot.commands.get(`user`).execute(message, args, bot);}
	else if (command === `up`) {bot.commands.get(`up`).execute(message);}
	else if (command === `stats`) {bot.commands.get(`stats`).execute(message, bot, amountGuilds, amountUsers, botver);}
	else if (command === `vck`) {bot.commands.get(`vck`).execute(message);}

	//argument test
	else if (command === `args`) {
		if (!args.length) {
			return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
		} else if (args[0] === `play`) {
			return message.channel.send(`played :ok_hand:`);
			}
			message.channel.send(`First argument: ${args[0]}`);
	}
	// else if (command === `parent`) {
	// 	message.channel.send(`my parent is '${message.channel.parentID}'`);
	// }

	// const swearWords = ["Dlaczego po polsku?", "Kiedy kamerka?", "go MC", "sr", "Nigger", "Celled"];
	// if(swearWords.some(word => message.content.includes(word))) {
	// message.reply(` Twoja mama, zamknij jape pajacu`);
	// // or just message.delete();
	// }

	//eof
});