module.exports = {
    name: 'stats',
    description: `provides bunch of info about the bot-user`,
    execute(message, amountGuilds, amountUsers, config) {
        // const amountGuilds = bot.guilds.size;
        // const amountUsers = bot.users.size;
        message.channel.send(
            `I'm currently helping in ${amountGuilds} Servers`
            +` and working with ${amountUsers} Users`
            +` :slight_smile:`
            +`\nZneixbot by zneix#4433, version: ${config.botver}`
            );
    },
};