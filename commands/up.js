module.exports = {
    name: `up`,
    description: `dev command; checks if I'm online`,
    execute(message) {
        message.channel.send(`I'm Online`);
        console.log(`[devreq]I'm online`);
    },
};