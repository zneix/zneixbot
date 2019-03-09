module.exports = {
    name: `ping`,
    description: `anwsers with \`pong\``,
    async execute(message, bot) {
        const m = await message.channel.send("Pong?");
        m.edit(`**Opóźnienie:** ${m.createdTimestamp - message.createdTimestamp}ms. \n**Opóźnienie API:** ${Math.round(bot.ping)}ms`);
    },
};