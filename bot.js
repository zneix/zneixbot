const fs = require('fs');
const discord = require('discord.js');
const {prefix, botver} = require('./config.json');
const bot = new discord.Client();

bot.commands = new discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
bot.login(process.env.token);

//one-time console logger
bot.once('ready', () => {
		let serverList = [];
		const botServers = bot.guilds;
		botServers.forEach(guild => { serverList.push(`\n${guild.name} #${guild.id}`) });
		console.log(
			`Connected, logged as ${bot.user.tag}`
			+`\nClient servers (${serverList.length}):${serverList}`
			+`\n==================================`);
			//logs channel
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
			bot.channels.get(`510515460022992904`).send(
				{embed:loginEmbed}
				// `Connected, logged as ${bot.user.tag}`
				// +`\nClient servers (${serverList.length}):${serverList}`
				// +`\n==================================`
				// +`\n\nLogged on: ${datetime}`
				);
	bot.user.setPresence({ status: 'dnd', game: { name: `${prefix}help`, url: 'https://www.twitch.tv/agis', type: 1 } });
});

//declarations


//command handler
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	bot.commands.set(command.name, command);
}

bot.on('message', message => {
	//zb server statements
	const amountGuilds = bot.guilds.size;
	const amountUsers = bot.users.size;
	const meslow = message.content.toLowerCase();
	const GuildIntel = [
		`Server name: ${message.guild.name}`,
		`Server Owner: ${message.guild.ownerID}`,
		`Server created at: ${message.guild.createdAt}`,
		`Server icon: ${message.guild.iconURL}`,
		`\`Members:${message.guild.memberCount}\``
	];
	const GuildUsers = [];
	const serverIcon = message.guild.iconURL;

	//listening 'n logging all messages
	if (message.channel.id !== `510515460022992904`) {
		console.log(`[${message.author.username}||***//${message.channel.id}]`+message.content
		);}
	//sending logs to 'logs' channel
	/*
	if (message.channel.id !== `510515460022992904`) {
		bot.channels.get(`510515460022992904`).send(
		`${message.author.username}||${message.guild.name}`
		+`\n${message.content}`
		);}
	*/
	if (!meslow.startsWith(prefix) || message.author.bot) return; //exit early if message don't start with pref or it's from a bot
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
	else if (command === `server`) {bot.commands.get(`server`).execute(message, bot, GuildIntel, serverIcon, GuildUsers);}
	else if (command === `summon`) {bot.commands.get(`summon`).execute(message, args);}
	else if (command === `tagme`) {bot.commands.get('tagme').execute(message, args);}
	else if (command === `user`) {bot.commands.get(`user`).execute(message, args, bot);}
	else if (command === `up`) {bot.commands.get(`up`).execute(message);}
	else if (command === `stats`) {bot.commands.get(`stats`).execute(message, bot, amountGuilds, amountUsers, botver);}


	//argument test
	else if (command === `args`) {
		if (!args.length) {
			return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
		} else if (args[0] === `play`) {
			return message.channel.send(`played :ok_hand:`);
			}
			message.channel.send(`First argument: ${args[0]}`);
	}
	//eof
});
