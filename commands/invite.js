module.exports = {
    name: `invite`,
    description: `invite zneixbot to your server!`,
    execute(message, bot) {
        message.channel.send(`${message.author} Here's my invite link - thanks for using me and have fun ;v\nhttps://discordapp.com/api/oauth2/authorize?client_id=${bot.user.id}&permissions=8&scope=bot`);
    },
};