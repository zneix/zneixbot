module.exports = {
    name: `ping`,
    description: `anwsers with \`pong\``,
    execute(message) {
        message.channel.send(`pong`);
    },
};